/**
 * @file Loader.tsx
 * Reusable loading overlays — page-level and table-level.
 *
 * Visibility is controlled by a `visible` prop which toggles the
 * CSS class that shows/hides the overlay.
 */

import './Loader.css';

interface PageLoaderProps {
  /** Whether the full-page overlay is visible. */
  visible: boolean;
  /** Optional loading message (defaults to "Refreshing data..."). */
  text?: string;
}

/**
 * Full-page loader overlay — sits on top of the main content area.
 * Used during initial data load and full dashboard refresh.
 */
export function PageLoader({ visible, text = 'Refreshing data...' }: PageLoaderProps) {
  return (
    <div
      className={`page-loader-overlay${visible ? ' visible' : ''}`}
      id="pageLoaderOverlay"
    >
      <div className="loader-spinner" />
      <span className="loader-text">{text}</span>
    </div>
  );
}

interface TableLoaderProps {
  /** Whether the table overlay is visible. */
  visible: boolean;
}

/**
 * Table-level loader overlay — positioned absolutely within a `position: relative` parent.
 * Used when switching tabs or refreshing the activities table.
 */
export function TableLoader({ visible }: TableLoaderProps) {
  return (
    <div
      className={`table-loader-overlay${visible ? ' visible' : ''}`}
      id="tableLoaderOverlay"
    >
      <div className="loader-spinner" />
    </div>
  );
}
