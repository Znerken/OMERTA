'use client';

import { motion } from 'framer-motion';
import { useCharacterCreation } from '@/hooks/character/CharacterCreationContext';
import { CharacterOrigin } from '@/types/character';
import { Map } from 'lucide-react';
import Image from 'next/image';
import { CheckCircle2 } from 'lucide-react';

const origins: {
  id: CharacterOrigin;
  name: string;
  description: string;
  image: string;
  bonuses: {
    stat: string;
    value: number;
  }[];
}[] = [
  {
    id: 'little_italy',
    name: 'Little Italy',
    description: 'Born and raised in the heart of the Italian community. You know every back alley and have connections in every restaurant.',
    image: '/images/origins/little-italy.jpg', // You'll need to add this image
    bonuses: [
      { stat: 'charisma', value: 2 },
      { stat: 'intelligence', value: 1 }
    ]
  },
  {
    id: 'the_docks',
    name: 'The Docks',
    description: 'Grew up around the docks, learning the ways of smuggling and underground trade. You know how to handle yourself in a fight.',
    image: '/images/origins/docks.jpg', // You'll need to add this image
    bonuses: [
      { stat: 'strength', value: 2 },
      { stat: 'endurance', value: 1 }
    ]
  },
  {
    id: 'downtown',
    name: 'Downtown',
    description: 'Raised in the business district, you understand the corporate world and how to manipulate it to your advantage.',
    image: '/images/origins/downtown.jpg', // You'll need to add this image
    bonuses: [
      { stat: 'intelligence', value: 2 },
      { stat: 'luck', value: 1 }
    ]
  },
  {
    id: 'the_outskirts',
    name: 'The Outskirts',
    description: 'From the rough neighborhoods on the city\'s edge, you learned to survive by any means necessary.',
    image: '/images/origins/outskirts.jpg', // You'll need to add this image
    bonuses: [
      { stat: 'agility', value: 2 },
      { stat: 'endurance', value: 1 }
    ]
  }
];

export function OriginSelection() {
  const { data, setOrigin } = useCharacterCreation();

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-serif font-bold mb-2 text-red-400">Choose Your Origin</h2>
        <p className="text-gray-400">Where did your story begin?</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {origins.map((origin) => (
          <motion.button
            key={origin.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setOrigin(origin.id)}
            className={`relative overflow-hidden rounded-xl border-2 ${
              data.origin === origin.id
                ? 'border-red-500 bg-red-900/20'
                : 'border-gray-800 bg-black/40 hover:border-red-900'
            }`}
          >
            {/* Origin Image */}
            <div className="relative h-48 w-full">
              <Image
                src={origin.image}
                alt={origin.name}
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
            </div>

            {/* Origin Content */}
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-red-900/20 border border-red-900/30 flex items-center justify-center">
                  <Map className="w-5 h-5 text-red-400" />
                </div>
                <div>
                  <h3 className="text-xl font-serif font-bold">{origin.name}</h3>
                  <p className="text-sm text-gray-400">{origin.description}</p>
                </div>
              </div>

              {/* Bonuses */}
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-gray-400">Starting Bonuses</h4>
                <div className="flex flex-wrap gap-2">
                  {origin.bonuses.map((bonus, index) => (
                    <div
                      key={index}
                      className="px-3 py-1 rounded-full bg-red-900/20 border border-red-900/30 text-sm"
                    >
                      +{bonus.value} {bonus.stat}
                    </div>
                  ))}
                </div>
              </div>

              {/* Selection Indicator */}
              {data.origin === origin.id && (
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