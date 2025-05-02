'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useCharacter } from '@/hooks/character/useCharacter';
import Image from 'next/image';
import { 
  UserPlus, 
  LogIn, 
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Link as LinkIcon,
  Wallet,
  KeyRound,
  Shield,
  Database
} from 'lucide-react';

interface AppLoaderProps {
  onComplete: () => void;
}

export function AppLoader({ onComplete }: AppLoaderProps) {
  const { character } = useCharacter();
  const [step, setStep] = useState<'loading' | 'account' | 'creating' | 'logging-in' | 'complete'>('loading');
  const [progress, setProgress] = useState(0);
  const [hasAccount, setHasAccount] = useState(false);
  const [setupProgress, setSetupProgress] = useState(0);
  const [currentMessage, setCurrentMessage] = useState('');

  const setupMessages = [
    "Generating secure wallet...",
    "Initializing blockchain...",
    "Setting up encryption...",
    "Almost ready..."
  ];

  const loginMessages = [
    "Verifying wallet signature...",
    "Establishing secure connection...",
    "Validating blockchain credentials...",
    "Synchronizing wallet state...",
    "Loading transaction history...",
    "Finalizing security checks..."
  ];

  const successMessages = [
    { text: "Wallet successfully created", icon: Wallet },
    { text: "Connected to blockchain network", icon: LinkIcon },
    { text: "Private keys secured", icon: ShieldCheck },
    { text: "Smart contract initialized", icon: CheckCircle2 }
  ];

  const loginSuccessMessages = [
    { text: "Wallet signature verified", icon: KeyRound },
    { text: "Blockchain connection established", icon: Shield },
    { text: "Credentials authenticated", icon: Database },
    { text: "Wallet state synchronized", icon: CheckCircle2 }
  ];

  useEffect(() => {
    // Initial loading animation
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setStep('account');
          if (character) {
            setHasAccount(true);
          }
          return 100;
        }
        return prev + 10;
      });
    }, 300);

    return () => clearInterval(interval);
  }, [character]);

  const handleCreateAccount = () => {
    setStep('creating');
    setCurrentMessage(setupMessages[0]);
    
    let totalProgress = 0;
    const interval = setInterval(() => {
      if (totalProgress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          setStep('complete');
        }, 500);
        return;
      }
      
      totalProgress += 0.7;
      setSetupProgress(totalProgress);
      
      const messageIndex = Math.floor((totalProgress / 100) * setupMessages.length);
      if (messageIndex < setupMessages.length) {
        setCurrentMessage(setupMessages[messageIndex]);
      }
    }, 30);
  };

  const handleLogin = () => {
    setStep('logging-in');
    setCurrentMessage(loginMessages[0]);
    
    let totalProgress = 0;
    const interval = setInterval(() => {
      if (totalProgress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          setStep('complete');
        }, 500);
        return;
      }
      
      totalProgress += 0.7;
      setSetupProgress(totalProgress);
      
      const messageIndex = Math.floor((totalProgress / 100) * loginMessages.length);
      if (messageIndex < loginMessages.length) {
        setCurrentMessage(loginMessages[messageIndex]);
      }
    }, 50);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#0A0B0D]">
      {/* Enhanced Animated Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/10 via-purple-900/10 to-gray-900/10" />
        <div className="absolute inset-0 bg-[url('/images/grid.png')] opacity-5" />
        {/* Animated gradient orbs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <AnimatePresence mode="wait">
        {step === 'loading' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="relative z-10 h-full flex flex-col items-center justify-center p-8"
          >
            <motion.div
              animate={{ 
                rotate: 360,
                scale: [1, 1.05, 1]
              }}
              transition={{ 
                rotate: { duration: 4, repeat: Infinity, ease: "linear" },
                scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
              }}
              className="w-40 h-40 mb-12 relative"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur-2xl opacity-30" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Image
                  src="/images/apps/coin.png"
                  alt="Coin Logo"
                  width={160}
                  height={160}
                  className="object-contain filter drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]"
                />
              </div>
            </motion.div>
            
            <div className="w-64 h-2 bg-white/5 rounded-full overflow-hidden mb-4">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
              />
            </div>
            
            <p className="text-gray-400 text-sm">
              {progress < 30 && "Initializing blockchain connection..."}
              {progress >= 30 && progress < 60 && "Loading market data..."}
              {progress >= 60 && progress < 90 && "Synchronizing wallet..."}
              {progress >= 90 && "Finalizing setup..."}
            </p>
          </motion.div>
        )}

        {step === 'account' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="relative h-full flex items-center justify-center p-8"
          >
            {/* Large Floating Background Logo */}
            <motion.div
              animate={{ 
                y: [0, -20, 0],
                rotate: [0, 5, -5, 0],
                scale: [1, 1.02, 0.98, 1]
              }}
              transition={{ 
                duration: 10,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute inset-0 flex items-center justify-center pointer-events-none z-0"
            >
              <div className="relative w-[300px] h-[300px] -mt-[48rem]">
                <Image
                  src="/images/apps/coin.png"
                  alt="Coin Logo"
                  fill
                  className="object-contain"
                />
              </div>
            </motion.div>

            {/* Account Form */}
            <Card className="relative z-10 w-full max-w-md bg-black/40 backdrop-blur-xl border-white/10 p-8">
              <div className="flex flex-col items-center mb-8">
                <p className="text-gray-400">
                  {hasAccount ? "Login to access your wallet" : "Create an account to get started"}
                </p>
              </div>

              <div className="space-y-4 mb-8">
                <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                  <p className="text-sm text-gray-400 mb-1">Username</p>
                  <p className="font-mono text-white">{character?.name || 'Anonymous'}</p>
                </div>
                <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                  <p className="text-sm text-gray-400 mb-1">Wallet Address</p>
                  <p className="font-mono text-white">0x{Math.random().toString(16).slice(2, 10)}...</p>
                </div>
              </div>

              <div className="flex gap-4">
                <Button
                  variant="outline"
                  className="flex-1 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border-blue-500/20"
                  onClick={handleLogin}
                >
                  <LogIn className="w-4 h-4 mr-2" />
                  Login
                </Button>
                <Button
                  className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                  onClick={handleCreateAccount}
                >
                  <UserPlus className="w-4 h-4 mr-2" />
                  Create Account
                </Button>
              </div>
            </Card>
          </motion.div>
        )}

        {step === 'creating' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="relative h-full flex flex-col items-center justify-center p-8"
          >
            {/* Animated Logo */}
            <motion.div
              animate={{ 
                x: [0, -2, 2, -2, 0],
                rotate: [-1, 1, -1, 1, -1]
              }}
              transition={{ 
                duration: 0.5,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut"
              }}
              className="mb-16"
            >
              <div className="relative w-[200px] h-[200px]">
                <Image
                  src="/images/apps/coin.png"
                  alt="Coin Logo"
                  fill
                  className="object-contain"
                />
              </div>
            </motion.div>

            {/* Setup Progress */}
            <div className="w-full max-w-md">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center space-y-8"
              >
                {/* Message */}
                <motion.p
                  key={currentMessage}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="text-2xl font-medium text-white"
                >
                  {currentMessage}
                </motion.p>

                {/* Progress Bar */}
                <div className="relative">
                  <div className="w-full h-3 bg-white/5 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${setupProgress}%` }}
                      className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                      style={{ 
                        transition: 'width 0.3s ease-out'
                      }}
                    />
                  </div>
                  <motion.div 
                    className="mt-2 flex items-center justify-center gap-1"
                    key={Math.round(setupProgress)}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                  >
                    <span className="text-lg font-semibold text-blue-400">
                      {Math.round(setupProgress)}
                    </span>
                    <span className="text-sm text-gray-400">%</span>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}

        {step === 'logging-in' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="relative h-full flex flex-col items-center justify-center p-8"
          >
            {/* Enhanced Animated Background for Login */}
            <div className="fixed inset-0 z-0">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-gray-900/20" />
              <div className="absolute inset-0 bg-[url('/images/grid.png')] opacity-10" />
              {/* Animated gradient orbs */}
              <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse" />
              <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
            </div>

            {/* Animated Logo with Enhanced Effects */}
            <motion.div
              animate={{ 
                x: [0, -2, 2, -2, 0],
                rotate: [-1, 1, -1, 1, -1],
                scale: [1, 1.02, 0.98, 1]
              }}
              transition={{ 
                duration: 0.5,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut"
              }}
              className="mb-16 relative"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur-2xl opacity-30" />
              <div className="relative w-[200px] h-[200px]">
                <Image
                  src="/images/apps/coin.png"
                  alt="Coin Logo"
                  fill
                  className="object-contain filter drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]"
                />
              </div>
            </motion.div>

            {/* Enhanced Setup Progress */}
            <div className="w-full max-w-md">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center space-y-8"
              >
                {/* Message with Enhanced Typography */}
                <motion.p
                  key={currentMessage}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="text-2xl font-medium text-white tracking-wide"
                >
                  {currentMessage}
                </motion.p>

                {/* Enhanced Progress Bar */}
                <div className="relative">
                  <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${setupProgress}%` }}
                      className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                      style={{ 
                        transition: 'width 0.3s ease-out'
                      }}
                    />
                  </div>
                  <motion.div 
                    className="mt-2 flex items-center justify-center gap-1"
                    key={Math.round(setupProgress)}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                  >
                    <span className="text-lg font-semibold text-blue-400">
                      {Math.round(setupProgress)}
                    </span>
                    <span className="text-sm text-gray-400">%</span>
                  </motion.div>
                </div>

                {/* Security Status */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="mt-4 text-sm text-gray-400"
                >
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    <span>Secure Connection Established</span>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        )}

        {step === 'complete' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="relative z-10 h-full flex flex-col items-center justify-center p-8"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.5 }}
              className="w-32 h-32 mb-12 relative"
            >
              <Image
                src="/images/apps/coin.png"
                alt="Coin Logo"
                fill
                className="object-contain"
              />
            </motion.div>
            
            <div className="space-y-4 mb-12">
              {(hasAccount ? loginSuccessMessages : successMessages).map(({ text, icon: Icon }, index) => (
                <motion.div
                  key={text}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ 
                    delay: 1 + (index * 0.7),
                    duration: 0.5,
                    ease: "easeOut"
                  }}
                  className="flex items-center gap-3 text-lg"
                >
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{
                      delay: 1 + (index * 0.7) + 0.2,
                      type: "spring",
                      stiffness: 200,
                      damping: 15
                    }}
                    className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center"
                  >
                    <Icon className="w-4 h-4 text-green-400" />
                  </motion.div>
                  <span className="text-white">{text}</span>
                </motion.div>
              ))}
            </div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 4, duration: 0.5 }}
              className="text-center"
            >
              <p className="text-gray-400 mb-4">
                {hasAccount ? "Welcome back to your wallet" : "Your wallet is ready to use"}
              </p>
              <Button
                className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 px-8 py-6 text-lg"
                onClick={onComplete}
              >
                Enter Dashboard
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 