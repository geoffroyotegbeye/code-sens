import React from 'react'
import ReactDOM from 'react-dom/client'
import { Toaster } from 'react-hot-toast'
import App from './App.tsx';
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
    <Toaster position="top-right" toastOptions={{
      duration: 3000,
      style: {
        background: '#363636',
        color: '#fff',
      },
      success: {
        style: {
          background: '#10B981',
        },
      },
      error: {
        style: {
          background: '#EF4444',
        },
      },
    }} />
  </React.StrictMode>,
);
