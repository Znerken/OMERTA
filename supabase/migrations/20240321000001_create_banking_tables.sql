-- Create bank_accounts table
CREATE TABLE bank_accounts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    character_id UUID NOT NULL REFERENCES characters(id) ON DELETE CASCADE,
    account_number VARCHAR(20) NOT NULL UNIQUE,
    account_type VARCHAR(20) NOT NULL,
    balance INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT true,
    interest_rate DECIMAL(5,2) NOT NULL DEFAULT 0.00,
    last_interest_payment TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    -- Constraints
    CONSTRAINT valid_account_type CHECK (account_type IN ('checking', 'savings', 'business')),
    CONSTRAINT valid_balance CHECK (balance >= 0),
    CONSTRAINT valid_interest_rate CHECK (interest_rate BETWEEN 0 AND 100)
);

-- Create bank_transactions table
CREATE TABLE bank_transactions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    account_id UUID NOT NULL REFERENCES bank_accounts(id) ON DELETE CASCADE,
    transaction_type VARCHAR(20) NOT NULL,
    amount INTEGER NOT NULL,
    description TEXT,
    reference_number VARCHAR(50),
    status VARCHAR(20) NOT NULL DEFAULT 'pending',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    -- Constraints
    CONSTRAINT valid_transaction_type CHECK (transaction_type IN ('deposit', 'withdrawal', 'transfer', 'interest')),
    CONSTRAINT valid_amount CHECK (amount > 0),
    CONSTRAINT valid_status CHECK (status IN ('pending', 'completed', 'failed', 'reversed'))
);

-- Create bank_transfers table for tracking transfers between accounts
CREATE TABLE bank_transfers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    from_account_id UUID NOT NULL REFERENCES bank_accounts(id) ON DELETE CASCADE,
    to_account_id UUID NOT NULL REFERENCES bank_accounts(id) ON DELETE CASCADE,
    amount INTEGER NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'pending',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    completed_at TIMESTAMPTZ,

    -- Constraints
    CONSTRAINT valid_amount CHECK (amount > 0),
    CONSTRAINT valid_status CHECK (status IN ('pending', 'completed', 'failed', 'reversed')),
    CONSTRAINT different_accounts CHECK (from_account_id != to_account_id)
);

-- Set up Row Level Security (RLS)
ALTER TABLE bank_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE bank_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE bank_transfers ENABLE ROW LEVEL SECURITY;

-- Create policies for bank_accounts
CREATE POLICY "Users can view their own bank accounts"
    ON bank_accounts FOR SELECT
    USING (
        character_id IN (
            SELECT id FROM characters 
            WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can create bank accounts for their characters"
    ON bank_accounts FOR INSERT
    WITH CHECK (
        character_id IN (
            SELECT id FROM characters 
            WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update their own bank accounts"
    ON bank_accounts FOR UPDATE
    USING (
        character_id IN (
            SELECT id FROM characters 
            WHERE user_id = auth.uid()
        )
    )
    WITH CHECK (
        character_id IN (
            SELECT id FROM characters 
            WHERE user_id = auth.uid()
        )
    );

-- Create policies for bank_transactions
CREATE POLICY "Users can view their own transactions"
    ON bank_transactions FOR SELECT
    USING (
        account_id IN (
            SELECT id FROM bank_accounts 
            WHERE character_id IN (
                SELECT id FROM characters 
                WHERE user_id = auth.uid()
            )
        )
    );

CREATE POLICY "Users can create transactions for their accounts"
    ON bank_transactions FOR INSERT
    WITH CHECK (
        account_id IN (
            SELECT id FROM bank_accounts 
            WHERE character_id IN (
                SELECT id FROM characters 
                WHERE user_id = auth.uid()
            )
        )
    );

-- Create policies for bank_transfers
CREATE POLICY "Users can view their own transfers"
    ON bank_transfers FOR SELECT
    USING (
        from_account_id IN (
            SELECT id FROM bank_accounts 
            WHERE character_id IN (
                SELECT id FROM characters 
                WHERE user_id = auth.uid()
            )
        ) OR
        to_account_id IN (
            SELECT id FROM bank_accounts 
            WHERE character_id IN (
                SELECT id FROM characters 
                WHERE user_id = auth.uid()
            )
        )
    );

CREATE POLICY "Users can create transfers from their accounts"
    ON bank_transfers FOR INSERT
    WITH CHECK (
        from_account_id IN (
            SELECT id FROM bank_accounts 
            WHERE character_id IN (
                SELECT id FROM characters 
                WHERE user_id = auth.uid()
            )
        )
    );

-- Create updated_at triggers
CREATE TRIGGER set_bank_accounts_updated_at
    BEFORE UPDATE ON bank_accounts
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_bank_accounts_character_id ON bank_accounts(character_id);
CREATE INDEX idx_bank_transactions_account_id ON bank_transactions(account_id);
CREATE INDEX idx_bank_transfers_from_account_id ON bank_transfers(from_account_id);
CREATE INDEX idx_bank_transfers_to_account_id ON bank_transfers(to_account_id);
CREATE INDEX idx_bank_transactions_created_at ON bank_transactions(created_at);
CREATE INDEX idx_bank_transfers_created_at ON bank_transfers(created_at); 