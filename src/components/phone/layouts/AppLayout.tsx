import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { StatusBar } from '../ui/StatusBar';

interface AppLayoutProps {
  children: React.ReactNode;
  title: string;
  onBack?: () => void;
  headerClassName?: string;
  contentClassName?: string;
  showStatusBar?: boolean;
  rightAction?: React.ReactNode;
}

export function AppLayout({
  children,
  title,
  onBack,
  headerClassName,
  contentClassName,
  showStatusBar = true,
  rightAction
}: AppLayoutProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="h-full flex flex-col"
    >
      {showStatusBar && <StatusBar />}
      
      <header className={cn(
        "relative flex items-center px-4 h-14",
        "bg-gradient-to-b from-black/40 to-transparent backdrop-blur-sm",
        "border-b border-white/5",
        headerClassName
      )}>
        {onBack && (
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onBack}
            className="absolute left-2 p-2 rounded-full hover:bg-white/10 transition-colors"
          >
            <svg
              className="w-5 h-5 text-white/80"
              fill="none"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </motion.button>
        )}
        
        <h1 className="flex-1 text-center text-base font-semibold text-white/90 drop-shadow-[0_0_2px_rgba(255,255,255,0.3)]">
          {title}
        </h1>

        {rightAction && (
          <motion.div 
            className="absolute right-2"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2, delay: 0.1 }}
          >
            {rightAction}
          </motion.div>
        )}
      </header>

      <main className={cn(
        "flex-1 overflow-y-auto",
        "scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/20",
        "bg-gradient-to-b from-gray-900/50 to-black/50",
        "before:content-[''] before:absolute before:inset-0 before:bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.1),transparent_50%)]",
        contentClassName
      )}>
        <div className="relative z-10">
          {children}
        </div>
      </main>
    </motion.div>
  );
} 