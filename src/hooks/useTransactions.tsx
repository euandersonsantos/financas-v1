
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useCompany } from './useCompany';

interface Transaction {
  id: string;
  title: string;
  description: string | null;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  status: 'pending' | 'completed';
  due_date: string | null;
  payment_date: string | null;
  month: number;
  year: number;
  company_id: string;
  is_auto_generated: boolean | null;
  created_at: string;
  updated_at: string;
}

export const useTransactions = (month: number, year: number) => {
  const { company } = useCompany();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!company) {
      setLoading(false);
      return;
    }

    const fetchTransactions = async () => {
      try {
        const { data, error: fetchError } = await supabase
          .from('transactions')
          .select('*')
          .eq('company_id', company.id)
          .eq('month', month)
          .eq('year', year)
          .order('created_at', { ascending: true });

        if (fetchError) throw fetchError;

        setTransactions(data || []);
      } catch (err) {
        console.error('Error fetching transactions:', err);
        setError(err instanceof Error ? err.message : 'Erro desconhecido');
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [company, month, year]);

  const updateTransactionStatus = async (transactionId: string, newStatus: 'pending' | 'completed') => {
    if (!company) return;

    try {
      const { error } = await supabase
        .from('transactions')
        .update({ status: newStatus })
        .eq('id', transactionId)
        .eq('company_id', company.id);

      if (error) throw error;

      setTransactions(prev =>
        prev.map(transaction =>
          transaction.id === transactionId
            ? { ...transaction, status: newStatus }
            : transaction
        )
      );
    } catch (err) {
      console.error('Error updating transaction status:', err);
      setError(err instanceof Error ? err.message : 'Erro ao atualizar status');
    }
  };

  const updateTransaction = async (transactionId: string, updates: Partial<Transaction>) => {
    if (!company) return;

    try {
      const { error } = await supabase
        .from('transactions')
        .update(updates)
        .eq('id', transactionId)
        .eq('company_id', company.id);

      if (error) throw error;

      setTransactions(prev =>
        prev.map(transaction =>
          transaction.id === transactionId
            ? { ...transaction, ...updates }
            : transaction
        )
      );
    } catch (err) {
      console.error('Error updating transaction:', err);
      setError(err instanceof Error ? err.message : 'Erro ao atualizar transação');
    }
  };

  // Formatação dos dados para compatibilidade com o componente existente
  const formatTransactionsForUI = (transactions: Transaction[]) => {
    return transactions.map(transaction => ({
      id: transaction.id,
      title: transaction.title,
      description: transaction.description || '',
      amount: `R$ ${transaction.amount.toLocaleString('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      })}`,
      type: transaction.type,
      status: transaction.status,
      date: transaction.due_date || transaction.payment_date || new Date().toISOString().split('T')[0]
    }));
  };

  const incomeTransactions = formatTransactionsForUI(
    transactions.filter(t => t.type === 'income')
  );

  const expenseTransactions = formatTransactionsForUI(
    transactions.filter(t => t.type === 'expense')
  );

  const faturamentoDiscounts = expenseTransactions.map(transaction => ({
    id: transaction.id,
    title: transaction.title,
    amount: transaction.amount,
    description: transaction.description,
    fontWeight: 'bold' as const,
    type: transaction.type
  }));

  const fechamentoDiscounts = [...faturamentoDiscounts];

  return {
    transactions,
    incomeTransactions,
    expenseTransactions,
    faturamentoDiscounts,
    fechamentoDiscounts,
    loading,
    error,
    updateTransactionStatus,
    updateTransaction,
  };
};
