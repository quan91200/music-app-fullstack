import { BaseController } from '../../core/index.js';
import AlbumService from './album.service.js';
import SongValidator from './song.validator.js';

/**
 * Controller class for Album management.
 */
class AlbumController extends BaseController {
  create = async (req, res, next) => {
    try {
      const { title, description } = req.body;
      SongValidator.validateAlbum({ ...req.body, artistId: req.user.id });
      const album = await AlbumService.createAlbum({
        title,
        description,
        artistId: req.user.id
      });
      return this.sendCreated(res, album);
    } catch (error) {
      next(error);
    }
  };

  getById = async (req, res, next) => {
    try {
      const album = await AlbumService.getAlbumById(req.params.id);
      return this.sendSuccess(res, album);
    } catch (error) {
      next(error);
    }
  };

  getAll = async (req, res, next) => {
    try {
      const albums = await AlbumService.getAllAlbums();
      return this.sendSuccess(res, albums);
    } catch (error) {
      next(error);
    }
  };

  getArtistAlbums = async (req, res, next) => {
    try {
      const albums = await AlbumService.getArtistAlbums(req.user.id);
      return this.sendSuccess(res, albums);
    } catch (error) {
      next(error);
    }
  };

  getAlbumsByArtist = async (req, res, next) => {
    try {
      const albums = await AlbumService.getArtistAlbums(req.params.id);
      return this.sendSuccess(res, albums);
    } catch (error) {
      next(error);
    }
  };

  delete = async (req, res, next) => {
    try {
      await AlbumService.deleteAlbum(req.params.id, req.user.id);
      return this.sendSuccess(res, null, 'Album deleted.');
    } catch (error) {
      next(error);
    }
  };

  update = async (req, res, next) => {
    try {
      const album = await AlbumService.updateAlbum(
        req.params.id,
        req.user.id,
        req.body,
        req.file
      );
      return this.sendSuccess(res, album, 'Album updated.');
    } catch (error) {
      next(error);
    }
  };
}

export default new AlbumController();
