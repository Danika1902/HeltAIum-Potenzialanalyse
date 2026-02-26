import React from 'react'
import ReactDOM from 'react-dom/client'
import Potenzialanalyse from './Potenzialanalyse.jsx'
import { Analytics } from '@vercel/analytics/react'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Potenzialanalyse />
    <Analytics />
  </React.StrictMode>,
)
