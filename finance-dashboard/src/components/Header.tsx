import { useTheme } from '../context/ThemeContext';

interface HeaderProps {
  onExportPdf: () => void;
}

export function Header({ onExportPdf }: HeaderProps) {
  const { darkMode, toggleDarkMode } = useTheme();

  return (
    <header className="header">
      <div className="header-left">
        <h1 className="header-title">💰 Finance Dashboard</h1>
        <p className="header-subtitle">Personal Expense Tracker</p>
      </div>
      <div className="header-right">
        <button className="btn btn-export" onClick={onExportPdf}>
          📄 Export PDF
        </button>
        <button className="btn btn-theme" onClick={toggleDarkMode}>
          {darkMode ? '☀️ Light' : '🌙 Dark'}
        </button>
      </div>
    </header>
  );
}