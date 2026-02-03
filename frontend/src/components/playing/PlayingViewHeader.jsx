import React from 'react'

import { useTranslation } from 'react-i18next'

import {
  MoreHorizontal,
  ChevronDown,
  Minimize2
} from 'lucide-react'

/**
 * Reusable Header Component for Playing View
 * Displays title and action buttons
 * @param {Object} props
 * @param {string} props.title - Header title
 * @param {Function} props.onClose - Close handler function
 * @param {Function} props.onMore - More options handler (optional)
 * @param {boolean} props.showClose - Whether to show close button
 * @param {string} props.className - Additional CSS classes
 */
const PlayingViewHeader = ({
  title,
  onClose,
  onMore,
  showClose = true,
  className = ''
}) => {
  const { t } = useTranslation()

  return (
    <header className={`pv-header ${className}`}>
      <div className="header-left">
        {showClose && (
          <button onClick={onClose} className="unit-btn">
            <Minimize2 size={20} className="desktop-toggle" />
            <ChevronDown size={24} className="mobile-toggle" />
          </button>
        )}
      </div>

      <div className="title-section">
        <span className="title">{title || t('playing.now_playing')}</span>
      </div>

      <div className="header-right">
        {onMore ? (
          <MoreHorizontal size={24} className="unit-btn" onClick={onMore} />
        ) : (
          <div style={{ width: 24 }} />
        )}
      </div>
    </header>
  )
}

export default PlayingViewHeader
