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
import { TransactionCreateModal } from "@/components/TransactionCreateModal";
import { CompanySwitcherModal } from "@/components/CompanySwitcherModal";
import { useTransactions, Transaction } from "@/hooks/useTransactions";
import { useCompany } from "@/hooks/useCompany";

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
  const [currentMonth, setCurrentMonth] = useState(6); // JUL 25 (index 6)
  const [activeTab, setActiveTab] = useState<'faturamento' | 'fechamento'>('faturamento');
  const [isCompanySwitcherModalOpen, setIsCompanySwitcherModalOpen] = useState(false);
  const [bottomNavTab, setBottomNavTab] = useState('documents');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  
  const months = ['JAN 25', 'FEV 25', 'MAR 25', 'ABR 25', 'MAI 25', 'JUN 25', 'JUL 25', 'AGO 25', 'SET 25', 'OUT 25', 'NOV 25', 'DEZ 25', 'JAN 26', 'FEV 26', 'MAR 26', 'ABR 26', 'MAI 26', 'JUN 26'];
  
  // Get company from useCompany hook
  const { company, isLoading: isCompanyLoading } = useCompany();
  
  // Calculate month and year from currentMonth index
  const currentYear = currentMonth < 12 ? 2025 : 2026;
  const currentMonthNumber = currentMonth < 12 ? currentMonth + 1 : currentMonth - 11;
  
  const {
    transactions,
    settings,
    isLoading: isTransactionsLoading,
    balances,
    createTransaction,
    updateTransaction,
    deleteTransaction,
    updateSettings,
    calculateAutomaticTransactions
  } = useTransactions(company?.id || '', currentMonthNumber, currentYear);

  // Combined loading state
  const isLoading = isCompanyLoading || isTransactionsLoading;

  // Format currency for display
  const formatCurrency = (amount: number) => {
    return `R$ ${amount.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}`;
  };

  // Generate discount data from settings
  const generateDiscounts = () => {
    if (!settings || !balances.income) return [];

    const revenue = balances.income;
    const proLabore = revenue * (settings.pro_labore_percentage / 100);
    const das = revenue * (settings.das_percentage / 100);
    const inss = proLabore * (settings.inss_percentage / 100);
    const accounting = settings.accounting_fee || 0;

    if (activeTab === 'faturamento') {
      return [
        {
          id: '1',
          title: 'Pró-Labore',
          amount: formatCurrency(proLabore),
          description: `${settings.pro_labore_percentage}% do faturamento`,
          fontWeight: 'bold' as const,
          type: 'expense' as const
        },
        {
          id: '2',
          title: 'DAS - SN',
          amount: formatCurrency(das),
          description: `${settings.das_percentage}% do faturamento`,
          fontWeight: 'extrabold' as const,
          type: 'expense' as const
        },
        {
          id: '3',
          title: 'INSS',
          amount: formatCurrency(inss),
          description: `${settings.inss_percentage}% do pró-labore`,
          fontWeight: 'extrabold' as const,
          type: 'expense' as const
        },
        ...(accounting > 0 ? [{
          id: '4',
          title: 'Contabilidade',
          amount: formatCurrency(accounting),
          description: 'Taxa mensal',
          fontWeight: 'extrabold' as const,
          type: 'expense' as const
        }] : [])
      ];
    } else {
      // Fechamento tab - different order and "Retiradas" instead of "Despesas"
      const profitDistribution = revenue - proLabore - das - inss - accounting;
      
      return [
        {
          id: '1',
          title: 'Pró-Labore',
          amount: formatCurrency(proLabore),
          description: `${settings.pro_labore_percentage}% do faturamento`,
          fontWeight: 'bold' as const,
          type: 'expense' as const
        },
        {
          id: '4',
          title: 'Retiradas',
          amount: formatCurrency(Math.max(0, profitDistribution)),
          description: 'Distr. de lucros',
          fontWeight: 'extrabold' as const,
          type: 'expense' as const
        },
        {
          id: '2',
          title: 'DAS - SN',
          amount: formatCurrency(das),
          description: `${settings.das_percentage}% do faturamento`,
          fontWeight: 'extrabold' as const,
          type: 'expense' as const
        },
        {
          id: '3',
          title: 'INSS',
          amount: formatCurrency(inss),
          description: `${settings.inss_percentage}% do pró-labore`,
          fontWeight: 'extrabold' as const,
          type: 'expense' as const
        }
      ];
    }
  };

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
    setIsCreateModalOpen(true);
  };

  const handleDiscountClick = (discount: any) => {
    // Find the actual transaction for this discount
    const transaction = transactions.find(t => {
      if (discount.title === 'Pró-Labore') return t.category === 'pro_labore';
      if (discount.title === 'DAS - SN') return t.category === 'das';
      if (discount.title === 'INSS') return t.category === 'inss';
      if (discount.title === 'Contabilidade') return t.category === 'accounting';
      if (discount.title === 'Retiradas') return t.category === 'profit_distribution';
      return false;
    });

    if (transaction) {
      setSelectedTransaction(transaction);
      setIsEditModalOpen(true);
    }
  };

  const handleTransactionClick = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setIsEditModalOpen(true);
  };

  const handleSaveTransaction = async (id: string, updates: Partial<Transaction>) => {
    await updateTransaction(id, updates);
    setIsEditModalOpen(false);
  };

  const handleCreateTransaction = async (transactionData: Omit<Transaction, 'id'>) => {
    await createTransaction(transactionData);
    setIsCreateModalOpen(false);
  };

  const handleDeleteTransaction = async (id: string) => {
    await deleteTransaction(id);
    setIsEditModalOpen(false);
  };

  const handleStatusChange = async (transactionId: string, newStatus: 'pending' | 'completed') => {
    await updateTransaction(transactionId, { status: newStatus });
  };

  const openCompanySwitcherModal = () => setIsCompanySwitcherModalOpen(true);
  const closeCompanySwitcherModal = () => setIsCompanySwitcherModalOpen(false);
  
  const handleSelectCompany = (companyId: string) => {
    console.log('Company selected:', companyId);
  };

  const handleRefresh = async () => {
    console.log('Refreshing data...');
    // Simulate loading
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

  // Get current data
  const currentDiscounts = generateDiscounts();
  const incomeTransactions = transactions.filter(t => t.type === 'income');
  const expenseTransactions = transactions.filter(t => t.type === 'expense');
  
  const revenueSummaryTitle = formatCurrency(balances.income);
  const revenueSummaryLabel = activeTab === 'faturamento' ? 'Total faturamento' : 'Saldo atual';
  const discountGridTitle = 'Principais descontos';

  const currentMonthName = months[currentMonth];

  if (isLoading) {
    return (
      <div className="w-full max-w-[100vw] bg-black min-h-screen flex items-center justify-center">
        <div className="text-white">Carregando...</div>
      </div>
    );
  }

  if (!company) {
    return (
      <div className="w-full max-w-[100vw] bg-black min-h-screen flex items-center justify-center">
        <div className="text-white">Erro ao carregar empresa</div>
      </div>
    );
  }

  return (
    <div ref={scrollableRef} className="w-full max-w-[100vw] bg-black min-h-screen relative mx-auto font-['Urbanist'] overflow-x-hidden overflow-y-auto" style={{
      paddingTop: 'calc(env(safe-area-inset-top, 0px) + 76px)'
    }}>
      <PullToRefreshIndicator isVisible={shouldShowIndicator} isRefreshing={isRefreshing} pullDistance={pullDistance} threshold={80} />
      
      <Header title="Gestão fiscal" onBackClick={() => console.log('Back clicked')} onSettingsClick={() => console.log('Settings clicked')} />
      
      <CompanyInfo companyName={company.name} onRefreshClick={openCompanySwitcherModal} />
      
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
              title={discountGridTitle} 
              discounts={currentDiscounts} 
              onDiscountClick={handleDiscountClick}
            />
          </div>
        </div>
      </main>
      
      <TransactionSheet 
        month={currentMonthName}
        incomeTotal={formatCurrency(balances.income)}
        expenseTotal={formatCurrency(balances.expenses)}
        incomeTransactions={incomeTransactions.map(t => ({
          id: t.id,
          title: t.title,
          description: t.description || '',
          amount: formatCurrency(t.amount),
          type: t.type,
          status: t.status,
          date: t.due_date || undefined
        }))}
        expenseTransactions={expenseTransactions.map(t => ({
          id: t.id,
          title: t.title,
          description: t.description || '',
          amount: formatCurrency(t.amount),
          type: t.type,
          status: t.status,
          date: t.due_date || undefined
        }))}
        entryTotal={formatCurrency(balances.income)}
        exitTotal={formatCurrency(balances.expenses)}
        balance={formatCurrency(balances.balance)}
        onAddTransaction={handleAddTransaction}
        onTransactionClick={(transaction) => {
          const fullTransaction = transactions.find(t => t.id === transaction.id);
          if (fullTransaction) {
            handleTransactionClick(fullTransaction);
          }
        }}
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
        onDelete={handleDeleteTransaction}
      />

      <TransactionCreateModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSave={handleCreateTransaction}
        month={currentMonthNumber}
        year={currentYear}
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
