import { useState } from 'react';
import type { ViewMode, CategoryType, Transaction } from '../types';
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
  const [transactions, setTransactions] = useState(mockTransactions);
  const [budgets, setBudgets] = useState(defaultBudgets);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<'all' | 'income' | 'expense'>('all');
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    category: 'food' as CategoryType,
    type: 'expense' as 'income' | 'expense',
    date: new Date().toISOString().split('T')[0]
  });

  const handleExportPdf = async () => {
    await exportDashboardPdf(transactions, budgets, 'dashboard-content');
  };

  const handleClick = () => {
    setShowAddForm(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'amount' ? parseFloat(value) || 0 : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingId) {
      setTransactions(prev => prev.map(t => 
        t.id === editingId 
          ? { ...t, ...formData, amount: Number(formData.amount) }
          : t
      ));
      setEditingId(null);
    } else {
      const newTransaction: Transaction = {
        id: Date.now().toString(),
        description: formData.description,
        amount: Number(formData.amount),
        category: formData.category,
        type: formData.type,
        date: formData.date
      };
      setTransactions(prev => [...prev, newTransaction]);
    }
    
    setFormData({
      description: '',
      amount: '',
      category: 'food',
      type: 'expense',
      date: new Date().toISOString().split('T')[0]
    });
    setShowAddForm(false);
  };

  const handleEdit = (id: string) => {
    const transaction = transactions.find(t => t.id === id);
    if (transaction) {
      setFormData({
        description: transaction.description,
        amount: transaction.amount.toString(),
        category: transaction.category,
        type: transaction.type,
        date: transaction.date
      });
      setEditingId(id);
      setShowAddForm(true);
    }
  };

  const handleDelete = (id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  const handleBudgetChange = (category: CategoryType, value: number) => {
    setBudgets(prev => prev.map(b => 
      b.category === category ? { ...b, budget: value } : b
    ));
  };

  return (
    <div className="dashboard">
      <Header onExportPdf={handleExportPdf} />
      <div id="dashboard-content" className="dashboard-content">
        <div className="dashboard-controls">
          <ViewToggle viewMode={viewMode} onViewModeChange={setViewMode} />
          <button className="btn btn-save" onClick={handleClick}>
            + Add Transaction
          </button>
        </div>

        {showAddForm && (
          <div className="modal-overlay" onClick={() => setShowAddForm(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>{editingId ? 'Edit Transaction' : 'Add New Transaction'}</h2>
                <button className="modal-close" onClick={() => setShowAddForm(false)}>×</button>
              </div>
              <form onSubmit={handleSubmit} className="transaction-form">
                <div className="form-group">
                  <label htmlFor="description">Description</label>
                  <input
                    type="text"
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Enter description"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="amount">Amount ($)</label>
                  <input
                    type="number"
                    id="amount"
                    name="amount"
                    value={formData.amount}
                    onChange={handleInputChange}
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="category">Category</label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                  >
                    <option value="food">Food</option>
                    <option value="transportation">Transportation</option>
                    <option value="entertainment">Entertainment</option>
                    <option value="housing">Housing</option>
                    <option value="utilities">Utilities</option>
                    <option value="healthcare">Healthcare</option>
                    <option value="shopping">Shopping</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="type">Type</label>
                  <select
                    id="type"
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                  >
                    <option value="expense">Expense</option>
                    <option value="income">Income</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="date">Date</label>
                  <input
                    type="date"
                    id="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-actions">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowAddForm(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    {editingId ? 'Update' : 'Add'} Transaction
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <SummaryCards 
          transactions={transactions} 
          viewMode={viewMode} 
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
        />
        <div className="dashboard-grid">
          <BudgetProgress transactions={transactions} budgets={budgets} viewMode={viewMode} />
          <ExpenseChart transactions={transactions} viewMode={viewMode} />
        </div>
        <TransactionList 
          transactions={activeFilter === 'all' ? transactions : transactions.filter(t => t.type === activeFilter)} 
          viewMode={viewMode}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>
    </div>
  );
}