
import React from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { MainBackground } from "@/components/layout/MainBackground";
import { MainContent } from "@/components/content/MainContent";
import { CompanyInfo } from "@/components/CompanyInfo";
import { TransactionSheet } from "@/components/TransactionSheet";
import { PullToRefreshIndicator } from "@/components/PullToRefreshIndicator";
import { TransactionEditModal } from "@/components/TransactionEditModal";
import { CompanySwitcherModal } from "@/components/CompanySwitcherModal";
import { usePullToRefresh } from "@/hooks/usePullToRefresh";
import { useModal } from "@/hooks/useModal";
import { useAppState } from "@/hooks/useAppState";
import { MONTHS, MOCK_DISCOUNTS, MOCK_INCOME_TRANSACTIONS, MOCK_EXPENSE_TRANSACTIONS } from "@/constants/appData";
import { Transaction, Discount } from "@/types/transaction";

function Index() {
  const {
    currentMonth,
    setCurrentMonth,
    activeTab,
    setActiveTab,
    bottomNavTab,
    setBottomNavTab,
    selectedTransaction,
    setSelectedTransaction
  } = useAppState();

  const {
    isOpen: isCompanySwitcherModalOpen,
    openModal: openCompanySwitcherModal,
    closeModal: closeCompanySwitcherModal
  } = useModal();

  const {
    isOpen: isEditModalOpen,
    openModal: openEditModal,
    closeModal: closeEditModal
  } = useModal();

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

  const handleDiscountClick = (discount: Discount) => {
    const transactionFromDiscount = {
      id: discount.id,
      title: discount.title,
      amount: discount.amount,
      description: discount.description,
      type: discount.type || 'expense'
    };
    setSelectedTransaction(transactionFromDiscount);
    openEditModal();
    console.log('Discount clicked:', discount);
  };

  const handleTransactionClick = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    openEditModal();
    console.log('Transaction clicked:', transaction);
  };

  const handleSaveTransaction = (updatedTransaction: Transaction) => {
    console.log('Transaction saved:', updatedTransaction);
    closeEditModal();
  };

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

  return (
    <div ref={scrollableRef}>
      <AppLayout
        title="Gestão fiscal"
        onBackClick={() => console.log('Back clicked')}
        onSettingsClick={() => console.log('Settings clicked')}
        bottomNavTab={bottomNavTab}
        onBottomNavChange={handleBottomNavChange}
      >
        <PullToRefreshIndicator 
          isVisible={shouldShowIndicator} 
          isRefreshing={isRefreshing} 
          pullDistance={pullDistance} 
          threshold={80} 
        />
        
        <CompanyInfo 
          companyName="Anderson Design" 
          onRefreshClick={openCompanySwitcherModal} 
        />
        
        <MainBackground />
        
        <MainContent
          months={MONTHS}
          currentMonth={currentMonth}
          onMonthChange={handleMonthChange}
          activeTab={activeTab}
          onTabChange={handleTabChange}
          discounts={MOCK_DISCOUNTS}
          onDiscountClick={handleDiscountClick}
        />
        
        <TransactionSheet 
          month="Maio 2025" 
          incomeTotal="R$ 10,500,00" 
          expenseTotal="R$ 4.017,18" 
          incomeTransactions={MOCK_INCOME_TRANSACTIONS} 
          expenseTransactions={MOCK_EXPENSE_TRANSACTIONS} 
          entryTotal="R$ 10.500,00" 
          exitTotal="R$ 4.017,18" 
          balance="R$ 6.482,82" 
          onAddTransaction={handleAddTransaction} 
          onTransactionClick={handleTransactionClick} 
        />

        <TransactionEditModal
          isOpen={isEditModalOpen}
          onClose={closeEditModal}
          transaction={selectedTransaction}
          onSave={handleSaveTransaction}
        />

        <CompanySwitcherModal
          isOpen={isCompanySwitcherModalOpen}
          onClose={closeCompanySwitcherModal}
          onSelectCompany={handleSelectCompany}
          onRegisterNewCompany={() => console.log('Register new company clicked')}
        />
      </AppLayout>
    </div>
  );
}

export default Index;
