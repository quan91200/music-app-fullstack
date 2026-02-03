/**
 * @fileoverview Subscription Service for managing user plans.
 * @module features/payments/subscription.service
 */

import { Subscription, User } from '../../shared/config/associations.js';
import { Op } from 'sequelize';
import Logger from '../../shared/utils/logger/Logger.js';

class SubscriptionService {
  /**
   * Get current subscription for a user.
   */
  async getCurrent(userId) {
    return Subscription.findOne({
      where: { userId, status: 'active' },
      order: [['endDate', 'DESC']]
    });
  }

  /**
   * Activate or upgrade a subscription.
   * @param {string} userId - User ID.
   * @param {string} plan - 'premium', etc.
   * @param {number} months - Duration in months.
   */
  async activateSubscription(userId, plan, months = 1) {
    const startDate = new Date();
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + months);

    // Cancel existing active subscriptions
    await Subscription.update(
      { status: 'cancelled' },
      { where: { userId, status: 'active' } }
    );

    const subscription = await Subscription.create({
      userId,
      plan,
      status: 'active',
      startDate,
      endDate,
      autoRenew: true
    });

    Logger.info(`Subscription activated: User ${userId} -> Plan ${plan}`);
    return subscription;
  }

  /**
   * Cancel a subscription.
   */
  async cancelSubscription(subscriptionId) {
    const sub = await Subscription.findByPk(subscriptionId);
    if (sub) {
      await sub.update({ status: 'cancelled' });
      return true;
    }
    return false;
  }

  /**
   * Cron-friendly method to deactivate expired subscriptions.
   */
  async cleanupExpired() {
    const now = new Date();
    const [count] = await Subscription.update(
      { status: 'expired' },
      { where: { status: 'active', endDate: { [Op.lt]: now } } }
    );
    if (count > 0) {
      Logger.info(`Deactivated ${count} expired subscriptions.`);
    }
  }
}

export default new SubscriptionService();
