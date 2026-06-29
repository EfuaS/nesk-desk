/**
 * @file ErrorModal.tsx
 * Dismissable error popup modal.
 *
 * Shows a red-accented modal with the error message, a dismiss button,
 * and auto-closes after 8 seconds. Clicking the backdrop also closes it.
 */

import { useEffect, useCallback } from 'react';
import './ErrorModal.css';

interface ErrorModalProps {
  /** The error message to display. When null/empty, the modal is hidden. */
  message: string | null;
  /** Callback to clear the error (hides the modal). */
  onClose: () => void;
}

export default function ErrorModal({ message, onClose }: ErrorModalProps) {
  // Auto-dismiss after 8 seconds
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(onClose, 8000);
    return () => clearTimeout(timer);
  }, [message, onClose]);

  /** Close when clicking the backdrop (not the modal card). */
  const handleOverlayClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (e.target === e.currentTarget) onClose();
    },
    [onClose],
  );

  return (
    <div
      className={`error-modal-overlay${message ? ' visible' : ''}`}
      id="errorModalOverlay"
      onClick={handleOverlayClick}
    >
      <div className="error-modal">
        {/* Header */}
        <div className="error-modal-header">
          <div className="error-modal-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </div>
          <span className="error-modal-title">Dataverse Error</span>
        </div>

        {/* Body */}
        <div className="error-modal-body">{message}</div>

        {/* Dismiss button */}
        <button className="error-modal-close-btn" id="errorModalCloseBtn" onClick={onClose}>
          Dismiss
        </button>
      </div>
    </div>
  );
}
