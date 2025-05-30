
import React from 'react';
import { ArrowCircleLeftIcon, ArrowCircleRightIcon } from './icons';

interface MonthNavigationProps {
  months: string[];
  currentMonth: number;
  onMonthChange: (monthIndex: number) => void;
}

export const MonthNavigation: React.FC<MonthNavigationProps> = ({
  months,
  currentMonth,
  onMonthChange
}) => {
  const handlePrevious = () => {
    if (currentMonth > 0) {
      onMonthChange(currentMonth - 1);
    }
  };

  const handleNext = () => {
    if (currentMonth < months.length - 1) {
      onMonthChange(currentMonth + 1);
    }
  };

  return (
    <nav className="flex w-full justify-between items-center" aria-label="Navegação de meses">
      <button 
        onClick={handlePrevious}
        disabled={currentMonth === 0}
        className="w-6 h-6 disabled:opacity-50 flex-shrink-0"
        aria-label="Mês anterior"
      >
        <ArrowCircleLeftIcon />
      </button>
      
      <div className="flex-1 overflow-x-auto scrollbar-hide mx-4">
        <div className="flex items-center gap-6 min-w-max px-2">
          {months.map((month, index) => {
            const isActive = index === currentMonth;
            
            return (
              <button
                key={month}
                onClick={() => onMonthChange(index)}
                className={`whitespace-nowrap transition-all duration-200 ${
                  isActive
                    ? 'flex justify-center items-center gap-2.5 px-4 py-2 rounded-[50px] font-black text-base tracking-[0.16px] bg-gradient-to-r from-[#78B60F] to-[#6D96E4] bg-clip-text text-transparent max-sm:text-sm'
                    : 'text-[#6F7480] font-medium text-sm tracking-[0.14px] max-sm:text-xs hover:text-[#43464D]'
                }`}
              >
                {month}
              </button>
            );
          })}
        </div>
      </div>
      
      <button 
        onClick={handleNext}
        disabled={currentMonth === months.length - 1}
        className="w-6 h-6 disabled:opacity-50 flex-shrink-0"
        aria-label="Próximo mês"
      >
        <ArrowCircleRightIcon />
      </button>
    </nav>
  );
};
