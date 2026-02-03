/**
 * @fileoverview Player Queue Repository.
 * @module features/player/queue.repository
 */

import { BaseRepository } from '../../core/index.js';
import PlayerQueue from './queue.model.js';
import Song from '../songs/song.model.js';

/**
 * Repository for Player Queue.
 */
class PlayerQueueRepository extends BaseRepository {
  constructor() {
    super(PlayerQueue);
  }

  /**
   * Find queue by user with song info.
   */
  async findByUserWithSongs(userId) {
    return await this.findAll({
      where: { userId },
      include: [{ model: Song }],
      order: [['position', 'ASC']]
    });
  }

  /**
   * Clear user queue.
   */
  async clear(userId) {
    return await this.delete({ where: { userId } });
  }

  /**
   * Bulk create queue items.
   */
  async bulkCreateQueue(items) {
    return await this.model.bulkCreate(items);
  }
}

export default new PlayerQueueRepository();
