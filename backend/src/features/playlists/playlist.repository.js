/**
 * @fileoverview Playlist Repository.
 * @module features/playlists/playlist.repository
 */

import { BaseRepository } from '../../core/index.js';
import Playlist from './playlist.model.js';
import Song from '../songs/song.model.js';

/**
 * Repository for Playlist model.
 */
class PlaylistRepository extends BaseRepository {
  constructor() {
    super(Playlist);
  }

  /**
   * Find playlists by user with songs.
   */
  async findByUserWithSongs(userId) {
    return await this.findAll({
      where: { userId },
      include: [{ model: Song, as: 'songs' }]
    });
  }

  async findByIdWithSongs(id) {
    return await this.findById(id, {
      include: [{ model: Song, as: 'songs' }]
    });
  }
}

export default new PlaylistRepository();
