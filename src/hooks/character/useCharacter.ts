import { useState, useEffect, useCallback } from 'react';
import { Character } from '@/types/character';
import { supabase } from '@/lib/supabase/client';
import { useAuth } from '../auth/useAuth';

export function useCharacter() {
  const { user } = useAuth();
  const [character, setCharacter] = useState<Character | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCharacter = async () => {
    try {
      if (!user) {
        setCharacter(null);
        setLoading(false);
        return;
      }

      const { data, error: fetchError } = await supabase
        .from('characters')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (fetchError) {
        console.error('Error fetching character:', fetchError);
        setError(fetchError.message);
        setCharacter(null);
      } else {
        setCharacter(data);
        setError(null);
      }
    } catch (err) {
      console.error('Error fetching character:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch character');
      setCharacter(null);
    } finally {
      setLoading(false);
    }
  };

  // Function to update character state immediately
  const updateCharacterState = useCallback((newData: Partial<Character>) => {
    setCharacter(currentChar => {
      if (!currentChar) return null;
      
      // Create the updated character
      const updatedCharacter = {
        ...currentChar,
        ...newData
      };

      // Broadcast the update to other components
      window.dispatchEvent(new CustomEvent('character-update', { 
        detail: updatedCharacter 
      }));

      return updatedCharacter;
    });
  }, []);

  // Listen for character updates from other components
  useEffect(() => {
    const handleCharacterUpdate = (event: CustomEvent<Character>) => {
      setCharacter(event.detail);
    };

    window.addEventListener('character-update', handleCharacterUpdate as EventListener);

    return () => {
      window.removeEventListener('character-update', handleCharacterUpdate as EventListener);
    };
  }, []);

  useEffect(() => {
    if (user) {
      fetchCharacter();
    } else {
      setCharacter(null);
      setLoading(false);
    }
  }, [user]);

  return {
    character,
    loading,
    error,
    fetchCharacter,
    updateCharacterState
  };
}