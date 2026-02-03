import React, {
  useState
} from 'react'

import { useTranslation } from 'react-i18next'

import {
  Search as SearchIcon
} from 'lucide-react'

import { useSongStore } from '@store/songStore'

import SongGridCard from '@components/SongGridCard'
import { SEARCH_CATEGORIES } from '@constants/search.constants'

/**
 * Search Page Component
 * Refactored to use dynamic categories and Vanilla SCSS
 */
const SearchPage = () => {
  const { t } = useTranslation()
  const [query, setQuery] = useState('')
  const { songs } = useSongStore()

  const filteredSongs = query
    ? songs.filter(s =>
      s.title?.toLowerCase().includes(query.toLowerCase()) ||
      s.artist?.name?.toLowerCase().includes(query.toLowerCase()) ||
      s.artistName?.toLowerCase().includes(query.toLowerCase())
    )
    : []

  return (
    <div className="search-page">
      <header className="search-header">
        <h1>{t('sidebar.search')}</h1>
        <div className="search-input-container">
          <SearchIcon className="search-icon" size={20} />
          <input
            type="text"
            placeholder={t('search.placeholder')}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
          />
        </div>
      </header>

      <section className="search-results">
        {query ? (
          filteredSongs.length > 0 ? (
            <div className="grid-container">
              {filteredSongs.map(song => (
                <SongGridCard key={song.id} song={song} />
              ))}
            </div>
          ) : (
            <div className="no-results">
              <p>{t('search.no_results')}</p>
            </div>
          )
        ) : (
          <div className="browse-sections">
            <h2>{t('search.browse_all')}</h2>
            <div className="browse-grid">
              {SEARCH_CATEGORIES.map(category => (
                <div
                  key={category.id}
                  className="category-card"
                  style={{ backgroundColor: category.color }}
                >
                  {t(category.labelKey)}
                </div>
              ))}
            </div>
          </div>
        )}
      </section>
    </div>
  )
}

export default SearchPage
