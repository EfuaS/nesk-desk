/**
 * @file ChartsGrid.tsx
 * Orchestrates the two rows of chart cards:
 *   Row 1: Service Requests (bar) + Incidents (bar)
 *   Row 2: Problems (bar) + CI Health (donut)
 *
 * Each card includes a header with title + icon, stat labels
 * (Open / Pending / Closed), and the chart visualisation.
 */

import type { DashboardData } from '../../types/dashboard';
import BarChart from './BarChart';
import DonutChart from './DonutChart';
import './Charts.css';

interface ChartsGridProps {
  /** Full dashboard data — we extract chart-specific slices here. */
  data: DashboardData;
}

export default function ChartsGrid({ data }: ChartsGridProps) {
  const { serviceRequests, incidents, problems, ciHealth } = data;

  return (
    <>
      {/* ── Row 1: Service Requests + Incidents ───── */}
      <div className="charts-grid">
        {/* Service Requests chart card */}
        <div className="chart-card" id="serviceRequestsChart">
          <div className="chart-card-header">
            <span className="chart-card-title">Service Requests</span>
            <div className="chart-card-icon service-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="4" y="2" width="16" height="20" rx="2" />
                <line x1="8" y1="7" x2="16" y2="7" />
                <line x1="8" y1="11" x2="16" y2="11" />
                <line x1="8" y1="15" x2="12" y2="15" />
              </svg>
            </div>
          </div>

          {/* Stat labels */}
          <div className="chart-stats" id="srStats">
            <div className="chart-stat">
              <span className="chart-stat-value">{serviceRequests.open ?? 0}</span>
              <span className="chart-stat-label open">Open</span>
            </div>
            <div className="chart-stat">
              <span className="chart-stat-value">{serviceRequests.pending ?? 0}</span>
              <span className="chart-stat-label pending">Pending</span>
            </div>
            <div className="chart-stat">
              <span className="chart-stat-value">{serviceRequests.completed ?? 0}</span>
              <span className="chart-stat-label completed">Completed</span>
            </div>
          </div>

          {/* Bar chart */}
          <BarChart
            id="srBarChart"
            primaryVal={serviceRequests.open ?? 0}
            secondaryVal={serviceRequests.pending ?? 0}
            tertiaryVal={serviceRequests.completed ?? 0}
          />
        </div>

        {/* Incidents chart card */}
        <div className="chart-card" id="incidentsChart">
          <div className="chart-card-header">
            <span className="chart-card-title">Incidents</span>
            <div className="chart-card-icon incident-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2 L22 20 L2 20 Z" />
                <line x1="12" y1="9" x2="12" y2="13" />
                <circle cx="12" cy="16" r="0.5" fill="currentColor" />
              </svg>
            </div>
          </div>

          {/* Stat labels */}
          <div className="chart-stats" id="incStats">
            <div className="chart-stat">
              <span className="chart-stat-value">{incidents.open ?? 0}</span>
              <span className="chart-stat-label open">Open</span>
            </div>
            <div className="chart-stat">
              <span className="chart-stat-value">{incidents.pending ?? 0}</span>
              <span className="chart-stat-label pending">Pending</span>
            </div>
            <div className="chart-stat">
              <span className="chart-stat-value">{incidents.closed ?? 0}</span>
              <span className="chart-stat-label closed">Closed</span>
            </div>
          </div>

          {/* Bar chart */}
          <BarChart
            id="incBarChart"
            primaryVal={incidents.open ?? 0}
            secondaryVal={incidents.pending ?? 0}
            tertiaryVal={incidents.closed ?? 0}
          />
        </div>
      </div>

      {/* ── Row 2: Problems + CI Health ───────────── */}
      <div className="charts-grid">
        {/* Problems chart card */}
        <div className="chart-card" id="problemsChart">
          <div className="chart-card-header">
            <span className="chart-card-title">Problems</span>
            <div className="chart-card-icon problem-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <circle cx="12" cy="15.5" r="0.5" fill="currentColor" />
              </svg>
            </div>
          </div>

          {/* Stat labels */}
          <div className="chart-stats" id="prbStats">
            <div className="chart-stat">
              <span className="chart-stat-value">{problems.open ?? 0}</span>
              <span className="chart-stat-label open">Open</span>
            </div>
            <div className="chart-stat">
              <span className="chart-stat-value">{problems.pending ?? 0}</span>
              <span className="chart-stat-label pending">Pending</span>
            </div>
            <div className="chart-stat">
              <span className="chart-stat-value">{problems.closed ?? 0}</span>
              <span className="chart-stat-label closed">Closed</span>
            </div>
          </div>

          {/* Bar chart */}
          <BarChart
            id="prbBarChart"
            primaryVal={problems.open ?? 0}
            secondaryVal={problems.pending ?? 0}
            tertiaryVal={problems.closed ?? 0}
          />
        </div>

        {/* CI Health donut card */}
        <div className="chart-card" id="ciHealthChart">
          <div className="chart-card-header">
            <span className="chart-card-title">CI Health</span>
            <div className="chart-card-icon ci-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="4" y="4" width="16" height="16" rx="2" />
                <line x1="4" y1="9" x2="20" y2="9" />
                <line x1="4" y1="14" x2="20" y2="14" />
                <line x1="9" y1="4" x2="9" y2="20" />
              </svg>
            </div>
          </div>

          {/* Donut chart */}
          <DonutChart ciHealth={ciHealth} />
        </div>
      </div>
    </>
  );
}
