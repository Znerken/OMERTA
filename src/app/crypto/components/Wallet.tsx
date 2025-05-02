import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Copy, Send, Clock, ArrowDownRight, ArrowUpRight, CheckCircle2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

interface WalletBalance {
  symbol: string;
  amount: number;
  value: number;
  icon: string;
}

interface Transaction {
  id: string;
  type: 'send' | 'receive';
  amount: number;
  symbol: string;
  address: string;
  status: 'pending' | 'completed' | 'failed';
  timestamp: number;
}

export function Wallet() {
  const [activeTab, setActiveTab] = useState<'assets' | 'send' | 'history'>('assets');
  const [sendAmount, setSendAmount] = useState('');
  const [recipientAddress, setRecipientAddress] = useState('');
  const [selectedCrypto, setSelectedCrypto] = useState('OMRT');

  // Mock wallet data
  const walletAddress = '0x742d35Cc6634C0532925a3b844Bc454e4438f44e';
  const balances: WalletBalance[] = [
    { symbol: 'OMRT', amount: 1.5, value: 1500, icon: '/images/crypto/omrt.png' },
    { symbol: 'BNDT', amount: 25, value: 2500, icon: '/images/crypto/bndt.png' },
    { symbol: 'MFIA', amount: 5, value: 2500, icon: '/images/crypto/mfia.png' },
    { symbol: 'SHDY', amount: 10, value: 2500, icon: '/images/crypto/shdy.png' },
  ];

  const recentTransactions: Transaction[] = [
    {
      id: '0x1234...5678',
      type: 'send',
      amount: 0.5,
      symbol: 'OMRT',
      address: '0x8901...2345',
      status: 'completed',
      timestamp: Date.now() - 3600000,
    },
    {
      id: '0x5678...9012',
      type: 'receive',
      amount: 1.0,
      symbol: 'BNDT',
      address: '0x3456...7890',
      status: 'completed',
      timestamp: Date.now() - 7200000,
    },
    {
      id: '0x9012...3456',
      type: 'send',
      amount: 2.5,
      symbol: 'MFIA',
      address: '0x7890...1234',
      status: 'pending',
      timestamp: Date.now() - 1800000,
    },
  ];

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Address copied to clipboard');
  };

  const handleSend = () => {
    if (!sendAmount || !recipientAddress) {
      toast.error('Please fill in all fields');
      return;
    }

    // Validate address format
    if (!recipientAddress.match(/^0x[a-fA-F0-9]{40}$/)) {
      toast.error('Invalid wallet address');
      return;
    }

    // Validate amount
    const amount = parseFloat(sendAmount);
    const balance = balances.find(b => b.symbol === selectedCrypto);
    if (!balance || amount > balance.amount) {
      toast.error('Insufficient balance');
      return;
    }

    // Simulate transaction
    toast.promise(
      new Promise((resolve) => setTimeout(resolve, 2000)),
      {
        loading: 'Processing transaction...',
        success: 'Transaction submitted successfully',
        error: 'Transaction failed',
      }
    );

    // Reset form
    setSendAmount('');
    setRecipientAddress('');
  };

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-white mb-4">Wallet</h2>
        <div className="bg-gray-700/30 rounded-lg p-4 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-400 mb-1">Your Wallet Address</p>
            <p className="font-mono text-white">{walletAddress}</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => copyToClipboard(walletAddress)}
            className="text-gray-400 hover:text-white"
          >
            <Copy className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="flex space-x-2 mb-6">
        {(['assets', 'send', 'history'] as const).map((tab) => (
          <Button
            key={tab}
            variant={activeTab === tab ? 'default' : 'ghost'}
            onClick={() => setActiveTab(tab)}
            className={`capitalize ${
              activeTab === tab
                ? 'bg-blue-500/20 text-blue-400'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            {tab}
          </Button>
        ))}
      </div>

      {activeTab === 'assets' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          {balances.map((balance) => (
            <motion.div
              key={balance.symbol}
              className="bg-gray-700/30 rounded-lg p-4 flex items-center justify-between"
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 rounded-full overflow-hidden">
                  <img src={balance.icon} alt={balance.symbol} className="w-full h-full object-cover" />
                </div>
                <div>
                  <p className="font-bold text-white">{balance.symbol}</p>
                  <p className="text-sm text-gray-400">{balance.amount.toLocaleString()} tokens</p>
                </div>
              </div>
              <p className="text-white font-bold">${balance.value.toLocaleString()}</p>
            </motion.div>
          ))}
        </motion.div>
      )}

      {activeTab === 'send' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div>
            <label className="block text-sm text-gray-400 mb-2">Select Token</label>
            <select
              value={selectedCrypto}
              onChange={(e) => setSelectedCrypto(e.target.value)}
              className="w-full bg-gray-700/30 border border-gray-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500/50"
            >
              {balances.map((balance) => (
                <option key={balance.symbol} value={balance.symbol}>
                  {balance.symbol} - Balance: {balance.amount}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">Recipient Address</label>
            <input
              type="text"
              value={recipientAddress}
              onChange={(e) => setRecipientAddress(e.target.value)}
              placeholder="0x..."
              className="w-full bg-gray-700/30 border border-gray-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500/50"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">Amount</label>
            <div className="relative">
              <input
                type="number"
                value={sendAmount}
                onChange={(e) => setSendAmount(e.target.value)}
                placeholder="0.00"
                className="w-full bg-gray-700/30 border border-gray-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500/50"
              />
              <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                {selectedCrypto}
              </span>
            </div>
          </div>

          <Button
            onClick={handleSend}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white"
          >
            <Send className="w-4 h-4 mr-2" />
            Send {selectedCrypto}
          </Button>
        </motion.div>
      )}

      {activeTab === 'history' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          {recentTransactions.map((tx) => (
            <motion.div
              key={tx.id}
              className="bg-gray-700/30 rounded-lg p-4"
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  {tx.type === 'send' ? (
                    <ArrowUpRight className="w-4 h-4 text-red-400" />
                  ) : (
                    <ArrowDownRight className="w-4 h-4 text-green-400" />
                  )}
                  <span className="text-white font-medium">
                    {tx.type === 'send' ? 'Sent' : 'Received'} {tx.amount} {tx.symbol}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  {tx.status === 'pending' ? (
                    <Clock className="w-4 h-4 text-yellow-400" />
                  ) : tx.status === 'completed' ? (
                    <CheckCircle2 className="w-4 h-4 text-green-400" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-red-400" />
                  )}
                  <span className={`text-sm ${
                    tx.status === 'pending' ? 'text-yellow-400' :
                    tx.status === 'completed' ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {tx.status.charAt(0).toUpperCase() + tx.status.slice(1)}
                  </span>
                </div>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400 font-mono">{tx.address}</span>
                <span className="text-gray-400">
                  {new Date(tx.timestamp).toLocaleString()}
                </span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
} 