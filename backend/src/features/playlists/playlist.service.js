/**
 * @fileoverview Playlist Service handling playlist business logic.
 * @module features/playlists/playlist.service
 */

import { BaseService, AppError } from '../../core/index.js';
import PlaylistRepository from './playlist.repository.js';
import Song from '../songs/song.model.js';
import SupabaseStorage from '../../shared/utils/SupabaseStorage.js';

/**
 * Service class for Playlist management.
 */
class PlaylistService extends BaseService {
  constructor() {
    super(PlaylistRepository);
  }

  /**
   * Create a new playlist.
   * @param {Object} data 
   * @returns {Promise<Object>}
   */
  async createPlaylist(data) {
    const playlist = await this.create(data);
    return await SupabaseStorage.signPlaylistUrls(playlist);
  }

  async getPlaylistById(id, userId) {
    const playlist = await PlaylistRepository.findByIdWithSongs(id);
    if (!playlist) throw AppError.notFound('Playlist not found');
    // If private, check ownership
    if (playlist.isPrivate && playlist.userId !== userId) {
      throw AppError.forbidden();
    }
    return await SupabaseStorage.signPlaylistUrls(playlist);
  }

  /**
   * Add a song to a playlist.
   * @param {string} playlistId 
   * @param {string} userId 
   * @param {string} songId 
   */
  async addSong(playlistId, userId, songId) {
    const playlist = await this.getById(playlistId);
    if (playlist.userId !== userId) throw AppError.forbidden();

    const song = await Song.findByPk(songId);
    if (!song) throw AppError.notFound('Song not found.');

    await playlist.addSong(song);
  }

  /**
   * Get all playlists for a user.
   * @param {string} userId 
   * @returns {Promise<Array>}
   */
  async getUserPlaylists(userId) {
    const playlists = await PlaylistRepository.findByUserWithSongs(userId);
    return await Promise.all(playlists.map(p => SupabaseStorage.signPlaylistUrls(p)));
  }

  /**
   * Update playlist details.
   * @param {string} id 
   * @param {string} userId 
   * @param {Object} data 
   * @param {Object} coverFile
   * @returns {Promise<Object>}
   */
  async updatePlaylist(id, userId, data, coverFile) {
    const playlist = await this.getById(id);
    if (playlist.userId !== userId) throw AppError.forbidden();

    const { title, description, isPrivate, removeCover } = data;
    if (title) playlist.title = title;
    if (description) playlist.description = description;
    if (isPrivate !== undefined) playlist.isPrivate = isPrivate;

    const bucket = process.env.SUPABASE_BUCKET_ARTWORK;

    if (coverFile || removeCover === 'true' || removeCover === true) {
      if (playlist.coverUrl) {
        try {
          await SupabaseStorage.delete(playlist.coverUrl, bucket);
        } catch (_error) {
          // ignore
        }
      }

      if (coverFile) {
        const fileName = `playlists/${id}-${Date.now()}`;
        const uploadPath = await SupabaseStorage.upload(
          coverFile.buffer,
          fileName,
          coverFile.mimetype,
          bucket
        );
        playlist.coverUrl = uploadPath;
      } else {
        playlist.coverUrl = null;
      }
    }

    await playlist.save();
    const updatedPlaylist = await PlaylistRepository.findByIdWithSongs(id);
    return await SupabaseStorage.signPlaylistUrls(updatedPlaylist);
  }

  /**
   * Delete a playlist.
   * @param {string} id 
   * @param {string} userId 
   */
  async deletePlaylist(id, userId) {
    const playlist = await this.getById(id);
    if (playlist.userId !== userId) throw AppError.forbidden();

    // Delete cover file from storage if exists
    if (playlist.coverUrl) {
      try {
        await SupabaseStorage.delete(playlist.coverUrl, process.env.SUPABASE_BUCKET_ARTWORK);
      } catch (_error) {
        // continue
      }
    }

    await playlist.destroy();
  }
}

export default new PlaylistService();
