/**
 * @fileoverview Favorite Repository.
 * @module features/favorites/favorite.repository
 */

import { BaseRepository } from '../../core/index.js';
import { Favorite } from '../../shared/config/associations.js';
import Song from '../songs/song.model.js';

/**
 * Repository for Favorite songs.
 */
class FavoriteRepository extends BaseRepository {
  constructor() {
    super(Favorite);
  }

  /**
   * Find favorites by user with song info.
   */
  async findByUserWithSongs(userId) {
    return await this.findAll({
      where: { userId },
      include: [{
        model: Song,
        include: ['artist']
      }]
    });
  }
}

export default new FavoriteRepository();
