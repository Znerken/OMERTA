-- Sample missions data
INSERT INTO public.missions (
    title,
    description,
    category,
    difficulty,
    reward,
    requirements,
    duration,
    energy_cost,
    nerve_cost,
    success_chance,
    icon,
    location,
    type,
    status,
    risk_level
) VALUES
(
    'Bank Heist',
    'Rob the local bank without getting caught. High risk, high reward mission that requires careful planning and execution.',
    'Robbery',
    'Hard',
    '{
        "money": 50000,
        "experience": 1000,
        "streetCred": 500,
        "items": [
            {
                "id": "vault_key",
                "name": "Vault Key",
                "type": "key",
                "rarity": "rare"
            }
        ]
    }',
    '{
        "level": 10,
        "stats": {
            "stealth": 50,
            "intelligence": 40
        },
        "crewSize": 3
    }',
    3600,
    50,
    30,
    '{
        "base": 40,
        "bonusPerAttribute": 0.5,
        "attribute": "stealth",
        "crewBonus": 0.2
    }',
    '🏦',
    'Downtown District',
    'stealth',
    'Available',
    'High'
),
(
    'Street Fight',
    'Prove your worth in a street brawl against rival gang members.',
    'Combat',
    'Easy',
    '{
        "money": 1000,
        "experience": 100,
        "streetCred": 50
    }',
    '{
        "level": 1,
        "stats": {
            "strength": 10,
            "stamina": 10
        }
    }',
    300,
    10,
    5,
    '{
        "base": 70,
        "bonusPerAttribute": 0.3,
        "attribute": "strength"
    }',
    '👊',
    'Back Alley',
    'combat',
    'Available',
    'Low'
),
(
    'Business Takeover',
    'Negotiate the acquisition of a local business through diplomacy or force.',
    'Business',
    'Medium',
    '{
        "money": 25000,
        "experience": 500,
        "streetCred": 200,
        "businessIncome": 1000
    }',
    '{
        "level": 5,
        "stats": {
            "charisma": 30,
            "intelligence": 20
        }
    }',
    1800,
    30,
    15,
    '{
        "base": 60,
        "bonusPerAttribute": 0.4,
        "attribute": "charisma"
    }',
    '💼',
    'Business District',
    'business',
    'Available',
    'Medium'
);

-- Insert sample training methods
INSERT INTO public.training_methods (
    name,
    description,
    attribute,
    base_gain,
    duration,
    energy_cost,
    money_cost,
    required_level,
    type,
    icon
) VALUES
(
    'Basic Workout',
    'A simple workout routine to build strength and endurance.',
    'strength',
    10,
    300,
    5,
    0,
    1,
    'exercise',
    '💪'
),
(
    'Street Fighting Practice',
    'Learn the basics of street fighting and self-defense.',
    'combat',
    15,
    600,
    10,
    100,
    1,
    'practice',
    '🥊'
),
(
    'Tactical Training',
    'Study advanced combat tactics and strategies.',
    'intelligence',
    20,
    900,
    15,
    500,
    5,
    'study',
    '🎯'
),
(
    'Stealth Operations',
    'Practice moving silently and staying undetected.',
    'stealth',
    25,
    1200,
    20,
    1000,
    10,
    'practice',
    '👥'
),
(
    'Business Management',
    'Study modern business practices and management techniques.',
    'business',
    30,
    1800,
    25,
    2000,
    15,
    'study',
    '💼'
),
(
    'Advanced Combat Training',
    'Intensive combat drills and weapon handling.',
    'combat',
    35,
    2400,
    30,
    5000,
    20,
    'practice',
    '⚔️'
),
(
    'Leadership Studies',
    'Learn how to lead and inspire others effectively.',
    'charisma',
    40,
    3000,
    35,
    10000,
    25,
    'study',
    '👑'
);

-- Insert sample crypto currencies
INSERT INTO crypto_currencies (
    symbol,
    name,
    description,
    current_price,
    market_cap,
    volume_24h,
    price_change_24h,
    icon
) VALUES
(
    'OMRT',
    'OmertaCoin',
    'The official cryptocurrency of the criminal underworld.',
    1000.00,
    1000000000,
    50000000,
    2.5,
    '💎'
),
(
    'BNDT',
    'BanditCoin',
    'Preferred currency for street-level operations.',
    100.00,
    500000000,
    25000000,
    -1.2,
    '🦹'
),
(
    'MFIA',
    'MafiaCoin',
    'The most trusted name in organized crime.',
    500.00,
    750000000,
    35000000,
    5.8,
    '🎭'
),
(
    'SHDY',
    'ShadowCoin',
    'For those who prefer to stay in the shadows.',
    250.00,
    250000000,
    15000000,
    -0.5,
    '👥'
),
(
    'UNDR',
    'UndergroundCoin',
    'The backbone of the black market economy.',
    750.00,
    850000000,
    45000000,
    3.2,
    '🌑'
);

-- Insert sample crypto events
INSERT INTO crypto_events (
    title,
    description,
    type,
    impact_currencies,
    impact_percentage,
    trigger_at
) VALUES
(
    'Major Security Breach',
    'A significant security vulnerability has been discovered in the SHDY network.',
    'negative',
    (SELECT ARRAY[id] FROM crypto_currencies WHERE symbol = 'SHDY'),
    -15.0,
    NOW() + INTERVAL '1 hour'
),
(
    'Strategic Partnership',
    'OMRT and MFIA announce a groundbreaking partnership.',
    'positive',
    (SELECT ARRAY[id] FROM crypto_currencies WHERE symbol IN ('OMRT', 'MFIA')),
    12.5,
    NOW() + INTERVAL '2 hours'
),
(
    'Regulatory Crackdown',
    'Authorities announce increased scrutiny of cryptocurrency transactions.',
    'negative',
    (SELECT ARRAY[id] FROM crypto_currencies),
    -8.0,
    NOW() + INTERVAL '3 hours'
),
(
    'Technical Innovation',
    'BNDT implements revolutionary new privacy features.',
    'positive',
    (SELECT ARRAY[id] FROM crypto_currencies WHERE symbol = 'BNDT'),
    20.0,
    NOW() + INTERVAL '4 hours'
),
(
    'Market Manipulation Investigation',
    'Allegations of price manipulation in the UNDR market surface.',
    'negative',
    (SELECT ARRAY[id] FROM crypto_currencies WHERE symbol = 'UNDR'),
    -10.0,
    NOW() + INTERVAL '5 hours'
); 