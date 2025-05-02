'use client';

import { CharacterProvider } from "@/contexts/CharacterContext";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CharacterProvider>
      <div>
        <main className="pt-16">
          {children}
        </main>
      </div>
    </CharacterProvider>
  );
}