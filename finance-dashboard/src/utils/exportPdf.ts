import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import type { Transaction, CategoryBudget, CategoryType } from '../types';
import { CATEGORY_METADATA } from '../types';

export async function exportDashboardPdf(
  transactions: Transaction[],
  budgets: CategoryBudget[],
  elementId: string
): Promise<void> {
  const element = document.getElementById(elementId);
  if (!element) return;

  const canvas = await html2canvas(element, {
    backgroundColor: '#ffffff',
    scale: 2,
    useCORS: true,
    logging: false,
  });

  const imgData = canvas.toDataURL('image/png');
  const pdf = new jsPDF('p', 'mm', 'a4');
  const imgWidth = 210;
  const imgHeight = (canvas.height * imgWidth) / canvas.width;
  let heightLeft = imgHeight;
  let position = 0;

  pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
  heightLeft -= pdf.internal.pageSize.getHeight();

  while (heightLeft > 0) {
    position = heightLeft - imgHeight;
    pdf.addPage();
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pdf.internal.pageSize.getHeight();
  }

  pdf.save('finance-dashboard-report.pdf');
}

export function generateTextReport(transactions: Transaction[], budgets: CategoryBudget[]): string {
  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  let report = '========================================\n';
  report += '   PERSONAL FINANCE DASHBOARD REPORT\n';
  report += '========================================\n\n';
  report += `Period: Multiple Months\n`;
  report += `Total Income: $${totalIncome.toFixed(2)}\n`;
  report += `Total Expenses: $${totalExpenses.toFixed(2)}\n`;
  report += `Net Savings: $${(totalIncome - totalExpenses).toFixed(2)}\n\n`;

  report += '--- EXPENSES BY CATEGORY ---\n';
  const categoryTotals: Record<CategoryType, number> = {} as Record<CategoryType, number>;
  for (const t of transactions) {
    if (t.type === 'expense') {
      categoryTotals[t.category] = (categoryTotals[t.category] || 0) + t.amount;
    }
  }

  for (const [cat, total] of Object.entries(categoryTotals)) {
    const meta = CATEGORY_METADATA[cat as CategoryType];
    const budget = budgets.find(b => b.category === cat);
    const pct = budget ? ((total / budget.budget) * 100).toFixed(1) : 'N/A';
    report += `  ${meta?.label || cat}: $${total.toFixed(2)} (${pct}% of budget)\n`;
  }

  report += '\n--- BUDGET SUMMARY ---\n';
  for (const b of budgets) {
    const pct = b.budget > 0 ? ((b.spent / b.budget) * 100).toFixed(1) : '0.0';
    report += `  ${CATEGORY_METADATA[b.category]?.label || b.category}: $${b.spent.toFixed(2)} / $${b.budget.toFixed(2)} (${pct}%)\n`;
  }

  report += '\n========================================\n';
  report += '   END OF REPORT\n';
  report += '========================================\n';

  return report;
}