
import React, { useState } from 'react';
import { ArrowLeft, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface TransactionEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  transaction: {
    id: string;
    title: string;
    description: string;
    amount: string;
    type: 'income' | 'expense';
  } | null;
  onSave: (transaction: any) => void;
}

export const TransactionEditModal: React.FC<TransactionEditModalProps> = ({
  isOpen,
  onClose,
  transaction,
  onSave
}) => {
  const [title, setTitle] = useState(transaction?.title || '');
  const [amount, setAmount] = useState(transaction?.amount.replace(/[R$\s+-]/g, '') || '');
  const [description, setDescription] = useState(transaction?.description || '');
  const [dueDate, setDueDate] = useState('25');
  const [recurrence, setRecurrence] = useState('Mensal');

  const formatCurrency = (value: string) => {
    const numericValue = value.replace(/\D/g, '');
    const formatted = (parseInt(numericValue) / 100).toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
    return `R$ ${formatted}`;
  };

  const calculatePercentage = () => {
    const totalRevenue = 10500; // Based on the mock data
    const amountValue = parseInt(amount) / 100;
    return ((amountValue / totalRevenue) * 100).toFixed(1);
  };

  const handleSave = () => {
    const updatedTransaction = {
      ...transaction,
      title,
      amount: formatCurrency(amount),
      description
    };
    onSave(updatedTransaction);
    onClose();
  };

  if (!isOpen || !transaction) return null;

  return (
    <div className="fixed inset-0 z-[60] bg-black/50" onClick={onClose}>
      <div 
        className="fixed bottom-0 left-0 right-0 bg-white rounded-t-[24px] p-4 animate-slide-in-bottom z-[61]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with Progress Bar */}
        <div className="flex items-center justify-between mb-6">
          <button onClick={onClose} className="p-1">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-gray-700">
              <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" fill="currentColor"/>
            </svg>
          </button>
          <div className="relative w-32 h-1 bg-[#ECECEC] rounded-sm overflow-hidden">
            <div 
              className="absolute top-0 left-0 h-full rounded-sm bg-gradient-to-r from-[#78B60F] to-[#6D96E4]" 
              style={{ width: '50%' }}
            />
          </div>
          <div className="w-6"></div>
        </div>

        {/* Title and Transaction Info */}
        <h1 className="text-xl font-semibold text-gray-800 mb-1">
          Editar lançamento - Março 2025
        </h1>
        <p className="text-gray-500 text-sm mb-1">Pró-Labore</p>
        <p className="text-3xl font-bold mb-1 bg-gradient-to-r from-[#7637EA] to-[#FF7A00] bg-clip-text text-transparent">
          {formatCurrency(amount)}
        </p>
        <p className="text-gray-500 text-xs">100% do faturamento</p>

        {/* Dashed Border Section */}
        <div className="border-t border-b border-dashed border-gray-200 my-6 py-4 -mx-4 px-4">
          <div className="flex justify-between items-center mb-3">
            <p className="text-sm text-gray-600 font-semibold">Valor total do faturamento</p>
            <p className="text-sm text-gray-800 font-medium">R$ 10.500,00</p>
          </div>
          <div className="flex justify-between items-center mb-3">
            <p className="text-sm text-gray-600 font-semibold">% de desconto</p>
            <p className="text-sm text-gray-800 font-medium">{calculatePercentage()}%</p>
          </div>
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-600 font-semibold">Valor do pró-labore</p>
            <p className="text-sm text-gray-800 font-medium">{formatCurrency(amount)}</p>
          </div>
        </div>

        {/* Form Fields */}
        <div className="space-y-4 mb-2">
          {/* Due Date */}
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-600 font-semibold">Data de vencimento</p>
            <div className="flex items-center">
              <Select value={dueDate} onValueChange={setDueDate}>
                <SelectTrigger className="border-0 p-0 h-auto bg-transparent focus:ring-0 focus:ring-offset-0">
                  <div className="flex items-center">
                    <SelectValue className="text-sm text-gray-800 mr-1" />
                    <ChevronDown className="w-4 h-4 text-gray-600" />
                  </div>
                </SelectTrigger>
                <SelectContent className="bg-white border border-gray-200 shadow-lg z-[70]">
                  {Array.from({ length: 31 }, (_, i) => (
                    <SelectItem key={i + 1} value={String(i + 1)}>
                      Dia {i + 1}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Recurrence */}
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-600 font-semibold">Recorrência</p>
            <div className="flex items-center">
              <Select value={recurrence} onValueChange={setRecurrence}>
                <SelectTrigger className="border-0 p-0 h-auto bg-transparent focus:ring-0 focus:ring-offset-0">
                  <div className="flex items-center">
                    <SelectValue className="text-sm text-gray-800 mr-1" />
                    <ChevronDown className="w-4 h-4 text-gray-600" />
                  </div>
                </SelectTrigger>
                <SelectContent className="bg-white border border-gray-200 shadow-lg z-[70]">
                  <SelectItem value="Semanal">Semanal</SelectItem>
                  <SelectItem value="Mensal">Mensal</SelectItem>
                  <SelectItem value="Trimestral">Trimestral</SelectItem>
                  <SelectItem value="Anual">Anual</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Continue Button */}
        <Button 
          onClick={handleSave}
          className="w-full bg-black text-white rounded-full font-semibold text-center hover:bg-gray-800 transition-colors h-[52px] mb-2"
        >
          Continuar
        </Button>
      </div>
    </div>
  );
};
