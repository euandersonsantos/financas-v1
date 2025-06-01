
export const MONTHS = [
  'JAN 25', 'FEV 25', 'MAR 25', 'ABR 25', 'MAI 25', 'JUN 25', 
  'JUL 25', 'AGO 25', 'SET 25', 'OUT 25', 'NOV 25', 'DEZ 25', 
  'JAN 26', 'FEV 26', 'MAR 26', 'ABR 26', 'MAI 26', 'JUN 26'
];

export const MOCK_DISCOUNTS = [
  {
    id: '1',
    title: 'Pró-Labore',
    amount: 'R$ 2.950,50',
    description: '100% do faturamento',
    fontWeight: 'bold' as const,
    type: 'expense' as const
  },
  {
    id: '2',
    title: 'DAS - SN',
    amount: 'R$ 630,00',
    description: '6% do faturamento',
    fontWeight: 'extrabold' as const,
    type: 'expense' as const
  },
  {
    id: '3',
    title: 'INSS',
    amount: 'R$ 324,55',
    description: '11% do pró-labore',
    fontWeight: 'extrabold' as const,
    type: 'expense' as const
  },
  {
    id: '4',
    title: 'Despesas',
    amount: 'R$ 112,13',
    description: 'Outras despesas',
    fontWeight: 'extrabold' as const,
    type: 'expense' as const
  }
];

export const MOCK_INCOME_TRANSACTIONS = [
  {
    id: '1',
    title: 'Salário',
    description: 'Sensorama Design',
    amount: 'R$ 10.500,00',
    type: 'income' as const
  }
];

export const MOCK_EXPENSE_TRANSACTIONS = [
  {
    id: '1',
    title: 'Pró-labore',
    description: '100% do faturamento',
    amount: 'R$ 2.950,50',
    type: 'expense' as const
  },
  {
    id: '2',
    title: 'DAS - Simples nacional',
    description: '6% do faturamento',
    amount: 'R$ 630,00',
    type: 'expense' as const
  },
  {
    id: '3',
    title: 'INSS',
    description: '11% do pro-labore',
    amount: 'R$ 324,55',
    type: 'expense' as const
  },
  {
    id: '4',
    title: 'Despesas',
    description: 'Outras despesas',
    amount: 'R$ 112,13',
    type: 'expense' as const
  }
];
