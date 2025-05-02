'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/auth/useAuth';
import { useCharacter } from '@/hooks/character/useCharacter';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Loader2, ArrowLeft, GraduationCap, Shield, Target, Users, 
  DollarSign, Clock, Star, Zap, TrendingUp, Search, Filter
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';
import Link from 'next/link';
import Image from 'next/image';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AuthWrapper } from '@/components/auth/AuthWrapper';

interface TrainingMethod {
  id: string;
  name: string;
  description: string;
  attribute: string;
  base_gain: number;
  duration: number;
  energy_cost: number;
  money_cost: number;
  required_level: number;
  type: 'exercise' | 'study' | 'practice';
  icon: string;
}

interface TrainingSession {
  id: string;
  character_id: string;
  method_id: string;
  status: 'not_started' | 'in_progress' | 'completed' | 'failed';
  started_at: string;
  completed_at?: string;
  actual_gain?: number;
  energy_spent: number;
  money_spent: number;
  method: TrainingMethod;
}

interface TrainingMastery {
  id: string;
  character_id: string;
  method_id: string;
  mastery_level: number;
  total_sessions: number;
  total_gains: number;
}

export default function TrainingPage() {
  return (
    <AuthWrapper>
      <TrainingContent />
    </AuthWrapper>
  );
}

function TrainingContent() {
  const [methods, setMethods] = useState<TrainingMethod[]>([]);
  const [sessions, setSessions] = useState<TrainingSession[]>([]);
  const [mastery, setMastery] = useState<TrainingMastery[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAttribute, setSelectedAttribute] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'available' | 'in_progress' | 'completed'>('available');

  const { user } = useAuth();
  const { character, isLoading: isCharacterLoading, refreshCharacter } = useCharacter();
  const supabase = createClientComponentClient();

  useEffect(() => {
    if (user && character) {
      fetchTrainingData();
    }
  }, [user, character]);

  const fetchTrainingData = async () => {
    try {
      setLoading(true);

      // Fetch training methods
      const { data: methodsData, error: methodsError } = await supabase
        .from('training_methods')
        .select('*')
        .order('base_gain', { ascending: true });

      if (methodsError) throw methodsError;

      // Fetch active training sessions
      const { data: sessionsData, error: sessionsError } = await supabase
        .from('training_sessions')
        .select('*, method:training_methods(*)')
        .eq('character_id', character?.id)
        .order('created_at', { ascending: false });

      if (sessionsError) throw sessionsError;

      // Fetch mastery levels
      const { data: masteryData, error: masteryError } = await supabase
        .from('training_mastery')
        .select('*')
        .eq('character_id', character?.id);

      if (masteryError) throw masteryError;

      setMethods(methodsData || []);
      setSessions(sessionsData || []);
      setMastery(masteryData || []);
    } catch (error) {
      console.error('Error fetching training data:', error);
      toast.error("Failed to fetch training data");
    } finally {
      setLoading(false);
    }
  };

  const handleStartTraining = async (method: TrainingMethod) => {
    if (!character) {
      toast.error("No character found");
      return;
    }

    try {
      const { data, error } = await supabase
        .rpc('start_training', {
          p_character_id: character.id,
          p_method_id: method.id
        });

      if (error) throw error;

      toast.success("Training started successfully");
      fetchTrainingData();
      refreshCharacter();
    } catch (error: any) {
      console.error('Error starting training:', error);
      toast.error(error.message || "Failed to start training");
    }
  };

  const handleCompleteTraining = async (sessionId: string) => {
    try {
      const { data, error } = await supabase
        .rpc('complete_training', {
          p_session_id: sessionId
        });

      if (error) throw error;

      toast.success("Training completed successfully");
      fetchTrainingData();
      refreshCharacter();
    } catch (error: any) {
      console.error('Error completing training:', error);
      toast.error(error.message || "Failed to complete training");
    }
  };

  const getMasteryLevel = (methodId: string) => {
    const methodMastery = mastery.find(m => m.method_id === methodId);
    return methodMastery?.mastery_level || 0;
  };

  const getFilteredMethods = () => {
    return methods.filter(method => {
      const matchesAttribute = selectedAttribute === 'all' || method.attribute === selectedAttribute;
      const matchesSearch = method.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          method.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesAttribute && matchesSearch;
    });
  };

  if (isCharacterLoading || loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (!character || !user) {
    return (
      <div className="flex flex-col items-center justify-center h-screen space-y-4">
        <p className="text-lg text-white/60">
          {!user ? "Please log in to access training" : "No character found"}
        </p>
        <Button onClick={() => window.location.href = !user ? '/login' : '/create-character'}>
          {!user ? "Login" : "Create Character"}
        </Button>
      </div>
    );
  }

  return (
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
              <h1 className="text-3xl font-serif text-blue-500 drop-shadow-lg">Training</h1>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-8">
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            {['strength', 'agility', 'intelligence', 'charisma'].map((stat) => (
              <motion.div
                key={stat}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
                onClick={() => setSelectedAttribute(selectedAttribute === stat ? 'all' : stat)}
                className="cursor-pointer"
              >
                <Card className={`p-4 bg-black/70 border ${
                  selectedAttribute === stat ? 'border-red-500' : 'border-red-900/30'
                } backdrop-blur-sm`}>
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg ${
                      selectedAttribute === stat ? 'bg-red-500/20' : 'bg-red-900/20'
                    } border border-red-900/30 flex items-center justify-center`}>
                      {stat === 'strength' && <Shield className="w-5 h-5 text-red-500" />}
                      {stat === 'agility' && <Target className="w-5 h-5 text-red-500" />}
                      {stat === 'intelligence' && <GraduationCap className="w-5 h-5 text-red-500" />}
                      {stat === 'charisma' && <Users className="w-5 h-5 text-red-500" />}
                    </div>
                    <div>
                      <p className="text-sm text-gray-300 capitalize">{stat}</p>
                      <p className="text-lg font-serif text-white">{character[stat]}</p>
                    </div>
                  </div>
                  <div className="mt-2">
                    <Progress value={character[stat]} max={100} className="h-1" />
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Training Methods */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {getFilteredMethods().map((method) => {
              const masteryLevel = getMasteryLevel(method.id);
              const activeSession = sessions.find(
                s => s.method_id === method.id && s.status === 'in_progress'
              );

              return (
                <motion.div
                  key={method.id}
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                >
                  <Card className="relative overflow-hidden bg-black/70 border border-red-900/30 backdrop-blur-sm">
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h2 className="text-xl font-serif">{method.name}</h2>
                          <p className="text-sm text-gray-400">{method.description}</p>
                        </div>
                        <div className={`w-10 h-10 rounded-lg bg-${method.attribute === 'strength' ? 'red' : 
                                                                   method.attribute === 'agility' ? 'green' :
                                                                   method.attribute === 'intelligence' ? 'blue' :
                                                                   'purple'}-900/20 border border-${method.attribute === 'strength' ? 'red' :
                                                                                                    method.attribute === 'agility' ? 'green' :
                                                                                                    method.attribute === 'intelligence' ? 'blue' :
                                                                                                    'purple'}-900/30 flex items-center justify-center`}>
                          <span className="text-xl">{method.icon}</span>
                        </div>
                      </div>

                      <div className="space-y-2 mb-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Star className="w-4 h-4 text-yellow-500" />
                            <span className="text-sm text-gray-400">Mastery Level</span>
                          </div>
                          <span className="text-sm font-serif">{masteryLevel}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Zap className="w-4 h-4 text-blue-500" />
                            <span className="text-sm text-gray-400">Energy Cost</span>
                          </div>
                          <span className="text-sm font-serif">{method.energy_cost}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <DollarSign className="w-4 h-4 text-green-500" />
                            <span className="text-sm text-gray-400">Cost</span>
                          </div>
                          <span className="text-sm font-serif">${method.money_cost}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-red-500" />
                            <span className="text-sm text-gray-400">Duration</span>
                          </div>
                          <span className="text-sm font-serif">{method.duration}m</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <TrendingUp className="w-4 h-4 text-purple-500" />
                            <span className="text-sm text-gray-400">Base Gain</span>
                          </div>
                          <span className="text-sm font-serif">+{method.base_gain}</span>
                        </div>
                      </div>

                      {activeSession ? (
                        <Button
                          className="w-full bg-green-500 hover:bg-green-600"
                          onClick={() => handleCompleteTraining(activeSession.id)}
                        >
                          Complete Training
                        </Button>
                      ) : (
                        <Button
                          className="w-full bg-red-500 hover:bg-red-600"
                          onClick={() => handleStartTraining(method)}
                          disabled={character.energy < method.energy_cost || character.money < method.money_cost}
                        >
                          Start Training
                        </Button>
                      )}
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </main>
      </div>
    </div>
  );
}