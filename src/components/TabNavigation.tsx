
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
        className={`flex w-[180px] flex-col justify-center items-center gap-2.5 px-2.5 py-2 rounded-[50px_0px_0px_50px] max-sm:w-[calc(50%-0.5px)] h-full ${
          activeTab === 'faturamento'
            ? 'bg-white shadow-[0px_4px_4px_0px_rgba(0,0,0,0.02)]'
            : 'bg-white shadow-[0px_4px_4px_0px_rgba(0,0,0,0.02)]'
        }`}
      >
        <div className="flex items-center gap-2">
          <FaturamentoIcon 
            className="w-6 h-6 max-sm:w-5 max-sm:h-5" 
            fill={activeTab === 'faturamento' ? 'url(#faturamento-gradient)' : '#7A7B7D'}
            color={activeTab === 'faturamento' ? 'url(#faturamento-gradient)' : '#7A7B7D'}
          />
          <span className={`text-[14px] font-extrabold tracking-[0.01em] max-sm:text-xs ${
            activeTab === 'faturamento' 
              ? 'bg-gradient-to-r from-[#78B60F] to-[#6D96E4] bg-clip-text text-transparent'
              : 'text-[#7A7B7D]'
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
        className={`flex w-[179px] flex-col justify-center items-center gap-2.5 px-2.5 py-2 rounded-[0px_50px_50px_0px] max-sm:w-[calc(50%-0.5px)] h-full ${
          activeTab === 'fechamento'
            ? 'bg-white shadow-[0px_4px_4px_0px_rgba(0,0,0,0.02)]'
            : 'bg-white shadow-[0px_4px_4px_0px_rgba(0,0,0,0.02)]'
        }`}
      >
        <div className="flex items-center gap-2">
          <FechamentoIcon 
            className="w-6 h-6 max-sm:w-5 max-sm:h-5" 
            fill={activeTab === 'fechamento' ? 'url(#fechamento-gradient)' : '#7A7B7D'}
            color={activeTab === 'fechamento' ? 'url(#fechamento-gradient)' : '#7A7B7D'}
          />
          <span className={`text-[14px] font-medium tracking-[0.01em] max-sm:text-xs ${
            activeTab === 'fechamento' 
              ? 'bg-gradient-to-r from-[#78B60F] to-[#6D96E4] bg-clip-text text-transparent'
              : 'text-[#7A7B7D]'
          }`}>
            Fechamento
          </span>
        </div>
      </button>
      
      {/* SVG gradients for icons */}
      <svg width="0" height="0" style={{ position: 'absolute' }}>
        <defs>
          <linearGradient id="faturamento-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#78B60F" />
            <stop offset="100%" stopColor="#6D96E4" />
          </linearGradient>
          <linearGradient id="fechamento-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#78B60F" />
            <stop offset="100%" stopColor="#6D96E4" />
          </linearGradient>
        </defs>
      </svg>
    </nav>
  );
};
