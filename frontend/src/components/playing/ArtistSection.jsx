import React from 'react'

import { useNavigate } from 'react-router-dom'

import { useTranslation } from 'react-i18next'

import toast from 'react-hot-toast'

import Artwork from '@components/Artwork'

/**
 * Enhanced Artist Section Component matching Spotify's style
 * Displays artist banner, name, stats, and bio
 */
const ArtistSection = ({ artist, className = '' }) => {
  const { t } = useTranslation()
  const navigate = useNavigate()

  if (!artist) return null

  const handleFollow = (e) => {
    e.stopPropagation()
    toast.success(t('playing.followed_artist', { name: artist.name }))
  }

  const handleArtistClick = () => {
    navigate(`/artist/${artist.id || artist.userId}`)
  }

  return (
    <div className={`artist-section ${className}`}>
      <div className="artist-banner" onClick={handleArtistClick} style={{ cursor: 'pointer' }}>
        <Artwork
          src={artist.avatarUrl}
          alt={artist.name}
        />
        <span className="section-title">{t('playing.about_artist')}</span>
      </div>

      <div className="artist-content">
        <div className="artist-header">
          <div className="name-stats" onClick={handleArtistClick} style={{ cursor: 'pointer' }}>
            <h3 className="artist-name">{artist.name}</h3>
          </div>
          <button className="follow-btn" onClick={handleFollow}>
            {t('playing.follow')}
          </button>
        </div>

        <p className="artist-bio">
          {t('playing.artist_bio', { name: artist.name })}
        </p>

        <button
          className="view-profile-btn"
          onClick={handleArtistClick}
        >
          {t('playing.view_profile')}
        </button>
      </div>
    </div>
  )
}

export default ArtistSection
