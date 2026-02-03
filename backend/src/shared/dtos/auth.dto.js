/**
 * @fileoverview Data Transfer Objects for Auth feature.
 * @module shared/dtos/auth.dto
 */

import { BaseDTO } from '../../core/index.js';

/**
 * User DTO.
 */
export class UserDTO extends BaseDTO {
  constructor(user) {
    super();
    this.id = user.id;
    this.email = user.email;
    this.fullName = user.fullName;
    this.avatarUrl = user.avatarUrl;
    this.subscription = user.subscription || null;
    this.createdAt = user.createdAt;
  }

  static fromModel(user) {
    if (!user) return null;
    return new UserDTO(user);
  }
}
