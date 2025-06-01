
import { Transaction, Discount } from '@/types/transaction';

export const MONTHS = [
  "JAN 25", "FEV 25", "MAR 25", "ABR 25", 
  "MAI 25", "JUN 25", "JUL 25", "AGO 25", 
  "SET 25", "OUT 25", "NOV 25", "DEZ 25"
];

export const MOCK_DISCOUNTS: Discount[] = [
  {
    id: "1",
    title: "INSS",
    amount: "R$ 1.302,00",
    description: "Desconto previdenciário",
    fontWeight: "bold"
  },
  {
    id: "2", 
    title: "IRRF",
    amount: "R$ 892,50",
    description: "Imposto de renda retido na fonte",
    fontWeight: "extrabold"
  },
  {
    id: "3",
    title: "ISS",
    amount: "R$ 525,00", 
    description: "Imposto sobre serviços",
    fontWeight: "bold"
  },
  {
    id: "4",
    title: "PIS/COFINS",
    amount: "R$ 315,75",
    description: "Contribuições sociais",
    fontWeight: "bold"
  }
];

export const MOCK_INCOME_TRANSACTIONS: Transaction[] = [
  {
    id: "income-1",
    title: "Projeto Website",
    description: "Desenvolvimento de site corporativo",
    amount: "R$ 8.500,00",
    type: "income"
  },
  {
    id: "income-2", 
    title: "Consultoria UX",
    description: "Consultoria em experiência do usuário",
    amount: "R$ 2.000,00",
    type: "income"
  }
];

export const MOCK_EXPENSE_TRANSACTIONS: Transaction[] = [
  {
    id: "expense-1",
    title: "Software Adobe",
    description: "Assinatura mensal Creative Cloud",
    amount: "R$ 180,00",
    type: "expense"
  },
  {
    id: "expense-2",
    title: "Hospedagem",
    description: "Servidor e domínio",
    amount: "R$ 89,90", 
    type: "expense"
  },
  {
    id: "expense-3",
    title: "Internet",
    description: "Plano de internet fibra",
    amount: "R$ 120,00",
    type: "expense"
  }
];
