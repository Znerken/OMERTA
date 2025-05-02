'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/auth/useAuth';
import { useCharacter } from '@/hooks/character/useCharacter';
import { AuthWrapper } from '@/components/auth/AuthWrapper';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Building2, Coins, Clock, ChevronRight, DollarSign, 
  BarChart2, Trending, Info, Lock, Award, AlertTriangle,
  CheckCircle, AlertCircle, RefreshCcw, ChevronDown, Plus,
  TrendingUp, Database, Percent, ArrowLeft
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import Image from 'next/image';
import { toast } from 'sonner';
import { useSupabase } from '@/hooks/useSupabase';
import Link from 'next/link';

// Define business types
interface Business {
  id: string;
  name: string;
  description: string;
  cost: number;
  income: number;
  collectionTime: number; // In seconds
  lastCollected: Date | null;
  level: number;
  owned: boolean;
  unlocked: boolean;
  upgradeMultiplier: number;
  upgradeCost: number;
  risk: number;
  icon: string;
  staff: number;
  maxStaff: number;
  staffCost: number;
  staffIncomeBonus: number;
}

// Sample business data as fallback
const businessesData: Business[] = [
  {
    id: 'corner-store',
    name: 'Corner Store',
    description: 'A small convenience store perfect for collecting protection money.',
    cost: 5000,
    income: 500,
    collectionTime: 3600, // 1 hour
    lastCollected: null,
    level: 1,
    owned: false,
    unlocked: true,
    upgradeMultiplier: 1.5,
    upgradeCost: 2500,
    risk: 10,
    icon: 'store',
    staff: 0,
    maxStaff: 3,
    staffCost: 1000,
    staffIncomeBonus: 0.15
  },
  {
    id: 'restaurant',
    name: 'Italian Restaurant',
    description: 'A cozy restaurant that serves as a perfect front for your operations.',
    cost: 25000,
    income: 2000,
    collectionTime: 7200, // 2 hours
    lastCollected: null,
    level: 1,
    owned: false,
    unlocked: true,
    upgradeMultiplier: 1.6,
    upgradeCost: 15000,
    risk: 15,
    icon: 'restaurant',
    staff: 0,
    maxStaff: 5,
    staffCost: 3000,
    staffIncomeBonus: 0.2
  },
  {
    id: 'club',
    name: 'Night Club',
    description: 'A popular nightclub that generates significant income and influence.',
    cost: 100000,
    income: 5000,
    collectionTime: 14400, // 4 hours
    lastCollected: null,
    level: 1,
    owned: false,
    unlocked: true,
    upgradeMultiplier: 1.7,
    upgradeCost: 50000,
    risk: 25,
    icon: 'club',
    staff: 0,
    maxStaff: 8,
    staffCost: 10000,
    staffIncomeBonus: 0.25
  },
  {
    id: 'casino',
    name: 'Underground Casino',
    description: 'An illegal gambling operation that brings in wealthy patrons.',
    cost: 500000,
    income: 15000,
    collectionTime: 28800, // 8 hours
    lastCollected: null,
    level: 1,
    owned: false,
    unlocked: false,
    upgradeMultiplier: 1.8,
    upgradeCost: 250000,
    risk: 40,
    icon: 'casino',
    staff: 0,
    maxStaff: 10,
    staffCost: 25000,
    staffIncomeBonus: 0.3
  },
  {
    id: 'shipping',
    name: 'Shipping Company',
    description: 'A legitimate shipping business that facilitates smuggling operations.',
    cost: 2000000,
    income: 50000,
    collectionTime: 43200, // 12 hours
    lastCollected: null,
    level: 1,
    owned: false,
    unlocked: false,
    upgradeMultiplier: 2.0,
    upgradeCost: 1000000,
    risk: 60,
    icon: 'shipping',
    staff: 0,
    maxStaff: 15,
    staffCost: 100000,
    staffIncomeBonus: 0.4
  }
];

export default function BusinessPage() {
  return (
    <AuthWrapper>
      <div className="relative min-h-screen bg-black text-white">
        {/* Background Image */}
        <div className="fixed inset-0 z-0">
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

        {/* Content */}
        <div className="relative z-10">
          {/* Header */}
          <div className="container mx-auto px-4 py-8">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <Link href="/dashboard">
                  <Button variant="ghost" className="text-gray-300 hover:text-gray-100">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Dashboard
                  </Button>
                </Link>
                <h1 className="text-3xl font-serif text-green-500 drop-shadow-lg">Business</h1>
              </div>
            </div>
          </div>
          <BusinessContent />
        </div>
      </div>
    </AuthWrapper>
  );
}

function BusinessContent() {
  const { user } = useAuth();
  const { character, updateCharacter } = useCharacter();
  const { supabase } = useSupabase();
  const [businesses, setBusinesses] = useState<Business[]>(businessesData);
  const [totalIncome, setTotalIncome] = useState(0);
  const [viewMode, setViewMode] = useState<'all' | 'owned'>('all');
  const [loading, setLoading] = useState(false);
  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(null);
  const [businessStats, setBusinessStats] = useState({
    totalEarned: 0,
    totalUpgrades: 0,
    totalStaffHired: 0
  });

  // Fetch businesses from database or initialize if needed
  useEffect(() => {
    async function fetchBusinesses() {
      if (!character || !user) return;
      
      setLoading(true);
      
      try {
        // Try to fetch user's businesses from Supabase
        const { data: userBusinesses, error } = await supabase
          .from('businesses')
          .select('*')
          .eq('user_id', user.id);
        
        if (error) throw error;
        
        if (userBusinesses && userBusinesses.length > 0) {
          // User already has businesses in the database
          const formattedBusinesses = userBusinesses.map(b => ({
            ...b,
            lastCollected: b.last_collected ? new Date(b.last_collected) : null,
            owned: b.owned || false,
            unlocked: b.unlocked || (b.id === 'casino' && character.level >= 10) || 
                     (b.id === 'shipping' && character.level >= 20) || 
                     !['casino', 'shipping'].includes(b.id)
          }));
          
          setBusinesses(formattedBusinesses);
          calculateTotalIncome(formattedBusinesses);
          
          // Fetch business statistics
          const { data: stats, error: statsError } = await supabase
            .from('business_statistics')
            .select('*')
            .eq('user_id', user.id)
            .single();
            
          if (!statsError && stats) {
            setBusinessStats({
              totalEarned: stats.total_earned || 0,
              totalUpgrades: stats.total_upgrades || 0,
              totalStaffHired: stats.total_staff_hired || 0
            });
          }
        } else {
          // Initialize businesses for new user
          const initialBusinesses = businessesData.map(b => ({
            ...b,
            unlocked: b.unlocked || (b.id === 'casino' && character.level >= 10) || 
                      (b.id === 'shipping' && character.level >= 20)
          }));
          
          // Save initial businesses to database
          const { error: insertError } = await supabase
            .from('businesses')
            .insert(initialBusinesses.map(b => ({
              id: b.id,
              name: b.name,
              description: b.description,
              cost: b.cost,
              income: b.income,
              collection_time: b.collectionTime,
              last_collected: null,
              level: b.level,
              owned: b.owned,
              unlocked: b.unlocked,
              upgrade_multiplier: b.upgradeMultiplier,
              upgrade_cost: b.upgradeCost,
              risk: b.risk,
              icon: b.icon,
              staff: b.staff,
              max_staff: b.maxStaff,
              staff_cost: b.staffCost,
              staff_income_bonus: b.staffIncomeBonus,
              user_id: user.id
            })));
          
          if (insertError) throw insertError;
          
          // Initialize business statistics
          await supabase
            .from('business_statistics')
            .insert({
              user_id: user.id,
              total_earned: 0,
              total_upgrades: 0,
              total_staff_hired: 0
            });
          
          setBusinesses(initialBusinesses);
          calculateTotalIncome(initialBusinesses);
        }
      } catch (error) {
        console.error('Error fetching businesses:', error);
        // Fall back to demo data if database fails
        const demoBusinesses = businessesData.map(business => {
          const owned = character.money >= business.cost * 10;
          const unlocked = business.unlocked || 
                          (business.id === 'casino' && character.level >= 10) ||
                          (business.id === 'shipping' && character.level >= 20);
          
          return {
            ...business,
            owned,
            unlocked,
            lastCollected: owned ? new Date(Date.now() - Math.random() * business.collectionTime * 1000) : null
          };
        });
        
        setBusinesses(demoBusinesses);
        calculateTotalIncome(demoBusinesses);
        toast.error("Failed to connect to database, using demo data");
      } finally {
        setLoading(false);
      }
    }
    
    fetchBusinesses();
  }, [character, user, supabase]);

  // ...existing code...
}