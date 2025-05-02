"use client";

import React from 'react';
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/auth/useAuth';
import { useCharacter } from '@/hooks/character/useCharacter';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Loader2, ArrowLeft, Target, Clock, DollarSign, Shield, Users, 
  AlertTriangle, Map, Briefcase, GraduationCap, Star, ChevronDown,
  CheckCircle2, XCircle, AlertCircle, Timer, Zap, Heart, Skull
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';
import Link from 'next/link';
import { AuthWrapper } from '@/components/auth/AuthWrapper';
import Image from 'next/image';

import { Mission, MissionStatus, MissionType, MissionDifficulty } from './types';

interface MissionState extends Mission {
  progress?: number;
  successChance?: number;
  isPending?: boolean;
  errorMessage?: string;
  crewAssigned?: any[];
}

const missionCategories = [
  {
    id: 'combat',
    name: 'Combat',
    icon: Shield,
    color: 'text-red-500',
    bgColor: 'bg-red-500/10',
    borderColor: 'border-red-500/20'
  },
  {
    id: 'stealth',
    name: 'Stealth',
    icon: Users,
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10',
    borderColor: 'border-blue-500/20'
  },
  {
    id: 'diplomacy',
    name: 'Diplomacy',
    icon: Briefcase,
    color: 'text-yellow-500',
    bgColor: 'bg-yellow-500/10',
    borderColor: 'border-yellow-500/20'
  },
  {
    id: 'business',
    name: 'Business',
    icon: DollarSign,
    color: 'text-green-500',
    bgColor: 'bg-green-500/10',
    borderColor: 'border-green-500/20'
  },
  {
    id: 'territory',
    name: 'Territory',
    icon: Map,
    color: 'text-purple-500',
    bgColor: 'bg-purple-500/10',
    borderColor: 'border-purple-500/20'
  }
];

export default function MissionsPage() {
  return (
    <AuthWrapper>
      <MissionsContent />
    </AuthWrapper>
  );
}

function MissionsContent() {
  const [missions, setMissions] = useState<MissionState[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMission, setSelectedMission] = useState<MissionState | null>(null);
  const [activeTab, setActiveTab] = useState<MissionStatus>('Available');
  const [missionProgress, setMissionProgress] = useState<number>(0);
  const [isMissionActive, setIsMissionActive] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showMissionDetails, setShowMissionDetails] = useState(false);
  const [crewSelection, setCrewSelection] = useState<any[]>([]);

  const { user } = useAuth();
  const { character, isLoading: isCharacterLoading, refreshCharacter, updateCharacter } = useCharacter();
  const supabase = createClientComponentClient();

  useEffect(() => {
    if (user && character) {
      fetchMissions();
    }
  }, [user, character, activeTab, selectedCategory]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (isMissionActive) {
        setMissionProgress(prev => {
          if (prev >= 100) {
            setIsMissionActive(false);
            completeMission();
            return 0;
          }
          return prev + 1;
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isMissionActive]);

  const fetchMissions = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('missions')
        .select('*')
        .eq('status', activeTab);

      if (selectedCategory) {
        query = query.eq('type', selectedCategory);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;
      
      const missionsWithState = (data || []).map(mission => {
        // Parse JSON fields if they're strings
        const parsedMission = {
          ...mission,
          reward: typeof mission.reward === 'string' ? JSON.parse(mission.reward) : mission.reward,
          requirements: typeof mission.requirements === 'string' ? JSON.parse(mission.requirements) : mission.requirements,
          success_chance: typeof mission.success_chance === 'string' ? JSON.parse(mission.success_chance) : mission.success_chance,
          special_events: typeof mission.special_events === 'string' ? JSON.parse(mission.special_events) : mission.special_events,
          progress: 0,
        };

        // Ensure requirements.stats is properly parsed
        if (parsedMission.requirements?.stats && typeof parsedMission.requirements.stats === 'string') {
          parsedMission.requirements.stats = JSON.parse(parsedMission.requirements.stats);
        }

        parsedMission.successChance = calculateSuccessChance(parsedMission, character, crewSelection);
        
        return parsedMission;
      });
      
      setMissions(missionsWithState);
    } catch (error) {
      console.error('Error fetching missions:', error);
      toast.error("Failed to fetch missions");
    } finally {
      setLoading(false);
    }
  };

  const calculateCrewContribution = (crew: any, mission: Mission) => {
    const baseContribution = 5;
    let contribution = baseContribution;

    // Role-based bonuses
    if (crew.role === mission.type) {
      contribution += 10;
    }

    // Experience level bonus
    contribution += Math.floor(crew.level / 2);

    // Specialization bonus
    if (crew.specialization && mission.requirements.stats?.[crew.specialization]) {
      contribution += 5;
    }

    return Math.min(contribution, 25); // Cap at 25% contribution
  };

  const calculateSuccessChance = (mission: Mission, character: any, crew: any[] = []) => {
    if (!character) return 0;

    let chance = mission.success_chance.base;

    // Character attribute bonus
    const attributeValue = character.stats?.[mission.success_chance.attribute] || 0;
    chance += (attributeValue * mission.success_chance.bonusPerAttribute);

    // Crew bonus
    const totalCrewContribution = crew.reduce((total, member) => {
      return total + calculateCrewContribution(member, mission);
    }, 0);
    chance += (totalCrewContribution * (mission.success_chance.crewBonus || 1));

    // Equipment bonus
    if (character.equipment) {
      const equipmentBonus = Object.values(character.equipment).reduce((total: number, item: any) => {
        return total + (item?.stats?.[mission.success_chance.attribute] || 0);
      }, 0);
      chance += (equipmentBonus * (mission.success_chance.equipmentBonus || 0.5));
    }

    // Territory bonus
    if (mission.territory && character.territories?.includes(mission.territory)) {
      chance += (mission.success_chance.territoryBonus || 10);
    }

    // Risk level penalties
    switch (mission.riskLevel) {
      case 'High':
        chance *= 0.7;
        break;
      case 'Medium':
        chance *= 0.85;
        break;
      default:
        break;
    }

    return Math.min(Math.max(chance, 5), 95); // Clamp between 5% and 95%
  };

  const calculateMissionOutcome = async (
    mission: Mission,
    character: any,
    crew: any[],
    supabase: any
  ) => {
    const successChance = calculateSuccessChance(mission, character, crew);
    const roll = Math.random() * 100;
    const success = roll <= successChance;

    // Calculate special events
    let specialEvent = null;
    if (mission.special_events && mission.special_events.length > 0) {
      for (const event of mission.special_events) {
        if (Math.random() * 100 <= event.chance) {
          specialEvent = event;
          break;
        }
      }
    }

    // Calculate rewards
    let finalRewards = { ...mission.reward };
    if (success) {
      // Apply bonuses
      if (specialEvent?.rewards) {
        Object.entries(specialEvent.rewards).forEach(([key, value]) => {
          if (typeof value === 'number' && typeof finalRewards[key] === 'number') {
            finalRewards[key] = (finalRewards[key] as number) + value;
          }
        });
      }

      // Apply crew experience bonus
      if (finalRewards.crewExperience && crew.length > 0) {
        const crewBonus = Math.floor(finalRewards.crewExperience / crew.length);
        await Promise.all(crew.map(member => 
          supabase
            .from('crew_members')
            .update({ experience: member.experience + crewBonus })
            .eq('id', member.id)
        ));
      }

      // Territory influence
      if (finalRewards.territoryInfluence && mission.territory) {
        await supabase
          .from('territories')
          .update({ 
            influence: supabase.raw('influence + ?', [finalRewards.territoryInfluence])
          })
          .eq('id', mission.territory);
      }
    } else {
      // Apply penalties for failure
      finalRewards = {
        money: Math.floor(mission.reward.money * 0.2),
        experience: Math.floor(mission.reward.experience * 0.1),
        streetCred: -Math.floor(mission.reward.streetCred * 0.5)
      };

      if (specialEvent?.penalties) {
        Object.entries(specialEvent.penalties).forEach(([key, value]) => {
          if (typeof value === 'number') {
            finalRewards[key] = (finalRewards[key] || 0) - value;
          }
        });
      }
    }

    return {
      success,
      specialEvent,
      rewards: finalRewards
    };
  };

  const handleStartMission = async (mission: Mission) => {
    if (!character) {
      toast.error("No character found");
      return;
    }

    try {
      // Check requirements
      if (character.energy < mission.energyCost) {
        toast.error("Not enough energy to start this mission");
        return;
      }

      if (character.nerve < mission.nerveCost) {
        toast.error("Not enough nerve to start this mission");
        return;
      }

      if (mission.requirements.level && character.level < mission.requirements.level) {
        toast.error("Level requirement not met");
        return;
      }

      if (mission.requirements.crewSize && crewSelection.length < mission.requirements.crewSize) {
        toast.error(`Need at least ${mission.requirements.crewSize} crew members`);
        return;
      }

      // Check required items
      if (mission.requirements.items) {
        const missingItems = mission.requirements.items.filter(
          itemId => !character.inventory?.some(item => item.id === itemId)
        );
        if (missingItems.length > 0) {
          toast.error("Missing required items");
          return;
        }
      }

      // Check stats requirements
      if (mission.requirements.stats) {
        for (const [stat, required] of Object.entries(mission.requirements.stats)) {
          if ((character.stats?.[stat] || 0) < required) {
            toast.error(`${stat.charAt(0).toUpperCase() + stat.slice(1)} stat too low`);
            return;
          }
        }
      }

      // Deduct costs
      await supabase
        .from('characters')
        .update({
          energy: character.energy - mission.energyCost,
          nerve: character.nerve - mission.nerveCost
        })
        .eq('id', character.id);

      // Start mission
      const { error } = await supabase
        .from('missions')
        .update({ 
          status: 'In Progress',
          progress: { 
            current: 0, 
            total: mission.duration,
            startedAt: new Date().toISOString(),
            crew: crewSelection.map(crew => ({
              id: crew.id,
              name: crew.name,
              role: crew.role,
              contribution: calculateCrewContribution(crew, mission)
            }))
          }
        })
        .eq('id', mission.id);

      if (error) throw error;

      setIsMissionActive(true);
      setSelectedMission(mission);
      toast.success("Mission started successfully");
      
      // Start progress updates
      const progressInterval = setInterval(async () => {
        const currentProgress = missionProgress + 1;
        setMissionProgress(currentProgress);

        if (currentProgress >= 100) {
          clearInterval(progressInterval);
          await completeMission(mission);
        }
      }, mission.duration * 10); // Duration is in seconds, we update every 10ms

      fetchMissions();
    } catch (error) {
      console.error('Error starting mission:', error);
      toast.error("Failed to start mission");
    }
  };

  const completeMission = async (mission: Mission) => {
    try {
      const outcome = await calculateMissionOutcome(mission, character, crewSelection, supabase);
      
      // Update mission status
      await supabase
        .from('missions')
        .update({
          status: outcome.success ? 'Completed' : 'Failed',
          last_attempt: {
            success: outcome.success,
            timestamp: new Date().toISOString(),
            statsUsed: character?.stats,
            crewUsed: crewSelection.map(c => c.id),
            specialEvent: outcome.specialEvent
          }
        })
        .eq('id', mission.id);

      // Update character
      const updates: any = {
        money: character.money + outcome.rewards.money,
        experience: character.experience + outcome.rewards.experience,
        street_cred: character.streetCred + outcome.rewards.streetCred
      };

      if (outcome.specialEvent?.penalties?.health) {
        updates.health = Math.max(1, character.health - outcome.specialEvent.penalties.health);
      }

      await supabase
        .from('characters')
        .update(updates)
        .eq('id', character.id);

      // Refresh character data
      refreshCharacter();

      // Show outcome
      if (outcome.success) {
        toast.success("Mission completed successfully!");
        if (outcome.specialEvent) {
          toast.info(outcome.specialEvent.description);
        }
      } else {
        toast.error("Mission failed!");
        if (outcome.specialEvent) {
          toast.error(outcome.specialEvent.description);
        }
      }

      setIsMissionActive(false);
      setMissionProgress(0);
      fetchMissions();
    } catch (error) {
      console.error('Error completing mission:', error);
      toast.error("Failed to complete mission");
    }
  };

  const handleCollectRewards = async (mission: MissionState) => {
    if (!character) return;

    try {
      // Apply rewards
      await applyRewards(mission.reward);

      // Mark mission as collected
      const { error } = await supabase
        .from('missions')
        .update({ collected: true })
        .eq('id', mission.id);

      if (error) throw error;

      toast.success('Rewards collected successfully!');
      fetchMissions();
    } catch (error) {
      console.error('Error collecting rewards:', error);
      toast.error('Failed to collect rewards');
    }
  };

  const applyRewards = async (rewards: any) => {
    if (!character) return;

    const updateData: any = {
      money: character.money + (rewards.money * (character.categoryBonus?.moneyMultiplier || 1)),
      experience: character.experience + (rewards.experience * (character.categoryBonus?.xpMultiplier || 1)),
      streetCred: character.streetCred + (rewards.streetCred || 0)
    };

    if (rewards.statBonuses) {
      Object.entries(rewards.statBonuses).forEach(([stat, value]) => {
        updateData[stat] = (character[stat] || 0) + value;
      });
    }

    if (rewards.territoryControl) {
      // Update territory control
      const { error } = await supabase
        .from('territories')
        .update({ 
          control: character.territories.find(t => t.id === rewards.territoryControl.id).control + rewards.territoryControl.amount
        })
        .eq('id', rewards.territoryControl.id);

      if (error) throw error;
    }

    if (rewards.crewExperience && crewSelection.length > 0) {
      // Update crew experience
      const crewUpdates = crewSelection.map(crew => ({
        id: crew.id,
        experience: crew.experience + rewards.crewExperience
      }));

      const { error } = await supabase
        .from('crew')
        .upsert(crewUpdates);

      if (error) throw error;
    }

    // Update character
    const { error } = await supabase
      .from('characters')
      .update(updateData)
      .eq('id', character.id);

    if (error) throw error;
  };

  const applyPenalties = async (penalties: any) => {
    if (!character) return;

    const updateData: any = {};

    if (penalties.money) {
      updateData.money = Math.max(0, character.money - penalties.money);
    }

    if (penalties.health) {
      updateData.health = Math.max(0, character.health - penalties.health);
    }

    if (penalties.reputation) {
      updateData.reputation = Math.max(0, character.reputation - penalties.reputation);
    }

    const { error } = await supabase
      .from('characters')
      .update(updateData)
      .eq('id', character.id);

    if (error) throw error;
  };

  const addTestData = async () => {
    if (!character) return;

    try {
      const updates = {
        level: 10,
        experience: 5000,
        money: 1000000,
        energy: 100,
        nerve: 100,
        health: 100,
        max_health: 100,
        stamina: 100,
        max_stamina: 100,
        street_cred: 50,
        heat_level: 0,
        family_honor: 25,
        public_image: 30,
        strength: 75,
        agility: 65,
        intelligence: 80,
        charisma: 70,
        endurance: 60,
        luck: 55,
        inventory: [
          {
            id: 'weapon_1',
            name: 'Silenced Pistol',
            type: 'weapon',
            stats: {
              combat: 15,
              stealth: 10
            }
          },
          {
            id: 'armor_1',
            name: 'Bulletproof Vest',
            type: 'armor',
            stats: {
              defense: 20,
              endurance: 10
            }
          }
        ],
        equipment: {
          weapon: {
            id: 'weapon_1',
            name: 'Silenced Pistol',
            type: 'weapon',
            stats: {
              combat: 15,
              stealth: 10
            }
          },
          armor: {
            id: 'armor_1',
            name: 'Bulletproof Vest',
            type: 'armor',
            stats: {
              defense: 20,
              endurance: 10
            }
          }
        },
        territories: ['territory_1', 'territory_2']
      };

      const { error } = await supabase
        .from('characters')
        .update(updates)
        .eq('id', character.id);

      if (error) throw error;

      updateCharacter(updates);
      toast.success('Test data added successfully!');
    } catch (error) {
      console.error('Error adding test data:', error);
      toast.error('Failed to add test data');
    }
  };

  if (isCharacterLoading || loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (!character) {
    return (
      <div className="flex flex-col items-center justify-center h-screen space-y-4">
        <p className="text-lg text-white/60">No character found</p>
        <Button onClick={() => window.location.href = '/create-character'}>
          Create Character
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
              <h1 className="text-3xl font-serif text-yellow-500 drop-shadow-lg">Missions</h1>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-yellow-500" />
                <span className="text-gray-300">{character.energy}</span>
              </div>
              <div className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-red-500" />
                <span className="text-gray-300">{character.nerve}</span>
              </div>
              <Button
                onClick={addTestData}
                className="bg-green-500 hover:bg-green-600"
              >
                Add Test Data
              </Button>
            </div>
          </div>

          {/* Mission Categories */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
            {missionCategories.map(category => (
              <motion.button
                key={category.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedCategory(selectedCategory === category.id ? null : category.id)}
                className={`flex flex-col items-center justify-center p-4 rounded-xl border ${
                  selectedCategory === category.id 
                    ? `${category.borderColor} ${category.bgColor}`
                    : 'border-gray-800 bg-black/40'
                }`}
              >
                <category.icon className={`w-6 h-6 mb-2 ${category.color}`} />
                <span className="text-sm">{category.name}</span>
              </motion.button>
            ))}
          </div>

          {/* Mission Status Tabs */}
          <div className="flex gap-4 mb-8 overflow-x-auto">
            {['Available', 'In Progress', 'Completed', 'Failed'].map(status => (
              <Button
                key={status}
                variant={activeTab === status ? 'default' : 'ghost'}
                onClick={() => setActiveTab(status as MissionStatus)}
                className="text-white"
              >
                {status}
              </Button>
            ))}
          </div>

          {/* Missions Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {missions.map(mission => (
              <motion.div
                key={mission.id}
                className="relative overflow-hidden rounded-xl bg-gradient-to-br from-gray-900/80 to-black/80 border border-gray-800/50 shadow-2xl backdrop-blur-sm"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.02]" />
                <div className="relative p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-white mb-1">{mission.title}</h3>
                      <p className="text-sm text-gray-400">{mission.description}</p>
                    </div>
                    <div className={`p-2 rounded-lg ${missionCategories.find(c => c.id === mission.type)?.bgColor}`}>
                      {React.createElement(missionCategories.find(c => c.id === mission.type)?.icon || Target, {
                        className: `w-6 h-6 ${missionCategories.find(c => c.id === mission.type)?.color}`
                      })}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-gray-400">
                        <Clock className="w-4 h-4" />
                        <span>{mission.duration}s</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-400">
                        <Zap className="w-4 h-4" />
                        <span>{mission.energyCost} Energy</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-400">
                        <Heart className="w-4 h-4" />
                        <span>{mission.nerveCost} Nerve</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-gray-400">
                        <DollarSign className="w-4 h-4" />
                        <span>{mission.reward.money.toLocaleString()} $</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-400">
                        <Star className="w-4 h-4" />
                        <span>{mission.reward.experience} XP</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-400">
                        <AlertTriangle className="w-4 h-4" />
                        <span>Risk: {mission.riskLevel}</span>
                      </div>
                    </div>
                  </div>

                  {mission.status === 'Available' && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-400">Success Chance</span>
                        <span className={`font-semibold ${
                          mission.success_chance >= 70 ? 'text-green-400' :
                          mission.success_chance >= 40 ? 'text-yellow-400' :
                          'text-red-400'
                        }`}>
                          {Math.round(calculateSuccessChance(mission, character, crewSelection))}%
                        </span>
                      </div>
                      <Button
                        className="w-full"
                        onClick={() => {
                          setSelectedMission(mission);
                          setShowMissionDetails(true);
                        }}
                      >
                        Start Mission
                      </Button>
                    </div>
                  )}

                  {mission.status === 'In Progress' && (
                    <div className="space-y-2">
                      <div className="w-full bg-gray-800 rounded-full h-2">
                        <div
                          className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${missionProgress}%` }}
                        />
                      </div>
                      <div className="text-center text-sm text-gray-400">
                        {missionProgress}% Complete
                      </div>
                    </div>
                  )}

                  {(mission.status === 'Completed' || mission.status === 'Failed') && (
                    <div className="space-y-2">
                      <div className={`flex items-center justify-center gap-2 ${
                        mission.status === 'Completed' ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {mission.status === 'Completed' ? (
                          <CheckCircle2 className="w-5 h-5" />
                        ) : (
                          <XCircle className="w-5 h-5" />
                        )}
                        <span>{mission.status}</span>
                      </div>
                      {mission.status === 'Completed' && !mission.collected && (
                        <Button
                          className="w-full bg-green-500 hover:bg-green-600"
                          onClick={() => handleCollectRewards(mission)}
                        >
                          Collect Rewards
                        </Button>
                      )}
                      {mission.lastAttempt?.specialEvent && (
                        <p className="text-sm text-gray-400 mt-2">
                          {mission.lastAttempt.specialEvent.description}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Mission Details Modal */}
        <AnimatePresence>
          {showMissionDetails && selectedMission && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-black/90 border border-gray-800 rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-serif">{selectedMission.title}</h2>
                  <Button
                    variant="ghost"
                    onClick={() => setShowMissionDetails(false)}
                    className="text-white hover:text-red-400"
                  >
                    <XCircle className="w-5 h-5" />
                  </Button>
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-2">Description</h3>
                    <p className="text-gray-400">{selectedMission.description}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-lg font-medium mb-2">Requirements</h3>
                      <div className="space-y-2">
                        {Object.entries(selectedMission.requirements).map(([key, value]) => {
                          if (key === 'stats' && typeof value === 'object') {
                            return Object.entries(value).map(([stat, requirement]) => (
                              <div key={stat} className="flex items-center justify-between">
                                <span className="text-gray-400 capitalize">{stat}</span>
                                <span className="text-white">{requirement}</span>
                              </div>
                            ));
                          }
                          return (
                            <div key={key} className="flex items-center justify-between">
                              <span className="text-gray-400 capitalize">{key}</span>
                              <span className="text-white">{value}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium mb-2">Rewards</h3>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-400">Money</span>
                          <span className="text-yellow-400">${selectedMission.reward.money}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-400">Experience</span>
                          <span className="text-blue-400">{selectedMission.reward.experience} XP</span>
                        </div>
                        {selectedMission.reward.streetCred > 0 && (
                          <div className="flex items-center justify-between">
                            <span className="text-gray-400">Street Cred</span>
                            <span className="text-purple-400">{selectedMission.reward.streetCred}</span>
                          </div>
                        )}
                        {selectedMission.reward.statBonuses && Object.entries(selectedMission.reward.statBonuses).map(([stat, value]) => (
                          <div key={stat} className="flex items-center justify-between">
                            <span className="text-gray-400">{stat}</span>
                            <span className="text-green-400">+{value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {selectedMission.special_events && selectedMission.special_events.length > 0 && (
                    <div>
                      <h3 className="text-lg font-medium mb-2">Special Events</h3>
                      <div className="space-y-2">
                        {selectedMission.special_events.map((event, index) => (
                          <div key={index} className="flex items-start gap-2">
                            <AlertCircle className="w-5 h-5 text-yellow-400 mt-1" />
                            <div>
                              <p className="font-medium">{event.name}</p>
                              <p className="text-sm text-gray-400">{event.description}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex justify-end gap-4">
                    <Button
                      variant="outline"
                      onClick={() => setShowMissionDetails(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={() => {
                        handleStartMission(selectedMission);
                        setShowMissionDetails(false);
                      }}
                    >
                      Start Mission
                    </Button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}