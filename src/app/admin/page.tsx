'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/auth/useAuth';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';
import { 
  Users, 
  Settings, 
  Shield, 
  DollarSign, 
  Target, 
  Clock, 
  Map, 
  Building2,
  AlertTriangle,
  ArrowLeft
} from 'lucide-react';
import Link from 'next/link';
import { AuthWrapper } from '@/components/auth/AuthWrapper';

interface AdminSection {
  id: string;
  name: string;
  icon: any;
  description: string;
  color: string;
}

const adminSections: AdminSection[] = [
  {
    id: 'users',
    name: 'User Management',
    icon: Users,
    description: 'Manage user accounts, roles, and permissions',
    color: 'text-blue-500'
  },
  {
    id: 'characters',
    name: 'Character Management',
    icon: Shield,
    description: 'View and modify character stats, items, and progress',
    color: 'text-green-500'
  },
  {
    id: 'economy',
    name: 'Economy Settings',
    icon: DollarSign,
    description: 'Adjust money rates, prices, and economic factors',
    color: 'text-yellow-500'
  },
  {
    id: 'missions',
    name: 'Mission Editor',
    icon: Target,
    description: 'Create and modify missions, rewards, and requirements',
    color: 'text-red-500'
  },
  {
    id: 'cooldowns',
    name: 'Cooldown Settings',
    icon: Clock,
    description: 'Manage action cooldowns and timers',
    color: 'text-purple-500'
  },
  {
    id: 'territories',
    name: 'Territory Management',
    icon: Map,
    description: 'Configure territories, zones, and control mechanics',
    color: 'text-orange-500'
  },
  {
    id: 'businesses',
    name: 'Business Settings',
    icon: Building2,
    description: 'Manage business types, profits, and mechanics',
    color: 'text-cyan-500'
  },
  {
    id: 'system',
    name: 'System Settings',
    icon: Settings,
    description: 'Configure core game mechanics and systems',
    color: 'text-gray-500'
  }
];

export default function AdminPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const supabase = createClientComponentClient();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <Link href="/dashboard">
            <Button>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {adminSections.map((section) => (
            <Link key={section.id} href={`/admin/${section.id}`}>
              <Card className="p-6 hover:bg-gray-900 transition-colors cursor-pointer">
                <div className="flex items-center gap-4 mb-4">
                  <div className={`p-3 rounded-lg bg-gray-800 ${section.color}`}>
                    <section.icon className="w-6 h-6" />
                  </div>
                  <h2 className="text-xl font-semibold">{section.name}</h2>
                </div>
                <p className="text-gray-400">{section.description}</p>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
} 