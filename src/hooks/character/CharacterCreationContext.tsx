'use client';

import { createContext, useContext, useReducer, ReactNode, useEffect, useState } from 'react';
import { CharacterCreation, CharacterCreationStep, CharacterOrigin, CharacterClass, CharacterTrait } from '@/types/character';

interface CharacterCreationState {
  step: CharacterCreationStep;
  data: Partial<CharacterCreation>;
}

type CharacterCreationAction =
  | { type: 'SET_STEP'; payload: CharacterCreationStep }
  | { type: 'SET_NAME'; payload: string }
  | { type: 'SET_ORIGIN'; payload: CharacterOrigin }
  | { type: 'SET_CLASS'; payload: CharacterClass }
  | { type: 'SET_TRAITS'; payload: CharacterTrait[] }
  | { type: 'SET_STATS'; payload: Pick<CharacterCreation, 'strength' | 'agility' | 'intelligence' | 'charisma' | 'endurance' | 'luck'> };

interface CharacterCreationContextType extends CharacterCreationState {
  setStep: (step: CharacterCreationStep) => void;
  setName: (name: string) => void;
  setOrigin: (origin: CharacterOrigin) => void;
  setClass: (characterClass: CharacterClass) => void;
  setTraits: (traits: CharacterTrait[]) => void;
  setStats: (stats: Pick<CharacterCreation, 'strength' | 'agility' | 'intelligence' | 'charisma' | 'endurance' | 'luck'>) => void;
}

const CharacterCreationContext = createContext<CharacterCreationContextType | undefined>(undefined);

function characterCreationReducer(state: CharacterCreationState, action: CharacterCreationAction): CharacterCreationState {
  switch (action.type) {
    case 'SET_STEP':
      return { ...state, step: action.payload };
    case 'SET_NAME':
      return { ...state, data: { ...state.data, name: action.payload } };
    case 'SET_ORIGIN':
      return { ...state, data: { ...state.data, origin: action.payload } };
    case 'SET_CLASS':
      return { ...state, data: { ...state.data, class: action.payload } };
    case 'SET_TRAITS':
      return { ...state, data: { ...state.data, traits: action.payload } };
    case 'SET_STATS':
      return { ...state, data: { ...state.data, ...action.payload } };
    default:
      return state;
  }
}

const initialState: CharacterCreationState = {
  step: 'name',
  data: {
    name: '',
    traits: [],
    strength: 1,
    agility: 1,
    intelligence: 1,
    charisma: 1,
    endurance: 1,
    luck: 1,
  }
};

export function CharacterCreationProvider({ children, initialStep = 'name' }: { children: ReactNode; initialStep?: CharacterCreationStep }) {
  const [mounted, setMounted] = useState(false);
  const [state, dispatch] = useReducer(characterCreationReducer, {
    ...initialState,
    step: initialStep
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  const setStep = (step: CharacterCreationStep) => dispatch({ type: 'SET_STEP', payload: step });
  const setName = (name: string) => dispatch({ type: 'SET_NAME', payload: name });
  const setOrigin = (origin: CharacterOrigin) => dispatch({ type: 'SET_ORIGIN', payload: origin });
  const setClass = (characterClass: CharacterClass) => dispatch({ type: 'SET_CLASS', payload: characterClass });
  const setTraits = (traits: CharacterTrait[]) => dispatch({ type: 'SET_TRAITS', payload: traits });
  const setStats = (stats: Pick<CharacterCreation, 'strength' | 'agility' | 'intelligence' | 'charisma' | 'endurance' | 'luck'>) => 
    dispatch({ type: 'SET_STATS', payload: stats });

  if (!mounted) {
    return null;
  }

  return (
    <CharacterCreationContext.Provider value={{ ...state, setStep, setName, setOrigin, setClass, setTraits, setStats }}>
      {children}
    </CharacterCreationContext.Provider>
  );
}

export function useCharacterCreation() {
  const context = useContext(CharacterCreationContext);
  if (context === undefined) {
    throw new Error('useCharacterCreation must be used within a CharacterCreationProvider');
  }
  return context;
}