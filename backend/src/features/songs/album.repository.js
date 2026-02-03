/**
 * @fileoverview Album Repository.
 * @module features/songs/album.repository
 */

import { BaseRepository } from '../../core/index.js';
import Album from './album.model.js';
import Song from './song.model.js';

/**
 * Repository for Album model.
 */
class AlbumRepository extends BaseRepository {
  constructor() {
    super(Album);
  }

  /**
   * Find albums by artist with songs.
   */
  async findByArtistWithSongs(artistId) {
    return await this.findAll({
      where: { artistId },
      include: [{ model: Song, as: 'songs' }]
    });
  }

  /**
   * Find album by ID with songs.
   */
  async findByIdWithSongs(id) {
    return await this.findById(id, {
      include: [{ model: Song, as: 'songs' }]
    });
  }

  /**
   * Find all albums with songs.
   */
  async findAllWithSongs() {
    return await this.findAll({
      include: [{ model: Song, as: 'songs' }]
    });
  }
}

export default new AlbumRepository();
