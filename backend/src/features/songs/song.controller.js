import Logger from '../../shared/utils/logger/Logger.js';
import { BaseController, AppError } from '../../core/index.js';
import SongService from './song.service.js'
import AuthService from '../../features/auth/auth.service.js'
import SongValidator from './song.validator.js'
import { SongDTO, ArtistDTO } from '../../shared/dtos/song.dto.js';

/**
 * Controller class for Song management.
 */
class SongController extends BaseController {
  upload = async (req, res, next) => {
    try {
      Logger.debug('📁 Received upload request', { body: req.body });
      SongValidator.validateUpload(req.body);
      const files = req.files;
      Logger.debug('📂 Files received:', {
        audio: files?.audio?.[0]?.originalname,
        cover: files?.cover?.[0]?.originalname
      });

      if (!files || !files.audio) {
        throw AppError.badRequest('Audio file is required.');
      }

      const songData = await SongService.createSong(req.body, files);
      return this.sendCreated(res, SongDTO.fromModel(songData));
    } catch (error) {
      next(error);
    }
  };

  getAll = async (_req, res, next) => {
    try {
      const songs = await SongService.getAllSongs();
      return this.sendSuccess(res, songs.map(s => SongDTO.fromModel(s)));
    } catch (error) {
      next(error);
    }
  };

  getMySongs = async (req, res, next) => {
    try {
      const songs = await SongService.getMySongs(req.user.id);
      return this.sendSuccess(res, songs.map(s => SongDTO.fromModel(s)));
    } catch (error) {
      next(error);
    }
  };

  getSongsByArtist = async (req, res, next) => {
    try {
      const songs = await SongService.getMySongs(req.params.id);
      return this.sendSuccess(res, songs.map(s => SongDTO.fromModel(s)));
    } catch (error) {
      next(error);
    }
  };

  getArtistProfile = async (req, res, next) => {
    try {
      const user = await AuthService.getProfile(req.params.id);
      return this.sendSuccess(res, ArtistDTO.fromModel(user));
    } catch (error) {
      next(error);
    }
  };

  update = async (req, res, next) => {
    try {
      const songData = await SongService.updateSong(
        req.params.id,
        req.user.id,
        req.body,
        req.files
      );
      return this.sendSuccess(res, SongDTO.fromModel(songData), 'Song updated successfully.');
    } catch (error) {
      next(error);
    }
  };

  delete = async (req, res, next) => {
    try {
      await SongService.deleteSong(req.params.id, req.user.id);
      return this.sendSuccess(res, null, 'Song deleted successfully.');
    } catch (error) {
      next(error);
    }
  };

  getById = async (req, res, next) => {
    try {
      const song = await SongService.getSongById(req.params.id);
      return this.sendSuccess(res, SongDTO.fromModel(song));
    } catch (error) {
      next(error);
    }
  };
}

export default new SongController();
