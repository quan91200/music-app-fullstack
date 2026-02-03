import React from 'react'

import { useTranslation } from 'react-i18next'

import { Check } from 'lucide-react'

import { SUPPORTED_LANGUAGES } from '@/constants/app.constants'

import SettingsItem from '@/components/SettingsItem'

/**
 * Language selection page
 */
const LanguagePage = () => {
  const { t, i18n } = useTranslation()

  const handleLanguageChange = (code) => {
    i18n.changeLanguage(code)
  }

  return (
    <div className="settings-page">
      <h1>{t('settings.choose_language')}</h1>

      <section className="settings-section">
        <div className="settings-list">
          {SUPPORTED_LANGUAGES.map((lang) => (
            <SettingsItem
              key={lang.code}
              label={lang.label}
              onClick={() => handleLanguageChange(lang.code)}
              action={
                i18n.language === lang.code ? (
                  <Check size={20} color="#1db954" />
                ) : null
              }
            />
          ))}
        </div>
      </section>
    </div>
  )
}

export default LanguagePage
