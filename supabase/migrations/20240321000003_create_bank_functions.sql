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
    WHERE id = p_character_id;

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
        description,
        status
    ) VALUES (
        v_account_id,
        'deposit',
        p_initial_deposit,
        'Initial deposit',
        'completed'
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