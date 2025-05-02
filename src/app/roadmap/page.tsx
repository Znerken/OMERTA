'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Building2,
  Wallet,
  Users, 
  Target,
  Sword,
  Shield,
  Gem,
  Map,
  ArrowLeft,
  DollarSign,
  Building,
  BarChart,
  Phone,
  Smartphone,
  Layout,
  Brush,
  LogOut,
  ArrowRight
} from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface FeatureDetail {
  description: string;
  details: string[];
  impact: string;
  status: 'completed' | 'in-progress' | 'planned';
  progress: number;
}

interface FeatureDetails {
  [key: string]: FeatureDetail;
}

const phases = [
  {
    title: "The Foundation",
    subtitle: "Core Systems & Authentication",
    version: "0.1",
    status: "completed",
    progress: 100,
    icon: <Shield className="w-8 h-8" />,
    items: [
      { text: "Project structure initialization", status: "completed", icon: <Building /> },
      { text: "Frontend and backend setup", status: "completed", icon: <Building /> },
      { text: "Database schema and RLS policies", status: "completed", icon: <Shield /> },
      { text: "Authentication system", status: "completed", icon: <Users /> },
      { text: "Character creation system", status: "completed", icon: <Users /> },
      { text: "Modern dark theme UI", status: "completed", icon: <Layout /> },
      { text: "Basic inventory system", status: "completed", icon: <Gem /> },
      { text: "Player statistics tracking", status: "completed", icon: <BarChart /> }
    ],
    color: "from-green-500/20 to-green-600/10",
    iconColor: "text-green-400",
    progressColor: "bg-green-400",
    date: "Completed"
  },
  {
    title: "The Interface",
    subtitle: "UI/UX Improvements",
    version: "0.2",
    status: "completed",
    progress: 100,
    icon: <Layout className="w-8 h-8" />,
    items: [
      { text: "Grey theme implementation", status: "completed", icon: <Brush /> },
      { text: "Phone app interface", status: "completed", icon: <Phone /> },
      { text: "Dashboard redesign", status: "completed", icon: <Layout /> },
      { text: "Sign out functionality", status: "completed", icon: <LogOut /> },
      { text: "Navigation improvements", status: "completed", icon: <ArrowRight /> },
      { text: "Responsive layouts", status: "completed", icon: <Smartphone /> }
    ],
    color: "from-purple-500/20 to-purple-600/10",
    iconColor: "text-purple-400",
    progressColor: "bg-purple-400",
    date: "Completed"
  },
  {
    title: "The Banking System",
    subtitle: "Financial Operations",
    version: "0.3",
    status: "in-progress",
    progress: 75,
    icon: <Building2 className="w-8 h-8" />,
    items: [
      { text: "Bank account system", status: "completed", icon: <Wallet /> },
      { text: "Transaction history", status: "completed", icon: <BarChart /> },
      { text: "ATM interface", status: "completed", icon: <DollarSign /> },
      { text: "Money laundering mechanics", status: "in-progress", icon: <Building2 /> },
      { text: "ATM skimming minigame", status: "in-progress", icon: <Target /> },
      { text: "Bank robbery system", status: "planned", icon: <Sword /> },
      { text: "Business ownership system", status: "in-progress", icon: <Building /> },
      { text: "Stock market simulation", status: "planned", icon: <BarChart /> },
      { text: "Loan and credit system", status: "planned", icon: <DollarSign /> }
    ],
    color: "from-blue-500/20 to-blue-600/10",
    iconColor: "text-blue-400",
    progressColor: "bg-blue-400",
    date: "In Progress"
  },
  {
    title: "The Operation",
    subtitle: "Core Game Mechanics",
    version: "0.4",
    status: "planned",
    progress: 0,
    icon: <Sword className="w-8 h-8" />,
    items: [
      { text: "Crime system implementation", status: "planned", icon: <Target /> },
      { text: "Basic combat mechanics", status: "planned", icon: <Sword /> },
      { text: "Family system development", status: "planned", icon: <Users /> },
      { text: "Territory control features", status: "planned", icon: <Map /> },
      { text: "Resource management", status: "planned", icon: <Gem /> },
      { text: "Mission system", status: "planned", icon: <Target /> },
      { text: "Vehicle system", status: "planned", icon: <Map /> },
      { text: "Property management", status: "planned", icon: <Building /> },
      { text: "NPC interaction system", status: "planned", icon: <Users /> },
      { text: "Dynamic event system", status: "planned", icon: <Target /> }
    ],
    color: "from-red-500/20 to-red-600/10",
    iconColor: "text-red-400",
    progressColor: "bg-red-400",
    date: "Upcoming"
  },
  {
    title: "The Underworld",
    subtitle: "Advanced Criminal Activities",
    version: "0.5",
    status: "planned",
    progress: 0,
    icon: <Target className="w-8 h-8" />,
    items: [
      { text: "Drug trafficking system", status: "planned", icon: <Gem /> },
      { text: "Weapon smuggling network", status: "planned", icon: <Sword /> },
      { text: "Corruption mechanics", status: "planned", icon: <DollarSign /> },
      { text: "Police interaction system", status: "planned", icon: <Shield /> },
      { text: "Witness intimidation", status: "planned", icon: <Users /> },
      { text: "Evidence tampering", status: "planned", icon: <Target /> }
    ],
    color: "from-gray-500/20 to-gray-600/10",
    iconColor: "text-gray-400",
    progressColor: "bg-gray-400",
    date: "Future"
  }
];

const featureDetails: FeatureDetails = {
  "Grey theme implementation": {
    description: "Modern grey theme with subtle animations and effects.",
    details: [
      "Gradient backgrounds with noise texture",
      "Animated transitions and hover effects",
      "Consistent color scheme across components",
      "Improved visual hierarchy",
      "Enhanced readability and contrast"
    ],
    impact: "Creates a more professional and cohesive visual experience.",
    status: "completed",
    progress: 100
  },
  "Phone app interface": {
    description: "Interactive phone interface for accessing various game features.",
    details: [
      "Realistic phone UI design",
      "App grid with animations",
      "Status bar with indicators",
      "Loading transitions",
      "App navigation system"
    ],
    impact: "Provides an immersive way to access game features.",
    status: "completed",
    progress: 100
  },
  "Bank account system": {
    description: "Comprehensive banking system with automatic account creation and management.",
    details: [
      "Automatic account creation on character creation",
      "Account balance management",
      "Secure transaction system",
      "Account status tracking",
      "Error handling and validation"
    ],
    impact: "Provides essential financial infrastructure for the game economy.",
    status: "completed",
    progress: 100
  },
  "Transaction history": {
    description: "Detailed tracking and display of all financial transactions.",
    details: [
      "Real-time transaction updates",
      "Filterable transaction list",
      "Transaction categories",
      "Transaction details view",
      "Export functionality"
    ],
    impact: "Enables players to track their financial activities and detect suspicious behavior.",
    status: "completed",
    progress: 100
  },
  "ATM interface": {
    description: "User-friendly interface for banking operations with noir theme.",
    details: [
      "Deposit and withdrawal functions",
      "Balance checking",
      "Transfer system",
      "Transaction notifications",
      "Noir-style UI design"
    ],
    impact: "Provides accessible banking functionality with immersive theme.",
    status: "completed",
    progress: 100
  },
  "Money laundering mechanics": {
    description: "Complex system for cleaning illegal money through various businesses.",
    details: [
      "Multiple laundering methods",
      "Risk vs reward mechanics",
      "Detection system",
      "Business front management",
      "Cooldown timers"
    ],
    impact: "Adds depth to the financial gameplay with risk management.",
    status: "in-progress",
    progress: 60
  }
};

const StatusIcon = ({ status }: { status: string }) => {
  switch (status) {
    case 'completed':
      return <CheckCircle2 className="w-5 h-5 text-green-400" />;
    case 'in-progress':
      return <Clock className="w-5 h-5 text-blue-400" />;
    case 'planned':
      return <AlertCircle className="w-5 h-5 text-gray-400" />;
    default:
      return null;
  }
};

const StatusBadge = ({ status }: { status: string }) => {
  const getStatusColor = () => {
    switch (status) {
      case 'completed':
        return 'bg-green-400/10 text-green-400 border-green-400/20';
      case 'in-progress':
        return 'bg-blue-400/10 text-blue-400 border-blue-400/20';
      case 'planned':
        return 'bg-gray-400/10 text-gray-400 border-gray-400/20';
      default:
        return '';
    }
  };

  return (
    <div className={`px-3 py-1 rounded-full text-sm border ${getStatusColor()}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </div>
  );
};

export default function RoadmapPage() {
  const [selectedFeature, setSelectedFeature] = useState<string | null>(null);
  const [selectedPhase, setSelectedPhase] = useState<number>(0);

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
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
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,transparent_0%,rgba(0,0,0,0.5)_100%)]" />
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-8">
            <Link href="/dashboard">
              <Button variant="ghost" className="text-white hover:text-gray-400">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-400 to-gray-600 bg-clip-text text-transparent">
              Development Roadmap
            </h1>
            <div className="w-[100px]" /> {/* Spacer for alignment */}
          </div>

          {/* Phase Navigation */}
          <div className="flex gap-4 mb-8 overflow-x-auto pb-4 scrollbar-thin scrollbar-track-black scrollbar-thumb-gray-800">
            {phases.map((phase, index) => (
              <motion.button
                key={phase.title}
                onClick={() => setSelectedPhase(index)}
                className={cn(
                  "flex-shrink-0 relative overflow-hidden rounded-xl bg-gradient-to-br border shadow-2xl backdrop-blur-sm p-4 min-w-[200px]",
                  selectedPhase === index 
                    ? "from-gray-800/80 to-gray-900/80 border-gray-700/50" 
                    : "from-gray-900/50 to-black/50 border-gray-800/30"
                )}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.02]" />
                <div className="relative">
                  <div className={cn("w-8 h-8 rounded-full mb-2 flex items-center justify-center", phase.iconColor)}>
                    {phase.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-1">{phase.title}</h3>
                  <p className="text-sm text-gray-400 mb-2">{phase.subtitle}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">v{phase.version}</span>
                    <StatusBadge status={phase.status} />
                  </div>
                </div>
              </motion.button>
            ))}
          </div>

          {/* Phase Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedPhase}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-8"
            >
              {/* Features List */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold mb-4 bg-gradient-to-r from-gray-400 to-gray-600 bg-clip-text text-transparent">
                  Features
                </h2>
                <div className="space-y-2">
                  {phases[selectedPhase].items.map((item, index) => (
                    <motion.button
                      key={item.text}
                      onClick={() => setSelectedFeature(item.text)}
                      className={cn(
                        "w-full text-left p-4 rounded-lg transition-all",
                        selectedFeature === item.text
                          ? "bg-gray-800/50 border border-gray-700/50"
                          : "bg-gray-900/30 border border-gray-800/30 hover:bg-gray-800/40"
                      )}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-full bg-gray-800/50">
                            {item.icon}
                          </div>
                          <span className="text-gray-200">{item.text}</span>
                        </div>
                        <StatusIcon status={item.status} />
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Feature Details */}
              <AnimatePresence mode="wait">
                {selectedFeature && featureDetails[selectedFeature] && (
                  <motion.div
                    key={selectedFeature}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="relative overflow-hidden rounded-xl bg-gradient-to-br from-gray-900/80 to-black/80 border border-gray-800/50 shadow-2xl backdrop-blur-sm p-6"
                  >
                    <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.02]" />
                    <div className="relative">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-semibold text-white">{selectedFeature}</h3>
                        <StatusBadge status={featureDetails[selectedFeature].status} />
                      </div>
                      <p className="text-gray-400 mb-6">{featureDetails[selectedFeature].description}</p>
                      
                      <div className="space-y-6">
                        <div>
                          <h4 className="text-sm font-semibold text-gray-300 mb-2">Details</h4>
                          <ul className="space-y-2">
                            {featureDetails[selectedFeature].details.map((detail, index) => (
                              <motion.li
                                key={detail}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="flex items-center gap-2 text-gray-400"
                              >
                                <div className="w-1 h-1 bg-gray-600 rounded-full" />
                                {detail}
                              </motion.li>
                            ))}
                          </ul>
                        </div>

                        <div>
                          <h4 className="text-sm font-semibold text-gray-300 mb-2">Impact</h4>
                          <p className="text-gray-400">{featureDetails[selectedFeature].impact}</p>
                        </div>

                        {featureDetails[selectedFeature].progress < 100 && (
                          <div>
                            <h4 className="text-sm font-semibold text-gray-300 mb-2">Progress</h4>
                            <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${featureDetails[selectedFeature].progress}%` }}
                                transition={{ duration: 1, ease: "easeOut" }}
                                className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full"
                              />
                            </div>
                            <p className="text-sm text-gray-400 mt-1">
                              {featureDetails[selectedFeature].progress}% Complete
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}