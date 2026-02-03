/**
 * @fileoverview Supabase Storage Utility Helper (Class-based).
 * @module shared/utils/SupabaseStorage
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import Logger from './logger/Logger.js';

dotenv.config();

/**
 * Utility class for interacting with Supabase Storage.
 * Managed as a Singleton for backend file operations.
 */
class SupabaseStorage {
  constructor() {
    this.supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );
  }

  /**
   * Sanitize filename to remove special characters and Vietnamese diacritics.
   * @param {string} filename - Original filename.
   * @returns {string} - Sanitized filename safe for storage.
   */
  sanitizeFileName(filename) {
    const vietnameseMap = {
      'à': 'a', 'á': 'a', 'ạ': 'a', 'ả': 'a', 'ã': 'a', 'â': 'a', 'ầ': 'a', 'ấ': 'a', 'ậ': 'a', 'ẩ': 'a', 'ẫ': 'a',
      'ă': 'a', 'ằ': 'a', 'ắ': 'a', 'ặ': 'a', 'ẳ': 'a', 'ẵ': 'a',
      'è': 'e', 'é': 'e', 'ẹ': 'e', 'ẻ': 'e', 'ẽ': 'e', 'ê': 'e', 'ề': 'e', 'ế': 'e', 'ệ': 'e', 'ể': 'e', 'ễ': 'e',
      'ì': 'i', 'í': 'i', 'ị': 'i', 'ỉ': 'i', 'ĩ': 'i',
      'ò': 'o', 'ó': 'o', 'ọ': 'o', 'ỏ': 'o', 'õ': 'o', 'ô': 'o', 'ồ': 'o', 'ố': 'o', 'ộ': 'o', 'ổ': 'o', 'ỗ': 'o',
      'ơ': 'o', 'ờ': 'o', 'ớ': 'o', 'ợ': 'o', 'ở': 'o', 'ỡ': 'o',
      'ù': 'u', 'ú': 'u', 'ụ': 'u', 'ủ': 'u', 'ũ': 'u', 'ư': 'u', 'ừ': 'u', 'ứ': 'u', 'ự': 'u', 'ử': 'u', 'ữ': 'u',
      'ỳ': 'y', 'ý': 'y', 'ỵ': 'y', 'ỷ': 'y', 'ỹ': 'y',
      'đ': 'd',
      'À': 'A', 'Á': 'A', 'Ạ': 'A', 'Ả': 'A', 'Ã': 'A', 'Â': 'A', 'Ầ': 'A', 'Ấ': 'A', 'Ậ': 'A', 'Ẩ': 'A', 'Ẫ': 'A',
      'Ă': 'A', 'Ằ': 'A', 'Ắ': 'A', 'Ặ': 'A', 'Ẳ': 'A', 'Ẵ': 'A',
      'È': 'E', 'É': 'E', 'Ẹ': 'E', 'Ẻ': 'E', 'Ẽ': 'E', 'Ê': 'E', 'Ề': 'E', 'Ế': 'E', 'Ệ': 'E', 'Ể': 'E', 'Ễ': 'E',
      'Ì': 'I', 'Í': 'I', 'Ị': 'I', 'Ỉ': 'I', 'Ĩ': 'I',
      'Ò': 'O', 'Ó': 'O', 'Ọ': 'O', 'Ỏ': 'O', 'Õ': 'O', 'Ô': 'O', 'Ồ': 'O', 'Ố': 'O', 'Ộ': 'O', 'Ổ': 'O', 'Ỗ': 'O',
      'Ơ': 'O', 'Ờ': 'O', 'Ớ': 'O', 'Ợ': 'O', 'Ở': 'O', 'Ỡ': 'O',
      'Ù': 'U', 'Ú': 'U', 'Ụ': 'U', 'Ủ': 'U', 'Ũ': 'U', 'Ư': 'U', 'Ừ': 'U', 'Ứ': 'U', 'Ự': 'U', 'Ử': 'U', 'Ữ': 'U',
      'Ỳ': 'Y', 'Ý': 'Y', 'Ỵ': 'Y', 'Ỷ': 'Y', 'Ỹ': 'Y',
      'Đ': 'D'
    };

    let sanitized = filename.split('').map(char => vietnameseMap[char] || char).join('');
    sanitized = sanitized
      .replace(/\s+/g, '-')
      .replace(/[^a-zA-Z0-9._-]/g, '')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');

    return sanitized;
  }

  /**
   * Upload a file to a specific bucket.
   * @param {Buffer} buffer - File buffer.
   * @param {string} path - Remote path (with folders).
   * @param {string} contentType - Mime type.
   * @param {string} bucket - Bucket name.
   * @returns {Promise<string>} - The path of the uploaded file.
   */
  async upload(buffer, path, contentType, bucket) {
    try {
      const lastSlashIndex = path.lastIndexOf('/');
      const folderPath = lastSlashIndex >= 0 ? path.substring(0, lastSlashIndex + 1) : '';
      const originalFileName = lastSlashIndex >= 0 ? path.substring(lastSlashIndex + 1) : path;
      const sanitizedFileName = this.sanitizeFileName(originalFileName);
      const fullPath = folderPath + sanitizedFileName;

      Logger.debug(`🚀 Uploading to Supabase Storage: ${bucket}/${fullPath} (${contentType})`);

      const { data, error } = await this.supabase.storage
        .from(bucket)
        .upload(fullPath, buffer, { contentType, upsert: false });

      Logger.debug('✅ Supabase upload result', { data, error });

      if (error) throw error;
      return data.path;
    } catch (error) {
      Logger.error('Supabase Storage Upload Error:', error);
      throw new Error(`Storage error: ${error.message}`);
    }
  }

  /**
   * Get a temporary signed URL.
   * @param {string} path - File path in bucket.
   * @param {string} bucket - Bucket name.
   * @param {number} expiresIn - Seconds.
   * @returns {Promise<string>}
   */
  async getSignedUrl(path, bucket, expiresIn = 3600) {
    if (!path) return null;
    try {
      const { data, error } = await this.supabase.storage
        .from(bucket)
        .createSignedUrl(path, expiresIn);

      if (error) throw error;
      return data.signedUrl;
    } catch (error) {
      Logger.error('Supabase Storage Signed URL Error:', error);
      return null;
    }
  }

  /**
   * Helper to sign both audio and cover URLs for a song.
   * @param {Object} songData - Raw song data from DB.
   * @returns {Promise<Object>} - Song data with signed URLs.
   */
  async signSongUrls(songData) {
    if (!songData) return null;
    const data = { ...songData };

    // Handle Audio
    const audioPath = data.audioUrl || data.audio_url;
    if (audioPath) {
      const signed = await this.getSignedUrl(audioPath, process.env.SUPABASE_BUCKET_AUDIO);
      data.audioUrl = signed;
      data.audio_url = signed;
    }

    // Handle Cover
    const coverPath = data.coverUrl || data.cover_url;
    if (coverPath) {
      const signed = await this.getSignedUrl(coverPath, process.env.SUPABASE_BUCKET_ARTWORK);
      data.coverUrl = signed;
      data.cover_url = signed;
    }

    return data;
  }

  /**
   * Helper to sign album/playlist cover and all internal songs.
   * @param {Object} albumData 
   * @returns {Promise<Object>}
   */
  async signAlbumUrls(albumData) {
    if (!albumData) return null;
    const data = albumData.get ? albumData.get({ plain: true }) : { ...albumData };

    const coverPath = data.coverUrl || data.cover_url;
    if (coverPath) {
      const signed = await this.getSignedUrl(coverPath, process.env.SUPABASE_BUCKET_ARTWORK);
      data.coverUrl = signed;
      data.cover_url = signed;
    }

    if (data.songs && Array.isArray(data.songs)) {
      data.songs = await Promise.all(
        data.songs.map(song => this.signSongUrls(song.get ? song.get({ plain: true }) : song))
      );
    }

    return data;
  }

  /**
   * sign Playlist and its songs
   */
  async signPlaylistUrls(playlistData) {
    if (!playlistData) return null;
    const data = playlistData.get ? playlistData.get({ plain: true }) : { ...playlistData };

    const coverPath = data.coverUrl || data.cover_url;
    if (coverPath) {
      const signed = await this.getSignedUrl(coverPath, process.env.SUPABASE_BUCKET_ARTWORK);
      data.coverUrl = signed;
      data.cover_url = signed;
    }

    if (data.songs && Array.isArray(data.songs)) {
      data.songs = await Promise.all(
        data.songs.map(song => this.signSongUrls(song.get ? song.get({ plain: true }) : song))
      );
    }

    return data;
  }

  /**
   * sign User avatar
   */
  async signUserUrls(userData) {
    if (!userData) return null;
    const data = userData.get ? userData.get({ plain: true }) : { ...userData };

    const avatarPath = data.avatarUrl || data.avatar_url;
    if (avatarPath) {
      const signed = await this.getSignedUrl(avatarPath, process.env.SUPABASE_BUCKET_ARTWORK);
      data.avatarUrl = signed;
      data.avatar_url = signed;
    }

    return data;
  }

  /**
   * Delete a file from storage.
   * @param {string} path 
   * @param {string} bucket 
   */
  async delete(path, bucket) {
    try {
      const { error } = await this.supabase.storage
        .from(bucket)
        .remove([path]);
      if (error) throw error;
    } catch (error) {
      Logger.error('Supabase Storage Deletion Error:', error);
    }
  }
}

export default new SupabaseStorage();
