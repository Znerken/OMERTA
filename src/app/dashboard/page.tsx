'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useAuthContext } from '@/contexts/AuthContext';
import { useCharacter } from '@/contexts/CharacterContext';
import { usePhone } from '@/components/phone/PhoneProvider';
import { AuthWrapper } from '@/components/auth/AuthWrapper';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import CharacterStats from '@/components/dashboard/CharacterStats';
import CharacterAvatar from '@/components/dashboard/CharacterAvatar';
import KeyStats from '@/components/dashboard/KeyStats';
import {
  User,
  Upload,
  Shield,
  Wallet,
  Users,
  ChevronRight,
  Activity,
  Clock,
  Loader2,
  Phone as PhoneIcon,
  Trophy,
  Target,
  Map,
  Briefcase,
  Zap,
  Brain,
  Star,
  AlertCircle,
  TrendingUp,
  TrendingDown,
  Coins,
  Timer,
  LogOut,
  ArrowRight
} from 'lucide-react';
import Link from 'next/link';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export default function DashboardPage() {
  return (
    <AuthWrapper>
      <DashboardContent />
    </AuthWrapper>
  );
}

function DashboardContent() {
  const { user, signOut } = useAuthContext();
  const { character, isLoading, error, refreshCharacter } = useCharacter();
  const { openPhone } = usePhone();
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const supabase = createClientComponentClient();

  useEffect(() => {
    refreshCharacter();
    checkAdminStatus();
  }, []);

  const checkAdminStatus = async () => {
    if (!user) {
      console.log('No user found');
      return;
    }

    console.log('Checking admin status for user:', user.id);

    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', user.id)
        .single();
      
      console.log('Profile:', profile);
      setIsAdmin(profile?.is_admin || false);
      console.log('Is admin:', profile?.is_admin);
    } catch (error) {
      console.error('Error checking admin status:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-red-900/30 to-black/30 border border-red-900/30 shadow-2xl backdrop-blur-sm p-8">
          <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.02]" />
          <div className="relative flex flex-col items-center gap-4">
            <Loader2 className="w-8 h-8 text-red-500 animate-spin" />
            <p className="text-red-200/70">Loading your profile...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-red-900/30 to-black/30 border border-red-900/30 shadow-2xl backdrop-blur-sm p-8">
          <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.02]" />
          <div className="relative flex flex-col items-center gap-4">
            <p className="text-lg text-red-400">Error loading character: {error.message}</p>
            <Button 
              onClick={() => refreshCharacter()} 
              className="relative overflow-hidden group bg-gradient-to-br from-red-900 to-red-800 hover:from-red-800 hover:to-red-700 border-0"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <span className="relative">Try Again</span>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!character && !isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-red-900/30 to-black/30 border border-red-900/30 shadow-2xl backdrop-blur-sm p-8">
          <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.02]" />
          <div className="relative flex flex-col items-center gap-4">
            <p className="text-lg text-red-200/70">No character found</p>
            <Button 
              onClick={() => window.location.href = '/create-character'} 
              className="relative overflow-hidden group bg-gradient-to-br from-red-900 to-red-800 hover:from-red-800 hover:to-red-700 border-0"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <span className="relative">Create Character</span>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Background Effects */}
      <div className="fixed inset-0">
        <Image
          src="/images/background2.png"
          alt="Background"
          fill
          className="object-cover opacity-20"
          priority
        />
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.02]" />
        <div className="absolute inset-0 bg-gradient-to-b from-gray-900/10 via-transparent to-gray-900/10" />
        {/* Radial gradient for depth */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,transparent_0%,rgba(0,0,0,0.5)_100%)]" />
      </div>

      {/* Sign Out Button */}
      <div className="fixed top-4 right-4 z-50 flex items-center gap-2">
        <Link href="/admin">
          <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-900/80 backdrop-blur-sm hover:bg-gray-800/80 transition-colors">
            <Shield className="w-4 h-4 text-white/80" />
            <span className="text-xs text-white/80">Admin Panel</span>
          </button>
        </Link>
        <button
          onClick={signOut}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-900/80 backdrop-blur-sm hover:bg-gray-800/80 transition-colors"
        >
          <ArrowRight className="w-4 h-4 text-white/80" />
          <span className="text-xs text-white/80">Sign Out</span>
        </button>
      </div>

      <div className="container mx-auto px-4 py-8 relative">
        {/* Phone Button */}
        <motion.button
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={openPhone}
          className="fixed bottom-4 right-4 p-4 rounded-full relative overflow-hidden group bg-gradient-to-br from-gray-900/90 to-gray-800/90 hover:from-gray-800/90 hover:to-gray-700/90 shadow-lg hover:shadow-xl transition-all z-50"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-gray-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(156,163,175,0.2)_0%,transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <PhoneIcon className="w-6 h-6 text-white relative" />
        </motion.button>

        {/* Profile Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-gray-900/80 to-black/80 border border-gray-800/50 shadow-2xl backdrop-blur-sm">
            <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.02]" />
            <div className="absolute inset-0 bg-gradient-to-br from-gray-500/10 to-transparent" />
            {/* Decorative corner accents */}
            <div className="absolute top-0 left-0 w-24 h-24 bg-gradient-to-br from-gray-500/10 to-transparent rounded-br-full" />
            <div className="absolute bottom-0 right-0 w-24 h-24 bg-gradient-to-tl from-gray-500/10 to-transparent rounded-tl-full" />
            <div className="relative p-8">
              <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
                <CharacterAvatar 
                  profileImage={profileImage} 
                  onUpload={() => {/* Handle upload */}} 
                />

                {/* Profile Info */}
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-gray-400 to-gray-600 bg-clip-text text-transparent">
                        {character?.name}
                      </h1>
                      <p className="text-gray-200/70 mb-6">{character?.role}</p>
                    </div>
                  </div>
                  
                  {/* Key Stats */}
                  <KeyStats
                    level={character?.level || 1}
                    money={character?.money || 0}
                    experience={character?.experience || 0}
                    experienceToNextLevel={character?.level ? character.level * 1000 : 1000}
                  />
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Character Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <CharacterStats character={character} />
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
        >
          {[
            { 
              title: 'Missions', 
              icon: Activity, 
              value: 'Available Missions', 
              color: 'from-gray-900/80 to-black/80',
              border: 'border-gray-800/50',
              iconColor: 'text-yellow-500',
              hoverGlow: 'from-yellow-500/20',
              accent: 'bg-yellow-500/10',
              href: '/missions'
            },
            { 
              title: 'Training', 
              icon: Brain, 
              value: 'Improve Skills', 
              color: 'from-gray-900/80 to-black/80',
              border: 'border-gray-800/50',
              iconColor: 'text-blue-500',
              hoverGlow: 'from-blue-500/20',
              accent: 'bg-blue-500/10',
              href: '/training'
            },
            { 
              title: 'Territory', 
              icon: Map, 
              value: 'Control Districts', 
              color: 'from-gray-900/80 to-black/80',
              border: 'border-gray-800/50',
              iconColor: 'text-purple-500',
              hoverGlow: 'from-purple-500/20',
              accent: 'bg-purple-500/10',
              href: '/territory'
            },
            { 
              title: 'Business', 
              icon: Briefcase, 
              value: 'Manage Operations', 
              color: 'from-gray-900/80 to-black/80',
              border: 'border-gray-800/50',
              iconColor: 'text-green-500',
              hoverGlow: 'from-green-500/20',
              accent: 'bg-green-500/10',
              href: '/business'
            },
          ].map((item, index) => (
            <Link key={item.title} href={item.href}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                className={`relative overflow-hidden rounded-xl bg-gradient-to-br ${item.color} border ${item.border} shadow-2xl backdrop-blur-sm group cursor-pointer`}
              >
                <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.02]" />
                <div className={`absolute inset-0 bg-gradient-to-br ${item.hoverGlow} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                {/* Card accent */}
                <div className={`absolute top-0 left-0 w-1 h-24 ${item.accent} rounded-r-full`} />
                <div className="relative p-6">
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-full ${item.accent} ${item.iconColor} relative group-hover:scale-110 transition-transform duration-300`}>
                      <item.icon className="w-6 h-6" />
                      {/* Icon glow */}
                      <div className={`absolute inset-0 rounded-full ${item.accent} blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                    </div>
                    <div>
                      <p className="text-sm text-gray-400/70 mb-1">{item.title}</p>
                      <p className="text-lg font-semibold text-white">{item.value}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </Link>
          ))}
        </motion.div>

        {/* Resource Management */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
        >
          {/* Energy Bar */}
          <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-gray-900/80 to-black/80 border border-gray-800/50 shadow-2xl backdrop-blur-sm">
            <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.02]" />
            <div className="absolute top-0 left-0 w-1 h-24 bg-gray-500/10 rounded-r-full" />
            <div className="relative p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-gray-500/10 text-gray-500">
                    <Zap className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-200/70">Energy</p>
                    <p className="text-lg font-semibold text-white">75/100</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-sm text-gray-400">
                  <Timer className="w-4 h-4" />
                  <span>+5/min</span>
                </div>
              </div>
              <div className="w-full h-2 bg-gray-900/30 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-gray-500 to-gray-600 rounded-full" style={{ width: '75%' }}>
                  <div className="absolute top-0 right-0 h-full w-0.5 bg-gray-200 animate-pulse" />
                </div>
              </div>
            </div>
          </div>

          {/* Stamina Bar */}
          <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-gray-900/80 to-black/80 border border-gray-800/50 shadow-2xl backdrop-blur-sm">
            <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.02]" />
            <div className="absolute top-0 left-0 w-1 h-24 bg-gray-500/10 rounded-r-full" />
            <div className="relative p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-gray-500/10 text-gray-500">
                    <Brain className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-200/70">Stamina</p>
                    <p className="text-lg font-semibold text-white">60/100</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-sm text-gray-400">
                  <Timer className="w-4 h-4" />
                  <span>+3/min</span>
                </div>
              </div>
              <div className="w-full h-2 bg-gray-900/30 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-gray-500 to-gray-600 rounded-full" style={{ width: '60%' }}>
                  <div className="absolute top-0 right-0 h-full w-0.5 bg-gray-200 animate-pulse" />
                </div>
              </div>
            </div>
          </div>

          {/* Daily Reset Timer */}
          <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-gray-900/80 to-black/80 border border-gray-800/50 shadow-2xl backdrop-blur-sm">
            <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.02]" />
            <div className="absolute top-0 left-0 w-1 h-24 bg-gray-500/10 rounded-r-full" />
            <div className="relative p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-gray-500/10 text-gray-500">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-200/70">Daily Reset</p>
                    <p className="text-lg font-semibold text-white">4h 23m</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-sm text-gray-400">
                  <AlertCircle className="w-4 h-4" />
                  <span>2 missions left</span>
                </div>
              </div>
              <div className="w-full h-2 bg-gray-900/30 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-gray-500 to-gray-600 rounded-full" style={{ width: '82%' }}>
                  <div className="absolute top-0 right-0 h-full w-0.5 bg-gray-200 animate-pulse" />
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Activity Feed */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="relative overflow-hidden rounded-xl bg-gradient-to-br from-gray-900/80 to-black/80 border border-gray-800/50 shadow-2xl backdrop-blur-sm mb-8"
        >
          <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.02]" />
          <div className="absolute top-0 left-0 w-24 h-24 bg-gradient-to-br from-gray-500/10 to-transparent rounded-br-full" />
          <div className="relative p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold bg-gradient-to-r from-gray-400 to-gray-600 bg-clip-text text-transparent">
                Recent Activity
              </h2>
              <button className="text-sm text-gray-200/70 hover:text-gray-200 transition-colors">
                View All
              </button>
            </div>
            <div className="space-y-4">
              {[
                {
                  type: 'battle',
                  title: 'Gang War Victory',
                  description: 'Defeated rival gang in District 4',
                  time: '2m ago',
                  icon: Shield,
                  color: 'text-gray-500',
                  bg: 'bg-gray-500/10'
                },
                {
                  type: 'income',
                  title: 'Territory Income',
                  description: '+$25,000 from District 2',
                  time: '15m ago',
                  icon: Coins,
                  color: 'text-gray-500',
                  bg: 'bg-gray-500/10'
                },
                {
                  type: 'mission',
                  title: 'Mission Completed',
                  description: 'Successfully completed "Protect the Base"',
                  time: '1h ago',
                  icon: Trophy,
                  color: 'text-gray-500',
                  bg: 'bg-gray-500/10'
                }
              ].map((activity, index) => (
                <div key={index} className="flex items-start gap-4 p-4 rounded-lg hover:bg-black/20 transition-colors">
                  <div className={`p-2 rounded-full ${activity.bg} ${activity.color}`}>
                    <activity.icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-white">{activity.title}</h3>
                      <span className="text-sm text-gray-200/50">{activity.time}</span>
                    </div>
                    <p className="text-sm text-gray-200/70 mt-1">{activity.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}