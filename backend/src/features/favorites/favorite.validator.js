/**
 * @fileoverview Favorite Validator.
 * @module features/favorites/favorite.validator
 */

import { BaseValidator } from '../../core/index.js';

class FavoriteValidator extends BaseValidator {
  validateToggle(songId) {
    if (!songId) throw new Error('Missing songId');
    this.checkUUID(songId, 'song id');
  }
}

export default new FavoriteValidator();
