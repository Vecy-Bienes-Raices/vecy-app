import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Analytics } from '@vercel/analytics/react'
import { PaymentProvider } from './context/PaymentContext'
import { AuthProvider } from './context/AuthContext'
import App from './AppV2.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <AuthProvider>
            <PaymentProvider>
                <BrowserRouter>
                    <App />
                    <Analytics />
                </BrowserRouter>
            </PaymentProvider>
        </AuthProvider>
    </React.StrictMode>,
)
