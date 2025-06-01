
export interface Transaction {
  id: string;
  title: string;
  description: string;
  amount: string;
  type: 'income' | 'expense';
}

export interface Discount {
  id: string;
  title: string;
  amount: string;
  description: string;
  fontWeight?: 'bold' | 'extrabold';
  type?: 'income' | 'expense';
}
