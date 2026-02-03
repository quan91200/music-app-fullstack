import React from 'react'

import { Clock } from 'lucide-react'
import { useTranslation } from 'react-i18next'

/**
 * Reusable Song List Header Component
 * Renders column headers for song list views
 * @param {Object} props
 * @param {Array} props.headers - Array of header config objects from constants
 * @param {string} props.className - Additional CSS classes
 */
const SongListHeader = ({ headers, className = '' }) => {
  const { t } = useTranslation()

  const renderIcon = (iconName) => {
    switch (iconName) {
      case 'Clock':
        return <Clock size={16} />
      default:
        return null
    }
  }

  // Map header keys to translation keys
  const getHeaderLabel = (header) => {
    if (header.showIcon) {
      return renderIcon(header.iconName)
    }
    
    // Map header keys to i18n keys
    const keyMap = {
      'index': 'table_headers.index',
      'title': 'table_headers.title',
      'album': 'table_headers.album',
      'dateAdded': 'table_headers.date_added',
      'duration': 'table_headers.duration'
    }
    
    return t(keyMap[header.key] || header.key)
  }

  return (
    <div className={`song-list-header ${className}`}>
      {headers.map((header) => (
        <div
          key={header.key}
          className={`header-col col-${header.key}`}
          style={{ width: header.width, flex: header.width.includes('fr') ? header.width : undefined }}
        >
          {getHeaderLabel(header)}
        </div>
      ))}
    </div>
  )
}

export default SongListHeader
