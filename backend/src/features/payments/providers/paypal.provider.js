/**
 * @fileoverview PayPal Payment Provider implementation.
 * @module features/payments/providers/paypal.provider
 */

import paypal from '@paypal/checkout-server-sdk';
import IPaymentProvider from './IPaymentProvider.js';

class PaypalProvider extends IPaymentProvider {
  constructor() {
    super();
    const clientId = process.env.PAYPAL_CLIENT_ID;
    const clientSecret = process.env.PAYPAL_CLIENT_SECRET;
    const environment = process.env.PAYPAL_MODE === 'live'
      ? new paypal.core.LiveEnvironment(clientId, clientSecret)
      : new paypal.core.SandboxEnvironment(clientId, clientSecret);

    this.client = new paypal.core.PayPalHttpClient(environment);
  }

  async createOrder(
    amount,
    currency = 'USD',
    metadata = {}
  ) {
    const request = new paypal.orders.OrdersCreateRequest();
    request.prefer("return=representation");
    request.requestBody({
      intent: 'CAPTURE',
      purchase_units: [{
        amount: {
          currency_code: currency,
          value: amount.toString()
        },
        custom_id: metadata.userId // Pass userId to track easily
      }]
    });

    try {
      const response = await this.client.execute(request);
      return {
        id: response.result.id,
        links: response.result.links,
        status: this.normalizeStatus(response.result.status)
      };
    } catch (error) {
      console.error('PayPal Create Order Error:', error);
      throw error;
    }
  }

  async captureOrder(orderId) {
    const request = new paypal.orders.OrdersCaptureRequest(orderId);
    request.requestBody({});

    try {
      const response = await this.client.execute(request);
      const capture = response.result.purchase_units[0].payments.captures[0];

      return {
        transactionId: capture.id,
        status: this.normalizeStatus(capture.status),
        raw: response.result
      };
    } catch (error) {
      console.error('PayPal Capture Order Error:', error);
      throw error;
    }
  }

  async refundOrder(transactionId) {
    const request = new paypal.payments.CapturesRefundRequest(transactionId);
    request.requestBody({});

    try {
      const response = await this.client.execute(request);
      return {
        id: response.result.id,
        status: this.normalizeStatus(response.result.status)
      };
    } catch (error) {
      console.error('PayPal Refund Error:', error);
      throw error;
    }
  }

  normalizeStatus(providerStatus) {
    const map = {
      'CREATED': 'created',
      'SAVED': 'created',
      'APPROVED': 'created',
      'VOIDED': 'failed',
      'COMPLETED': 'paid',
      'PAYER_ACTION_REQUIRED': 'created',
      'REFUNDED': 'refunded',
      'PARTIALLY_REFUNDED': 'refunded',
      'PENDING': 'created',
      'FAILED': 'failed',
      'DENIED': 'failed'
    };
    return map[providerStatus] || 'created';
  }

  async verifyWebhook(payload, _headers) {
    // Note: Verification usually requires another PayPal SDK call or manual signature check
    // For now, we normalize the status from the payload
    const eventType = payload.event_type;
    let status = 'created';

    if (eventType === 'PAYMENT.CAPTURE.COMPLETED') {
      status = 'paid';
    } else if (eventType === 'PAYMENT.CAPTURE.DENIED' || eventType === 'PAYMENT.CAPTURE.REFUNDED') {
      status = eventType.includes('REFUNDED') ? 'refunded' : 'failed';
    }

    return {
      transactionId: payload.resource.id,
      status: status,
      event: eventType
    };
  }
}

export default new PaypalProvider();
