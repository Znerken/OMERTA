-- Create enum types
CREATE TYPE training_type AS ENUM ('exercise', 'study', 'practice');
CREATE TYPE training_status AS ENUM ('not_started', 'in_progress', 'completed', 'failed');

-- Create training_methods table
CREATE TABLE IF NOT EXISTS public.training_methods (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    attribute TEXT NOT NULL,
    base_gain INTEGER NOT NULL,
    duration INTEGER NOT NULL,
    energy_cost INTEGER NOT NULL,
    money_cost INTEGER NOT NULL,
    required_level INTEGER NOT NULL DEFAULT 1,
    type training_type NOT NULL,
    icon TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create training_sessions table
CREATE TABLE IF NOT EXISTS public.training_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    character_id UUID NOT NULL REFERENCES characters(id),
    method_id UUID NOT NULL REFERENCES training_methods(id),
    status training_status NOT NULL DEFAULT 'not_started',
    started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    completed_at TIMESTAMPTZ,
    actual_gain INTEGER,
    energy_spent INTEGER NOT NULL DEFAULT 0,
    money_spent INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create training_mastery table
CREATE TABLE IF NOT EXISTS public.training_mastery (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    character_id UUID NOT NULL REFERENCES characters(id),
    method_id UUID NOT NULL REFERENCES training_methods(id),
    mastery_level INTEGER NOT NULL DEFAULT 0,
    total_sessions INTEGER NOT NULL DEFAULT 0,
    total_gains INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(character_id, method_id)
);

-- Add RLS policies
ALTER TABLE public.training_methods ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.training_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.training_mastery ENABLE ROW LEVEL SECURITY;

-- Policy for training_methods (viewable by all authenticated users)
CREATE POLICY "View training methods" ON public.training_methods
    FOR SELECT TO authenticated USING (true);

-- Policies for training_sessions
CREATE POLICY "View own training sessions" ON public.training_sessions
    FOR SELECT TO authenticated
    USING (character_id IN (
        SELECT id FROM characters WHERE user_id = auth.uid()
    ));

CREATE POLICY "Insert own training sessions" ON public.training_sessions
    FOR INSERT TO authenticated
    WITH CHECK (character_id IN (
        SELECT id FROM characters WHERE user_id = auth.uid()
    ));

CREATE POLICY "Update own training sessions" ON public.training_sessions
    FOR UPDATE TO authenticated
    USING (character_id IN (
        SELECT id FROM characters WHERE user_id = auth.uid()
    ));

-- Policies for training_mastery
CREATE POLICY "View own training mastery" ON public.training_mastery
    FOR SELECT TO authenticated
    USING (character_id IN (
        SELECT id FROM characters WHERE user_id = auth.uid()
    ));

CREATE POLICY "Insert own training mastery" ON public.training_mastery
    FOR INSERT TO authenticated
    WITH CHECK (character_id IN (
        SELECT id FROM characters WHERE user_id = auth.uid()
    ));

CREATE POLICY "Update own training mastery" ON public.training_mastery
    FOR UPDATE TO authenticated
    USING (character_id IN (
        SELECT id FROM characters WHERE user_id = auth.uid()
    ));

-- Create function to start training
CREATE OR REPLACE FUNCTION start_training(
    p_character_id UUID,
    p_method_id UUID
) RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_character characters;
    v_method training_methods;
    v_active_session training_sessions;
    v_result JSONB;
BEGIN
    -- Get character
    SELECT * INTO v_character
    FROM characters
    WHERE id = p_character_id;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Character not found';
    END IF;

    -- Get training method
    SELECT * INTO v_method
    FROM training_methods
    WHERE id = p_method_id;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Training method not found';
    END IF;

    -- Check if character meets requirements
    IF v_character.level < v_method.required_level THEN
        RAISE EXCEPTION 'Character does not meet level requirement';
    END IF;

    -- Check if character has enough energy and money
    IF v_character.current_energy < v_method.energy_cost THEN
        RAISE EXCEPTION 'Not enough energy';
    END IF;

    IF v_character.money < v_method.money_cost THEN
        RAISE EXCEPTION 'Not enough money';
    END IF;

    -- Check for active session
    SELECT * INTO v_active_session
    FROM training_sessions
    WHERE character_id = p_character_id
    AND status = 'in_progress';

    IF FOUND THEN
        RAISE EXCEPTION 'Character already has an active training session';
    END IF;

    -- Start transaction
    BEGIN
        -- Deduct costs
        UPDATE characters
        SET 
            current_energy = current_energy - v_method.energy_cost,
            money = money - v_method.money_cost,
            updated_at = NOW()
        WHERE id = p_character_id;

        -- Create training session
        INSERT INTO training_sessions (
            character_id,
            method_id,
            status,
            energy_spent,
            money_spent
        ) VALUES (
            p_character_id,
            p_method_id,
            'in_progress',
            v_method.energy_cost,
            v_method.money_cost
        );

        -- Prepare result
        v_result = jsonb_build_object(
            'success', true,
            'message', 'Training started successfully'
        );

        RETURN v_result;
    EXCEPTION
        WHEN OTHERS THEN
            RAISE EXCEPTION 'Failed to start training: %', SQLERRM;
    END;
END;
$$;

-- Create function to complete training
CREATE OR REPLACE FUNCTION complete_training(
    p_session_id UUID
) RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_session training_sessions;
    v_method training_methods;
    v_mastery training_mastery;
    v_gain INTEGER;
    v_result JSONB;
BEGIN
    -- Get session
    SELECT * INTO v_session
    FROM training_sessions
    WHERE id = p_session_id;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Training session not found';
    END IF;

    IF v_session.status != 'in_progress' THEN
        RAISE EXCEPTION 'Training session is not in progress';
    END IF;

    -- Get method
    SELECT * INTO v_method
    FROM training_methods
    WHERE id = v_session.method_id;

    -- Calculate gain with mastery bonus
    SELECT * INTO v_mastery
    FROM training_mastery
    WHERE character_id = v_session.character_id
    AND method_id = v_session.method_id;

    IF NOT FOUND THEN
        INSERT INTO training_mastery (
            character_id,
            method_id,
            mastery_level,
            total_sessions,
            total_gains
        ) VALUES (
            v_session.character_id,
            v_session.method_id,
            0,
            0,
            0
        )
        RETURNING * INTO v_mastery;
    END IF;

    -- Calculate gain with mastery bonus (5% per level)
    v_gain = v_method.base_gain * (1 + (v_mastery.mastery_level * 0.05));

    -- Start transaction
    BEGIN
        -- Update character stats
        UPDATE characters
        SET 
            stats = jsonb_set(
                stats,
                array[v_method.attribute],
                (COALESCE((stats->>v_method.attribute)::int, 0) + v_gain)::text::jsonb
            ),
            updated_at = NOW()
        WHERE id = v_session.character_id;

        -- Update session
        UPDATE training_sessions
        SET 
            status = 'completed',
            completed_at = NOW(),
            actual_gain = v_gain,
            updated_at = NOW()
        WHERE id = p_session_id;

        -- Update mastery
        UPDATE training_mastery
        SET 
            mastery_level = CASE 
                WHEN total_sessions + 1 >= (mastery_level + 1) * 10 THEN mastery_level + 1
                ELSE mastery_level
            END,
            total_sessions = total_sessions + 1,
            total_gains = total_gains + v_gain,
            updated_at = NOW()
        WHERE character_id = v_session.character_id
        AND method_id = v_session.method_id;

        -- Prepare result
        v_result = jsonb_build_object(
            'success', true,
            'message', 'Training completed successfully',
            'gain', v_gain
        );

        RETURN v_result;
    EXCEPTION
        WHEN OTHERS THEN
            RAISE EXCEPTION 'Failed to complete training: %', SQLERRM;
    END;
END;
$$;

-- Add updated_at triggers
CREATE TRIGGER set_timestamp_training_methods
    BEFORE UPDATE ON training_methods
    FOR EACH ROW
    EXECUTE FUNCTION moddatetime (updated_at);

CREATE TRIGGER set_timestamp_training_sessions
    BEFORE UPDATE ON training_sessions
    FOR EACH ROW
    EXECUTE FUNCTION moddatetime (updated_at);

CREATE TRIGGER set_timestamp_training_mastery
    BEFORE UPDATE ON training_mastery
    FOR EACH ROW
    EXECUTE FUNCTION moddatetime (updated_at);

-- Grant access to authenticated users
GRANT SELECT ON training_methods TO authenticated;
GRANT SELECT, INSERT, UPDATE ON training_sessions TO authenticated;
GRANT SELECT, INSERT, UPDATE ON training_mastery TO authenticated; 