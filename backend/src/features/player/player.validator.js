/**
 * @fileoverview Player Validator.
 * @module features/player/player.validator
 */

import { BaseValidator, AppError } from '../../core/index.js';

class PlayerValidator extends BaseValidator {
  /**
   * Validate history entry.
   */
  validateHistory(data) {
    this.checkRequired(data, ['songId']);
    this.checkUUID(data.songId, 'song id');
  }

  /**
   * Validate queue update.
   */
  validateQueue(items) {
    if (!Array.isArray(items)) {
      throw AppError.badRequest('Queue items must be an array.');
    }
    items.forEach((item, index) => {
      this.checkRequired(item, ['songId', 'position']);
      this.checkUUID(item.songId, `song id at index ${index}`);
    });
  }
}

export default new PlayerValidator();
