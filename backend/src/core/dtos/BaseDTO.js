/**
 * @fileoverview Base Data Transfer Object.
 * @module core/dtos/BaseDTO
 */

/**
 * Base DTO class.
 */
class BaseDTO {
  /**
   * Abstract method to handle single model transformation.
   */
  static fromModel(_model) {
    throw new Error('Method fromModel() must be implemented');
  }

  /**
   * Generic collection transformation.
   */
  static fromCollection(collection) {
    if (!Array.isArray(collection)) return [];
    return collection.map(item => this.fromModel(item));
  }
}

export default BaseDTO;
