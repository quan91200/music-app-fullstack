/**
 * @fileoverview Player Service handling queue and history logic.
 * @module features/player/player.service
 */

import { BaseService } from '../../core/index.js';
import PlayerHistoryRepository from './history.repository.js';
import PlayerQueueRepository from './queue.repository.js';

/**
 * Service class for Player state management.
 */
class PlayerService extends BaseService {
  constructor() {
    super(PlayerHistoryRepository);
  }

  /**
   * Add a song to play history.
   * @param {string} userId 
   * @param {string} songId 
   */
  async addToHistory(userId, songId) {
    return await PlayerHistoryRepository.create({ userId, songId });
  }

  /**
   * Get play history for a user.
   * @param {string} userId 
   * @param {number} limit 
   * @returns {Promise<Array>}
   */
  async getHistory(userId, limit = 20) {
    return await PlayerHistoryRepository.findByUserWithSongs(userId, limit);
  }

  /**
   * Update the player queue for a user.
   * @param {string} userId 
   * @param {Array} items - Array of { songId, position }
   * @returns {Promise<Array>}
   */
  async updateQueue(userId, items) {
    await PlayerQueueRepository.clear(userId);

    const queueData = items.map(item => ({
      userId,
      songId: item.songId,
      position: item.position
    }));

    return await PlayerQueueRepository.bulkCreateQueue(queueData);
  }

  /**
   * Get current queue for a user.
   * @param {string} userId 
   * @returns {Promise<Array>}
   */
  async getQueue(userId) {
    return await PlayerQueueRepository.findByUserWithSongs(userId);
  }
}

export default new PlayerService();
