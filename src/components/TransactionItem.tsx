import React from 'react';
import { DocumentIcon, ChevronRightIcon } from './icons';

interface TransactionItemProps {
  title: string;
  description: string;
  amount: string;
  type: 'income' | 'expense';
  onClick?: () => void;
}

export const TransactionItem: React.FC<TransactionItemProps> = ({
  title,
  description,
  amount,
  type,
  onClick
}) => {
  const gradientClass = type === 'income' 
    ? 'bg-gradient-to-r from-[#78B60F] to-[#6D96E4] bg-clip-text text-transparent'
    : 'bg-gradient-to-r from-[#7637EA] to-[#FF7A00] bg-clip-text text-transparent';

  return (
    <button
      onClick={onClick}
      className="flex justify-between items-center w-full text-left hover:bg-gray-50 transition-colors"
    >
      <div className="flex items-center gap-4 flex-1">
        <DocumentIcon className="w-6 h-6 flex-shrink-0" />
        <div className="flex flex-col items-start">
          <h3 className="text-[#43464D] font-bold text-base tracking-[0.16px] max-sm:text-sm">
            {title}
          </h3>
          <p className="text-[#5E626C] font-medium text-xs tracking-[0.12px] max-sm:text-[10px]">
            {description}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-1">
        <span className={`text-sm font-extrabold tracking-[0.01em] max-sm:text-xs ${gradientClass}`}>
          {amount}
        </span>
        <ChevronRightIcon className="w-6 h-6" />
      </div>
    </button>
  );
};
