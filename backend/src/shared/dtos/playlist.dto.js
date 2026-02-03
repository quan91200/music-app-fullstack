/**
 * @fileoverview Data Transfer Objects for Playlist feature.
 * @module shared/dtos/playlist.dto
 */

import { BaseDTO } from '../../core/index.js';
import { SongDTO } from './song.dto.js';

/**
 * Playlist DTO.
 */
export class PlaylistDTO extends BaseDTO {
  constructor(playlist) {
    super();
    this.id = playlist.id;
    this.title = playlist.title;
    this.description = playlist.description;
    this.userId = playlist.userId;
    this.isPrivate = playlist.isPrivate;
    this.coverUrl = playlist.coverUrl;
    this.cover_url = playlist.cover_url;
    this.songs = playlist.songs ? SongDTO.fromCollection(playlist.songs) : [];
    this.createdAt = playlist.createdAt;
  }

  static fromModel(playlist) {
    if (!playlist) return null;
    return new PlaylistDTO(playlist);
  }
}
