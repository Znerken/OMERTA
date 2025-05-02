'use client';

import { AuthWrapper } from "@/components/auth/AuthWrapper";
import { useCharacter } from "@/hooks/character/useCharacter";
import { 
  TrendingUp, TrendingDown, Clock, DollarSign, Wallet, History, 
  ArrowRight, BarChart3, LogOut, ChevronDown, ChevronUp, Search,
  Settings, Bell, User, Menu, X, ArrowUpRight, ArrowDownRight,
  Layout, PieChart, Activity, Briefcase, LineChart, Globe, ArrowLeft
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import { useSpring, animated } from 'react-spring';
import { Card, Metric, Text, Title, AreaChart as TremorAreaChart, Color } from "@tremor/react";
import { toast } from "react-hot-toast";
import { AppLoader } from '@/components/crypto/AppLoader';

// Sample data for the chart
const generateChartData = () => {
  const data = [];
  for (let i = 0; i < 24; i++) {
    data.push({
      time: `${i}:00`,
      value: Math.random() * 1000 + 500,
      volume: Math.random() * 100
    });
  }
  return data;
};

// Sample crypto data
const cryptoData = [
  {
    symbol: 'OMRT',
    name: 'OmertaCoin',
    price: 1000.00,
    change: 2.5,
    volume: '2.5M',
    marketCap: '100M',
    icon: '/images/crypto/omrt.png',
    chartData: generateChartData(),
    description: 'The official cryptocurrency of the criminal underworld'
  },
  {
    symbol: 'BNDT',
    name: 'BanditCoin',
    price: 100.00,
    change: -1.2,
    volume: '1.2M',
    marketCap: '50M',
    icon: '/images/crypto/bndt.png',
    chartData: generateChartData(),
    description: 'Preferred currency for street-level operations'
  },
  {
    symbol: 'MFIA',
    name: 'MafiaCoin',
    price: 500.00,
    change: 5.8,
    volume: '3.8M',
    marketCap: '75M',
    icon: '/images/crypto/mfia.png',
    chartData: generateChartData(),
    description: 'The most trusted name in organized crime'
  },
  {
    symbol: 'SHDY',
    name: 'ShadowCoin',
    price: 250.00,
    change: -0.5,
    volume: '1.5M',
    marketCap: '25M',
    icon: '/images/crypto/shdy.png',
    chartData: generateChartData(),
    description: 'For those who prefer to stay in the shadows'
  }
];

export default function CryptoPage() {
  return (
    <AuthWrapper>
      <CryptoContent />
    </AuthWrapper>
  );
}

function CryptoContent() {
  const router = useRouter();
  const { character } = useCharacter();
  const [selectedCrypto, setSelectedCrypto] = useState(cryptoData[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSidebar, setShowSidebar] = useState(true);
  const [timeframe, setTimeframe] = useState('24H');
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Animated values using react-spring
  const springs = useSpring({
    from: { price: 0 },
    to: { price: selectedCrypto.price },
    config: { tension: 120, friction: 14 },
  });

  const handleLogout = async () => {
    setIsLoggingOut(true);
    // Wait for animation to complete before redirecting
    setTimeout(() => {
      router.replace('/dashboard');
    }, 500);
  };

  const handleLoaderComplete = () => {
    setIsLoading(false);
  };

  if (isLoading) {
    return <AppLoader onComplete={handleLoaderComplete} />;
  }

  return (
    <motion.div
      initial={{ scale: 1, opacity: 1 }}
      animate={isLoggingOut ? { scale: 0.8, opacity: 0 } : { scale: 1, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      className="min-h-screen bg-[#0A0B0D] text-white overflow-hidden"
    >
      {/* Enhanced Animated Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/10 via-purple-900/10 to-gray-900/10" />
        <div className="absolute inset-0 bg-[url('/images/grid.png')] opacity-5" />
        {/* Animated gradient orbs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      {/* Sidebar with updated navigation */}
      <motion.div 
        initial={{ x: -300 }}
        animate={{ x: showSidebar ? 0 : -300 }}
        className="fixed left-0 top-0 bottom-0 w-64 bg-black/40 backdrop-blur-xl border-r border-white/10 z-50"
      >
        <div className="p-6 h-full flex flex-col">
          <div className="flex flex-col items-center justify-between mb-12">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ 
                type: "spring",
                stiffness: 260,
                damping: 20 
              }}
              className="relative w-40 h-40"
            >
              <Image
                src="/images/apps/coin.png"
                alt="Logo"
                fill
                className="object-contain filter drop-shadow-[0_0_15px_rgba(255,255,255,0.4)]"
              />
            </motion.div>
            <button 
              onClick={() => setShowSidebar(false)}
              className="absolute top-2 right-2 p-1.5 rounded-lg hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-6">
            {/* Enhanced Navigation */}
            <nav className="space-y-1">
              {[
                { name: 'Overview', icon: Layout },
                { name: 'Markets', icon: Globe },
                { name: 'Trading', icon: LineChart },
                { name: 'Portfolio', icon: PieChart },
                { name: 'Activity', icon: Activity },
                { name: 'Assets', icon: Briefcase }
              ].map((item) => (
                <motion.button
                  key={item.name}
                  whileHover={{ x: 5 }}
                  onClick={() => setActiveTab(item.name.toLowerCase())}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
                    activeTab === item.name.toLowerCase() 
                      ? 'bg-white/15 shadow-lg shadow-white/5' 
                      : 'hover:bg-white/5'
                  }`}
                >
                  <item.icon className={`w-5 h-5 ${
                    activeTab === item.name.toLowerCase() 
                      ? 'text-white' 
                      : 'text-white/60'
                  }`} />
                  <span className={
                    activeTab === item.name.toLowerCase() 
                      ? 'text-white font-medium' 
                      : 'text-white/60'
                  }>{item.name}</span>
                </motion.button>
              ))}
            </nav>

            {/* Live Market Overview */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-white/60 px-4">Live Market</h3>
              <div className="space-y-3">
                {cryptoData.map((crypto) => (
                  <motion.button
                    key={crypto.symbol}
                    whileHover={{ scale: 1.02 }}
                    onClick={() => setSelectedCrypto(crypto)}
                    className={`w-full flex items-center justify-between p-3 rounded-xl transition-all ${
                      selectedCrypto.symbol === crypto.symbol
                        ? 'bg-white/15 shadow-lg shadow-white/5'
                        : 'hover:bg-white/5'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <Image
                        src={crypto.icon}
                        alt={crypto.name}
                        width={24}
                        height={24}
                        className="rounded-full"
                      />
                      <div>
                        <p className={`font-medium ${
                          selectedCrypto.symbol === crypto.symbol 
                            ? 'text-white' 
                            : 'text-white/80'
                        }`}>{crypto.symbol}</p>
                        <p className="text-xs text-white/40">${crypto.price.toLocaleString()}</p>
                      </div>
                    </div>
                    <div className={`text-sm ${crypto.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {crypto.change >= 0 ? '+' : ''}{crypto.change}%
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Back to Dashboard Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleLogout}
              className="w-full mt-auto flex items-center gap-3 px-4 py-3 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 transition-colors"
              disabled={isLoggingOut}
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="text-sm font-medium">
                {isLoggingOut ? 'Returning...' : 'Back to Dashboard'}
              </span>
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className={`relative z-10 transition-all duration-300 ${showSidebar ? 'ml-64' : 'ml-0'}`}>
        {/* Enhanced Header */}
        <div className="sticky top-0 z-20 backdrop-blur-xl bg-black/20 border-b border-white/10">
          <div className="px-6 h-16 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {!showSidebar && (
                <div className="flex items-center space-x-4">
                  <button 
                    onClick={() => setShowSidebar(true)}
                    className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
                  >
                    <Menu className="w-5 h-5" />
                  </button>
                  <div className="w-8 h-8 relative">
                    <Image
                      src="/images/apps/coin.png"
                      alt="Logo"
                      fill
                      className="object-contain"
                    />
                  </div>
                </div>
              )}
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40" />
                <input
                  type="text"
                  placeholder="Search markets..."
                  className="w-64 bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-white/20"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button className="p-2 rounded-lg hover:bg-white/10 transition-colors relative group">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-blue-500 rounded-full"></span>
                <div className="absolute right-0 mt-2 w-64 hidden group-hover:block">
                  <div className="bg-black/90 backdrop-blur-xl rounded-xl shadow-xl border border-white/10 p-4">
                    <div className="text-sm font-medium mb-2">Notifications</div>
                    <div className="space-y-2">
                      <div className="text-xs text-white/60">No new notifications</div>
                    </div>
                  </div>
                </div>
              </button>
              <button className="p-2 rounded-lg hover:bg-white/10 transition-colors">
                <Settings className="w-5 h-5" />
              </button>
              <div className="h-8 w-px bg-white/10" />
              <button className="flex items-center space-x-2 px-3 py-1.5 rounded-lg hover:bg-white/10 transition-colors">
                <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center">
                  <User className="w-4 h-4" />
                </div>
                <span className="text-sm">{character?.name || 'Anonymous'}</span>
                <ChevronDown className="w-4 h-4 text-white/40" />
              </button>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="px-6 py-2 flex space-x-6">
            {['Overview', 'Charts', 'Orders', 'Trades', 'Analytics'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab.toLowerCase())}
                className={`text-sm transition-colors ${
                  activeTab === tab.toLowerCase()
                    ? 'text-white border-b-2 border-white pb-2'
                    : 'text-white/40 hover:text-white/60 pb-2'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="p-6 space-y-6">
          {/* Quick Stats Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            {[
              { label: 'Portfolio Value', value: '$25,000.00', change: '+2.5%', icon: Wallet },
              { label: '24h Volume', value: '$1.2M', change: '+5.8%', icon: BarChart3 },
              { label: 'Total Profit', value: '$3,450.00', change: '+12.3%', icon: TrendingUp },
              { label: 'Active Orders', value: '5', change: '2 pending', icon: Clock }
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-white/60">{stat.label}</p>
                    <p className="text-2xl font-bold mt-1">{stat.value}</p>
                    <p className="text-sm text-green-400 mt-1 flex items-center">
                      <ArrowUpRight className="w-4 h-4 mr-1" />
                      {stat.change}
                    </p>
                  </div>
                  <div className="p-3 bg-white/5 rounded-xl">
                    <stat.icon className="w-5 h-5" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Main Chart Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <Image
                    src={selectedCrypto.icon}
                    alt={selectedCrypto.name}
                    width={48}
                    height={48}
                    className="rounded-full"
                  />
                  <div>
                    <h2 className="text-2xl font-bold flex items-center">
                      {selectedCrypto.name}
                      <span className="ml-2 text-white/60 text-sm">{selectedCrypto.symbol}</span>
                    </h2>
                    <div className="text-3xl font-bold mt-1">
                      <animated.span>
                        {springs.price.to(val => `$${val.toFixed(2)}`)}
                      </animated.span>
                      <span className={`ml-2 text-sm ${selectedCrypto.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {selectedCrypto.change >= 0 ? '+' : ''}{selectedCrypto.change}%
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex space-x-2">
                  {['1H', '24H', '7D', '1M', '1Y'].map((period) => (
                    <button
                      key={period}
                      onClick={() => setTimeframe(period)}
                      className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                        timeframe === period 
                          ? 'bg-white/20 text-white' 
                          : 'text-white/60 hover:bg-white/10'
                      }`}
                    >
                      {period}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="h-[400px] mt-6">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={selectedCrypto.chartData}>
                    <defs>
                      <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366F1" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#6366F1" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis 
                      dataKey="time" 
                      stroke="#ffffff20"
                      tick={{ fill: '#ffffff60' }}
                    />
                    <YAxis 
                      stroke="#ffffff20"
                      tick={{ fill: '#ffffff60' }}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#000000dd',
                        border: '1px solid #ffffff20',
                        borderRadius: '8px',
                        padding: '8px'
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="value"
                      stroke="#6366F1"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#colorValue)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Trading Panel */}
            <div className="space-y-6">
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                <h3 className="text-lg font-medium mb-4">Quick Trade</h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm text-white/60">Amount</label>
                    <div className="relative">
                      <input
                        type="text"
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-white/20"
                        placeholder="0.00"
                      />
                      <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/60">
                        {selectedCrypto.symbol}
                      </span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <Button className="w-full bg-green-500/20 hover:bg-green-500/30 text-green-400">
                      Buy
                    </Button>
                    <Button className="w-full bg-red-500/20 hover:bg-red-500/30 text-red-400">
                      Sell
                    </Button>
                  </div>
                </div>
              </div>

              {/* Order Book */}
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                <h3 className="text-lg font-medium mb-4">Order Book</h3>
                <div className="space-y-2">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="flex justify-between text-sm">
                      <span className="text-red-400">${(selectedCrypto.price + (i * 10)).toFixed(2)}</span>
                      <span className="text-white/60">{(Math.random() * 2).toFixed(4)}</span>
                      <span className="text-white/40">${((selectedCrypto.price + (i * 10)) * (Math.random() * 2)).toFixed(2)}</span>
                    </div>
                  ))}
                  <div className="text-sm text-white/80 py-2 border-y border-white/10 my-2">
                    ${selectedCrypto.price.toFixed(2)}
                  </div>
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="flex justify-between text-sm">
                      <span className="text-green-400">${(selectedCrypto.price - (i * 10)).toFixed(2)}</span>
                      <span className="text-white/60">{(Math.random() * 2).toFixed(4)}</span>
                      <span className="text-white/40">${((selectedCrypto.price - (i * 10)) * (Math.random() * 2)).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
} 