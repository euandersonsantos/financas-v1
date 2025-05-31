import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
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
  const [currentScreen, setCurrentScreen] = useState<'edit' | 'value'>('edit');
  const [title, setTitle] = useState(transaction?.title || '');
  const [amount, setAmount] = useState(transaction?.amount.replace(/[R$\s+-]/g, '') || '');
  const [description, setDescription] = useState(transaction?.description || '');
  const [dueDate, setDueDate] = useState('25');
  const [recurrence, setRecurrence] = useState('Mensal');
  const [newValue, setNewValue] = useState('295050'); // R$ 2.950,50 in cents
  const [isClosing, setIsClosing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

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

  // Auto-focus input when entering value screen
  useEffect(() => {
    if (isOpen && currentScreen === 'value' && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus({
          preventScroll: true
        });
        inputRef.current?.select();
      }, 100); // Reduced timeout for faster response
    }
  }, [currentScreen]);
  const formatCurrency = (value: string) => {
    const numericValue = value.replace(/\D/g, '');
    if (!numericValue || numericValue === '0') return 'R$ 0,00';
    const formatted = (parseInt(numericValue) / 100).toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
    return `R$ ${formatted}`;
  };
  const formatCurrencyDisplay = (cents: string) => {
    if (!cents || cents === '0') return '0,00';
    const numericValue = parseInt(cents) / 100;
    return numericValue.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };
  const calculatePercentage = () => {
    const totalRevenue = 10500; // Based on the mock data
    const amountValue = parseInt(amount) / 100;
    if (isNaN(amountValue)) return '0.0';
    return (amountValue / totalRevenue * 100).toFixed(1);
  };
  const calculateDifference = () => {
    const originalValue = parseInt(amount);
    const newValueInt = parseInt(newValue);
    if (isNaN(originalValue) || isNaN(newValueInt)) return 0;
    const difference = newValueInt - originalValue;
    return Math.abs(difference);
  };
  const handleContinue = () => {
    setCurrentScreen('value');
  };
  const handleBack = () => {
    if (currentScreen === 'value') {
      setCurrentScreen('edit');
    } else {
      setIsClosing(true);
      setTimeout(() => {
        onClose();
        setIsClosing(false);
        setCurrentScreen('edit');
      }, 300);
    }
  };
  const handleSave = () => {
    const updatedTransaction = {
      ...transaction,
      title,
      amount: formatCurrency(currentScreen === 'value' ? newValue : amount),
      description
    };
    onSave(updatedTransaction);
    setIsClosing(true);
    setTimeout(() => {
      onClose();
      setIsClosing(false);
      setCurrentScreen('edit');
    }, 300);
  };
  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[R$\s.,]/g, '');
    setNewValue(value || '0');
  };
  if (!isOpen || !transaction) return null;
  return <div className={`fixed inset-0 z-[60] bg-black/50 transition-opacity duration-300 overflow-hidden ${isClosing ? 'opacity-0' : 'opacity-100'}`} onClick={handleBack}>
      <div className={`fixed bottom-0 left-0 right-0 bg-white rounded-t-[24px] p-4 pb-6 z-[61] transition-all duration-300 ease-out ${isClosing ? 'translate-y-full' : 'translate-y-0'} ${!isClosing && isOpen ? 'animate-slide-in-bottom' : ''}`} onClick={e => e.stopPropagation()}>
        {/* Header with Progress Bar */}
        <div className="flex items-center justify-between mb-6">
          <button onClick={handleBack} className="p-1">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-gray-700">
              <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" fill="currentColor" />
            </svg>
          </button>
          <div className="relative w-32 h-1 bg-[#ECECEC] rounded-sm overflow-hidden">
            <div className={`absolute top-0 left-0 h-full rounded-sm bg-gradient-to-r from-[#78B60F] to-[#6D96E4] transition-all duration-500 ease-out`} style={{
            width: currentScreen === 'edit' ? '50%' : '100%'
          }} />
          </div>
          <div className="w-6"></div>
        </div>

        <div className={`transition-all duration-300 ease-in-out ${currentScreen === 'edit' ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-full absolute'}`}>
          {/* Edit Screen Content */}
          <h1 className="text-xl font-semibold text-gray-800 mb-1">
            Editar lançamento - Março 2025
          </h1>
          <p className="text-gray-500 text-sm mb-1">Pró-Labore</p>
          <p className="text-3xl font-bold mb-1 bg-gradient-to-r from-[#7637EA] to-[#FF7A00] bg-clip-text text-transparent">
            {formatCurrency(amount)}
          </p>
          <p className="text-gray-500 text-xs">100% do faturamento</p>

          {/* Dashed Border Section */}
          <div className="border-t border-b border-dashed border-gray-200 -mx-4 px-4 py-4 my-6 space-y-3">
            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-600 font-semibold">Valor total do faturamento</p>
              <p className="text-sm text-gray-800 font-semibold">R$ 10.500,00</p>
            </div>
            <div className="flex justify-between items-center mb-3">
              <p className="text-sm text-gray-600 font-semibold">% de desconto</p>
              <p className="text-sm text-gray-800 font-semibold">{calculatePercentage()}%</p>
            </div>
            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-600 font-semibold">Valor do pró-labore</p>
              <p className="text-sm text-gray-800 font-semibold">{formatCurrency(amount)}</p>
            </div>
          </div>

          {/* Form Fields */}
          <div className="space-y-4 mb-20"> {/* Added bottom margin to prevent overlap */}
            {/* Due Date */}
            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-600 font-semibold">Data de vencimento</p>
              <div className="flex items-center">
                <Select value={dueDate} onValueChange={setDueDate}>
                  <SelectTrigger className="border-0 p-0 h-auto bg-transparent focus:ring-0 focus:ring-offset-0">
                    <div className="flex items-center">
                      <SelectValue className="text-sm text-gray-800 mr-1 font-semibold" /> {/* Changed mr-1 to mr-0 for spacing */}
                    </div>
                  </SelectTrigger>
                  <SelectContent className="bg-white border border-gray-200 shadow-lg z-[70]">
                    {Array.from({
                    length: 31
                  }, (_, i) => <SelectItem key={i + 1} value={String(i + 1)}>
                        Dia {i + 1}
                      </SelectItem>)}
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
                      <SelectValue className="text-sm text-gray-800 mr-1 font-semibold" /> {/* Changed mr-1 to mr-0 for spacing */}
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

        </div>
        {/* Continue Button */}
        <div className={`transition-all duration-300 ease-in-out ${currentScreen === 'edit' ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full absolute'} absolute bottom-0 left-0 right-0 px-4 pt-4 pb-6 bg-white z-[62]`}> {/* Added z-index and positioning classes, adjusted padding */}
          <Button onClick={handleContinue} className="w-full bg-black text-white rounded-full font-semibold text-center hover:bg-gray-800 transition-colors h-[52px]">
              Continuar
          </Button>
        </div>

        <div className={`transition-all duration-300 ease-in-out ${currentScreen === 'value' ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full absolute'}`}>
          {/* Value Edit Screen */}
          <div className="mt-8"> {/* Reduced margin-top */}
            <h1 className="text-xl font-semibold text-gray-800 mb-1">
              Editar o valor do Pró-labore
            </h1>
            <p className="text-gray-500 text-sm mb-4">Ajuste o valor do novo pró-labore</p> {/* Reduced margin-bottom */}

            {/* Value Input */}
            <div className="mb-6">
              <input ref={inputRef} type="tel" inputMode="numeric" value={`R$ ${formatCurrencyDisplay(newValue)}`} onChange={handleValueChange} className="text-3xl font-bold border-0 border-b-2 border-gray-200 rounded-none px-0 pb-2 focus:border-black focus:outline-none bg-transparent w-full focus:ring-0" style={{
              background: 'linear-gradient(92deg, #7637EA -38.53%, #FF7A00 134.29%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }} />
            </div>

            <div className="pb-20"> {/* Added padding-bottom to prevent overlap */}
              {/* Comparison Section */}
              <div className="space-y-3 mb-6 font-semibold">
                {/* Value Previous */}
                <div className="flex justify-between items-center">
                  <p className="text-sm text-gray-600 font-semibold">Valor anterior</p>
                  <p className="text-sm text-gray-800 font-semibold">R$ {formatCurrencyDisplay(amount)}</p>
                </div>
                {/* Value Adjusted */}
                <div className="flex justify-between items-center">
                  <p className="text-sm text-gray-600 font-semibold">Valor ajustado</p>
                  <p className="text-sm text-gray-800 font-semibold">R$ {formatCurrencyDisplay(newValue)}</p>
                </div>
                {/* Difference */}
                <div className="flex justify-between items-center font-semibold">
                  <p className="text-sm text-gray-600 font-semibold">Diferença</p>
                  <p className="text-sm text-gray-800 font-semibold">R$ {formatCurrencyDisplay(String(calculateDifference()))}</p>
                </div>
              </div>

              {/* Dashed Line */}
              <div className="border-t border-dashed border-[#eaeaea] my-6 -mx-4"></div> {/* Added dashed line */}

              {/* Revision Section */}
              <div className="mb-6"> {/* Reduced margin-bottom */}
                <p className="text-base font-semibold text-gray-800 mb-2">Revisão do novo valor</p> {/* Increased font weight */}
                <p className="text-sm text-gray-800 mb-1">Pró-Labore</p>
                {/* New Value */}
                <p className="text-2xl font-bold bg-gradient-to-r from-[#7637EA] to-[#FF7A00] bg-clip-text text-transparent mb-1">
                  R$ {formatCurrencyDisplay(newValue)}
                </p>
                <p className="text-sm text-gray-500">Mensal - Dia {dueDate}</p>
              </div>
            </div>
            
            {/* Save Button - Positioned absolutely */}
            <div className="w-full bg-black text-white rounded-full font-semibold text-center hover:bg-gray-800 transition-colors h-[52px]"> {/* Added z-index and positioning classes, adjusted padding */}
              <Button onClick={handleSave} className="w-full bg-black text-white rounded-full font-semibold text-center hover:bg-gray-800 transition-colors h-[52px]">
                Salvar
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>;
};