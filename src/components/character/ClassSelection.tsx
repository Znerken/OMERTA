'use client';

import { motion } from 'framer-motion';
import { useCharacterCreation } from '@/hooks/character/CharacterCreationContext';
import { CharacterClass } from '@/types/character';
import { Shield, Sword, Briefcase, Ghost, Crown, CheckCircle2 } from 'lucide-react';
import Image from 'next/image';

const classes: {
  id: CharacterClass;
  name: string;
  description: string;
  image: string;
  icon: React.ReactNode;
  specialties: string[];
  stats: {
    strength: number;
    agility: number;
    intelligence: number;
    charisma: number;
    endurance: number;
    luck: number;
  };
}[] = [
  {
    id: 'enforcer',
    name: 'Enforcer',
    description: 'Muscle of the family. Specialized in combat and intimidation.',
    image: '/images/classes/enforcer.jpg',
    icon: <Sword className="w-5 h-5 text-red-400" />,
    specialties: ['Combat effectiveness +25%', 'Intimidation success rate +20%'],
    stats: {
      strength: 3,
      agility: 2,
      intelligence: 1,
      charisma: 1,
      endurance: 2,
      luck: 1
    }
  },
  {
    id: 'consigliere',
    name: 'Consigliere',
    description: 'Strategic advisor. Master of negotiations and planning.',
    image: '/images/classes/consigliere.jpg',
    icon: <Briefcase className="w-5 h-5 text-red-400" />,
    specialties: ['Negotiation success rate +25%', 'Territory income +20%'],
    stats: {
      strength: 1,
      agility: 1,
      intelligence: 3,
      charisma: 3,
      endurance: 1,
      luck: 1
    }
  },
  {
    id: 'racketeer',
    name: 'Racketeer',
    description: 'Business specialist. Expert in running illegal operations.',
    image: '/images/classes/racketeer.jpg',
    icon: <Shield className="w-5 h-5 text-red-400" />,
    specialties: ['Business management +25%', 'Income from rackets +20%'],
    stats: {
      strength: 1,
      agility: 2,
      intelligence: 2,
      charisma: 2,
      endurance: 1,
      luck: 2
    }
  },
  {
    id: 'shadow',
    name: 'Shadow',
    description: 'Stealth specialist. Excels in covert operations.',
    image: '/images/classes/shadow.jpg',
    icon: <Ghost className="w-5 h-5 text-red-400" />,
    specialties: ['Stealth operations +25%', 'Detection avoidance +20%'],
    stats: {
      strength: 1,
      agility: 3,
      intelligence: 2,
      charisma: 1,
      endurance: 1,
      luck: 2
    }
  },
  {
    id: 'street_boss',
    name: 'Street Boss',
    description: 'Territory leader. Commands respect and loyalty.',
    image: '/images/classes/street-boss.jpg',
    icon: <Crown className="w-5 h-5 text-red-400" />,
    specialties: ['Territory control +25%', 'Crew effectiveness +20%'],
    stats: {
      strength: 2,
      agility: 1,
      intelligence: 2,
      charisma: 3,
      endurance: 1,
      luck: 1
    }
  }
];

export function ClassSelection() {
  const { data, setClass } = useCharacterCreation();

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-serif font-bold mb-2 text-red-400">Choose Your Class</h2>
        <p className="text-gray-400">What role will you play in the family?</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {classes.map((characterClass) => (
          <motion.button
            key={characterClass.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setClass(characterClass.id)}
            className={`relative overflow-hidden rounded-xl border-2 ${
              data.class === characterClass.id
                ? 'border-red-500 bg-red-900/20'
                : 'border-gray-800 bg-black/40 hover:border-red-900'
            }`}
          >
            {/* Class Image */}
            <div className="relative h-48 w-full">
              <Image
                src={characterClass.image}
                alt={characterClass.name}
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
            </div>

            {/* Class Content */}
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-red-900/20 border border-red-900/30 flex items-center justify-center">
                  {characterClass.icon}
                </div>
                <div>
                  <h3 className="text-xl font-serif font-bold">{characterClass.name}</h3>
                  <p className="text-sm text-gray-400">{characterClass.description}</p>
                </div>
              </div>

              {/* Specialties */}
              <div className="space-y-2 mb-4">
                <h4 className="text-sm font-medium text-gray-400">Specialties</h4>
                <div className="flex flex-wrap gap-2">
                  {characterClass.specialties.map((specialty, index) => (
                    <div
                      key={index}
                      className="px-3 py-1 rounded-full bg-red-900/20 border border-red-900/30 text-sm"
                    >
                      {specialty}
                    </div>
                  ))}
                </div>
              </div>

              {/* Stats */}
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-gray-400">Starting Stats</h4>
                <div className="grid grid-cols-3 gap-2">
                  {Object.entries(characterClass.stats).map(([stat, value]) => (
                    <div
                      key={stat}
                      className="flex items-center justify-between px-2 py-1 rounded bg-black/30"
                    >
                      <span className="text-xs capitalize">{stat}</span>
                      <span className="text-xs font-medium text-red-400">+{value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Selection Indicator */}
              {data.class === characterClass.id && (
                <div className="absolute top-4 right-4">
                  <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5 text-white" />
                  </div>
                </div>
              )}
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}