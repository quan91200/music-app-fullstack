import React, {
  useEffect,
  useState
} from 'react'

import {
  useParams
} from 'react-router-dom'

import { useTranslation } from 'react-i18next'

import {
  Play,
  Check
} from 'lucide-react'

import api from '@services/api'

import { usePlayer } from '@hooks/usePlayer'

import SongListCard from '@components/SongListCard'
import SongGridCard from '@components/SongGridCard'
import Artwork from '@components/Artwork'

/**
 * Artist Profile Page
 * Public-facing profile for artists showing their biography, songs and albums
 */
const ArtistProfilePage = () => {
  const { t } = useTranslation()
  const { id } = useParams()

  const [artist, setArtist] = useState(null)
  const [songs, setSongs] = useState([])
  const [albums, setAlbums] = useState([])
  const [loading, setLoading] = useState(true)

  const { playSong } = usePlayer()

  useEffect(() => {
    const fetchArtistData = async () => {
      setLoading(true)
      try {
        // Fetch artist profile
        const artistRes = await api.get(`songs/artist-profile/${id}`)
        if (artistRes.data.success) {
          setArtist(artistRes.data.data)
        }

        // Fetch artist songs
        const songsRes = await api.get(`songs/artist/${id}`)
        if (songsRes.data.success) {
          setSongs(songsRes.data.data)
        }

        // Fetch artist albums
        const albumsRes = await api.get(`songs/albums/artist/${id}`)
        if (albumsRes.data.success) {
          setAlbums(albumsRes.data.data)
        }
      } catch (err) {
        console.error('Failed to fetch artist data:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchArtistData()
  }, [id])

  const handlePlayAll = () => {
    if (songs.length > 0) {
      playSong(songs[0], songs)
    }
  }

  if (loading) return <div className="loading-state">{t('common.loading')}</div>
  if (!artist) return <div className="error-state">{t('common.error')}</div>
  return (
    <div className="collection-page artist-profile-view">
      <header className="page-header profile-header-large">
        <div className="header-bg" style={{ backgroundColor: artist.themeColor || '#404040' }}></div>
        <div className="header-content">
          <div className="artwork-wrapper">
            <Artwork
              src={artist.avatarUrl || artist.avatar_url}
              alt={artist.fullName}
              className="main-artwork"
            />
          </div>
          <div className="text-content">
            <div className="artist-verified">
              <span className="verified-badge"><Check size={12} strokeWidth={4} /></span>
              <span>{t('artist_dashboard.verified')}</span>
            </div>
            <h1>{artist.name}</h1>
          </div>
        </div>
      </header>

      {/* Artist Bio Section */}
      <section className="artist-bio-section">
        <h2>{t('playing.about_artist')}</h2>
        <div className="bio-content">
          {artist.bio || t('playing.artist_bio', { name: artist.name })}
        </div>
      </section>

      <div className="page-actions">
        <button className="play-btn primary" onClick={handlePlayAll}>
          <Play fill="black" />
        </button>
        <button className="follow-btn-outline">
          {t('playing.follow')}
        </button>
      </div>

      <div className="artist-sections">
        {/* Popular Songs */}
        <section className="section">
          <div className="section-header">
            <h2>{t('home.popular_songs')}</h2>
          </div>
          <div className="song-list">
            {songs.slice(0, 5).map((song, index) => (
              <SongListCard
                key={song.id}
                song={song}
                index={index + 1}
                showArtist={false}
                showAlbum={true}
                showDuration={true}
              />
            ))}
          </div>
        </section>

        {/* Albums */}
        {albums.length > 0 && (
          <section className="section">
            <div className="section-header">
              <h2>{t('sidebar.albums')}</h2>
            </div>
            <div className="grid-container">
              {albums.map(album => (
                <SongGridCard
                  key={album.id}
                  song={album}
                  albumMode={true}
                />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}

export default ArtistProfilePage
