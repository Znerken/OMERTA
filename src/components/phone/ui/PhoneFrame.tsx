'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface PhoneFrameProps {
  children: React.ReactNode;
  className?: string;
}

export function PhoneFrame({ children, className }: PhoneFrameProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: 20 }}
      transition={{ duration: 0.2 }}
      className={cn(
        "fixed bottom-24 right-6 w-[420px] h-[720px]",
        // Base phone frame with 3D effect
        "bg-gradient-to-b from-gray-900 via-gray-900 to-black rounded-[3rem] overflow-hidden",
        "shadow-[0_0_0_1px_rgba(255,255,255,0.1),0_0_30px_rgba(0,0,0,0.3),0_0_60px_rgba(0,0,0,0.2)]",
        // Metallic border effect
        "before:content-[''] before:absolute before:inset-0 before:border-[12px] before:border-black before:rounded-[3rem]",
        "before:bg-gradient-to-b before:from-gray-800 before:to-gray-900",
        // Inner shadow and screen effect
        "after:content-[''] after:absolute after:inset-0 after:border-[1px] after:border-gray-700/50 after:rounded-[3rem] after:opacity-50",
        // Screen reflection effect
        "before:before:content-[''] before:before:absolute before:before:inset-0 before:before:bg-gradient-to-br before:before:from-white/5 before:before:to-transparent before:before:rounded-[3rem]",
        className
      )}
    >
      {/* Screen effect with depth */}
      <div className="relative w-full h-full overflow-hidden rounded-[2.75rem]">
        <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.1),transparent_50%)]" />
        
        {/* Content with depth */}
        <div className="relative w-full h-full">
          <div className="absolute inset-0 bg-gradient-to-b from-gray-900/20 to-transparent" />
          {children}
        </div>
      </div>

      {/* Volume buttons with depth */}
      <div className="absolute left-[-2px] top-24 w-[4px] h-12 bg-gray-800 rounded-r-lg shadow-[inset_0_0_4px_rgba(0,0,0,0.5)]" />
      <div className="absolute left-[-2px] top-40 w-[4px] h-12 bg-gray-800 rounded-r-lg shadow-[inset_0_0_4px_rgba(0,0,0,0.5)]" />
      
      {/* Power button with depth */}
      <div className="absolute right-[-2px] top-32 w-[4px] h-12 bg-gray-800 rounded-l-lg shadow-[inset_0_0_4px_rgba(0,0,0,0.5)]" />

      {/* Side reflection */}
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-r from-white/10 to-transparent" />
      <div className="absolute right-0 top-0 bottom-0 w-1 bg-gradient-to-l from-white/10 to-transparent" />
    </motion.div>
  );
} 