/**
 * @file PageHeader.tsx
 * Page title, subtitle, date-period select, and refresh button.
 *
 * Props:
 *  - loading: shows the spinning state on the refresh button
 *  - onRefresh: callback triggered when the user clicks "Refresh"
 *  - onDatePeriodChange: callback when the date period dropdown changes
 */

import './PageHeader.css';

interface PageHeaderProps {
  /** Whether a data refresh is in progress (spins the refresh icon). */
  loading: boolean;
  /** Callback to trigger a full dashboard data refresh. */
  onRefresh: () => void;
  /** Callback when the user changes the date period dropdown. */
  onDatePeriodChange?: (value: string) => void;
}

export default function PageHeader({ loading, onRefresh, onDatePeriodChange }: PageHeaderProps) {
  return (
    <div className="page-header">
      {/* ── Title + subtitle ─────────────────────── */}
      <div className="page-header-left">
        <h1>NextDesk Command Center</h1>
        <p>Operational overview across all modules</p>
      </div>

      {/* ── Actions: date filter + refresh ────────── */}
      <div className="page-header-actions">
        {/* Date period dropdown */}
        <div className="date-filter-wrap">
          <svg
            className="date-filter-icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="3" y="4" width="18" height="18" rx="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
          <select
            id="datePeriodSelect"
            className="date-period-select"
            defaultValue="7d"
            onChange={(e) => onDatePeriodChange?.(e.target.value)}
          >
            <option value="7d">Last 7 Days</option>
            <option value="14d">Last 14 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="3m">Last 3 Months</option>
            <option value="6m">Last 6 Months</option>
            <option value="1y">Last 1 Year</option>
          </select>
        </div>

        {/* Refresh button */}
        <button
          className={`refresh-btn${loading ? ' spinning' : ''}`}
          id="headerRefreshBtn"
          onClick={onRefresh}
        >
          Refresh
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="23 4 23 10 17 10" />
            <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
          </svg>
        </button>
      </div>
    </div>
  );
}
