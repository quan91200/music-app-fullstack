/**
 * @fileoverview Player Queue model definition.
 * @module features/player/queue.model
 */

import { DataTypes } from 'sequelize';
import sequelize from '../../shared/config/database.js';

const PlayerQueue = sequelize.define('PlayerQueue', {
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
  position: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  timestamps: true,
  underscored: true,
  tableName: 'player_queues'
});

export default PlayerQueue;
