/**
 * @file ActivitiesSection.tsx
 * Top-level container for the activities table section.
 *
 * Composes: header, ActivityTabs, ActivityFilters, TableLoader,
 * and ActivityTable. Uses the `useActivities` hook for all state
 * management and Dataverse data fetching.
 */

import { useActivities } from '../../hooks/useActivities';
import { TableLoader } from '../Loader/Loader';
import ActivityTabs from './ActivityTabs';
import ActivityFilters from './ActivityFilters';
import ActivityTable from './ActivityTable';
import './Activities.css';

export default function ActivitiesSection() {
  const {
    activeTab,
    statusFilter,
    dateFilter,
    displayActivities,
    filteredCount,
    loading,
    setActiveTab,
    setStatusFilter,
    setDateFilter,
    refreshTable,
  } = useActivities();

  return (
    <section className="activities-section" id="activitiesSection">
      {/* ── Header ───────────────────────────────── */}
      <div className="activities-header">
        <div className="activities-header-left">
          <h2>Activities</h2>
          <p>All module activity log</p>
        </div>
        <button className="activities-refresh-btn" id="tableRefreshBtn" onClick={refreshTable}>
          Refresh
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="23 4 23 10 17 10" />
            <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
          </svg>
        </button>
      </div>

      {/* ── Tabs + Filters row ───────────────────── */}
      <div className="activities-tabs-row">
        <ActivityTabs activeTab={activeTab} onTabChange={setActiveTab} />
        <ActivityFilters
          dateFilter={dateFilter}
          statusFilter={statusFilter}
          onDateFilterChange={setDateFilter}
          onStatusFilterChange={setStatusFilter}
        />
      </div>

      {/* ── Table loader overlay ─────────────────── */}
      <TableLoader visible={loading} />

      {/* ── Data table ───────────────────────────── */}
      <ActivityTable
        activities={displayActivities}
        activeTab={activeTab}
        filteredCount={filteredCount}
      />
    </section>
  );
}
