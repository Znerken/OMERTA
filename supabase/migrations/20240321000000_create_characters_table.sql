-- Drop existing table and related objects if they exist
DROP TABLE IF EXISTS characters CASCADE;

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

-- Set up Row Level Security (RLS)
ALTER TABLE characters ENABLE ROW LEVEL SECURITY;

-- Create policies
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'characters' AND policyname = 'Users can view their own characters'
    ) THEN
        CREATE POLICY "Users can view their own characters"
            ON characters FOR SELECT
            USING (auth.uid() = user_id);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'characters' AND policyname = 'Users can create their own characters'
    ) THEN
        CREATE POLICY "Users can create their own characters"
            ON characters FOR INSERT
            WITH CHECK (auth.uid() = user_id);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'characters' AND policyname = 'Users can update their own characters'
    ) THEN
        CREATE POLICY "Users can update their own characters"
            ON characters FOR UPDATE
            USING (auth.uid() = user_id)
            WITH CHECK (auth.uid() = user_id);
    END IF;
END
$$;

-- Create updated_at trigger
DROP TRIGGER IF EXISTS set_characters_updated_at ON characters;
CREATE TRIGGER set_characters_updated_at
    BEFORE UPDATE ON characters
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column(); 