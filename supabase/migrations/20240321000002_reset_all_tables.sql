-- Drop all existing tables and related objects
DO $$ 
BEGIN
    -- Drop bank-related tables if they exist
    DROP TABLE IF EXISTS bank_transfers CASCADE;
    DROP TABLE IF EXISTS bank_transactions CASCADE;
    DROP TABLE IF EXISTS bank_accounts CASCADE;
    
    -- Drop characters table if it exists
    DROP TABLE IF EXISTS characters CASCADE;
    
    -- Drop any other related tables
    DROP TABLE IF EXISTS missions CASCADE;
    DROP TABLE IF EXISTS character_missions CASCADE;
    DROP TABLE IF EXISTS inventory CASCADE;
    DROP TABLE IF EXISTS items CASCADE;
    DROP TABLE IF EXISTS skills CASCADE;
    DROP TABLE IF EXISTS character_skills CASCADE;
    
    -- Drop any existing functions
    DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;
    DROP FUNCTION IF EXISTS generate_account_number() CASCADE;
END $$;

-- Create the update_updated_at_column function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create the generate_account_number function
CREATE OR REPLACE FUNCTION generate_account_number()
RETURNS VARCHAR(20) AS $$
DECLARE
    new_account_number VARCHAR(20);
BEGIN
    LOOP
        new_account_number := 'ACC' || LPAD(FLOOR(RANDOM() * 1000000)::TEXT, 6, '0');
        EXIT WHEN NOT EXISTS (SELECT 1 FROM bank_accounts WHERE account_number = new_account_number);
    END LOOP;
    RETURN new_account_number;
END;
$$ LANGUAGE plpgsql;

-- Create characters table
CREATE TABLE characters (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name VARCHAR(50) NOT NULL,
    origin VARCHAR(50) NOT NULL,
    class VARCHAR(50) NOT NULL,
    traits VARCHAR(50)[] NOT NULL DEFAULT '{}',
    
    -- Core Stats
    strength INTEGER NOT NULL DEFAULT 1,
    agility INTEGER NOT NULL DEFAULT 1,
    intelligence INTEGER NOT NULL DEFAULT 1,
    charisma INTEGER NOT NULL DEFAULT 1,
    endurance INTEGER NOT NULL DEFAULT 1,
    luck INTEGER NOT NULL DEFAULT 1,
    
    -- Game Stats
    level INTEGER NOT NULL DEFAULT 1,
    experience INTEGER NOT NULL DEFAULT 0,
    experience_to_next_level INTEGER NOT NULL DEFAULT 1000,
    energy INTEGER NOT NULL DEFAULT 100,
    max_energy INTEGER NOT NULL DEFAULT 100,
    nerve INTEGER NOT NULL DEFAULT 100,
    max_nerve INTEGER NOT NULL DEFAULT 100,
    health INTEGER NOT NULL DEFAULT 100,
    max_health INTEGER NOT NULL DEFAULT 100,
    stamina INTEGER NOT NULL DEFAULT 100,
    max_stamina INTEGER NOT NULL DEFAULT 100,
    
    -- Combat Stats
    attack_power INTEGER NOT NULL DEFAULT 10,
    defense_power INTEGER NOT NULL DEFAULT 10,
    critical_chance INTEGER NOT NULL DEFAULT 5,
    critical_damage INTEGER NOT NULL DEFAULT 150,
    dodge_chance INTEGER NOT NULL DEFAULT 5,
    
    -- Reputation
    street_cred INTEGER NOT NULL DEFAULT 0,
    heat_level INTEGER NOT NULL DEFAULT 0,
    family_honor INTEGER NOT NULL DEFAULT 0,
    public_image INTEGER NOT NULL DEFAULT 0,
    
    -- Resources
    money INTEGER NOT NULL DEFAULT 1000,
    inventory_slots INTEGER NOT NULL DEFAULT 20,
    used_inventory_slots INTEGER NOT NULL DEFAULT 0,
    
    -- Status
    is_alive BOOLEAN NOT NULL DEFAULT true,
    is_incapacitated BOOLEAN NOT NULL DEFAULT false,
    status_effects JSONB NOT NULL DEFAULT '[]',
    last_rested_at TIMESTAMPTZ,
    last_healed_at TIMESTAMPTZ,
    
    -- Location
    current_location VARCHAR(50) NOT NULL DEFAULT 'little_italy',
    last_location VARCHAR(50),
    
    -- Skills
    skills JSONB NOT NULL DEFAULT '{}',
    skill_points INTEGER NOT NULL DEFAULT 0,
    
    -- Achievements
    achievements JSONB NOT NULL DEFAULT '[]',
    total_play_time INTEGER NOT NULL DEFAULT 0,
    
    -- Timestamps
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    last_active_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    -- Constraints
    CONSTRAINT valid_origin CHECK (origin IN ('little_italy', 'the_docks', 'downtown', 'the_outskirts')),
    CONSTRAINT valid_class CHECK (class IN ('enforcer', 'consigliere', 'racketeer', 'shadow', 'street_boss')),
    CONSTRAINT valid_stats CHECK (
        strength BETWEEN 1 AND 100 AND
        agility BETWEEN 1 AND 100 AND
        intelligence BETWEEN 1 AND 100 AND
        charisma BETWEEN 1 AND 100 AND
        endurance BETWEEN 1 AND 100 AND
        luck BETWEEN 1 AND 100
    ),
    CONSTRAINT valid_level CHECK (level BETWEEN 1 AND 100),
    CONSTRAINT valid_experience CHECK (experience >= 0),
    CONSTRAINT valid_experience_to_next_level CHECK (experience_to_next_level > 0),
    CONSTRAINT valid_energy CHECK (energy BETWEEN 0 AND max_energy),
    CONSTRAINT valid_max_energy CHECK (max_energy BETWEEN 100 AND 1000),
    CONSTRAINT valid_nerve CHECK (nerve BETWEEN 0 AND max_nerve),
    CONSTRAINT valid_max_nerve CHECK (max_nerve BETWEEN 100 AND 1000),
    CONSTRAINT valid_health CHECK (health BETWEEN 0 AND max_health),
    CONSTRAINT valid_max_health CHECK (max_health BETWEEN 100 AND 1000),
    CONSTRAINT valid_stamina CHECK (stamina BETWEEN 0 AND max_stamina),
    CONSTRAINT valid_max_stamina CHECK (max_stamina BETWEEN 100 AND 1000),
    CONSTRAINT valid_combat_stats CHECK (
        attack_power >= 0 AND
        defense_power >= 0 AND
        critical_chance BETWEEN 0 AND 100 AND
        critical_damage >= 100 AND
        dodge_chance BETWEEN 0 AND 100
    ),
    CONSTRAINT valid_street_cred CHECK (street_cred BETWEEN 0 AND 100),
    CONSTRAINT valid_heat_level CHECK (heat_level BETWEEN 0 AND 100),
    CONSTRAINT valid_family_honor CHECK (family_honor BETWEEN 0 AND 100),
    CONSTRAINT valid_public_image CHECK (public_image BETWEEN 0 AND 100),
    CONSTRAINT valid_money CHECK (money >= 0),
    CONSTRAINT valid_inventory CHECK (
        inventory_slots > 0 AND
        used_inventory_slots >= 0 AND
        used_inventory_slots <= inventory_slots
    ),
    CONSTRAINT valid_location CHECK (current_location IN ('little_italy', 'the_docks', 'downtown', 'the_outskirts')),
    CONSTRAINT valid_skill_points CHECK (skill_points >= 0)
);

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
    last_interest_payment TIMESTAMPTZ,
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
    )
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

-- Create bank_transfers table
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
ALTER TABLE characters ENABLE ROW LEVEL SECURITY;
ALTER TABLE bank_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE bank_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE bank_transfers ENABLE ROW LEVEL SECURITY;

-- Create policies for characters
CREATE POLICY "Users can view their own characters"
    ON characters FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own characters"
    ON characters FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own characters"
    ON characters FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

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

-- Create triggers
CREATE TRIGGER set_characters_updated_at
    BEFORE UPDATE ON characters
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER set_bank_accounts_updated_at
    BEFORE UPDATE ON bank_accounts
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create indexes
CREATE INDEX idx_characters_user_id ON characters(user_id);
CREATE INDEX idx_characters_name ON characters(name);
CREATE INDEX idx_bank_accounts_character_id ON bank_accounts(character_id);
CREATE INDEX idx_bank_accounts_account_number ON bank_accounts(account_number);
CREATE INDEX idx_bank_transactions_account_id ON bank_transactions(account_id);
CREATE INDEX idx_bank_transfers_from_account_id ON bank_transfers(from_account_id);
CREATE INDEX idx_bank_transfers_to_account_id ON bank_transfers(to_account_id);
CREATE INDEX idx_bank_transactions_created_at ON bank_transactions(created_at);
CREATE INDEX idx_bank_transfers_created_at ON bank_transfers(created_at); 