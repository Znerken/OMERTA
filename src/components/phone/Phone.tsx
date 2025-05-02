'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { usePhone } from './PhoneProvider';
import { X, ChevronLeft, Wifi, Battery, Signal } from 'lucide-react';

interface App {
  id: string;
  name: string;
  icon: string;
  route: string;
  color: string;
}

const APPS: App[] = [
  {
    id: 'crypto',
    name: 'Coin',
    icon: '/images/apps/coin.png',
    route: '/crypto',
    color: 'from-gray-700 to-gray-800'
  },
  {
    id: 'bank',
    name: 'Bank',
    icon: '/images/apps/Bank Gothic.png',
    route: '/banking',
    color: 'from-white to-gray-100'
  },
  {
    id: 'notes',
    name: 'Notes',
    icon: '📝',
    route: '/notes',
    color: 'from-rose-500 to-rose-600'
  },
  {
    id: 'wallet',
    name: 'Wallet',
    icon: '💰',
    route: '/wallet',
    color: 'from-blue-500 to-blue-600'
  }
];

export default function Phone() {
  const router = useRouter();
  const { closePhone } = usePhone();
  const [selectedApp, setSelectedApp] = useState<App | null>(null);

  const handleAppClick = (app: App) => {
    if (app.id === 'crypto') {
      closePhone();
      router.push(app.route);
    } else {
      setSelectedApp(app);
      setTimeout(() => {
        closePhone();
        router.push(app.route);
      }, 1000);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="fixed bottom-4 right-4 w-[320px] h-[600px] rounded-[40px] overflow-hidden shadow-2xl shadow-black/50"
    >
      {/* Phone Frame */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900 to-black">
        {/* Notch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-black rounded-b-3xl" />
        
        {/* Status Bar */}
        <div className="absolute top-2 left-0 right-0 h-6 flex items-center justify-between px-4 text-white/80">
          <div className="flex items-center space-x-2">
            <Signal className="w-3 h-3" />
            <Wifi className="w-3 h-3" />
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-xs">9:41</span>
            <Battery className="w-3 h-3" />
          </div>
        </div>

        {/* Close Button */}
        <button
          onClick={closePhone}
          className="absolute top-8 right-4 p-2 rounded-full hover:bg-white/10 transition-colors"
        >
          <X className="w-4 h-4 text-white/80" />
        </button>

        {/* App Grid */}
        <div className="grid grid-cols-4 gap-2 p-4 pt-16">
          {APPS.map((app) => (
            <motion.div
              key={app.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleAppClick(app)}
              className={`
                flex flex-col items-center space-y-1
                cursor-pointer select-none
              `}
            >
              <motion.div
                className={`
                  w-12 h-12 rounded-[16px]
                  flex items-center justify-center
                  bg-gradient-to-br ${app.color}
                  shadow-lg shadow-black/20
                  relative overflow-hidden
                  backdrop-blur-sm
                `}
                whileHover={{ 
                  scale: 1.1,
                  boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3)'
                }}
              >
                {app.icon.startsWith('/') ? (
                  <Image
                    src={app.icon}
                    alt={app.name}
                    width={32}
                    height={32}
                    className="object-contain"
                  />
                ) : (
                  <span className="text-2xl">{app.icon}</span>
                )}
              </motion.div>
              <span className="text-white/90 font-medium text-xs">{app.name}</span>
            </motion.div>
          ))}
        </div>

        {/* Loading Screen */}
        <AnimatePresence>
          {selectedApp && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center bg-black/90 backdrop-blur-sm"
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="flex flex-col items-center space-y-4"
              >
                <motion.div
                  className={`
                    w-24 h-24 rounded-[24px]
                    flex items-center justify-center
                    bg-gradient-to-br ${selectedApp.color}
                    shadow-xl shadow-black/30
                    relative
                  `}
                >
                  {selectedApp.icon.startsWith('/') ? (
                    <Image
                      src={selectedApp.icon}
                      alt={selectedApp.name}
                      width={60}
                      height={60}
                      className="object-contain"
                    />
                  ) : (
                    <span className="text-4xl">{selectedApp.icon}</span>
                  )}
                  <motion.div
                    className="absolute -inset-4 rounded-full border-t-2 border-white/20"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                  />
                </motion.div>
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="text-white/80 text-sm font-medium"
                >
                  Opening {selectedApp.name}...
                </motion.div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
} 