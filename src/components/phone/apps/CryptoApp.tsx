'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield, Key, Network, Database, RefreshCcw, Waves, Cpu, Wallet } from 'lucide-react';

interface CryptoAppProps {
  onBack: () => void;
}

export function CryptoApp({ onBack }: CryptoAppProps) {
  const [loadingStep, setLoadingStep] = useState(0);
  const [progress, setProgress] = useState(0);

  const loadingSteps = [
    { icon: Shield, text: "Verifying security protocols..." },
    { icon: Key, text: "Establishing secure connection..." },
    { icon: Network, text: "Connecting to blockchain network..." },
    { icon: Database, text: "Syncing latest transactions..." },
    { icon: RefreshCcw, text: "Updating market data..." },
    { icon: Waves, text: "Analyzing market trends..." },
    { icon: Cpu, text: "Initializing trading engine..." },
    { icon: Wallet, text: "Loading wallet interface..." }
  ];

  useEffect(() => {
    // Progress bar animation
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return Math.min(prev + 2, 100);
      });
    }, 50);

    // Step animation
    const stepInterval = setInterval(() => {
      setLoadingStep(prev => {
        if (prev >= loadingSteps.length - 1) {
          clearInterval(stepInterval);
          return prev;
        }
        return prev + 1;
      });
    }, 1000);

    return () => {
      clearInterval(progressInterval);
      clearInterval(stepInterval);
    };
  }, []);

  const CurrentIcon = loadingSteps[loadingStep].icon;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="h-full bg-black text-white flex flex-col items-center justify-center p-6 space-y-8"
    >
      {/* Logo */}
      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="relative w-24 h-24 mb-8"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-white/95 to-white/80 rounded-2xl">
          <img
            src="/images/apps/coin.png"
            alt="Coin"
            className="w-full h-full object-contain p-4 scale-90"
          />
        </div>
        
        {/* Rotating rings */}
        <motion.div 
          className="absolute -inset-4 rounded-full border-t-2 border-white/20"
          animate={{ rotate: 360 }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
        />
        <motion.div 
          className="absolute -inset-6 rounded-full border-t-2 border-white/10"
          animate={{ rotate: -360 }}
          transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
        />
      </motion.div>

      {/* Current step */}
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="flex flex-col items-center space-y-4"
      >
        <motion.div 
          className="text-white/80"
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          <CurrentIcon className="w-8 h-8" />
        </motion.div>
        <p className="text-white/80 text-center">
          {loadingSteps[loadingStep].text}
        </p>
      </motion.div>

      {/* Progress bar */}
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="w-full max-w-xs"
      >
        <div className="flex justify-between text-xs text-white/60 mb-1">
          <span>Initializing</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden">
          <motion.div 
            className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
            style={{ width: `${progress}%` }}
            transition={{ duration: 0.1 }}
          />
        </div>
      </motion.div>
    </motion.div>
  );
} 