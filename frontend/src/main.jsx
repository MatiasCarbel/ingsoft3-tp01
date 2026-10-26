import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import * as Sentry from '@sentry/react'

// Inicialización de Sentry (Observabilidad TP9)
Sentry.init({
  dsn: 'https://2ae41824a68eabbef61d9d5307cee9db@o4512323576135680.ingest.us.sentry.io/4512323593306112',
  environment: window.location.hostname, // Identifica si viene de QA, PROD o localhost
  integrations: [
    Sentry.browserTracingIntegration()
  ],
  tracesSampleRate: 1.0,
})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)