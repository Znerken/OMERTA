export type MissionDifficulty = 'Easy' | 'Medium' | 'Hard' | 'Elite';
export type MissionType = 'combat' | 'stealth' | 'diplomacy' | 'intelligence' | 'business' | 'territory';
export type MissionStatus = 'Available' | 'In Progress' | 'Completed' | 'Failed' | 'Pending';

export interface MissionReward {
  money: number;
  experience: number;
  streetCred: number;
  territoryInfluence?: number;
  businessIncome?: number;
  items?: {
    id: string;
    name: string;
    type: string;
    rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
    stats?: {
      [key: string]: number;
    };
  }[];
  statBonuses?: {
    [key: string]: number;
  };
  crewExperience?: number;
  territoryControl?: {
    id: string;
    amount: number;
  };
}

export interface MissionRequirements {
  level?: number;
  stats?: {
    [key: string]: number;
  };
  items?: string[];
  territory?: string;
  crewSize?: number;
  business?: string;
  reputation?: number;
}

export interface Mission {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: MissionDifficulty;
  reward: MissionReward;
  requirements: MissionRequirements;
  duration: number;
  energyCost: number;
  nerveCost: number;
  successChance: {
    base: number;
    bonusPerAttribute: number;
    attribute: string;
    territoryBonus?: number;
    crewBonus?: number;
    equipmentBonus?: number;
  };
  specialEvents?: {
    name: string;
    description: string;
    effect: string;
    chance: number;
    duration?: number;
    rewards?: MissionReward;
    penalties?: {
      money?: number;
      health?: number;
      reputation?: number;
    };
  }[];
  icon: string;
  location: string;
  type: MissionType;
  status: MissionStatus;
  progress?: {
    current: number;
    total: number;
    completedAt?: Date;
    crew?: {
      id: string;
      name: string;
      role: string;
      contribution: number;
    }[];
  };
  cooldown?: {
    endsAt: Date;
    reason: string;
  };
  riskLevel: 'Low' | 'Medium' | 'High';
  requiredCrew?: number;
  territory?: string;
  lastAttempt?: {
    success: boolean;
    timestamp: Date;
    statsUsed: {
      [key: string]: number;
    };
    crewUsed?: string[];
  };
  repeatable?: boolean;
  repeatInterval?: number;
  faction?: string;
  reputationGain?: number;
  businessImpact?: {
    id: string;
    incomeChange: number;
    riskChange: number;
  };
}

export interface MissionCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  missions: Mission[];
  specialBonus?: {
    name: string;
    description: string;
    effect: string;
    requiredMissions: number;
    statBoost?: {
      [key: string]: number;
    };
    moneyMultiplier?: number;
    xpMultiplier?: number;
    territoryBonus?: number;
    crewBonus?: number;
  };
  unlockRequirements?: {
    level?: number;
    reputation?: number;
    territory?: number;
    business?: number;
  };
}