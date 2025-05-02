'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { Signal, Wifi, Battery } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatusBarProps {
  className?: string;
}

export function StatusBar({ className }: StatusBarProps) {
  const [time, setTime] = useState(new Date());
  const [batteryLevel, setBatteryLevel] = useState(Math.floor(Math.random() * 30) + 70);
  const [signalStrength, setSignalStrength] = useState(Math.floor(Math.random() * 4) + 1);
  const [wifiStrength, setWifiStrength] = useState(Math.floor(Math.random() * 4) + 1);

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
      // Randomly update status indicators
      if (Math.random() > 0.8) {
        setBatteryLevel(Math.floor(Math.random() * 30) + 70);
        setSignalStrength(Math.floor(Math.random() * 4) + 1);
        setWifiStrength(Math.floor(Math.random() * 4) + 1);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className={cn(
      "relative w-full h-7 px-5 flex items-center justify-between",
      "bg-transparent backdrop-blur-sm",
      className
    )}>
      {/* Left: Time */}
      <div className="flex-1">
        <span className="text-xs font-medium text-foreground/90">
          {format(time, 'HH:mm')}
        </span>
      </div>

      {/* Center: Notch */}
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-[120px] h-full bg-transparent backdrop-blur-sm flex items-center justify-center gap-2 z-10">
        <div className="w-2 h-2 rounded-full bg-gray-800 shadow-inner" />
        <div className="w-3 h-3 rounded-full bg-gray-800 shadow-inner" />
      </div>

      {/* Right: Status Icons */}
      <div className="flex-1 flex items-center justify-end space-x-1.5">
        <div className="relative">
          <Signal className="w-3.5 h-3.5 text-foreground/90" />
          <div className="absolute -bottom-1 left-0 right-0 flex items-center justify-center gap-0.5">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className={cn(
                  "w-0.5 h-1 rounded-sm",
                  i < signalStrength ? "bg-foreground/90" : "bg-foreground/30"
                )}
              />
            ))}
          </div>
        </div>

        <div className="relative">
          <Wifi className="w-3.5 h-3.5 text-foreground/90" />
          <div className="absolute -bottom-1 left-0 right-0 flex items-center justify-center gap-0.5">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className={cn(
                  "w-0.5 h-1 rounded-sm",
                  i < wifiStrength ? "bg-foreground/90" : "bg-foreground/30"
                )}
              />
            ))}
          </div>
        </div>

        <div className="relative">
          <Battery className="w-4 h-4 text-foreground/90" />
          <div 
            className="absolute inset-0 flex items-center justify-start pl-[3px] pr-[1px]"
            style={{ clipPath: 'inset(35% 0 35% 0)' }}
          >
            <motion.div 
              className="h-full transition-all duration-300"
              style={{ 
                width: `${batteryLevel}%`,
                background: batteryLevel < 20 
                  ? 'rgb(239 68 68)' // red-500
                  : batteryLevel < 50
                  ? 'rgb(234 179 8)' // yellow-500
                  : 'rgb(34 197 94)' // green-500
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
} 