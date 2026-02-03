import React, { useEffect } from 'react'
import { X } from 'lucide-react'

/**
 * Reusable Mobile Slide-up Overlay (Bottom Sheet)
 * @param {Object} props
 * @param {boolean} props.isOpen - Whether overlay is visible
 * @param {Function} props.onClose - Close handler
 * @param {string} props.title - Optional title
 * @param {React.ReactNode} props.children - Content
 * @param {string} props.height - Optional height (default: 75vh)
 */
const MobileOverlay = ({
  isOpen,
  onClose,
  title,
  children,
  height = '75vh'
}) => {
  // Prevent body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  return (
    <div className={`unit-overlay ${isOpen ? 'active' : ''}`}>
      {/* Background Dimmer */}
      <div className="dimmer" onClick={onClose} />

      {/* The Sheet */}
      <div className="sheet" style={{ height }}>
        <div className="overlay-header">
          <div className="drag-handle" />
          {title && <div className="header-title">{title}</div>}
        </div>

        <div className="overlay-content">
          {children}
        </div>
      </div>
    </div>
  )
}

export default MobileOverlay
