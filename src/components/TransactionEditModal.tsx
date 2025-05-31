
import React, { useState } from 'react';
import { X, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    setAmount(value);
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
        className="fixed bottom-0 left-0 right-0 bg-white rounded-t-[24px] p-6 animate-slide-in-bottom z-[61]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Progress Bar */}
        <div className="w-full h-1 bg-gray-200 rounded-full mb-6">
          <div className="w-1/2 h-full bg-gradient-to-r from-[#78B60F] to-[#6D96E4] rounded-full"></div>
        </div>

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button onClick={onClose} className="p-2">
            <X className="w-6 h-6 text-gray-600" />
          </button>
          <h2 className="text-lg font-bold text-[#43464D]">
            Editar lançamento - Março 2025
          </h2>
          <div className="w-10"></div>
        </div>

        {/* Transaction Title */}
        <div className="mb-4">
          <h3 className="text-xl font-bold text-[#43464D] mb-2">{title}</h3>
          <div className="text-2xl font-bold bg-gradient-to-r from-[#7637EA] to-[#FF7A00] bg-clip-text text-transparent mb-1">
            {formatCurrency(amount)}
          </div>
          <p className="text-gray-500 text-sm">{description}</p>
        </div>

        {/* Form Fields */}
        <div className="space-y-6 mb-8">
          {/* Total Revenue Section */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Valor total do faturamento</span>
              <span className="text-gray-900 font-medium">R$ 10.500,00</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">% de desconto</span>
              <span className="text-gray-900 font-medium">{calculatePercentage()}%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Valor do pró-labore</span>
              <span className="text-gray-900 font-medium">{formatCurrency(amount)}</span>
            </div>
          </div>

          {/* Due Date */}
          <div className="space-y-2">
            <label className="text-gray-600 text-sm">Data de vencimento</label>
            <Select value={dueDate} onValueChange={setDueDate}>
              <SelectTrigger className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3">
                <SelectValue placeholder="Selecione o dia" />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 31 }, (_, i) => (
                  <SelectItem key={i + 1} value={String(i + 1)}>
                    Dia {i + 1}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Recurrence */}
          <div className="space-y-2">
            <label className="text-gray-600 text-sm">Recorrência</label>
            <Select value={recurrence} onValueChange={setRecurrence}>
              <SelectTrigger className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3">
                <SelectValue placeholder="Selecione a recorrência" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Semanal">Semanal</SelectItem>
                <SelectItem value="Mensal">Mensal</SelectItem>
                <SelectItem value="Trimestral">Trimestral</SelectItem>
                <SelectItem value="Anual">Anual</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Continue Button */}
        <Button 
          onClick={handleSave}
          className="w-full bg-black text-white py-4 rounded-xl text-lg font-medium hover:bg-gray-800 transition-colors"
        >
          Continuar
        </Button>
      </div>
    </div>
  );
};
