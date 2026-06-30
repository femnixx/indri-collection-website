import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
// 1. Import the React-specific Analytics component
import { Analytics } from '@vercel/analytics/react' 

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
    {/* 2. Place the component right here */}
    <Analytics /> 
  </React.StrictMode>,
)
