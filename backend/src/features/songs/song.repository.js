/**
 * @fileoverview Song Repository.
 * @module features/songs/song.repository
 */

import { BaseRepository } from '../../core/index.js';
import Song from './song.model.js';

/**
 * Repository for Song model.
 */
class SongRepository extends BaseRepository {
  constructor() {
    super(Song);
  }

  /**
   * Find songs by artist.
   */
  async findByArtist(artistId) {
    return await this.findAll({
      where: { artistId },
      include: ['artist'],
      order: [['createdAt', 'DESC']]
    });
  }

  /**
   * Find all songs with artist info.
   */
  async findAllWithArtist() {
    return await this.findAll({
      include: ['artist'],
      order: [['createdAt', 'DESC']]
    });
  }

  /**
   * Find a single song with artist info.
   */
  async findByIdWithArtist(id) {
    return await this.model.findByPk(id, {
      include: ['artist']
    });
  }
}

export default new SongRepository();
