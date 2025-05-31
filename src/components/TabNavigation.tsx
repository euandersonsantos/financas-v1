
import React from 'react';
import { FaturamentoIcon, FechamentoIcon } from './icons';

interface TabNavigationProps {
  activeTab: 'faturamento' | 'fechamento';
  onTabChange: (tab: 'faturamento' | 'fechamento') => void;
}

export const TabNavigation: React.FC<TabNavigationProps> = ({
  activeTab,
  onTabChange
}) => {
  return (
    <nav className="flex items-center w-full h-12" role="tablist">
      <button
        role="tab"
        aria-selected={activeTab === 'faturamento'}
        onClick={() => onTabChange('faturamento')}
        className={`flex w-[180px] flex-col justify-center items-center gap-2.5 px-2.5 py-2 rounded-[50px_0px_0px_50px] max-sm:w-[calc(50%-0.5px)] h-full bg-white shadow-[0px_4px_4px_0px_rgba(0,0,0,0.02)]`}
      >
        <div className="flex items-center gap-2">
          <FaturamentoIcon 
            className="w-6 h-6 max-sm:w-5 max-sm:h-5" 
            isActive={activeTab === 'faturamento'} 
          />
          <span className={`text-[14px] tracking-[0.01em] max-sm:text-xs ${
            activeTab === 'faturamento' 
              ? 'font-extrabold bg-gradient-to-r from-[#78B60F] to-[#6D96E4] bg-clip-text text-transparent'
              : 'font-medium text-[#7A7B7D]'
          }`}>
            Faturamento
          </span>
        </div>
      </button>
      
      <div className="w-px h-12 bg-[rgba(0,0,0,0.08)]" />
      
      <button
        role="tab"
        aria-selected={activeTab === 'fechamento'}
        onClick={() => onTabChange('fechamento')}
        className={`flex w-[179px] flex-col justify-center items-center gap-2.5 px-2.5 py-2 rounded-[0px_50px_50px_0px] max-sm:w-[calc(50%-0.5px)] h-full bg-white shadow-[0px_4px_4px_0px_rgba(0,0,0,0.02)]`}
      >
        <div className="flex items-center gap-2">
          <FechamentoIcon 
            className="w-6 h-6 max-sm:w-5 max-sm:h-5" 
            isActive={activeTab === 'fechamento'} 
          />
          <span className={`text-[14px] tracking-[0.01em] max-sm:text-xs ${
            activeTab === 'fechamento' 
              ? 'font-extrabold bg-gradient-to-r from-[#78B60F] to-[#6D96E4] bg-clip-text text-transparent'
              : 'font-medium text-[#7A7B7D]'
          }`}>
            Fechamento
          </span>
        </div>
      </button>
    </nav>
  );
};
