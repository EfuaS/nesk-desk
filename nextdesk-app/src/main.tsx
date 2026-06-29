/**
 * @file main.tsx
 * Application entry point.
 *
 * Renders the root <App /> component into the #root DOM element.
 * Imports the global stylesheet first to ensure design tokens
 * and base styles are available to all components.
 */

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
