'use client';

import { useRouter } from 'next/navigation';
import { useAuthContext } from '@/contexts/AuthContext';

export function useAuth() {
  const auth = useAuthContext();
  const router = useRouter();

  return {
    ...auth,
    // Extend with navigation helpers
    signInAndRedirect: async (email: string, password: string) => {
      await auth.signIn(email, password);
      router.push('/dashboard');
    },
    signUpAndRedirect: async (email: string, password: string) => {
      await auth.signUp(email, password);
      router.push('/dashboard');
    },
    signOutAndRedirect: async () => {
      await auth.signOut();
      router.push('/login');
    }
  };
}