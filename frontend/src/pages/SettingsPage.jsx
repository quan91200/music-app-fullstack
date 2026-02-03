import React from 'react'
import { useNavigate } from 'react-router-dom'
import SettingsItem from '@/components/SettingsItem'
import { SUPPORTED_LANGUAGES } from '@/constants/app.constants'
import { useUIStore } from '@/store/appStore'
import { useTranslation } from 'react-i18next'
import { useAuthStore } from '@/store/authStore'
import { Switch } from '@mui/material'

const SettingsPage = () => {
  const { connectionMode, setConnectionMode } = useUIStore()
  const { user } = useAuthStore()
  const navigate = useNavigate()
  const { t, i18n } = useTranslation()

  const currentPlan = user?.subscription?.plan || 'free';
  const planLabel = currentPlan === 'free'
    ? t('common.free')
    : (currentPlan.charAt(0).toUpperCase() + currentPlan.slice(1)).replace('_', ' ');

  return (
    <div className="settings-page">
      {/* ... previous sections ... */}
      <h1>{t('settings.title')}</h1>

      <section className="settings-section">
        <h3>{t('settings.account')}</h3>
        <div className="settings-list">
          <SettingsItem
            label={t('settings.edit_profile')}
            description={t('settings.edit_profile_desc')}
            onClick={() => navigate('/profile')}
          />
          <SettingsItem
            label={t('settings.manage_sessions')}
            description={t('settings.manage_sessions_desc')}
            onClick={() => navigate('/settings/sessions')}
          />
        </div>
      </section>

      <section className="settings-section">
        <h3>{t('settings.audio_quality')}</h3>
        <div className="settings-list">
          <SettingsItem
            label={t('settings.streaming')}
            description={t('settings.streaming_desc')}
            action={<span className="auto-label">{t('settings.auto')}</span>}
          />
          <SettingsItem
            label={t('settings.normalize_volume')}
            description={t('settings.normalize_volume_desc')}
            action={<Switch disabled defaultChecked size="small" />}
          />
        </div>
      </section>

      <section className="settings-section">
        <h3>{t('settings.offline_mode')}</h3>
        <div className="settings-list">
          <SettingsItem
            label={t('settings.offline_mode_label')}
            description={t('settings.offline_mode_desc')}
            action={
              <Switch
                checked={connectionMode === 'offline'}
                onChange={(e) => setConnectionMode(e.target.checked ? 'offline' : 'standard')}
                size="small"
              />
            }
          />
        </div>
      </section>

      <section className="settings-section">
        <h3>{t('settings.display')}</h3>
        <div className="settings-list">
          <SettingsItem
            label={t('settings.language')}
            description={SUPPORTED_LANGUAGES.find(l => l.code === i18n.language)?.label || 'Tiếng Việt'}
            onClick={() => navigate('/settings/language')}
          />
          <SettingsItem
            label={t('settings.dark_mode')}
            description={t('settings.always_on')}
            action={<Switch disabled defaultChecked size="small" />}
          />
        </div>
      </section>

      <section className="settings-section">
        <h3>{t('billing.title', 'Thanh toán & Đăng ký')}</h3>
        <div className="settings-list">
          <SettingsItem
            label={t('billing.subscription.title', 'Gói đăng ký hiện tại')}
            description={planLabel}
            onClick={() => navigate('/settings/premium')}
          />
        </div>
      </section>
    </div>
  )
}

export default SettingsPage
