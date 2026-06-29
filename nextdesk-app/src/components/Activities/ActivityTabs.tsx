/**
 * @file ActivityTabs.tsx
 * Pill-style tab buttons for switching between ITSM modules
 * in the activities table.
 *
 * The active tab gets a dark-blue pill background.
 * Clicking a tab calls `onTabChange` with the corresponding
 * ActivityTabKey.
 */

import type { ActivityTabKey } from '../../types/dashboard';

interface ActivityTabsProps {
  /** Currently active tab key. */
  activeTab: ActivityTabKey;
  /** Callback when a tab is clicked. */
  onTabChange: (tab: ActivityTabKey) => void;
}

/** Tab definitions — label text mapped to its filter key. */
const TABS: { label: string; key: ActivityTabKey }[] = [
  { label: 'Service Requests', key: 'Service Request' },
  { label: 'Incidents', key: 'Incident' },
  { label: 'CIs', key: 'CI' },
  { label: 'Changes', key: 'Change' },
  { label: 'Problems', key: 'Problem' },
];

export default function ActivityTabs({ activeTab, onTabChange }: ActivityTabsProps) {
  return (
    <div className="activity-tabs" id="activityTabs">
      {TABS.map(({ label, key }) => (
        <button
          key={key}
          className={`activity-tab${activeTab === key ? ' active' : ''}`}
          data-filter={key}
          onClick={() => onTabChange(key)}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
