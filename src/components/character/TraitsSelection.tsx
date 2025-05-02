'use client';

import { motion } from 'framer-motion';
import { useCharacterCreation } from '@/hooks/character/CharacterCreationContext';
import { CharacterTrait } from '@/types/character';
import { Star, Network, Brain, Book, Shield, MessageCircle, CheckCircle2, AlertCircle } from 'lucide-react';
import Image from 'next/image';

const MAX_TRAITS = 2;

const traits: {
  id: CharacterTrait;
  name: string;
  description: string;
  effect: string;
  image: string;
  icon: React.ReactNode;
}[] = [
  {
    id: 'connected',
    name: 'Connected',
    description: 'Well-connected in the criminal underworld.',
    effect: 'Better relationships with NPCs, unlock special dialogue options',
    image: '/images/traits/connected.jpg',
    icon: <Network className="w-5 h-5 text-red-400" />
  },
  {
    id: 'street_smart',
    name: 'Street Smart',
    description: 'Know the ins and outs of street crime.',
    effect: 'Enhanced income from street-level crimes, better escape chances',
    image: '/images/traits/street-smart.jpg',
    icon: <Brain className="w-5 h-5 text-red-400" />
  },
  {
    id: 'old_money',
    name: 'Old Money',
    description: 'Come from a wealthy background.',
    effect: 'Start with additional resources, better business connections',
    image: '/images/traits/old-money.jpg',
    icon: <Star className="w-5 h-5 text-red-400" />
  },
  {
    id: 'quick_learner',
    name: 'Quick Learner',
    description: 'Pick up new skills faster than others.',
    effect: 'Faster XP gain, reduced training costs',
    image: '/images/traits/quick-learner.jpg',
    icon: <Book className="w-5 h-5 text-red-400" />
  },
  {
    id: 'iron_will',
    name: 'Iron Will',
    description: 'Exceptionally resistant to pressure.',
    effect: 'Better resistance to interrogation, reduced stress from activities',
    image: '/images/traits/iron-will.jpg',
    icon: <Shield className="w-5 h-5 text-red-400" />
  },
  {
    id: 'silver_tongue',
    name: 'Silver Tongue',
    description: 'Natural negotiator and smooth talker.',
    effect: 'Better success rate in negotiations, reduced bribe costs',
    image: '/images/traits/silver-tongue.jpg',
    icon: <MessageCircle className="w-5 h-5 text-red-400" />
  }
];

export function TraitsSelection() {
  const { data, setTraits } = useCharacterCreation();

  const handleTraitToggle = (trait: CharacterTrait) => {
    if (data.traits.includes(trait)) {
      setTraits(data.traits.filter(t => t !== trait));
    } else if (data.traits.length < MAX_TRAITS) {
      setTraits([...data.traits, trait]);
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-serif font-bold mb-2 text-red-400">Choose Your Traits</h2>
        <p className="text-gray-400">Select up to {MAX_TRAITS} traits that define your character</p>
        <p className="text-sm text-gray-500 mt-2">
          {MAX_TRAITS - data.traits.length} traits remaining
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {traits.map((trait) => {
          const isSelected = data.traits.includes(trait.id);
          const canSelect = data.traits.length < MAX_TRAITS || isSelected;

          return (
            <motion.button
              key={trait.id}
              whileHover={{ scale: canSelect ? 1.02 : 1 }}
              whileTap={{ scale: canSelect ? 0.98 : 1 }}
              onClick={() => canSelect && handleTraitToggle(trait.id)}
              className={`relative overflow-hidden rounded-xl border-2 ${
                isSelected
                  ? 'border-red-500 bg-red-900/20'
                  : canSelect
                  ? 'border-gray-800 bg-black/40 hover:border-red-900'
                  : 'border-gray-800 bg-black/20 opacity-50 cursor-not-allowed'
              }`}
            >
              {/* Trait Image */}
              <div className="relative h-40 w-full">
                <Image
                  src={trait.image}
                  alt={trait.name}
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
              </div>

              {/* Trait Content */}
              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-red-900/20 border border-red-900/30 flex items-center justify-center">
                    {trait.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-serif font-bold">{trait.name}</h3>
                    <p className="text-sm text-gray-400">{trait.description}</p>
                  </div>
                </div>

                {/* Effect */}
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-gray-400">Effect</h4>
                  <p className="text-sm text-gray-300 italic">{trait.effect}</p>
                </div>

                {/* Selection Indicator */}
                <div className="absolute top-4 right-4">
                  {isSelected ? (
                    <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center">
                      <CheckCircle2 className="w-5 h-5 text-white" />
                    </div>
                  ) : !canSelect && (
                    <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center">
                      <AlertCircle className="w-5 h-5 text-gray-400" />
                    </div>
                  )}
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}