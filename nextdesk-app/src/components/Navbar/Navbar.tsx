/**
 * @file Navbar.tsx
 * Fixed top navigation bar.
 *
 * Contains: grid/menu button, search input, notification/help/settings
 * icon buttons, user avatar with name/role, and Dynamics 365 branding.
 *
 * This component is purely presentational — no data fetching or state.
 */

import './Navbar.css';

export default function Navbar() {
  return (
    <header className="top-navbar">
      {/* ── Left: menu + search ──────────────────── */}
      <div className="navbar-left">
        {/* Grid / menu icon */}
        <button className="navbar-grid-btn" title="Menu">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="2" y="2" width="5" height="5" rx="1" />
            <rect x="10" y="2" width="5" height="5" rx="1" />
            <rect x="2" y="10" width="5" height="5" rx="1" />
            <rect x="10" y="10" width="5" height="5" rx="1" />
          </svg>
        </button>

        {/* Search */}
        <div className="navbar-search">
          <span className="navbar-search-icon">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </span>
          <input type="text" placeholder="Search..." />
        </div>
      </div>

      {/* ── Right: icons + user + branding ────────── */}
      <div className="navbar-right">
        {/* Notification bell */}
        <button className="navbar-icon-btn" title="Notifications">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
          <span className="badge">3</span>
        </button>

        {/* Help */}
        <button className="navbar-icon-btn" title="Help">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <circle cx="12" cy="12" r="10" />
            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
        </button>

        {/* Settings gear */}
        <button className="navbar-icon-btn" title="Settings">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
          </svg>
        </button>

        {/* User */}
        <div className="navbar-user">
          <div className="navbar-avatar">SA</div>
          <div className="navbar-user-info">
            <span className="navbar-user-name">Samuel</span>
            <span className="navbar-user-role">Admin</span>
          </div>
        </div>

        {/* Branding */}
        <div className="navbar-branding">
          <span className="navbar-branding-text">
            <strong>Dynamics 365</strong>&nbsp; NextDesk
          </span>
        </div>
      </div>
    </header>
  );
}
