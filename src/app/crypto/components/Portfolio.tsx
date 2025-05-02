import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import {
  PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, Area, AreaChart
} from 'recharts';
import { ArrowUp, ArrowDown, TrendingUp, Wallet, DollarSign, BarChart2 } from 'lucide-react';

interface Asset {
  symbol: string;
  amount: number;
  value: number;
  allocation: number;
  profit: number;
  profitPercentage: number;
  history: { timestamp: number; value: number }[];
  icon: string;
}

const COLORS = ['#3b82f6', '#ef4444', '#22c55e', '#f59e0b'];

export function Portfolio() {
  const [timeframe, setTimeframe] = useState('1W');
  
  // Mock portfolio data
  const totalValue = 9000;
  const totalProfit = 1500;
  const profitPercentage = 20;
  
  const assets: Asset[] = [
    {
      symbol: 'OMRT',
      amount: 1.5,
      value: 1500,
      allocation: 40,
      profit: 500,
      profitPercentage: 25,
      history: Array.from({ length: 24 }, (_, i) => ({
        timestamp: Date.now() - (24 - i) * 3600000,
        value: 1500 * (1 + Math.sin(i / 4) * 0.1)
      })),
      icon: '/images/crypto/omrt.png'
    },
    {
      symbol: 'BNDT',
      amount: 25,
      value: 2500,
      allocation: 30,
      profit: 300,
      profitPercentage: 15,
      history: Array.from({ length: 24 }, (_, i) => ({
        timestamp: Date.now() - (24 - i) * 3600000,
        value: 2500 * (1 + Math.cos(i / 4) * 0.1)
      })),
      icon: '/images/crypto/bndt.png'
    },
    {
      symbol: 'MFIA',
      amount: 5,
      value: 2500,
      allocation: 20,
      profit: 400,
      profitPercentage: 18,
      history: Array.from({ length: 24 }, (_, i) => ({
        timestamp: Date.now() - (24 - i) * 3600000,
        value: 2500 * (1 + Math.sin(i / 3) * 0.1)
      })),
      icon: '/images/crypto/mfia.png'
    },
    {
      symbol: 'SHDY',
      amount: 10,
      value: 2500,
      allocation: 10,
      profit: 300,
      profitPercentage: 12,
      history: Array.from({ length: 24 }, (_, i) => ({
        timestamp: Date.now() - (24 - i) * 3600000,
        value: 2500 * (1 + Math.cos(i / 3) * 0.1)
      })),
      icon: '/images/crypto/shdy.png'
    }
  ];

  // Generate portfolio performance data
  const performanceData = Array.from({ length: 24 }, (_, i) => {
    const timestamp = Date.now() - (24 - i) * 3600000;
    return {
      timestamp,
      value: assets.reduce((sum, asset) => {
        const historyPoint = asset.history.find(h => h.timestamp === timestamp);
        return sum + (historyPoint?.value || 0);
      }, 0)
    };
  });

  return (
    <div className="space-y-6">
      {/* Portfolio Overview */}
      <div className="grid grid-cols-4 gap-4">
        <motion.div
          className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center space-x-2 mb-2">
            <Wallet className="w-5 h-5 text-blue-400" />
            <h3 className="text-sm font-medium text-gray-400">Total Value</h3>
          </div>
          <p className="text-2xl font-bold text-white">${totalValue.toLocaleString()}</p>
        </motion.div>

        <motion.div
          className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center space-x-2 mb-2">
            <TrendingUp className="w-5 h-5 text-green-400" />
            <h3 className="text-sm font-medium text-gray-400">Total Profit</h3>
          </div>
          <p className="text-2xl font-bold text-green-400">+${totalProfit.toLocaleString()}</p>
          <p className="text-sm text-green-400">+{profitPercentage}%</p>
        </motion.div>

        <motion.div
          className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center space-x-2 mb-2">
            <DollarSign className="w-5 h-5 text-blue-400" />
            <h3 className="text-sm font-medium text-gray-400">Best Performer</h3>
          </div>
          <p className="text-2xl font-bold text-white">OMRT</p>
          <p className="text-sm text-green-400">+25%</p>
        </motion.div>

        <motion.div
          className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center space-x-2 mb-2">
            <BarChart2 className="w-5 h-5 text-blue-400" />
            <h3 className="text-sm font-medium text-gray-400">Portfolio Health</h3>
          </div>
          <p className="text-2xl font-bold text-white">Excellent</p>
          <p className="text-sm text-gray-400">Well diversified</p>
        </motion.div>
      </div>

      {/* Portfolio Performance Chart */}
      <motion.div
        className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold text-white">Portfolio Performance</h3>
          <div className="flex space-x-2">
            {['1D', '1W', '1M', '1Y'].map((tf) => (
              <Button
                key={tf}
                variant={timeframe === tf ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setTimeframe(tf)}
                className={timeframe === tf ? 'bg-blue-500/20 text-blue-400' : 'text-gray-400'}
              >
                {tf}
              </Button>
            ))}
          </div>
        </div>
        
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={performanceData}>
              <defs>
                <linearGradient id="portfolioGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#2d374d" />
              <XAxis
                dataKey="timestamp"
                tickFormatter={(timestamp) => new Date(timestamp).toLocaleTimeString()}
                stroke="#6b7280"
                tick={{ fill: '#6b7280' }}
              />
              <YAxis
                stroke="#6b7280"
                tick={{ fill: '#6b7280' }}
                domain={['auto', 'auto']}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1f2937',
                  border: 'none',
                  borderRadius: '0.5rem',
                  color: '#fff'
                }}
                formatter={(value: number) => [`$${value.toLocaleString()}`, 'Portfolio Value']}
                labelFormatter={(timestamp) => new Date(timestamp).toLocaleString()}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke="#3b82f6"
                fill="url(#portfolioGradient)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Asset Allocation */}
      <div className="grid grid-cols-3 gap-6">
        <motion.div
          className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h3 className="text-lg font-bold text-white mb-4">Asset Allocation</h3>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={assets}
                  dataKey="allocation"
                  nameKey="symbol"
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                >
                  {assets.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1f2937',
                    border: 'none',
                    borderRadius: '0.5rem',
                    color: '#fff'
                  }}
                  formatter={(value: number) => `${value}%`}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Asset List */}
        <motion.div
          className="col-span-2 bg-gray-800/50 backdrop-blur-sm rounded-lg p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <h3 className="text-lg font-bold text-white mb-4">Assets</h3>
          <div className="space-y-4">
            {assets.map((asset, index) => (
              <motion.div
                key={asset.symbol}
                className="bg-gray-700/30 rounded-lg p-4 flex items-center justify-between"
                whileHover={{ scale: 1.02 }}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 rounded-full overflow-hidden">
                    <img src={asset.icon} alt={asset.symbol} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <p className="font-bold text-white">{asset.symbol}</p>
                    <p className="text-sm text-gray-400">{asset.amount} tokens</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-white">${asset.value.toLocaleString()}</p>
                  <p className={`text-sm flex items-center justify-end ${
                    asset.profitPercentage >= 0 ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {asset.profitPercentage >= 0 ? (
                      <ArrowUp className="w-4 h-4 mr-1" />
                    ) : (
                      <ArrowDown className="w-4 h-4 mr-1" />
                    )}
                    {asset.profitPercentage}%
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
} 