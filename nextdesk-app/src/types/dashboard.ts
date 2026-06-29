/**
 * @file dashboard.ts
 * Central type definitions for the NextDesk Command Center dashboard.
 * All data shapes flowing between the Dataverse service layer, hooks,
 * and UI components are defined here.
 */

// ────────────────────────────────────────────────────────────────
//  KPI Types
// ────────────────────────────────────────────────────────────────

/** Trend direction for KPIs that track period-over-period change. */
export type TrendDirection = 'up' | 'down';

/** KPI data for modules with a percentage trend (Service Requests, Incidents). */
export interface TrendKpi {
  value: number;
  changePercent: number;
  trend: TrendDirection;
}

/** KPI data for CIs — shows an "active %" rather than a trend arrow. */
export interface CiKpi {
  value: number;
  percentage: number;
}

/** KPI data for Changes — shows count of awaiting-approval items. */
export interface ChangeKpi {
  value: number;
  awaiting: number;
}

/** KPI data for Problems — shows count of critical items. */
export interface ProblemKpi {
  value: number;
  critical: number;
}

/** Aggregated KPI section of the dashboard. */
export interface KpiData {
  totalServiceRequests: TrendKpi;
  totalIncidents: TrendKpi;
  totalCIs: CiKpi;
  totalChanges: ChangeKpi;
  totalProblems: ProblemKpi;
}

// ────────────────────────────────────────────────────────────────
//  Chart Data Types
// ────────────────────────────────────────────────────────────────

/** Bar chart data for Service Requests — uses "completed" for the third bar. */
export interface ServiceRequestChartData {
  open: number;
  pending: number;
  completed: number;
}

/** Bar chart data for Incidents / Problems — uses "closed" for the third bar. */
export interface StatusChartData {
  open: number;
  pending: number;
  closed: number;
}

/** Donut chart data for CI Health. */
export interface CiHealthData {
  active: number;
  maintenance: number;
  retired: number;
}

// ────────────────────────────────────────────────────────────────
//  Activity Types
// ────────────────────────────────────────────────────────────────

/** A single row in the Recent Activities table. */
export interface ActivityRecord {
  id: string;
  activity: string;
  dateTime: string;
  status: string;
  user: string;
}

/** Tab filter keys — must match ACTIVITY_TABLE_REGISTRY keys. */
export type ActivityTabKey =
  | 'Service Request'
  | 'Incident'
  | 'CI'
  | 'Change'
  | 'Problem';

/** Date filter options for the activities table. */
export type DateFilterValue =
  | 'all'
  | 'today'
  | 'yesterday'
  | 'last7'
  | 'last30'
  | 'older';

/** Status filter — "all" plus every Dataverse status value the UI supports. */
export type StatusFilterValue =
  | 'all'
  | 'Open'
  | 'Pending'
  | 'Close'
  | 'In Progress'
  | 'Completed'
  | 'Approved';

// ────────────────────────────────────────────────────────────────
//  Dataverse Config Types
// ────────────────────────────────────────────────────────────────

/** Maps the UI column names to their Dataverse logical-column names. */
export interface ColumnMapping {
  id: string;
  activity: string;
  dateTime: string;
  status: string;
  user: string;
}

/**
 * Registry entry for a Dataverse table used by the activities section.
 * Each tab in the UI maps to one of these.
 */
export interface TableConfig {
  entitySetName: string;
  entityLogicalName: string;
  columns: ColumnMapping;
}

/** The full registry type — keyed by ActivityTabKey. */
export type ActivityTableRegistry = Record<ActivityTabKey, TableConfig>;

// ────────────────────────────────────────────────────────────────
//  Dashboard Aggregate
// ────────────────────────────────────────────────────────────────

/** Top-level dashboard data shape produced by the Dataverse service. */
export interface DashboardData {
  kpis: KpiData;
  serviceRequests: ServiceRequestChartData;
  incidents: StatusChartData;
  problems: StatusChartData;
  ciHealth: CiHealthData;
  recentActivities: ActivityRecord[];
  totalActivities: number;
}
