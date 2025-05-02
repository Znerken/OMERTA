'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCharacter } from '@/hooks/character/useCharacter';
import { 
  ShieldCheck, 
  Fingerprint, 
  Loader2, 
  CheckCircle2,
  Building2,
} from 'lucide-react';
import Image from 'next/image';

interface BankLoadingProps {
  onComplete: () => void;
}

export default function BankLoading({ onComplete }: BankLoadingProps) {
  const [step, setStep] = useState(0);
  const { character } = useCharacter();
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    if (step === 0) {
      const timer = setTimeout(() => setStep(1), 3000);
      return () => clearTimeout(timer);
    }
  }, [step]);

  const handleLogin = async () => {
    setIsAuthenticating(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsAuthenticated(true);
    setTimeout(() => onComplete(), 1000);
  };

  return (
    <div className="min-h-screen bg-[#111111] text-white flex items-center justify-center overflow-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-red-950/30 via-transparent to-red-950/30" />
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.05 }}
          transition={{ duration: 2 }}
          className="absolute inset-0 bg-[url('/noise.png')]" 
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,transparent_0%,rgba(0,0,0,0.7)_100%)]" />
      </div>

      <div className="relative z-10 w-full max-w-md p-8">
        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex flex-col items-center gap-8"
            >
              <motion.div className="relative w-72 h-72">
                {/* Animated elements */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ 
                    opacity: [0.4, 0.2, 0.4],
                    scale: [1, 1.1, 1],
                    rotate: 360
                  }}
                  transition={{ 
                    duration: 6,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                  className="absolute inset-0 rounded-full"
                  style={{
                    background: 'radial-gradient(circle, rgba(220,38,38,0.2) 0%, rgba(185,28,28,0.1) 50%, transparent 70%)',
                    border: '1px solid rgba(220,38,38,0.1)',
                  }}
                />
                
                {/* Pulsing red lines */}
                {[...Array(8)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0 }}
                    animate={{ 
                      opacity: [0, 0.5, 0],
                    }}
                    transition={{ 
                      duration: 2,
                      delay: i * 0.25,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                    className="absolute top-1/2 left-1/2 w-full h-[1px] origin-left"
                    style={{ 
                      background: 'linear-gradient(90deg, #DC2626 0%, transparent 100%)',
                      transform: `rotate(${i * 45}deg)`,
                    }}
                  />
                ))}

                {/* Logo container */}
                <motion.div 
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 1, delay: 0.5 }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <div className="relative">
                    <motion.div
                      animate={{ 
                        boxShadow: ['0 0 20px rgba(220,38,38,0.3)', '0 0 40px rgba(220,38,38,0.2)', '0 0 20px rgba(220,38,38,0.3)']
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="absolute inset-0 rounded-full"
                    />
                    <Image
                      src="/images/apps/Bank Gothic.png"
                      alt="Bank Logo"
                      width={180}
                      height={180}
                      className="relative z-10 object-contain drop-shadow-2xl"
                    />
                  </div>
                </motion.div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="text-center space-y-3"
              >
                <p className="text-gray-400 text-sm tracking-widest">SECURE • DISCREET • RELIABLE</p>
              </motion.div>
            </motion.div>
          )}

          {step === 1 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6 backdrop-blur-sm bg-black/20 p-8 rounded-2xl border border-red-900/20"
            >
              <div className="text-center mb-8">
                <motion.h2 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-2xl font-bold mb-2 text-red-500"
                >
                  Secure Authentication
                </motion.h2>
                <p className="text-gray-400">Verify your identity to proceed</p>
              </div>

              <div className="space-y-4">
                <motion.div 
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="relative"
                >
                  <Input
                    type="text"
                    value={character?.name || ''}
                    disabled
                    className="bg-black/30 border-gray-800 text-gray-300 focus:border-red-500/50"
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <Building2 className="w-5 h-5 text-red-500" />
                  </div>
                </motion.div>

                <motion.div 
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="relative"
                >
                  <Input
                    type="password"
                    value="••••••••"
                    disabled
                    className="bg-black/30 border-gray-800 text-gray-300 focus:border-red-500/50"
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <ShieldCheck className="w-5 h-5 text-red-500" />
                  </div>
                </motion.div>

                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  <Button
                    onClick={handleLogin}
                    disabled={isAuthenticating || isAuthenticated}
                    className="w-full relative overflow-hidden group bg-gradient-to-r from-red-700 to-red-900 hover:from-red-600 hover:to-red-800 border-0"
                  >
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: [0, 0.1, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="absolute inset-0 bg-white"
                    />
                    <div className="relative flex items-center justify-center gap-2">
                      {isAuthenticating ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          <span>Verifying...</span>
                        </>
                      ) : isAuthenticated ? (
                        <>
                          <CheckCircle2 className="w-5 h-5" />
                          <span>Verified</span>
                        </>
                      ) : (
                        <>
                          <Fingerprint className="w-5 h-5" />
                          <span>Authenticate</span>
                        </>
                      )}
                    </div>
                  </Button>
                </motion.div>
              </div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-center text-sm text-gray-500"
              >
                <p>Awaiting biometric verification...</p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
} 