
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

interface Transaction {
  id: string;
  company_id: string;
  title: string;
  description: string | null;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  status: 'pending' | 'completed';
  month: number;
  year: number;
  due_date: string | null;
  payment_date: string | null;
  is_auto_generated: boolean;
  created_at: string;
  updated_at: string;
}

export const useTransactions = (companyId: string | null) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const fetchTransactions = async (month: number, year: number) => {
    if (!companyId) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('company_id', companyId)
        .eq('month', month)
        .eq('year', year)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      setTransactions(data || []);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const createTransaction = async (transactionData: {
    title: string;
    description?: string;
    amount: number;
    type: 'income' | 'expense';
    category: string;
    status?: 'pending' | 'completed';
    month: number;
    year: number;
    due_date?: string;
    payment_date?: string;
    is_auto_generated?: boolean;
  }) => {
    if (!companyId) return { error: 'Company not selected' };

    try {
      const { data, error } = await supabase
        .from('transactions')
        .insert([{
          company_id: companyId,
          ...transactionData,
          status: transactionData.status || 'pending',
          is_auto_generated: transactionData.is_auto_generated || false
        }])
        .select()
        .single();

      if (error) throw error;
      
      return { data, error: null };
    } catch (error) {
      console.error('Error creating transaction:', error);
      return { data: null, error };
    }
  };

  const updateTransaction = async (id: string, updates: Partial<Transaction>) => {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      return { data, error: null };
    } catch (error) {
      console.error('Error updating transaction:', error);
      return { data: null, error };
    }
  };

  const deleteTransaction = async (id: string) => {
    try {
      const { error } = await supabase
        .from('transactions')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      return { error: null };
    } catch (error) {
      console.error('Error deleting transaction:', error);
      return { error };
    }
  };

  const generateAutoTransactions = async (
    month: number,
    year: number,
    calculatedTaxes: {
      pro_labore_amount: number;
      inss_amount: number;
      das_amount: number;
    },
    totalRevenue: number,
    accountingFee?: number
  ) => {
    if (!companyId) return { error: 'Company not selected' };

    try {
      const autoTransactions = [
        // Receita
        {
          title: 'Salário',
          description: `Receita de ${month}/${year}`,
          amount: totalRevenue,
          type: 'income' as const,
          category: 'salary',
          status: 'completed' as const,
          month,
          year,
          is_auto_generated: true
        },
        // Pró-labore
        {
          title: 'Pró-labore',
          description: `Referente a ${month}/${year}`,
          amount: calculatedTaxes.pro_labore_amount,
          type: 'expense' as const,
          category: 'pro_labore',
          status: 'completed' as const,
          month,
          year,
          is_auto_generated: true
        },
        // INSS
        {
          title: 'INSS',
          description: `Referente a ${month}/${year}`,
          amount: calculatedTaxes.inss_amount,
          type: 'expense' as const,
          category: 'inss',
          status: 'pending' as const,
          month: month + 1 > 12 ? 1 : month + 1,
          year: month + 1 > 12 ? year + 1 : year,
          is_auto_generated: true
        },
        // DAS
        {
          title: 'DAS - Simples nacional',
          description: `Referente a ${month}/${year}`,
          amount: calculatedTaxes.das_amount,
          type: 'expense' as const,
          category: 'das',
          status: 'pending' as const,
          month: month + 1 > 12 ? 1 : month + 1,
          year: month + 1 > 12 ? year + 1 : year,
          is_auto_generated: true
        }
      ];

      // Adicionar taxa de contabilidade se configurada
      if (accountingFee && accountingFee > 0) {
        autoTransactions.push({
          title: 'Taxa de Contabilidade',
          description: `Referente a ${month}/${year}`,
          amount: accountingFee,
          type: 'expense' as const,
          category: 'accounting',
          status: 'pending' as const,
          month,
          year,
          is_auto_generated: true
        });
      }

      const { data, error } = await supabase
        .from('transactions')
        .insert(autoTransactions)
        .select();

      if (error) throw error;
      
      return { data, error: null };
    } catch (error) {
      console.error('Error generating auto transactions:', error);
      return { data: null, error };
    }
  };

  return {
    loading,
    transactions,
    fetchTransactions,
    createTransaction,
    updateTransaction,
    deleteTransaction,
    generateAutoTransactions,
  };
};
