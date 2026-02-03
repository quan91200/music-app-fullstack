/**
 * @fileoverview User model definition (links with Supabase Auth ID).
 * @module features/auth/user.model
 */

import { DataTypes } from 'sequelize';
import sequelize from '../../shared/config/database.js';

const User = sequelize.define('User', {
  id: {
    type: DataTypes.UUID,
    primaryKey: true, // This will be the Supabase User UID
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  fullName: {
    type: DataTypes.STRING,
    allowNull: true
  },
  avatarUrl: {
    type: DataTypes.STRING,
    allowNull: true
  },
  bio: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  timestamps: true,
  underscored: true,
  tableName: 'users'
});

export default User;
