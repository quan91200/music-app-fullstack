/**
 * @fileoverview Favorite Album Repository.
 * @module features/favorites/album.favorite.repository
 */

import { BaseRepository } from '../../core/index.js';
import { FavoriteAlbum } from '../../shared/config/associations.js';
import Album from '../songs/album.model.js';
import User from '../auth/user.model.js';

/**
 * Repository for Favorite albums.
 */
class FavoriteAlbumRepository extends BaseRepository {
  constructor() {
    super(FavoriteAlbum);
  }

  /**
   * Find favorite albums by user with album info.
   */
  async findByUserWithAlbums(userId) {
    return await this.findAll({
      where: { userId },
      include: [{
        model: Album,
        include: [{ model: User, as: 'artist' }]
      }]
    });
  }
}

export default new FavoriteAlbumRepository();
