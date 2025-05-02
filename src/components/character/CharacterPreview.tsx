'use client';

import { motion } from 'framer-motion';
import { useCharacterCreation } from '@/hooks/character/CharacterCreationContext';
import { useCreateCharacter } from '@/hooks/character/useCreateCharacter';
import { Button } from '@/components/ui/button';
import { Shield, Sword, Brain, Star, Heart, Zap, User, Map, Award } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

export function CharacterPreview() {
  const { data } = useCharacterCreation();
  const { createCharacter, isLoading } = useCreateCharacter();
  const [error, setError] = useState<string | null>(null);

  const handleCreateCharacter = async () => {
    try {
      setError(null);
      await createCharacter(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create character');
    }
  };

  const stats = [
    { key: 'strength', label: 'Strength', icon: <Shield className="w-4 h-4" /> },
    { key: 'agility', label: 'Agility', icon: <Sword className="w-4 h-4" /> },
    { key: 'intelligence', label: 'Intelligence', icon: <Brain className="w-4 h-4" /> },
    { key: 'charisma', label: 'Charisma', icon: <Star className="w-4 h-4" /> },
    { key: 'endurance', label: 'Endurance', icon: <Heart className="w-4 h-4" /> },
    { key: 'luck', label: 'Luck', icon: <Zap className="w-4 h-4" /> }
  ];

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-serif font-bold mb-2 text-red-400">Character Preview</h2>
        <p className="text-gray-400">Review your character before entering the criminal underworld</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Basic Info */}
        <div className="space-y-6">
          {/* Name and Origin */}
          <div className="bg-black/40 border border-gray-800 rounded-xl p-6 space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-red-900/20 border border-red-900/30 flex items-center justify-center">
                <User className="w-6 h-6 text-red-400" />
              </div>
              <div>
                <h3 className="text-xl font-serif font-bold">{data.name}</h3>
                <p className="text-sm text-gray-400">Aspiring Crime Boss</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-red-900/20 border border-red-900/30 flex items-center justify-center">
                <Map className="w-6 h-6 text-red-400" />
              </div>
              <div>
                <h3 className="text-lg font-serif font-bold capitalize">
                  {data.origin?.replace(/_/g, ' ')}
                </h3>
                <p className="text-sm text-gray-400">Place of Origin</p>
              </div>
            </div>
          </div>

          {/* Class */}
          <div className="bg-black/40 border border-gray-800 rounded-xl overflow-hidden">
            <div className="relative h-48">
              <Image
                src={`/images/classes/${data.class}.jpg`}
                alt={data.class || ''}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <h3 className="text-xl font-serif font-bold capitalize">
                  {data.class?.replace(/_/g, ' ')}
                </h3>
                <p className="text-sm text-gray-300">Character Class</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Stats and Traits */}
        <div className="space-y-6">
          {/* Stats */}
          <div className="bg-black/40 border border-gray-800 rounded-xl p-6">
            <h3 className="text-lg font-serif font-bold mb-4">Character Stats</h3>
            <div className="grid grid-cols-2 gap-4">
              {stats.map(({ key, label, icon }) => (
                <div
                  key={key}
                  className="flex items-center gap-3 p-3 rounded-lg bg-black/30 border border-gray-800"
                >
                  <div className="w-8 h-8 rounded-lg bg-red-900/20 border border-red-900/30 flex items-center justify-center text-red-400">
                    {icon}
                  </div>
                  <div>
                    <div className="text-sm font-medium">{label}</div>
                    <div className="text-xl font-bold text-red-400">
                      {data[key as keyof typeof data] || 0}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Traits */}
          <div className="bg-black/40 border border-gray-800 rounded-xl p-6">
            <h3 className="text-lg font-serif font-bold mb-4">Special Traits</h3>
            <div className="space-y-3">
              {data.traits?.map((trait) => (
                <div
                  key={trait}
                  className="flex items-center gap-3 p-3 rounded-lg bg-black/30 border border-gray-800"
                >
                  <div className="w-8 h-8 rounded-lg bg-red-900/20 border border-red-900/30 flex items-center justify-center">
                    <Award className="w-4 h-4 text-red-400" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium capitalize">{trait.replace(/_/g, ' ')}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-4 rounded-lg bg-red-900/20 border border-red-900/30 text-red-400 text-center">
          {error}
        </div>
      )}

      {/* Create Button */}
      <div className="flex justify-center">
        <Button
          onClick={handleCreateCharacter}
          disabled={isLoading}
          className="bg-red-500 hover:bg-red-600 text-white px-8 py-3 text-lg font-serif"
        >
          {isLoading ? 'Creating Character...' : 'Begin Your Criminal Empire'}
        </Button>
      </div>
    </div>
  );
}