
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { Database } from '@/integrations/supabase/types';

type Transaction = Database['public']['Tables']['transactions']['Row'];
type TransactionInsert = Database['public']['Tables']['transactions']['Insert'];
type TransactionUpdate = Database['public']['Tables']['transactions']['Update'];

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
    category: Database['public']['Enums']['transaction_category'];
    status?: 'pending' | 'completed';
    month: number;
    year: number;
    due_date?: string;
    payment_date?: string;
    is_auto_generated?: boolean;
  }) => {
    if (!companyId) return { error: 'Company not selected' };

    try {
      const insertData: TransactionInsert = {
        company_id: companyId,
        title: transactionData.title,
        description: transactionData.description || null,
        amount: transactionData.amount,
        type: transactionData.type,
        category: transactionData.category,
        status: transactionData.status || 'pending',
        month: transactionData.month,
        year: transactionData.year,
        due_date: transactionData.due_date || null,
        payment_date: transactionData.payment_date || null,
        is_auto_generated: transactionData.is_auto_generated || false
      };

      const { data, error } = await supabase
        .from('transactions')
        .insert([insertData])
        .select()
        .single();

      if (error) throw error;
      
      return { data, error: null };
    } catch (error) {
      console.error('Error creating transaction:', error);
      return { data: null, error };
    }
  };

  const updateTransaction = async (id: string, updates: TransactionUpdate) => {
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
      const autoTransactions: TransactionInsert[] = [
        // Receita
        {
          company_id: companyId,
          title: 'Salário',
          description: `Receita de ${month}/${year}`,
          amount: totalRevenue,
          type: 'income',
          category: 'salary',
          status: 'completed',
          month,
          year,
          is_auto_generated: true
        },
        // Pró-labore
        {
          company_id: companyId,
          title: 'Pró-labore',
          description: `Referente a ${month}/${year}`,
          amount: calculatedTaxes.pro_labore_amount,
          type: 'expense',
          category: 'pro_labore',
          status: 'completed',
          month,
          year,
          is_auto_generated: true
        },
        // INSS
        {
          company_id: companyId,
          title: 'INSS',
          description: `Referente a ${month}/${year}`,
          amount: calculatedTaxes.inss_amount,
          type: 'expense',
          category: 'inss',
          status: 'pending',
          month: month + 1 > 12 ? 1 : month + 1,
          year: month + 1 > 12 ? year + 1 : year,
          is_auto_generated: true
        },
        // DAS
        {
          company_id: companyId,
          title: 'DAS - Simples nacional',
          description: `Referente a ${month}/${year}`,
          amount: calculatedTaxes.das_amount,
          type: 'expense',
          category: 'das',
          status: 'pending',
          month: month + 1 > 12 ? 1 : month + 1,
          year: month + 1 > 12 ? year + 1 : year,
          is_auto_generated: true
        }
      ];

      // Adicionar taxa de contabilidade se configurada
      if (accountingFee && accountingFee > 0) {
        autoTransactions.push({
          company_id: companyId,
          title: 'Taxa de Contabilidade',
          description: `Referente a ${month}/${year}`,
          amount: accountingFee,
          type: 'expense',
          category: 'accounting',
          status: 'pending',
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
