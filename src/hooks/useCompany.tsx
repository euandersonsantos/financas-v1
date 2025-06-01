
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
  das_percentage: number;
  inss_percentage: number;
  accounting_fee: number | null;
  created_at: string;
  updated_at: string;
}

export const useCompany = () => {
  const { user } = useAuth();
  const [company, setCompany] = useState<Company | null>(null);
  const [settings, setSettings] = useState<CompanySettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchOrCreateCompany = async () => {
      try {
        // Buscar empresa existente
        const { data: existingCompany, error: companyError } = await supabase
          .from('companies')
          .select('*')
          .eq('user_id', user.id)
          .single();

        let companyData = existingCompany;

        // Se não existir, criar nova empresa
        if (companyError && companyError.code === 'PGRST116') {
          const { data: newCompany, error: createError } = await supabase
            .from('companies')
            .insert([
              {
                name: 'Anderson Design',
                user_id: user.id,
              },
            ])
            .select()
            .single();

          if (createError) throw createError;
          companyData = newCompany;
        } else if (companyError) {
          throw companyError;
        }

        setCompany(companyData);

        // Buscar ou criar configurações da empresa
        const { data: existingSettings, error: settingsError } = await supabase
          .from('company_settings')
          .select('*')
          .eq('company_id', companyData.id)
          .single();

        let settingsData = existingSettings;

        // Se não existir, criar configurações padrão
        if (settingsError && settingsError.code === 'PGRST116') {
          const { data: newSettings, error: createSettingsError } = await supabase
            .from('company_settings')
            .insert([
              {
                company_id: companyData.id,
                pro_labore_percentage: 28.1,
                das_percentage: 6.0,
                inss_percentage: 11.0,
                accounting_fee: null,
              },
            ])
            .select()
            .single();

          if (createSettingsError) throw createSettingsError;
          settingsData = newSettings;
        } else if (settingsError) {
          throw settingsError;
        }

        setSettings(settingsData);

        // Criar receita inicial se não existir
        const { data: existingRevenue } = await supabase
          .from('monthly_revenue')
          .select('*')
          .eq('company_id', companyData.id)
          .eq('month', 7)
          .eq('year', 2025)
          .single();

        if (!existingRevenue) {
          await supabase.from('monthly_revenue').insert([
            {
              company_id: companyData.id,
              month: 7,
              year: 2025,
              total_revenue: 10500,
            },
          ]);

          // Calcular transações automáticas
          await supabase.rpc('calculate_automatic_transactions', {
            p_company_id: companyData.id,
            p_month: 7,
            p_year: 2025,
            p_revenue: 10500,
          });
        }
      } catch (err) {
        console.error('Error in fetchOrCreateCompany:', err);
        setError(err instanceof Error ? err.message : 'Erro desconhecido');
      } finally {
        setLoading(false);
      }
    };

    fetchOrCreateCompany();
  }, [user]);

  return {
    company,
    settings,
    loading,
    error,
  };
};
