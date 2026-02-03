import React from 'react'

import { useTranslation } from 'react-i18next'

import { Heart } from 'lucide-react'

import toast from 'react-hot-toast'

import { useFavoriteStore } from '@store/favoriteStore'

/**
 * Reusable Favorite Button Component
 * Handles favorite toggle with toast notifications
 * @param {Object} props
 * @param {string} props.songId - ID of the song
 * @param {boolean} props.active - Whether song is favorited
 * @param {string} props.size - Icon size (default: 24)
 * @param {string} props.className - Additional CSS classes
 */
const FavoriteButton = ({ songId, active, size = 24, className = '' }) => {
  const { t } = useTranslation()
  const { toggleFavorite } = useFavoriteStore()

  const handleFavoriteClick = async (e) => {
    e.stopPropagation()
    if (!songId) return

    await toggleFavorite(songId)

    if (!active) {
      toast.success(t('toast.added_to_favorites'))
    } else {
      toast(t('toast.removed_from_favorites'), { icon: '🗑️' })
    }
  }

  return (
    <button
      className={`favorite-btn ${active ? 'active' : ''} ${className}`}
      onClick={handleFavoriteClick}
      aria-label={active ? t('favorites.remove') : t('favorites.add')}
    >
      <Heart
        size={size}
        fill={active ? "#1db954" : "none"}
        color={active ? "#1db954" : "#a1a1aa"}
      />
    </button>
  )
}

export default FavoriteButton
