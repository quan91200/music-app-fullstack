/**
 * @fileoverview Player History Repository.
 * @module features/player/history.repository
 */

import { BaseRepository } from '../../core/index.js';
import PlayerHistory from './history.model.js';
import Song from '../songs/song.model.js';

/**
 * Repository for Player History.
 */
class PlayerHistoryRepository extends BaseRepository {
  constructor() {
    super(PlayerHistory);
  }

  /**
   * Find history by user with song info.
   */
  async findByUserWithSongs(userId, limit = 20) {
    return await this.findAll({
      where: { userId },
      include: [{ model: Song }],
      order: [['playedAt', 'DESC']],
      limit
    });
  }
}

export default new PlayerHistoryRepository();
