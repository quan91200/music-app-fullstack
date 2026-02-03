/**
 * @fileoverview Payment Service handling core transaction logic.
 * @module features/payments/payment.service
 */

import { Payment, Subscription, User } from '../../shared/config/associations.js';
import { Op } from 'sequelize';
import providerFactory from './providers/provider.factory.js';
import Logger from '../../shared/utils/logger/Logger.js';

class PaymentService {
  /**
   * Initiate a payment order.
   * @param {string} userId - ID of the user.
   * @param {number} amount - Amount to pay.
   * @param {string} providerName - 'paypal', etc.
   * @param {string} currency - 'USD', etc.
   * @returns {Promise<Object>} Order details for frontend.
   */
  async initiatePayment(userId, amount, providerName, currency = 'USD') {
    const provider = providerFactory.get(providerName);

    // Create pre-order record
    const payment = await Payment.create({
      userId,
      amount,
      currency,
      provider: providerName,
      status: 'created'
    });

    const order = await provider.createOrder(amount, currency, { userId, paymentId: payment.id });

    // Update payment with provider order ID
    await payment.update({
      providerTransactionId: order.id,
      metadata: { paypalOrderId: order.id }
    });

    return {
      paymentId: payment.id,
      orderId: order.id,
      links: order.links
    };
  }

  /**
   * Capture and finalize a payment.
   * @param {string} orderId - Provider's order ID (e.g. PayPal Order ID).
   * @param {string} providerName - 'paypal', etc.
   */
  async capturePayment(orderId, providerName) {
    try {
      const payment = await Payment.findOne({
        where: {
          provider: providerName,
          [Op.or]: [
            { providerTransactionId: orderId },
            { 'metadata.paypalOrderId': orderId }
          ]
        }
      });

      if (!payment) {
        Logger.error(`Payment record not found for orderId: ${orderId}`);
        throw new Error('Payment record not found');
      }

      if (payment.status === 'paid') {
        Logger.info(`Payment already processed: ${payment.id}`);
        return payment;
      }

      const provider = providerFactory.get(providerName);
      const result = await provider.captureOrder(orderId);

      await payment.update({
        status: result.status,
        // Keep providerTransactionId as the original Order ID for reference
        // Store the specific Capture ID in metadata
        metadata: {
          ...payment.metadata,
          captureId: result.transactionId,
          paypalRaw: result.raw
        },
        processedAt: new Date(),
        idempotencyKey: `${providerName}:${result.transactionId}`
      });

      Logger.info(`Payment captured successfully: ${payment.id} (${result.status})`);
      return payment;
    } catch (error) {
      Logger.error(`Capture Payment Error [${orderId}]:`, error);
      throw error;
    }
  }

  /**
   * Handle webhook from providers.
   * @param {string} providerName - 'paypal', etc.
   * @param {Object} payload - Webhook body.
   * @param {Object} headers - Webhook headers.
   */
  async handleWebhook(providerName, payload, headers) {
    const provider = providerFactory.get(providerName);
    const { transactionId, status } = await provider.verifyWebhook(payload, headers);

    const idempotencyKey = `${providerName}:${transactionId}`;

    // Check if already processed
    const existing = await Payment.findOne({ where: { idempotencyKey } });
    if (existing && existing.processedAt) {
      Logger.info(`Webhook skipped: Transaction ${transactionId} already processed.`);
      return { success: true, alreadyProcessed: true };
    }

    const payment = await Payment.findOne({
      where: { providerTransactionId: transactionId, provider: providerName }
    });

    if (payment) {
      await payment.update({
        status: status,
        processedAt: new Date(),
        idempotencyKey: idempotencyKey
      });

      Logger.info(`Payment ${payment.id} updated via webhook to ${status}`);
    } else {
      // Logic for events where internal payment record might not exist yet (rare but possible)
      Logger.warn(`Webhook: Payment for transaction ${transactionId} not found in DB.`);
    }

    return { success: true };
  }

  /**
   * Get payment history for a user.
   */
  async getHistory(userId) {
    return Payment.findAll({
      where: { userId },
      order: [['createdAt', 'DESC']]
    });
  }
}

export default new PaymentService();
