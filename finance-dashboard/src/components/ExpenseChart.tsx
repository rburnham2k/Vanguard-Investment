import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, PointElement, LineElement } from 'chart.js';
import { Doughnut, Bar, Line } from 'react-chartjs-2';
import type { Transaction, MonthlyData, ViewMode } from '../types';
import { CATEGORY_METADATA, type CategoryType } from '../types';
import { getMonthlyData, getMonthName } from '../data/mockData';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, PointElement, LineElement);

interface ExpenseChartProps {
  transactions: Transaction[];
  viewMode: ViewMode;
}

export function ExpenseChart({ transactions, viewMode }: ExpenseChartProps) {
  const monthlyData = getMonthlyData(transactions);

  // Category breakdown (current month or all)
  const now = new Date();
  const currentMonth = String(now.getMonth() + 1).padStart(2, '0');
  const currentYear = now.getFullYear();

  const filteredTransactions = transactions.filter(t => {
    const [y, m] = t.date.split('-');
    if (viewMode === 'monthly') return y === String(currentYear) && m === currentMonth;
    return true;
  });

  // Doughnut - expenses by category
  const categoryTotals: Record<string, number> = {};
  for (const t of filteredTransactions) {
    if (t.type === 'expense') {
      categoryTotals[t.category] = (categoryTotals[t.category] || 0) + t.amount;
    }
  }

  const doughnutData = {
    labels: Object.keys(categoryTotals).map(cat => CATEGORY_METADATA[cat as CategoryType]?.label || cat),
    datasets: [
      {
        data: Object.values(categoryTotals),
        backgroundColor: Object.keys(categoryTotals).map(cat => CATEGORY_METADATA[cat as CategoryType]?.color || '#999'),
        borderColor: '#fff',
        borderWidth: 2,
        hoverOffset: 8,
      },
    ],
  };

  // Line chart - monthly trend
  const lineLabels = monthlyData.map(d => `${getMonthName(d.month)} ${d.year}`);
  const lineData = {
    labels: lineLabels,
    datasets: [
      {
        label: 'Income',
        data: monthlyData.map(d => d.income),
        borderColor: '#4BC0C0',
        backgroundColor: 'rgba(75, 192, 192, 0.1)',
        tension: 0.4,
        fill: true,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
      {
        label: 'Expenses',
        data: monthlyData.map(d => d.expenses),
        borderColor: '#FF6384',
        backgroundColor: 'rgba(255, 99, 132, 0.1)',
        tension: 0.4,
        fill: true,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };

  // Bar chart - category comparison
  const barLabels = Object.keys(categoryTotals).map(cat => CATEGORY_METADATA[cat as CategoryType]?.label || cat);
  const barColors = Object.keys(categoryTotals).map(cat => CATEGORY_METADATA[cat as CategoryType]?.color || '#999');

  const barData = {
    labels: barLabels,
    datasets: [
      {
        label: 'Amount ($)',
        data: Object.values(categoryTotals),
        backgroundColor: barColors,
        borderRadius: 6,
        borderSkipped: false,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          padding: 16,
          usePointStyle: true,
          font: { size: 12 },
        },
      },
    },
  };

  const lineOptions: any = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      intersect: false,
      mode: 'index',
    },
    plugins: {
      legend: {
        position: 'top',
        labels: {
          padding: 16,
          usePointStyle: true,
          font: { size: 12 },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(tickValue: string | number) {
            return '$' + Number(tickValue).toLocaleString();
          },
        },
      },
    },
  };

  const barOptions: any = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(tickValue: string | number) {
            return '$' + Number(tickValue).toLocaleString();
          },
        },
      },
    },
  };

  return (
    <div className="charts-grid">
      <div className="card chart-card">
        <h2 className="card-title">
          🍩 Expense by Category
          {viewMode === 'monthly' && <span className="badge">This Month</span>}
        </h2>
        <div className="chart-wrapper">
          <Doughnut data={doughnutData} options={chartOptions} />
        </div>
      </div>
      <div className="card chart-card">
        <h2 className="card-title">📈 Monthly Trend</h2>
        <div className="chart-wrapper">
          <Line data={lineData} options={lineOptions} />
        </div>
      </div>
      <div className="card chart-card chart-full">
        <h2 className="card-title">📊 Category Comparison</h2>
        <div className="chart-wrapper">
          <Bar data={barData} options={barOptions} />
        </div>
      </div>
    </div>
  );
}