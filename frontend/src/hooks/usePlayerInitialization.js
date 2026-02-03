import { useEffect } from 'react'
import { usePlayerStore } from '@store/playerStore'
import { playerService } from '@services/player'
import api from '@services/api'

/**
 * Hook to initialize player state from localStorage on app load
 */
export const usePlayerInitialization = () => {
  const persistedSongId = usePlayerStore(state => state.persistedSongId)

  useEffect(() => {
    const initializePlayer = async () => {
      if (!persistedSongId) return

      try {
        // Fetch song details by ID
        const response = await api.get(`songs/${persistedSongId}`)

        if (response.data.success) {
          const song = response.data.data

          // Prepare the player with the persisted song but don't play
          // and keep the persisted time from constructor restoration
          usePlayerStore.setState({ currentSong: song })

          // Set the source in audio element without playing
          const audio = playerService.getAudioElement()
          audio.src = song.audioUrl || song.audio_url
          audio.currentTime = usePlayerStore.getState().currentTime || 0
        }
      } catch (error) {
        console.error('Player initialization failed:', error)
      }
    }

    initializePlayer()
  }, [persistedSongId])
}
