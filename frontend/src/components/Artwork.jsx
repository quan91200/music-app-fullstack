import React from 'react'
import PropTypes from 'prop-types'

/**
 * Reusable Artwork component for Songs, Albums, Playlists.
 * Falls back to local logo.png if src is missing or fails to load.
 */
const Artwork = ({ src, alt, className, style }) => {
  const defaultImage = '/logo.png'

  const handleError = (e) => {
    if (e.target.src !== window.location.origin + defaultImage) {
      e.target.src = defaultImage
    }
  }

  return (
    <img
      src={src || defaultImage}
      alt={alt || 'Artwork'}
      className={className}
      style={style}
      onError={handleError}
    />
  )
}

Artwork.propTypes = {
  src: PropTypes.string,
  alt: PropTypes.string,
  className: PropTypes.string,
  style: PropTypes.object
}

export default Artwork
