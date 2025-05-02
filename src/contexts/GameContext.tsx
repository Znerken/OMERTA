'use client';

import { createContext, useContext, useState } from 'react';

type GameState = {
  selectedTerritory: string | null;
  selectedMission: string | null;
};

type GameContextType = {
  state: GameState;
  setSelectedTerritory: (territoryId: string | null) => void;
  setSelectedMission: (missionId: string | null) => void;
};

const GameContext = createContext<GameContextType>({
  state: {
    selectedTerritory: null,
    selectedMission: null,
  },
  setSelectedTerritory: () => {},
  setSelectedMission: () => {},
});

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<GameState>({
    selectedTerritory: null,
    selectedMission: null,
  });

  const setSelectedTerritory = (territoryId: string | null) => {
    setState(prev => ({ ...prev, selectedTerritory: territoryId }));
  };

  const setSelectedMission = (missionId: string | null) => {
    setState(prev => ({ ...prev, selectedMission: missionId }));
  };

  return (
    <GameContext.Provider 
      value={{ 
        state,
        setSelectedTerritory,
        setSelectedMission,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

export const useGame = () => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};