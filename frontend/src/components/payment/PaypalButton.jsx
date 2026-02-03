/**
 * @fileoverview PayPal Button wrapper component.
 */

import React from 'react'

import {
  PayPalButtons,
  usePayPalScriptReducer
} from '@paypal/react-paypal-js'

import { createOrder, captureOrder } from '@services/payment/payment.service'

import toast from 'react-hot-toast'

import { useTranslation } from 'react-i18next'

import { CircularProgress } from '@mui/material'

const PaypalButton = ({
  plan,
  onApproval
}) => {
  const { t } = useTranslation()

  const [{
    isPending,
    isResolved,
    isRejected
  }] = usePayPalScriptReducer()

  const handleCreateOrder = async (data, actions) => {
    try {
      if (!plan || !plan.id) {
        throw new Error('Invalid plan selection')
      }

      const response = await createOrder(plan.id, 'paypal')

      if (response.success && response.data?.orderId) {
        return response.data.orderId
      }

      throw new Error(response.message || t('toast.payment_create_error'))
    } catch (error) {
      console.error('PayPal createOrder Error:', error)
      const errorMessage = error.response?.data?.message || error.message
      toast.error(`${t('toast.payment_create_error')}: ${errorMessage}`)
      throw error
    }
  }

  const handleApprove = async (data, actions) => {
    try {
      const response = await captureOrder(data.orderID, plan.id, 'paypal')
      if (response.success) {
        toast.success(t('toast.payment_success'))
        if (onApproval) onApproval(response.data)
      } else {
        throw new Error(response.message || t('toast.payment_error'))
      }
    } catch (error) {
      console.error('PayPal captureOrder Error:', error)
      toast.error(t('toast.payment_error'))
    }
  }

  if (isPending) {
    return (
      <div className="paypal-loading">
        <CircularProgress size={24} sx={{ color: '#0070ba' }} />
      </div>
    )
  }

  if (isRejected) {
    return <div className="paypal-error">{t('toast.paypal_sdk_error')}</div>
  }

  return (
    <div className="paypal-button-container" style={{ width: '100%' }}>
      <PayPalButtons
        style={{
          layout: 'vertical',
          height: 45,
          color: 'blue',
          shape: 'rect',
          label: 'pay',
          tagline: false
        }}
        createOrder={handleCreateOrder}
        onApprove={handleApprove}
        onCancel={() => {
          toast(t('toast.payment_canceled'))
        }}
        onError={(err) => {
          console.error('PayPal SDK Error:', err)
          toast.error(t('toast.payment_error'))
        }}
      />
      <div className="paypal-button-text">
        {t('premium.payment_secure')}
      </div>
    </div>
  )
}

export default PaypalButton
