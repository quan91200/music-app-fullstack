import AppError from '../errors/AppError.js';
import Sanitizer from '../../shared/utils/Sanitizer.js';

/**
 * Base Validator class.
 * Provides helper methods for common validation tasks.
 */
class BaseValidator {
  /**
   * Manually sanitize data.
   * Note: The global sanitizeRequest middleware already handles this.
   */
  sanitize(data) {
    return Sanitizer.sanitize(data);
  }

  /**
   * Helper to check for missing fields.
   * @param {Object} data - Source data.
   * @param {Array<string>} requiredFields - List of required fields.
   * @throws {AppError}
   */
  checkRequired(data, requiredFields) {
    const missing = requiredFields.filter(field => !data[field]);
    if (missing.length > 0) {
      throw AppError.badRequest(`Missing required fields: ${missing.join(', ')}`);
    }
  }

  /**
   * Helper to check UUID format.
   * @param {string} value - String to check.
   * @param {string} fieldName - Contextual field name.
   * @throws {AppError}
   */
  checkUUID(value, fieldName) {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9af]{4}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    // Note: Adjusted regex for broader UUIDv4 or simple UUID check
    const simpleUUID = /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/;

    if (value && !simpleUUID.test(value)) {
      throw AppError.badRequest(`Invalid UUID format for ${fieldName}`);
    }
  }

  /**
   * Helper to validate email.
   * @param {string} email 
   * @throws {AppError}
   */
  checkEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email && !emailRegex.test(email)) {
      throw AppError.badRequest('Invalid email format');
    }
  }
}

export default BaseValidator;
