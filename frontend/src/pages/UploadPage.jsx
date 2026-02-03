import React, { useState, useRef } from 'react'

import { Music, Send } from 'lucide-react'

import api from '@/services/api'

import { useAuthStore } from '@/store/authStore'

import toast from 'react-hot-toast'

import { useTranslation } from 'react-i18next'

import { MUSIC_GENRES } from '@/constants/app.constants'

import FilePicker from '@/components/FilePicker'

/**
 * Music Upload Page Component
 * Handles file selection, metadata input, and uploading to Backend (S3)
 */
const UploadPage = () => {
  const { t } = useTranslation()
  const [formData, setFormData] = useState({
    title: '',
    artist: '',
    genre: '',
    duration: 0
  })

  const [audioFile, setAudioFile] = useState(null)
  const [coverFile, setCoverFile] = useState(null)
  const [isUploading, setIsUploading] = useState(false)
  const [previewCover, setPreviewCover] = useState(null)

  const { user } = useAuthStore()

  // Auto-fill artist name from profile if available once on load
  React.useEffect(() => {
    if (user?.fullName) {
      setFormData(prev => ({
        ...prev,
        artist: prev.artist || user.fullName
      }))
    }
  }, [user])

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleAudioChange = (file) => {
    if (file && file.type.startsWith('audio/')) {
      setAudioFile(file)
      const audio = new Audio()
      audio.src = URL.createObjectURL(file)
      audio.onloadedmetadata = () => {
        setFormData(prev => ({ ...prev, duration: Math.floor(audio.duration) }))
        URL.revokeObjectURL(audio.src)
      }
    }
  }

  const handleClearAudio = () => {
    setAudioFile(null)
    setFormData(prev => ({ ...prev, duration: 0 }))
  }

  const handleCoverSelect = (file) => {
    if (previewCover) {
      URL.revokeObjectURL(previewCover)
    }
    setCoverFile(file)
    setPreviewCover(URL.createObjectURL(file))
  }

  const handleCoverRemove = () => {
    if (previewCover) {
      URL.revokeObjectURL(previewCover)
    }
    setCoverFile(null)
    setPreviewCover(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!audioFile) {
      toast.error(t('toast.upload_audio_required'))
      return
    }

    if (isUploading) return

    setIsUploading(true)
    const loadingToast = toast.loading(t('toast.upload_uploading'))

    try {
      const data = new FormData()
      data.append('title', formData.title)
      data.append('artistName', formData.artist)
      data.append('artistId', user.id)
      data.append('genre', formData.genre)
      data.append('duration', formData.duration)
      data.append('audio', audioFile)

      if (coverFile) {
        data.append('cover', coverFile)
      }

      await api.post('songs/upload', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 120000,
      })

      toast.success(t('toast.upload_success'), { id: loadingToast })

      // Clean up
      setAudioFile(null)
      setCoverFile(null)
      setPreviewCover(null)
      setFormData({
        title: '',
        artist: user?.fullName || '',
        genre: '',
        duration: 0
      })

    } catch (error) {
      const msg = error.response?.data?.message || t('toast.upload_failed')
      toast.error(msg, { id: loadingToast })
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="upload-page">
      <div className="upload-header">
        <h1>Upload Music</h1>
        <p>Share your sounds with the world. Premium quality only.</p>
      </div>

      <div className="upload-card">
        <form onSubmit={handleSubmit} className="upload-form">
          {/* Left Side: Metadata */}
          <div className="upload-metadata">
            <div className="form-group">
              <label>Song Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                placeholder="e.g. Moonlight Sonata"
              />
            </div>
            <div className="form-group">
              <label>Artist Name</label>
              <input
                type="text"
                name="artist"
                value={formData.artist}
                onChange={handleInputChange}
                required
                placeholder="e.g. Ludwig van Beethoven"
              />
            </div>
            <div className="form-group">
              <label>Genre</label>


              <select
                name="genre"
                value={formData.genre}
                onChange={handleInputChange}
              >
                <option value="">Select Genre</option>
                {MUSIC_GENRES.map((genre) => (
                  <option key={genre} value={genre}>
                    {genre}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              disabled={isUploading}
              className="submit-btn"
            >
              {isUploading ? 'Uploading...' : <><Send size={18} /> Upload Song</>}
            </button>
          </div>

          {/* Right Side: File Uploads */}
          <div className="upload-slots">
            {/* Audio Upload Area */}
            <FilePicker
              fileName={audioFile?.name}
              onChange={handleAudioChange}
              onClear={handleClearAudio}
              label="Select Audio File"
              hint="MP3, WAV, FLAC (Max 50MB)"
              accept="audio/*"
              className="audio-slot"
            />

            {/* Cover Upload Area */}
            <FilePicker
              preview={previewCover}
              onChange={handleCoverSelect}
              onClear={handleCoverRemove}
              label="Upload Artwork"
              hint="JPEG, PNG (1:1 Aspect Ratio)"
              accept="image/*"
              className="cover-slot"
            />
          </div>
        </form>
      </div>
    </div>
  )
}

export default UploadPage
