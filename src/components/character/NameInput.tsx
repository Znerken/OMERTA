'use client';

import { motion } from 'framer-motion';
import { useCharacterCreation } from '@/hooks/character/CharacterCreationContext';
import { User } from 'lucide-react';
import { useState, useEffect } from 'react';

export function NameInput() {
  const { data, setName } = useCharacterCreation();
  const [localName, setLocalName] = useState(data.name || '');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (data.name !== localName) {
      setLocalName(data.name || '');
    }
  }, [data.name]);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    setLocalName(name);
    
    if (name.length > 20) {
      setError('Name must be 20 characters or less');
      return;
    }

    if (name.length < 3 && name.length > 0) {
      setError('Name must be at least 3 characters');
      return;
    }

    setError(null);
    setName(name);
  };

  return (
    <div className="max-w-md mx-auto space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-serif font-bold mb-2 text-red-400">Choose Your Name</h2>
        <p className="text-gray-400">What will they call you in the streets?</p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-black/40 border border-gray-800 rounded-xl p-6"
      >
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-red-900/20 border border-red-900/30 flex items-center justify-center">
              <User className="w-6 h-6 text-red-400" />
            </div>
            <div className="flex-1">
              <input
                type="text"
                placeholder="Enter your name"
                value={localName}
                onChange={handleNameChange}
                className="w-full px-4 py-2 text-lg font-serif bg-black/30 border border-gray-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-red-900 focus:ring-1 focus:ring-red-900"
                maxLength={20}
                autoFocus
              />
              {error && (
                <p className="mt-2 text-sm text-red-400">{error}</p>
              )}
            </div>
          </div>

          {/* Name Preview */}
          {localName && !error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="pt-4 border-t border-gray-800"
            >
              <div className="text-center">
                <h3 className="text-xl font-serif font-bold text-white">{localName}</h3>
                <p className="text-sm text-gray-400">The next crime boss of the city</p>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Name Guidelines */}
      <div className="bg-black/40 border border-gray-800 rounded-xl p-6">
        <h3 className="text-sm font-medium text-gray-400 mb-3">Name Guidelines</h3>
        <ul className="space-y-2 text-sm text-gray-500">
          <li>• Between 3 and 20 characters</li>
          <li>• Can include letters, numbers, and spaces</li>
          <li>• Choose something memorable but intimidating</li>
          <li>• This will be your identity in the criminal underworld</li>
        </ul>
      </div>
    </div>
  );
}