/**
 * @fileoverview Payment service for frontend API calls.
 */

import api from '@services/api'

/**
 * Create a payment order on the backend.
 * @param {string} plan - Plan name (e.g., 'premium', 'premium_family').
 * @param {string} provider - Payment provider (e.g., 'paypal').
 */
export const createOrder = async (plan, provider = 'paypal') => {
  const response = await api.post('payments/create-order', { plan, provider })
  return response.data
}

/**
 * Capture a payment order on the backend.
 * @param {string} orderId - Provider's order ID.
 * @param {string} plan - Plan name.
 * @param {string} provider - Provider name.
 */
export const captureOrder = async (orderId, plan, provider = 'paypal') => {
  const response = await api.post('payments/capture', { orderId, plan, provider })
  return response.data
}

/**
 * Get current subscription status.
 */
export const getCurrentSubscription = async () => {
  const response = await api.get('payments/subscription')
  return response.data
}

/**
 * Get payment history.
 */
export const getPaymentHistory = async () => {
  const response = await api.get('payments/history')
  return response.data
}
