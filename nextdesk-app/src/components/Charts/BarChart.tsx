/**
 * @file BarChart.tsx
 * Reusable bar chart component with animated bars.
 *
 * Renders a Y-axis with gridlines and 3 colour-coded bars (primary,
 * secondary, tertiary). Bar heights animate from 0% to their target
 * via `requestAnimationFrame` + a short delay, matching the original
 * vanilla JS animation behaviour.
 */

import { useEffect, useRef } from 'react';

interface BarChartProps {
  /** DOM id for the chart container (used for CSS targeting). */
  id: string;
  /** Value for the first (primary) bar — typically "Open". */
  primaryVal: number;
  /** Value for the second (secondary) bar — typically "Pending". */
  secondaryVal: number;
  /** Value for the third (tertiary) bar — typically "Closed/Completed". */
  tertiaryVal: number;
  /** Maximum scale value for the Y-axis (default 150). */
  maxScale?: number;
}

/** Y-axis label values displayed alongside the chart. */
const Y_LABELS = [150, 120, 90, 60, 30, 0];

export default function BarChart({
  id,
  primaryVal,
  secondaryVal,
  tertiaryVal,
  maxScale = 150,
}: BarChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Calculate bar heights as a percentage of the max scale
  const primaryHeight = (primaryVal / maxScale) * 100;
  const secondaryHeight = (secondaryVal / maxScale) * 100;
  const tertiaryHeight = (tertiaryVal / maxScale) * 100;

  /**
   * Animate bars from 0% → target height after a short delay.
   * This mirrors the original `requestAnimationFrame` + `setTimeout`
   * pattern for a smooth entrance animation.
   */
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const animId = requestAnimationFrame(() => {
      const timer = setTimeout(() => {
        container.querySelectorAll<HTMLElement>('.bar').forEach((bar) => {
          bar.style.height = bar.dataset.height ?? '0%';
        });
      }, 100);

      // Cleanup: cancel the pending timeout if the component unmounts
      return () => clearTimeout(timer);
    });

    return () => cancelAnimationFrame(animId);
  }, [primaryVal, secondaryVal, tertiaryVal]);

  return (
    <div className="bar-chart-container" id={id} ref={containerRef}>
      {/* Y-axis labels */}
      <div className="bar-chart-y-axis">
        {Y_LABELS.map((label) => (
          <span className="bar-chart-y-label" key={label}>{label}</span>
        ))}
      </div>

      {/* Chart area with gridlines + bars */}
      <div className="bar-chart-area">
        {/* Gridlines */}
        <div className="bar-chart-gridlines">
          {Y_LABELS.map((_, i) => (
            <div className="bar-chart-gridline" key={i} />
          ))}
        </div>

        {/* Bars */}
        <div className="bar-chart-bars">
          {/* Primary bar (Open) */}
          <div className="bar-group">
            <span className="bar-value-label">{primaryVal ?? 0}</span>
            <div
              className="bar primary"
              style={{ height: '0%' }}
              data-height={`${primaryHeight}%`}
            />
          </div>

          {/* Secondary bar (Pending) */}
          <div className="bar-group">
            <span className="bar-value-label">{secondaryVal ?? 0}</span>
            <div
              className="bar secondary"
              style={{ height: '0%' }}
              data-height={`${secondaryHeight}%`}
            />
          </div>

          {/* Tertiary bar (Closed / Completed) */}
          <div className="bar-group">
            <span className="bar-value-label">{tertiaryVal ?? 0}</span>
            <div
              className="bar tertiary"
              style={{ height: '0%' }}
              data-height={`${tertiaryHeight}%`}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
