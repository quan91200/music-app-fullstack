/**
 * @fileoverview Interface for payment providers.
 * @module features/payments/providers/IPaymentProvider
 */

/**
 * Interface that all payment providers must implement.
 * @interface
 */
class IPaymentProvider {
  /**
   * Create an order/transaction.
   * @param {number} amount - Amount to charge.
   * @param {string} currency - Currency code (e.g., 'USD', 'VND').
   * @param {Object} metadata - Additional info.
   * @returns {Promise<Object>} Provider-specific order details.
   */
  async createOrder(_amount, _currency, _metadata) {
    throw new Error('Method not implemented');
  }

  /**
   * Capture/Confirm a previously created order.
   * @param {string} orderId - Provider's order ID.
   * @returns {Promise<Object>} Normalized transaction details.
   */
  async captureOrder(_orderId) {
    throw new Error('Method not implemented');
  }

  /**
   * Refund a transaction.
   * @param {string} transactionId - Provider's transaction ID.
   * @returns {Promise<Object>} Refund details.
   */
  async refundOrder(_transactionId) {
    throw new Error('Method not implemented');
  }

  /**
   * Verify and process webhook payload.
   * @param {Object} payload - Webhook body.
   * @param {Object} headers - Webhook headers.
   * @returns {Promise<Object>} Normalized event and status.
   */
  async verifyWebhook(_payload, _headers) {
    throw new Error('Method not implemented');
  }

  /**
   * Maps provider internal status to our domain status.
   * @param {string} providerStatus - Status from provider.
   * @returns {string} One of: 'created', 'paid', 'failed', 'refunded'.
   */
  normalizeStatus(_providerStatus) {
    throw new Error('Method not implemented');
  }
}

export default IPaymentProvider;
