
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface Company {
  id: string;
  name: string;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export const useCompany = () => {
  const [company, setCompany] = useState<Company | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const createDefaultCompany = async (userId: string) => {
    console.log('Creating default company for user:', userId);
    
    // Create company
    const { data: companyData, error: companyError } = await supabase
      .from('companies')
      .insert([{
        name: 'Anderson Design',
        user_id: userId
      }])
      .select()
      .single();

    if (companyError) {
      console.error('Error creating company:', companyError);
      return null;
    }

    // Create company settings
    const { error: settingsError } = await supabase
      .from('company_settings')
      .insert([{
        company_id: companyData.id,
        pro_labore_percentage: 28.1,
        das_percentage: 6.0,
        inss_percentage: 11.0,
        accounting_fee: 0
      }]);

    if (settingsError) {
      console.error('Error creating company settings:', settingsError);
    }

    // Create initial revenue for current month (July 2025)
    const currentMonth = 7;
    const currentYear = 2025;
    const initialRevenue = 10500;

    const { error: revenueError } = await supabase
      .from('monthly_revenue')
      .insert([{
        company_id: companyData.id,
        month: currentMonth,
        year: currentYear,
        total_revenue: initialRevenue
      }]);

    if (revenueError) {
      console.error('Error creating monthly revenue:', revenueError);
    }

    // Calculate automatic transactions
    try {
      const { error: calcError } = await supabase.rpc('calculate_automatic_transactions', {
        p_company_id: companyData.id,
        p_month: currentMonth,
        p_year: currentYear,
        p_revenue: initialRevenue
      });

      if (calcError) {
        console.error('Error calculating automatic transactions:', calcError);
      }
    } catch (error) {
      console.error('Error in calculateAutomaticTransactions:', error);
    }

    return companyData;
  };

  const fetchOrCreateCompany = async () => {
    setIsLoading(true);
    
    try {
      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        console.error('No user found:', userError);
        setIsLoading(false);
        return;
      }

      // Try to fetch existing company
      const { data: existingCompany, error: fetchError } = await supabase
        .from('companies')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') {
        console.error('Error fetching company:', fetchError);
        setIsLoading(false);
        return;
      }

      if (existingCompany) {
        console.log('Found existing company:', existingCompany);
        setCompany(existingCompany);
      } else {
        console.log('No company found, creating default company');
        const newCompany = await createDefaultCompany(user.id);
        if (newCompany) {
          setCompany(newCompany);
        }
      }
    } catch (error) {
      console.error('Error in fetchOrCreateCompany:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrCreateCompany();
  }, []);

  return {
    company,
    isLoading,
    refetch: fetchOrCreateCompany
  };
};
