'use client';

import * as React from "react"
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface GameCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: 'default' | 'outline' | 'interactive';
  isActive?: boolean;
}

export function GameCard({ 
  children, 
  className, 
  variant = 'default',
  isActive = false,
  ...props 
}: GameCardProps) {
  const baseStyles = "rounded-lg border bg-card text-card-foreground shadow-sm";
  const outlineStyles = variant === 'outline' ? "border-red-500/20" : "";
  const interactiveStyles = variant === 'interactive' 
    ? "hover:bg-white/10 transition-colors duration-200 cursor-pointer" 
    : "";
  const activeStyles = isActive ? "bg-white/10" : "";

  return (
    <motion.div
      whileHover={variant === 'interactive' ? { scale: 1.01 } : undefined}
      className={cn(baseStyles, outlineStyles, interactiveStyles, activeStyles, className)}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function GameCardHeader({ 
  children, 
  className,
  ...props 
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("flex flex-col space-y-1.5 p-6", className)} {...props}>
      {children}
    </div>
  );
}

export function GameCardTitle({ 
  children, 
  className,
  ...props 
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3 className={cn("text-2xl font-semibold leading-none tracking-tight", className)} {...props}>
      {children}
    </h3>
  );
}

export function GameCardDescription({ 
  children, 
  className,
  ...props 
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={cn("text-sm text-muted-foreground", className)} {...props}>
      {children}
    </p>
  );
}

export function GameCardContent({ 
  children, 
  className,
  ...props 
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("p-6 pt-0", className)} {...props}>
      {children}
    </div>
  );
}

export function GameCardFooter({ 
  children, 
  className,
  ...props 
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("flex items-center p-6 pt-0", className)} {...props}>
      {children}
    </div>
  );
}

interface GameCardStatProps {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
  progress?: number;
  color?: 'default' | 'blue' | 'red' | 'green' | 'yellow';
  showBar?: boolean;
  className?: string;
}

export function GameCardStat({ 
  label, 
  value,
  icon,
  progress,
  color = 'default',
  showBar = false,
  className,
  ...props 
}: GameCardStatProps) {
  const colorVariants = {
    default: 'text-white/80',
    blue: 'text-blue-400',
    red: 'text-red-400',
    green: 'text-green-400',
    yellow: 'text-yellow-400'
  };

  const barColorVariants = {
    default: 'bg-white/30',
    blue: 'bg-blue-400',
    red: 'bg-red-400',
    green: 'bg-green-400',
    yellow: 'bg-yellow-400'
  };

  return (
    <div className={cn("relative", className)} {...props}>
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center space-x-2">
          {icon && <div className={colorVariants[color]}>{icon}</div>}
          <p className="text-xs text-white/60">{label}</p>
        </div>
        <div className={cn("text-sm font-medium", colorVariants[color])}>
          {typeof value === 'number' ? `${value}%` : value}
        </div>
      </div>
      {(showBar || progress !== undefined) && (
        <div className="h-1 bg-white/10 rounded-full overflow-hidden">
          <motion.div
            className={cn("h-full", barColorVariants[color])}
            initial={{ width: 0 }}
            animate={{ width: `${progress ?? 0}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      )}
    </div>
  );
}

interface GameCardProgressProps {
  value: number;
  max?: number;
  color?: 'default' | 'blue' | 'red' | 'green' | 'yellow';
  showValue?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function GameCardProgress({
  value,
  max = 100,
  color = 'default',
  showValue = false,
  size = 'md',
  className,
  ...props
}: GameCardProgressProps) {
  const percentage = (value / max) * 100;
  
  const sizeVariants = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3'
  };

  const colorVariants = {
    default: 'bg-white/30',
    blue: 'bg-blue-400',
    red: 'bg-red-400',
    green: 'bg-green-400',
    yellow: 'bg-yellow-400'
  };

  return (
    <div className={cn("w-full", className)} {...props}>
      <div className={cn("relative w-full bg-white/10 rounded-full overflow-hidden", sizeVariants[size])}>
        <motion.div
          className={cn("absolute left-0 top-0 h-full", colorVariants[color])}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>
      {showValue && (
        <div className="mt-1 text-right text-xs text-white/60">
          {value}/{max}
        </div>
      )}
    </div>
  );
} 