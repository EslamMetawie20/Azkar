import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// Force clear old backend-seeking databases
const DB_VERSION = '3.0.0';
if (localStorage.getItem('azkar_version') !== DB_VERSION) {
  if (window.indexedDB) {
    indexedDB.deleteDatabase('azkar-db');
  }
  localStorage.clear();
  localStorage.setItem('azkar_version', DB_VERSION);
  console.log('Old caches and databases cleared for v2.0.0');
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
