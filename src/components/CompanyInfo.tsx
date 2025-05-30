import React from 'react';
import { BuildingIcon, RefreshIcon } from './icons';

interface CompanyInfoProps {
  companyName: string;
  onRefreshClick?: () => void;
}

export const CompanyInfo: React.FC<CompanyInfoProps> = ({ 
  companyName, 
  onRefreshClick 
}) => {
  return (
    <section className="flex w-full justify-between items-center h-6 px-[21px] py-6 max-sm:px-[15px]">
      <div className="flex items-center gap-2">
        <BuildingIcon className="w-6 h-6" />
        <span className="text-white text-base font-bold tracking-[0.01em] max-sm:text-sm">
          {companyName}
        </span>
      </div>
      
      <button 
        onClick={onRefreshClick}
        className="w-6 h-6"
        aria-label="Atualizar dados"
      >
        <RefreshIcon />
      </button>
    </section>
  );
};
