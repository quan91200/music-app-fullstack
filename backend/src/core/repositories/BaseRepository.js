/**
 * @fileoverview Base Repository for data access abstraction.
 * @module core/repositories/BaseRepository
 */

/**
 * Base Repository class with common Sequelize operations.
 */
class BaseRepository {
  /**
   * @param {Object} model - Sequelize Model instance.
   */
  constructor(model) {
    this.model = model;
  }

  /**
   * Find all records with options.
   */
  async findAll(options = {}) {
    return await this.model.findAll(options);
  }

  /**
   * Find one record by criteria.
   */
  async findOne(options = {}) {
    return await this.model.findOne(options);
  }

  /**
   * Find record by Primary Key.
   */
  async findById(id, options = {}) {
    return await this.model.findByPk(id, options);
  }

  /**
   * Create a new record.
   */
  async create(data, options = {}) {
    return await this.model.create(data, options);
  }

  /**
   * Update records.
   */
  async update(data, options = {}) {
    return await this.model.update(data, options);
  }

  /**
   * Delete records.
   */
  async delete(options = {}) {
    return await this.model.destroy(options);
  }

  /**
   * Find or Create.
   */
  async findOrCreate(options = {}) {
    return await this.model.findOrCreate(options);
  }

  /**
   * Count records.
   */
  async count(options = {}) {
    return await this.model.count(options);
  }
}

export default BaseRepository;
