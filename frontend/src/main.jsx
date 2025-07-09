import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { SnakbarProvider } from './context/SnackbarContext'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <SnakbarProvider>
      <App />
    </SnakbarProvider>
  </BrowserRouter>,
)
