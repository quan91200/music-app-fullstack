/**
 * @fileoverview Playlist Validator.
 * @module features/playlists/playlist.validator
 */

import { BaseValidator } from '../../core/index.js';

class PlaylistValidator extends BaseValidator {
  /**
   * Validate playlist creation or update.
   */
  validatePlaylist(data) {
    this.checkRequired(data, ['title']);
  }

  /**
   * Validate add song to playlist.
   */
  validateAddSong(params) {
    this.checkRequired(params, ['playlistId', 'songId']);
    this.checkUUID(params.playlistId, 'playlist id');
    this.checkUUID(params.songId, 'song id');
  }
}

export default new PlaylistValidator();
