/**
 * @fileoverview Centralized constants for the backend application.
 * @module shared/constants
 */

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
};

export const ERROR_MESSAGES = {
  INTERNAL_SERVER_ERROR: 'Internal server error occurred.',
  UNAUTHORIZED: 'You are not authorized to access this resource.',
  NOT_FOUND: 'Resource not found.',
};

export const STORAGE_FOLDERS = {
  AUDIO: 'audio',
  ARTWORK: 'artwork',
};
