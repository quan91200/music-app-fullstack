import React, {
  useEffect
} from 'react'

import {
  BrowserRouter as Router
} from 'react-router-dom'

import {
  Toaster
} from 'react-hot-toast'

import AppRoutes from '@routes'

import { useAuthStore } from '@store/authStore'
import { useFavoriteStore } from '@store/favoriteStore'

import { usePlayerInitialization } from '@hooks/usePlayerInitialization'
import { usePWA } from '@hooks/usePWA'

import { PayPalScriptProvider } from '@paypal/react-paypal-js'

import { useTranslation } from 'react-i18next'

import '@assets/scss/main.scss'

import { getPaypalOptions } from '@constants/payment.constants'

function App() {
  const { user, initialize } = useAuthStore()
  const { fetchFavorites, clearFavorites } = useFavoriteStore()
  const { i18n } = useTranslation()

  useEffect(() => {
    initialize()
  }, [initialize])

  usePlayerInitialization()
  usePWA()

  useEffect(() => {
    if (user) {
      fetchFavorites()
    } else {
      clearFavorites()
    }
  }, [user, fetchFavorites, clearFavorites])

  const paypalOptions = getPaypalOptions(i18n.language)

  return (
    <PayPalScriptProvider
      options={paypalOptions}
      key={i18n.language}
    >
      <Router future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true
      }}>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#27272a',
              color: '#fff',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '12px',
            },
          }}
        />
        <AppRoutes />
      </Router>
    </PayPalScriptProvider>
  )
}

export default App
