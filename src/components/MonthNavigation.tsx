
import React, { useEffect, useRef } from 'react';
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
  const scrollContainerRef = useRef<HTMLDivElement>(null);

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

  // Auto-scroll para centralizar o mês selecionado
  useEffect(() => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const monthButtons = container.querySelectorAll('[data-month-button]');
      const activeButton = monthButtons[currentMonth] as HTMLElement;
      
      if (activeButton) {
        const containerWidth = container.offsetWidth;
        const buttonLeft = activeButton.offsetLeft;
        const buttonWidth = activeButton.offsetWidth;
        
        // Calcula a posição para centralizar o botão
        const scrollLeft = buttonLeft - (containerWidth / 2) + (buttonWidth / 2);
        
        container.scrollTo({
          left: scrollLeft,
          behavior: 'smooth'
        });
      }
    }
  }, [currentMonth]);

  // Calcula quantos meses mostrar baseado no tamanho da tela
  const getVisibleMonths = () => {
    const isMobile = window.innerWidth < 768;
    if (isMobile) {
      // No mobile, mostra 3 meses centrados no mês atual
      const start = Math.max(0, currentMonth - 1);
      const end = Math.min(months.length, start + 3);
      const adjustedStart = Math.max(0, end - 3);
      
      return months.slice(adjustedStart, end).map((month, index) => ({
        month,
        originalIndex: adjustedStart + index
      }));
    }
    
    // No desktop, mostra todos os meses
    return months.map((month, index) => ({
      month,
      originalIndex: index
    }));
  };

  const visibleMonths = getVisibleMonths();

  return (
    <nav className="flex w-full justify-between items-center" aria-label="Navegação de meses">
      <button 
        onClick={handlePrevious}
        disabled={currentMonth === 0}
        className="w-6 h-6 disabled:opacity-50 flex-shrink-0 transition-all duration-300 hover:opacity-80 hover:scale-105"
        aria-label="Mês anterior"
      >
        <ArrowCircleLeftIcon />
      </button>
      
      <div 
        ref={scrollContainerRef}
        className="flex-1 overflow-x-auto scrollbar-hide mx-4"
      >
        <div className="flex items-center gap-6 min-w-max px-2 justify-center md:justify-center">
          {visibleMonths.map(({ month, originalIndex }) => {
            const isActive = originalIndex === currentMonth;
            
            return (
              <button
                key={`${month}-${originalIndex}`}
                data-month-button
                onClick={() => onMonthChange(originalIndex)}
                className={`whitespace-nowrap transition-all duration-300 ease-in-out transform hover:scale-105 ${
                  isActive
                    ? 'flex justify-center items-center gap-2.5 px-4 py-2 rounded-[50px] font-black text-base tracking-[0.16px] bg-gradient-to-r from-[#78B60F] to-[#6D96E4] bg-clip-text text-transparent max-sm:text-sm scale-110'
                    : 'text-[#6F7480] font-medium text-sm tracking-[0.14px] max-sm:text-xs hover:text-[#43464D] scale-100'
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
        className="w-6 h-6 disabled:opacity-50 flex-shrink-0 transition-all duration-300 hover:opacity-80 hover:scale-105"
        aria-label="Próximo mês"
      >
        <ArrowCircleRightIcon />
      </button>
    </nav>
  );
};
