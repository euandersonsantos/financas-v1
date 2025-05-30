import React from 'react';
import { TransactionItem } from './TransactionItem';
import { PlusIcon } from './icons';

interface Transaction {
  id: string;
  title: string;
  description: string;
  amount: string;
  type: 'income' | 'expense';
}

interface TransactionSheetProps {
  month: string;
  incomeTotal: string;
  expenseTotal: string;
  incomeTransactions: Transaction[];
  expenseTransactions: Transaction[];
  entryTotal: string;
  exitTotal: string;
  balance: string;
  onAddTransaction?: () => void;
  onTransactionClick?: (transaction: Transaction) => void;
}

export const TransactionSheet: React.FC<TransactionSheetProps> = ({
  month,
  incomeTotal,
  expenseTotal,
  incomeTransactions,
  expenseTransactions,
  entryTotal,
  exitTotal,
  balance,
  onAddTransaction,
  onTransactionClick
}) => {
  return (
    <section className="w-full flex flex-col items-center bg-white h-[654px] pt-6 pb-[122px] px-[21px] rounded-[24px_24px_0px_0px] max-sm:pt-5 max-sm:pb-[100px] max-sm:px-[15px] mt-8">
      <div className="flex w-[360px] flex-col items-end gap-6 max-sm:w-full">
        <header className="flex justify-between items-center w-full">
          <div>
            <h2 className="text-[#43464D] font-bold text-base tracking-[0.01em] max-sm:text-sm">
              Lançamentos
            </h2>
            <p className="text-[#43464D] font-medium text-sm tracking-[0.01em] max-sm:text-xs">
              {month}
            </p>
          </div>
          <button
            onClick={onAddTransaction}
            className="w-10 h-10 flex items-center justify-center"
            aria-label="Adicionar lançamento"
          >
            <PlusIcon className="w-10 h-10" />
          </button>
        </header>
        
        <div className="flex flex-col items-start gap-6 w-full">
          <div className="flex flex-col items-start gap-[5px] w-full">
            <div className="flex justify-between items-center w-full">
              <span className="text-[#5E626C] font-medium text-[10px] tracking-[0.1px]">
                Entradas
              </span>
              <div className="flex items-center gap-1">
                <span className="text-[#5E626C] font-medium text-[10px] tracking-[0.1px]">
                  Total
                </span>
                <span className="text-[#5E626C] font-bold text-[10px] tracking-[0.1px]">
                  {incomeTotal}
                </span>
              </div>
            </div>
            <div className="w-full h-px bg-[rgba(0,0,0,0.08)]" />
          </div>
          
          <div className="flex flex-col gap-4 w-full">
            {incomeTransactions.map((transaction) => (
              <TransactionItem
                key={transaction.id}
                title={transaction.title}
                description={transaction.description}
                amount={transaction.amount}
                type={transaction.type}
                onClick={() => onTransactionClick?.(transaction)}
              />
            ))}
          </div>
          
          <div className="flex flex-col items-start gap-[5px] w-full">
            <div className="flex justify-between items-center w-full">
              <span className="text-[#5E626C] font-medium text-[10px] tracking-[0.1px]">
                Saídas
              </span>
              <div className="flex items-center gap-1">
                <span className="text-[#5E626C] font-medium text-[10px] tracking-[0.1px]">
                  Total
                </span>
                <span className="text-[#5E626C] font-bold text-[10px] tracking-[0.1px]">
                  {expenseTotal}
                </span>
              </div>
            </div>
            <div className="w-full h-px bg-[rgba(0,0,0,0.08)]" />
          </div>
          
          <div className="flex flex-col gap-4 w-full">
            {expenseTransactions.map((transaction) => (
              <TransactionItem
                key={transaction.id}
                title={transaction.title}
                description={transaction.description}
                amount={transaction.amount}
                type={transaction.type}
                onClick={() => onTransactionClick?.(transaction)}
              />
            ))}
          </div>
          
          <div className="flex flex-col items-start gap-[5px] w-full">
            <div className="flex justify-between items-center w-full">
              <span className="text-[#5E626C] font-medium text-[10px] tracking-[0.1px]">
                Resultado
              </span>
              <div className="flex w-0 h-3 items-center gap-1" />
            </div>
            <div className="w-full h-px bg-[rgba(0,0,0,0.08)]" />
          </div>
          
          <div className="flex justify-center items-start gap-8 w-full px-[1.5px] py-0 max-sm:gap-4">
            <div className="flex flex-col items-start gap-2">
              <div className="flex flex-col items-start">
                <span className="text-[#43464D] font-medium text-sm tracking-[0.14px] max-sm:text-xs">
                  Entrada
                </span>
                <span className="font-bold text-sm tracking-[0.14px] bg-gradient-to-r from-[#78B60F] to-[#6D96E4] bg-clip-text text-transparent max-sm:text-xs">
                  {entryTotal}
                </span>
              </div>
            </div>
            <div className="w-9 h-0 bg-[rgba(0,0,0,0.08)] max-sm:w-5" />
            <div className="flex flex-col items-start gap-2">
              <div className="flex flex-col items-start">
                <span className="text-[#43464D] font-medium text-sm tracking-[0.14px] max-sm:text-xs">
                  Saída
                </span>
                <span className="font-bold text-sm tracking-[0.14px] bg-gradient-to-r from-[#78B60F] to-[#6D96E4] bg-clip-text text-transparent max-sm:text-xs">
                  {exitTotal}
                </span>
              </div>
            </div>
            <div className="w-9 h-0 bg-[rgba(0,0,0,0.08)] max-sm:w-5" />
            <div className="flex flex-col items-start gap-2">
              <div className="flex flex-col items-start">
                <span className="text-[#43464D] font-medium text-sm tracking-[0.14px] max-sm:text-xs">
                  Saldo
                </span>
                <span className="font-bold text-sm tracking-[0.14px] bg-gradient-to-r from-[#78B60F] to-[#6D96E4] bg-clip-text text-transparent max-sm:text-xs">
                  {balance}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
