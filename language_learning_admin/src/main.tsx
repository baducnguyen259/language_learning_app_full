import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import { AppProvider } from '@/app/providers/app_provider'
import App from '@/App'
import '@/index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppProvider>
      <App />
    </AppProvider>
  </StrictMode>,
)
