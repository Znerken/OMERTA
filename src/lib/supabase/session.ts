'use server';

import { createBrowserClient } from './client';

export async function checkSession() {
  try {
    const supabase = createBrowserClient();
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error) throw error;
    
    if (!session) {
      return { 
        isAuthenticated: false, 
        user: null, 
        error: null 
      };
    }

    return {
      isAuthenticated: true,
      user: session.user,
      error: null
    };
  } catch (error) {
    console.error('Session check error:', error);
    return {
      isAuthenticated: false,
      user: null,
      error: error instanceof Error ? error.message : 'Failed to check session'
    };
  }
}

export async function refreshSession() {
  try {
    const supabase = createBrowserClient();
    const { data: { session }, error } = await supabase.auth.refreshSession();
    
    if (error) throw error;
    
    return { 
      success: true, 
      session, 
      error: null 
    };
  } catch (error) {
    console.error('Session refresh error:', error);
    return {
      success: false,
      session: null,
      error: error instanceof Error ? error.message : 'Failed to refresh session'
    };
  }
}