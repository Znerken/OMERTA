-- First, let's check if the user exists
SELECT id, email 
FROM auth.users 
WHERE email = 'tsettt';

-- Then, let's check if there's a character for this user
SELECT c.id, c.user_id, c.money, u.email
FROM characters c
JOIN auth.users u ON c.user_id = u.id
WHERE u.email = 'tsettt';

-- Now let's update with explicit error checking
DO $$
DECLARE
    v_user_id uuid;
    v_character_id uuid;
BEGIN
    -- Get the user ID
    SELECT id INTO v_user_id
    FROM auth.users
    WHERE email = 'tsettt';

    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'User with email tsettt not found';
    END IF;

    -- Get the character ID
    SELECT id INTO v_character_id
    FROM characters
    WHERE user_id = v_user_id;

    IF v_character_id IS NULL THEN
        RAISE EXCEPTION 'No character found for this user';
    END IF;

    -- Update the money
    UPDATE characters
    SET 
        money = money + 100000,
        updated_at = NOW()
    WHERE id = v_character_id;

    RAISE NOTICE 'Money updated successfully for character %', v_character_id;
END $$;

-- Verify the update
SELECT c.id, c.money, u.email
FROM characters c
JOIN auth.users u ON c.user_id = u.id
WHERE u.email = 'tsettt';

-- Let's see what data we have
SELECT id, email, raw_user_meta_data
FROM auth.users;

-- Then update based on what we find
UPDATE characters
SET money = 10000
WHERE id = '1a6797ff-c9c0-4de6-82ff-0b60021145c5';

-- Verify the update
SELECT c.*, u.email, u.raw_user_meta_data
FROM characters c
JOIN auth.users u ON c.user_id = u.id; 