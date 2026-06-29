/**
 * @file KpiGrid.tsx
 * Renders the 5 KPI summary cards in a responsive grid.
 *
 * Each card shows: module icon, title, big number, trend/change badge,
 * and a "View →" link. Data is received via props from the parent.
 *
 * Card configuration is defined as a typed array, making it easy to
 * add or reorder cards without touching the markup template.
 */

import type { KpiData } from '../../types/dashboard';
import './KpiGrid.css';

interface KpiGridProps {
  /** KPI data from the dashboard. */
  kpis: KpiData;
}

/** Describes a single KPI card's rendering config. */
interface KpiCardConfig {
  type: string;
  title: string;
  value: string | number;
  change: string;
  changeClass: string;
  link: string;
  icon: React.ReactNode;
}

export default function KpiGrid({ kpis }: KpiGridProps) {
  // ── Card definitions ────────────────────────────────────
  const cards: KpiCardConfig[] = [
    {
      type: 'service',
      title: 'Total Service Requests',
      value: kpis.totalServiceRequests.value,
      change: `↑ ${kpis.totalServiceRequests.changePercent}%`,
      changeClass: 'up',
      link: 'View Service requests →',
      icon: (
        <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="2" width="14" height="16" rx="2" />
          <line x1="7" y1="6" x2="13" y2="6" />
          <line x1="7" y1="10" x2="13" y2="10" />
          <line x1="7" y1="14" x2="10" y2="14" />
        </svg>
      ),
    },
    {
      type: 'incident',
      title: 'Total Incidents',
      value: kpis.totalIncidents.value,
      change: `↑ ${kpis.totalIncidents.changePercent}%`,
      changeClass: 'up',
      link: 'View Incidents →',
      icon: (
        <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <path d="M10 2 L18 16 L2 16 Z" />
          <line x1="10" y1="7" x2="10" y2="11" />
          <circle cx="10" cy="13.5" r="0.5" fill="currentColor" />
        </svg>
      ),
    },
    {
      type: 'ci',
      title: 'Total CIs',
      value: kpis.totalCIs.value.toLocaleString(),
      change: `${kpis.totalCIs.percentage}%`,
      changeClass: 'up',
      link: 'View CIs →',
      icon: (
        <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="10" cy="6" r="3" />
          <circle cx="5" cy="15" r="2.5" />
          <circle cx="15" cy="15" r="2.5" />
          <line x1="10" y1="9" x2="5" y2="12.5" />
          <line x1="10" y1="9" x2="15" y2="12.5" />
        </svg>
      ),
    },
    {
      type: 'change',
      title: 'Total Changes',
      value: kpis.totalChanges.value,
      change: `${kpis.totalChanges.awaiting} awaiting`,
      changeClass: 'awaiting',
      link: 'View changes →',
      icon: (
        <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="4 14 8 10 12 14 16 6" />
          <polyline points="13 6 16 6 16 9" />
        </svg>
      ),
    },
    {
      type: 'problem',
      title: 'Total Problems',
      value: kpis.totalProblems.value,
      change: `${kpis.totalProblems.critical} critical`,
      changeClass: 'critical',
      link: 'View Problems →',
      icon: (
        <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
          <circle cx="10" cy="10" r="8" />
          <line x1="10" y1="6" x2="10" y2="10" />
          <circle cx="10" cy="13" r="0.5" fill="currentColor" />
        </svg>
      ),
    },
  ];

  return (
    <div className="kpi-grid" id="kpiGrid">
      {cards.map((card) => (
        <div className={`kpi-card ${card.type}`} key={card.type}>
          {/* Card header: icon + title */}
          <div className="kpi-header">
            <div className="kpi-icon">{card.icon}</div>
            <span className="kpi-title">{card.title}</span>
          </div>

          {/* Big value + change badge */}
          <div className="kpi-value-row">
            <span className="kpi-value">{card.value}</span>
            <span className={`kpi-change ${card.changeClass}`}>{card.change}</span>
          </div>

          {/* View link */}
          <a href="#" className="kpi-link" onClick={(e) => e.preventDefault()}>
            {card.link}
          </a>
        </div>
      ))}
    </div>
  );
}
