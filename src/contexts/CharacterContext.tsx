'use client';

import { createContext, useContext, useState } from 'react';
import { supabase } from '../lib/supabase/client';
import { useAuth } from '../hooks/auth/useAuth';
import { Database } from '../lib/supabase/types';
import { toast } from 'react-hot-toast';

type Character = Database['public']['Tables']['characters']['Row'];

interface CharacterContextType {
  character: Character | null;
  loading: boolean;
  error: Error | null;
  refreshCharacter: () => Promise<void>;
  updateCharacter: (updates: Partial<Character>) => void;
  levelUp: () => void;
}

const CharacterContext = createContext<CharacterContextType | undefined>(undefined);

export function CharacterProvider({ children }: { children: React.ReactNode }) {
  const [character, setCharacter] = useState<Character | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { user } = useAuth();

  const fetchCharacter = async () => {
    if (!user) {
      setCharacter(null);
      setLoading(false);
      return;
    }

    try {
      console.log('Fetching character for user:', user.id);
      const { data: characters, error: characterError } = await supabase
        .from('characters')
        .select('*')
        .eq('user_id', user.id);

      if (characterError) {
        console.error('Supabase error:', characterError);
        throw new Error(`Database error: ${characterError.message}`);
      }

      if (!characters || characters.length === 0) {
        console.log('No character data found for user:', user.id);
        setCharacter(null);
      } else if (characters.length > 1) {
        console.warn('Multiple characters found for user:', user.id);
        // Use the most recently created character
        const mostRecentCharacter = characters.reduce((prev, current) => 
          new Date(prev.created_at) > new Date(current.created_at) ? prev : current
        );
        setCharacter(mostRecentCharacter);
      } else {
        console.log('Character data found:', characters[0]);
        setCharacter(characters[0]);
      }
    } catch (err) {
      console.error('Error in fetchCharacter:', err);
      setError(err instanceof Error ? err : new Error(`Failed to fetch character: ${err}`));
    } finally {
      setLoading(false);
    }
  };

  const updateCharacter = (updates: Partial<Character>) => {
    setCharacter(prev => {
      if (!prev) return null;
      return { ...prev, ...updates };
    });
  };

  const levelUp = () => {
    if (!character) return;

    const experienceNeeded = character.level * 1000;
    if (character.experience >= experienceNeeded) {
      updateCharacter({
        level: character.level + 1,
        experience: character.experience - experienceNeeded,
        health: Math.min(character.health + 10, 100),
        energy: Math.min(character.energy + 10, 100),
        nerve: Math.min(character.nerve + 10, 100),
        street_cred: character.street_cred + 10
      });
      toast.success('Level up! All stats increased.');
    }
  };

  const refreshCharacter = async () => {
    setLoading(true);
    await fetchCharacter();
  };

  return (
    <CharacterContext.Provider value={{ character, loading, error, refreshCharacter, updateCharacter, levelUp }}>
      {children}
    </CharacterContext.Provider>
  );
}

export function useCharacter() {
  const context = useContext(CharacterContext);
  if (context === undefined) {
    throw new Error('useCharacter must be used within a CharacterProvider');
  }
  return context;
}