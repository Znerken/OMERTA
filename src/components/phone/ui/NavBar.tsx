'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import {
  ChevronLeft,
  Home,
  Search,
  Menu,
  Signal,
  Wifi,
  Battery,
  Settings,
  MessageSquare,
  Phone as PhoneIcon,
  Grid
} from 'lucide-react';

interface NavBarProps {
  title?: string;
  showBack?: boolean;
  onBack?: () => void;
  position: 'top' | 'bottom';
  className?: string;
}

export function NavBar({ title, showBack, onBack, position, className }: NavBarProps) {
  // Status indicators state
  const [time, setTime] = useState(new Date());
  const [batteryLevel, setBatteryLevel] = useState(Math.floor(Math.random() * 30) + 70);
  const [signalStrength, setSignalStrength] = useState(Math.floor(Math.random() * 4) + 1);
  const [wifiStrength, setWifiStrength] = useState(Math.floor(Math.random() * 4) + 1);

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
      if (Math.random() > 0.8) {
        setBatteryLevel(Math.floor(Math.random() * 30) + 70);
        setSignalStrength(Math.floor(Math.random() * 4) + 1);
        setWifiStrength(Math.floor(Math.random() * 4) + 1);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  if (position === 'top') {
    return (
      <div className={cn(
        "relative w-full h-12 px-4 flex items-center justify-between",
        "bg-transparent backdrop-blur-sm",
        "border-b border-white/5",
        className
      )}>
        {/* Left: Back button */}
        <div className="flex-1 flex items-center">
          {showBack && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onBack}
              className="p-2 -ml-2 rounded-full hover:bg-primary-foreground/10 transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-primary-foreground/90" />
            </motion.button>
          )}
        </div>

        {/* Center: Title */}
        {title && (
          <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-sm font-medium text-primary-foreground">
            {title}
          </span>
        )}

        {/* Right: Empty space for symmetry */}
        <div className="flex-1" />
      </div>
    );
  }

  return (
    <div className={cn(
      "relative w-full h-20 px-6 flex items-center justify-between",
      "bg-transparent backdrop-blur-sm",
      "border-t border-white/5",
      "safe-area-bottom",
      className
    )}>
      {/* Bottom Navigation Icons */}
      <motion.button
        whileHover={{ scale: 1.05, y: -2 }}
        whileTap={{ scale: 0.95 }}
        className="flex flex-col items-center space-y-1.5"
      >
        <div className="w-12 h-12 rounded-2xl bg-primary-foreground/10 flex items-center justify-center">
          <PhoneIcon className="w-6 h-6 text-primary-foreground/90" />
        </div>
        <span className="text-xs font-medium text-primary-foreground/70">Phone</span>
      </motion.button>

      <motion.button
        whileHover={{ scale: 1.05, y: -2 }}
        whileTap={{ scale: 0.95 }}
        className="flex flex-col items-center space-y-1.5"
      >
        <div className="w-12 h-12 rounded-2xl bg-primary-foreground/10 flex items-center justify-center">
          <MessageSquare className="w-6 h-6 text-primary-foreground/90" />
        </div>
        <span className="text-xs font-medium text-primary-foreground/70">Messages</span>
      </motion.button>

      <motion.button
        whileHover={{ scale: 1.05, y: -2 }}
        whileTap={{ scale: 0.95 }}
        className="flex flex-col items-center space-y-1.5"
      >
        <div className="w-12 h-12 rounded-2xl bg-primary-foreground/10 flex items-center justify-center">
          <Grid className="w-6 h-6 text-primary-foreground/90" />
        </div>
        <span className="text-xs font-medium text-primary-foreground/70">Apps</span>
      </motion.button>

      <motion.button
        whileHover={{ scale: 1.05, y: -2 }}
        whileTap={{ scale: 0.95 }}
        className="flex flex-col items-center space-y-1.5"
      >
        <div className="w-12 h-12 rounded-2xl bg-primary-foreground/10 flex items-center justify-center">
          <Settings className="w-6 h-6 text-primary-foreground/90" />
        </div>
        <span className="text-xs font-medium text-primary-foreground/70">Settings</span>
      </motion.button>
    </div>
  );
} 