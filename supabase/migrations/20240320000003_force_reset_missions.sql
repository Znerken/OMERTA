-- First, delete all existing missions
DELETE FROM missions;

-- Then reinsert the initial missions
INSERT INTO missions (
  title,
  description,
  category,
  type,
  difficulty,
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
  requirements,
  reward,
  success_chance,
  special_events
) VALUES 
(
  'Street Brawl',
  'Show your strength in a street fight. Take control of the neighborhood.',
  'combat',
  'combat',
  'Easy',
  'Available',
  'Downtown',
  'fist',
  30,
  5,
  2,
  'Low',
  0,
  NULL,
  true,
  3600,
  jsonb_build_object(
    'level', 1,
    'stats', jsonb_build_object(
      'strength', 5,
      'endurance', 3
    )
  ),
  jsonb_build_object(
    'money', 500,
    'experience', 50,
    'streetCred', 5,
    'statBonuses', jsonb_build_object(
      'strength', 1
    )
  ),
  jsonb_build_object(
    'base', 70,
    'attribute', 'strength',
    'bonusPerAttribute', 2
  ),
  NULL
),
(
  'Warehouse Raid',
  'A rival gang is storing valuable goods in a warehouse. Take what''s yours.',
  'combat',
  'combat',
  'Medium',
  'Available',
  'Industrial District',
  'warehouse',
  60,
  10,
  5,
  'Medium',
  2,
  NULL,
  true,
  7200,
  jsonb_build_object(
    'level', 3,
    'stats', jsonb_build_object(
      'strength', 8,
      'dexterity', 6,
      'endurance', 5
    )
  ),
  jsonb_build_object(
    'money', 2500,
    'experience', 100,
    'streetCred', 25,
    'statBonuses', jsonb_build_object(
      'strength', 2,
      'dexterity', 1
    )
  ),
  jsonb_build_object(
    'base', 60,
    'attribute', 'dexterity',
    'bonusPerAttribute', 3,
    'crewBonus', 5
  ),
  NULL
); 