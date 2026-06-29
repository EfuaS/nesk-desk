/**
 * @file ActivityTable.tsx
 * Data table for activity records.
 *
 * Renders thead with fixed columns (ID, Type, Date/Time, Status, User, Action)
 * and a tbody that maps over the filtered/capped activity array.
 *
 * Each row uses CSS-class badges for the activity type and status.
 * An empty-state message is shown when no records match the filters.
 */

import type { ActivityRecord, ActivityTabKey } from '../../types/dashboard';

interface ActivityTableProps {
  /** Filtered + capped activity records to display. */
  activities: ActivityRecord[];
  /** The currently active tab (used as fallback for the activity label). */
  activeTab: ActivityTabKey;
  /** Total filtered count (before capping — for footer). */
  filteredCount: number;
}

export default function ActivityTable({ activities, activeTab, filteredCount }: ActivityTableProps) {
  return (
    <>
      {/* ── Table ──────────────────────────────────── */}
      <table className="activities-table" id="activitiesTable">
        <thead>
          <tr>
            <th>ID</th>
            <th>Type</th>
            <th>Date / Time</th>
            <th>Status</th>
            <th>User</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody id="activitiesBody">
          {activities.length === 0 ? (
            /* Empty state */
            <tr>
              <td
                colSpan={6}
                style={{ textAlign: 'center', padding: '40px 16px', color: '#9CA3AF' }}
              >
                No activities match the selected filters.
              </td>
            </tr>
          ) : (
            activities.map((a, index) => {
              // Use the record's activity name, falling back to the tab name
              const activityLabel = a.activity || activeTab;
              const activityClass = activityLabel.toLowerCase().replace(/\s+/g, '-');
              const statusClass = String(a.status).toLowerCase().replace(/\s+/g, '-');

              return (
                <tr key={`${a.id}-${index}`}>
                  <td><strong>{a.id}</strong></td>
                  <td>
                    <span className={`activity-badge ${activityClass}`}>{activityLabel}</span>
                  </td>
                  <td>{a.dateTime}</td>
                  <td>
                    <span className={`status-badge ${statusClass}`}>{a.status}</span>
                  </td>
                  <td>
                    <div className="user-cell">{a.user}</div>
                  </td>
                  <td>
                    <span className="view-action">View</span>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>

      {/* ── Footer ─────────────────────────────────── */}
      <div className="activities-footer" id="activitiesFooter">
        <span className="activities-footer-text">
          Showing {activities.length} of {filteredCount} {activeTab} activities
        </span>
      </div>
    </>
  );
}
