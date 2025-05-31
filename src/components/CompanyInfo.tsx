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
  return <section className="flex w-full justify-between items-center h-6 py-[16px] px-[24px] mt-0 mb-[16px]">
      <div className="flex items-center gap-2">
        <BuildingIcon className="w-6 h-6" />
        <span className="text-white text-lg font-bold tracking-[0.01em] max-sm:text-base">
          {companyName}
        </span>
      </div>
      
      <button onClick={onRefreshClick} className="w-6 h-6" aria-label="Atualizar dados">
        <RefreshIcon />
      </button>
    </section>;
};