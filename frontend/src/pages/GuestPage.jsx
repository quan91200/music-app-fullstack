import React from 'react'

import { useNavigate } from 'react-router-dom'

import { useTranslation } from 'react-i18next'

import {
  Music,
  Globe,
  Shield,
  Zap,
  Languages
} from 'lucide-react'

import { SUPPORTED_LANGUAGES } from '@/constants/app.constants'

// Assets - assuming vite handles these paths
import heroImage from '@/assets/images/guest-hero.png'
import featureImage from '@/assets/images/discover-feature.png'

/**
 * GuestPage Component
 * A premium landing page for unauthenticated users.
 */
const GuestPage = () => {
  const navigate = useNavigate()
  const { t, i18n } = useTranslation()

  const handleLanguageChange = (code) => {
    i18n.changeLanguage(code)
  }

  const features = [
    {
      icon: <Globe size={32} aria-hidden="true" />,
      ariaLabel: t('guest.features.listenEverywhere.iconLabel'),
      title: t('guest.features.listenEverywhere.title'),
      description: t('guest.features.listenEverywhere.description')
    },
    {
      icon: <Zap size={32} aria-hidden="true" />,
      ariaLabel: t('guest.features.highFidelity.iconLabel'),
      title: t('guest.features.highFidelity.title'),
      description: t('guest.features.highFidelity.description')
    },
    {
      icon: <Shield size={32} aria-hidden="true" />,
      ariaLabel: t('guest.features.adFree.iconLabel'),
      title: t('guest.features.adFree.title'),
      description: t('guest.features.adFree.description')
    }
  ]

  return (
    <div className="guest-page">
      {/* Navigation */}
      <nav className="guest-nav">
        <div className="logo" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <Music size={32} color="#fff" />
          <span>{t('common.appName')}</span>
        </div>

        <div className="nav-actions">
          {/* Language Switcher */}
          <div className="lang-switcher-dropdown">
            <button className="btn-lang">
              <Languages size={20} />
              <span>{SUPPORTED_LANGUAGES.find(l => l.code === i18n.language)?.label || t('settings.language')}</span>
            </button>
            <div className="lang-dropdown-content">
              {SUPPORTED_LANGUAGES.map(lang => (
                <div
                  key={lang.code}
                  className={`lang-option ${i18n.language === lang.code ? 'active' : ''}`}
                  onClick={() => handleLanguageChange(lang.code)}
                >
                  {lang.label}
                </div>
              ))}
            </div>
          </div>

          <button className="btn-auth login" onClick={() => navigate('/auth#login')}>
            {t('guest.nav.login')}
          </button>
          <button className="btn-auth signup" onClick={() => navigate('/auth#signup')}>
            {t('guest.nav.signup')}
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section
        className="hero-section"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="hero-content">
          <h1>{t('guest.hero.title')}</h1>
          <p>{t('guest.hero.description')}</p>
          <div className="cta-group">
            <button className="btn-primary" onClick={() => navigate('/auth#signup')}>
              {t('guest.hero.cta')}
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="section-title">
          <h2>{t('guest.features.title')}</h2>
          <p>{t('guest.features.subtitle')}</p>
        </div>
          <div className="feature-grid">
            {features.map((feature, index) => (
              <div key={index} className="feature-card">
                <div className="icon" aria-label={feature.ariaLabel}>
                  {feature.icon}
                </div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            ))}
          </div>
      </section>

      {/* Showcase Section */}
      <section className="showcase-section">
        <div className="showcase-image">
          <img src={featureImage} alt="Discover Feature" />
        </div>
        <div className="showcase-content">
          <h2>{t('guest.showcase.title')}</h2>
          <p>{t('guest.showcase.description')}</p>
          <ul>
            <li>{t('guest.showcase.bullets.personalized')}</li>
            <li>{t('guest.showcase.bullets.radar')}</li>
            <li>{t('guest.showcase.bullets.curated')}</li>
            <li>{t('guest.showcase.bullets.exclusive')}</li>
          </ul>
          <button
            className="btn-primary"
            style={{ marginTop: '32px' }}
            onClick={() => navigate('/auth#signup')}
          >
            {t('guest.showcase.cta')}
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="guest-footer">
          <div className="footer-logo">
            <Music size={40} style={{ marginBottom: '16px' }} />
            <div>{t('common.appName')}</div>
          </div>
        <div className="footer-links">
          <a href="#">{t('guest.footer.about')}</a>
          <a href="#">{t('guest.footer.premium')}</a>
          <a href="#">{t('guest.footer.support')}</a>
          <a href="#">{t('guest.footer.privacy')}</a>
          <a href="#">{t('guest.footer.terms')}</a>
        </div>
        <div className="copyright">
          &copy; 2026 CobhamMusic. {t('guest.footer.tagline')}
        </div>
      </footer>
    </div>
  )
}

export default GuestPage
