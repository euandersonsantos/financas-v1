
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

interface Company {
  id: string;
  name: string;
  user_id: string;
  created_at: string;
  updated_at: string;
}

interface CompanySettings {
  id: string;
  company_id: string;
  pro_labore_percentage: number;
  inss_percentage: number;
  das_percentage: number;
  accounting_fee: number | null;
  created_at: string;
  updated_at: string;
}

export const useCompanies = () => {
  const { user } = useAuth();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [currentCompany, setCurrentCompany] = useState<Company | null>(null);
  const [companySettings, setCompanySettings] = useState<CompanySettings | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchCompanies = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      setCompanies(data || []);
      
      // Set first company as current if none selected
      if (data && data.length > 0 && !currentCompany) {
        setCurrentCompany(data[0]);
      }
    } catch (error) {
      console.error('Error fetching companies:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCompanySettings = async (companyId: string) => {
    try {
      const { data, error } = await supabase
        .from('company_settings')
        .select('*')
        .eq('company_id', companyId)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      
      setCompanySettings(data);
    } catch (error) {
      console.error('Error fetching company settings:', error);
    }
  };

  const createCompany = async (name: string, settings: {
    pro_labore_percentage: number;
    inss_percentage: number;
    das_percentage: number;
    accounting_fee?: number;
  }) => {
    if (!user) return { error: 'User not authenticated' };

    try {
      // Create company
      const { data: companyData, error: companyError } = await supabase
        .from('companies')
        .insert([{ name, user_id: user.id }])
        .select()
        .single();

      if (companyError) throw companyError;

      // Create company settings
      const { error: settingsError } = await supabase
        .from('company_settings')
        .insert([{
          company_id: companyData.id,
          ...settings
        }]);

      if (settingsError) throw settingsError;

      await fetchCompanies();
      setCurrentCompany(companyData);
      
      return { data: companyData, error: null };
    } catch (error) {
      console.error('Error creating company:', error);
      return { data: null, error };
    }
  };

  const updateCompanySettings = async (companyId: string, settings: Partial<CompanySettings>) => {
    try {
      const { data, error } = await supabase
        .from('company_settings')
        .update(settings)
        .eq('company_id', companyId)
        .select()
        .single();

      if (error) throw error;
      
      setCompanySettings(data);
      return { data, error: null };
    } catch (error) {
      console.error('Error updating company settings:', error);
      return { data: null, error };
    }
  };

  useEffect(() => {
    if (user) {
      fetchCompanies();
    } else {
      setCompanies([]);
      setCurrentCompany(null);
      setCompanySettings(null);
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (currentCompany) {
      fetchCompanySettings(currentCompany.id);
    }
  }, [currentCompany]);

  return {
    companies,
    currentCompany,
    setCurrentCompany,
    companySettings,
    loading,
    createCompany,
    updateCompanySettings,
    fetchCompanies,
  };
};
