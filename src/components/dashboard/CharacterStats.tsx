import { useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { 
  Shield, Heart, Zap, Brain, Star, Target, 
  Sword, Crosshair, Skull, Crown,
  TrendingUp, TrendingDown
} from 'lucide-react';
import Image from 'next/image';

gsap.registerPlugin(ScrollTrigger);

interface StatCategoryProps {
  title: string;
  icon: React.ReactNode;
  stats: {
    label: string;
    value: number;
    max: number;
    icon: React.ReactNode;
    color: string;
    trend?: {
      value: string;
      isPositive: boolean;
    };
  }[];
}

function StatCategory({ title, icon, stats }: StatCategoryProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      className="relative overflow-hidden rounded-xl bg-gradient-to-br from-gray-900/80 to-black/80 border border-gray-800/50 shadow-2xl backdrop-blur-sm"
    >
      <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.02]" />
      <div className="absolute inset-0 bg-gradient-to-br from-gray-500/10 to-transparent" />
      <div className="relative p-4">
        <div className="flex items-center gap-3 mb-4">
          <motion.div
            className="p-2 rounded-lg bg-gray-800/40"
            animate={{
              boxShadow: [
                '0 0 0 0 rgba(156, 163, 175, 0)',
                '0 0 0 4px rgba(156, 163, 175, 0.1)',
                '0 0 0 0 rgba(156, 163, 175, 0)'
              ]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            {icon}
          </motion.div>
          <h3 className="text-lg font-bold text-red-500">
            {title}
          </h3>
        </div>
        
        <div className="space-y-3">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, x: -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: index * 0.1 }}
              className="relative group/stat"
            >
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <motion.div 
                    className="p-1 rounded bg-gray-800/40"
                    whileHover={{ scale: 1.1 }}
                  >
                    {stat.icon}
                  </motion.div>
                  <span className="text-sm font-medium text-gray-300">{stat.label}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-400/70">
                    {stat.value.toLocaleString()}/{stat.max.toLocaleString()}
                  </span>
                  {stat.trend && (
                    <div className={`flex items-center gap-1 text-xs ${stat.trend.isPositive ? 'text-gray-400' : 'text-gray-500'}`}>
                      {stat.trend.isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                      <span>{stat.trend.value}</span>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="h-2 bg-gray-900/30 rounded-full overflow-hidden">
                <motion.div
                  className={`h-full ${stat.color} rounded-full relative`}
                  initial={{ width: 0 }}
                  animate={{ width: `${(stat.value / stat.max) * 100}%` }}
                  transition={{ duration: 1, delay: index * 0.1 }}
                >
                  <motion.div
                    className="absolute top-0 right-0 h-full w-0.5 bg-gray-300/50"
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

              {/* Tooltip on hover */}
              <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 opacity-0 group-hover/stat:opacity-100 transition-opacity duration-200 pointer-events-none">
                <div className="bg-black/90 text-white text-xs py-1 px-2 rounded shadow-lg whitespace-nowrap">
                  {((stat.value / stat.max) * 100).toFixed(1)}%
                </div>
                <div className="w-2 h-2 bg-black/90 transform rotate-45 absolute -bottom-1 left-1/2 -translate-x-1/2" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export default function CharacterStats({ character }: { character: any }) {
  const categories: StatCategoryProps[] = [
    {
      title: "Vitality",
      icon: <Heart className="w-5 h-5 text-red-500" />,
      stats: [
        {
          label: "Health",
          value: character?.health || 0,
          max: 100,
          icon: <Heart className="w-3.5 h-3.5 text-red-500" />,
          color: "bg-gradient-to-r from-gray-600 to-gray-500",
          trend: { value: "+5/min", isPositive: true }
        },
        {
          label: "Energy",
          value: character?.energy || 0,
          max: 100,
          icon: <Zap className="w-3.5 h-3.5 text-yellow-500" />,
          color: "bg-gradient-to-r from-gray-600 to-gray-500",
          trend: { value: "+1/min", isPositive: true }
        },
        {
          label: "Nerve",
          value: character?.nerve || 0,
          max: 100,
          icon: <Brain className="w-3.5 h-3.5 text-blue-500" />,
          color: "bg-gradient-to-r from-gray-600 to-gray-500",
          trend: { value: "-2/hr", isPositive: false }
        }
      ]
    },
    {
      title: "Combat",
      icon: <Sword className="w-5 h-5 text-orange-500" />,
      stats: [
        {
          label: "Strength",
          value: character?.strength || 0,
          max: 100,
          icon: <Sword className="w-3.5 h-3.5 text-orange-500" />,
          color: "bg-gradient-to-r from-gray-600 to-gray-500",
          trend: { value: "+0.5/hr", isPositive: true }
        },
        {
          label: "Defense",
          value: character?.defense || 0,
          max: 100,
          icon: <Shield className="w-3.5 h-3.5 text-purple-500" />,
          color: "bg-gradient-to-r from-gray-600 to-gray-500",
          trend: { value: "+0.3/hr", isPositive: true }
        },
        {
          label: "Accuracy",
          value: character?.accuracy || 0,
          max: 100,
          icon: <Crosshair className="w-3.5 h-3.5 text-green-500" />,
          color: "bg-gradient-to-r from-gray-600 to-gray-500",
          trend: { value: "+0.2/hr", isPositive: true }
        }
      ]
    },
    {
      title: "Reputation",
      icon: <Crown className="w-5 h-5 text-yellow-500" />,
      stats: [
        {
          label: "Reputation",
          value: character?.reputation || 0,
          max: 1000,
          icon: <Star className="w-3.5 h-3.5 text-yellow-500" />,
          color: "bg-gradient-to-r from-gray-600 to-gray-500",
          trend: { value: "+25/day", isPositive: true }
        },
        {
          label: "Street Cred",
          value: character?.street_cred || 0,
          max: 1000,
          icon: <Target className="w-3.5 h-3.5 text-red-500" />,
          color: "bg-gradient-to-r from-gray-600 to-gray-500",
          trend: { value: "+10/day", isPositive: true }
        },
        {
          label: "Kills",
          value: character?.kills || 0,
          max: 1000,
          icon: <Skull className="w-3.5 h-3.5 text-gray-400" />,
          color: "bg-gradient-to-r from-gray-600 to-gray-500",
          trend: { value: "+3 today", isPositive: true }
        }
      ]
    }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      {categories.map((category, index) => (
        <StatCategory key={category.title} {...category} />
      ))}
    </div>
  );
} 