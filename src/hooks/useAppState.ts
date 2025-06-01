
import { useState } from 'react';
import { Transaction } from '@/types/transaction';

export const useAppState = () => {
  const [currentMonth, setCurrentMonth] = useState(6); // Começar em JUL 25
  const [activeTab, setActiveTab] = useState<'faturamento' | 'fechamento'>('faturamento');
  const [bottomNavTab, setBottomNavTab] = useState('documents');
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

  return {
    currentMonth,
    setCurrentMonth,
    activeTab,
    setActiveTab,
    bottomNavTab,
    setBottomNavTab,
    selectedTransaction,
    setSelectedTransaction
  };
};
