/**
 * @fileoverview Database models associations.
 * @module shared/config/associations
 */

import Song from '../../features/songs/song.model.js';
import Playlist from '../../features/playlists/playlist.model.js';
import User from '../../features/auth/user.model.js';
import Album from '../../features/songs/album.model.js';
import PlayerHistory from '../../features/player/history.model.js';
import PlayerQueue from '../../features/player/queue.model.js';
import Subscription from '../../features/payments/models/subscription.model.js';
import Payment from '../../features/payments/models/payment.model.js';
import { DataTypes } from 'sequelize';
import sequelize from './database.js';

/**
 * Joint table for Playlist and Song (Many-to-Many)
 */
const PlaylistSong = sequelize.define('PlaylistSong', {
  order: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  }
}, { timestamps: false, underscored: true, tableName: 'playlist_songs' });

/**
 * Joint table for Favorites (User and Song Many-to-Many)
 */
const Favorite = sequelize.define('Favorite', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  }
}, { timestamps: true, underscored: true, tableName: 'favorites' });

/**
 * Joint table for Favorite Albums (User and Album Many-to-Many)
 */
const FavoriteAlbum = sequelize.define('FavoriteAlbum', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  }
}, { timestamps: true, underscored: true, tableName: 'favorite_albums' });

/**
 * Define Associations
 */
export const setupAssociations = () => {
  // User <-> Playlist (One-to-Many)
  User.hasMany(Playlist, { foreignKey: 'userId' });
  Playlist.belongsTo(User, { foreignKey: 'userId' });

  // User <-> Album (One-to-Many)
  User.hasMany(Album, { foreignKey: 'artistId', as: 'albums' });
  Album.belongsTo(User, { foreignKey: 'artistId', as: 'artist' });

  // User <-> Song (One-to-Many as Artist/Uploader)
  User.hasMany(Song, { foreignKey: 'artistId', as: 'uploadedSongs' });
  Song.belongsTo(User, { foreignKey: 'artistId', as: 'artist' });

  // Album <-> Song (One-to-Many)
  Album.hasMany(Song, { foreignKey: 'albumId', as: 'songs' });
  Song.belongsTo(Album, { foreignKey: 'albumId', as: 'album' });

  // User <-> Favorite (Many-to-Many via Song)
  User.belongsToMany(Song, { through: Favorite, as: 'favoriteSongs', onDelete: 'CASCADE' });
  Song.belongsToMany(User, { through: Favorite, as: 'favoritedBy', onDelete: 'CASCADE' });

  // Junction table associations for direct queries (Songs)
  Favorite.belongsTo(Song, { foreignKey: 'songId', onDelete: 'CASCADE' });
  Favorite.belongsTo(User, { foreignKey: 'userId', onDelete: 'CASCADE' });
  Song.hasMany(Favorite, { foreignKey: 'songId', onDelete: 'CASCADE' });
  User.hasMany(Favorite, { foreignKey: 'userId', onDelete: 'CASCADE' });

  // User <-> FavoriteAlbum (Many-to-Many via Album)
  User.belongsToMany(Album, { through: FavoriteAlbum, as: 'favoriteAlbums', onDelete: 'CASCADE' });
  Album.belongsToMany(User, { through: FavoriteAlbum, as: 'favoritedBy', onDelete: 'CASCADE' });

  // Junction table associations for direct queries (Albums)
  FavoriteAlbum.belongsTo(Album, { foreignKey: 'albumId', onDelete: 'CASCADE' });
  FavoriteAlbum.belongsTo(User, { foreignKey: 'userId', onDelete: 'CASCADE' });
  Album.hasMany(FavoriteAlbum, { foreignKey: 'albumId', onDelete: 'CASCADE' });
  User.hasMany(FavoriteAlbum, { foreignKey: 'userId', onDelete: 'CASCADE' });

  // Playlist <-> Song (Many-to-Many)
  Playlist.belongsToMany(Song, { through: PlaylistSong, as: 'songs' });
  Song.belongsToMany(Playlist, { through: PlaylistSong });


  // Player History
  User.hasMany(PlayerHistory, { foreignKey: 'userId' });
  PlayerHistory.belongsTo(User, { foreignKey: 'userId' });
  Song.hasMany(PlayerHistory, { foreignKey: 'songId' });
  PlayerHistory.belongsTo(Song, { foreignKey: 'songId' });

  // Player Queue
  User.hasMany(PlayerQueue, { foreignKey: 'userId' });
  PlayerQueue.belongsTo(User, { foreignKey: 'userId' });
  Song.hasMany(PlayerQueue, { foreignKey: 'songId' });
  PlayerQueue.belongsTo(Song, { foreignKey: 'songId' });

  // Payment & Subscription
  User.hasMany(Subscription, { foreignKey: 'userId', as: 'subscriptions' });
  Subscription.belongsTo(User, { foreignKey: 'userId' });

  User.hasMany(Payment, { foreignKey: 'userId', as: 'payments' });
  Payment.belongsTo(User, { foreignKey: 'userId' });

  Subscription.hasMany(Payment, { foreignKey: 'subscriptionId', as: 'payments' });
  Payment.belongsTo(Subscription, { foreignKey: 'subscriptionId' });
};

export { PlaylistSong, Favorite, FavoriteAlbum, User, PlayerHistory, PlayerQueue, Album, Subscription, Payment };
