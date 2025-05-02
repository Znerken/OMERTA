'use client';

import { motion } from 'framer-motion';
import { useCharacterCreation } from '@/hooks/character/CharacterCreationContext';
import { Heart, Shield, Brain, Star, Zap, Crosshair, Plus, Minus } from 'lucide-react';
import { useState, useEffect } from 'react';

const TOTAL_POINTS = 15;
const MIN_STAT = 1;
const MAX_STAT = 10;

interface StatConfig {
  name: string;
  key: 'strength' | 'agility' | 'intelligence' | 'charisma' | 'endurance' | 'luck';
  icon: React.ReactNode;
  description: string;
}

const stats: StatConfig[] = [
  {
    name: 'Strength',
    key: 'strength',
    icon: <Shield className="w-5 h-5" />,
    description: 'Physical power and combat effectiveness'
  },
  {
    name: 'Agility',
    key: 'agility',
    icon: <Crosshair className="w-5 h-5" />,
    description: 'Speed, stealth, and precision'
  },
  {
    name: 'Intelligence',
    key: 'intelligence',
    icon: <Brain className="w-5 h-5" />,
    description: 'Problem-solving and strategic planning'
  },
  {
    name: 'Charisma',
    key: 'charisma',
    icon: <Star className="w-5 h-5" />,
    description: 'Leadership and social influence'
  },
  {
    name: 'Endurance',
    key: 'endurance',
    icon: <Heart className="w-5 h-5" />,
    description: 'Health and stamina'
  },
  {
    name: 'Luck',
    key: 'luck',
    icon: <Zap className="w-5 h-5" />,
    description: 'Random chance and opportunities'
  }
];

export function StatsAllocation() {
  const { data, setStats } = useCharacterCreation();
  const [remainingPoints, setRemainingPoints] = useState(TOTAL_POINTS);

  useEffect(() => {
    const usedPoints = Object.values(data).reduce((acc, val) => {
      if (typeof val === 'number') {
        return acc + val;
      }
      return acc;
    }, 0);
    setRemainingPoints(TOTAL_POINTS - usedPoints);
  }, [data]);

  const handleStatChange = (key: StatConfig['key'], increment: boolean) => {
    const currentValue = data[key] || MIN_STAT;
    let newValue = increment ? currentValue + 1 : currentValue - 1;

    if (newValue < MIN_STAT || newValue > MAX_STAT) return;
    if (increment && remainingPoints <= 0) return;

    setStats({
      ...data,
      [key]: newValue
    });
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-serif font-bold mb-2 text-red-400">Allocate Your Stats</h2>
        <p className="text-gray-400">Distribute your character points wisely</p>
        <div className="mt-4 inline-block px-4 py-2 rounded-full bg-red-900/20 border border-red-900/30">
          <span className="text-sm font-medium text-gray-300">
            Remaining Points: <span className="text-red-400">{remainingPoints}</span>
          </span>
        </div>
      </div>

      <div className="grid gap-4">
        {stats.map((stat) => {
          const value = data[stat.key] || MIN_STAT;
          const canIncrease = remainingPoints > 0 && value < MAX_STAT;
          const canDecrease = value > MIN_STAT;

          return (
            <div
              key={stat.key}
              className="bg-black/40 border border-gray-800 rounded-xl p-4"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-red-900/20 border border-red-900/30 flex items-center justify-center text-red-400">
                    {stat.icon}
                  </div>
                  <div>
                    <h3 className="font-serif font-bold">{stat.name}</h3>
                    <p className="text-sm text-gray-400">{stat.description}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <motion.button
                    whileHover={{ scale: canDecrease ? 1.1 : 1 }}
                    whileTap={{ scale: canDecrease ? 0.9 : 1 }}
                    onClick={() => handleStatChange(stat.key, false)}
                    className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      canDecrease
                        ? 'bg-red-900/20 border border-red-900/30 text-red-400 hover:bg-red-900/30'
                        : 'bg-gray-900/20 border border-gray-800 text-gray-600 cursor-not-allowed'
                    }`}
                  >
                    <Minus className="w-4 h-4" />
                  </motion.button>

                  <div className="w-12 text-center font-bold text-xl">{value}</div>

                  <motion.button
                    whileHover={{ scale: canIncrease ? 1.1 : 1 }}
                    whileTap={{ scale: canIncrease ? 0.9 : 1 }}
                    onClick={() => handleStatChange(stat.key, true)}
                    className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      canIncrease
                        ? 'bg-red-900/20 border border-red-900/30 text-red-400 hover:bg-red-900/30'
                        : 'bg-gray-900/20 border border-gray-800 text-gray-600 cursor-not-allowed'
                    }`}
                  >
                    <Plus className="w-4 h-4" />
                  </motion.button>
                </div>
              </div>

              {/* Stat Bar */}
              <div className="h-2 bg-gray-900 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(value / MAX_STAT) * 100}%` }}
                  className="h-full bg-red-500"
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}