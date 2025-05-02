-- Add new columns to bank_accounts table
ALTER TABLE bank_accounts
    ADD COLUMN IF NOT EXISTS max_balance INTEGER,
    ADD COLUMN IF NOT EXISTS daily_withdrawal_limit INTEGER;

-- Update constraints
ALTER TABLE bank_accounts
    DROP CONSTRAINT IF EXISTS valid_account_type,
    DROP CONSTRAINT IF EXISTS valid_balance,
    ADD CONSTRAINT valid_account_type 
        CHECK (account_type IN ('checking', 'savings', 'business', 'offshore')),
    ADD CONSTRAINT valid_balance 
        CHECK (
            (max_balance IS NULL AND balance >= 0) OR 
            (max_balance IS NOT NULL AND balance BETWEEN 0 AND max_balance)
        ),
    ADD CONSTRAINT valid_withdrawal_limit 
        CHECK (
            daily_withdrawal_limit IS NULL OR 
            daily_withdrawal_limit > 0
        );

-- Update existing accounts with appropriate limits
DO $$
BEGIN
    -- Set limits for checking accounts
    UPDATE bank_accounts
    SET max_balance = 1000000,
        daily_withdrawal_limit = 10000
    WHERE account_type = 'checking';

    -- Set limits for savings accounts
    UPDATE bank_accounts
    SET max_balance = 5000000,
        daily_withdrawal_limit = 25000
    WHERE account_type = 'savings';

    -- Set limits for business accounts
    UPDATE bank_accounts
    SET max_balance = 10000000,
        daily_withdrawal_limit = 50000
    WHERE account_type = 'business';

    -- Set limits for offshore accounts (NULL means no limit)
    UPDATE bank_accounts
    SET max_balance = NULL,
        daily_withdrawal_limit = NULL
    WHERE account_type = 'offshore';
END $$; 