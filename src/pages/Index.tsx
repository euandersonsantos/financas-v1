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
import { useMonthlyRevenue } from "@/hooks/useMonthlyRevenue";
import { useTransactions } from "@/hooks/useTransactions";
import { Button } from "@/components/ui/button";

interface Transaction {
  id: string;
  title: string;
  description: string;
  amount: string;
  type: 'income' | 'expense';
  status?: 'pending' | 'completed';
  date?: string;
}

function Index() {
  const { user, loading: authLoading, signOut } = useAuth();
  const { companies, currentCompany, companySettings, loading: companiesLoading } = useCompanies();
  
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [companySetupModalOpen, setCompanySetupModalOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(5); // Junho (index 5)
  const [activeTab, setActiveTab] = useState<'faturamento' | 'fechamento'>('faturamento');
  const [isCompanySwitcherModalOpen, setIsCompanySwitcherModalOpen] = useState(false);
  const [bottomNavTab, setBottomNavTab] = useState('documents');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<any>(null);

  // Hooks para dados dinâmicos
  const { 
    fetchMonthlyRevenue, 
    createOrUpdateMonthlyRevenue, 
    calculateTaxes, 
    fetchCalculatedTaxes,
    fetchTaxesForPayment 
  } = useMonthlyRevenue(currentCompany?.id || null);
  
  const { 
    transactions, 
    fetchTransactions, 
    updateTransaction,
    generateAutoTransactions 
  } = useTransactions(currentCompany?.id || null);

  // Estados para dados calculados
  const [monthlyRevenue, setMonthlyRevenue] = useState<any>(null);
  const [calculatedTaxes, setCalculatedTaxes] = useState<any>(null);
  const [taxesForPayment, setTaxesForPayment] = useState<any>(null);

  // Show auth modal if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      setAuthModalOpen(true);
    }
  }, [authLoading, user]);

  // Show company setup modal if no companies exist
  useEffect(() => {
    if (user && !companiesLoading && companies.length === 0) {
      setCompanySetupModalOpen(true);
    }
  }, [user, companiesLoading, companies]);

  // Carregar dados quando empresa ou mês mudarem
  useEffect(() => {
    if (currentCompany && companySettings) {
      loadMonthData();
    }
  }, [currentCompany, companySettings, currentMonth]);

  const loadMonthData = async () => {
    if (!currentCompany || !companySettings) return;
    
    const year = 2025; // Ano fixo por enquanto
    const month = currentMonth + 1; // currentMonth é 0-based, mas no banco é 1-based
    
    try {
      // Buscar receita mensal
      const revenue = await fetchMonthlyRevenue(month, year);
      setMonthlyRevenue(revenue);
      
      // Se não há receita, criar com valor padrão
      if (!revenue) {
        const defaultRevenue = 10500; // Valor padrão
        const newRevenue = await createOrUpdateMonthlyRevenue(month, year, defaultRevenue);
        if (newRevenue.data) {
          setMonthlyRevenue(newRevenue.data);
          
          // Calcular impostos automaticamente
          const taxes = await calculateTaxes(month, year, defaultRevenue, {
            pro_labore_percentage: companySettings.pro_labore_percentage,
            inss_percentage: companySettings.inss_percentage,
            das_percentage: companySettings.das_percentage
          });
          
          if (taxes.data) {
            setCalculatedTaxes(taxes.data);
            
            // Gerar transações automáticas
            await generateAutoTransactions(
              month,
              year,
              {
                pro_labore_amount: taxes.data.pro_labore_amount,
                inss_amount: taxes.data.inss_amount,
                das_amount: taxes.data.das_amount
              },
              defaultRevenue,
              companySettings.accounting_fee
            );
          }
        }
      } else {
        // Buscar impostos calculados
        const taxes = await fetchCalculatedTaxes(month, year);
        setCalculatedTaxes(taxes);
      }
      
      // Buscar impostos para pagamento neste mês
      const paymentTaxes = await fetchTaxesForPayment(month, year);
      setTaxesForPayment(paymentTaxes);
      
      // Buscar transações
      await fetchTransactions(month, year);
      
    } catch (error) {
      console.error('Error loading month data:', error);
    }
  };

  const months = ['JAN 25', 'FEV 25', 'MAR 25', 'ABR 25', 'MAI 25', 'JUN 25', 'JUL 25', 'AGO 25', 'SET 25', 'OUT 25', 'NOV 25', 'DEZ 25', 'JAN 26', 'FEV 26', 'MAR 26', 'ABR 26', 'MAI 26', 'JUN 26'];
  
  // Gerar dados dinâmicos baseados nos cálculos
  const generateDynamicData = () => {
    if (!monthlyRevenue || !calculatedTaxes || !companySettings) {
      return {
        faturamentoDiscounts: [],
        fechamentoDiscounts: [],
        revenue: 'R$ 0,00',
        proLabore: 'R$ 0,00',
        inss: 'R$ 0,00',
        das: 'R$ 0,00'
      };
    }

    const revenue = monthlyRevenue.total_revenue;
    const proLabore = calculatedTaxes.pro_labore_amount;
    const inss = calculatedTaxes.inss_amount;
    const das = calculatedTaxes.das_amount;

    const formatCurrency = (value: number) => {
      return `R$ ${value.toLocaleString('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      })}`;
    };

    const faturamentoDiscounts = [
      {
        id: '1',
        title: 'Pró-Labore',
        amount: formatCurrency(proLabore),
        description: `${companySettings.pro_labore_percentage}% do faturamento`,
        fontWeight: 'bold' as const,
        type: 'expense' as const
      },
      {
        id: '2',
        title: 'DAS - SN',
        amount: formatCurrency(das),
        description: `${companySettings.das_percentage}% do faturamento`,
        fontWeight: 'extrabold' as const,
        type: 'expense' as const
      },
      {
        id: '3',
        title: 'INSS',
        amount: formatCurrency(inss),
        description: `${companySettings.inss_percentage}% do pró-labore`,
        fontWeight: 'extrabold' as const,
        type: 'expense' as const
      }
    ];

    const fechamentoDiscounts = [
      {
        id: '1',
        title: 'Pró-Labore',
        amount: formatCurrency(proLabore),
        description: `${companySettings.pro_labore_percentage}% do faturamento`,
        fontWeight: 'bold' as const,
        type: 'expense' as const
      },
      {
        id: '2',
        title: 'DAS - SN',
        amount: formatCurrency(das),
        description: `${companySettings.das_percentage}% do faturamento`,
        fontWeight: 'extrabold' as const,
        type: 'expense' as const
      },
      {
        id: '3',
        title: 'INSS',
        amount: formatCurrency(inss),
        description: `${companySettings.inss_percentage}% do pró-labore`,
        fontWeight: 'extrabold' as const,
        type: 'expense' as const
      }
    ];

    return {
      faturamentoDiscounts,
      fechamentoDiscounts,
      revenue: formatCurrency(revenue),
      proLabore: formatCurrency(proLabore),
      inss: formatCurrency(inss),
      das: formatCurrency(das)
    };
  };

  const dynamicData = generateDynamicData();

  // Converter transações do banco para formato do componente
  const formatTransactionsForComponent = (dbTransactions: any[]) => {
    return dbTransactions.map(transaction => ({
      id: transaction.id,
      title: transaction.title,
      description: transaction.description || '',
      amount: `R$ ${transaction.amount.toLocaleString('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      })}`,
      type: transaction.type,
      status: transaction.status,
      date: '25 de Jun 2025' // Simplificado por enquanto
    }));
  };

  const incomeTransactions = formatTransactionsForComponent(
    transactions.filter(t => t.type === 'income')
  );
  
  const expenseTransactions = formatTransactionsForComponent(
    transactions.filter(t => t.type === 'expense')
  );

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
    // Convert discount to transaction format for the modal
    const transactionFromDiscount = {
      id: discount.id,
      title: discount.title,
      amount: discount.amount,
      description: discount.description,
      type: discount.type
    };
    setSelectedTransaction(transactionFromDiscount);
    setIsEditModalOpen(true);
    console.log('Discount clicked:', discount);
  };
  const handleTransactionClick = (transaction: any) => {
    setSelectedTransaction(transaction);
    setIsEditModalOpen(true);
    console.log('Transaction clicked:', transaction);
  };
  const handleSaveTransaction = (updatedTransaction: any) => {
    console.log('Transaction saved:', updatedTransaction);
    setIsEditModalOpen(false);
  };

  const handleStatusChange = async (transactionId: string, newStatus: 'pending' | 'completed') => {
    console.log('Status changed:', transactionId, newStatus);
    
    try {
      await updateTransaction(transactionId, { status: newStatus });
      // Recarregar transações
      const year = 2025;
      const month = currentMonth + 1;
      await fetchTransactions(month, year);
    } catch (error) {
      console.error('Error updating transaction status:', error);
    }
  };

  const openCompanySwitcherModal = () => setIsCompanySwitcherModalOpen(true);
  const closeCompanySwitcherModal = () => setIsCompanySwitcherModalOpen(false);
  const handleSelectCompany = (companyId: string) => {
    console.log('Company selected:', companyId);
  };

  const handleRefresh = async () => {
    console.log('Refreshing data...');
    await loadMonthData();
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

  if (authLoading || (user && companiesLoading)) {
    return (
      <div className="w-full max-w-[100vw] bg-black min-h-screen flex items-center justify-center">
        <div className="text-white">Carregando...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="w-full max-w-[100vw] bg-black min-h-screen flex items-center justify-center">
        <div className="text-white text-center">
          <h1 className="text-2xl mb-4">Gestão Fiscal</h1>
          <p className="mb-4">Faça login para acessar o sistema</p>
          <Button onClick={() => setAuthModalOpen(true)}>
            Fazer Login
          </Button>
        </div>
        <AuthModal 
          isOpen={authModalOpen} 
          onClose={() => setAuthModalOpen(false)} 
        />
      </div>
    );
  }

  if (companies.length === 0) {
    return (
      <div className="w-full max-w-[100vw] bg-black min-h-screen flex items-center justify-center">
        <div className="text-white text-center">
          <h1 className="text-2xl mb-4">Bem-vindo!</h1>
          <p className="mb-4">Configure sua primeira empresa para começar</p>
          <Button onClick={() => setCompanySetupModalOpen(true)}>
            Configurar Empresa
          </Button>
          <div className="mt-4">
            <Button variant="outline" onClick={signOut}>
              Sair
            </Button>
          </div>
        </div>
        <CompanySetupModal 
          isOpen={companySetupModalOpen} 
          onClose={() => setCompanySetupModalOpen(false)} 
        />
      </div>
    );
  }

  // Definir dados baseados na aba ativa
  const currentDiscounts = activeTab === 'faturamento' ? dynamicData.faturamentoDiscounts : [];
  const currentIncomeTransactions = incomeTransactions;
  const currentExpenseTransactions = expenseTransactions;
  
  const totalIncome = incomeTransactions.reduce((sum, t) => {
    const amount = parseFloat(t.amount.replace('R$ ', '').replace('.', '').replace(',', '.'));
    return sum + amount;
  }, 0);
  
  const totalExpense = expenseTransactions.reduce((sum, t) => {
    const amount = parseFloat(t.amount.replace('R$ ', '').replace('.', '').replace(',', '.'));
    return sum + amount;
  }, 0);
  
  const balance = totalIncome - totalExpense;
  
  const revenueSummaryTitle = activeTab === 'faturamento' ? dynamicData.revenue : `R$ ${balance.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  const revenueSummaryLabel = activeTab === 'faturamento' ? 'Total faturamento' : 'Saldo atual';
  const discountGridTitle = 'Principais descontos';

  return (
    <div ref={scrollableRef} className="w-full max-w-[100vw] bg-black min-h-screen relative mx-auto font-['Urbanist'] overflow-x-hidden overflow-y-auto" style={{
      paddingTop: 'calc(env(safe-area-inset-top, 0px) + 76px)'
    }}>
      <PullToRefreshIndicator isVisible={shouldShowIndicator} isRefreshing={isRefreshing} pullDistance={pullDistance} threshold={80} />
      
      <Header 
        title="Gestão fiscal" 
        onBackClick={() => console.log('Back clicked')} 
        onSettingsClick={() => setAuthModalOpen(true)} 
      />
      
      <CompanyInfo 
        companyName={currentCompany?.name || "Carregando..."} 
        onRefreshClick={() => setIsCompanySwitcherModalOpen(true)} 
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
          <MonthNavigation months={months} currentMonth={currentMonth} onMonthChange={setCurrentMonth} />
          <div className="w-full h-px bg-[rgba(0,0,0,0.08)]" />
        </div>
        
        <div className="absolute w-full flex flex-col items-start gap-8 px-4 left-0 top-[110px] sm:w-[360px] sm:left-[21px] sm:px-0">
          <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />
          
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
              onDiscountClick={(discount) => {
                setSelectedTransaction(discount);
                setIsEditModalOpen(true);
              }}
            />
          </div>
        </div>
      </main>
      
      <TransactionSheet 
        month="Maio 2025" 
        incomeTotal={`R$ ${totalIncome.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
        expenseTotal={`R$ ${totalExpense.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
        incomeTransactions={currentIncomeTransactions} 
        expenseTransactions={currentExpenseTransactions} 
        entryTotal={`R$ ${totalIncome.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
        exitTotal={`R$ ${totalExpense.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
        balance={`R$ ${balance.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
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
        onClose={() => setIsCompanySwitcherModalOpen(false)}
        onSelectCompany={() => console.log('Company selected')}
        onRegisterNewCompany={() => setCompanySetupModalOpen(true)}
      />
    </div>
  );
}

export default Index;
