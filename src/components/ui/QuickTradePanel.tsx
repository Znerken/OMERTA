import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './button';
import { Card } from './card';
import { X, DollarSign, TrendingUp, ChevronLeft, ChevronRight } from 'lucide-react';

interface QuickTradePanelProps {
  isOpen: boolean;
  onClose: () => void;
  accountId: string;
}

export function QuickTradePanel({ isOpen, onClose, accountId }: QuickTradePanelProps) {
  const [amount, setAmount] = useState('');
  const [tradeType, setTradeType] = useState<'buy' | 'sell'>('buy');

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 30, stiffness: 300 }}
          className="fixed right-0 top-0 h-full w-96 bg-black/95 border-l border-green-500/30 shadow-2xl backdrop-blur-sm z-50"
        >
          <div className="p-6 h-full flex flex-col">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-xl font-mono text-green-500">Quick Trade</h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="hover:bg-red-500/20 hover:text-red-500 transition-colors"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Trade Type Selector */}
            <div className="flex gap-2 mb-6">
              <Button
                variant={tradeType === 'buy' ? 'default' : 'outline'}
                className={`flex-1 ${
                  tradeType === 'buy'
                    ? 'bg-gradient-to-r from-green-600 to-green-500'
                    : ''
                }`}
                onClick={() => setTradeType('buy')}
              >
                Buy
              </Button>
              <Button
                variant={tradeType === 'sell' ? 'default' : 'outline'}
                className={`flex-1 ${
                  tradeType === 'sell'
                    ? 'bg-gradient-to-r from-red-600 to-red-500'
                    : ''
                }`}
                onClick={() => setTradeType('sell')}
              >
                Sell
              </Button>
            </div>

            {/* Amount Input */}
            <Card className="p-4 mb-6 bg-black/50 border-green-500/30">
              <label className="text-sm text-gray-400 mb-2 block">Amount</label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full bg-transparent border border-green-500/30 rounded-md py-2 pl-10 pr-4 text-green-500 font-mono focus:outline-none focus:border-green-500"
                  placeholder="0.00"
                />
              </div>
            </Card>

            {/* Market Price */}
            <Card className="p-4 mb-6 bg-black/50 border-green-500/30">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Market Price</span>
                <span className="text-green-500 font-mono">$45,123.45</span>
              </div>
            </Card>

            {/* Order Preview */}
            <Card className="p-4 mb-auto bg-black/50 border-green-500/30">
              <h3 className="text-gray-400 mb-3">Order Preview</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-400">Total</span>
                  <span className="text-green-500 font-mono">$0.00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Fee</span>
                  <span className="text-green-500 font-mono">$0.00</span>
                </div>
              </div>
            </Card>

            {/* Action Button */}
            <Button
              className={`mt-6 w-full ${
                tradeType === 'buy'
                  ? 'bg-gradient-to-r from-green-600 to-green-500'
                  : 'bg-gradient-to-r from-red-600 to-red-500'
              }`}
            >
              {tradeType === 'buy' ? 'Place Buy Order' : 'Place Sell Order'}
            </Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
} 