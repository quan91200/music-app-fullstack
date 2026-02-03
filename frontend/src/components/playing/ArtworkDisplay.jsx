import React from 'react'

import Artwork from '@components/Artwork'

/**
 * Reusable Artwork Component
 * Displays song artwork with fallback to logo.png
 */
const ArtworkDisplay = ({ coverUrl, title, className = '' }) => {
  return (
    <div className={`artwork-display ${className}`}>
      <Artwork
        src={coverUrl}
        alt={title || 'Album cover'}
      />
    </div>
  )
}

export default ArtworkDisplay
