import React from 'react';
import { TransactionItem } from './TransactionItem';
import { PlusIcon } from './icons';
interface Transaction {
  id: string;
  title: string;
  description: string;
  amount: string;
  type: 'income' | 'expense';
  status?: 'pending' | 'completed';
  date?: string;
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
  showStatus?: boolean;
  isClosingTab?: boolean;
  initialBalance?: string;
  onStatusChange?: (transactionId: string, newStatus: 'pending' | 'completed') => void;
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
  onTransactionClick,
  showStatus = false,
  isClosingTab = false,
  initialBalance = "R$ 0,00",
  onStatusChange
}) => {
  const handleTransactionClick = (transaction: Transaction) => {
    onTransactionClick?.(transaction);
  };
  const handleStatusChange = (transactionId: string, newStatus: 'pending' | 'completed') => {
    onStatusChange?.(transactionId, newStatus);
  };

  // Group all transactions by date for closing tab
  const groupedTransactions = isClosingTab ? (() => {
    const allTransactions = [...incomeTransactions, ...expenseTransactions];
    const grouped = allTransactions.reduce((acc, transaction) => {
      const date = transaction.date || '25 de Jun 2025';
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(transaction);
      return acc;
    }, {} as Record<string, Transaction[]>);
    return grouped;
  })() : {};
  if (isClosingTab) {
    return <section className="absolute w-full flex flex-col items-center bg-white h-[700px] pt-6 pb-[122px] px-4 rounded-[24px_24px_0px_0px] left-0 bottom-[82px] z-10 sm:px-[21px]">
        <div className="flex w-full flex-col items-end gap-6 max-w-[360px]">
          <header className="flex justify-between items-center w-full">
            <div>
              <h2 className="text-[#43464D] font-bold text-lg tracking-[0.01em] max-sm:text-base">
                Lançamentos
              </h2>
              <p className="text-[#43464D] font-medium text-base tracking-[0.01em] max-sm:text-sm">
                {month}
              </p>
            </div>
            <button onClick={onAddTransaction} className="w-10 h-10 flex items-center justify-center" aria-label="Adicionar lançamento">
              <PlusIcon className="w-10 h-10" />
            </button>
          </header>
          
          <div className="flex flex-col items-start gap-6 w-full">
            {/* Saldo inicial com melhor exibição */}
            <div className="flex flex-col items-start gap-4 w-full">
              <div className="flex flex-col items-start gap-[5px] w-full">
                <div className="flex justify-between items-center w-full">
                  
                </div>
                <div className="w-full h-px bg-[rgba(0,0,0,0.08)]" />
              </div>
              
              <div className="flex justify-between items-center w-full px-0">
                <div className="flex flex-col items-start">
                  <h3 className="text-[#43464D] font-bold tracking-[0.16px] text-base">
                    Saldo do mês anterior
                  </h3>
                  <p className="text-[#5E626C] font-medium text-sm tracking-[0.12px] max-sm:text-xs">
                    Maio 2025
                  </p>
                </div>
                <span className="tracking-[0.01em] bg-gradient-to-r from-[#78B60F] to-[#6D96E4] bg-clip-text text-zinc-600 font-extrabold text-sm">
                  {initialBalance}
                </span>
              </div>
            </div>

            {/* Transactions grouped by date */}
            {Object.entries(groupedTransactions).map(([date, transactions]) => <div key={date} className="flex flex-col items-start gap-4 w-full">
                <div className="flex flex-col items-start gap-[5px] w-full">
                  <div className="flex justify-between items-center w-full">
                    <span className="text-[#5E626C] font-medium text-xs tracking-[0.1px]">
                      {date}
                    </span>
                  </div>
                  <div className="w-full h-px bg-[rgba(0,0,0,0.08)]" />
                </div>
                
                <div className="flex flex-col gap-4 w-full">
                  {transactions.map(transaction => <TransactionItem key={transaction.id} title={transaction.title} description={transaction.description} amount={transaction.amount} type={transaction.type} onClick={() => handleTransactionClick(transaction)} showStatus={showStatus} status={transaction.status} onStatusChange={newStatus => handleStatusChange(transaction.id, newStatus)} />)}
                </div>
              </div>)}
            
            {/* ... keep existing code (resultado section) */}
            <div className="flex flex-col items-start gap-[5px] w-full">
              <div className="flex justify-between items-center w-full">
                <span className="text-[#5E626C] font-medium text-xs tracking-[0.1px]">
                  Resultado
                </span>
                <div className="flex w-0 h-3 items-center gap-1" />
              </div>
              <div className="w-full h-px bg-[rgba(0,0,0,0.08)]" />
            </div>
              
            <div className="flex justify-center items-start gap-4 w-full py-0 sm:gap-8 px-0">
              <div className="flex flex-col items-start gap-2">
                <div className="flex flex-col items-start">
                  <span className="text-[#43464D] font-medium text-base tracking-[0.14px] max-sm:text-sm">
                    Entrada
                  </span>
                  <span className="font-bold text-base tracking-[0.14px] bg-gradient-to-r from-[#78B60F] to-[#6D96E4] bg-clip-text text-transparent max-sm:text-sm">
                    {entryTotal}
                  </span>
                </div>
              </div>
              <div className="w-5 h-0 bg-[rgba(0,0,0,0.08)] sm:w-9" />
              <div className="flex flex-col items-start gap-2">
                <div className="flex flex-col items-start">
                  <span className="text-[#43464D] font-medium text-base tracking-[0.14px] max-sm:text-sm">
                    Saída
                  </span>
                  <span className="font-bold text-base tracking-[0.14px] bg-gradient-to-r from-[#7637EA] to-[#FF7A00] bg-clip-text text-transparent max-sm:text-sm">
                    {exitTotal}
                  </span>
                </div>
              </div>
              <div className="w-5 h-0 bg-[rgba(0,0,0,0.08)] sm:w-9" />
              <div className="flex flex-col items-start gap-2">
                <div className="flex flex-col items-start">
                  <span className="text-[#43464D] font-medium tracking-[0.14px] text-base">Saldo final</span>
                  <span className="font-bold text-base tracking-[0.14px] bg-gradient-to-r from-[#78B60F] to-[#6D96E4] bg-clip-text text-transparent max-sm:text-sm">
                    {balance}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>;
  }

  // ... keep existing code (original layout for faturamento tab)
  return <section className="absolute w-full flex flex-col items-center bg-white h-[700px] pt-6 pb-[122px] px-4 rounded-[24px_24px_0px_0px] left-0 bottom-[82px] z-10 sm:px-[21px]">
      <div className="flex w-full flex-col items-end gap-6 max-w-[360px]">
        <header className="flex justify-between items-center w-full">
          <div>
            <h2 className="text-[#43464D] font-bold text-lg tracking-[0.01em] max-sm:text-base">
              Lançamentos
            </h2>
            <p className="text-[#43464D] font-medium text-base tracking-[0.01em] max-sm:text-sm">
              {month}
            </p>
          </div>
          <button onClick={onAddTransaction} className="w-10 h-10 flex items-center justify-center" aria-label="Adicionar lançamento">
            <PlusIcon className="w-10 h-10" />
          </button>
        </header>
          
        <div className="flex flex-col items-start gap-6 w-full">
          <div className="flex flex-col items-start gap-[5px] w-full">
            <div className="flex justify-between items-center w-full">
              <span className="text-[#5E626C] font-medium text-xs tracking-[0.1px]">
                Entradas
              </span>
              <div className="flex items-center gap-1">
                <span className="text-[#5E626C] font-medium text-xs tracking-[0.1px]">
                  Total
                </span>
                <span className="text-[#5E626C] font-bold text-xs tracking-[0.1px]">
                  {incomeTotal}
                </span>
              </div>
            </div>
            <div className="w-full h-px bg-[rgba(0,0,0,0.08)]" />
          </div>
            
          <div className="flex flex-col gap-4 w-full">
            {incomeTransactions.map(transaction => <TransactionItem key={transaction.id} title={transaction.title} description={transaction.description} amount={transaction.amount} type={transaction.type} onClick={() => handleTransactionClick(transaction)} showStatus={showStatus} status={transaction.status} onStatusChange={newStatus => handleStatusChange(transaction.id, newStatus)} />)}
          </div>
            
          <div className="flex flex-col items-start gap-[5px] w-full">
            <div className="flex justify-between items-center w-full">
              <span className="text-[#5E626C] font-medium text-xs tracking-[0.1px]">
                Saídas
              </span>
              <div className="flex items-center gap-1">
                <span className="text-[#5E626C] font-medium text-xs tracking-[0.1px]">
                  Total
                </span>
                <span className="text-[#5E626C] font-bold text-xs tracking-[0.1px]">
                  {expenseTotal}
                </span>
              </div>
            </div>
            <div className="w-full h-px bg-[rgba(0,0,0,0.08)]" />
          </div>
            
          <div className="flex flex-col gap-4 w-full">
            {expenseTransactions.map(transaction => <TransactionItem key={transaction.id} title={transaction.title} description={transaction.description} amount={transaction.amount} type={transaction.type} onClick={() => handleTransactionClick(transaction)} showStatus={showStatus} status={transaction.status} onStatusChange={newStatus => handleStatusChange(transaction.id, newStatus)} />)}
          </div>
            
          <div className="flex flex-col items-start gap-[5px] w-full">
            <div className="flex justify-between items-center w-full">
              <span className="text-[#5E626C] font-medium text-xs tracking-[0.1px]">
                Resultado
              </span>
              <div className="flex w-0 h-3 items-center gap-1" />
            </div>
            <div className="w-full h-px bg-[rgba(0,0,0,0.08)]" />
          </div>
            
          <div className="flex justify-center items-start gap-4 w-full py-0 sm:gap-8 px-0">
            <div className="flex flex-col items-start gap-2">
              <div className="flex flex-col items-start">
                <span className="text-[#43464D] font-medium text-base tracking-[0.14px] max-sm:text-sm">
                  Entrada
                </span>
                <span className="font-bold text-base tracking-[0.14px] bg-gradient-to-r from-[#78B60F] to-[#6D96E4] bg-clip-text text-transparent max-sm:text-sm">
                  {entryTotal}
                </span>
              </div>
            </div>
            <div className="w-5 h-0 bg-[rgba(0,0,0,0.08)] sm:w-9" />
            <div className="flex flex-col items-start gap-2">
              <div className="flex flex-col items-start">
                <span className="text-[#43464D] font-medium text-base tracking-[0.14px] max-sm:text-sm">
                  Saída
                </span>
                <span className="font-bold text-base tracking-[0.14px] bg-gradient-to-r from-[#7637EA] to-[#FF7A00] bg-clip-text text-transparent max-sm:text-sm">
                  {exitTotal}
                </span>
              </div>
            </div>
            <div className="w-5 h-0 bg-[rgba(0,0,0,0.08)] sm:w-9" />
            <div className="flex flex-col items-start gap-2">
              <div className="flex flex-col items-start">
                <span className="text-[#43464D] font-medium text-base tracking-[0.14px] max-sm:text-sm">
                  Saldo
                </span>
                <span className="font-bold text-base tracking-[0.14px] bg-gradient-to-r from-[#78B60F] to-[#6D96E4] bg-clip-text text-transparent max-sm:text-sm">
                  {balance}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>;
};