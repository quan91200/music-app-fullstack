/**
 * @fileoverview Song Service handling song business logic.
 * @module features/songs/song.service
 */

import { BaseService, AppError } from '../../core/index.js';
import SongRepository from './song.repository.js';
import SupabaseStorage from '../../shared/utils/SupabaseStorage.js';
import { STORAGE_FOLDERS } from '../../shared/constants/index.js';

/**
 * Service class for Song management.
 */
class SongService extends BaseService {
  constructor() {
    super(SongRepository);
  }

  /**
   * Create a new song with files.
   * @param {Object} songData - Metadata.
   * @param {Object} files - Uploaded files (audio, cover).
   * @returns {Promise<Object>}
   */
  async createSong(songData, files) {
    const { title, artistId, artistName, albumId, duration, genre } = songData;

    // 1. Upload Audio
    const audioPath = `${STORAGE_FOLDERS.AUDIO}/${Date.now()}-${files.audio[0].originalname}`;
    const audioUrl = await SupabaseStorage.upload(
      files.audio[0].buffer,
      audioPath,
      files.audio[0].mimetype,
      process.env.SUPABASE_BUCKET_AUDIO
    );

    // 2. Upload Cover (Optional)
    let coverUrl = null;
    if (files.cover) {
      const coverPath = `${STORAGE_FOLDERS.ARTWORK}/${Date.now()}-${files.cover[0].originalname}`;
      coverUrl = await SupabaseStorage.upload(
        files.cover[0].buffer,
        coverPath,
        files.cover[0].mimetype,
        process.env.SUPABASE_BUCKET_ARTWORK
      );
    }

    // 3. Save to DB
    const song = await SongRepository.create({
      title,
      artistId,
      artistName,
      albumId: albumId || null,
      audioUrl,
      coverUrl,
      duration: parseInt(duration) || 0,
      genre
    });

    return await SupabaseStorage.signSongUrls(song.get({ plain: true }));
  }

  /**
   * Get all songs.
   * @returns {Promise<Array>}
   */
  async getAllSongs() {
    const songs = await SongRepository.findAllWithArtist();
    return await Promise.all(songs.map(song =>
      SupabaseStorage.signSongUrls(song.get({ plain: true }))
    ));
  }

  /**
   * Get songs by artist.
   * @param {string} artistId 
   * @returns {Promise<Array>}
   */
  async getMySongs(artistId) {
    const songs = await SongRepository.findByArtist(artistId);
    return await Promise.all(songs.map(song =>
      SupabaseStorage.signSongUrls(song.get({ plain: true }))
    ));
  }

  /**
   * Update song details.
   * @param {string} id 
   * @param {string} artistId 
   * @param {Object} updateData 
   * @param {Object} files 
   * @returns {Promise<Object>}
   */
  async updateSong(id, artistId, updateData, files) {
    const song = await this.getById(id);
    if (song.artistId !== artistId) {
      throw AppError.forbidden('You do not have permission to edit this song.');
    }

    const { title, genre, artistName, albumId, removeCover } = updateData;
    if (title) song.title = title;
    if (genre) song.genre = genre;
    if (artistName) song.artistName = artistName;
    if (albumId !== undefined) song.albumId = albumId;

    const bucket = process.env.SUPABASE_BUCKET_ARTWORK;

    if ((files && files.cover) || removeCover === 'true' || removeCover === true) {
      // Delete old cover if exists
      if (song.coverUrl) {
        try {
          await SupabaseStorage.delete(song.coverUrl, bucket);
        } catch (_error) {
          // ignore
        }
      }

      if (files && files.cover) {
        const coverPath = `${STORAGE_FOLDERS.ARTWORK}/${Date.now()}-${files.cover[0].originalname}`;
        song.coverUrl = await SupabaseStorage.upload(
          files.cover[0].buffer,
          coverPath,
          files.cover[0].mimetype,
          bucket
        );
      } else {
        song.coverUrl = null;
      }
    }

    await song.save();
    return await SupabaseStorage.signSongUrls(song.get({ plain: true }));
  }

  /**
   * Delete a song.
   * @param {string} id 
   * @param {string} artistId 
   */
  async deleteSong(id, artistId) {
    const song = await this.getById(id);
    if (song.artistId !== artistId) {
      throw AppError.forbidden('You do not have permission to delete this song.');
    }

    // 1. Delete Audio from storage
    if (song.audioUrl) {
      try {
        await SupabaseStorage.delete(song.audioUrl, process.env.SUPABASE_BUCKET_AUDIO);
      } catch (_error) {
        // Log but continue
      }
    }

    // 2. Delete Cover from storage
    if (song.coverUrl) {
      try {
        await SupabaseStorage.delete(song.coverUrl, process.env.SUPABASE_BUCKET_ARTWORK);
      } catch (_error) {
        // Log but continue
      }
    }

    await song.destroy();
  }

  /**
   * Get a single song by ID.
   * @param {string} id 
   * @returns {Promise<Object>}
   */
  async getSongById(id) {
    const song = await SongRepository.findByIdWithArtist(id);
    if (!song) throw AppError.notFound('Song not found');
    return await SupabaseStorage.signSongUrls(song.get({ plain: true }));
  }
}

export default new SongService();
