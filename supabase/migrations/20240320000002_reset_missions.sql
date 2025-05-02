-- Reset all missions to available status
UPDATE missions
SET 
  status = 'Available',
  progress = NULL,
  completed_at = NULL,
  collected = false;

-- Delete any user-specific mission states
DELETE FROM mission_progress; 