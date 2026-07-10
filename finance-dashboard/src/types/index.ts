export interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  category: CategoryType;
  type: 'income' | 'expense';
}

export type CategoryType = 'food' | 'transportation' | 'entertainment' | 'housing' | 'utilities' | 'healthcare' | 'shopping' | 'other';

export interface CategoryBudget {
  category: CategoryType;
  budget: number;
  spent: number;
  color: string;
  icon: string;
}

export interface BudgetSummary {
  totalBudget: number;
  totalSpent: number;
  remaining: number;
  percentageUsed: number;
}

export interface MonthlyData {
  month: string;
  year: number;
  income: number;
  expenses: number;
  categories: Record<CategoryType, number>;
}

export type ViewMode = 'monthly' | 'yearly';

export interface CategoryMeta {
  label: string;
  color: string;
  icon: string;
}

export const CATEGORY_METADATA: Record<CategoryType, CategoryMeta> = {
  food: { label: 'Food', color: '#FF6384', icon: '🍔' },
  transportation: { label: 'Transportation', color: '#36A2EB', icon: '🚗' },
  entertainment: { label: 'Entertainment', color: '#FFCE56', icon: '🎬' },
  housing: { label: 'Housing', color: '#4BC0C0', icon: '🏠' },
  utilities: { label: 'Utilities', color: '#9966FF', icon: '💡' },
  healthcare: { label: 'Healthcare', color: '#FF9F40', icon: '🏥' },
  shopping: { label: 'Shopping', color: '#C9CBCF', icon: '🛍️' },
  other: { label: 'Other', color: '#7BC8A4', icon: '📦' },
};