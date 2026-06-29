/**
 * @file useDashboardData.ts
 * Custom hook that manages the lifecycle of dashboard data:
 * initial load, refresh, loading state, and error reporting.
 *
 * Replaces the global `dashboardData` variable and `loadData()` /
 * `simulatePageRefresh()` orchestration from the original script.
 */

import { useState, useEffect, useCallback } from 'react';
import type { DashboardData } from '../types/dashboard';
import { loadDashboardFromDataverse, createEmptyDashboardData } from '../services/dataverse';

interface UseDashboardDataReturn {
  /** Current dashboard data (never null after first load). */
  data: DashboardData;
  /** True while data is being fetched (initial load or refresh). */
  loading: boolean;
  /** Most recent error message, or null. */
  error: string | null;
  /** Triggers a full data re-fetch from Dataverse. */
  refresh: () => Promise<void>;
  /** Clears the current error message. */
  clearError: () => void;
}

export function useDashboardData(): UseDashboardDataReturn {
  const [data, setData] = useState<DashboardData>(createEmptyDashboardData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetches dashboard data from Dataverse.
   * On failure, preserves the current data and sets an error message.
   */
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const result = await loadDashboardFromDataverse();
      setData(result);
      setError(null);
      console.info('Dashboard data loaded from Dataverse.');
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.warn('Dataverse load failed, falling back to empty data:', msg);
      setError(`Dashboard load failed:\n${msg}\n\nFalling back to local data.`);
      // Keep existing data (or empty on first load)
    } finally {
      setLoading(false);
    }
  }, []);

  /** Initial data load on mount. */
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  /** Public refresh handler — re-fetches everything from Dataverse. */
  const refresh = useCallback(async () => {
    await fetchData();
  }, [fetchData]);

  const clearError = useCallback(() => setError(null), []);

  return { data, loading, error, refresh, clearError };
}
