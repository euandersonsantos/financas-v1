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
import { useCompanyData } from "@/hooks/useCompanyData";
import { formatCurrency, calculateTotals, getDiscountCards, groupTransactionsByDate } from "@/utils/calculations";

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
  const [currentMonth, setCurrentMonth] = useState(6); // July 2025 (index 6)
  const [activeTab, setActiveTab] = useState<'faturamento' | 'fechamento'>('faturamento');
  const [isCompanySwitcherModalOpen, setIsCompanySwitcherModalOpen] = useState(false);
  const [bottomNavTab, setBottomNavTab] = useState('documents');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<any>(null);
  
  const months = ['JAN 25', 'FEV 25', 'MAR 25', 'ABR 25', 'MAI 25', 'JUN 25', 'JUL 25', 'AGO 25', 'SET 25', 'OUT 25', 'NOV 25', 'DEZ 25', 'JAN 26', 'FEV 26', 'MAR 26', 'ABR 26', 'MAI 26', 'JUN 26'];
  
  // Get current month/year from the months array
  const currentYear = currentMonth < 12 ? 2025 : 2026;
  const monthNumber = (currentMonth % 12) + 1;
  
  const { 
    company, 
    settings, 
    revenue, 
    transactions, 
    loading, 
    updateTransaction, 
    updateTransactionStatus,
    refetch 
  } = useCompanyData(monthNumber, currentYear);

  // Calculate totals
  const totals = transactions.length > 0 ? calculateTotals(transactions) : { income: 0, expenses: 0, balance: 0 };
  
  // Separate transactions by type
  const incomeTransactions = transactions.filter(t => t.type === 'income');
  const expenseTransactions = transactions.filter(t => t.type === 'expense');
  
  // Get discount cards from expense transactions
  const discountCards = getDiscountCards(expenseTransactions, activeTab === 'fechamento');
  
  // Group transactions by date for closing tab
  const groupedTransactions = activeTab === 'fechamento' ? groupTransactionsByDate(transactions) : {};

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
    // Find the full transaction data
    const fullTransaction = transactions.find(t => t.id === discount.id);
    if (fullTransaction) {
      setSelectedTransaction({
        ...fullTransaction,
        amount: formatCurrency(fullTransaction.amount)
      });
      setIsEditModalOpen(true);
    }
  };

  const handleTransactionClick = (transaction: any) => {
    // Find the full transaction data
    const fullTransaction = transactions.find(t => t.id === transaction.id);
    if (fullTransaction) {
      setSelectedTransaction({
        ...fullTransaction,
        amount: formatCurrency(fullTransaction.amount)
      });
      setIsEditModalOpen(true);
    }
  };

  const handleSaveTransaction = async (updatedTransaction: any) => {
    if (updatedTransaction.id) {
      // Convert currency string back to number
      const amountString = updatedTransaction.amount.replace(/[R$\s.]/g, '').replace(',', '.');
      const amount = parseFloat(amountString);
      
      await updateTransaction(updatedTransaction.id, {
        title: updatedTransaction.title,
        description: updatedTransaction.description,
        amount: amount
      });
    }
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
    await refetch();
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

  // Show loading state
  if (loading) {
    return (
      <div className="w-full max-w-[100vw] bg-black min-h-screen relative mx-auto font-['Urbanist'] overflow-x-hidden overflow-y-auto flex items-center justify-center">
        <div className="text-white">Carregando...</div>
      </div>
    );
  }

  // Revenue summary data
  const revenueSummaryTitle = activeTab === 'faturamento' 
    ? formatCurrency(totals.income) 
    : formatCurrency(totals.balance);
  const revenueSummaryLabel = activeTab === 'faturamento' ? 'Total faturamento' : 'Saldo atual';

  return (
    <div ref={scrollableRef} className="w-full max-w-[100vw] bg-black min-h-screen relative mx-auto font-['Urbanist'] overflow-x-hidden overflow-y-auto" style={{
      paddingTop: 'calc(env(safe-area-inset-top, 0px) + 76px)'
    }}>
      <PullToRefreshIndicator isVisible={shouldShowIndicator} isRefreshing={isRefreshing} pullDistance={pullDistance} threshold={80} />
      
      <Header title="Gestão fiscal" onBackClick={() => console.log('Back clicked')} onSettingsClick={() => console.log('Settings clicked')} />
      
      <CompanyInfo companyName={company?.name || "Anderson Design"} onRefreshClick={openCompanySwitcherModal} />
      
      <main className="w-full h-[1400px] relative">
        {/* ... keep existing code (SVG background) */}
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
              discounts={discountCards} 
              onDiscountClick={handleDiscountClick}
            />
          </div>
        </div>
      </main>
      
      <TransactionSheet 
        month={months[currentMonth]} 
        incomeTotal={formatCurrency(totals.income)} 
        expenseTotal={formatCurrency(totals.expenses)} 
        incomeTransactions={incomeTransactions.map(t => ({
          id: t.id,
          title: t.title,
          description: t.description || '',
          amount: formatCurrency(t.amount),
          type: t.type as 'income',
          status: t.status,
          date: t.due_date || '2025-07-25'
        }))} 
        expenseTransactions={expenseTransactions.map(t => ({
          id: t.id,
          title: t.title,
          description: t.description || '',
          amount: formatCurrency(t.amount),
          type: t.type as 'expense',
          status: t.status,
          date: t.due_date || '2025-07-25'
        }))} 
        entryTotal={formatCurrency(totals.income)} 
        exitTotal={formatCurrency(totals.expenses)} 
        balance={formatCurrency(totals.balance)} 
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
    </div>
  );
}

export default Index;
