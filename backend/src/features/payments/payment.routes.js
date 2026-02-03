/**
 * @fileoverview Payment routes definition.
 * @module features/payments/payment.routes
 */

import express from 'express';
import paymentController from './payment.controller.js';
import { authenticate } from '../../shared/middlewares/auth.middleware.js';

const router = express.Router();

/**
 * @route POST /api/payments/create-order
 * @desc Create a new payment order
 */
router.post('/create-order', authenticate, paymentController.createOrder);

/**
 * @route POST /api/payments/capture
 * @desc Capture/Finalize an approved order
 */
router.post('/capture', authenticate, paymentController.captureOrder);

/**
 * @route GET /api/payments/history
 * @desc Get user payment history
 */
router.get('/history', authenticate, paymentController.getHistory);

/**
 * @route GET /api/payments/subscription
 * @desc Get current subscription status
 */
router.get('/subscription', authenticate, paymentController.getCurrentSubscription);

/**
 * @route POST /api/payments/webhook/:provider
 * @desc External provider webhook endpoint
 * @note Does NOT use authenticate middleware as it comes from provider
 */
router.post('/webhook/:provider', paymentController.handleWebhook);

export default router;
