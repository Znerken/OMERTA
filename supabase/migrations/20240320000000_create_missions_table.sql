-- Create missions table
CREATE TABLE IF NOT EXISTS public.missions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    category TEXT NOT NULL,
    difficulty TEXT NOT NULL CHECK (difficulty IN ('Easy', 'Medium', 'Hard', 'Elite')),
    type TEXT NOT NULL CHECK (type IN ('combat', 'stealth', 'diplomacy', 'intelligence', 'business', 'territory')),
    status TEXT NOT NULL CHECK (status IN ('Available', 'In Progress', 'Completed', 'Failed', 'Pending')),
    location TEXT NOT NULL,
    icon TEXT NOT NULL,
    duration INTEGER NOT NULL,
    energy_cost INTEGER NOT NULL,
    nerve_cost INTEGER NOT NULL,
    risk_level TEXT NOT NULL CHECK (risk_level IN ('Low', 'Medium', 'High')),
    required_crew INTEGER,
    territory TEXT,
    repeatable BOOLEAN DEFAULT false,
    repeat_interval INTEGER,
    faction TEXT,
    reputation_gain INTEGER,
    
    -- JSON fields for complex data
    reward JSONB NOT NULL,
    requirements JSONB NOT NULL,
    success_chance JSONB NOT NULL,
    special_events JSONB,
    progress JSONB,
    cooldown JSONB,
    last_attempt JSONB,
    business_impact JSONB,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create indexes
CREATE INDEX IF NOT EXISTS missions_status_idx ON public.missions (status);
CREATE INDEX IF NOT EXISTS missions_type_idx ON public.missions (type);
CREATE INDEX IF NOT EXISTS missions_difficulty_idx ON public.missions (difficulty);
CREATE INDEX IF NOT EXISTS missions_territory_idx ON public.missions (territory);

-- Enable Row Level Security
ALTER TABLE public.missions ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Enable read access for authenticated users" ON public.missions
    FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Enable insert for authenticated users" ON public.missions
    FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "Enable update for authenticated users" ON public.missions
    FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
CREATE TRIGGER missions_updated_at
    BEFORE UPDATE ON public.missions
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at(); 