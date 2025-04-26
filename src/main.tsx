import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ShiftProvider } from './context/ShiftContext.tsx'
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ShiftProvider>
      <App />
    </ShiftProvider>
  </StrictMode>,
)
