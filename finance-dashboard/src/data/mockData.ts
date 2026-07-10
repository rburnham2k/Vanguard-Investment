import type { Transaction, CategoryBudget, MonthlyData, CategoryType } from '../types';

export const mockTransactions: Transaction[] = [
  { id: '1', date: '2026-01-05', description: 'Grocery Store', amount: 156.42, category: 'food', type: 'expense' },
  { id: '2', date: '2026-01-07', description: 'Gas Station', amount: 45.00, category: 'transportation', type: 'expense' },
  { id: '3', date: '2026-01-10', description: 'Netflix Subscription', amount: 15.99, category: 'entertainment', type: 'expense' },
  { id: '4', date: '2026-01-12', description: 'Restaurant Dinner', amount: 67.80, category: 'food', type: 'expense' },
  { id: '5', date: '2026-01-15', description: 'Monthly Rent', amount: 1200.00, category: 'housing', type: 'expense' },
  { id: '6', date: '2026-01-18', description: 'Electric Bill', amount: 95.40, category: 'utilities', type: 'expense' },
  { id: '7', date: '2026-01-20', description: 'Uber Ride', amount: 23.50, category: 'transportation', type: 'expense' },
  { id: '8', date: '2026-01-22', description: 'Movie Tickets', amount: 32.00, category: 'entertainment', type: 'expense' },
  { id: '9', date: '2026-01-25', description: 'Pharmacy', amount: 28.75, category: 'healthcare', type: 'expense' },
  { id: '10', date: '2026-01-28', description: 'Online Shopping', amount: 89.99, category: 'shopping', type: 'expense' },
  { id: '11', date: '2026-01-31', description: 'Salary', amount: 5000.00, category: 'other', type: 'income' },
  { id: '12', date: '2026-02-03', description: 'Grocery Store', amount: 134.20, category: 'food', type: 'expense' },
  { id: '13', date: '2026-02-06', description: 'Gas Station', amount: 52.00, category: 'transportation', type: 'expense' },
  { id: '14', date: '2026-02-08', description: 'Concert Tickets', amount: 120.00, category: 'entertainment', type: 'expense' },
  { id: '15', date: '2026-02-10', description: 'Restaurant Lunch', amount: 42.50, category: 'food', type: 'expense' },
  { id: '16', date: '2026-02-15', description: 'Monthly Rent', amount: 1200.00, category: 'housing', type: 'expense' },
  { id: '17', date: '2026-02-18', description: 'Water Bill', amount: 45.30, category: 'utilities', type: 'expense' },
  { id: '18', date: '2026-02-20', description: 'Bus Pass', amount: 65.00, category: 'transportation', type: 'expense' },
  { id: '19', date: '2026-02-22', description: 'Streaming Services', amount: 25.98, category: 'entertainment', type: 'expense' },
  { id: '20', date: '2026-02-25', description: 'Doctor Visit', amount: 75.00, category: 'healthcare', type: 'expense' },
  { id: '21', date: '2026-02-28', description: 'Salary', amount: 5000.00, category: 'other', type: 'income' },
  { id: '22', date: '2026-03-02', description: 'Grocery Store', amount: 168.75, category: 'food', type: 'expense' },
  { id: '23', date: '2026-03-05', description: 'Gas Station', amount: 48.50, category: 'transportation', type: 'expense' },
  { id: '24', date: '2026-03-08', description: 'Game Purchase', amount: 59.99, category: 'entertainment', type: 'expense' },
  { id: '25', date: '2026-03-12', description: 'Restaurant Dinner', amount: 78.40, category: 'food', type: 'expense' },
  { id: '26', date: '2026-03-15', description: 'Monthly Rent', amount: 1200.00, category: 'housing', type: 'expense' },
  { id: '27', date: '2026-03-18', description: 'Internet Bill', amount: 79.99, category: 'utilities', type: 'expense' },
  { id: '28', date: '2026-03-20', description: 'Parking Fee', amount: 15.00, category: 'transportation', type: 'expense' },
  { id: '29', date: '2026-03-25', description: 'Clothing', amount: 120.00, category: 'shopping', type: 'expense' },
  { id: '30', date: '2026-03-28', description: 'Dental Checkup', amount: 50.00, category: 'healthcare', type: 'expense' },
  { id: '31', date: '2026-03-31', description: 'Salary', amount: 5000.00, category: 'other', type: 'income' },
  { id: '32', date: '2026-04-03', description: 'Grocery Store', amount: 145.30, category: 'food', type: 'expense' },
  { id: '33', date: '2026-04-07', description: 'Gas Station', amount: 55.00, category: 'transportation', type: 'expense' },
  { id: '34', date: '2026-04-10', description: 'Movie Night', amount: 28.00, category: 'entertainment', type: 'expense' },
  { id: '35', date: '2026-04-15', description: 'Monthly Rent', amount: 1200.00, category: 'housing', type: 'expense' },
  { id: '36', date: '2026-04-18', description: 'Phone Bill', amount: 85.00, category: 'utilities', type: 'expense' },
  { id: '37', date: '2026-04-22', description: 'Takeout', amount: 35.50, category: 'food', type: 'expense' },
  { id: '38', date: '2026-04-25', description: 'Office Supplies', amount: 22.99, category: 'shopping', type: 'expense' },
  { id: '39', date: '2026-04-28', description: 'Gym Membership', amount: 49.99, category: 'healthcare', type: 'expense' },
  { id: '40', date: '2026-04-30', description: 'Salary', amount: 5000.00, category: 'other', type: 'income' },
];

export const defaultBudgets: CategoryBudget[] = [
  { category: 'food', budget: 500, spent: 0, color: '#FF6384', icon: '🍔' },
  { category: 'transportation', budget: 200, spent: 0, color: '#36A2EB', icon: '🚗' },
  { category: 'entertainment', budget: 150, spent: 0, color: '#FFCE56', icon: '🎬' },
  { category: 'housing', budget: 1300, spent: 0, color: '#4BC0C0', icon: '🏠' },
  { category: 'utilities', budget: 300, spent: 0, color: '#9966FF', icon: '💡' },
  { category: 'healthcare', budget: 200, spent: 0, color: '#FF9F40', icon: '🏥' },
  { category: 'shopping', budget: 250, spent: 0, color: '#C9CBCF', icon: '🛍️' },
  { category: 'other', budget: 100, spent: 0, color: '#7BC8A4', icon: '📦' },
];

export function getMonthlyData(transactions: Transaction[]): MonthlyData[] {
  const monthlyMap = new Map<string, MonthlyData>();

  for (const t of transactions) {
    const [yearStr, monthStr] = t.date.split('-');
    const key = `${yearStr}-${monthStr}`;
    
    if (!monthlyMap.has(key)) {
      monthlyMap.set(key, {
        month: monthStr,
        year: parseInt(yearStr),
        income: 0,
        expenses: 0,
        categories: { food: 0, transportation: 0, entertainment: 0, housing: 0, utilities: 0, healthcare: 0, shopping: 0, other: 0 },
      });
    }

    const data = monthlyMap.get(key)!;
    if (t.type === 'income') {
      data.income += t.amount;
    } else {
      data.expenses += t.amount;
      data.categories[t.category] += t.amount;
    }
  }

  return Array.from(monthlyMap.values());
}

export function getCategoryTotals(transactions: Transaction[], category: CategoryType): number {
  return transactions
    .filter(t => t.category === category && t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
}

export function getMonthName(month: string): string {
  const names = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return names[parseInt(month) - 1] || month;
}