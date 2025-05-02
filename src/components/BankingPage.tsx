'use client';

import { useState, useEffect } from 'react';
import { useCharacter } from '@/hooks/character/useCharacter';
import { useSupabase } from '@/hooks/useSupabase';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { toast } from 'react-hot-toast';
import { QuickTradePanel } from '@/components/ui/QuickTradePanel';
import { 
  DollarSign, 
  CreditCard, 
  ArrowLeftRight, 
  PiggyBank, 
  Building2, 
  Globe, 
  X, 
  Check,
  ArrowLeft,
  ArrowRight,
  LogOut
} from 'lucide-react';
import { useRouter } from 'next/navigation';

type AccountType = 'checking' | 'savings' | 'business' | 'offshore';
type TransactionType = 'deposit' | 'withdrawal' | 'transfer';

interface BankAccount {
  id: string;
  account_number: string;
  account_type: AccountType;
  balance: number;
  interest_rate: number;
  max_balance: number;
  daily_withdrawal_limit: number;
  is_active: boolean;
}

export default function BankingPage() {
  const { character } = useCharacter();
  const { supabase } = useSupabase();
  const router = useRouter();
  const [accounts, setAccounts] = useState<BankAccount[]>([]);
  const [selectedAccount, setSelectedAccount] = useState<BankAccount | null>(null);
  const [amount, setAmount] = useState<string>('');
  const [transactionType, setTransactionType] = useState<TransactionType | null>(null);
  const [transferAccount, setTransferAccount] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [showCard, setShowCard] = useState(true);
  const [isQuickTradeOpen, setIsQuickTradeOpen] = useState(false);

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    if (!character) return;
    
    const { data, error } = await supabase
        .from('bank_accounts')
        .select('*')
      .eq('character_id', character.id)
        .eq('is_active', true);

    if (error) {
      toast.error('Failed to fetch accounts');
      return;
    }

    setAccounts(data || []);
    if (data && data.length > 0) {
      setSelectedAccount(data[0]);
    }
  };

  const handleNumberPress = (num: string) => {
    if (amount.length >= 10) return;
    setAmount(prev => prev + num);
  };

  const handleClear = () => {
    setAmount('');
  };

  const handleBackspace = () => {
    setAmount(prev => prev.slice(0, -1));
  };

  const handleTransaction = async () => {
    if (!selectedAccount || !amount || !transactionType) return;
    
    setIsLoading(true);
    const amountNum = parseInt(amount);

    try {
      let response;
      switch (transactionType) {
        case 'deposit':
          response = await supabase.rpc('process_transaction', {
            p_to_account: selectedAccount.id,
            p_amount: amountNum,
            p_type: 'deposit'
          });
          break;
        case 'withdrawal':
          response = await supabase.rpc('process_transaction', {
            p_from_account: selectedAccount.id,
            p_amount: amountNum,
            p_type: 'withdrawal'
          });
          break;
        case 'transfer':
          if (!transferAccount) {
            toast.error('Please enter recipient account number');
            return;
          }
          response = await supabase.rpc('process_transaction', {
            p_from_account: selectedAccount.id,
            p_to_account: transferAccount,
            p_amount: amountNum,
            p_type: 'transfer'
          });
          break;
      }

      if (response.error) {
        throw response.error;
      }

      toast.success('Transaction completed successfully');
      setAmount('');
      setTransactionType(null);
      setTransferAccount('');
      fetchAccounts();
    } catch (error: any) {
      toast.error(error.message || 'Transaction failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      router.push('/');
    } catch (error) {
      toast.error('Failed to logout');
    }
  };

  const renderScreen = () => {
    if (!selectedAccount) {
      return (
        <div className="text-center p-8">
          <h2 className="text-2xl font-mono text-green-500 mb-4">No Active Accounts</h2>
          <p className="text-gray-400">Please open a new account to begin banking.</p>
        </div>
      );
    }

    if (transactionType === 'transfer' && !transferAccount) {
      return (
        <div className="p-8">
          <h2 className="text-xl font-mono text-green-500 mb-4">Enter Recipient Account</h2>
          <div className="space-y-4">
            <input
              type="text"
              value={transferAccount}
              onChange={(e) => setTransferAccount(e.target.value)}
              placeholder="Account Number"
              className="w-full p-4 bg-black/50 border border-green-500/30 rounded-lg font-mono text-green-500"
            />
            <div className="flex gap-4">
            <Button
                variant="outline"
                onClick={() => setTransactionType(null)}
                className="flex-1"
            >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
            </Button>
              <Button
                onClick={() => setTransferAccount('')}
                className="flex-1"
              >
                Clear
              </Button>
            </div>
                </div>
              </div>
      );
    }

    return (
      <div className="p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-mono text-green-500">
            {selectedAccount.account_type.toUpperCase()}
          </h2>
          <span className="text-gray-400 font-mono">
            #{selectedAccount.account_number}
          </span>
                </div>
        
        <div className="space-y-6">
          <div className="bg-black/50 p-4 rounded-lg border border-green-500/30">
            <p className="text-gray-400 font-mono">Balance</p>
            <p className="text-3xl font-mono text-green-500">
              ${selectedAccount.balance.toLocaleString()}
            </p>
              </div>

          {transactionType ? (
            <div className="space-y-4">
              <div className="bg-black/50 p-4 rounded-lg border border-green-500/30">
                <p className="text-gray-400 font-mono">Amount</p>
                <p className="text-2xl font-mono text-green-500">
                  ${amount || '0'}
                </p>
              </div>
              <div className="flex gap-4">
                <Button
                  variant="outline"
                  onClick={() => setTransactionType(null)}
                  className="flex-1"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
                <Button
                  onClick={handleTransaction}
                  disabled={!amount || isLoading}
                  className="flex-1"
                >
                  {isLoading ? 'Processing...' : 'Confirm'}
                </Button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              <Button
                variant="outline"
                onClick={() => setTransactionType('deposit')}
                className="h-24 flex flex-col items-center justify-center"
              >
                <ArrowRight className="w-6 h-6 mb-2" />
                Deposit
              </Button>
              <Button
                variant="outline"
                onClick={() => setTransactionType('withdrawal')}
                className="h-24 flex flex-col items-center justify-center"
              >
                <ArrowLeft className="w-6 h-6 mb-2" />
                Withdraw
              </Button>
              <Button
                variant="outline"
                onClick={() => setTransactionType('transfer')}
                className="h-24 flex flex-col items-center justify-center"
              >
                <ArrowLeftRight className="w-6 h-6 mb-2" />
                Transfer
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowCard(false)}
                className="h-24 flex flex-col items-center justify-center"
              >
                <X className="w-6 h-6 mb-2" />
                Eject Card
              </Button>
            </div>
                      )}
                    </div>
                  </div>
    );
  };

  const renderKeypad = () => {
    if (!transactionType) return null;

    return (
      <div className="grid grid-cols-3 gap-4 p-4">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 'C', 0, '⌫'].map((num) => (
          <Button
            key={num}
            variant="outline"
            onClick={() => {
              if (num === 'C') handleClear();
              else if (num === '⌫') handleBackspace();
              else handleNumberPress(num.toString());
            }}
            className="h-16 text-xl font-mono"
          >
            {num}
          </Button>
              ))}
            </div>
    );
  };

  if (!showCard) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center"
        >
          <CreditCard className="w-32 h-32 mx-auto text-green-500 mb-4" />
          <h2 className="text-2xl font-mono text-green-500 mb-2">Card Ejected</h2>
          <p className="text-gray-400 mb-4">Please take your card</p>
          <Button onClick={() => setShowCard(true)}>
            Insert Card
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-b from-black via-black/95 to-black/90 text-white p-4 md:p-8"
    >
      {/* Logout Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleLogout}
        className="fixed left-6 top-6 bg-red-500/20 hover:bg-red-500/30 text-red-400 p-3 rounded-full shadow-lg hover:shadow-red-500/20 transition-all flex items-center gap-2"
      >
        <LogOut className="w-5 h-5" />
        <span className="text-sm font-mono">Logout</span>
      </motion.button>

      {/* Quick Trade Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsQuickTradeOpen(true)}
        className="fixed right-6 bottom-6 bg-gradient-to-r from-green-600 to-green-500 p-4 rounded-full shadow-lg hover:shadow-green-500/20 transition-shadow"
      >
        <DollarSign className="w-6 h-6" />
      </motion.button>

      {/* Quick Trade Panel */}
      <QuickTradePanel
        isOpen={isQuickTradeOpen}
        onClose={() => setIsQuickTradeOpen(false)}
        accountId={selectedAccount?.id || ''}
      />

      <div className="max-w-6xl mx-auto">
        {/* Account Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {accounts.map((account) => (
            <motion.div
              key={account.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Card
                className={`p-6 cursor-pointer transition-colors ${
                  selectedAccount?.id === account.id
                    ? 'bg-green-500/10 border-green-500'
                    : 'bg-black/50 border-green-500/30 hover:border-green-500/60'
                }`}
                onClick={() => setSelectedAccount(account)}
              >
                <div className="flex items-center gap-3 mb-4">
                  {account.account_type === 'checking' && <CreditCard className="w-5 h-5 text-green-500" />}
                  {account.account_type === 'savings' && <PiggyBank className="w-5 h-5 text-green-500" />}
                  {account.account_type === 'business' && <Building2 className="w-5 h-5 text-green-500" />}
                  {account.account_type === 'offshore' && <Globe className="w-5 h-5 text-green-500" />}
                  <h3 className="text-lg font-mono text-green-500">
                    {account.account_type.toUpperCase()}
                  </h3>
                </div>
                <p className="text-2xl font-mono text-white mb-2">
                  ${account.balance.toLocaleString()}
                </p>
                <p className="text-sm text-gray-400 font-mono">
                  #{account.account_number}
                </p>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Transaction Interface */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="p-6 bg-black/50 border-green-500/30">
            <h2 className="text-xl font-mono text-green-500 mb-6">Transaction</h2>
            <div className="grid grid-cols-3 gap-4 mb-6">
              <Button
                variant={transactionType === 'deposit' ? 'default' : 'outline'}
                className={`${
                  transactionType === 'deposit'
                    ? 'bg-gradient-to-r from-green-600 to-green-500'
                    : ''
                }`}
                onClick={() => setTransactionType('deposit')}
              >
                <DollarSign className="w-4 h-4 mr-2" />
                Deposit
              </Button>
              <Button
                variant={transactionType === 'withdrawal' ? 'default' : 'outline'}
                className={`${
                  transactionType === 'withdrawal'
                    ? 'bg-gradient-to-r from-green-600 to-green-500'
                    : ''
                }`}
                onClick={() => setTransactionType('withdrawal')}
              >
                <ArrowLeftRight className="w-4 h-4 mr-2" />
                Withdraw
              </Button>
              <Button
                variant={transactionType === 'transfer' ? 'default' : 'outline'}
                className={`${
                  transactionType === 'transfer'
                    ? 'bg-gradient-to-r from-green-600 to-green-500'
                    : ''
                }`}
                onClick={() => setTransactionType('transfer')}
              >
                <ArrowLeftRight className="w-4 h-4 mr-2" />
                Transfer
              </Button>
            </div>
            {renderScreen()}
          </Card>

          <Card className="p-6 bg-black/50 border-green-500/30">
            <h2 className="text-xl font-mono text-green-500 mb-6">Recent Activity</h2>
            <div className="space-y-4">
              {/* Placeholder for recent transactions */}
              <div className="flex items-center justify-between p-3 bg-black/30 rounded-lg border border-green-500/10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center">
                    <ArrowLeftRight className="w-5 h-5 text-green-500" />
                  </div>
                  <div>
                    <p className="text-sm text-white">Transfer to #1234</p>
                    <p className="text-xs text-gray-400">2 hours ago</p>
                  </div>
                </div>
                <p className="text-sm font-mono text-red-500">-$1,000.00</p>
              </div>
              {/* Add more transaction items here */}
            </div>
          </Card>
        </div>
      </div>
    </motion.div>
  );
}