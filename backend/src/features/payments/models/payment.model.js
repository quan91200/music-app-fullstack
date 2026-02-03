/**
 * @fileoverview Payment model definition (Provider-agnostic).
 * @module features/payments/models/payment.model
 */

import { DataTypes } from 'sequelize';
import sequelize from '../../../shared/config/database.js';

const Payment = sequelize.define('Payment', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  subscriptionId: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'subscriptions',
      key: 'id'
    }
  },
  amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  currency: {
    type: DataTypes.STRING(3),
    defaultValue: 'USD',
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('created', 'paid', 'failed', 'refunded'),
    defaultValue: 'created',
    allowNull: false
  },
  provider: {
    type: DataTypes.STRING,
    allowNull: false // e.g., 'paypal', 'vnpay'
  },
  providerTransactionId: {
    type: DataTypes.STRING,
    allowNull: true
  },
  idempotencyKey: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: true // Combination of provider and transaction ID or random generated
  },
  processedAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  metadata: {
    type: DataTypes.JSON,
    allowNull: true
  }
}, {
  timestamps: true,
  underscored: true,
  tableName: 'payments'
});

export default Payment;
