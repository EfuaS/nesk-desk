/**
 * @file dataverse.ts
 * Dataverse Web API service layer for the NextDesk dashboard.
 *
 * Provides reusable utilities for executing FetchXML queries,
 * extracting formatted field values, and assembling the full
 * dashboard data structure (KPIs, chart values, activity records).
 *
 * All functions are pure — they don't touch React state directly.
 * They are consumed by the custom hooks in `src/hooks/`.
 */

import { CONFIG, STATUS_VALUES, ACTIVITY_TABLE_REGISTRY } from '../config/constants';
import type {
  DashboardData,
  ActivityRecord,
  TableConfig,
} from '../types/dashboard';

// ────────────────────────────────────────────────────────────────
//  Xrm global type (available when running inside Power Apps)
// ────────────────────────────────────────────────────────────────

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Xrm?: any;
  }
}

// ────────────────────────────────────────────────────────────────
//  API Base URL
// ────────────────────────────────────────────────────────────────

/**
 * Returns the Dynamics 365 Web API base URL.
 * Prefers the Xrm context (when running inside Power Apps/Model-driven app),
 * otherwise falls back to `window.location.origin` or the hardcoded CONFIG.
 */
export function getApiBase(): string {
  try {
    return window.Xrm.Utility.getGlobalContext().getClientUrl() + '/api/data/v9.2';
  } catch {
    return (window.location.origin || CONFIG.apiBase) + '/api/data/v9.2';
  }
}

// ────────────────────────────────────────────────────────────────
//  FetchXML Query Executor
// ────────────────────────────────────────────────────────────────

/**
 * Executes a FetchXML query against a Dataverse entity set.
 *
 * @param base     - API base URL (from `getApiBase()`)
 * @param table    - Entity set name (plural, e.g. `'cr229_requestses'`)
 * @param fetchXml - Raw FetchXML query string
 * @returns Parsed JSON response from the Web API
 */
export async function fetchWithXml(
  base: string,
  table: string,
  fetchXml: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): Promise<any> {
  const url = `${base}/${table}?fetchXml=${encodeURIComponent(fetchXml)}`;
  const resp = await fetch(url, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'OData-MaxVersion': '4.0',
      'OData-Version': '4.0',
      Prefer: 'odata.include-annotations="*"',
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!resp.ok) {
    throw new Error(`FetchXML Error: ${resp.status} ${resp.statusText}`);
  }
  return resp.json();
}

// ────────────────────────────────────────────────────────────────
//  Record Value Extraction
// ────────────────────────────────────────────────────────────────

/**
 * Extracts a display-friendly value from a Dataverse record.
 * Priority: formatted annotation → lookup annotation → lookup _value → raw field.
 *
 * @param record    - A single Dataverse record object
 * @param fieldName - Logical column name
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getRecordValue(record: Record<string, any>, fieldName: string): string {
  if (!fieldName) return '';

  // Formatted value annotation (option sets, dates, etc.)
  const formatted = record[`${fieldName}@OData.Community.Display.V1.FormattedValue`];
  if (formatted !== undefined && formatted !== null) return formatted;

  // Lookup formatted value
  const lookupFormatted =
    record[`_${fieldName}_value@OData.Community.Display.V1.FormattedValue`];
  if (lookupFormatted !== undefined && lookupFormatted !== null) return lookupFormatted;

  // Lookup raw GUID
  const lookupVal = record[`_${fieldName}_value`];
  if (lookupVal !== undefined && lookupVal !== null) return lookupVal;

  // Direct value
  return record[fieldName] ?? '';
}

// ────────────────────────────────────────────────────────────────
//  Date Formatting
// ────────────────────────────────────────────────────────────────

/**
 * Formats an ISO 8601 date string to a human-readable format.
 * Used as a fallback when Dataverse OData annotations aren't available.
 */
export function formatDateTime(isoString: string): string {
  if (!isoString) return '';
  try {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return isoString;
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  } catch {
    return isoString;
  }
}

// ────────────────────────────────────────────────────────────────
//  KPI Count Queries
// ────────────────────────────────────────────────────────────────

/**
 * Fetches the total record count for a Dataverse entity.
 * Uses `returntotalrecordcount` in FetchXML for efficiency.
 */
export async function fetchKPICount(
  entitySetName: string,
  entityLogicalName: string,
  columnName: string,
): Promise<number> {
  const base = getApiBase();
  const xml = `
    <fetch version="1.0" mapping="logical" returntotalrecordcount="true" count="1">
      <entity name="${entityLogicalName}">
        <attribute name="${columnName}" />
      </entity>
    </fetch>`;
  const data = await fetchWithXml(base, entitySetName, xml);
  return data['@odata.count'] ?? 0;
}

/**
 * Fetches a filtered record count using an injected FetchXML `<filter>` snippet.
 */
export async function fetchKPIFilteredCount(
  entitySetName: string,
  entityLogicalName: string,
  columnName: string,
  filterXml: string,
): Promise<number> {
  const base = getApiBase();
  const xml = `
    <fetch version="1.0" mapping="logical" returntotalrecordcount="true" count="1">
      <entity name="${entityLogicalName}">
        <attribute name="${columnName}" />
        ${filterXml}
      </entity>
    </fetch>`;
  const data = await fetchWithXml(base, entitySetName, xml);
  return data['@odata.count'] ?? 0;
}

/**
 * Fetches the count of records matching a specific status option-set value.
 */
export async function fetchStatusCount(
  tableConfig: TableConfig,
  statusValue: number,
): Promise<number> {
  const filterXml = `<filter><condition attribute="${tableConfig.columns.status}" operator="eq" value="${statusValue}" /></filter>`;
  return fetchKPIFilteredCount(
    tableConfig.entitySetName,
    tableConfig.entityLogicalName,
    tableConfig.columns.dateTime,
    filterXml,
  );
}

// ────────────────────────────────────────────────────────────────
//  Activity Data Fetching (per-tab)
// ────────────────────────────────────────────────────────────────

/**
 * Fetches activity records from a Dataverse table using FetchXML.
 * Each tab calls this with its own config from ACTIVITY_TABLE_REGISTRY.
 *
 * @param tableConfig - Entry from ACTIVITY_TABLE_REGISTRY
 * @returns Array of normalised activity records
 */
export async function fetchActivitiesFromDataverse(
  tableConfig: TableConfig,
): Promise<ActivityRecord[]> {
  const base = getApiBase();
  const cols = tableConfig.columns;

  // Build attribute list, skipping empty column names
  const attributes = Object.values(cols)
    .filter((col) => col)
    .map((col) => `<attribute name="${col}" />`)
    .join('\n          ');

  const fetchXml = `
    <fetch top="${CONFIG.recentLimit}">
      <entity name="${tableConfig.entityLogicalName}">
        ${attributes}
        <order attribute="${cols.dateTime}" descending="true" />
      </entity>
    </fetch>`;

  const data = await fetchWithXml(base, tableConfig.entitySetName, fetchXml);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (data.value || []).map((record: Record<string, any>) => ({
    id: getRecordValue(record, cols.id),
    activity: getRecordValue(record, cols.activity),
    dateTime:
      getRecordValue(record, cols.dateTime) || formatDateTime(record[cols.dateTime]),
    status: getRecordValue(record, cols.status),
    user: getRecordValue(record, cols.user),
  }));
}

// ────────────────────────────────────────────────────────────────
//  Full Dashboard Data Assembly
// ────────────────────────────────────────────────────────────────

/**
 * Loads all dashboard data (KPIs, chart breakdown values) from Dataverse
 * by running status-count queries for every module in parallel.
 */
export async function loadDashboardFromDataverse(): Promise<DashboardData> {
  const sr = ACTIVITY_TABLE_REGISTRY['Service Request'];
  const inc = ACTIVITY_TABLE_REGISTRY['Incident'];
  const ci = ACTIVITY_TABLE_REGISTRY['CI'];
  const chg = ACTIVITY_TABLE_REGISTRY['Change'];
  const prb = ACTIVITY_TABLE_REGISTRY['Problem'];

  // Fetch all status counts in parallel
  const [
    srOpen, srPending, srClose,
    incOpen, incPending, incClose,
    chgOpen, chgPending, chgClose,
    prbOpen, prbPending, prbClose,
    ciActive, ciMaintenance, ciRetired,
  ] = await Promise.all([
    // Service Requests
    fetchStatusCount(sr, STATUS_VALUES.general.Open),
    fetchStatusCount(sr, STATUS_VALUES.general.Pending),
    fetchStatusCount(sr, STATUS_VALUES.general.Close),
    // Incidents
    fetchStatusCount(inc, STATUS_VALUES.general.Open),
    fetchStatusCount(inc, STATUS_VALUES.general.Pending),
    fetchStatusCount(inc, STATUS_VALUES.general.Close),
    // Changes
    fetchStatusCount(chg, STATUS_VALUES.general.Open),
    fetchStatusCount(chg, STATUS_VALUES.general.Pending),
    fetchStatusCount(chg, STATUS_VALUES.general.Close),
    // Problems
    fetchStatusCount(prb, STATUS_VALUES.general.Open),
    fetchStatusCount(prb, STATUS_VALUES.general.Pending),
    fetchStatusCount(prb, STATUS_VALUES.general.Close),
    // CI Health
    fetchStatusCount(ci, STATUS_VALUES.ci.Active),
    fetchStatusCount(ci, STATUS_VALUES.ci.Maintenance),
    fetchStatusCount(ci, STATUS_VALUES.ci.Retired),
  ]);

  // Derive totals from status counts
  const srTotal = srOpen + srPending + srClose;
  const incTotal = incOpen + incPending + incClose;
  const chgTotal = chgOpen + chgPending + chgClose;
  const prbTotal = prbOpen + prbPending + prbClose;
  const ciTotal = ciActive + ciMaintenance + ciRetired;
  const ciActivePercent = ciTotal > 0 ? Math.round((ciActive / ciTotal) * 100) : 0;

  return {
    kpis: {
      totalServiceRequests: { value: srTotal, changePercent: 0, trend: 'up' },
      totalIncidents: { value: incTotal, changePercent: 0, trend: 'up' },
      totalCIs: { value: ciTotal, percentage: ciActivePercent },
      totalChanges: { value: chgTotal, awaiting: chgPending },
      totalProblems: { value: prbTotal, critical: 0 },
    },
    serviceRequests: { open: srOpen, pending: srPending, completed: srClose },
    incidents: { open: incOpen, pending: incPending, closed: incClose },
    problems: { open: prbOpen, pending: prbPending, closed: prbClose },
    ciHealth: { active: ciActive, maintenance: ciMaintenance, retired: ciRetired },
    recentActivities: [],
    totalActivities: srTotal + incTotal + chgTotal + prbTotal + ciTotal,
  };
}

// ────────────────────────────────────────────────────────────────
//  Empty Fallback
// ────────────────────────────────────────────────────────────────

/** Creates a zeroed-out dashboard data structure for use as a fallback. */
export function createEmptyDashboardData(): DashboardData {
  return {
    kpis: {
      totalServiceRequests: { value: 0, changePercent: 0, trend: 'up' },
      totalIncidents: { value: 0, changePercent: 0, trend: 'up' },
      totalCIs: { value: 0, percentage: 0 },
      totalChanges: { value: 0, awaiting: 0 },
      totalProblems: { value: 0, critical: 0 },
    },
    serviceRequests: { open: 0, pending: 0, completed: 0 },
    incidents: { open: 0, pending: 0, closed: 0 },
    problems: { open: 0, pending: 0, closed: 0 },
    ciHealth: { active: 0, maintenance: 0, retired: 0 },
    recentActivities: [],
    totalActivities: 0,
  };
}
