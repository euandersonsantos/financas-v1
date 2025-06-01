
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useCompanies } from './useCompanies';

interface MonthlyRevenue {
  id: string;
  company_id: string;
  month: number;
  year: number;
  total_revenue: number;
}

interface Transaction {
  id: string;
  company_id: string;
  month: number;
  year: number;
  title: string;
  description: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  status: 'pending' | 'completed';
  due_date?: string;
  payment_date?: string;
  is_auto_generated?: boolean;
}

interface CalculatedTaxes {
  id: string;
  company_id: string;
  reference_month: number;
  reference_year: number;
  payment_month: number;
  payment_year: number;
  das_amount: number;
  inss_amount: number;
  pro_labore_amount: number;
}

export function useFinancialData() {
  const { selectedCompany, companySettings } = useCompanies();
  const [monthlyRevenue, setMonthlyRevenue] = useState<MonthlyRevenue | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [calculatedTaxes, setCalculatedTaxes] = useState<CalculatedTaxes | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchMonthlyData = async (month: number, year: number) => {
    if (!selectedCompany) return;

    setLoading(true);
    try {
      // Buscar faturamento do mês
      const { data: revenueData } = await supabase
        .from('monthly_revenue')
        .select('*')
        .eq('company_id', selectedCompany.id)
        .eq('month', month)
        .eq('year', year)
        .single();

      setMonthlyRevenue(revenueData);

      // Buscar transações do mês
      const { data: transactionsData } = await supabase
        .from('transactions')
        .select('*')
        .eq('company_id', selectedCompany.id)
        .eq('month', month)
        .eq('year', year)
        .order('created_at', { ascending: true });

      setTransactions(transactionsData || []);

      // Buscar impostos calculados para este mês
      const { data: taxesData } = await supabase
        .from('calculated_taxes')
        .select('*')
        .eq('company_id', selectedCompany.id)
        .eq('reference_month', month)
        .eq('reference_year', year)
        .single();

      setCalculatedTaxes(taxesData);

    } catch (error) {
      console.error('Error fetching monthly data:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateRevenue = async (month: number, year: number, revenue: number) => {
    if (!selectedCompany || !companySettings) return { error: 'Empresa ou configurações não encontradas' };

    try {
      // Atualizar/criar faturamento mensal
      const { error: revenueError } = await supabase
        .from('monthly_revenue')
        .upsert({
          company_id: selectedCompany.id,
          month,
          year,
          total_revenue: revenue
        });

      if (revenueError) throw revenueError;

      // Calcular impostos automaticamente
      await calculateAndCreateTaxes(month, year, revenue);
      
      // Recarregar dados
      await fetchMonthlyData(month, year);
      
      return { success: true };
    } catch (error) {
      console.error('Error updating revenue:', error);
      return { error: 'Erro ao atualizar faturamento' };
    }
  };

  const calculateAndCreateTaxes = async (month: number, year: number, revenue: number) => {
    if (!selectedCompany || !companySettings) return;

    // Calcular valores
    const proLaboreAmount = (revenue * companySettings.pro_labore_percentage) / 100;
    const inssAmount = (proLaboreAmount * companySettings.inss_percentage) / 100;
    const dasAmount = (revenue * companySettings.das_percentage) / 100;

    // Determinar mês de pagamento (próximo mês)
    const paymentMonth = month === 12 ? 1 : month + 1;
    const paymentYear = month === 12 ? year + 1 : year;

    // Salvar impostos calculados
    await supabase
      .from('calculated_taxes')
      .upsert({
        company_id: selectedCompany.id,
        reference_month: month,
        reference_year: year,
        payment_month: paymentMonth,
        payment_year: paymentYear,
        das_amount: dasAmount,
        inss_amount: inssAmount,
        pro_labore_amount: proLaboreAmount
      });

    // Criar/atualizar transações automáticas para o mês de referência
    const autoTransactions = [
      {
        company_id: selectedCompany.id,
        month,
        year,
        title: 'Pró-labore',
        description: `${getMonthName(month)} ${year}`,
        amount: proLaboreAmount,
        type: 'expense' as const,
        category: 'pro_labore',
        status: 'completed' as const,
        is_auto_generated: true
      }
    ];

    // Criar transações de impostos para o mês de pagamento
    const taxTransactions = [
      {
        company_id: selectedCompany.id,
        month: paymentMonth,
        year: paymentYear,
        title: 'DAS - Simples Nacional',
        description: `referente a ${getMonthName(month)} ${year}`,
        amount: dasAmount,
        type: 'expense' as const,
        category: 'das',
        status: 'pending' as const,
        is_auto_generated: true
      },
      {
        company_id: selectedCompany.id,
        month: paymentMonth,
        year: paymentYear,
        title: 'INSS',
        description: `referente a ${getMonthName(month)} ${year}`,
        amount: inssAmount,
        type: 'expense' as const,
        category: 'inss',
        status: 'pending' as const,
        is_auto_generated: true
      }
    ];

    // Inserir todas as transações
    await supabase
      .from('transactions')
      .upsert([...autoTransactions, ...taxTransactions]);
  };

  const createTransaction = async (month: number, year: number, transaction: Omit<Transaction, 'id' | 'company_id' | 'month' | 'year'>) => {
    if (!selectedCompany) return { error: 'Nenhuma empresa selecionada' };

    try {
      const { error } = await supabase
        .from('transactions')
        .insert({
          company_id: selectedCompany.id,
          month,
          year,
          ...transaction
        });

      if (error) throw error;

      await fetchMonthlyData(month, year);
      return { success: true };
    } catch (error) {
      console.error('Error creating transaction:', error);
      return { error: 'Erro ao criar transação' };
    }
  };

  const updateTransaction = async (transactionId: string, updates: Partial<Transaction>) => {
    try {
      const { error } = await supabase
        .from('transactions')
        .update(updates)
        .eq('id', transactionId);

      if (error) throw error;

      // Recarregar transações
      const transaction = transactions.find(t => t.id === transactionId);
      if (transaction) {
        await fetchMonthlyData(transaction.month, transaction.year);
      }
      
      return { success: true };
    } catch (error) {
      console.error('Error updating transaction:', error);
      return { error: 'Erro ao atualizar transação' };
    }
  };

  const deleteTransaction = async (transactionId: string) => {
    try {
      const { error } = await supabase
        .from('transactions')
        .delete()
        .eq('id', transactionId);

      if (error) throw error;

      // Recarregar transações
      const transaction = transactions.find(t => t.id === transactionId);
      if (transaction) {
        await fetchMonthlyData(transaction.month, transaction.year);
      }
      
      return { success: true };
    } catch (error) {
      console.error('Error deleting transaction:', error);
      return { error: 'Erro ao excluir transação' };
    }
  };

  return {
    monthlyRevenue,
    transactions,
    calculatedTaxes,
    loading,
    fetchMonthlyData,
    updateRevenue,
    createTransaction,
    updateTransaction,
    deleteTransaction
  };
}

function getMonthName(month: number): string {
  const months = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];
  return months[month - 1];
}
