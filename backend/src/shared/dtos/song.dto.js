/**
 * @fileoverview Data Transfer Objects for Song feature.
 * @module shared/dtos/song.dto
 */

import { BaseDTO } from '../../core/index.js';

/**
 * Song DTO.
 */
export class SongDTO extends BaseDTO {
  constructor(song) {
    super();
    this.id = song.id;
    this.title = song.title;
    this.artistId = song.artistId;
    this.artistName = song.artistName;
    this.albumId = song.albumId;
    this.audioUrl = song.audioUrl;
    this.coverUrl = song.coverUrl;
    this.duration = song.duration;
    this.genre = song.genre;
    this.createdAt = song.createdAt;
    this.artist = {
      id: song.artist?.id || song.artistId,
      name: song.artistName || song.artist?.fullName || 'Unknown Artist',
      avatarUrl: song.artist?.avatarUrl || null
    };
  }

  static fromModel(song) {
    if (!song) return null;
    return new SongDTO(song);
  }
}

/**
 * Artist DTO for public profiles.
 */
export class ArtistDTO extends BaseDTO {
  constructor(user) {
    super();
    this.id = user.id;
    this.name = user.fullName || 'Unknown Artist';
    this.avatarUrl = user.avatarUrl;
    this.bio = user.bio || '';
  }

  static fromModel(user) {
    if (!user) return null;
    return new ArtistDTO(user);
  }
}
