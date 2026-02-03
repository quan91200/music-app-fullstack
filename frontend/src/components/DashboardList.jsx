import React from 'react'

import { motion } from 'framer-motion'

import Artwork from '@components/Artwork'

export const DashboardList = ({ children, className = '' }) => {
  return (
    <div className={`songs-list ${className}`}>
      {children}
    </div>
  )
}

export const DashboardListItem = ({
  index,
  coverUrl,
  coverIcon,
  title,
  subtitle,
  stats,
  actions,
  onClick,
  coverStyle,
}) => {
  return (
    <motion.div
      whileHover={{
        scale: 1.01,
        backgroundColor: 'rgba(255, 255, 255, 0.05)'
      }}
      className="song-row"
      onClick={onClick}
    >
      <div className="song-main">
        {index !== undefined && <span className="index">
          {index}
        </span>}
        <div className="cover-wrapper" style={coverStyle}>
          <Artwork
            src={coverUrl}
            alt={title}
          />
        </div>
        <div className="info">
          <div className="title">{title}</div>
          <div className="meta">{subtitle}</div>
        </div>
      </div>

      {(stats || typeof stats === 'number') && (
        <div className="song-stats">
          {stats}
        </div>
      )}

      {actions && (
        <div className="song-actions">
          {actions}
        </div>
      )}
    </motion.div>
  )
}
