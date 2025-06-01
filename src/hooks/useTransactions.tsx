
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface Transaction {
  id: string;
  title: string;
  description: string | null;
  amount: number;
  type: 'income' | 'expense';
  category: 'salary' | 'pro_labore' | 'profit_distribution' | 'das' | 'inss' | 'accounting' | 'other_expense' | 'other_income';
  status: 'pending' | 'completed';
  due_date: string | null;
  payment_date: string | null;
  is_auto_generated: boolean | null;
  month: number;
  year: number;
}

export interface CompanySettings {
  id: string;
  company_id: string;
  pro_labore_percentage: number;
  das_percentage: number;
  inss_percentage: number;
  accounting_fee: number | null;
}

export const useTransactions = (companyId: string, month: number, year: number) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [settings, setSettings] = useState<CompanySettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch transactions
  const fetchTransactions = async () => {
    if (!companyId) {
      setTransactions([]);
      return;
    }
    
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('company_id', companyId)
      .eq('month', month)
      .eq('year', year)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching transactions:', error);
      return;
    }

    console.log('Fetched transactions:', data);
    setTransactions(data || []);
  };

  // Fetch company settings
  const fetchSettings = async () => {
    if (!companyId) {
      setSettings(null);
      return;
    }
    
    const { data, error } = await supabase
      .from('company_settings')
      .select('*')
      .eq('company_id', companyId)
      .single();

    if (error) {
      console.error('Error fetching settings:', error);
      return;
    }

    console.log('Fetched settings:', data);
    setSettings(data);
  };

  // Calculate automatic transactions
  const calculateAutomaticTransactions = async (revenue?: number) => {
    if (!companyId) return;

    try {
      const { error } = await supabase.rpc('calculate_automatic_transactions', {
        p_company_id: companyId,
        p_month: month,
        p_year: year,
        p_revenue: revenue
      });

      if (error) {
        console.error('Error calculating automatic transactions:', error);
        return;
      }

      // Refresh transactions after calculation
      await fetchTransactions();
    } catch (error) {
      console.error('Error in calculateAutomaticTransactions:', error);
    }
  };

  // Create transaction
  const createTransaction = async (transactionData: Omit<Transaction, 'id'>) => {
    const { data, error } = await supabase
      .from('transactions')
      .insert([{
        ...transactionData,
        company_id: companyId
      }])
      .select()
      .single();

    if (error) {
      console.error('Error creating transaction:', error);
      throw error;
    }

    await fetchTransactions();
    
    // If it's a salary transaction, trigger automatic calculations
    if (transactionData.category === 'salary' && transactionData.type === 'income') {
      await calculateAutomaticTransactions(transactionData.amount);
    }

    return data;
  };

  // Update transaction
  const updateTransaction = async (id: string, updates: Partial<Transaction>) => {
    const { data, error } = await supabase
      .from('transactions')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating transaction:', error);
      throw error;
    }

    await fetchTransactions();

    // If updating a salary amount, recalculate
    const transaction = transactions.find(t => t.id === id);
    if (transaction?.category === 'salary' && updates.amount) {
      await calculateAutomaticTransactions(updates.amount);
    }

    return data;
  };

  // Delete transaction
  const deleteTransaction = async (id: string) => {
    const { error } = await supabase
      .from('transactions')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting transaction:', error);
      throw error;
    }

    await fetchTransactions();
  };

  // Update company settings
  const updateSettings = async (newSettings: Partial<CompanySettings>) => {
    const { data, error } = await supabase
      .from('company_settings')
      .update(newSettings)
      .eq('company_id', companyId)
      .select()
      .single();

    if (error) {
      console.error('Error updating settings:', error);
      throw error;
    }

    setSettings(data);
    
    // Recalculate transactions with new settings
    const salaryTransaction = transactions.find(t => t.category === 'salary' && t.type === 'income');
    if (salaryTransaction) {
      await calculateAutomaticTransactions(salaryTransaction.amount);
    }

    return data;
  };

  // Calculate balances
  const calculateBalances = () => {
    const income = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const expenses = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    return {
      income,
      expenses,
      balance: income - expenses
    };
  };

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      
      if (!companyId) {
        setIsLoading(false);
        return;
      }
      
      await Promise.all([fetchTransactions(), fetchSettings()]);
      setIsLoading(false);
    };

    loadData();
  }, [companyId, month, year]);

  const balances = calculateBalances();

  return {
    transactions,
    settings,
    isLoading,
    balances,
    createTransaction,
    updateTransaction,
    deleteTransaction,
    updateSettings,
    calculateAutomaticTransactions,
    refreshTransactions: fetchTransactions
  };
};
