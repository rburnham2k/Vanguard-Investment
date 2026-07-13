import type { Transaction, ViewMode } from '../types';

type FilterType = 'all' | 'income' | 'expense';

interface SummaryCardsProps {
  transactions: Transaction[];
  viewMode: ViewMode;
  activeFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
}

export function SummaryCards({ transactions, viewMode, activeFilter, onFilterChange }: SummaryCardsProps) {
  const now = new Date();
  const currentMonth = String(now.getMonth() + 1).padStart(2, '0');
  const currentYear = now.getFullYear();

  const filtered = transactions.filter(t => {
    const [y, m] = t.date.split('-');
    if (viewMode === 'monthly') return y === String(currentYear) && m === currentMonth;
    if (viewMode === 'yearly') return y === String(currentYear);
    return true;
  });

  const totalIncome = filtered.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const totalExpenses = filtered.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
  const netSavings = totalIncome - totalExpenses;
  const transactionCount = filtered.length;

  return (
    <div className="summary-cards">
      <div 
        className={`summary-card income-card ${activeFilter === 'income' ? 'summary-card-active' : ''}`}
        onClick={() => onFilterChange('income')}
      >
        <div className="summary-icon">💰</div>
        <div className="summary-info">
          <span className="summary-label">Income</span>
          <span className="summary-value">+${totalIncome.toLocaleString()}</span>
        </div>
      </div>
      <div 
        className={`summary-card expense-card ${activeFilter === 'expense' ? 'summary-card-active' : ''}`}
        onClick={() => onFilterChange('expense')}
      >
        <div className="summary-icon">💳</div>
        <div className="summary-info">
          <span className="summary-label">Expenses</span>
          <span className="summary-value">-${totalExpenses.toLocaleString()}</span>
        </div>
      </div>
      <div 
        className={`summary-card savings-card ${activeFilter === 'all' && netSavings !== 0 ? 'summary-card-active' : ''}`}
        onClick={() => onFilterChange('all')}
      >
        <div className="summary-icon">🏦</div>
        <div className="summary-info">
          <span className="summary-label">Net Savings</span>
          <span className={`summary-value ${netSavings >= 0 ? 'positive' : 'negative'}`}>
            {netSavings >= 0 ? '+' : ''}${netSavings.toLocaleString()}
          </span>
        </div>
      </div>
      <div className="summary-card count-card">
        <div className="summary-icon">📝</div>
        <div className="summary-info">
          <span className="summary-label">Transactions</span>
          <span className="summary-value">{transactionCount}</span>
        </div>
      </div>
    </div>
  );
}
