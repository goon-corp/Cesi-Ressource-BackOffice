import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import Header from './services/router-service/Header.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Header></Header>
    <App />
  </StrictMode>,
)
