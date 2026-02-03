/**
 * @fileoverview usePlayer Hook - Simple API for UI components
 * @module hooks/usePlayer
 * 
 * This hook provides a clean interface for components to interact
 * with the player. Components should use this hook instead of
 * directly accessing playerStore or playerService.
 * 
 * Benefits:
 * - Encapsulates player logic
 * - Ensures consistent API across components
 * - Guards against direct state manipulation
 */

import { usePlayerStore } from '@store/playerStore'
import { playerService } from '@services/player'

/**
 * @typedef {Object} UsePlayerReturn
 * @property {boolean} isPlaying - Current playback state
 * @property {Object|null} currentSong - Currently playing song
 * @property {number} progress - Playback progress (0-100)
 * @property {number} currentTime - Current time in seconds
 * @property {number} duration - Song duration in seconds
 * @property {number} volume - Volume level (0-1)
 * @property {string} repeatMode - 'none' | 'all' | 'once'
 * @property {boolean} isShuffle - Shuffle mode enabled
 * @property {Array} queue - Current queue
 * @property {function(): void} toggle - Toggle play/pause
 * @property {function(): void} next - Skip to next song
 * @property {function(): void} prev - Go to previous song
 * @property {function(Object, Array?): void} playSong - Play a song
 * @property {function(number): void} seek - Seek to time
 * @property {function(number): void} setVolume - Set volume
 * @property {function(): void} toggleMute - Toggle mute
 * @property {function(): void} cycleRepeat - Cycle repeat mode
 * @property {function(): void} toggleShuffle - Toggle shuffle
 * @property {function(Array, Object?): void} setQueue - Set queue
 */

/**
 * Hook for accessing player controls and state
 * @returns {UsePlayerReturn}
 */
export const usePlayer = () => {
  // Subscribe to relevant state slices
  const isPlaying = usePlayerStore(state => state.isPlaying)
  const currentSong = usePlayerStore(state => state.currentSong)
  const progress = usePlayerStore(state => state.progress)
  const currentTime = usePlayerStore(state => state.currentTime)
  const duration = usePlayerStore(state => state.duration)
  const volume = usePlayerStore(state => state.volume)
  const repeatMode = usePlayerStore(state => state.repeatMode)
  const isShuffle = usePlayerStore(state => state.isShuffle)
  const queue = usePlayerStore(state => state.queue)
  const currentIndex = usePlayerStore(state => state.currentIndex)

  return {
    // State (read-only)
    isPlaying,
    currentSong,
    progress,
    currentTime,
    duration,
    volume,
    repeatMode,
    isShuffle,
    queue,
    currentIndex,

    // Actions (delegate to service)
    toggle: () => playerService.toggle(),
    play: () => playerService.play(),
    pause: () => playerService.pause(),
    next: () => playerService.next(false),
    prev: () => playerService.prev(),
    playSong: (song, queue) => playerService.playSong(song, queue),
    seek: (time) => playerService.seek(time),
    setVolume: (vol) => playerService.setVolume(vol),
    toggleMute: () => playerService.toggleMute(),
    cycleRepeat: () => playerService.cycleRepeatMode(),
    setRepeatMode: (mode) => playerService.setRepeatMode(mode),
    toggleShuffle: () => playerService.setShuffle(),
    setShuffle: (enabled) => playerService.setShuffle(enabled),
    setQueue: (songs, startSong) => playerService.setQueue(songs, startSong),
    addToQueue: (song) => playerService.addToQueue(song),
    playNext: (song) => playerService.playNext(song),
    removeFromQueue: (songId, index) => playerService.removeFromQueue(songId, index),
    clearQueue: (keepCurrent) => playerService.clearQueue(keepCurrent),
    moveInQueue: (from, to) => playerService.moveInQueue(from, to)
  }
}

export default usePlayer
