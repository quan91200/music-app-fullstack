/**
 * @fileoverview Song and Album Validator.
 * @module features/songs/song.validator
 */

import { BaseValidator } from '../../core/index.js';

class SongValidator extends BaseValidator {
  /**
   * Validate upload song.
   */
  validateUpload(data) {
    this.checkRequired(data, ['title', 'artistId']);
    this.checkUUID(data.artistId, 'artist id');
    if (data.albumId) this.checkUUID(data.albumId, 'album id');
  }

  /**
   * Validate album creation.
   */
  validateAlbum(data) {
    this.checkRequired(data, ['title', 'artistId']);
    this.checkUUID(data.artistId, 'artist id');
  }
}

export default new SongValidator();
