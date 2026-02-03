import React from 'react'

import { useTranslation } from 'react-i18next'

import {
  Music,
  Minimize2
} from 'lucide-react'

/**
 * Empty State Component for Playing View
 * Displays when no song is selected
 * @param {Object} props
 * @param {string} props.message - Message to display
 * @param {string} props.iconSize - Size of the music icon
 * @param {Function} props.onClose - Close handler function
 * @param {string} props.className - Additional CSS classes
 */
const EmptyPlayingView = ({
  message,
  iconSize = 48,
  onClose,
  className = ''
}) => {
  const { t } = useTranslation()
  return (
    <div className={`playing-view-container empty ${className}`}>
      {onClose && (
        <header>
          <div className="header-actions">
            <button
              onClick={onClose}
              className="close-btn"
              aria-label={t('common.close')}
            >
              <Minimize2 size={18} color="#a1a1aa" />
            </button>
          </div>
        </header>
      )}
      <Music size={iconSize} className="empty-icon" />
      <p>{message || t('playing.choose_song')}</p>
    </div>
  )
}

export default EmptyPlayingView
