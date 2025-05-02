import { motion } from 'framer-motion';
import { Crown, Coins, Award, TrendingUp } from 'lucide-react';

interface KeyStatsProps {
  level: number;
  money: number;
  experience: number;
  experienceToNextLevel: number;
}

export default function KeyStats({ level, money, experience, experienceToNextLevel }: KeyStatsProps) {
  const formatMoney = (amount: number) => {
    if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(1)}M`;
    } else if (amount >= 1000) {
      return `$${(amount / 1000).toFixed(1)}K`;
    }
    return `$${amount}`;
  };

  const experiencePercent = (experience / experienceToNextLevel) * 100;
  const experienceFormatted = (percent: number) => {
    if (percent >= 100) return 'Ready to Level Up!';
    return `${percent.toFixed(1)}%`;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Level Display */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ scale: 1.02 }}
        className="relative overflow-hidden rounded-xl bg-gradient-to-br from-gray-900/30 to-black/30 border border-gray-800/30 shadow-2xl backdrop-blur-sm group"
      >
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.02]" />
        <div className="absolute inset-0 bg-gradient-to-br from-gray-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="absolute inset-0 bg-gradient-radial-at-tr from-gray-500/20 via-transparent to-transparent" />
        <div className="relative p-6 flex flex-col items-center justify-center">
          <motion.div 
            className="p-3 rounded-full bg-gray-800/40 mb-3 relative"
            animate={{
              boxShadow: [
                '0 0 0 0 rgba(156, 163, 175, 0)',
                '0 0 0 8px rgba(156, 163, 175, 0.1)',
                '0 0 0 0 rgba(156, 163, 175, 0)'
              ]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <Crown className="w-8 h-8 text-yellow-500" />
          </motion.div>
          <div className="text-4xl font-bold text-yellow-500 mb-1">{level}</div>
          <div className="text-sm text-gray-500">Level</div>
          <div className="mt-2 flex items-center gap-1 text-xs text-gray-600">
            <TrendingUp className="w-3 h-3" />
            <span>Prestige Rank {Math.floor(level / 10)}</span>
          </div>
        </div>
      </motion.div>

      {/* Money Display */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ scale: 1.02 }}
        transition={{ delay: 0.1 }}
        className="relative overflow-hidden rounded-xl bg-gradient-to-br from-gray-900/30 to-black/30 border border-gray-800/30 shadow-2xl backdrop-blur-sm group"
      >
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.02]" />
        <div className="absolute inset-0 bg-gradient-to-br from-gray-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="absolute inset-0 bg-gradient-radial-at-tr from-gray-500/20 via-transparent to-transparent" />
        <div className="relative p-6 flex flex-col items-center justify-center">
          <motion.div 
            className="p-3 rounded-full bg-gray-800/40 mb-3"
            animate={{
              boxShadow: [
                '0 0 0 0 rgba(156, 163, 175, 0)',
                '0 0 0 8px rgba(156, 163, 175, 0.1)',
                '0 0 0 0 rgba(156, 163, 175, 0)'
              ]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <Coins className="w-8 h-8 text-green-500" />
          </motion.div>
          <div className="text-3xl font-bold text-green-500 mb-1">{formatMoney(money)}</div>
          <div className="text-sm text-gray-500">Cash</div>
          <div className="mt-2 flex items-center gap-1 text-xs text-gray-600">
            <TrendingUp className="w-3 h-3" />
            <span>+2.5k/hr</span>
          </div>
        </div>
      </motion.div>

      {/* Experience Display */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ scale: 1.02 }}
        transition={{ delay: 0.2 }}
        className="relative overflow-hidden rounded-xl bg-gradient-to-br from-gray-900/30 to-black/30 border border-gray-800/30 shadow-2xl backdrop-blur-sm group"
      >
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.02]" />
        <div className="absolute inset-0 bg-gradient-to-br from-gray-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="absolute inset-0 bg-gradient-radial-at-tr from-gray-500/20 via-transparent to-transparent" />
        <div className="relative p-6 flex flex-col items-center justify-center">
          <motion.div 
            className="p-3 rounded-full bg-gray-800/40 mb-3"
            animate={{
              boxShadow: [
                '0 0 0 0 rgba(156, 163, 175, 0)',
                '0 0 0 8px rgba(156, 163, 175, 0.1)',
                '0 0 0 0 rgba(156, 163, 175, 0)'
              ]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <Award className="w-8 h-8 text-blue-500" />
          </motion.div>
          <div className="text-2xl font-bold text-blue-500 mb-2">
            {experienceFormatted(experiencePercent)}
          </div>
          <div className="w-full h-1 bg-gray-900/30 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${experiencePercent}%` }}
              transition={{ duration: 1 }}
              className="h-full bg-gradient-to-r from-gray-600 to-gray-500 rounded-full relative"
            >
              <motion.div
                className="absolute top-0 right-0 h-full w-1 bg-gray-300"
                animate={{
                  opacity: [0, 1, 0]
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            </motion.div>
          </div>
          <div className="text-sm text-gray-500 mt-2">Experience</div>
          <div className="mt-1 flex items-center gap-1 text-xs text-gray-600">
            <TrendingUp className="w-3 h-3" />
            <span>{experience.toLocaleString()} / {experienceToNextLevel.toLocaleString()}</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
} 