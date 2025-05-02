'use client';

import { cn } from '@/lib/utils';
import Image from 'next/image';

interface AppIconProps {
  name: string;
  icon?: string;
  imageSrc?: string;
  color?: string;
  onClick?: () => void;
}

export function AppIcon({ 
  name, 
  icon, 
  imageSrc, 
  color = 'bg-gradient-to-br from-gray-800/80 to-gray-900',
  onClick
}: AppIconProps) {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('AppIcon clicked:', name);
    onClick?.();
  };

  return (
    <div 
      onClick={handleClick}
      className="flex flex-col items-center space-y-2 w-full cursor-pointer"
    >
      <div 
        className={cn(
          "w-16 h-16 rounded-2xl flex items-center justify-center",
          "hover:scale-105 active:scale-95 transition-transform",
          !imageSrc && [color, "shadow-lg"],
          imageSrc && "bg-white/90"
        )}
      >
        {imageSrc ? (
          <Image
            src={imageSrc}
            alt={name}
            width={48}
            height={48}
            className="object-contain"
          />
        ) : (
          <span className="text-2xl">{icon}</span>
        )}
      </div>
      <span className="text-sm font-medium text-white/90">{name}</span>
    </div>
  );
} 