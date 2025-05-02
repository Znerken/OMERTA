import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, AreaChart, Area, BarChart, Bar
} from 'recharts';
import { Settings2, ChevronDown, TrendingUp, TrendingDown } from 'lucide-react';

interface Order {
  price: number;
  amount: number;
  total: number;
  type: 'buy' | 'sell';
}

interface Indicator {
  name: string;
  enabled: boolean;
  color: string;
  settings: {
    period?: number;
    source?: 'close' | 'open' | 'high' | 'low';
  };
}

// Generate mock data for the depth chart
const generateDepthData = (basePrice: number, count: number) => {
  const data = [];
  let cumulative = 0;
  
  // Generate buy orders
  for (let i = count - 1; i >= 0; i--) {
    const price = basePrice * (1 - (Math.random() * 0.1));
    const amount = Math.random() * 10;
    cumulative += amount;
    data.push({
      price,
      amount,
      total: cumulative,
      type: 'buy'
    });
  }

  // Reset cumulative for sell orders
  cumulative = 0;

  // Generate sell orders
  for (let i = 0; i < count; i++) {
    const price = basePrice * (1 + (Math.random() * 0.1));
    const amount = Math.random() * 10;
    cumulative += amount;
    data.push({
      price,
      amount,
      total: cumulative,
      type: 'sell'
    });
  }

  return data.sort((a, b) => a.price - b.price);
};

// Generate mock volume data
const generateVolumeData = (priceData: any[]) => {
  return priceData.map(point => ({
    ...point,
    volume: Math.random() * 1000,
    buyVolume: Math.random() * 500,
    sellVolume: Math.random() * 500
  }));
};

// Calculate technical indicators
const calculateIndicators = (data: any[]) => {
  // Simple Moving Average (SMA)
  const period = 7;
  return data.map((point, index) => {
    if (index < period - 1) return { ...point, sma: null };
    
    const sum = data.slice(index - period + 1, index + 1)
      .reduce((acc, curr) => acc + curr.price, 0);
    
    return {
      ...point,
      sma: sum / period,
      rsi: 50 + (Math.random() * 30 - 15), // Mock RSI data
      macd: Math.random() * 20 - 10, // Mock MACD data
      signal: Math.random() * 20 - 10 // Mock Signal line data
    };
  });
};

export function TradingView({ selectedCrypto, priceData: initialPriceData }: any) {
  const [showSettings, setShowSettings] = useState(false);
  const [indicators, setIndicators] = useState<Indicator[]>([
    { name: 'SMA', enabled: true, color: '#8884d8', settings: { period: 7 } },
    { name: 'RSI', enabled: false, color: '#82ca9d', settings: { period: 14 } },
    { name: 'MACD', enabled: false, color: '#ffc658', settings: {} },
  ]);
  
  // Enhance price data with volume and indicators
  const priceData = calculateIndicators(generateVolumeData(initialPriceData));
  const depthData = generateDepthData(selectedCrypto.price, 20);

  // Mock order book data
  const orderBook = {
    asks: depthData.filter(order => order.type === 'sell').slice(0, 10),
    bids: depthData.filter(order => order.type === 'buy').slice(-10)
  };

  const toggleIndicator = (name: string) => {
    setIndicators(prev =>
      prev.map(ind =>
        ind.name === name ? { ...ind, enabled: !ind.enabled } : ind
      )
    );
  };

  return (
    <div className="grid grid-cols-4 gap-4">
      {/* Main Chart */}
      <div className="col-span-3 bg-gray-800/50 backdrop-blur-sm rounded-lg p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-white">Price Chart</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowSettings(!showSettings)}
            className="text-gray-400 hover:text-white"
          >
            <Settings2 className="w-4 h-4 mr-2" />
            Indicators
          </Button>
        </div>

        {showSettings && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 p-4 bg-gray-700/30 rounded-lg"
          >
            <div className="grid grid-cols-3 gap-4">
              {indicators.map((indicator) => (
                <div
                  key={indicator.name}
                  className="flex items-center space-x-2"
                >
                  <input
                    type="checkbox"
                    checked={indicator.enabled}
                    onChange={() => toggleIndicator(indicator.name)}
                    className="rounded border-gray-600 bg-gray-700 text-blue-500"
                  />
                  <span className="text-white">{indicator.name}</span>
                  {indicator.settings.period && (
                    <input
                      type="number"
                      value={indicator.settings.period}
                      onChange={(e) => {
                        const period = parseInt(e.target.value);
                        setIndicators(prev =>
                          prev.map(ind =>
                            ind.name === indicator.name
                              ? { ...ind, settings: { ...ind.settings, period } }
                              : ind
                          )
                        );
                      }}
                      className="w-16 bg-gray-700 border border-gray-600 rounded px-2 py-1 text-white"
                    />
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        )}

        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="70%">
            <LineChart data={priceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2d374d" />
              <XAxis
                dataKey="time"
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
              />
              <Line
                type="monotone"
                dataKey="price"
                stroke="#3b82f6"
                dot={false}
                strokeWidth={2}
              />
              {indicators[0].enabled && (
                <Line
                  type="monotone"
                  dataKey="sma"
                  stroke={indicators[0].color}
                  dot={false}
                  strokeWidth={1}
                />
              )}
            </LineChart>
          </ResponsiveContainer>

          <ResponsiveContainer width="100%" height="30%">
            <BarChart data={priceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2d374d" />
              <XAxis
                dataKey="time"
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
              />
              <Bar dataKey="buyVolume" fill="#22c55e" stackId="volume" />
              <Bar dataKey="sellVolume" fill="#ef4444" stackId="volume" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Order Book */}
      <div className="col-span-1 space-y-4">
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-4">
          <h3 className="text-lg font-bold text-white mb-4">Order Book</h3>
          
          <div className="space-y-2">
            {/* Sells */}
            <div className="space-y-1">
              {orderBook.asks.map((order, i) => (
                <motion.div
                  key={`ask-${i}`}
                  className="grid grid-cols-3 text-sm"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <span className="text-red-400">${order.price.toFixed(2)}</span>
                  <span className="text-gray-400 text-right">{order.amount.toFixed(4)}</span>
                  <span className="text-gray-500 text-right">${order.total.toFixed(2)}</span>
                </motion.div>
              ))}
            </div>

            {/* Current Price */}
            <div className="border-t border-b border-gray-700 py-2 my-2">
              <div className="text-center text-xl font-bold text-white">
                ${selectedCrypto.price.toFixed(2)}
              </div>
            </div>

            {/* Buys */}
            <div className="space-y-1">
              {orderBook.bids.map((order, i) => (
                <motion.div
                  key={`bid-${i}`}
                  className="grid grid-cols-3 text-sm"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <span className="text-green-400">${order.price.toFixed(2)}</span>
                  <span className="text-gray-400 text-right">{order.amount.toFixed(4)}</span>
                  <span className="text-gray-500 text-right">${order.total.toFixed(2)}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Market Depth */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-4">
          <h3 className="text-lg font-bold text-white mb-4">Market Depth</h3>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={depthData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2d374d" />
                <XAxis
                  dataKey="price"
                  stroke="#6b7280"
                  tick={{ fill: '#6b7280' }}
                />
                <YAxis
                  stroke="#6b7280"
                  tick={{ fill: '#6b7280' }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1f2937',
                    border: 'none',
                    borderRadius: '0.5rem',
                    color: '#fff'
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="total"
                  stroke="#22c55e"
                  fill="#22c55e"
                  fillOpacity={0.2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
} 