-- Create crypto_currencies table
CREATE TABLE IF NOT EXISTS public.crypto_currencies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    symbol TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    description TEXT,
    current_price DECIMAL(20, 8) NOT NULL,
    market_cap BIGINT,
    volume_24h BIGINT,
    price_change_24h DECIMAL(10, 2),
    price_history JSONB DEFAULT '[]',
    icon TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create crypto_wallets table
CREATE TABLE IF NOT EXISTS public.crypto_wallets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    character_id UUID NOT NULL REFERENCES characters(id),
    holdings JSONB DEFAULT '{}',
    total_profit_loss DECIMAL(20, 8) DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create crypto_transactions table
CREATE TABLE IF NOT EXISTS public.crypto_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    wallet_id UUID NOT NULL REFERENCES crypto_wallets(id),
    crypto_id UUID NOT NULL REFERENCES crypto_currencies(id),
    type TEXT NOT NULL CHECK (type IN ('buy', 'sell')),
    amount DECIMAL(20, 8) NOT NULL,
    price_at_transaction DECIMAL(20, 8) NOT NULL,
    total_value DECIMAL(20, 8) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create crypto_events table
CREATE TABLE IF NOT EXISTS public.crypto_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('positive', 'negative', 'neutral')),
    impact_currencies UUID[] NOT NULL,
    impact_percentage DECIMAL(10, 2) NOT NULL,
    triggered BOOLEAN DEFAULT false,
    trigger_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Add RLS policies
ALTER TABLE public.crypto_currencies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crypto_wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crypto_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crypto_events ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "View crypto currencies" ON public.crypto_currencies;
DROP POLICY IF EXISTS "View own crypto wallet" ON public.crypto_wallets;
DROP POLICY IF EXISTS "Insert own crypto wallet" ON public.crypto_wallets;
DROP POLICY IF EXISTS "Update own crypto wallet" ON public.crypto_wallets;
DROP POLICY IF EXISTS "View own transactions" ON public.crypto_transactions;
DROP POLICY IF EXISTS "Insert own transactions" ON public.crypto_transactions;

-- Policies for crypto_currencies (viewable by all authenticated users)
CREATE POLICY "View crypto currencies" ON public.crypto_currencies
    FOR SELECT TO authenticated USING (true);

-- Policies for crypto_wallets
CREATE POLICY "View own crypto wallet" ON public.crypto_wallets
    FOR SELECT TO authenticated
    USING (character_id IN (
        SELECT DISTINCT id FROM characters WHERE user_id = auth.uid()
    ));

CREATE POLICY "Insert own crypto wallet" ON public.crypto_wallets
    FOR INSERT TO authenticated
    WITH CHECK (character_id IN (
        SELECT DISTINCT id FROM characters WHERE user_id = auth.uid()
    ));

CREATE POLICY "Update own crypto wallet" ON public.crypto_wallets
    FOR UPDATE TO authenticated
    USING (character_id IN (
        SELECT DISTINCT id FROM characters WHERE user_id = auth.uid()
    ));

-- Policies for crypto_transactions
CREATE POLICY "View own transactions" ON public.crypto_transactions
    FOR SELECT TO authenticated
    USING (wallet_id IN (
        SELECT DISTINCT cw.id 
        FROM crypto_wallets cw
        JOIN characters c ON c.id = cw.character_id
        WHERE c.user_id = auth.uid()
    ));

CREATE POLICY "Insert own transactions" ON public.crypto_transactions
    FOR INSERT TO authenticated
    WITH CHECK (wallet_id IN (
        SELECT DISTINCT cw.id 
        FROM crypto_wallets cw
        JOIN characters c ON c.id = cw.character_id
        WHERE c.user_id = auth.uid()
    ));

-- Add updated_at triggers
CREATE TRIGGER set_timestamp_crypto_currencies
    BEFORE UPDATE ON crypto_currencies
    FOR EACH ROW
    EXECUTE FUNCTION moddatetime (updated_at);

CREATE TRIGGER set_timestamp_crypto_wallets
    BEFORE UPDATE ON crypto_wallets
    FOR EACH ROW
    EXECUTE FUNCTION moddatetime (updated_at);

CREATE TRIGGER set_timestamp_crypto_events
    BEFORE UPDATE ON crypto_events
    FOR EACH ROW
    EXECUTE FUNCTION moddatetime (updated_at);

-- Grant access to authenticated users
GRANT SELECT ON crypto_currencies TO authenticated;
GRANT SELECT, INSERT, UPDATE ON crypto_wallets TO authenticated;
GRANT SELECT, INSERT ON crypto_transactions TO authenticated;
GRANT SELECT ON crypto_events TO authenticated;

-- Function to create a crypto wallet for a character
CREATE OR REPLACE FUNCTION create_crypto_wallet(p_character_id UUID)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_wallet_id UUID;
BEGIN
    INSERT INTO crypto_wallets (character_id)
    VALUES (p_character_id)
    RETURNING id INTO v_wallet_id;
    
    RETURN v_wallet_id;
END;
$$;

-- Function to process a crypto transaction
CREATE OR REPLACE FUNCTION process_crypto_transaction(
    p_wallet_id UUID,
    p_crypto_id UUID,
    p_type TEXT,
    p_amount DECIMAL,
    p_price DECIMAL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_wallet crypto_wallets%ROWTYPE;
    v_character characters%ROWTYPE;
    v_total_value DECIMAL;
    v_current_holdings DECIMAL;
    v_result JSONB;
BEGIN
    -- Get wallet
    SELECT * INTO v_wallet
    FROM crypto_wallets w
    WHERE w.id = p_wallet_id;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Wallet not found';
    END IF;

    -- Get character
    SELECT * INTO v_character
    FROM characters c
    WHERE c.id = v_wallet.character_id;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Character not found';
    END IF;

    -- Calculate total value
    v_total_value := p_amount * p_price;

    -- Get current holdings
    v_current_holdings := COALESCE((v_wallet.holdings->p_crypto_id::text)::decimal, 0);

    IF p_type = 'buy' THEN
        -- Check if character has enough money
        IF v_character.money < v_total_value THEN
            RAISE EXCEPTION 'Insufficient funds';
        END IF;

        -- Update character money
        UPDATE characters
        SET money = money - v_total_value
        WHERE id = v_character.id;

        -- Update wallet holdings
        UPDATE crypto_wallets
        SET holdings = jsonb_set(
            COALESCE(holdings, '{}'::jsonb),
            array[p_crypto_id::text],
            ((v_current_holdings + p_amount)::text)::jsonb
        )
        WHERE id = p_wallet_id;

    ELSIF p_type = 'sell' THEN
        -- Check if wallet has enough crypto
        IF v_current_holdings < p_amount THEN
            RAISE EXCEPTION 'Insufficient crypto holdings';
        END IF;

        -- Update character money
        UPDATE characters
        SET money = money + v_total_value
        WHERE id = v_character.id;

        -- Update wallet holdings
        UPDATE crypto_wallets
        SET holdings = jsonb_set(
            holdings,
            array[p_crypto_id::text],
            ((v_current_holdings - p_amount)::text)::jsonb
        )
        WHERE id = p_wallet_id;
    END IF;

    -- Record transaction
    INSERT INTO crypto_transactions (
        wallet_id,
        crypto_id,
        type,
        amount,
        price_at_transaction,
        total_value
    ) VALUES (
        p_wallet_id,
        p_crypto_id,
        p_type,
        p_amount,
        p_price,
        v_total_value
    );

    -- Prepare result
    v_result = jsonb_build_object(
        'success', true,
        'message', p_type || ' transaction completed successfully',
        'amount', p_amount,
        'total_value', v_total_value
    );

    RETURN v_result;
END;
$$; 