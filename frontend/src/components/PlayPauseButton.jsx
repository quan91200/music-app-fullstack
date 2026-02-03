import React from 'react'

import {
  Play,
  Pause
} from 'lucide-react'

import { usePlayer } from '@hooks/usePlayer'

/**
 * PlayPauseButton Component
 * Reusable play/pause button with icon
 * 
 * @param {Object} props
 * @param {string} props.songId - Song ID to check if currently playing
 * @param {Function} props.onClick - Click handler (optional, overrides default behavior)
 * @param {string} props.size - Icon size (default: '24')
 * @param {string} props.className - Additional CSS classes
 * @param {boolean} props.showBackground - Show background circle (default: false)
 */
const PlayPauseButton = ({
  songId,
  onClick,
  size = 24,
  className = '',
  showBackground = false
}) => {
  const {
    currentSong,
    isPlaying,
    toggle
  } = usePlayer()

  const isCurrentSong = currentSong?.id === songId
  const isSongPlaying = isCurrentSong && isPlaying

  const handleClick = (e) => {
    e.stopPropagation()

    if (onClick) {
      onClick(e)
      return
    }

    if (isCurrentSong) {
      toggle()
    } else {
      console.warn('PlayPauseButton: songId not match current song')
    }
  }

  const buttonClasses = [
    'play-pause-btn',
    showBackground ? 'with-bg' : '',
    isSongPlaying ? 'playing' : '',
    className
  ].filter(Boolean).join(' ')

  return (
    <button
      className={buttonClasses}
      onClick={handleClick}
      aria-label={isSongPlaying ? 'Pause' : 'Play'}
    >
      {isSongPlaying ? (
        <Pause size={size} fill={showBackground ? '#000' : '#fff'} />
      ) : (
        <Play size={size} fill={showBackground ? '#000' : '#fff'} className="translate-x-0.5" />
      )}
    </button>
  )
}

export default PlayPauseButton
