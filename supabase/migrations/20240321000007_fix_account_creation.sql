-- Create the generate_account_number function if it doesn't exist
CREATE OR REPLACE FUNCTION generate_account_number()
RETURNS VARCHAR(20) AS $$
DECLARE
    new_account_number VARCHAR(20);
BEGIN
    LOOP
        -- Generate a random account number with 'ACC' prefix and 10 digits
        new_account_number := 'ACC' || LPAD(FLOOR(RANDOM() * 10000000000)::TEXT, 10, '0');
        -- Check if it's unique
        EXIT WHEN NOT EXISTS (
            SELECT 1 FROM bank_accounts 
            WHERE account_number = new_account_number
        );
    END LOOP;
    RETURN new_account_number;
END;
$$ LANGUAGE plpgsql;

-- Add RLS policies for account creation
DROP POLICY IF EXISTS "Users can create bank accounts" ON bank_accounts;
CREATE POLICY "Users can create bank accounts"
    ON bank_accounts
    FOR INSERT
    WITH CHECK (
        character_id IN (
            SELECT id FROM characters 
            WHERE user_id = auth.uid()
        )
    );

-- Add RLS policies for transaction creation
DROP POLICY IF EXISTS "Users can create transactions" ON bank_transactions;
CREATE POLICY "Users can create transactions"
    ON bank_transactions
    FOR INSERT
    WITH CHECK (
        account_id IN (
            SELECT id FROM bank_accounts 
            WHERE character_id IN (
                SELECT id FROM characters 
                WHERE user_id = auth.uid()
            )
        )
    );

-- Grant necessary permissions to authenticated users
GRANT EXECUTE ON FUNCTION open_bank_account TO authenticated;
GRANT EXECUTE ON FUNCTION generate_account_number TO authenticated; 