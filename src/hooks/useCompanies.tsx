
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

interface Company {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
}

interface CompanySettings {
  id: string;
  company_id: string;
  pro_labore_percentage: number;
  inss_percentage: number;
  das_percentage: number;
  accounting_fee: number;
}

export function useCompanies() {
  const { user } = useAuth();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [companySettings, setCompanySettings] = useState<CompanySettings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchCompanies();
    } else {
      // Se não há usuário, definir loading como false
      setLoading(false);
      setCompanies([]);
      setSelectedCompany(null);
      setCompanySettings(null);
    }
  }, [user]);

  useEffect(() => {
    if (selectedCompany) {
      fetchCompanySettings(selectedCompany.id);
    }
  }, [selectedCompany]);

  const fetchCompanies = async () => {
    try {
      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) throw error;

      setCompanies(data || []);
      if (data && data.length > 0 && !selectedCompany) {
        setSelectedCompany(data[0]);
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

  const createCompany = async (name: string, settings: Omit<CompanySettings, 'id' | 'company_id'>) => {
    try {
      const { data: company, error: companyError } = await supabase
        .from('companies')
        .insert({ name, user_id: user?.id })
        .select()
        .single();

      if (companyError) throw companyError;

      const { error: settingsError } = await supabase
        .from('company_settings')
        .insert({ 
          company_id: company.id, 
          ...settings 
        });

      if (settingsError) throw settingsError;

      await fetchCompanies();
      setSelectedCompany(company);
      return { success: true };
    } catch (error) {
      console.error('Error creating company:', error);
      return { error: 'Erro ao criar empresa' };
    }
  };

  const updateCompanySettings = async (settings: Partial<Omit<CompanySettings, 'id' | 'company_id'>>) => {
    if (!selectedCompany) return { error: 'Nenhuma empresa selecionada' };

    try {
      const { error } = await supabase
        .from('company_settings')
        .upsert({ 
          company_id: selectedCompany.id, 
          ...settings 
        });

      if (error) throw error;

      await fetchCompanySettings(selectedCompany.id);
      return { success: true };
    } catch (error) {
      console.error('Error updating company settings:', error);
      return { error: 'Erro ao atualizar configurações' };
    }
  };

  const selectCompany = (company: Company) => {
    setSelectedCompany(company);
  };

  return {
    companies,
    selectedCompany,
    companySettings,
    loading,
    createCompany,
    updateCompanySettings,
    selectCompany,
    fetchCompanies
  };
}
