'use client';

import { ThemeProvider } from 'next-themes';
import { AuthProvider } from '@/contexts/AuthContext';
import { Toaster } from 'sonner';
import type { ReactNode } from 'react';
import { CharacterProvider } from '@/contexts/CharacterContext';
import { GameProvider } from '@/contexts/GameContext';
import { PhoneProvider } from '@/components/phone/PhoneProvider';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider 
      attribute="class"
      defaultTheme="dark"
      enableSystem={false}
      disableTransitionOnChange
      storageKey="omerta-theme"
    >
      <AuthProvider>
        <CharacterProvider>
          <GameProvider>
            <PhoneProvider>
              {children}
            </PhoneProvider>
            <Toaster 
              theme="dark" 
              position="top-right"
              closeButton
              richColors
            />
          </GameProvider>
        </CharacterProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}