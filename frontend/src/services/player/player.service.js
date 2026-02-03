/**
 * @fileoverview Player Service - Singleton that manages audio playback
 * @module services/player/player.service
 * 
 * This service is the SINGLE SOURCE OF TRUTH for playback.
 * - Owns the HTMLAudioElement instance
 * - Manages play/pause/seek/volume
 * - Handles queue navigation (next/prev)
 * - Emits state changes to playerStore
 * 
 * UI components should NEVER directly manipulate audio or setIsPlaying.
 * Instead, they call playerService methods.
 */

import {
  usePlayerStore
} from '@store/playerStore'

import {
  getItem,
  setItem
} from '@services/localStorage.service'

import {
  REPEAT_MODE,
  PLAYER_STORAGE_KEY,
  DEFAULT_VOLUME,
  SAVE_THROTTLE_MS
} from './player.constants'

/**
 * @typedef {Object} Song
 * @property {string} id
 * @property {string} title
 * @property {string} audioUrl
 * @property {string} [coverUrl]
 * @property {Object} [artist]
 */

class PlayerService {
  /** @type {PlayerService|null} */
  static instance = null

  /** @type {HTMLAudioElement} */
  audio = null

  /** @type {number|null} */
  saveTimeout = null

  /**
   * Private constructor - use getInstance()
   */
  constructor() {
    if (PlayerService.instance) {
      return PlayerService.instance
    }

    this.audio = new Audio()
    this.audio.preload = 'metadata'
    this.setupEventListeners()
    this.restorePersistedState()

    PlayerService.instance = this
  }

  /**
   * Get singleton instance
   * @returns {PlayerService}
   */
  static getInstance() {
    if (!PlayerService.instance) {
      PlayerService.instance = new PlayerService()
    }
    return PlayerService.instance
  }

  /**
   * Setup audio element event listeners
   * @private
   */
  setupEventListeners() {
    const audio = this.audio

    audio.addEventListener('timeupdate', () => {

      const progress = (audio.currentTime / audio.duration) * 100 || 0

      // Direct state update without triggering re-renders for every frame
      usePlayerStore.setState({
        progress,
        currentTime: audio.currentTime
      })

      this.throttledSave()
    })

    audio.addEventListener('loadedmetadata', () => {
      usePlayerStore.setState({ duration: audio.duration })
    })

    audio.addEventListener('ended', () => {
      this.handleSongEnd()
    })

    audio.addEventListener('error', (e) => {
      console.error('Audio error:', e)
      usePlayerStore.setState({ isPlaying: false })
    })

    audio.addEventListener('play', () => {
      usePlayerStore.setState({ isPlaying: true })
    })

    audio.addEventListener('pause', () => {
      usePlayerStore.setState({ isPlaying: false })
    })
  }

  /**
   * Restore persisted state from localStorage
   * @private
   */
  restorePersistedState() {
    const saved = getItem(PLAYER_STORAGE_KEY)
    if (saved) {
      this.audio.volume = saved.volume ?? DEFAULT_VOLUME

      const updates = {
        volume: saved.volume ?? DEFAULT_VOLUME,
        lastVolume: saved.lastVolume ?? DEFAULT_VOLUME,
        repeatMode: saved.repeatMode ?? REPEAT_MODE.NONE,
        isShuffle: saved.isShuffle ?? false,
        persistedSongId: saved.currentSongId || null,
        currentTime: saved.currentTime ?? 0,
        queue: saved.queue || [],
        originalQueue: saved.originalQueue || []
      }

      // Restore currentIndex if queue exists
      if (saved.queue && saved.currentSongId) {
        updates.currentIndex = saved.queue.findIndex(s => s.id === saved.currentSongId)
      }

      usePlayerStore.setState(updates)
    }
  }

  /**
   * Throttled save to localStorage
   * @private
   */
  throttledSave() {
    if (this.saveTimeout) return

    this.saveTimeout = setTimeout(() => {
      this.saveToStorage()
      this.saveTimeout = null
    }, SAVE_THROTTLE_MS)
  }

  /**
   * Save current state to localStorage
   * @private
   */
  saveToStorage() {
    const state = usePlayerStore.getState()
    const persistableState = {
      volume: state.volume,
      lastVolume: state.lastVolume,
      repeatMode: state.repeatMode,
      isShuffle: state.isShuffle,
      currentTime: state.currentTime,
      currentSongId: state.currentSong?.id || state.persistedSongId,
      queue: state.queue,
      originalQueue: state.originalQueue
    }
    setItem(PLAYER_STORAGE_KEY, persistableState)
  }

  // ==================== PUBLIC API ====================

  /**
   * Play a song. If no song provided, resume current.
   * @param {Song} [song] - Song to play
   * @param {boolean} [resetTime=true] - Reset playback position
   */
  play(song = null, resetTime = true) {
    const store = usePlayerStore.getState()

    if (song) {
      // Update queue index if song is in queue
      const queue = store.queue
      const index = queue.findIndex(s => s.id === song.id)

      const updates = {
        currentSong: song,
        currentIndex: index,
        persistedSongId: song.id
      }

      if (resetTime) {
        updates.currentTime = 0
        updates.progress = 0
      }

      usePlayerStore.setState(updates)

      // Load and play new song
      this.audio.src = song.audioUrl || song.audio_url
      if (resetTime) {
        this.audio.currentTime = 0
      }
    }

    // Attempt to play
    const playPromise = this.audio.play()
    if (playPromise !== undefined) {
      playPromise.catch(error => {
        if (error.name !== 'AbortError') {
          console.error('Play failed:', error)
          usePlayerStore.setState({ isPlaying: false })
        }
      })
    }

    this.saveToStorage()
  }

  /**
   * Pause playback
   */
  pause() {
    this.audio.pause()
    this.saveToStorage()
  }

  /**
   * Toggle between play and pause
   */
  toggle() {
    const { isPlaying, currentSong } = usePlayerStore.getState()

    if (!currentSong) return

    if (isPlaying) {
      this.pause()
    } else {
      this.play()
    }
  }

  /**
   * Seek to specific time
   * @param {number} time - Time in seconds
   */
  seek(time) {
    if (!this.audio.src) return

    this.audio.currentTime = time
    usePlayerStore.setState({
      currentTime: time,
      progress: (time / this.audio.duration) * 100 || 0
    })
  }

  /**
   * Set volume level
   * @param {number} volume - Volume (0-1)
   */
  setVolume(volume) {
    this.audio.volume = volume

    const updates = { volume }
    if (volume > 0) {
      updates.lastVolume = volume
    }

    usePlayerStore.setState(updates)
    this.saveToStorage()
  }

  /**
   * Toggle mute
   */
  toggleMute() {
    const { volume, lastVolume } = usePlayerStore.getState()

    if (volume > 0) {
      this.setVolume(0)
      usePlayerStore.setState({ lastVolume: volume })
    } else {
      this.setVolume(lastVolume > 0 ? lastVolume : DEFAULT_VOLUME)
    }
  }

  /**
   * Skip to next song
   * @param {boolean} [isAuto=false] - True if auto-advance (affects repeat behavior)
   */
  next(isAuto = false) {
    const { queue, currentIndex, repeatMode } = usePlayerStore.getState()
    if (queue.length === 0) return

    // Handle Repeat One (only for automatic transitions)
    if (isAuto && repeatMode === REPEAT_MODE.ONCE) {
      this.audio.currentTime = 0
      this.play()
      return
    }

    let nextIndex = currentIndex + 1

    if (nextIndex >= queue.length) {
      if (repeatMode === REPEAT_MODE.ALL) {
        nextIndex = 0
      } else {
        usePlayerStore.setState({
          isPlaying: false,
          currentTime: 0,
          progress: 0
        })
        this.audio.pause()
        return
      }
    }

    const nextSong = queue[nextIndex]
    this.play(nextSong, true)
  }

  /**
   * Go to previous song
   */
  prev() {
    const { queue, currentIndex, repeatMode } = usePlayerStore.getState()
    if (queue.length === 0) return

    // If more than 3 seconds into song, restart it
    if (this.audio.currentTime > 3) {
      this.seek(0)
      return
    }

    let prevIndex = currentIndex - 1

    if (prevIndex < 0) {
      if (repeatMode === REPEAT_MODE.ALL) {
        prevIndex = queue.length - 1
      } else {
        prevIndex = 0
      }
    }

    const prevSong = queue[prevIndex]
    this.play(prevSong, true)
  }

  /**
   * Handle song end event
   * @private
   */
  handleSongEnd() {
    const { repeatMode } = usePlayerStore.getState()

    if (repeatMode === REPEAT_MODE.ONCE) {
      this.audio.currentTime = 0
      this.play()
    } else {
      this.next(true)
    }
  }

  /**
   * Set the playback queue
   * @param {Song[]} songs - Array of songs
   * @param {Song} [startSong] - Song to start playing
   */
  setQueue(songs, startSong = null) {
    usePlayerStore.setState({
      queue: songs,
      originalQueue: [...songs],
      currentIndex: startSong ? songs.findIndex(s => s.id === startSong.id) : -1
    })

    if (startSong) {
      this.play(startSong, true)
    }
  }

  /**
   * Add song to end of queue
   * @param {Song} song
   */
  addToQueue(song) {
    const { queue, originalQueue } = usePlayerStore.getState()

    // Check if song already in queue to avoid duplicates if desired
    // For now, we allow duplicates as in most players

    usePlayerStore.setState({
      queue: [...queue, song],
      originalQueue: [...originalQueue, song]
    })
  }

  /**
   * Insert song to play immediately after current song
   * @param {Song} song
   */
  playNext(song) {
    const { queue, originalQueue, currentIndex } = usePlayerStore.getState()

    const newQueue = [...queue]
    const nextIndex = currentIndex + 1
    newQueue.splice(nextIndex, 0, song)

    const newOriginalQueue = [...originalQueue]
    // Also insert into original queue at a logical place or just at the end
    newOriginalQueue.push(song)

    usePlayerStore.setState({
      queue: newQueue,
      originalQueue: newOriginalQueue
    })
  }

  /**
   * Remove song from queue by ID or index
   * @param {string} songId
   * @param {number} [index] - Optional specific index to remove
   */
  removeFromQueue(songId, index = -1) {
    const { queue, originalQueue, currentIndex } = usePlayerStore.getState()

    let newQueue = [...queue]
    let targetIndex = index

    if (targetIndex === -1) {
      targetIndex = newQueue.findIndex(s => s.id === songId)
    }

    if (targetIndex === -1) return

    newQueue.splice(targetIndex, 1)

    // Update currentIndex if we removed a song before or at the current index
    let newCurrentIndex = currentIndex
    if (targetIndex < currentIndex) {
      newCurrentIndex--
    } else if (targetIndex === currentIndex) {
      // If we removed the current song, we probably want to stop or play next
      // For now just adjust index, next() will handle navigation
      newCurrentIndex = Math.min(currentIndex, newQueue.length - 1)
    }

    usePlayerStore.setState({
      queue: newQueue,
      currentIndex: newCurrentIndex,
      originalQueue: originalQueue.filter(s => s.id !== songId) // Sync original queue
    })
  }

  /**
   * Clear the entire queue (except current song if playing)
   * @param {boolean} [keepCurrent=true]
   */
  clearQueue(keepCurrent = true) {
    const { currentSong } = usePlayerStore.getState()

    if (keepCurrent && currentSong) {
      usePlayerStore.setState({
        queue: [currentSong],
        originalQueue: [currentSong],
        currentIndex: 0
      })
    } else {
      this.pause()
      usePlayerStore.setState({
        queue: [],
        originalQueue: [],
        currentIndex: -1,
        currentSong: null,
        isPlaying: false
      })
      this.audio.src = ''
    }
  }

  /**
   * Move a song within the queue (drag & drop)
   * @param {number} fromIndex
   * @param {number} toIndex
   */
  moveInQueue(fromIndex, toIndex) {
    const { queue, currentIndex } = usePlayerStore.getState()

    const newQueue = [...queue]
    const [movedSong] = newQueue.splice(fromIndex, 1)
    newQueue.splice(toIndex, 0, movedSong)

    // Adjust currentIndex
    let newCurrentIndex = currentIndex
    if (currentIndex === fromIndex) {
      newCurrentIndex = toIndex
    } else if (currentIndex > fromIndex && currentIndex <= toIndex) {
      newCurrentIndex--
    } else if (currentIndex < fromIndex && currentIndex >= toIndex) {
      newCurrentIndex++
    }

    usePlayerStore.setState({
      queue: newQueue,
      currentIndex: newCurrentIndex
    })
  }

  /**
   * Set repeat mode
   * @param {'none'|'all'|'once'} mode
   */
  setRepeatMode(mode) {
    usePlayerStore.setState({ repeatMode: mode })
    this.saveToStorage()
  }

  /**
   * Cycle through repeat modes
   */
  cycleRepeatMode() {
    const { repeatMode } = usePlayerStore.getState()
    const modes = [REPEAT_MODE.NONE, REPEAT_MODE.ALL, REPEAT_MODE.ONCE]
    const nextMode = modes[(modes.indexOf(repeatMode) + 1) % modes.length]
    this.setRepeatMode(nextMode)
  }

  /**
   * Toggle shuffle mode
   * @param {boolean} [enabled] - Force enable/disable, or toggle if undefined
   */
  setShuffle(enabled) {
    const { isShuffle, originalQueue, currentSong } = usePlayerStore.getState()
    const newShuffle = enabled !== undefined ? enabled : !isShuffle

    if (newShuffle) {
      // Shuffle queue but keep current song first
      const shuffled = [...originalQueue]
        .filter(s => s.id !== currentSong?.id)
        .sort(() => Math.random() - 0.5)

      if (currentSong) {
        shuffled.unshift(currentSong)
      }

      usePlayerStore.setState({
        isShuffle: true,
        queue: shuffled,
        currentIndex: 0
      })
    } else {
      // Restore original queue
      const currentIndex = currentSong
        ? originalQueue.findIndex(s => s.id === currentSong.id)
        : -1

      usePlayerStore.setState({
        isShuffle: false,
        queue: [...originalQueue],
        currentIndex
      })
    }

    this.saveToStorage()
  }

  /**
   * Play a specific song and optionally set queue
   * Convenience method for UI components
   * @param {Song} song - Song to play
   * @param {Song[]} [queue] - Optional queue to set
   */
  playSong(song, queue = null) {
    if (queue) {
      this.setQueue(queue, song)
    } else {
      this.play(song, true)
    }
  }

  /**
   * Get current audio element (for advanced use cases)
   * @returns {HTMLAudioElement}
   */
  getAudioElement() {
    return this.audio
  }
}

// Export singleton instance
export const playerService = PlayerService.getInstance()

export default playerService
