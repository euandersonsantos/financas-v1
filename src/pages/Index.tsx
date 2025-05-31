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
function Index() {
  const [currentMonth, setCurrentMonth] = useState(6); // Começar em JUL 25
  const [activeTab, setActiveTab] = useState<'faturamento' | 'fechamento'>('faturamento');
  const [bottomNavTab, setBottomNavTab] = useState('documents');
  const months = ['JAN 25', 'FEV 25', 'MAR 25', 'ABR 25', 'MAI 25', 'JUN 25', 'JUL 25', 'AGO 25', 'SET 25', 'OUT 25', 'NOV 25', 'DEZ 25', 'JAN 26', 'FEV 26', 'MAR 26', 'ABR 26', 'MAI 26', 'JUN 26'];
  const discounts = [{
    id: '1',
    title: 'Pró-Labore',
    amount: 'R$ 2.950,50',
    description: '100% do faturamento',
    fontWeight: 'bold' as const,
    type: 'expense' as const
  }, {
    id: '2',
    title: 'DAS - SN',
    amount: 'R$ 630,00',
    description: '6% do faturamento',
    fontWeight: 'extrabold' as const,
    type: 'expense' as const
  }, {
    id: '3',
    title: 'INSS',
    amount: 'R$ 324,55',
    description: '11% do pró-labore',
    fontWeight: 'extrabold' as const,
    type: 'expense' as const
  }, {
    id: '4',
    title: 'Despesas',
    amount: 'R$ 112,13',
    description: 'Outras despesas',
    fontWeight: 'extrabold' as const,
    type: 'expense' as const
  }];
  const incomeTransactions = [{
    id: '1',
    title: 'Salário',
    description: 'Sensorama Design',
    amount: 'R$ 10.500,00',
    type: 'income' as const
  }];
  const expenseTransactions = [{
    id: '1',
    title: 'Pró-labore',
    description: '100% do faturamento',
    amount: 'R$ 2.950,50',
    type: 'expense' as const
  }, {
    id: '2',
    title: 'DAS - Simples nacional',
    description: '6% do faturamento',
    amount: 'R$ 630,00',
    type: 'expense' as const
  }, {
    id: '3',
    title: 'INSS',
    description: '11% do pro-labore',
    amount: 'R$ 324,55',
    type: 'expense' as const
  }, {
    id: '4',
    title: 'Despesas',
    description: 'Outras despesas',
    amount: 'R$ 112,13',
    type: 'expense' as const
  }];
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
  const handleTransactionClick = (transaction: any) => {
    console.log('Transaction clicked:', transaction);
  };
  const handleRefresh = async () => {
    console.log('Refreshing data...');
    // Simular carregamento
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
  return <div ref={scrollableRef} className="w-full max-w-[100vw] bg-black min-h-screen relative mx-auto font-['Urbanist'] overflow-x-hidden overflow-y-auto" style={{
    paddingTop: 'calc(env(safe-area-inset-top, 0px) + 76px)'
  }}>
      <PullToRefreshIndicator isVisible={shouldShowIndicator} isRefreshing={isRefreshing} pullDistance={pullDistance} threshold={80} />
      
      <Header title="Gestão fiscal" onBackClick={() => console.log('Back clicked')} onSettingsClick={() => console.log('Settings clicked')} />
      
      <CompanyInfo companyName="Anderson Design" onRefreshClick={() => console.log('Refresh clicked')} />
      
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
          
          <RevenueSummary totalRevenue="R$ 10.500,00" percentageChange={0} comparisonText="em relação ao mês anterior" />
          
          <div className="pb-8 w-full">
            <DiscountGrid title="Principais descontos" discounts={discounts} />
          </div>
        </div>
      </main>
      
      <TransactionSheet month="Maio 2025" incomeTotal="R$ 10,500,00" expenseTotal="R$ 4.017,18" incomeTransactions={incomeTransactions} expenseTransactions={expenseTransactions} entryTotal="R$ 10.500,00" exitTotal="R$ 4.017,18" balance="R$ 6.482,82" onAddTransaction={handleAddTransaction} onTransactionClick={handleTransactionClick} />
      
      <BottomNavigation activeTab={bottomNavTab} onTabChange={handleBottomNavChange} />
    </div>;
}
export default Index;