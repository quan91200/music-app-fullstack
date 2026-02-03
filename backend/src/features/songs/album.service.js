/**
 * @fileoverview Album Service handling album business logic.
 * @module features/songs/album.service
 */

import { BaseService, AppError } from '../../core/index.js';
import AlbumRepository from './album.repository.js';
import SupabaseStorage from '../../shared/utils/SupabaseStorage.js';

/**
 * Service class for Album management.
 */
class AlbumService extends BaseService {
  constructor() {
    super(AlbumRepository);
  }

  /**
   * Create a new album.
   * @param {Object} albumData 
   * @returns {Promise<Object>}
   */
  async createAlbum(albumData) {
    const album = await this.create(albumData);
    return await SupabaseStorage.signAlbumUrls(album);
  }

  async getAlbumById(id) {
    const album = await AlbumRepository.findByIdWithSongs(id);
    if (!album) throw AppError.notFound('Album not found');
    return await SupabaseStorage.signAlbumUrls(album);
  }

  /**
   * Get all albums with songs.
   * @returns {Promise<Array>}
   */
  async getAllAlbums() {
    const albums = await AlbumRepository.findAllWithSongs();
    return await Promise.all(albums.map(album => SupabaseStorage.signAlbumUrls(album)));
  }

  /**
   * Get albums for an artist.
   * @param {string} artistId 
   * @returns {Promise<Array>}
   */
  async getArtistAlbums(artistId) {
    const albums = await AlbumRepository.findByArtistWithSongs(artistId);
    return await Promise.all(albums.map(album => SupabaseStorage.signAlbumUrls(album)));
  }

  /**
   * Delete an album.
   * @param {string} id 
   * @param {string} artistId 
   */
  async deleteAlbum(id, artistId) {
    const album = await this.getById(id);
    if (album.artistId !== artistId) {
      throw AppError.forbidden('You do not have permission to delete this album.');
    }

    // Delete cover from storage
    if (album.coverUrl) {
      try {
        await SupabaseStorage.delete(album.coverUrl, process.env.SUPABASE_BUCKET_ARTWORK);
      } catch (error) {
        // continue
      }
    }

    await album.destroy();
  }

  /**
   * Update an album.
   * @param {string} id 
   * @param {string} artistId 
   * @param {Object} data 
   * @param {Object} coverFile 
   * @returns {Promise<Object>}
   */
  async updateAlbum(id, artistId, data, coverFile) {
    const album = await this.getById(id);
    if (album.artistId !== artistId) {
      throw AppError.forbidden('You do not have permission to update this album.');
    }

    const { title, description, removeCover } = data;
    if (title) album.title = title;
    if (description) album.description = description;

    const bucket = process.env.SUPABASE_BUCKET_ARTWORK;

    if (coverFile || removeCover === 'true' || removeCover === true) {
      if (album.coverUrl) {
        try {
          await SupabaseStorage.delete(album.coverUrl, bucket);
        } catch (delError) {
          // ignore
        }
      }

      if (coverFile) {
        const fileName = `albums/${id}-${Date.now()}`;
        const uploadPath = await SupabaseStorage.upload(
          coverFile.buffer,
          fileName,
          coverFile.mimetype,
          bucket
        );
        album.coverUrl = uploadPath;
      } else {
        album.coverUrl = null;
      }
    }

    await album.save();
    const updatedAlbum = await AlbumRepository.findByIdWithSongs(id);
    return await SupabaseStorage.signAlbumUrls(updatedAlbum);
  }
}

export default new AlbumService();
