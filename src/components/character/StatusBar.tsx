'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';

interface StatusBarProps {
  label: string;
  current: number;
  max: number;
  colorClass?: string;
  size?: 'sm' | 'default' | 'lg';
}

export function StatusBar({
  label,
  current,
  max,
  colorClass = 'bg-red-900',
  size = 'default',
}: StatusBarProps) {
  const percentage = (current / max) * 100;
  
  const sizeClasses = {
    sm: 'h-2',
    default: 'h-3',
    lg: 'h-4'
  };

  return (
    <Card variant="default" size="sm" className="w-full">
      <div className="flex items-center justify-between mb-1">
        <span className="text-sm font-medium text-zinc-200">{label}</span>
        <span className="text-sm text-zinc-400">
          {current}/{max}
        </span>
      </div>
      <div className={cn("w-full bg-zinc-800 rounded-full overflow-hidden", sizeClasses[size])}>
        <motion.div
          className={cn("h-full rounded-full", colorClass)}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{
            duration: 0.5,
            ease: "easeOut"
          }}
        />
      </div>
    </Card>
  );
}