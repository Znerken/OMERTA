-- Create enum types first
CREATE TYPE mission_difficulty AS ENUM ('Easy', 'Medium', 'Hard', 'Elite');
CREATE TYPE mission_type AS ENUM ('combat', 'stealth', 'diplomacy', 'intelligence', 'business', 'territory');
CREATE TYPE mission_status AS ENUM ('Available', 'In Progress', 'Completed', 'Failed', 'Pending');
CREATE TYPE risk_level AS ENUM ('Low', 'Medium', 'High');

-- Create the missions table
CREATE TABLE IF NOT EXISTS public.missions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    category TEXT NOT NULL,
    difficulty mission_difficulty NOT NULL,
    reward JSONB NOT NULL,
    requirements JSONB NOT NULL,
    duration INTEGER NOT NULL,
    energy_cost INTEGER NOT NULL,
    nerve_cost INTEGER NOT NULL,
    success_chance JSONB NOT NULL,
    special_events JSONB,
    icon TEXT,
    location TEXT NOT NULL,
    type mission_type NOT NULL,
    status mission_status NOT NULL DEFAULT 'Available',
    progress JSONB,
    cooldown JSONB,
    risk_level risk_level NOT NULL,
    required_crew INTEGER,
    territory UUID REFERENCES territories(id),
    last_attempt JSONB,
    repeatable BOOLEAN DEFAULT false,
    repeat_interval INTEGER,
    faction TEXT,
    reputation_gain INTEGER,
    business_impact JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Add RLS policies
ALTER TABLE public.missions ENABLE ROW LEVEL SECURITY;

-- Policy to allow all authenticated users to view available missions
CREATE POLICY "View available missions" ON public.missions
    FOR SELECT
    TO authenticated
    USING (status = 'Available');

-- Policy to allow users to view their in-progress missions
CREATE POLICY "View in-progress missions" ON public.missions
    FOR SELECT
    TO authenticated
    USING (status = 'In Progress');

-- Policy to allow users to view their completed missions
CREATE POLICY "View completed missions" ON public.missions
    FOR SELECT
    TO authenticated
    USING (status = 'Completed' OR status = 'Failed');

-- Add updated_at trigger
CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON public.missions
    FOR EACH ROW
    EXECUTE FUNCTION moddatetime (updated_at);

-- Create index for common queries
CREATE INDEX missions_status_idx ON public.missions(status);
CREATE INDEX missions_type_idx ON public.missions(type);
CREATE INDEX missions_territory_idx ON public.missions(territory);

-- Grant access to authenticated users
GRANT SELECT ON public.missions TO authenticated; 