import { BaseController } from '../../core/index.js';
import PlaylistService from './playlist.service.js';
import PlaylistValidator from './playlist.validator.js';
import { PlaylistDTO } from '../../shared/dtos/playlist.dto.js';

/**
 * Controller class for Playlist management.
 */
class PlaylistController extends BaseController {
  create = async (req, res, next) => {
    try {
      PlaylistValidator.validatePlaylist(req.body);
      const { title, description, isPrivate } = req.body;
      const playlist = await PlaylistService.createPlaylist({
        title,
        description,
        isPrivate,
        userId: req.user.id
      });
      return this.sendCreated(res, PlaylistDTO.fromModel(playlist));
    } catch (error) {
      next(error);
    }
  };

  getById = async (req, res, next) => {
    try {
      const playlist = await PlaylistService.getPlaylistById(req.params.id, req.user.id);
      return this.sendSuccess(res, PlaylistDTO.fromModel(playlist));
    } catch (error) {
      next(error);
    }
  };

  addSong = async (req, res, next) => {
    try {
      PlaylistValidator.validateAddSong(req.params);
      const { playlistId, songId } = req.params;
      await PlaylistService.addSong(playlistId, req.user.id, songId);
      return this.sendSuccess(res, null, 'Song added to playlist.');
    } catch (error) {
      next(error);
    }
  };

  getUserPlaylists = async (req, res, next) => {
    try {
      const playlists = await PlaylistService.getUserPlaylists(req.user.id);
      return this.sendSuccess(res, PlaylistDTO.fromCollection(playlists));
    } catch (error) {
      next(error);
    }
  };

  update = async (req, res, next) => {
    try {
      const playlist = await PlaylistService.updatePlaylist(
        req.params.id,
        req.user.id,
        req.body,
        req.file
      );
      return this.sendSuccess(res, PlaylistDTO.fromModel(playlist));
    } catch (error) {
      next(error);
    }
  };

  delete = async (req, res, next) => {
    try {
      await PlaylistService.deletePlaylist(req.params.id, req.user.id);
      return this.sendSuccess(res, null, 'Playlist deleted successfully.');
    } catch (error) {
      next(error);
    }
  };
}

export default new PlaylistController();
