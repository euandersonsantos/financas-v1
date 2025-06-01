import React, { useState, useEffect } from "react";
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
import { AuthModal } from "@/components/AuthModal";
import { CompanySetupModal } from "@/components/CompanySetupModal";
import { useAuth } from "@/hooks/useAuth";
import { useCompanies } from "@/hooks/useCompanies";
import { useFinancialData } from "@/hooks/useFinancialData";
import { TransactionCreateModal } from "@/components/TransactionCreateModal";

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
  const { user, loading: authLoading } = useAuth();
  const { companies, selectedCompany, companySettings, loading: companiesLoading } = useCompanies();
  const { monthlyRevenue, transactions, loading: financialLoading, fetchMonthlyData, updateRevenue, createTransaction, updateTransaction, deleteTransaction } = useFinancialData();
  
  const [currentMonth, setCurrentMonth] = useState(6); // Começar em JUL 25
  const [currentYear, setCurrentYear] = useState(2025);
  const [activeTab, setActiveTab] = useState<'faturamento' | 'fechamento'>('faturamento');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isCompanySetupModalOpen, setIsCompanySetupModalOpen] = useState(false);
  const [isCompanySwitcherModalOpen, setIsCompanySwitcherModalOpen] = useState(false);
  const [bottomNavTab, setBottomNavTab] = useState('documents');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<any>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  
  const months = ['JAN 25', 'FEV 25', 'MAR 25', 'ABR 25', 'MAI 25', 'JUN 25', 'JUL 25', 'AGO 25', 'SET 25', 'OUT 25', 'NOV 25', 'DEZ 25', 'JAN 26', 'FEV 26', 'MAR 26', 'ABR 26', 'MAI 26', 'JUN 26'];

  // Verificar se usuário está logado
  useEffect(() => {
    if (!authLoading && !user) {
      setIsAuthModalOpen(true);
    }
  }, [authLoading, user]);

  // Verificar se usuário tem empresas
  useEffect(() => {
    if (user && !companiesLoading && companies.length === 0) {
      setIsCompanySetupModalOpen(true);
    }
  }, [user, companiesLoading, companies]);

  // Carregar dados financeiros quando empresa ou mês mudar
  useEffect(() => {
    if (selectedCompany) {
      fetchMonthlyData(currentMonth + 1, currentYear); // currentMonth is 0-based, but we store 1-based
    }
  }, [selectedCompany, currentMonth, currentYear, fetchMonthlyData]);

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

  const handleCreateTransaction = async (newTransaction: any) => {
    await createTransaction(currentMonth + 1, currentYear, newTransaction);
    setIsCreateModalOpen(false);
  };

  const handleDeleteTransaction = async (transactionId: string) => {
    await deleteTransaction(transactionId);
    setIsEditModalOpen(false);
  };

  const handleDiscountClick = (discount: any) => {
    setSelectedTransaction(discount);
    setIsEditModalOpen(true);
  };

  const handleTransactionClick = (transaction: any) => {
    setSelectedTransaction(transaction);
    setIsEditModalOpen(true);
  };

  const handleSaveTransaction = async (updatedTransaction: any) => {
    if (updatedTransaction.id) {
      await updateTransaction(updatedTransaction.id, updatedTransaction);
    } else {
      await createTransaction(currentMonth + 1, currentYear, updatedTransaction);
    }
    setIsEditModalOpen(false);
  };

  const handleStatusChange = async (transactionId: string, newStatus: 'pending' | 'completed') => {
    await updateTransaction(transactionId, { status: newStatus });
  };

  const openCompanySwitcherModal = () => setIsCompanySwitcherModalOpen(true);
  const closeCompanySwitcherModal = () => setIsCompanySwitcherModalOpen(false);
  
  const handleSelectCompany = (companyId: string) => {
    const company = companies.find(c => c.id === companyId);
    if (company && selectedCompany) {
      // Company switching logic would go here
    }
  };

  const handleRefresh = async () => {
    if (selectedCompany) {
      await fetchMonthlyData(currentMonth + 1, currentYear);
    }
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

  // Calculate dynamic data based on database
  const totalRevenue = monthlyRevenue?.total_revenue || 0;
  const incomeTransactions = transactions.filter(t => t.type === 'income');
  const expenseTransactions = transactions.filter(t => t.type === 'expense');
  
  const totalExpenses = expenseTransactions.reduce((sum, t) => sum + t.amount, 0);
  const currentBalance = totalRevenue - totalExpenses;

  // Generate discount cards based on settings and calculations
  const generateDiscounts = () => {
    if (!companySettings || !monthlyRevenue) return [];

    const proLabore = (totalRevenue * companySettings.pro_labore_percentage) / 100;
    const das = (totalRevenue * companySettings.das_percentage) / 100;
    const inss = (proLabore * companySettings.inss_percentage) / 100;

    if (activeTab === 'faturamento') {
      return [
        {
          id: '1',
          title: 'Pró-Labore',
          amount: `R$ ${proLabore.toFixed(2).replace('.', ',')}`,
          description: `${companySettings.pro_labore_percentage}% do faturamento`,
          fontWeight: 'bold' as const,
          type: 'expense' as const
        },
        {
          id: '2',
          title: 'DAS - SN',
          amount: `R$ ${das.toFixed(2).replace('.', ',')}`,
          description: `${companySettings.das_percentage}% do faturamento`,
          fontWeight: 'extrabold' as const,
          type: 'expense' as const
        },
        {
          id: '3',
          title: 'INSS',
          amount: `R$ ${inss.toFixed(2).replace('.', ',')}`,
          description: `${companySettings.inss_percentage}% do pró-labore`,
          fontWeight: 'extrabold' as const,
          type: 'expense' as const
        }
      ];
    } else {
      const profitDistribution = Math.max(0, currentBalance - companySettings.accounting_fee);
      
      return [
        {
          id: '1',
          title: 'Pró-Labore',
          amount: `R$ ${proLabore.toFixed(2).replace('.', ',')}`,
          description: `${companySettings.pro_labore_percentage}% do faturamento`,
          fontWeight: 'bold' as const,
          type: 'expense' as const
        },
        {
          id: '4',
          title: 'Retiradas',
          amount: `R$ ${profitDistribution.toFixed(2).replace('.', ',')}`,
          description: 'Distr. de lucros',
          fontWeight: 'extrabold' as const,
          type: 'expense' as const
        },
        {
          id: '2',
          title: 'DAS - SN',
          amount: `R$ ${das.toFixed(2).replace('.', ',')}`,
          description: `${companySettings.das_percentage}% do faturamento`,
          fontWeight: 'extrabold' as const,
          type: 'expense' as const
        },
        {
          id: '3',
          title: 'INSS',
          amount: `R$ ${inss.toFixed(2).replace('.', ',')}`,
          description: `${companySettings.inss_percentage}% do pró-labore`,
          fontWeight: 'extrabold' as const,
          type: 'expense' as const
        }
      ];
    }
  };

  const currentDiscounts = generateDiscounts();
  const revenueSummaryTitle = activeTab === 'faturamento' 
    ? `R$ ${totalRevenue.toFixed(2).replace('.', ',')}`
    : `R$ ${currentBalance.toFixed(2).replace('.', ',')}`;
  const revenueSummaryLabel = activeTab === 'faturamento' ? 'Total faturamento' : 'Saldo atual';

  if (authLoading || companiesLoading) {
    return <div className="flex items-center justify-center min-h-screen">Carregando...</div>;
  }

  return (
    <div ref={scrollableRef} className="w-full max-w-[100vw] bg-black min-h-screen relative mx-auto font-['Urbanist'] overflow-x-hidden overflow-y-auto" style={{
      paddingTop: 'calc(env(safe-area-inset-top, 0px) + 76px)'
    }}>
      <PullToRefreshIndicator isVisible={shouldShowIndicator} isRefreshing={isRefreshing} pullDistance={pullDistance} threshold={80} />
      
      <Header title="Gestão fiscal" onBackClick={() => console.log('Back clicked')} onSettingsClick={() => console.log('Settings clicked')} />
      
      <CompanyInfo 
        companyName={selectedCompany?.name || "Selecione uma empresa"} 
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
        month={`${months[currentMonth]}`}
        incomeTotal={`R$ ${incomeTransactions.reduce((sum, t) => sum + t.amount, 0).toFixed(2).replace('.', ',')}`}
        expenseTotal={`R$ ${totalExpenses.toFixed(2).replace('.', ',')}`}
        incomeTransactions={incomeTransactions.map(t => ({
          id: t.id,
          title: t.title,
          description: t.description || '',
          amount: `R$ ${t.amount.toFixed(2).replace('.', ',')}`,
          type: t.type
        }))}
        expenseTransactions={expenseTransactions.map(t => ({
          id: t.id,
          title: t.title,
          description: t.description || '',
          amount: `R$ ${t.amount.toFixed(2).replace('.', ',')}`,
          type: t.type,
          status: t.status,
          date: t.due_date || new Date().toISOString().split('T')[0]
        }))}
        entryTotal={`R$ ${totalRevenue.toFixed(2).replace('.', ',')}`}
        exitTotal={`R$ ${totalExpenses.toFixed(2).replace('.', ',')}`}
        balance={`R$ ${currentBalance.toFixed(2).replace('.', ',')}`}
        onAddTransaction={handleAddTransaction} 
        onTransactionClick={handleTransactionClick}
        showStatus={activeTab === 'fechamento'}
        isClosingTab={activeTab === 'fechamento'}
        initialBalance="R$ 0,00"
        onStatusChange={handleStatusChange}
      />
      
      <BottomNavigation activeTab={bottomNavTab} onTabChange={handleBottomNavChange} />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />

      <CompanySetupModal
        isOpen={isCompanySetupModalOpen}
        onClose={() => setIsCompanySetupModalOpen(false)}
      />

      <TransactionEditModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        transaction={selectedTransaction ? {
          ...selectedTransaction,
          amount: typeof selectedTransaction.amount === 'string' 
            ? parseFloat(selectedTransaction.amount.replace(/[R$\s.]/g, '').replace(',', '.'))
            : selectedTransaction.amount
        } : null}
        onSave={handleSaveTransaction}
        onDelete={handleDeleteTransaction}
      />

      <TransactionCreateModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSave={handleCreateTransaction}
      />

      <CompanySwitcherModal
        isOpen={isCompanySwitcherModalOpen}
        onClose={closeCompanySwitcherModal}
        onSelectCompany={handleSelectCompany}
        onRegisterNewCompany={() => setIsCompanySetupModalOpen(true)}
      />
    </div>
  );
}

export default Index;
