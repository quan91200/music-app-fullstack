import React from 'react'

/**
 * Reusable Song Info Component
 * Displays song title and artist information
 * @param {Object} props
 * @param {string} props.title - Song title
 * @param {string} props.artist - Artist name
 * @param {string} props.className - Additional CSS classes
 */
const SongInfo = ({ title, artist, className = '' }) => {
  return (
    <div className={`song-info ${className}`}>
      <h3 className="song-title">{title || 'Unknown Title'}</h3>
      <p className="artist-name">{artist || 'Unknown Artist'}</p>
    </div>
  )
}

export default SongInfo