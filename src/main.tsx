import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@/styles/fonts.css';
import '@/styles/globals.css';
import '@/styles/animations.css';
import '@/lib/gsap-config';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import App from '@/App';

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Root element not found. Check index.html for <div id="root">.');
}

createRoot(rootElement).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>
);
