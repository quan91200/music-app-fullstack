/**
 * @fileoverview Player Store - Read-only state for player
 * @module store/playerStore
 * 
 * This store holds the player state. State mutations should be done
 * via playerService, not directly from UI components.
 * 
 * Components should use usePlayer hook for accessing state and actions.
 */

import { create } from 'zustand'

import {
  getItem
} from '@services/localStorage.service'

import {
  PLAYER_STORAGE_KEY,
  DEFAULT_VOLUME,
  REPEAT_MODE
} from '@services/player/player.constants'

/**
 * Get initial state from localStorage
 * @returns {Object} Initial state
 */
const getInitialState = () => {
  const saved = getItem(PLAYER_STORAGE_KEY)

  return {
    // Playback state
    isPlaying: false,
    currentSong: null,

    // Queue
    queue: [],
    originalQueue: [],
    currentIndex: -1,

    // Audio settings
    volume: saved?.volume ?? DEFAULT_VOLUME,
    lastVolume: saved?.lastVolume ?? DEFAULT_VOLUME,

    // Modes
    repeatMode: saved?.repeatMode ?? REPEAT_MODE.NONE,
    isShuffle: saved?.isShuffle ?? false,

    // Time tracking
    progress: 0,
    currentTime: saved?.currentTime ?? 0,
    duration: 0,

    // Persistence helper
    persistedSongId: saved?.currentSongId || null
  }
}

/**
 * Player Store
 * 
 * NOTE: This store should be treated as READ-ONLY by UI components.
 * All mutations should go through playerService.
 * The setState calls here are ONLY used by playerService internally.
 */
export const usePlayerStore = create(() => {
  const initialState = getInitialState()

  return {
    ...initialState
  }
})
