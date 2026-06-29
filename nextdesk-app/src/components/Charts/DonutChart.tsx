/**
 * @file DonutChart.tsx
 * SVG donut chart with a colour-coded legend for CI Health.
 *
 * Renders three concentric arcs (Active, Maintenance, Retired) using
 * `stroke-dasharray` and `stroke-dashoffset` on SVG `<circle>` elements.
 * The arcs animate smoothly via CSS transitions defined in Charts.css.
 */

import type { CiHealthData } from '../../types/dashboard';

interface DonutChartProps {
  /** CI Health counts: active, maintenance, retired. */
  ciHealth: CiHealthData;
}

export default function DonutChart({ ciHealth }: DonutChartProps) {
  const total = ciHealth.active + ciHealth.maintenance + ciHealth.retired;

  // SVG circle geometry
  const radius = 70;
  const circumference = 2 * Math.PI * radius;

  // Arc lengths proportional to each segment's share
  const activeLen = total > 0 ? (ciHealth.active / total) * circumference : 0;
  const maintenanceLen = total > 0 ? (ciHealth.maintenance / total) * circumference : 0;
  const retiredLen = total > 0 ? (ciHealth.retired / total) * circumference : 0;

  return (
    <div className="donut-chart-container" id="donutContainer">
      {/* SVG donut */}
      <div className="donut-svg-wrap">
        <svg viewBox="0 0 200 200">
          {/* Background ring */}
          <circle cx="100" cy="100" r={radius} fill="none" stroke="#F3F4F6" strokeWidth="28" />

          {/* Retired segment (drawn first = behind) */}
          <circle
            cx="100" cy="100" r={radius} fill="none"
            stroke="#9CA3AF" strokeWidth="28"
            strokeDasharray={`${retiredLen} ${circumference - retiredLen}`}
            strokeDashoffset={`-${activeLen + maintenanceLen}`}
          />

          {/* Maintenance segment */}
          <circle
            cx="100" cy="100" r={radius} fill="none"
            stroke="#F59E0B" strokeWidth="28"
            strokeDasharray={`${maintenanceLen} ${circumference - maintenanceLen}`}
            strokeDashoffset={`-${activeLen}`}
          />

          {/* Active segment (drawn last = on top) */}
          <circle
            cx="100" cy="100" r={radius} fill="none"
            stroke="#10B981" strokeWidth="28"
            strokeDasharray={`${activeLen} ${circumference - activeLen}`}
            strokeDashoffset="0"
          />
        </svg>
      </div>

      {/* Legend */}
      <div className="donut-legend">
        <div className="donut-legend-item">
          <span className="donut-legend-dot active" />
          Active
        </div>
        <div className="donut-legend-item">
          <span className="donut-legend-dot maintenance" />
          Maintenance
        </div>
        <div className="donut-legend-item">
          <span className="donut-legend-dot retired" />
          Retired
        </div>
      </div>
    </div>
  );
}
