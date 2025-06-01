
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';

interface TransactionCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (transaction: any) => void;
}

export const TransactionCreateModal: React.FC<TransactionCreateModalProps> = ({
  isOpen,
  onClose,
  onSave
}) => {
  const [currentScreen, setCurrentScreen] = useState<'create' | 'value'>('create');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('0');
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [category, setCategory] = useState('');
  const [dueDate, setDueDate] = useState('25');
  const [recurrence, setRecurrence] = useState('Mensal');
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
      }, 100);
    }
  }, [currentScreen]);

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setTitle('');
      setDescription('');
      setAmount('0');
      setType('expense');
      setCategory('');
      setDueDate('25');
      setRecurrence('Mensal');
      setCurrentScreen('create');
    }
  }, [isOpen]);

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

  const getCategoryOptions = () => {
    if (type === 'income') {
      return [
        { value: 'other_income', label: 'Outras receitas' }
      ];
    } else {
      return [
        { value: 'pro_labore', label: 'Pró-labore' },
        { value: 'das', label: 'DAS - Simples Nacional' },
        { value: 'inss', label: 'INSS' },
        { value: 'accounting', label: 'Contabilidade' },
        { value: 'other_expense', label: 'Outras despesas' }
      ];
    }
  };

  const handleContinue = () => {
    if (!title || !category) {
      alert('Por favor, preencha todos os campos obrigatórios');
      return;
    }
    setCurrentScreen('value');
  };

  const handleBack = () => {
    if (currentScreen === 'value') {
      setCurrentScreen('create');
    } else {
      setIsClosing(true);
      setTimeout(() => {
        onClose();
        setIsClosing(false);
        setCurrentScreen('create');
      }, 300);
    }
  };

  const handleSave = () => {
    const newTransaction = {
      title,
      description,
      amount: parseInt(amount) / 100,
      type,
      category,
      status: 'pending' as const,
      is_auto_generated: false
    };
    
    onSave(newTransaction);
    setIsClosing(true);
    setTimeout(() => {
      onClose();
      setIsClosing(false);
      setCurrentScreen('create');
    }, 300);
  };

  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[R$\s.,]/g, '');
    setAmount(value || '0');
  };

  if (!isOpen) return null;

  return (
    <React.Fragment>
      <div
        className={`fixed inset-0 z-[60] bg-black/50 transition-opacity duration-300 overflow-hidden ${isClosing ? 'opacity-0' : 'opacity-100'}`}
        onClick={handleBack}
      >
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
                width: currentScreen === 'create' ? '50%' : '100%'
              }} />
            </div>
            <div className="w-6"></div>
          </div>

          <div className={`transition-all duration-300 ease-in-out ${currentScreen === 'create' ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-full absolute'}`}>
            {/* Create Screen Content */}
            <h1 className="text-xl font-semibold text-gray-800 mb-1">
              Nova transação
            </h1>
            <p className="text-gray-500 text-sm mb-6">Adicione uma nova receita ou despesa</p>

            {/* Form Fields */}
            <div className="space-y-4 mb-20">
              {/* Title */}
              <div className="space-y-2">
                <label className="text-sm text-gray-600 font-semibold">Título *</label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ex: Pagamento de cliente"
                  className="w-full"
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <label className="text-sm text-gray-600 font-semibold">Descrição</label>
                <Input
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Descrição adicional (opcional)"
                  className="w-full"
                />
              </div>

              {/* Type */}
              <div className="space-y-2">
                <label className="text-sm text-gray-600 font-semibold">Tipo *</label>
                <Select value={type} onValueChange={(value: 'income' | 'expense') => {
                  setType(value);
                  setCategory(''); // Reset category when type changes
                }}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="income">Receita</SelectItem>
                    <SelectItem value="expense">Despesa</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Category */}
              <div className="space-y-2">
                <label className="text-sm text-gray-600 font-semibold">Categoria *</label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecione uma categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    {getCategoryOptions().map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Due Date */}
              <div className="flex justify-between items-center">
                <p className="text-sm text-gray-600 font-semibold">Data de vencimento</p>
                <div className="flex items-center">
                  <Select value={dueDate} onValueChange={setDueDate}>
                    <SelectTrigger className="border-0 p-0 h-auto bg-transparent focus:ring-0 focus:ring-offset-0">
                      <div className="flex items-center">
                        <SelectValue className="text-sm text-gray-800 mr-1 font-semibold" />
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
                        <SelectValue className="text-sm text-gray-800 mr-1 font-semibold" />
                      </div>
                    </SelectTrigger>
                    <SelectContent className="bg-white border border-gray-200 shadow-lg z-[70]">
                      <SelectItem value="Única">Única</SelectItem>
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
          <div className={`transition-all duration-300 ease-in-out ${currentScreen === 'create' ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full absolute'} absolute bottom-0 left-0 right-0 px-4 pt-4 pb-6 bg-white z-[62]`}>
            <Button onClick={handleContinue} className="w-full bg-black text-white font-semibold text-center hover:bg-gray-800 transition-colors h-[52px]" style={{
              borderRadius: '16px'
            }}>
              Continuar
            </Button>
          </div>

          <div className={`transition-all duration-300 ease-in-out ${currentScreen === 'value' ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full absolute'}`}>
            {/* Value Screen */}
            <div className="mt-8 w-full">
              <h1 className="text-xl font-semibold text-gray-800 mb-1">
                Definir valor
              </h1>
              <p className="text-gray-500 text-sm mb-4">Defina o valor da transação</p>

              {/* Value Input */}
              <div className="mb-6">
                <input 
                  ref={inputRef} 
                  type="tel" 
                  inputMode="numeric" 
                  value={`R$ ${formatCurrencyDisplay(amount)}`} 
                  onChange={handleValueChange} 
                  className="text-3xl font-bold border-0 border-b-2 border-gray-200 rounded-none px-0 pb-2 focus:border-black focus:outline-none bg-transparent w-full focus:ring-0" 
                  style={{
                    background: 'linear-gradient(92deg, #7637EA -38.53%, #FF7A00 134.29%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                  }} 
                />
              </div>

              <div className="pb-20">
                {/* Summary Section */}
                <div className="space-y-3 mb-6 font-semibold">
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-gray-600 font-semibold">Tipo</p>
                    <p className="text-sm text-gray-800 font-semibold">{type === 'income' ? 'Receita' : 'Despesa'}</p>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-gray-600 font-semibold">Categoria</p>
                    <p className="text-sm text-gray-800 font-semibold">
                      {getCategoryOptions().find(opt => opt.value === category)?.label || category}
                    </p>
                  </div>
                  <div className="flex justify-between items-center font-semibold">
                    <p className="text-sm text-gray-600 font-semibold">Valor</p>
                    <p className="text-sm text-gray-800 font-semibold">R$ {formatCurrencyDisplay(amount)}</p>
                  </div>
                </div>

                {/* Dashed Line */}
                <div className="border-t border-dashed border-[#eaeaea] my-6 -mx-4"></div>

                {/* Revision Section */}
                <div className="mb-6">
                  <p className="text-base font-semibold text-gray-800 mb-2">Resumo da transação</p>
                  <p className="text-sm text-gray-800 mb-1">{title}</p>
                  <p className="text-2xl font-bold bg-gradient-to-r from-[#7637EA] to-[#FF7A00] bg-clip-text text-transparent mb-1">
                    R$ {formatCurrencyDisplay(amount)}
                  </p>
                  <p className="text-sm text-gray-500">{recurrence} - Dia {dueDate}</p>
                </div>
              </div>
              
              {/* Save Button */}
              <div className={`transition-all duration-300 ease-in-out ${currentScreen === 'value' ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full absolute'} absolute bottom-0 left-0 right-0 px-4 pt-4 pb-6 bg-white z-[62]`}>
                <Button onClick={handleSave} className="w-full bg-black text-white font-semibold text-center hover:bg-gray-800 transition-colors h-[52px]" style={{
                  borderRadius: '16px'
                }}>
                  Salvar
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};
