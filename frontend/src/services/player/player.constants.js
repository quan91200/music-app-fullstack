/**
 * @fileoverview Player constants and enums
 * @module services/player/player.constants
 */

/**
 * Repeat modes for player
 * @readonly
 * @enum {string}
 */
export const REPEAT_MODE = {
  NONE: 'none',
  ALL: 'all',
  ONCE: 'once'
}

/**
 * Player events emitted by service
 * @readonly
 * @enum {string}
 */
export const PLAYER_EVENTS = {
  STATE_CHANGE: 'stateChange',
  TIME_UPDATE: 'timeUpdate',
  SONG_CHANGE: 'songChange',
  QUEUE_CHANGE: 'queueChange',
  ERROR: 'error'
}

/**
 * Storage key for persisting player state
 * @constant {string}
 */
export const PLAYER_STORAGE_KEY = 'musicApp_playerState'

/**
 * Default volume level
 * @constant {number}
 */
export const DEFAULT_VOLUME = 0.7

/**
 * Throttle delay for saving state (ms)
 * @constant {number}
 */
export const SAVE_THROTTLE_MS = 2000
