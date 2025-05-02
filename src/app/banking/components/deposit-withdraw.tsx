'use client';

import { useState } from 'react';
import { useCharacter } from '@/hooks/character/useCharacter';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { motion } from 'framer-motion';
import { ArrowDown, ArrowUp, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from "@/components/ui/use-toast"

interface DepositWithdrawProps {
  account: {
    id: string;
    account_number: string;
    balance: number;
    account_type: string;
    daily_withdrawal_limit: number;
  };
  onSuccess: () => void;
}

export default function DepositWithdraw({ account, onSuccess }: DepositWithdrawProps) {
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { character, refreshCharacter } = useCharacter();
  const supabase = createClientComponentClient();
  const { toast } = useToast()

  const handleDeposit = async () => {
    if (!account?.id) {
      toast({
        title: "Error",
        description: "No active bank account found",
        variant: "destructive",
      });
      return;
    }

    if (!amount) {
      toast({
        title: "Error",
        description: "Please enter an amount",
        variant: "destructive",
      });
      return;
    }

    const depositAmount = parseFloat(amount);
    if (isNaN(depositAmount) || depositAmount <= 0) {
      toast({
        title: "Error",
        description: "Please enter a valid amount",
        variant: "destructive",
      });
      return;
    }

    if (!character?.cash) {
      toast({
        title: "Error",
        description: "No character cash found",
        variant: "destructive",
      });
      return;
    }

    if (depositAmount > character.cash) {
      toast({
        title: "Error",
        description: "Insufficient cash on hand",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { error: transactionError } = await supabase.rpc('process_transaction', {
        p_account_id: account.id,
        p_amount: depositAmount,
        p_transaction_type: 'deposit',
        p_description: 'Deposit from cash'
      });

      if (transactionError) throw transactionError;

      const { error: characterError } = await supabase
        .from('characters')
        .update({ cash: character.cash - depositAmount })
        .eq('id', character.id);

      if (characterError) throw characterError;

      toast({
        title: "Success",
        description: "Deposit successful!",
      });
      setAmount('');
      onSuccess();
      refreshCharacter();
    } catch (error) {
      console.error('Deposit error:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Deposit failed",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleWithdraw = async () => {
    if (!account?.id) {
      toast({
        title: "Error",
        description: "No active bank account found",
        variant: "destructive",
      });
      return;
    }

    if (!amount) {
      toast({
        title: "Error",
        description: "Please enter an amount",
        variant: "destructive",
      });
      return;
    }

    const withdrawAmount = parseFloat(amount);
    if (isNaN(withdrawAmount) || withdrawAmount <= 0) {
      toast({
        title: "Error",
        description: "Please enter a valid amount",
        variant: "destructive",
      });
      return;
    }

    if (withdrawAmount > account.balance) {
      toast({
        title: "Error",
        description: "Insufficient funds in account",
        variant: "destructive",
      });
      return;
    }

    const { data: dailyWithdrawals, error: limitError } = await supabase
      .from('bank_transactions')
      .select('amount')
      .eq('from_account', account.id)
      .eq('transaction_type', 'withdrawal')
      .gte('created_at', new Date().toISOString().split('T')[0]);

    if (limitError) {
      console.error('Error checking withdrawal limit:', limitError);
      toast({
        title: "Error",
        description: "Error checking withdrawal limit",
        variant: "destructive",
      });
      return;
    }

    const totalDailyWithdrawals = dailyWithdrawals?.reduce((sum, t) => sum + t.amount, 0) || 0;
    if (totalDailyWithdrawals + withdrawAmount > account.daily_withdrawal_limit) {
      toast({
        title: "Error",
        description: "Daily withdrawal limit exceeded",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { error: transactionError } = await supabase.rpc('process_transaction', {
        p_account_id: account.id,
        p_amount: withdrawAmount,
        p_transaction_type: 'withdrawal',
        p_description: 'Withdrawal to cash'
      });

      if (transactionError) throw transactionError;

      const { error: characterError } = await supabase
        .from('characters')
        .update({ cash: (character?.cash || 0) + withdrawAmount })
        .eq('id', character?.id);

      if (characterError) throw characterError;

      toast({
        title: "Success",
        description: "Withdrawal successful!",
      });
      setAmount('');
      onSuccess();
      refreshCharacter();
    } catch (error) {
      console.error('Withdrawal error:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Withdrawal failed",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <div className="flex items-center gap-4">
        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="flex-1 p-2 bg-black/50 border border-white/10 rounded text-white"
        />
        <Button
          onClick={handleDeposit}
          disabled={loading}
          className="flex items-center gap-2"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <ArrowDown className="w-4 h-4" />
          )}
          Deposit
        </Button>
        <Button
          onClick={handleWithdraw}
          disabled={loading}
          className="flex items-center gap-2"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <ArrowUp className="w-4 h-4" />
          )}
          Withdraw
        </Button>
      </div>
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <div className="text-sm text-white/60">
        <p>Cash on Hand: ${(character?.cash || 0).toLocaleString()}</p>
        <p>Account Balance: ${account.balance.toLocaleString()}</p>
        <p>Daily Withdrawal Limit: ${account.daily_withdrawal_limit.toLocaleString()}</p>
      </div>
    </motion.div>
  );
} 