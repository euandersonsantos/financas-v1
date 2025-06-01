
import React from 'react';
import { MonthNavigation } from '@/components/MonthNavigation';
import { TabNavigation } from '@/components/TabNavigation';
import { RevenueSummary } from '@/components/RevenueSummary';
import { DiscountGrid } from '@/components/DiscountGrid';
import { Discount } from '@/types/transaction';

interface MainContentProps {
  months: string[];
  currentMonth: number;
  onMonthChange: (monthIndex: number) => void;
  activeTab: 'faturamento' | 'fechamento';
  onTabChange: (tab: 'faturamento' | 'fechamento') => void;
  discounts: Discount[];
  onDiscountClick: (discount: Discount) => void;
}

export const MainContent: React.FC<MainContentProps> = ({
  months,
  currentMonth,
  onMonthChange,
  activeTab,
  onTabChange,
  discounts,
  onDiscountClick
}) => {
  return (
    <>
      <div className="absolute w-full flex flex-col items-center gap-3 px-4 left-0 top-6 sm:px-[21px]">
        <MonthNavigation 
          months={months} 
          currentMonth={currentMonth} 
          onMonthChange={onMonthChange} 
        />
        <div className="w-full h-px bg-[rgba(0,0,0,0.08)]" />
      </div>
      
      <div className="absolute w-full flex flex-col items-start gap-8 px-4 left-0 top-[110px] sm:w-[360px] sm:left-[21px] sm:px-0">
        <TabNavigation 
          activeTab={activeTab} 
          onTabChange={onTabChange} 
        />
        
        <RevenueSummary 
          totalRevenue="R$ 10.500,00" 
          percentageChange={0} 
          comparisonText="em relação ao mês anterior" 
        />
        
        <div className="pb-8 w-full">
          <DiscountGrid 
            title="Principais descontos" 
            discounts={discounts} 
            onDiscountClick={onDiscountClick}
          />
        </div>
      </div>
    </>
  );
};
