-- Drop existing tables and functions
DROP TABLE IF EXISTS bank_transfers CASCADE;
DROP TABLE IF EXISTS bank_transactions CASCADE;
DROP TABLE IF EXISTS bank_accounts CASCADE;
DROP FUNCTION IF EXISTS process_transaction CASCADE;
DROP FUNCTION IF EXISTS process_bank_transfer CASCADE;
DROP FUNCTION IF EXISTS process_user_transfer CASCADE;
DROP FUNCTION IF EXISTS open_bank_account CASCADE;
DROP FUNCTION IF EXISTS update_daily_limits CASCADE;
DROP FUNCTION IF EXISTS calculate_interest CASCADE;

-- Create bank_accounts table
CREATE TABLE bank_accounts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    character_id UUID NOT NULL REFERENCES characters(id) ON DELETE CASCADE,
    account_number VARCHAR(20) NOT NULL UNIQUE DEFAULT generate_account_number(),
    account_type VARCHAR(20) NOT NULL,
    balance INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT true,
    interest_rate DECIMAL(5,2) NOT NULL DEFAULT 0.00,
    max_balance INTEGER,
    daily_withdrawal_limit INTEGER,
    daily_withdrawal_used INTEGER NOT NULL DEFAULT 0,
    last_withdrawal_reset TIMESTAMPTZ DEFAULT NOW(),
    last_interest_payment TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    -- Constraints
    CONSTRAINT valid_account_type CHECK (account_type IN ('checking', 'savings', 'business', 'offshore')),
    CONSTRAINT valid_balance CHECK (
        (max_balance IS NULL AND balance >= 0) OR 
        (max_balance IS NOT NULL AND balance BETWEEN 0 AND max_balance)
    ),
    CONSTRAINT valid_interest_rate CHECK (interest_rate BETWEEN 0 AND 100),
    CONSTRAINT valid_withdrawal_limit CHECK (
        daily_withdrawal_limit IS NULL OR 
        daily_withdrawal_limit > 0
    ),
    CONSTRAINT valid_daily_withdrawal CHECK (
        daily_withdrawal_used >= 0 AND
        (daily_withdrawal_limit IS NULL OR daily_withdrawal_used <= daily_withdrawal_limit)
    )
);

-- Create bank_transactions table
CREATE TABLE bank_transactions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    account_id UUID NOT NULL REFERENCES bank_accounts(id) ON DELETE CASCADE,
    transaction_type VARCHAR(20) NOT NULL,
    amount INTEGER NOT NULL,
    balance_after INTEGER NOT NULL,
    description TEXT,
    reference_number VARCHAR(50),
    status VARCHAR(20) NOT NULL DEFAULT 'pending',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    completed_at TIMESTAMPTZ,

    -- Constraints
    CONSTRAINT valid_transaction_type CHECK (
        transaction_type IN ('deposit', 'withdraw', 'transfer', 'interest', 'fee')
    ),
    CONSTRAINT valid_amount CHECK (amount > 0),
    CONSTRAINT valid_status CHECK (
        status IN ('pending', 'completed', 'failed', 'reversed')
    )
);

-- Create bank_transfers table
CREATE TABLE bank_transfers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    from_account_id UUID NOT NULL REFERENCES bank_accounts(id) ON DELETE CASCADE,
    to_account_id UUID NOT NULL REFERENCES bank_accounts(id) ON DELETE CASCADE,
    amount INTEGER NOT NULL,
    description TEXT,
    status VARCHAR(20) NOT NULL DEFAULT 'pending',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    completed_at TIMESTAMPTZ,

    -- Constraints
    CONSTRAINT valid_transfer_amount CHECK (amount > 0),
    CONSTRAINT valid_transfer_status CHECK (
        status IN ('pending', 'completed', 'failed', 'reversed')
    ),
    CONSTRAINT different_accounts CHECK (from_account_id != to_account_id)
);

-- Function to process transactions
CREATE OR REPLACE FUNCTION process_transaction(
    p_account_id UUID,
    p_amount INTEGER,
    p_type VARCHAR,
    p_character_id UUID
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_account bank_accounts%ROWTYPE;
    v_character characters%ROWTYPE;
    v_transaction_id UUID;
    v_new_balance INTEGER;
BEGIN
    -- Get account and character
    SELECT * INTO v_account
    FROM bank_accounts
    WHERE id = p_account_id AND is_active = true
    FOR UPDATE;

    SELECT * INTO v_character
    FROM characters
    WHERE id = p_character_id
    FOR UPDATE;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Account or character not found';
    END IF;

    -- Check if it's the account owner
    IF v_account.character_id != p_character_id THEN
        RAISE EXCEPTION 'Not authorized to perform this transaction';
    END IF;

    -- Reset daily withdrawal limit if needed
    IF v_account.last_withdrawal_reset < CURRENT_DATE THEN
        UPDATE bank_accounts
        SET daily_withdrawal_used = 0,
            last_withdrawal_reset = NOW()
        WHERE id = p_account_id;
        
        v_account.daily_withdrawal_used = 0;
    END IF;

    -- Process based on transaction type
    CASE p_type
        WHEN 'deposit' THEN
            -- Check character has enough money
            IF v_character.money < p_amount THEN
                RAISE EXCEPTION 'Insufficient character funds';
            END IF;

            -- Check max balance
            IF v_account.max_balance IS NOT NULL AND 
               v_account.balance + p_amount > v_account.max_balance THEN
                RAISE EXCEPTION 'Would exceed maximum balance';
            END IF;

            v_new_balance := v_account.balance + p_amount;

            -- Update character money
            UPDATE characters
            SET money = money - p_amount
            WHERE id = p_character_id;

        WHEN 'withdraw' THEN
            -- Check account has enough money
            IF v_account.balance < p_amount THEN
                RAISE EXCEPTION 'Insufficient funds';
            END IF;

            -- Check daily withdrawal limit
            IF v_account.daily_withdrawal_limit IS NOT NULL AND
               v_account.daily_withdrawal_used + p_amount > v_account.daily_withdrawal_limit THEN
                RAISE EXCEPTION 'Would exceed daily withdrawal limit';
            END IF;

            v_new_balance := v_account.balance - p_amount;

            -- Update character money
            UPDATE characters
            SET money = money + p_amount
            WHERE id = p_character_id;

            -- Update daily withdrawal used
            UPDATE bank_accounts
            SET daily_withdrawal_used = daily_withdrawal_used + p_amount
            WHERE id = p_account_id;

        ELSE
            RAISE EXCEPTION 'Invalid transaction type';
    END CASE;

    -- Update account balance
    UPDATE bank_accounts
    SET balance = v_new_balance,
        updated_at = NOW()
    WHERE id = p_account_id;

    -- Create transaction record
    INSERT INTO bank_transactions (
        account_id,
        transaction_type,
        amount,
        balance_after,
        status,
        completed_at
    ) VALUES (
        p_account_id,
        p_type,
        p_amount,
        v_new_balance,
        'completed',
        NOW()
    )
    RETURNING id INTO v_transaction_id;

    RETURN jsonb_build_object(
        'success', true,
        'transaction_id', v_transaction_id,
        'new_balance', v_new_balance
    );
EXCEPTION
    WHEN OTHERS THEN
        RETURN jsonb_build_object(
            'success', false,
            'error', SQLERRM
        );
END;
$$;

-- Function to process bank transfers
CREATE OR REPLACE FUNCTION process_bank_transfer(
    p_from_account_id UUID,
    p_to_account_id UUID,
    p_amount INTEGER
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_from_account bank_accounts%ROWTYPE;
    v_to_account bank_accounts%ROWTYPE;
    v_transfer_id UUID;
    v_from_new_balance INTEGER;
    v_to_new_balance INTEGER;
BEGIN
    -- Get accounts
    SELECT * INTO v_from_account
    FROM bank_accounts
    WHERE id = p_from_account_id AND is_active = true
    FOR UPDATE;

    SELECT * INTO v_to_account
    FROM bank_accounts
    WHERE id = p_to_account_id AND is_active = true
    FOR UPDATE;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'One or both accounts not found or inactive';
    END IF;

    -- Check sufficient funds
    IF v_from_account.balance < p_amount THEN
        RAISE EXCEPTION 'Insufficient funds';
    END IF;

    -- Check max balance of receiving account
    IF v_to_account.max_balance IS NOT NULL AND 
       v_to_account.balance + p_amount > v_to_account.max_balance THEN
        RAISE EXCEPTION 'Would exceed recipient maximum balance';
    END IF;

    -- Calculate new balances
    v_from_new_balance := v_from_account.balance - p_amount;
    v_to_new_balance := v_to_account.balance + p_amount;

    -- Update account balances
    UPDATE bank_accounts
    SET balance = v_from_new_balance,
        updated_at = NOW()
    WHERE id = p_from_account_id;

    UPDATE bank_accounts
    SET balance = v_to_new_balance,
        updated_at = NOW()
    WHERE id = p_to_account_id;

    -- Create transfer record
    INSERT INTO bank_transfers (
        from_account_id,
        to_account_id,
        amount,
        status,
        completed_at
    ) VALUES (
        p_from_account_id,
        p_to_account_id,
        p_amount,
        'completed',
        NOW()
    )
    RETURNING id INTO v_transfer_id;

    -- Create transaction records
    INSERT INTO bank_transactions (
        account_id,
        transaction_type,
        amount,
        balance_after,
        reference_number,
        status,
        completed_at
    ) VALUES
    (p_from_account_id, 'transfer', p_amount, v_from_new_balance, v_transfer_id::text, 'completed', NOW()),
    (p_to_account_id, 'transfer', p_amount, v_to_new_balance, v_transfer_id::text, 'completed', NOW());

    RETURN jsonb_build_object(
        'success', true,
        'transfer_id', v_transfer_id,
        'from_balance', v_from_new_balance,
        'to_balance', v_to_new_balance
    );
EXCEPTION
    WHEN OTHERS THEN
        RETURN jsonb_build_object(
            'success', false,
            'error', SQLERRM
        );
END;
$$;

-- Function to open a new bank account
CREATE OR REPLACE FUNCTION open_bank_account(
    p_character_id UUID,
    p_account_type VARCHAR,
    p_initial_deposit INTEGER
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_character_money INTEGER;
    v_account_id UUID;
    v_interest_rate DECIMAL(5,2);
    v_max_balance INTEGER;
    v_daily_withdrawal_limit INTEGER;
BEGIN
    -- Check if character exists and has enough money
    SELECT money INTO v_character_money
    FROM characters
    WHERE id = p_character_id
    FOR UPDATE;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Character not found';
    END IF;

    IF v_character_money < p_initial_deposit THEN
        RAISE EXCEPTION 'Insufficient funds';
    END IF;

    -- Set account parameters based on type
    CASE p_account_type
        WHEN 'checking' THEN
            v_interest_rate := 0.00;
            v_max_balance := 1000000;
            v_daily_withdrawal_limit := 10000;
        WHEN 'savings' THEN
            v_interest_rate := 0.50;
            v_max_balance := 5000000;
            v_daily_withdrawal_limit := 25000;
        WHEN 'business' THEN
            v_interest_rate := 0.25;
            v_max_balance := 10000000;
            v_daily_withdrawal_limit := 50000;
        WHEN 'offshore' THEN
            v_interest_rate := 1.00;
            v_max_balance := NULL;
            v_daily_withdrawal_limit := NULL;
        ELSE
            RAISE EXCEPTION 'Invalid account type';
    END CASE;

    -- Create new account
    INSERT INTO bank_accounts (
        character_id,
        account_type,
        balance,
        interest_rate,
        max_balance,
        daily_withdrawal_limit,
        is_active
    ) VALUES (
        p_character_id,
        p_account_type,
        p_initial_deposit,
        v_interest_rate,
        v_max_balance,
        v_daily_withdrawal_limit,
        true
    )
    RETURNING id INTO v_account_id;

    -- Deduct money from character
    UPDATE characters
    SET money = money - p_initial_deposit
    WHERE id = p_character_id;

    -- Create initial deposit transaction
    INSERT INTO bank_transactions (
        account_id,
        transaction_type,
        amount,
        balance_after,
        description,
        status,
        completed_at
    ) VALUES (
        v_account_id,
        'deposit',
        p_initial_deposit,
        p_initial_deposit,
        'Initial deposit',
        'completed',
        NOW()
    );

    RETURN jsonb_build_object(
        'success', true,
        'account_id', v_account_id,
        'message', 'Account created successfully'
    );
EXCEPTION
    WHEN OTHERS THEN
        RETURN jsonb_build_object(
            'success', false,
            'error', SQLERRM
        );
END;
$$;

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_bank_accounts_character_id ON bank_accounts(character_id);
CREATE INDEX IF NOT EXISTS idx_bank_accounts_account_number ON bank_accounts(account_number);
CREATE INDEX IF NOT EXISTS idx_bank_transactions_account_id ON bank_transactions(account_id);
CREATE INDEX IF NOT EXISTS idx_bank_transactions_created_at ON bank_transactions(created_at);
CREATE INDEX IF NOT EXISTS idx_bank_transfers_from_account_id ON bank_transfers(from_account_id);
CREATE INDEX IF NOT EXISTS idx_bank_transfers_to_account_id ON bank_transfers(to_account_id);
CREATE INDEX IF NOT EXISTS idx_bank_transfers_created_at ON bank_transfers(created_at);

-- Enable Row Level Security
ALTER TABLE bank_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE bank_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE bank_transfers ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies
CREATE POLICY "Users can view their own bank accounts"
    ON bank_accounts FOR SELECT
    USING (character_id IN (
        SELECT id FROM characters WHERE user_id = auth.uid()
    ));

CREATE POLICY "Users can view their own transactions"
    ON bank_transactions FOR SELECT
    USING (account_id IN (
        SELECT id FROM bank_accounts 
        WHERE character_id IN (
            SELECT id FROM characters WHERE user_id = auth.uid()
        )
    ));

CREATE POLICY "Users can view their own transfers"
    ON bank_transfers FOR SELECT
    USING (
        from_account_id IN (
            SELECT id FROM bank_accounts 
            WHERE character_id IN (
                SELECT id FROM characters WHERE user_id = auth.uid()
            )
        ) OR
        to_account_id IN (
            SELECT id FROM bank_accounts 
            WHERE character_id IN (
                SELECT id FROM characters WHERE user_id = auth.uid()
            )
        )
    ); 