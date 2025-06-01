
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

interface Company {
  id: string;
  name: string;
  user_id: string;
}

interface CompanySettings {
  das_percentage: number;
  pro_labore_percentage: number;
  inss_percentage: number;
  accounting_fee: number;
}

interface MonthlyRevenue {
  total_revenue: number;
}

interface Transaction {
  id: string;
  title: string;
  description: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  status: 'pending' | 'completed';
  due_date: string;
  payment_date?: string;
}

export const useCompanyData = (month: number, year: number) => {
  const [company, setCompany] = useState<Company | null>(null);
  const [settings, setSettings] = useState<CompanySettings | null>(null);
  const [revenue, setRevenue] = useState<MonthlyRevenue | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const getCurrentUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  };

  const createInitialData = async (userId: string) => {
    try {
      // Create company
      const { data: companyData, error: companyError } = await supabase
        .from('companies')
        .insert({ 
          user_id: userId, 
          name: 'Anderson Design' 
        })
        .select()
        .single();

      if (companyError) throw companyError;

      // Create company settings
      const { error: settingsError } = await supabase
        .from('company_settings')
        .insert({
          company_id: companyData.id,
          das_percentage: 6.00,
          pro_labore_percentage: 28.10,
          inss_percentage: 11.00,
          accounting_fee: 0
        });

      if (settingsError) throw settingsError;

      // Create monthly revenue
      const { error: revenueError } = await supabase
        .from('monthly_revenue')
        .insert({
          company_id: companyData.id,
          month: month,
          year: year,
          total_revenue: 10500.00
        });

      if (revenueError) throw revenueError;

      // Calculate automatic transactions
      const { error: calcError } = await supabase.rpc('calculate_automatic_transactions', {
        p_company_id: companyData.id,
        p_month: month,
        p_year: year,
        p_revenue: 10500.00
      });

      if (calcError) throw calcError;

      return companyData;
    } catch (error) {
      console.error('Error creating initial data:', error);
      toast({
        title: "Erro",
        description: "Erro ao criar dados iniciais da empresa",
        variant: "destructive"
      });
      return null;
    }
  };

  const loadCompanyData = async () => {
    try {
      setLoading(true);
      const user = await getCurrentUser();
      
      if (!user) {
        console.log('No user found');
        setLoading(false);
        return;
      }

      // Get or create company
      let { data: companyData, error: companyError } = await supabase
        .from('companies')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (companyError && companyError.code === 'PGRST116') {
        // No company found, create initial data
        companyData = await createInitialData(user.id);
        if (!companyData) return;
      } else if (companyError) {
        throw companyError;
      }

      setCompany(companyData);

      // Get company settings
      const { data: settingsData, error: settingsError } = await supabase
        .from('company_settings')
        .select('*')
        .eq('company_id', companyData.id)
        .single();

      if (settingsError) throw settingsError;
      setSettings(settingsData);

      // Get monthly revenue
      const { data: revenueData, error: revenueError } = await supabase
        .from('monthly_revenue')
        .select('*')
        .eq('company_id', companyData.id)
        .eq('month', month)
        .eq('year', year)
        .single();

      if (revenueError && revenueError.code !== 'PGRST116') {
        throw revenueError;
      }
      setRevenue(revenueData || { total_revenue: 0 });

      // Get transactions
      const { data: transactionsData, error: transactionsError } = await supabase
        .from('transactions')
        .select('*')
        .eq('company_id', companyData.id)
        .eq('month', month)
        .eq('year', year);

      if (transactionsError) throw transactionsError;
      setTransactions(transactionsData || []);

    } catch (error) {
      console.error('Error loading company data:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar dados da empresa",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const updateTransaction = async (transactionId: string, updates: Partial<Transaction>) => {
    try {
      const { error } = await supabase
        .from('transactions')
        .update(updates)
        .eq('id', transactionId);

      if (error) throw error;

      // Reload data
      await loadCompanyData();

      toast({
        title: "Sucesso",
        description: "Transação atualizada com sucesso",
      });
    } catch (error) {
      console.error('Error updating transaction:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar transação",
        variant: "destructive"
      });
    }
  };

  const updateTransactionStatus = async (transactionId: string, newStatus: 'pending' | 'completed') => {
    await updateTransaction(transactionId, { 
      status: newStatus,
      payment_date: newStatus === 'completed' ? new Date().toISOString().split('T')[0] : null
    });
  };

  useEffect(() => {
    loadCompanyData();
  }, [month, year]);

  return {
    company,
    settings,
    revenue,
    transactions,
    loading,
    updateTransaction,
    updateTransactionStatus,
    refetch: loadCompanyData
  };
};
