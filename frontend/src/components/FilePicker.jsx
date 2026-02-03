import React, {
  useRef
} from 'react'

import {
  FileUp,
  X,
  Music,
  Image as ImageIcon
} from 'lucide-react'

import { useTranslation } from 'react-i18next'

import Artwork from '@components/Artwork'

/**
 * Reusable File Picker Component
 * Supports both Audio files (with text) and Image files (with preview)
 * 
 * @param {Object} props
 * @param {string} props.fileName - Current selected file name (for non-image files)
 * @param {string} props.preview - Image preview URL (for image files)
 * @param {Function} props.onChange - Selection handler (file) => void
 * @param {Function} props.onClear - Clear selection handler () => void
 * @param {string} props.label - Display label
 * @param {string} props.hint - Small hint text
 * @param {string} props.accept - Accept attribute (default: 'audio/*')
 * @param {React.ReactNode} props.icon - Custom icon
 * @param {string} props.shape - 'square' | 'circle' (primarily for images)
 * @param {string} props.className - Additional classes
 */
const FilePicker = ({
  fileName,
  preview,
  onChange,
  onClear,
  label = 'Select File',
  hint = 'Maximum 50MB',
  accept = 'audio/*',
  icon,
  shape = 'rectangle',
  className = '',
  style = {}
}) => {
  const { t } = useTranslation()
  const inputRef = useRef(null)

  const handleBoxClick = () => {
    if (!fileName && !preview) {
      inputRef.current?.click()
    }
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      onChange(file)
    }
  }

  const handleClear = (e) => {
    e.stopPropagation()
    if (onClear) onClear()
    if (inputRef.current) {
      inputRef.current.value = ''
    }
  }

  const isImage = accept.includes('image')
  const defaultIcon = isImage ? <ImageIcon size={32} /> : <Music size={32} />
  const displayIcon = icon || defaultIcon

  return (
    <div
      className={`file-picker ${shape} ${fileName || preview ? 'has-file' : ''} ${className}`}
      onClick={handleBoxClick}
      style={style}
    >
      <input
        type="file"
        ref={inputRef}
        onChange={handleFileChange}
        accept={accept}
        style={{ display: 'none' }}
      />

      {preview ? (
        <div className="preview-container">
          <Artwork src={preview} alt="Preview" />
          <button
            type="button"
            className="clear-btn"
            onClick={handleClear}
            title={t('common.remove_image')}
          >
            <X size={16} />
          </button>
          <div className="overlay" onClick={() => inputRef.current?.click()}>
            <span>Change Image</span>
          </div>
        </div>
      ) : (
        <div className="picker-content">
          <div className="icon-wrapper">
            {fileName ? <FileUp size={32} className="active-icon" /> : displayIcon}
          </div>

          <div className="text-wrapper">
            <div className="label">{fileName ? fileName : label}</div>
            {hint && <div className="hint">{hint}</div>}
          </div>

          {fileName && (
            <button
              type="button"
              className="clear-btn"
              onClick={handleClear}
              title={t('common.clear_file')}
            >
              <X size={16} />
            </button>
          )}
        </div>
      )}

      {!fileName && !preview && <div className="picker-border-animation" />}
    </div>
  )
}

export default FilePicker
