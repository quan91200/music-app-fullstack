/**
 * @fileoverview Song model definition.
 * @module features/songs/song.model
 */

import { DataTypes } from 'sequelize';
import sequelize from '../../shared/config/database.js';

/**
 * Song Entity definition
 */
const Song = sequelize.define('Song', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  artistId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  artistName: {
    type: DataTypes.STRING,
    allowNull: true
  },
  albumId: {
    type: DataTypes.UUID,
    allowNull: true
  },
  audioUrl: {
    type: DataTypes.STRING,
    allowNull: false
    // Removed isUrl validation - we store file paths, not full URLs
  },
  coverUrl: {
    type: DataTypes.STRING,
    allowNull: true
    // Removed isUrl validation - we store file paths, not full URLs
  },
  duration: {
    type: DataTypes.INTEGER, // in seconds
    allowNull: false,
    defaultValue: 0
  },
  genre: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  timestamps: true,
  underscored: true,
  tableName: 'songs'
});

export default Song;
