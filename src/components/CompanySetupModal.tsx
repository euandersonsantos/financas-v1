
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useCompanies } from '@/hooks/useCompanies';

interface CompanySetupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CompanySetupModal({ isOpen, onClose }: CompanySetupModalProps) {
  const [companyName, setCompanyName] = useState('');
  const [proLaborePercentage, setProLaborePercentage] = useState('28.10');
  const [inssPercentage, setInssPercentage] = useState('11.00');
  const [dasPercentage, setDasPercentage] = useState('6.00');
  const [accountingFee, setAccountingFee] = useState('0');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { createCompany } = useCompanies();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await createCompany(companyName, {
        pro_labore_percentage: parseFloat(proLaborePercentage),
        inss_percentage: parseFloat(inssPercentage),
        das_percentage: parseFloat(dasPercentage),
        accounting_fee: parseFloat(accountingFee)
      });

      if (result.error) {
        setError(result.error);
      } else {
        onClose();
        // Reset form
        setCompanyName('');
        setProLaborePercentage('28.10');
        setInssPercentage('11.00');
        setDasPercentage('6.00');
        setAccountingFee('0');
      }
    } catch (err) {
      setError('Erro inesperado');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Configurar Nova Empresa</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="companyName">Nome da Empresa</Label>
            <Input
              id="companyName"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="proLabore">Pró-labore (%)</Label>
            <Input
              id="proLabore"
              type="number"
              step="0.01"
              value={proLaborePercentage}
              onChange={(e) => setProLaborePercentage(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="inss">INSS (% do pró-labore)</Label>
            <Input
              id="inss"
              type="number"
              step="0.01"
              value={inssPercentage}
              onChange={(e) => setInssPercentage(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="das">DAS (% do faturamento)</Label>
            <Input
              id="das"
              type="number"
              step="0.01"
              value={dasPercentage}
              onChange={(e) => setDasPercentage(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="accounting">Taxa de Contabilidade (R$)</Label>
            <Input
              id="accounting"
              type="number"
              step="0.01"
              value={accountingFee}
              onChange={(e) => setAccountingFee(e.target.value)}
            />
          </div>

          {error && (
            <div className="text-red-500 text-sm">{error}</div>
          )}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Criando...' : 'Criar Empresa'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
