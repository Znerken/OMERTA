-- Insert initial missions
INSERT INTO public.missions (
    title,
    description,
    category,
    difficulty,
    type,
    status,
    location,
    icon,
    duration,
    energy_cost,
    nerve_cost,
    risk_level,
    required_crew,
    territory,
    repeatable,
    repeat_interval,
    reward,
    requirements,
    success_chance,
    special_events
) VALUES
-- Combat Missions
(
    'Street Brawl',
    'A rival gang has been causing trouble in your territory. Teach them a lesson they won''t forget.',
    'Combat',
    'Easy',
    'combat',
    'Available',
    'Downtown',
    'fist',
    300,
    20,
    15,
    'Medium',
    1,
    'downtown',
    true,
    3600,
    '{
        "money": 1000,
        "experience": 50,
        "streetCred": 10,
        "statBonuses": {
            "strength": 1,
            "endurance": 1
        }
    }'::jsonb,
    '{
        "level": 1,
        "stats": {
            "strength": 5,
            "endurance": 5
        }
    }'::jsonb,
    '{
        "base": 70,
        "bonusPerAttribute": 2,
        "attribute": "strength",
        "territoryBonus": 5,
        "crewBonus": 3
    }'::jsonb,
    '[
        {
            "name": "Backup Arrives",
            "description": "Your crew shows up to help",
            "effect": "Increases success chance by 20%",
            "chance": 30,
            "rewards": {
                "money": 500,
                "experience": 25
            }
        }
    ]'::jsonb
),
(
    'Warehouse Raid',
    'A rival gang is storing valuable goods in a warehouse. Take what''s yours.',
    'Combat',
    'Medium',
    'combat',
    'Available',
    'Industrial District',
    'warehouse',
    600,
    35,
    25,
    'High',
    2,
    'industrial',
    true,
    7200,
    '{
        "money": 2500,
        "experience": 100,
        "streetCred": 25,
        "items": [
            {
                "id": "weapon_1",
                "name": "Basic Pistol",
                "type": "weapon",
                "rarity": "common",
                "stats": {
                    "damage": 5,
                    "accuracy": 3
                }
            }
        ]
    }'::jsonb,
    '{
        "level": 3,
        "stats": {
            "strength": 8,
            "endurance": 8,
            "dexterity": 6
        }
    }'::jsonb,
    '{
        "base": 60,
        "bonusPerAttribute": 2,
        "attribute": "strength",
        "territoryBonus": 5,
        "crewBonus": 3,
        "equipmentBonus": 2
    }'::jsonb,
    '[
        {
            "name": "Security System",
            "description": "The warehouse has a security system",
            "effect": "Decreases success chance by 15%",
            "chance": 40,
            "penalties": {
                "health": 10
            }
        }
    ]'::jsonb
),
-- Stealth Missions
(
    'Data Theft',
    'Infiltrate a corporate office and steal valuable information.',
    'Stealth',
    'Medium',
    'stealth',
    'Available',
    'Business District',
    'file',
    450,
    30,
    20,
    'Medium',
    1,
    'business',
    true,
    5400,
    '{
        "money": 2000,
        "experience": 80,
        "streetCred": 15,
        "statBonuses": {
            "dexterity": 1,
            "intelligence": 1
        }
    }'::jsonb,
    '{
        "level": 2,
        "stats": {
            "dexterity": 7,
            "intelligence": 6
        }
    }'::jsonb,
    '{
        "base": 65,
        "bonusPerAttribute": 2,
        "attribute": "dexterity",
        "territoryBonus": 5,
        "crewBonus": 3
    }'::jsonb,
    '[
        {
            "name": "Security Guard",
            "description": "A security guard is patrolling",
            "effect": "Increases difficulty",
            "chance": 50,
            "penalties": {
                "nerve": 5
            }
        }
    ]'::jsonb
),
-- Business Missions
(
    'Protection Racket',
    'Convince local businesses to pay for your protection.',
    'Business',
    'Easy',
    'business',
    'Available',
    'Commercial District',
    'briefcase',
    300,
    15,
    10,
    'Low',
    1,
    'commercial',
    true,
    3600,
    '{
        "money": 1500,
        "experience": 40,
        "streetCred": 5,
        "businessIncome": 200,
        "statBonuses": {
            "charisma": 1
        }
    }'::jsonb,
    '{
        "level": 1,
        "stats": {
            "charisma": 5,
            "intelligence": 4
        }
    }'::jsonb,
    '{
        "base": 75,
        "bonusPerAttribute": 2,
        "attribute": "charisma",
        "territoryBonus": 5,
        "crewBonus": 3
    }'::jsonb,
    '[
        {
            "name": "Business Owner Resistant",
            "description": "The business owner is resistant to your offer",
            "effect": "Decreases success chance by 10%",
            "chance": 30,
            "penalties": {
                "money": 200
            }
        }
    ]'::jsonb
),
-- Territory Missions
(
    'Territory Expansion',
    'Expand your influence into a new neighborhood.',
    'Territory',
    'Hard',
    'territory',
    'Available',
    'Residential District',
    'map',
    900,
    50,
    40,
    'High',
    3,
    'residential',
    false,
    null,
    '{
        "money": 5000,
        "experience": 200,
        "streetCred": 50,
        "territoryInfluence": 10,
        "statBonuses": {
            "leadership": 2,
            "charisma": 1
        }
    }'::jsonb,
    '{
        "level": 5,
        "stats": {
            "leadership": 10,
            "charisma": 8,
            "intelligence": 8
        },
        "crewSize": 3
    }'::jsonb,
    '{
        "base": 50,
        "bonusPerAttribute": 2,
        "attribute": "leadership",
        "territoryBonus": 5,
        "crewBonus": 3
    }'::jsonb,
    '[
        {
            "name": "Rival Gang Interference",
            "description": "A rival gang tries to stop your expansion",
            "effect": "Decreases success chance by 20%",
            "chance": 40,
            "penalties": {
                "health": 15,
                "money": 1000
            }
        }
    ]'::jsonb
),
-- Diplomacy Missions
(
    'Gang Alliance',
    'Negotiate an alliance with a smaller gang.',
    'Diplomacy',
    'Medium',
    'diplomacy',
    'Available',
    'Various',
    'handshake',
    600,
    30,
    25,
    'Medium',
    2,
    null,
    false,
    null,
    '{
        "money": 3000,
        "experience": 120,
        "streetCred": 30,
        "statBonuses": {
            "charisma": 2,
            "intelligence": 1
        }
    }'::jsonb,
    '{
        "level": 4,
        "stats": {
            "charisma": 9,
            "intelligence": 8,
            "leadership": 7
        },
        "crewSize": 2
    }'::jsonb,
    '{
        "base": 60,
        "bonusPerAttribute": 2,
        "attribute": "charisma",
        "territoryBonus": 5,
        "crewBonus": 3
    }'::jsonb,
    '[
        {
            "name": "Betrayal",
            "description": "The gang tries to betray you",
            "effect": "Decreases success chance by 25%",
            "chance": 20,
            "penalties": {
                "health": 20,
                "money": 1500
            }
        }
    ]'::jsonb
),
-- Intelligence Missions
(
    'Information Gathering',
    'Gather intel on a rival gang''s operations.',
    'Intelligence',
    'Hard',
    'intelligence',
    'Available',
    'Various',
    'spy',
    750,
    40,
    35,
    'High',
    2,
    null,
    true,
    10800,
    '{
        "money": 4000,
        "experience": 150,
        "streetCred": 40,
        "statBonuses": {
            "intelligence": 2,
            "perception": 1
        }
    }'::jsonb,
    '{
        "level": 5,
        "stats": {
            "intelligence": 10,
            "perception": 9,
            "dexterity": 8
        },
        "crewSize": 2
    }'::jsonb,
    '{
        "base": 55,
        "bonusPerAttribute": 2,
        "attribute": "intelligence",
        "territoryBonus": 5,
        "crewBonus": 3
    }'::jsonb,
    '[
        {
            "name": "Counter-Intelligence",
            "description": "The rival gang is aware of your surveillance",
            "effect": "Decreases success chance by 15%",
            "chance": 30,
            "penalties": {
                "health": 10,
                "money": 1000
            }
        }
    ]'::jsonb
); 