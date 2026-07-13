import type { Transaction, ViewMode } from '../types';
import { CATEGORY_METADATA } from '../types';

interface TransactionListProps {
  transactions: Transaction[];
  viewMode: ViewMode;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export function TransactionList({ transactions, viewMode, onEdit, onDelete }: TransactionListProps) {
  const now = new Date();
  const currentMonth = String(now.getMonth() + 1).padStart(2, '0');
  const currentYear = now.getFullYear();

  const filtered = transactions.filter(t => {
    const [y, m] = t.date.split('-');
    if (viewMode === 'monthly') return y === String(currentYear) && m === currentMonth;
    if (viewMode === 'yearly') return y === String(currentYear);
    return true;
  });

  const sorted = [...filtered].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <div className="card transaction-list">
      <h2 className="card-title">📋 Recent Transactions</h2>
      <div className="transaction-table-wrapper">
        <table className="transaction-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Description</th>
              <th>Category</th>
              <th>Amount</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {sorted.length === 0 ? (
              <tr>
                <td colSpan={4} className="empty-state">No transactions found</td>
              </tr>
            ) : (
              sorted.map(t => {
                const meta = CATEGORY_METADATA[t.category];
                return (
                  <tr key={t.id} className={t.type === 'income' ? 'row-income' : 'row-expense'}>
                    <td className="td-date">{t.date}</td>
                    <td className="td-desc">{t.description}</td>
                    <td>
                      <span className="category-tag" style={{ backgroundColor: meta?.color + '22', color: meta?.color }}>
                        {meta?.icon} {meta?.label}
                      </span>
                    </td>
                    <td className={`td-amount ${t.type === 'income' ? 'amount-income' : 'amount-expense'}`}>
                      {t.type === 'income' ? '+' : '-'}${t.amount.toFixed(2)}
                    </td>
                    <td className="td-actions">
                      <button className="btn-action btn-edit" onClick={() => onEdit(t.id)} title="Edit">
                        ✏️
                      </button>
                      <button className="btn-action btn-delete" onClick={() => onDelete(t.id)} title="Delete">
                        🗑️
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}