'use client';

import { useState, useEffect, FormEvent, MouseEvent } from 'react';
import { useCharacter } from '@/hooks/character/useCharacter';
import { useSupabase } from '@/hooks/useSupabase';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'react-hot-toast';
import Link from 'next/link';
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
  Plus,
  Home,
  Users,
  Fingerprint,
  ShieldCheck,
  Loader2,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  TrendingUp,
  ChevronRight,
  Search,
  Bell,
  Settings,
  User,
  Wallet,
  Send,
  Download,
  Upload,
  PieChart,
  Activity,
  LogOut
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/Dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
import { Input } from "@/components/ui/input";
import { PostgrestSingleResponse } from '@supabase/supabase-js';
import { AuthWrapper } from '@/components/auth/AuthWrapper';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import BankLoading from './components/BankLoading';
import Image from 'next/image';

type AccountType = 'checking' | 'savings' | 'business' | 'offshore';
type TransactionType = 'deposit' | 'withdraw' | 'transfer' | 'user_transfer';

interface BankAccount {
  id: string;
  account_number: string;
  account_type: AccountType;
  balance: number;
  interest_rate: number;
  max_balance: number;
  daily_withdrawal_limit: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface Character {
  id: string;
  money: number;
  // ... other character fields
}

interface User {
  id: string;
  username: string;
}

interface TransactionResponse {
  success: boolean;
  new_balance: number;
  transaction_id?: string;
  error?: string;
}

const MAX_ACCOUNTS = {
  checking: 1,
  savings: 1,
  business: 2,
  offshore: 1
};

// Mock data for charts
const balanceHistory = [
  { date: 'Jan', balance: 5000 },
  { date: 'Feb', balance: 7500 },
  { date: 'Mar', balance: 6800 },
  { date: 'Apr', balance: 9000 },
  { date: 'May', balance: 8500 },
  { date: 'Jun', balance: 11000 },
  { date: 'Jul', balance: 15000 },
];

const transactionHistory = [
  { 
    id: 1,
    type: 'incoming',
    amount: 5000,
    from: 'Tony Soprano',
    description: 'Protection Money',
    time: '2 hours ago',
    status: 'completed'
  },
  {
    id: 2,
    type: 'outgoing',
    amount: 2500,
    to: 'Paulie Walnuts',
    description: 'Weekly Cut',
    time: '5 hours ago',
    status: 'completed'
  },
  {
    id: 3,
    type: 'incoming',
    amount: 10000,
    from: 'Junior Soprano',
    description: 'Investment Return',
    time: '1 day ago',
    status: 'completed'
  },
];

const quickActions = [
  { icon: Send, label: 'Transfer', color: 'bg-purple-500/20 text-purple-400' },
  { icon: Download, label: 'Deposit', color: 'bg-green-500/20 text-green-400' },
  { icon: Upload, label: 'Withdraw', color: 'bg-red-500/20 text-red-400' },
  { icon: Plus, label: 'New Card', color: 'bg-blue-500/20 text-blue-400' },
];

const statistics = [
  { 
    label: 'Total Balance',
    value: '$45,250',
    change: '+15%',
    icon: Wallet,
    color: 'from-blue-500 to-blue-600'
  },
  {
    label: 'Monthly Income',
    value: '$12,800',
    change: '+8%',
    icon: TrendingUp,
    color: 'from-green-500 to-green-600'
  },
  {
    label: 'Total Expenses',
    value: '$5,230',
    change: '-3%',
    icon: Activity,
    color: 'from-red-500 to-red-600'
  },
  {
    label: 'Investments',
    value: '$28,150',
    change: '+12%',
    icon: PieChart,
    color: 'from-purple-500 to-purple-600'
  }
];

// Transaction Modal Component
interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  handleAmountChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  amount: string;
}

const TransactionModal = ({ isOpen, onClose, handleAmountChange, amount }: TransactionModalProps) => {
  const supabase = createClientComponentClient();
  const { character } = useCharacter();
  const [transactionType, setTransactionType] = useState<TransactionType | null>(null);
  const [transferToAccount, setTransferToAccount] = useState<BankAccount | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState<string>('');
  const [searchUsername, setSearchUsername] = useState('');
  const [users, setUsers] = useState<User[]>([]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-[#111111] border border-red-900/20 backdrop-blur-sm">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            {transactionType === 'deposit' ? 'Deposit' :
             transactionType === 'withdraw' ? 'Withdraw' :
             transactionType === 'transfer' ? 'Transfer Between Accounts' :
             'Transfer to User'}
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            {transactionType === 'deposit' ? 'Deposit money from your character to your account' :
             transactionType === 'withdraw' ? 'Withdraw money from your account to your character' :
             transactionType === 'transfer' ? 'Transfer money between your accounts' :
             'Transfer money to another user'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={(e) => {
          e.preventDefault();
          handleTransaction();
        }}>
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm text-gray-400">Amount</label>
              <Input
                type="number"
                value={amount}
                onChange={handleAmountChange}
                placeholder="Enter amount"
                className="bg-black/30 border-gray-800 text-gray-300 focus:border-red-500/50"
              />
            </div>

            {transactionType === 'transfer' && (
              <div className="space-y-2">
                <label className="text-sm text-gray-400">Transfer To</label>
                <Select
                  value={transferToAccount?.id}
                  onValueChange={(value) => {
                    const account = accounts.find(acc => acc.id === value);
                    setTransferToAccount(account || null);
                  }}
                >
                  <SelectTrigger className="bg-black/30 border-gray-800">
                    <SelectValue placeholder="Select account" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#111111] border border-red-900/20">
                    {accounts
                      .filter(acc => acc.id !== selectedAccount?.id)
                      .map(account => (
                        <SelectItem 
                          key={account.id} 
                          value={account.id}
                          className="focus:bg-red-950/30 focus:text-white"
                        >
                          {account.account_type.charAt(0).toUpperCase() + account.account_type.slice(1)} - ${account.balance.toLocaleString()}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {transactionType === 'user_transfer' && (
              <div className="space-y-2">
                <label className="text-sm text-gray-400">Recipient Username</label>
                <Input
                  type="text"
                  value={searchUsername}
                  onChange={(e) => setSearchUsername(e.target.value)}
                  placeholder="Search username"
                  className="bg-black/30 border-gray-800 text-gray-300 focus:border-red-500/50"
                />
                {users.length > 0 && (
                  <div className="mt-2 space-y-2">
                    {users.map(user => (
                      <button
                        key={user.id}
                        type="button"
                        onClick={() => setSelectedUser(user.id)}
                        className={`w-full p-2 rounded-lg text-left transition-all ${
                          selectedUser === user.id
                            ? 'bg-red-950/30 border border-red-500/30'
                            : 'bg-black/30 hover:bg-red-950/20'
                        }`}
                      >
                        {user.username}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="border-red-500/30 hover:bg-red-950/20 hover:border-red-500/50"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isLoading || !amount || 
                  (transactionType === 'transfer' && !transferToAccount) ||
                  (transactionType === 'user_transfer' && !selectedUser)}
                className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  'Confirm'
                )}
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

// New Account Modal Component
const NewAccountModal = ({ 
  handleInitialDepositChange, 
  initialDeposit,
  selectedAccountType,
  handleAccountTypeSelect,
  handleOpenAccount,
  isLoading
}: {
  handleInitialDepositChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  initialDeposit: string;
  selectedAccountType: AccountType | null;
  handleAccountTypeSelect: (type: AccountType, e: MouseEvent) => void;
  handleOpenAccount: (e?: FormEvent) => Promise<void>;
  isLoading: boolean;
}) => {
  return (
    <Dialog>
      <DialogContent className="bg-[#111111] border border-red-900/20 backdrop-blur-sm">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Open New Account</DialogTitle>
          <DialogDescription className="text-gray-400">
            Choose an account type and set your initial deposit amount
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleOpenAccount}>
          <div className="space-y-6">
            <div className="p-4 rounded-xl bg-black/30">
              <h3 className="text-sm font-medium mb-4">Select Account Type</h3>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={(e) => handleAccountTypeSelect('checking', e)}
                  className={`p-4 rounded-xl text-left transition-all ${
                    selectedAccountType === 'checking'
                      ? 'bg-red-950/30 border border-red-500/30'
                      : 'bg-black/30 hover:bg-red-950/20'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <CreditCard className="w-5 h-5 text-red-500" />
                    <span>Checking</span>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={(e) => handleAccountTypeSelect('savings', e)}
                  className={`p-4 rounded-xl text-left transition-all ${
                    selectedAccountType === 'savings'
                      ? 'bg-red-950/30 border border-red-500/30'
                      : 'bg-black/30 hover:bg-red-950/20'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <PiggyBank className="w-5 h-5 text-red-500" />
                    <span>Savings</span>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={(e) => handleAccountTypeSelect('business', e)}
                  className={`p-4 rounded-xl text-left transition-all ${
                    selectedAccountType === 'business'
                      ? 'bg-red-950/30 border border-red-500/30'
                      : 'bg-black/30 hover:bg-red-950/20'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Building2 className="w-5 h-5 text-red-500" />
                    <span>Business</span>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={(e) => handleAccountTypeSelect('offshore', e)}
                  className={`p-4 rounded-xl text-left transition-all ${
                    selectedAccountType === 'offshore'
                      ? 'bg-red-950/30 border border-red-500/30'
                      : 'bg-black/30 hover:bg-red-950/20'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Globe className="w-5 h-5 text-red-500" />
                    <span>Offshore</span>
                  </div>
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm text-gray-400">Initial Deposit</label>
              <Input
                type="number"
                value={initialDeposit}
                onChange={handleInitialDepositChange}
                placeholder="Enter initial deposit"
                className="bg-black/30 border-gray-800 text-gray-300 focus:border-red-500/50"
              />
            </div>

            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsOpenAccountModalOpen(false)}
                className="border-red-500/30 hover:bg-red-950/20 hover:border-red-500/50"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={!selectedAccountType || !initialDeposit || isLoading}
                className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Opening Account...
                  </>
                ) : (
                  'Open Account'
                )}
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default function BankingPage() {
  const [accounts, setAccounts] = useState<BankAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedAccount, setSelectedAccount] = useState<BankAccount | null>(null);
  const [amount, setAmount] = useState<string>('');
  const [transactionType, setTransactionType] = useState<TransactionType | null>(null);
  const [transferToAccount, setTransferToAccount] = useState<BankAccount | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpenAccountModalOpen, setIsOpenAccountModalOpen] = useState(false);
  const [selectedAccountType, setSelectedAccountType] = useState<AccountType | null>(null);
  const [initialDeposit, setInitialDeposit] = useState<string>('');
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<string>('');
  const [searchUsername, setSearchUsername] = useState('');
  const [showLoading, setShowLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  
  const { character, updateCharacterState, isLoading: characterLoading } = useCharacter();
  const supabase = createClientComponentClient();

  const fetchAccounts = async () => {
    if (!character?.id) return;
    
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('bank_accounts')
        .select('*')
        .eq('character_id', character.id)
        .eq('is_active', true);

      if (fetchError) throw fetchError;

      setAccounts(data || []);
      if (data && data.length > 0 && !selectedAccount) {
        setSelectedAccount(data[0]);
      }
    } catch (err) {
      console.error('Error fetching bank accounts:', err);
      setError('Failed to load bank accounts. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleAccountTypeSelect = (type: AccountType, e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedAccountType(type);
  };

  const handleInitialDepositChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const value = e.target.value;
    if (value === '' || (!isNaN(Number(value)) && Number(value) >= 0)) {
      setInitialDeposit(value);
    }
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const value = e.target.value;
    if (value === '' || (!isNaN(Number(value)) && Number(value) >= 0)) {
      setAmount(value);
    }
  };

  const handleTransaction = async (e?: FormEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    if (!selectedAccount || !amount || !transactionType || !character) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsLoading(true);
    const amountNum = Number(parseFloat(amount).toFixed(2));

    try {
      let response: PostgrestSingleResponse<TransactionResponse>;

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      switch (transactionType) {
        case 'deposit':
          if (character.money < amountNum) {
            throw new Error('Insufficient money');
          }

          response = await supabase.rpc('process_transaction', {
            p_account_id: selectedAccount.id,
            p_amount: amountNum,
            p_type: 'deposit',
            p_character_id: character.id
          });
          
          if (response.error) throw response.error;
          if (!response.data?.success) throw new Error(response.data?.error || 'Transaction failed');

          updateCharacterState({ ...character, money: character.money - amountNum });
          await fetchAccounts();
          toast.success('Deposit successful');
          break;

        case 'withdraw':
          if (selectedAccount.balance < amountNum) {
            throw new Error('Insufficient funds in account');
          }

          response = await supabase.rpc('process_transaction', {
            p_account_id: selectedAccount.id,
            p_amount: amountNum,
            p_type: 'withdraw',
            p_character_id: character.id
          });

          if (!response.data?.success) {
            throw new Error(response.data?.error || 'Transaction failed');
          }

          updateCharacterState({ ...character, money: character.money + amountNum });
          await fetchAccounts();
          toast.success('Withdrawal successful');
          break;

        case 'transfer':
          if (!transferToAccount) {
            throw new Error('Please select recipient account');
          }

          response = await supabase.rpc('process_bank_transfer', {
            p_from_account_id: selectedAccount.id,
            p_to_account_id: transferToAccount.id,
            p_amount: amountNum
          });
          
          if (response.error) throw response.error;
          if (!response.data?.success) throw new Error(response.data?.error || 'Transfer failed');
          
          toast.success('Transfer successful');
          break;

        case 'user_transfer':
          if (!selectedUser) {
            throw new Error('Please select a recipient user');
          }

          response = await supabase.rpc('process_user_transfer', {
            p_from_account_id: selectedAccount.id,
            p_to_user_id: selectedUser,
            p_amount: amountNum
          });
          
          if (response.error) throw response.error;
          if (!response.data?.success) throw new Error(response.data?.error || 'Transfer failed');
          
          toast.success('Transfer to user successful');
          break;
      }

      setAmount('');
      setTransactionType(null);
      setTransferToAccount(null);
      setSelectedUser('');
      setSearchUsername('');
    } catch (error: any) {
      toast.error(error.message || 'Transaction failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenAccount = async (e?: FormEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    if (!selectedAccountType || !initialDeposit || !character) {
      toast.error('Please select an account type and enter initial deposit');
      return;
    }

    setIsLoading(true);
    try {
      const depositAmount = parseInt(initialDeposit);

      if (depositAmount <= 0) {
        throw new Error('Initial deposit must be greater than 0');
      }

      if (depositAmount > character.money) {
        throw new Error('Insufficient money for initial deposit');
      }

      const { data, error } = await supabase.rpc('open_bank_account', {
        p_character_id: character.id,
        p_account_type: selectedAccountType,
        p_initial_deposit: depositAmount
      });

      if (error) throw error;
      if (!data?.success) throw new Error(data?.error || 'Failed to open account');

      updateCharacterState({
        ...character,
        money: character.money - depositAmount
      });

      await fetchAccounts();
      toast.success('Account opened successfully');
      setIsOpenAccountModalOpen(false);
      setSelectedAccountType(null);
      setInitialDeposit('');
    } catch (error: any) {
      toast.error(error.message || 'Failed to open account');
    } finally {
      setIsLoading(false);
    }
  };

  const searchUsers = async (query: string) => {
    if (query.length < 3) return;
    
    try {
      const { data, error } = await supabase
        .from('users')
        .select('id, username')
        .ilike('username', `%${query}%`)
        .limit(5);

      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error('Error searching users:', error);
      toast.error('Failed to search users');
    }
  };

  useEffect(() => {
    if (character?.id) {
      fetchAccounts();
    } else {
      setLoading(false);
    }
  }, [character?.id]);

  useEffect(() => {
    if (searchUsername) {
      searchUsers(searchUsername);
    }
  }, [searchUsername]);

  if (showLoading) {
    return <BankLoading onComplete={() => setShowLoading(false)} />;
  }

  if (characterLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-black">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
      </div>
    );
  }

  if (!character) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-black">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Access Denied</CardTitle>
          </CardHeader>
          <CardContent>
            <p>You need to create a character first to access the banking system.</p>
            <Button className="mt-4" asChild>
              <Link href="/character/create">Create Character</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <AuthWrapper>
      <div className="min-h-screen bg-[#111111] text-white relative overflow-hidden">
        {/* Background Effects */}
        <div className="fixed inset-0">
          {/* Base gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#111111] via-[#1a1a1a] to-[#111111]" />
          
          {/* Subtle noise texture */}
          <div className="absolute inset-0 mix-blend-overlay opacity-[0.05]" 
               style={{
                 backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                 backgroundSize: '150px 150px'
               }} />
          
          {/* Subtle vignette */}
          <div className="absolute inset-0" 
               style={{
                 background: 'radial-gradient(circle at 50% 50%, transparent 0%, rgba(0,0,0,0.3) 100%)'
               }} />
        </div>

        <header className="relative z-10 border-b border-white/10 backdrop-blur-sm bg-black/20">
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-8">
                <Link href="/dashboard" className="flex items-center space-x-3">
                  <div className="relative w-16 h-16">
                    <Image
                      src="/images/apps/Bank Gothic.png"
                      alt="Bank Logo"
                      width={64}
                      height={64}
                      className="object-contain"
                      priority
                    />
                  </div>
                  <div className="text-sm text-gray-400 tracking-widest">SECURE • DISCREET • RELIABLE</div>
                </Link>
                <nav className="hidden md:flex items-center space-x-6">
                  <Button
                    variant="ghost"
                    className={`text-sm ${activeTab === 'overview' ? 'text-red-500' : 'text-gray-400'}`}
                    onClick={() => setActiveTab('overview')}
                  >
                    Overview
                  </Button>
                  <Button
                    variant="ghost"
                    className={`text-sm ${activeTab === 'accounts' ? 'text-red-500' : 'text-gray-400'}`}
                    onClick={() => setActiveTab('accounts')}
                  >
                    Accounts
                  </Button>
                  <Button
                    variant="ghost"
                    className={`text-sm ${activeTab === 'transactions' ? 'text-red-500' : 'text-gray-400'}`}
                    onClick={() => setActiveTab('transactions')}
                  >
                    Transactions
                  </Button>
                </nav>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-red-950/50 flex items-center justify-center">
                    <User className="w-5 h-5 text-red-500" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{character?.name || 'Unknown'}</p>
                    <p className="text-xs text-gray-400">Cash: ${character?.money?.toLocaleString() ?? '0'}</p>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="text-gray-400 hover:text-red-500"
                  asChild
                >
                  <Link href="/dashboard">
                    <LogOut className="w-4 h-4 mr-2" />
                    Exit Banking
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </header>

        <main className="relative z-10 container mx-auto px-6 py-8">
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-3 space-y-6">
              <div className="space-y-4">
                {accounts.map((account) => (
                  <motion.div
                    key={account.id}
                    className={`p-6 rounded-2xl cursor-pointer transition-all backdrop-blur-sm ${
                      selectedAccount?.id === account.id
                        ? 'bg-red-950/30 border border-red-500/30'
                        : 'bg-black/30 hover:bg-red-950/20'
                    }`}
                    onClick={() => setSelectedAccount(account)}
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="flex items-center space-x-3 mb-3">
                      {account.account_type === 'checking' && <CreditCard className="w-5 h-5 text-red-500" />}
                      {account.account_type === 'savings' && <PiggyBank className="w-5 h-5 text-red-500" />}
                      {account.account_type === 'business' && <Building2 className="w-5 h-5 text-red-500" />}
                      {account.account_type === 'offshore' && <Globe className="w-5 h-5 text-red-500" />}
                      <span className="font-medium capitalize">{account.account_type}</span>
                    </div>
                    <p className="text-2xl font-bold">${account.balance.toLocaleString()}</p>
                    <p className="text-sm text-gray-400 mt-1">#{account.account_number}</p>
                  </motion.div>
                ))}

                {Object.entries(MAX_ACCOUNTS).some(([type, limit]) => 
                  accounts.filter(a => a.account_type === type).length < limit
                ) && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsOpenAccountModalOpen(true)}
                    className="w-full h-20 border-dashed border-red-500/30 hover:border-red-500/50 hover:bg-red-950/20"
                  >
                    <Plus className="w-5 h-5 mr-2 text-red-500" />
                    Open New Account
                  </Button>
                )}
              </div>

              {selectedAccount && (
                <div className="bg-black/30 backdrop-blur-sm rounded-2xl p-6 border border-red-900/20">
                  <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
                  <div className="grid grid-cols-2 gap-4">
                    <Button
                      type="button"
                      variant="ghost"
                      className="flex flex-col items-center justify-center h-24 rounded-xl hover:bg-red-950/20"
                      onClick={() => handleQuickAction('deposit')}
                    >
                      <div className="p-3 rounded-lg bg-green-500/20 text-green-400 mb-2">
                        <Download className="w-5 h-5" />
                      </div>
                      <span className="text-sm">Deposit</span>
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      className="flex flex-col items-center justify-center h-24 rounded-xl hover:bg-red-950/20"
                      onClick={() => handleQuickAction('withdraw')}
                    >
                      <div className="p-3 rounded-lg bg-red-500/20 text-red-400 mb-2">
                        <Upload className="w-5 h-5" />
                      </div>
                      <span className="text-sm">Withdraw</span>
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      className="flex flex-col items-center justify-center h-24 rounded-xl hover:bg-red-950/20"
                      onClick={() => handleQuickAction('transfer')}
                      disabled={accounts.length < 2}
                    >
                      <div className="p-3 rounded-lg bg-red-500/20 text-red-400 mb-2">
                        <ArrowLeftRight className="w-5 h-5" />
                      </div>
                      <span className="text-sm">Transfer</span>
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      className="flex flex-col items-center justify-center h-24 rounded-xl hover:bg-red-950/20"
                      onClick={() => handleQuickAction('user_transfer')}
                    >
                      <div className="p-3 rounded-lg bg-red-500/20 text-red-400 mb-2">
                        <Users className="w-5 h-5" />
                      </div>
                      <span className="text-sm">Send to User</span>
                    </Button>
                  </div>
                </div>
              )}
            </div>

            <div className="col-span-9 space-y-6">
              {selectedAccount ? (
                <>
                  <div className="grid grid-cols-3 gap-6">
                    <motion.div
                      className="bg-black/30 backdrop-blur-sm rounded-2xl p-6 border border-red-900/20"
                      whileHover={{ scale: 1.02 }}
                    >
                      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center mb-4">
                        <Wallet className="w-6 h-6 text-white" />
                      </div>
                      <p className="text-gray-400 text-sm">Current Balance</p>
                      <p className="text-2xl font-bold mt-1">${selectedAccount.balance.toLocaleString()}</p>
                    </motion.div>
                    <motion.div
                      className="bg-black/30 backdrop-blur-sm rounded-2xl p-6 border border-red-900/20"
                      whileHover={{ scale: 1.02 }}
                    >
                      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center mb-4">
                        <ArrowDownRight className="w-6 h-6 text-white" />
                      </div>
                      <p className="text-gray-400 text-sm">Daily Deposit Limit</p>
                      <p className="text-2xl font-bold mt-1">$50,000</p>
                    </motion.div>
                    <motion.div
                      className="bg-black/30 backdrop-blur-sm rounded-2xl p-6 border border-red-900/20"
                      whileHover={{ scale: 1.02 }}
                    >
                      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center mb-4">
                        <ArrowUpRight className="w-6 h-6 text-white" />
                      </div>
                      <p className="text-gray-400 text-sm">Daily Withdrawal Limit</p>
                      <p className="text-2xl font-bold mt-1">${(selectedAccount.daily_withdrawal_limit ?? 10000).toLocaleString()}</p>
                    </motion.div>
                  </div>

                  <div className="bg-black/30 backdrop-blur-sm rounded-2xl p-6 border border-red-900/20">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-lg font-semibold">Transaction History</h2>
                    </div>
                    <div className="space-y-4">
                      {transactionHistory.map((transaction) => (
                        <motion.div
                          key={transaction.id}
                          className="flex items-center justify-between p-4 rounded-xl bg-black/30"
                          whileHover={{ scale: 1.02 }}
                        >
                          <div className="flex items-center space-x-4">
                            <div className={`p-2 rounded-lg ${
                              transaction.type === 'incoming'
                                ? 'bg-green-500/20 text-green-400'
                                : 'bg-red-500/20 text-red-400'
                            }`}>
                              {transaction.type === 'incoming' ? (
                                <ArrowDownRight className="w-5 h-5" />
                              ) : (
                                <ArrowUpRight className="w-5 h-5" />
                              )}
                            </div>
                            <div>
                              <p className="font-medium">
                                {transaction.type === 'incoming' ? transaction.from : transaction.to}
                              </p>
                              <p className="text-sm text-gray-400">{transaction.description}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className={`font-medium ${
                              transaction.type === 'incoming' ? 'text-green-400' : 'text-red-400'
                            }`}>
                              {transaction.type === 'incoming' ? '+' : '-'}${transaction.amount.toLocaleString()}
                            </p>
                            <p className="text-sm text-gray-400">{transaction.time}</p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center h-[60vh]">
                  <div className="text-center space-y-4">
                    <h2 className="text-2xl font-semibold">Welcome to Omerta Bank</h2>
                    <p className="text-gray-400">Select an account or open a new one to get started</p>
                    <Button
                      onClick={() => setIsOpenAccountModalOpen(true)}
                      className="mt-4 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800"
                    >
                      <Plus className="w-5 h-5 mr-2" />
                      Open New Account
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>

        <TransactionModal
          isOpen={!!transactionType}
          onClose={() => {
            setTransactionType(null);
            setAmount('');
            setTransferToAccount(null);
            setSelectedUser('');
            setSearchUsername('');
          }}
          handleAmountChange={handleAmountChange}
          amount={amount}
        />
        <NewAccountModal
          handleInitialDepositChange={handleInitialDepositChange}
          initialDeposit={initialDeposit}
          selectedAccountType={selectedAccountType}
          handleAccountTypeSelect={handleAccountTypeSelect}
          handleOpenAccount={handleOpenAccount}
          isLoading={isLoading}
        />
      </div>
    </AuthWrapper>
  );
}