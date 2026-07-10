import { useState } from 'react';
import type { ViewMode } from '../types';
import { mockTransactions, defaultBudgets } from '../data/mockData';
import { exportDashboardPdf } from '../utils/exportPdf';
import { Header } from './Header';
import { ViewToggle } from './ViewToggle';
import { SummaryCards } from './SummaryCards';
import { BudgetProgress } from './BudgetProgress';
import { ExpenseChart } from './ExpenseChart';
import { TransactionList } from './TransactionList';

export function Dashboard() {
  const [viewMode, setViewMode] = useState<ViewMode>('monthly');
  const [transactions] = useState(mockTransactions);
  const [budgets] = useState(defaultBudgets);

  const handleExportPdf = async () => {
    await exportDashboardPdf(transactions, budgets, 'dashboard-content');
  };

  return (
    <div className="dashboard">
      <Header onExportPdf={handleExportPdf} />
      <div id="dashboard-content" className="dashboard-content">
        <div className="dashboard-controls">
          <ViewToggle viewMode={viewMode} onViewModeChange={setViewMode} />
        </div>
        <SummaryCards transactions={transactions} viewMode={viewMode} />
        <div className="dashboard-grid">
          <BudgetProgress transactions={transactions} budgets={budgets} viewMode={viewMode} />
          <ExpenseChart transactions={transactions} viewMode={viewMode} />
        </div>
        <TransactionList transactions={transactions} viewMode={viewMode} />
      </div>
    </div>
  );
}