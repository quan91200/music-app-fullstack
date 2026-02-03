/**
 * @fileoverview Payment Controller for handling payment HTTP requests.
 * @module features/payments/payment.controller
 */

import paymentService from './payment.service.js';
import subscriptionService from './subscription.service.js';
import { HTTP_STATUS } from '../../shared/constants/index.js';

class PaymentController {
  /**
   * POST /api/payments/create-order
   */
  async createOrder(req, res) {
    try {
      const { plan, provider = 'paypal' } = req.body;
      const userId = req.user.id;

      // Determine amount based on plan
      let amount = 9.99; // Default monthly
      if (plan === 'yearly') amount = 89.99;
      if (plan === 'student') amount = 4.99;

      const order = await paymentService.initiatePayment(userId, amount, provider);

      res.status(HTTP_STATUS.CREATED).json({
        success: true,
        data: order
      });
    } catch (error) {
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message
      });
    }
  }

  /**
   * POST /api/payments/capture
   */
  async captureOrder(req, res) {
    try {
      const { orderId, provider = 'paypal', plan } = req.body;
      const userId = req.user.id;

      if (!orderId) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({
          success: false,
          message: 'orderId is required'
        });
      }

      const payment = await paymentService.capturePayment(orderId, provider);

      if (payment.status === 'paid') {
        const duration = plan === 'yearly' ? 12 : 1;
        // Ensure plan is a valid enum value, default to 'monthly' if 'premium' or other is sent
        const validPlan = ['monthly', 'yearly', 'student'].includes(plan) ? plan : 'monthly';

        await subscriptionService.activateSubscription(userId, validPlan, duration);
      }

      res.status(HTTP_STATUS.OK).json({
        success: true,
        data: payment
      });
    } catch (error) {
      console.error('[PaymentController.captureOrder] Error:', error);
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message || 'Lỗi xử lý thanh toán'
      });
    }
  }

  /**
   * POST /api/payments/webhook/:provider
   */
  async handleWebhook(req, res) {
    try {
      const { provider } = req.params;
      const result = await paymentService.handleWebhook(provider, req.body, req.headers);

      res.status(HTTP_STATUS.OK).json(result);
    } catch (error) {
      console.error('Webhook Error:', error);
      res.status(HTTP_STATUS.OK).json({ success: false }); // Always return OK to provider to avoid retry loops if logic error
    }
  }

  /**
   * GET /api/payments/history
   */
  async getHistory(req, res) {
    try {
      const payments = await paymentService.getHistory(req.user.id);
      res.status(HTTP_STATUS.OK).json({
        success: true,
        data: payments
      });
    } catch (error) {
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message
      });
    }
  }

  /**
   * GET /api/subscriptions/current
   */
  async getCurrentSubscription(req, res) {
    try {
      const subscription = await subscriptionService.getCurrent(req.user.id);
      res.status(HTTP_STATUS.OK).json({
        success: true,
        data: subscription || { plan: 'free', status: 'active' }
      });
    } catch (error) {
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message
      });
    }
  }
}

export default new PaymentController();
