/**
 * @fileoverview Base Service for business logic abstraction.
 * @module core/services/BaseService
 */

import AppError from '../errors/AppError.js';

/**
 * Base Service class.
 */
class BaseService {
  /**
   * @param {Object} repository - Repository instance.
   */
  constructor(repository) {
    this.repository = repository;
  }

  /**
   * Get all items.
   */
  async getAll(options = {}) {
    return await this.repository.findAll(options);
  }

  /**
   * Get item by ID or throw 404.
   */
  async getById(id, options = {}) {
    const item = await this.repository.findById(id, options);
    if (!item) {
      throw AppError.notFound();
    }
    return item;
  }

  /**
   * Create new item.
   */
  async create(data) {
    return await this.repository.create(data);
  }

  /**
   * Delete item by ID.
   */
  async delete(id) {
    const item = await this.getById(id);
    await item.destroy();
    return true;
  }
}

export default BaseService;
