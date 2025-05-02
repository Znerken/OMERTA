-- Drop existing constraint
ALTER TABLE bank_transactions 
    DROP CONSTRAINT IF EXISTS valid_transaction_type;

-- Add new constraint with correct transaction types
ALTER TABLE bank_transactions 
    ADD CONSTRAINT valid_transaction_type 
    CHECK (transaction_type IN ('deposit', 'withdraw', 'transfer', 'interest', 'fee')); 