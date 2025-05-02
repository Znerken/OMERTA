import { createClient } from '@supabase/supabase-js';

// Use service role key for admin operations
const supabaseUrl = 'https://rlxqnqvqxvqjjqjjqjjq.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJseHFucXZxeHZxampxampxampxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcwOTUyNDkwMCwiZXhwIjoyMDI1MTAwOTAwfQ.KZL3RH3RH3RH3RH3RH3RH3RH3RH3RH3RH3RH3RH3';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function makeAdmin() {
  const userId = 'e796f2c8-eb9d-41f3-a4b8-856be6adaab4';

  const { data, error } = await supabase
    .from('profiles')
    .update({ is_admin: true })
    .eq('id', userId)
    .select();

  if (error) {
    console.error('Error updating admin status:', error);
    process.exit(1);
  }

  console.log('Successfully updated admin status:', data);
}

makeAdmin(); 