import React from 'react'

import { ChevronRight } from 'lucide-react'

/**
 * Reusable Settings Item Component
 * 
 * @param {Object} props
 * @param {string} props.label - Primary label
 * @param {string} props.description - Optional description
 * @param {React.ReactNode} props.action - Custom action element (toggle, button, etc.)
 * @param {Function} props.onClick - Click handler
 */
const SettingsItem = ({
  label,
  description,
  action,
  onClick
}) => {
  return (
    <div
      className="settings-item"
      onClick={onClick}
      style={{
        cursor: onClick ? 'pointer' : 'default'
      }}
    >
      <div className="item-info">
        <span className="item-label">{label}</span>
        {description && <p className="item-desc">{description}</p>}
      </div>
      <div className="item-action">
        {action || <ChevronRight size={18} />}
      </div>
    </div>
  )
}

export default SettingsItem
