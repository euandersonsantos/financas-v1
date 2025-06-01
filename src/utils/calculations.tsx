
import { Database } from '@/integrations/supabase/types';

type Transaction = Database['public']['Tables']['transactions']['Row'];

export const formatCurrency = (value: number): string => {
  return `R$ ${value.toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })}`;
};

export const calculateTotals = (transactions: Transaction[]) => {
  const income = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const expenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
  
  return {
    income,
    expenses,
    balance: income - expenses
  };
};

export const getDiscountCards = (transactions: Transaction[], isClosingTab = false) => {
  const expenseTransactions = transactions.filter(t => t.type === 'expense');
  
  return expenseTransactions.map(transaction => ({
    id: transaction.id,
    title: transaction.title,
    amount: formatCurrency(transaction.amount),
    description: transaction.description || '',
    fontWeight: transaction.category === 'pro_labore' ? 'bold' as const : 'extrabold' as const,
    type: 'expense' as const,
    category: transaction.category,
    status: transaction.status
  }));
};

export const groupTransactionsByDate = (transactions: Transaction[]) => {
  const grouped = transactions.reduce((acc, transaction) => {
    const date = transaction.due_date || '2025-07-25';
    const formattedDate = formatDateToBrazilian(date);
    
    if (!acc[formattedDate]) {
      acc[formattedDate] = [];
    }
    acc[formattedDate].push(transaction);
    return acc;
  }, {} as Record<string, Transaction[]>);

  // Sort dates
  const sortedEntries = Object.entries(grouped).sort(([dateA], [dateB]) => {
    const dayA = parseInt(dateA.split(' ')[0]);
    const dayB = parseInt(dateB.split(' ')[0]);
    return dayA - dayB;
  });

  return Object.fromEntries(sortedEntries);
};

export const formatDateToBrazilian = (dateString: string): string => {
  const date = new Date(dateString);
  const day = date.getDate();
  const months = [
    'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun',
    'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'
  ];
  const month = months[date.getMonth()];
  const year = date.getFullYear();
  
  return `${day} de ${month} ${year}`;
};

export const calculateDailyBalance = (
  date: string, 
  transactions: Transaction[], 
  initialBalance: number
): string => {
  // Get all dates and sort them
  const allDates = [...new Set(transactions.map(t => 
    formatDateToBrazilian(t.due_date || '2025-07-25')
  ))].sort((a, b) => {
    const dayA = parseInt(a.split(' ')[0]);
    const dayB = parseInt(b.split(' ')[0]);
    return dayA - dayB;
  });

  const dateIndex = allDates.indexOf(date);
  let balance = initialBalance;

  // Calculate balance up to the current date
  for (let i = 0; i <= dateIndex; i++) {
    const dateTransactions = transactions.filter(t => 
      formatDateToBrazilian(t.due_date || '2025-07-25') === allDates[i]
    );
    
    dateTransactions.forEach(transaction => {
      if (transaction.type === 'income') {
        balance += transaction.amount;
      } else {
        balance -= transaction.amount;
      }
    });
  }

  return formatCurrency(balance);
};
