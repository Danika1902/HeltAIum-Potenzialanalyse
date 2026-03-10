import React from 'react'
import ReactDOM from 'react-dom/client'
import Potenzialanalyse from './Potenzialanalyse.jsx'
import { SpeedInsights } from '@vercel/speed-insights/react'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Potenzialanalyse />
    <SpeedInsights />
  </React.StrictMode>,
)
