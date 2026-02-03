import { useEffect } from 'react'

import { useRegisterSW } from 'virtual:pwa-register/react'

import toast from 'react-hot-toast'

import { useTranslation } from 'react-i18next'

/**
 * Hook to manage PWA Service Worker registration and updates
 */
export const usePWA = () => {
  const { t } = useTranslation()
  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(_r) {
      //
    },
    onRegisterError(_error) {
      //
    },
  })

  useEffect(() => {
    if (offlineReady) {
      toast.success(t('toast.pwa_offline_ready'), {
        id: 'pwa-offline-ready',
      })
      setOfflineReady(false)
    }
  }, [offlineReady, setOfflineReady, t])

  useEffect(() => {
    if (needRefresh) {
      toast(t('toast.pwa_update_available'), {
        icon: '🔄',
        duration: 6000,
        id: 'pwa-update-available',
        style: {
          cursor: 'pointer',
        },
        onClick: () => {
          updateServiceWorker(true)
          setNeedRefresh(false)
        }
      })
    }
  }, [needRefresh, updateServiceWorker, setNeedRefresh, t])

  return {
    offlineReady,
    needRefresh,
    updateServiceWorker
  }
}
