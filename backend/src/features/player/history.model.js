/**
 * @fileoverview Player History model definition.
 * @module features/player/history.model
 */

import { DataTypes } from 'sequelize';
import sequelize from '../../shared/config/database.js';

const PlayerHistory = sequelize.define('PlayerHistory', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  songId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  playedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  timestamps: false,
  underscored: true,
  tableName: 'player_histories'
});

export default PlayerHistory;
