
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useCompanies } from '@/hooks/useCompanies';
import { useToast } from '@/hooks/use-toast';

interface CompanySetupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CompanySetupModal: React.FC<CompanySetupModalProps> = ({ 
  isOpen, 
  onClose 
}) => {
  const [companyName, setCompanyName] = useState('');
  const [proLaborePercentage, setProLaborePercentage] = useState('28.1');
  const [inssPercentage, setInssPercentage] = useState('11');
  const [dasPercentage, setDasPercentage] = useState('6');
  const [accountingFee, setAccountingFee] = useState('0');
  const [loading, setLoading] = useState(false);
  
  const { createCompany } = useCompanies();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await createCompany(companyName, {
        pro_labore_percentage: parseFloat(proLaborePercentage),
        inss_percentage: parseFloat(inssPercentage),
        das_percentage: parseFloat(dasPercentage),
        accounting_fee: parseFloat(accountingFee) || null,
      });

      if (error) throw error;

      toast({ title: 'Empresa criada com sucesso!' });
      onClose();
      
      // Reset form
      setCompanyName('');
      setProLaborePercentage('28.1');
      setInssPercentage('11');
      setDasPercentage('6');
      setAccountingFee('0');
    } catch (error: any) {
      toast({
        title: 'Erro ao criar empresa',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4">Configurar Nova Empresa</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="companyName">Nome da Empresa</Label>
            <Input
              id="companyName"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="Ex: Anderson Design"
              required
            />
          </div>
          
          <div>
            <Label htmlFor="proLabore">Pró-labore (% do faturamento)</Label>
            <Input
              id="proLabore"
              type="number"
              step="0.1"
              value={proLaborePercentage}
              onChange={(e) => setProLaborePercentage(e.target.value)}
              placeholder="28.1"
              required
            />
          </div>
          
          <div>
            <Label htmlFor="inss">INSS (% do pró-labore)</Label>
            <Input
              id="inss"
              type="number"
              step="0.1"
              value={inssPercentage}
              onChange={(e) => setInssPercentage(e.target.value)}
              placeholder="11"
              required
            />
          </div>
          
          <div>
            <Label htmlFor="das">DAS (% do faturamento)</Label>
            <Input
              id="das"
              type="number"
              step="0.1"
              value={dasPercentage}
              onChange={(e) => setDasPercentage(e.target.value)}
              placeholder="6"
              required
            />
          </div>
          
          <div>
            <Label htmlFor="accounting">Taxa de Contabilidade (R$)</Label>
            <Input
              id="accounting"
              type="number"
              step="0.01"
              value={accountingFee}
              onChange={(e) => setAccountingFee(e.target.value)}
              placeholder="0"
            />
          </div>
          
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Criando...' : 'Criar Empresa'}
          </Button>
        </form>
        
        <Button
          variant="outline"
          onClick={onClose}
          className="w-full mt-4"
        >
          Cancelar
        </Button>
      </div>
    </div>
  );
};
