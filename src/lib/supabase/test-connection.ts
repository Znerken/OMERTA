'use server';

import { createBrowserClient } from './client';

export async function testSupabaseConnection() {
  try {
    console.log('Testing Supabase connection...');
    const supabase = createBrowserClient();
    
    // Test 1: Check if we can get the current session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    console.log('Session test:', session ? 'Success' : 'No active session');
    if (sessionError) console.error('Session error:', sessionError);

    // Test 2: Try to access the characters table
    console.log('\nTesting database access...');
    const { data: characters, error: tableError } = await supabase
      .from('characters')
      .select('*')
      .limit(1);
    console.log('Table access test:', characters ? 'Success' : 'Failed');
    if (tableError) console.error('Table access error:', tableError);

    return {
      success: !sessionError && !tableError,
      session: session,
      characters: characters,
      errors: {
        session: sessionError,
        table: tableError
      }
    };
  } catch (error) {
    console.error('Connection test error:', error);
    return {
      success: false,
      session: null,
      characters: null,
      errors: {
        connection: error instanceof Error ? error.message : 'Unknown error'
      }
    };
  }
}