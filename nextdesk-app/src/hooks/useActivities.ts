/**
 * @file useActivities.ts
 * Custom hook for the Activities section — manages tab switching,
 * date/status filters, per-tab Dataverse fetching, and race-condition
 * guards (mirrors the `currentFetchId` pattern from the original script).
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { ACTIVITY_TABLE_REGISTRY } from '../config/constants';
import { fetchActivitiesFromDataverse } from '../services/dataverse';
import type {
  ActivityRecord,
  ActivityTabKey,
  DateFilterValue,
  StatusFilterValue,
} from '../types/dashboard';

interface UseActivitiesReturn {
  /** Currently active tab key. */
  activeTab: ActivityTabKey;
  /** Current status filter value. */
  statusFilter: StatusFilterValue;
  /** Current date filter value. */
  dateFilter: DateFilterValue;
  /** Filtered + capped activity records ready for table rendering. */
  displayActivities: ActivityRecord[];
  /** Total count of filtered activities (before capping at 100). */
  filteredCount: number;
  /** True while activity data is being fetched from Dataverse. */
  loading: boolean;
  /** Error message from the most recent fetch attempt, or null. */
  error: string | null;
  /** Switches the active tab and triggers a fresh Dataverse fetch. */
  setActiveTab: (tab: ActivityTabKey) => void;
  /** Updates the status filter and re-applies filters locally. */
  setStatusFilter: (value: StatusFilterValue) => void;
  /** Updates the date filter and re-applies filters locally. */
  setDateFilter: (value: DateFilterValue) => void;
  /** Re-fetches data for the current tab from Dataverse. */
  refreshTable: () => Promise<void>;
}

/** Maximum number of rows shown in the table at once. */
const MAX_DISPLAY_ROWS = 100;

export function useActivities(): UseActivitiesReturn {
  const [activeTab, setActiveTabState] = useState<ActivityTabKey>('Service Request');
  const [statusFilter, setStatusFilter] = useState<StatusFilterValue>('all');
  const [dateFilter, setDateFilter] = useState<DateFilterValue>('all');
  const [rawActivities, setRawActivities] = useState<ActivityRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Race-condition guard: each fetch increments this counter.
   * If another fetch starts before the current one finishes,
   * the stale response is discarded.
   */
  const fetchIdRef = useRef(0);

  // ── Fetch activities from Dataverse for the given tab ──────────
  const fetchForTab = useCallback(async (tab: ActivityTabKey) => {
    const fetchId = ++fetchIdRef.current;
    const tableConfig = ACTIVITY_TABLE_REGISTRY[tab];

    if (!tableConfig?.entitySetName) {
      setRawActivities([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const activities = await fetchActivitiesFromDataverse(tableConfig);

      // Abort if a newer fetch was initiated while we were waiting
      if (fetchId !== fetchIdRef.current) return;

      setRawActivities(activities);
    } catch (err) {
      if (fetchId !== fetchIdRef.current) return;

      const msg = err instanceof Error ? err.message : String(err);
      console.warn(`Dataverse fetch failed for "${tab}":`, msg);
      setError(`Failed to fetch ${tab} data:\n${msg}`);
      setRawActivities([]);
    } finally {
      if (fetchId === fetchIdRef.current) {
        setLoading(false);
      }
    }
  }, []);

  // ── Re-fetch whenever the active tab changes ───────────────────
  useEffect(() => {
    fetchForTab(activeTab);
  }, [activeTab, fetchForTab]);

  // ── Tab switch handler ─────────────────────────────────────────
  const setActiveTab = useCallback((tab: ActivityTabKey) => {
    setActiveTabState(tab);
  }, []);

  // ── Manual table refresh ───────────────────────────────────────
  const refreshTable = useCallback(async () => {
    await fetchForTab(activeTab);
  }, [activeTab, fetchForTab]);

  // ── Apply client-side filters to the raw data ──────────────────
  let filtered = rawActivities;

  // Status filter
  if (statusFilter !== 'all') {
    filtered = filtered.filter((a) => a.status === statusFilter);
  }

  // Date filter
  if (dateFilter !== 'all') {
    filtered = filtered.filter((a) => {
      const actDate = new Date(a.dateTime);
      const now = new Date();
      const diffMs = now.getTime() - actDate.getTime();
      const diffDays = diffMs / (1000 * 60 * 60 * 24);

      switch (dateFilter) {
        case 'today':
          return diffDays < 1;
        case 'yesterday':
          return diffDays >= 1 && diffDays < 2;
        case 'last7':
          return diffDays < 7;
        case 'last30':
          return diffDays < 30;
        case 'older':
          return diffDays >= 30;
        default:
          return true;
      }
    });
  }

  const filteredCount = filtered.length;
  const displayActivities = filtered.slice(0, MAX_DISPLAY_ROWS);

  return {
    activeTab,
    statusFilter,
    dateFilter,
    displayActivities,
    filteredCount,
    loading,
    error,
    setActiveTab,
    setStatusFilter,
    setDateFilter,
    refreshTable,
  };
}
