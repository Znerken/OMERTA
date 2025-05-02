import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useCharacterCreation } from './CharacterCreationContext';
import { CharacterCreation } from '@/types/character';
import { toast } from 'sonner';
import { useState } from 'react';

export function useCreateCharacter() {
  const router = useRouter();
  const supabase = createClientComponentClient();
  const { data: characterData } = useCharacterCreation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const createCharacter = async (data: Partial<CharacterCreation>) => {
    setLoading(true);
    setError(null);
    
    try {
      // Get the current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;
      if (!user) throw new Error('No user found');

      // Calculate initial stats based on class and traits
      const initialStats = calculateInitialStats(data);

      // Create the character
      const { data: character, error } = await supabase
        .from('characters')
        .insert({
          user_id: user.id,
          name: data.name,
          origin: data.origin,
          class: data.class,
          traits: data.traits,
          ...initialStats,
          level: 1,
          experience: 0,
          energy: 100,
          nerve: 100,
          health: 100,
          max_health: 100,
          stamina: 100,
          max_stamina: 100,
          street_cred: 0,
          heat_level: 0,
          family_honor: 0,
          public_image: 0,
          money: 1000 // Starting money
        })
        .select()
        .single();

      if (error) throw error;

      toast.success('Character created successfully!');
      router.push('/dashboard');
    } catch (err) {
      console.error('Error creating character:', err);
      setError(err as Error);
      toast.error('Failed to create character. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return { createCharacter, loading, error };
}

function calculateInitialStats(characterData: Partial<CharacterCreation>) {
  // Base stats
  const baseStats = {
    strength: 5,
    agility: 5,
    intelligence: 5,
    charisma: 5,
    endurance: 5,
    luck: 5
  };

  // Apply class bonuses
  const classBonuses = getClassBonuses(characterData.class);
  Object.entries(classBonuses).forEach(([stat, bonus]) => {
    baseStats[stat] += bonus;
  });

  // Apply trait bonuses
  characterData.traits?.forEach(trait => {
    const traitBonuses = getTraitBonuses(trait);
    Object.entries(traitBonuses).forEach(([stat, bonus]) => {
      baseStats[stat] += bonus;
    });
  });

  return baseStats;
}

function getClassBonuses(characterClass: CharacterCreation['class']) {
  const bonuses: Record<string, number> = {
    strength: 0,
    agility: 0,
    intelligence: 0,
    charisma: 0,
    endurance: 0,
    luck: 0
  };

  switch (characterClass) {
    case 'enforcer':
      bonuses.strength = 3;
      bonuses.endurance = 2;
      break;
    case 'consigliere':
      bonuses.intelligence = 3;
      bonuses.charisma = 2;
      break;
    case 'racketeer':
      bonuses.charisma = 3;
      bonuses.luck = 2;
      break;
    case 'shadow':
      bonuses.agility = 3;
      bonuses.intelligence = 2;
      break;
    case 'street_boss':
      bonuses.charisma = 3;
      bonuses.strength = 2;
      break;
  }

  return bonuses;
}

function getTraitBonuses(trait: CharacterCreation['traits'][0]) {
  const bonuses: Record<string, number> = {
    strength: 0,
    agility: 0,
    intelligence: 0,
    charisma: 0,
    endurance: 0,
    luck: 0
  };

  switch (trait) {
    case 'connected':
      bonuses.charisma = 2;
      break;
    case 'street_smart':
      bonuses.intelligence = 2;
      break;
    case 'old_money':
      bonuses.luck = 2;
      break;
    case 'quick_learner':
      bonuses.intelligence = 2;
      break;
    case 'iron_will':
      bonuses.endurance = 2;
      break;
    case 'silver_tongue':
      bonuses.charisma = 2;
      break;
  }

  return bonuses;
} 