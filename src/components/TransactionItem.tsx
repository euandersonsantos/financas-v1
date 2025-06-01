
import React from 'react';
import { DocumentIcon, ChevronRightIcon } from './icons';
import { TransactionStatus } from './TransactionStatus';

interface TransactionItemProps {
  title: string;
  description: string;
  amount: string;
  type: 'income' | 'expense';
  onClick?: () => void;
  showStatus?: boolean;
  status?: 'pending' | 'completed';
  onStatusChange?: (newStatus: 'pending' | 'completed') => void;
}

export const TransactionItem: React.FC<TransactionItemProps> = ({
  title,
  description,
  amount,
  type,
  onClick,
  showStatus = false,
  status = 'pending',
  onStatusChange
}) => {
  const gradientClass = type === 'income' 
    ? 'bg-gradient-to-r from-[#78B60F] to-[#6D96E4] bg-clip-text text-transparent'
    : 'bg-gradient-to-r from-[#7637EA] to-[#FF7A00] bg-clip-text text-transparent';

  // Replace R$ with + for income and - for expense
  const displayAmount = type === 'income' 
    ? amount.replace('R$', '+')
    : amount.replace('R$', '-');

  const handleStatusClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onStatusChange) {
      const newStatus = status === 'completed' ? 'pending' : 'completed';
      onStatusChange(newStatus);
    }
  };

  const handleTransactionClick = () => {
    if (onClick) {
      onClick();
    }
  };

  return (
    <div className="flex justify-between items-center w-full">
      <div className="flex items-center gap-4 flex-1">
        {showStatus ? (
          <TransactionStatus 
            status={status} 
            className="w-6 h-6 flex-shrink-0" 
            onClick={onStatusChange ? handleStatusClick : undefined}
          />
        ) : (
          <DocumentIcon className="w-6 h-6 flex-shrink-0" />
        )}
        <button
          onClick={handleTransactionClick}
          className="flex flex-col items-start flex-1 text-left"
        >
          <h3 className="text-[#43464D] font-bold text-lg tracking-[0.16px] max-sm:text-base">
            {title}
          </h3>
          <p className="text-[#5E626C] font-medium text-sm tracking-[0.12px] max-sm:text-xs">
            {description}
          </p>
        </button>
      </div>
      <button
        onClick={handleTransactionClick}
        className="flex items-center gap-1"
      >
        <span className={`text-base font-extrabold tracking-[0.01em] max-sm:text-sm ${gradientClass}`}>
          {displayAmount}
        </span>
        <ChevronRightIcon className="w-6 h-6" />
      </button>
    </div>
  );
};
