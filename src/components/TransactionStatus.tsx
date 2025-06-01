
import React from 'react';

interface TransactionStatusProps {
  status: 'pending' | 'completed';
  className?: string;
  onClick?: (e: React.MouseEvent) => void;
}

export const TransactionStatus: React.FC<TransactionStatusProps> = ({
  status,
  className = "w-6 h-6",
  onClick
}) => {
  if (status === 'completed') {
    return (
      <button 
        className={`${className} flex items-center justify-center ${onClick ? 'cursor-pointer hover:scale-110 transition-transform' : ''}`}
        onClick={onClick}
      >
        <div className="w-full h-full rounded-full bg-gradient-to-r from-[#78B60F] to-[#6D96E4] flex items-center justify-center">
          <svg
            className="w-3 h-3 text-white"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      </button>
    );
  }

  return (
    <button 
      className={`${className} flex items-center justify-center ${onClick ? 'cursor-pointer hover:scale-110 transition-transform' : ''}`}
      onClick={onClick}
    >
      <div className="w-full h-full rounded-full bg-gradient-to-r from-[#FF7A00] to-[#7637EA] flex items-center justify-center">
        <svg
          className="w-3 h-3 text-white"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
            clipRule="evenodd"
          />
        </svg>
      </div>
    </button>
  );
};
