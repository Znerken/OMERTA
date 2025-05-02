import { Inter, Playfair_Display } from 'next/font/google';
import { Providers } from './providers';
import './globals.css';
import { cn } from '@/lib/utils';
import type { Metadata } from 'next'
import { AnimatedBackground } from '@/components/AnimatedBackground';
import { PhoneProvider } from '@/components/phone/PhoneProvider';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair' });

export const metadata: Metadata = {
  title: 'Omerta - Mafia RPG',
  description: 'A browser-based mafia RPG game',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn(
        "min-h-screen font-sans antialiased relative",
        inter.variable,
        playfair.variable
      )}>
        <AnimatedBackground />
        <PhoneProvider>
          <div className="relative z-10">
            <Providers>
              {children}
            </Providers>
          </div>
        </PhoneProvider>
      </body>
    </html>
  );
} 