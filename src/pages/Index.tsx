import React, { useState } from "react";
import { Header } from "@/components/Header";
import { CompanyInfo } from "@/components/CompanyInfo";
import { MonthNavigation } from "@/components/MonthNavigation";
import { TabNavigation } from "@/components/TabNavigation";
import { RevenueSummary } from "@/components/RevenueSummary";
import { DiscountGrid } from "@/components/DiscountGrid";
import { TransactionSheet } from "@/components/TransactionSheet";
import { BottomNavigation } from "@/components/BottomNavigation";
import { PullToRefreshIndicator } from "@/components/PullToRefreshIndicator";
import { usePullToRefresh } from "@/hooks/usePullToRefresh";
import { TransactionEditModal } from "@/components/TransactionEditModal";
import { CompanySwitcherModal } from "@/components/CompanySwitcherModal";
import { useAuth } from "@/hooks/useAuth";
import { useCompany } from "@/hooks/useCompany";
import { useTransactions } from "@/hooks/useTransactions";

// Define transaction types
interface IncomeTransactionWithStatus {
  id: string;
  title: string;
  description: string;
  amount: string;
  type: 'income';
  status: 'pending' | 'completed';
  date: string;
}

interface ExpenseTransactionWithStatus {
  id: string;
  title: string;
  description: string;
  amount: string;
  type: 'expense';
  status: 'pending' | 'completed';
  date: string;
}

function Index() {
  const { signOut } = useAuth();
  const { company, loading: companyLoading } = useCompany();
  const [currentMonth, setCurrentMonth] = useState(6); // Começar em JUL 25
  const [activeTab, setActiveTab] = useState<'faturamento' | 'fechamento'>('faturamento');
  const [isCompanySwitcherModalOpen, setIsCompanySwitcherModalOpen] = useState(false);
  const [bottomNavTab, setBottomNavTab] = useState('documents');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<any>(null);
  
  const months = ['JAN 25', 'FEV 25', 'MAR 25', 'ABR 25', 'MAI 25', 'JUN 25', 'JUL 25', 'AGO 25', 'SET 25', 'OUT 25', 'NOV 25', 'DEZ 25', 'JAN 26', 'FEV 26', 'MAR 26', 'ABR 26', 'MAI 26', 'JUN 26'];
  
  // Calcular mês e ano baseado no currentMonth
  const monthNumber = (currentMonth % 12) + 1;
  const year = currentMonth >= 12 ? 2026 : 2025;
  
  const {
    incomeTransactions,
    expenseTransactions,
    faturamentoDiscounts,
    fechamentoDiscounts,
    loading: transactionsLoading,
    updateTransactionStatus,
    updateTransaction,
  } = useTransactions(monthNumber, year);

  const loading = companyLoading || transactionsLoading;

  const handleMonthChange = (monthIndex: number) => {
    setCurrentMonth(monthIndex);
  };
  const handleTabChange = (tab: 'faturamento' | 'fechamento') => {
    setActiveTab(tab);
  };
  const handleBottomNavChange = (tab: string) => {
    setBottomNavTab(tab);
  };
  const handleAddTransaction = () => {
    console.log('Add transaction clicked');
  };
  const handleDiscountClick = (discount: any) => {
    const transactionFromDiscount = {
      id: discount.id,
      title: discount.title,
      amount: discount.amount,
      description: discount.description,
      type: discount.type
    };
    setSelectedTransaction(transactionFromDiscount);
    setIsEditModalOpen(true);
  };
  const handleTransactionClick = (transaction: any) => {
    setSelectedTransaction(transaction);
    setIsEditModalOpen(true);
  };
  const handleSaveTransaction = async (updatedTransaction: any) => {
    if (!selectedTransaction) return;

    // Converter valor formatado para número
    const amountStr = updatedTransaction.amount.replace('R$ ', '').replace('.', '').replace(',', '.');
    const amount = parseFloat(amountStr);

    await updateTransaction(selectedTransaction.id, {
      title: updatedTransaction.title,
      description: updatedTransaction.description,
      amount: amount,
    });

    setIsEditModalOpen(false);
  };

  const handleStatusChange = async (transactionId: string, newStatus: 'pending' | 'completed') => {
    await updateTransactionStatus(transactionId, newStatus);
  };

  const openCompanySwitcherModal = () => setIsCompanySwitcherModalOpen(true);
  const closeCompanySwitcherModal = () => setIsCompanySwitcherModalOpen(false);
  const handleSelectCompany = (companyId: string) => {
    console.log('Company selected:', companyId);
  };
  const handleRefresh = async () => {
    console.log('Refreshing data...');
    await new Promise(resolve => setTimeout(resolve, 1500));
    console.log('Data refreshed!');
  };
  const {
    scrollableRef,
    isRefreshing,
    pullDistance,
    shouldShowIndicator
  } = usePullToRefresh({
    onRefresh: handleRefresh,
    threshold: 80
  });

  // Calcular totais
  const totalIncome = incomeTransactions.reduce((sum, t) => {
    const amount = parseFloat(t.amount.replace('R$ ', '').replace('.', '').replace(',', '.'));
    return sum + amount;
  }, 0);

  const totalExpense = expenseTransactions.reduce((sum, t) => {
    const amount = parseFloat(t.amount.replace('R$ ', '').replace('.', '').replace(',', '.'));
    return sum + amount;
  }, 0);

  const balance = totalIncome - totalExpense;

  const formatCurrency = (value: number) => {
    return `R$ ${value.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}`;
  };

  // Definir dados baseados na aba ativa
  const currentDiscounts = activeTab === 'faturamento' ? faturamentoDiscounts : fechamentoDiscounts;
  const currentIncomeTransactions = incomeTransactions;
  const currentExpenseTransactions = expenseTransactions;
  const revenueSummaryTitle = activeTab === 'faturamento' ? formatCurrency(totalIncome) : formatCurrency(balance);
  const revenueSummaryLabel = activeTab === 'faturamento' ? 'Total faturamento' : 'Saldo atual';

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#7A3E69] via-[#303E74] via-[#72CE9F] via-[#EAA124] to-[#907EEF] flex items-center justify-center">
        <div className="text-white text-lg">Carregando dados...</div>
      </div>
    );
  }

  return <div ref={scrollableRef} className="w-full max-w-[100vw] bg-black min-h-screen relative mx-auto font-['Urbanist'] overflow-x-hidden overflow-y-auto" style={{
    paddingTop: 'calc(env(safe-area-inset-top, 0px) + 76px)'
  }}>
      <PullToRefreshIndicator isVisible={shouldShowIndicator} isRefreshing={isRefreshing} pullDistance={pullDistance} threshold={80} />
      
      <Header 
        title="Gestão fiscal" 
        onBackClick={() => console.log('Back clicked')} 
        onSettingsClick={signOut}
      />
      
      <CompanyInfo 
        companyName={company?.name || "Carregando..."} 
        onRefreshClick={openCompanySwitcherModal} 
      />
      
      <main className="w-full h-[1400px] relative">
        <div className="w-full h-full relative">
          <svg className="w-full h-full absolute inset-0" viewBox="0 0 402 1400" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
            <path d="M0 28.3223C0 12.6804 10.7452 0 24 0H378C391.255 0 402 12.6804 402 28.3223V47.2038H0V28.3223Z" fill="url(#paint0_linear_background)" />
            <path d="M0 31.5439C0 18.478 10.7452 7.88599 24 7.88599H378C391.255 7.88599 402 18.478 402 31.5439V1400H0V31.5439Z" fill="#F5F5F5" />
            <defs>
              <linearGradient id="paint0_linear_background" x1="-48" y1="630" x2="448.486" y2="632.664" gradientUnits="userSpaceOnUse">
                <stop stopColor="#7A3E69" />
                <stop offset="0.269231" stopColor="#303E74" stopOpacity="0.9" />
                <stop offset="0.490385" stopColor="#72CE9F" stopOpacity="0.7" />
                <stop offset="0.711538" stopColor="#EAA124" />
                <stop offset="1" stopColor="#907EEF" />
              </linearGradient>
            </defs>
          </svg>
        </div>
        
        <div className="absolute w-full flex flex-col items-center gap-3 px-4 left-0 top-6 sm:px-[21px]">
          <MonthNavigation months={months} currentMonth={currentMonth} onMonthChange={handleMonthChange} />
          <div className="w-full h-px bg-[rgba(0,0,0,0.08)]" />
        </div>
        
        <div className="absolute w-full flex flex-col items-start gap-8 px-4 left-0 top-[110px] sm:w-[360px] sm:left-[21px] sm:px-0">
          <TabNavigation activeTab={activeTab} onTabChange={handleTabChange} />
          
          <RevenueSummary 
            totalRevenue={revenueSummaryTitle} 
            percentageChange={0} 
            comparisonText="em relação ao mês anterior"
            label={revenueSummaryLabel}
          />
          
          <div className="pb-8 w-full">
            <DiscountGrid 
              title="Principais descontos" 
              discounts={currentDiscounts} 
              onDiscountClick={handleDiscountClick}
            />
          </div>
        </div>
      </main>
      
      <TransactionSheet 
        month={months[currentMonth]}
        incomeTotal={formatCurrency(totalIncome)}
        expenseTotal={formatCurrency(totalExpense)}
        incomeTransactions={currentIncomeTransactions} 
        expenseTransactions={currentExpenseTransactions} 
        entryTotal={formatCurrency(totalIncome)}
        exitTotal={formatCurrency(totalExpense)}
        balance={formatCurrency(balance)}
        onAddTransaction={handleAddTransaction} 
        onTransactionClick={handleTransactionClick}
        showStatus={activeTab === 'fechamento'}
        isClosingTab={activeTab === 'fechamento'}
        initialBalance="R$ 5.000,00"
        onStatusChange={handleStatusChange}
      />
      
      <BottomNavigation activeTab={bottomNavTab} onTabChange={handleBottomNavChange} />

      <TransactionEditModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        transaction={selectedTransaction}
        onSave={handleSaveTransaction}
      />

      <CompanySwitcherModal
        isOpen={isCompanySwitcherModalOpen}
        onClose={closeCompanySwitcherModal}
        onSelectCompany={handleSelectCompany}
        onRegisterNewCompany={() => console.log('Register new company clicked')}
      />
    </div>;
}

export default Index;
