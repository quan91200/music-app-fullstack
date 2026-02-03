/**
 * @fileoverview Playlist model definition.
 * @module features/playlists/playlist.model
 */

import { DataTypes } from 'sequelize';
import sequelize from '../../shared/config/database.js';

const Playlist = sequelize.define('Playlist', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  coverUrl: {
    type: DataTypes.STRING,
    allowNull: true
  },
  isPrivate: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  timestamps: true,
  underscored: true,
  tableName: 'playlists'
});

export default Playlist;
