
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface CompanyEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (companyData: CompanyData) => void;
  companyData?: CompanyData;
}

interface CompanyData {
  name: string;
  taxRate: number; // Alíquota de imposto em %
  proLaboreRate: number; // % do pró-labore sobre o faturamento
  inssRate: number; // % do INSS sobre o pró-labore
}

export const CompanyEditModal: React.FC<CompanyEditModalProps> = ({
  isOpen,
  onClose,
  onSave,
  companyData
}) => {
  const [isClosing, setIsClosing] = useState(false);
  const [formData, setFormData] = useState<CompanyData>({
    name: '',
    taxRate: 6,
    proLaboreRate: 28,
    inssRate: 11
  });

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
    } else {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
    };
  }, [isOpen]);

  // Load company data when modal opens
  useEffect(() => {
    if (isOpen && companyData) {
      setFormData(companyData);
    } else if (isOpen) {
      // Default values
      setFormData({
        name: 'Anderson Design',
        taxRate: 6,
        proLaboreRate: 28,
        inssRate: 11
      });
    }
  }, [isOpen, companyData]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
      setIsClosing(false);
    }, 300);
  };

  const handleSave = () => {
    onSave(formData);
    handleClose();
  };

  const handleInputChange = (field: keyof CompanyData, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (!isOpen) return null;

  return (
    <div 
      className={`fixed inset-0 z-[60] bg-black/50 transition-opacity duration-300 overflow-hidden ${
        isClosing ? 'opacity-0' : 'opacity-100'
      }`}
      onClick={handleClose}
    >
      <div
        className={`fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl z-[61] transition-all duration-300 ease-out shadow-xl max-w-[500px] mx-auto ${
          isClosing ? 'translate-y-full' : 'translate-y-0'
        } ${!isClosing && isOpen ? 'animate-slide-in-bottom' : ''}`}
        onClick={e => e.stopPropagation()}
      >
        {/* Handle bar */}
        <div className="py-3 flex justify-center">
          <div className="w-12 h-1.5 bg-gray-300 rounded-full"></div>
        </div>

        {/* Header */}
        <div className="px-5 py-3">
          <h2 className="text-xl font-semibold text-gray-800">Editar empresa</h2>
        </div>

        {/* Form Content */}
        <div className="px-5 py-4 space-y-6">
          {/* Company Name */}
          <div className="space-y-2">
            <Label htmlFor="companyName" className="text-sm font-medium text-gray-700">
              Nome da empresa
            </Label>
            <Input
              id="companyName"
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Digite o nome da empresa"
            />
          </div>

          {/* Tax Rate */}
          <div className="space-y-2">
            <Label htmlFor="taxRate" className="text-sm font-medium text-gray-700">
              Alíquota de imposto (%)
            </Label>
            <div className="relative">
              <Input
                id="taxRate"
                type="number"
                value={formData.taxRate}
                onChange={(e) => handleInputChange('taxRate', parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 pr-8 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="6"
                min="0"
                max="100"
                step="0.1"
              />
              <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">%</span>
            </div>
          </div>

          {/* Pro-labore Rate */}
          <div className="space-y-2">
            <Label htmlFor="proLaboreRate" className="text-sm font-medium text-gray-700">
              % do pró-labore (sobre o faturamento)
            </Label>
            <div className="relative">
              <Input
                id="proLaboreRate"
                type="number"
                value={formData.proLaboreRate}
                onChange={(e) => handleInputChange('proLaboreRate', parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 pr-8 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="28"
                min="0"
                max="100"
                step="0.1"
              />
              <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">%</span>
            </div>
          </div>

          {/* INSS Rate */}
          <div className="space-y-2">
            <Label htmlFor="inssRate" className="text-sm font-medium text-gray-700">
              % do INSS (sobre o pró-labore)
            </Label>
            <div className="relative">
              <Input
                id="inssRate"
                type="number"
                value={formData.inssRate}
                onChange={(e) => handleInputChange('inssRate', parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 pr-8 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="11"
                min="0"
                max="100"
                step="0.1"
              />
              <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">%</span>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="px-5 py-6">
          <button
            className="w-full bg-black text-white font-semibold py-3.5 rounded-xl transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 hover:bg-gray-900"
            onClick={handleSave}
          >
            Salvar configurações
          </button>
        </div>
      </div>
    </div>
  );
};
