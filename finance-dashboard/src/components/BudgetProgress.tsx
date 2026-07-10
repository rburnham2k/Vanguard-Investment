import type { CategoryBudget, Transaction, ViewMode, CategoryType } from '../types';
import { CATEGORY_METADATA } from '../types';

interface BudgetProgressProps {
  budgets: CategoryBudget[];
  transactions: Transaction[];
  viewMode: ViewMode;
}

export function BudgetProgress({ budgets, transactions, viewMode }: BudgetProgressProps) {
  const now = new Date();
  const currentMonth = String(now.getMonth() + 1).padStart(2, '0');
  const currentYear = now.getFullYear();

  const filteredTransactions = transactions.filter(t => {
    const [y, m] = t.date.split('-');
    if (viewMode === 'monthly') return y === String(currentYear) && m === currentMonth;
    if (viewMode === 'yearly') return y === String(currentYear);
    return true;
  });

  const updatedBudgets = budgets.map(b => {
    const spent = filteredTransactions
      .filter(t => t.category === b.category && t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    return { ...b, spent };
  });

  const totalBudget = updatedBudgets.reduce((sum, b) => sum + b.budget, 0);
  const totalSpent = updatedBudgets.reduce((sum, b) => sum + b.spent, 0);
  const overallPct = totalBudget > 0 ? Math.min((totalSpent / totalBudget) * 100, 100) : 0;

  return (
    <div className="card budget-progress">
      <h2 className="card-title">📊 Budget Overview</h2>
      <div className="overall-progress">
        <div className="progress-label">
          <span>Total Budget</span>
          <span>${totalSpent.toLocaleString()} / ${totalBudget.toLocaleString()}</span>
        </div>
        <div className="progress-bar-container">
          <div
            className={`progress-bar ${overallPct >= 90 ? 'danger' : overallPct >= 75 ? 'warning' : 'safe'}`}
            style={{ width: `${overallPct}%` }}
          />
        </div>
        <span className="progress-percent">{overallPct.toFixed(1)}% used</span>
      </div>
      <div className="budget-categories">
        {updatedBudgets.map(b => {
          const pct = b.budget > 0 ? Math.min((b.spent / b.budget) * 100, 100) : 0;
          const meta = CATEGORY_METADATA[b.category];
          return (
            <div key={b.category} className="budget-item">
              <div className="budget-item-header">
                <span className="budget-category-label">
                  <span>{meta?.icon}</span>
                  <span>{meta?.label}</span>
                </span>
                <span className="budget-amount">
                  ${b.spent.toFixed(0)} / ${b.budget.toFixed(0)}
                </span>
              </div>
              <div className="progress-bar-container budget-bar">
                <div
                  className={`progress-bar ${pct >= 90 ? 'danger' : pct >= 75 ? 'warning' : 'safe'}`}
                  style={{ width: `${pct}%` }}
                />
              </div>
              <span className="budget-percent">{pct.toFixed(0)}%</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}