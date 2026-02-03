import React from 'react'
import { useTranslation } from 'react-i18next'
import { Outlet } from 'react-router-dom'

import { useUIStore } from '@store/appStore'

import Sidebar from '@containers/layout/Sidebar'
import ContentArea from '@containers/layout/ContentArea'
import PlayingView from '@containers/layout/PlayingView'
import PlayerBar from '@containers/layout/PlayerBar'
import MobileBottomNav from '@components/MobileBottomNav'

import { ChevronLeft } from 'lucide-react'

const MainLayout = ({ children }) => {
  const { t } = useTranslation()
  const {
    togglePlayingView,
    isLibraryCollapsed,
    isPlayingViewVisible
  } = useUIStore()

  return (
    <div className="app-container">
      <main className="main-layout">
        <aside className={`sidebar ${isLibraryCollapsed ? 'collapsed' : ''}`}>
          <Sidebar />
        </aside>

        <section className="content-area-wrapper">
          <ContentArea>{children || <Outlet />}</ContentArea>
        </section>

        <aside
          className={`playing-view-wrapper ${!isPlayingViewVisible ? 'collapsed' : 'expanded'}`}
          onClick={!isPlayingViewVisible ? togglePlayingView : undefined}
          title={!isPlayingViewVisible ? t('common.expand') : ""}
        >
          {!isPlayingViewVisible && (
            <div className="playing-view-toggle">
              <ChevronLeft size={16} />
            </div>
          )}

          <div className="playing-view-inner">
            <PlayingView />
          </div>
        </aside>
      </main>

      <footer className="player-bar-wrapper">
        <PlayerBar />
      </footer>

      <div className="mobile-nav-wrapper">
        <MobileBottomNav />
      </div>
    </div>
  )
}

export default MainLayout
