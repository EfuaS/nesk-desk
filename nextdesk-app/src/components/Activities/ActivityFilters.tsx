/**
 * @file ActivityFilters.tsx
 * Date & Status filter dropdowns for the activities table.
 *
 * Each dropdown applies the `active-filter` CSS class when a
 * non-default value is selected, providing visual feedback.
 */

import type { DateFilterValue, StatusFilterValue } from '../../types/dashboard';

interface ActivityFiltersProps {
  /** Current date filter value. */
  dateFilter: DateFilterValue;
  /** Current status filter value. */
  statusFilter: StatusFilterValue;
  /** Callback when the date filter changes. */
  onDateFilterChange: (value: DateFilterValue) => void;
  /** Callback when the status filter changes. */
  onStatusFilterChange: (value: StatusFilterValue) => void;
}

export default function ActivityFilters({
  dateFilter,
  statusFilter,
  onDateFilterChange,
  onStatusFilterChange,
}: ActivityFiltersProps) {
  return (
    <div className="activity-filters">
      <span className="activity-filter-label">Filter:</span>

      {/* ── Date & Time filter ─────────────────────── */}
      <div className="filter-dropdown-wrap">
        <svg
          className="filter-dropdown-icon"
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
          id="dateTimeFilter"
          className={`filter-select${dateFilter !== 'all' ? ' active-filter' : ''}`}
          value={dateFilter}
          onChange={(e) => onDateFilterChange(e.target.value as DateFilterValue)}
        >
          <option value="all">Date &amp; Time</option>
          <option value="today">Today</option>
          <option value="yesterday">Yesterday</option>
          <option value="last7">Last 7 Days</option>
          <option value="last30">Last 30 Days</option>
          <option value="older">Older</option>
        </select>
      </div>

      {/* ── Status filter ──────────────────────────── */}
      <div className="filter-dropdown-wrap">
        <svg
          className="filter-dropdown-icon"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        >
          <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
        </svg>
        <select
          id="statusFilter"
          className={`filter-select${statusFilter !== 'all' ? ' active-filter' : ''}`}
          value={statusFilter}
          onChange={(e) => onStatusFilterChange(e.target.value as StatusFilterValue)}
        >
          <option value="all">Status</option>
          <option value="Open">Open</option>
          <option value="Pending">Pending</option>
          <option value="Close">Close</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
          <option value="Approved">Approved</option>
        </select>
      </div>
    </div>
  );
}
