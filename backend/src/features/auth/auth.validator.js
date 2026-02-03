/**
 * @fileoverview Auth Validator.
 * @module features/auth/auth.validator
 */

import { BaseValidator } from '../../core/index.js';

class AuthValidator extends BaseValidator {
  /**
   * Validate sync profile data.
   */
  validateSync(data) {
    this.checkRequired(data, ['id', 'email']);
    this.checkUUID(data.id, 'user id');
    this.checkEmail(data.email);
  }
}

export default new AuthValidator();
