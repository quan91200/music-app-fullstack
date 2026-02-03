import React from 'react'
import { useAudio } from '@hooks/useAudio'

/**
 * AudioController Component
 * Invisible component that manages the HTML5 Audio element
 * Uses useAudio hook to sync audio playback with playerStore
 * Should be placed at the app level (e.g., in App.jsx or Layout)
 */
const AudioController = () => {
  // This hook manages the audio element and syncs with playerStore
  useAudio()

  // This component doesn't render anything visible
  return null
}

export default AudioController
