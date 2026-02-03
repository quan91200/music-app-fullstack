import React from 'react'
import { useTranslation } from 'react-i18next'
import {
  PlusCircle,
  Heart,
  ListMusic,
  Disc,
  User,
  Share2,
  Radio,
  HelpCircle
} from 'lucide-react'

import { SONG_ACTIONS } from '@constants/app.constants'
import Artwork from '@components/Artwork'

const ICON_MAP = {
  Heart,
  PlusCircle,
  ListMusic,
  Radio,
  Disc,
  User,
  Share2
}

/**
 * Song Actions Menu content for Mobile Overlay
 */
const SongActions = ({ song, onAction }) => {
  const { t } = useTranslation()

  if (!song) return null

  return (
    <div className="song-actions-container">
      {/* Song Summary Slot */}
      <div className="song-summary">
        <div className="summary-artwork">
          <Artwork src={song.coverUrl} size={48} />
        </div>
        <div className="summary-info">
          <h4>{song.title}</h4>
          <p>{song.artist?.name}</p>
        </div>
      </div>

      <div className="actions-list">
        {SONG_ACTIONS.map((action) => {
          const Icon = ICON_MAP[action.icon] || HelpCircle
          return (
            <button
              key={action.id}
              className="action-item"
              onClick={() => onAction?.(action.id)}
            >
              <Icon size={20} className="action-icon" />
              <span className="action-label">{t(action.labelKey)}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default SongActions
