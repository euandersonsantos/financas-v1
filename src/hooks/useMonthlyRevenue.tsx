
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

interface MonthlyRevenue {
  id: string;
  company_id: string;
  month: number;
  year: number;
  total_revenue: number;
  created_at: string;
  updated_at: string;
}

interface CalculatedTaxes {
  id: string;
  company_id: string;
  reference_month: number;
  reference_year: number;
  payment_month: number;
  payment_year: number;
  pro_labore_amount: number;
  inss_amount: number;
  das_amount: number;
  created_at: string;
  updated_at: string;
}

export const useMonthlyRevenue = (companyId: string | null) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [monthlyRevenues, setMonthlyRevenues] = useState<MonthlyRevenue[]>([]);
  const [calculatedTaxes, setCalculatedTaxes] = useState<CalculatedTaxes[]>([]);

  const fetchMonthlyRevenue = async (month: number, year: number) => {
    if (!companyId) return null;
    
    try {
      const { data, error } = await supabase
        .from('monthly_revenue')
        .select('*')
        .eq('company_id', companyId)
        .eq('month', month)
        .eq('year', year)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      
      return data;
    } catch (error) {
      console.error('Error fetching monthly revenue:', error);
      return null;
    }
  };

  const createOrUpdateMonthlyRevenue = async (month: number, year: number, totalRevenue: number) => {
    if (!companyId) return { error: 'Company not selected' };

    try {
      const { data, error } = await supabase
        .from('monthly_revenue')
        .upsert({
          company_id: companyId,
          month,
          year,
          total_revenue: totalRevenue
        })
        .select()
        .single();

      if (error) throw error;
      
      return { data, error: null };
    } catch (error) {
      console.error('Error creating/updating monthly revenue:', error);
      return { data: null, error };
    }
  };

  const calculateTaxes = async (
    month: number, 
    year: number, 
    totalRevenue: number, 
    settings: {
      pro_labore_percentage: number;
      inss_percentage: number;
      das_percentage: number;
    }
  ) => {
    if (!companyId) return { error: 'Company not selected' };

    try {
      // Calcular impostos
      const proLaboreAmount = (totalRevenue * settings.pro_labore_percentage) / 100;
      const inssAmount = (proLaboreAmount * settings.inss_percentage) / 100;
      const dasAmount = (totalRevenue * settings.das_percentage) / 100;

      // Determinar mês/ano de pagamento (mês seguinte)
      let paymentMonth = month + 1;
      let paymentYear = year;
      
      if (paymentMonth > 12) {
        paymentMonth = 1;
        paymentYear = year + 1;
      }

      const { data, error } = await supabase
        .from('calculated_taxes')
        .upsert({
          company_id: companyId,
          reference_month: month,
          reference_year: year,
          payment_month: paymentMonth,
          payment_year: paymentYear,
          pro_labore_amount: proLaboreAmount,
          inss_amount: inssAmount,
          das_amount: dasAmount
        })
        .select()
        .single();

      if (error) throw error;
      
      return { data, error: null };
    } catch (error) {
      console.error('Error calculating taxes:', error);
      return { data: null, error };
    }
  };

  const fetchCalculatedTaxes = async (month: number, year: number) => {
    if (!companyId) return null;
    
    try {
      const { data, error } = await supabase
        .from('calculated_taxes')
        .select('*')
        .eq('company_id', companyId)
        .eq('reference_month', month)
        .eq('reference_year', year)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      
      return data;
    } catch (error) {
      console.error('Error fetching calculated taxes:', error);
      return null;
    }
  };

  const fetchTaxesForPayment = async (month: number, year: number) => {
    if (!companyId) return null;
    
    try {
      const { data, error } = await supabase
        .from('calculated_taxes')
        .select('*')
        .eq('company_id', companyId)
        .eq('payment_month', month)
        .eq('payment_year', year)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      
      return data;
    } catch (error) {
      console.error('Error fetching taxes for payment:', error);
      return null;
    }
  };

  return {
    loading,
    monthlyRevenues,
    calculatedTaxes,
    fetchMonthlyRevenue,
    createOrUpdateMonthlyRevenue,
    calculateTaxes,
    fetchCalculatedTaxes,
    fetchTaxesForPayment,
  };
};
