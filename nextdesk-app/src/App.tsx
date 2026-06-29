/**
 * @file App.tsx
 * Root application component — assembles the full dashboard layout.
 *
 * Structure:
 *   <Navbar />                (fixed top bar)
 *   <div.app-layout>
 *     <main.main-content>
 *       <PageLoader />        (full-page loading overlay)
 *       <PageHeader />        (title + date filter + refresh)
 *       <KpiGrid />           (5 KPI summary cards)
 *       <ChartsGrid />        (bar charts + donut chart)
 *       <ActivitiesSection /> (tabbed activities table)
 *     </main>
 *   </div>
 *   <ErrorModal />            (dismissable error popup)
 *
 * Data flow:
 *   - `useDashboardData` hook manages KPI/chart data lifecycle
 *   - `ActivitiesSection` has its own `useActivities` hook internally
 */

import { useDashboardData } from './hooks/useDashboardData';
import Navbar from './components/Navbar/Navbar';
import PageHeader from './components/PageHeader/PageHeader';
import { PageLoader } from './components/Loader/Loader';
import KpiGrid from './components/KpiGrid/KpiGrid';
import ChartsGrid from './components/Charts/ChartsGrid';
import ActivitiesSection from './components/Activities/ActivitiesSection';
import ErrorModal from './components/ErrorModal/ErrorModal';

export default function App() {
  const { data, loading, error, refresh, clearError } = useDashboardData();

  return (
    <>
      {/* Fixed top navigation */}
      <Navbar />

      {/* Main layout wrapper (offset by navbar height) */}
      <div className="app-layout">
        <main className="main-content">
          {/* Full-page loading overlay */}
          <PageLoader visible={loading} />

          {/* Page header with date filter and refresh */}
          <PageHeader
            loading={loading}
            onRefresh={refresh}
            onDatePeriodChange={() => refresh()}
          />

          {/* KPI summary cards */}
          <KpiGrid kpis={data.kpis} />

          {/* Charts: bar charts + donut chart */}
          <ChartsGrid data={data} />

          {/* Activities table (has its own hook for tab-level data) */}
          <ActivitiesSection />
        </main>
      </div>

      {/* Error modal — auto-dismisses after 8 seconds */}
      <ErrorModal message={error} onClose={clearError} />
    </>
  );
}
