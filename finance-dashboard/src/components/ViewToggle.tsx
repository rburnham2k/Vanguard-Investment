import type { ViewMode } from '../types';

interface ViewToggleProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
}

export function ViewToggle({ viewMode, onViewModeChange }: ViewToggleProps) {
  return (
    <div className="view-toggle">
      <button
        className={`toggle-btn ${viewMode === 'monthly' ? 'active' : ''}`}
        onClick={() => onViewModeChange('monthly')}
      >
        📅 Monthly
      </button>
      <button
        className={`toggle-btn ${viewMode === 'yearly' ? 'active' : ''}`}
        onClick={() => onViewModeChange('yearly')}
      >
        📆 Yearly
      </button>
    </div>
  );
}