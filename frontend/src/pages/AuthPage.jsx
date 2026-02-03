import React, {
  useEffect,
  useState
} from 'react'

import { useNavigate } from 'react-router-dom'

import { Auth } from '@supabase/auth-ui-react'

import { ThemeSupa } from '@supabase/auth-ui-shared'

import { supabase } from '@/services/supabase'

import { useAuthStore } from '@/store/authStore'

/**
 * Auth Page Component
 * Handles Login, Sign Up, and Password Reset views.
 */
const AuthPage = () => {
  const { user } = useAuthStore()
  const navigate = useNavigate()
  const [view, setView] = useState(() => {
    // Check if we are in a password recovery flow
    const hash = window.location.hash
    if (hash && hash.includes('type=recovery')) {
      return 'update_password'
    }
    return 'sign_in'
  })

  useEffect(() => {
    // Listen for auth state changes specifically for password recovery
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, _session) => {
      if (event === 'PASSWORD_RECOVERY') {
        setView('update_password')
      }
      if (event === 'USER_UPDATED' && view === 'update_password') {
        // After password is updated, we can move to sign in or home
        setTimeout(() => navigate('/'), 2000)
      }
    })

    return () => subscription.unsubscribe()
  }, [navigate, view])

  useEffect(() => {
    // Only redirect to home if we are NOT in the middle of updating password
    if (user && view !== 'update_password') {
      navigate('/')
    }
  }, [user, navigate, view])

  return (
    <div className="auth-page-container">
      {/* Background Glows */}
      <div className="background-glow top-left" />
      <div className="background-glow bottom-right" />

      <div className="auth-card">
        <div className="auth-title-section">
          <h1>
            Cobham<span>Music</span>
          </h1>
          <p>
            {view === 'update_password' ? 'Set your new strong password below.' : 'Redefining your sound experience.'}
          </p>
        </div>

        <Auth
          supabaseClient={supabase}
          view={view}
          localization={{
            variables: {
              sign_in: {
                email_label: 'Địa chỉ Email',
                password_label: 'Mật khẩu',
                button_label: 'Đăng nhập',
                loading_button_label: 'Đang đăng nhập...',
                social_provider_text: 'Đăng nhập bằng {{provider}}',
                link_text: 'Đã có tài khoản? Đăng nhập',
              },
              sign_up: {
                email_label: 'Địa chỉ Email',
                password_label: 'Mật khẩu',
                button_label: 'Đăng ký',
                loading_button_label: 'Đang đăng ký...',
                social_provider_text: 'Đăng ký bằng {{provider}}',
                link_text: 'Chưa có tài khoản? Đăng ký ngay',
              },
              forgotten_password: {
                email_label: 'Địa chỉ Email',
                button_label: 'Gửi hướng dẫn đổi mật khẩu',
                loading_button_label: 'Đang gửi...',
                link_text: 'Quên mật khẩu?',
              },
              update_password: {
                password_label: 'Mật khẩu mới',
                button_label: 'Cập nhật mật khẩu',
                loading_button_label: 'Đang cập nhật...',
              },
            },
          }}
          appearance={{
            theme: ThemeSupa,
            variables: {
              default: {
                colors: {
                  brand: '#6366f1',
                  brandAccent: '#818cf8',
                  inputBackground: 'rgba(255,255,255,0.03)',
                  inputText: 'white',
                  inputPlaceholder: '#71717a',
                  inputBorder: 'rgba(255,255,255,0.1)',
                  inputBorderFocus: '#818cf8',
                  inputBorderHover: 'rgba(255,255,255,0.2)',
                },
                radii: {
                  borderRadiusButton: '14px',
                  buttonPadding: '14px',
                  inputPadding: '14px',
                },
                fonts: {
                  bodyFontFamily: `'Inter', sans-serif`,
                  buttonFontFamily: `'Inter', sans-serif`,
                  inputFontFamily: `'Inter', sans-serif`,
                  labelFontFamily: `'Inter', sans-serif`,
                }
              }
            },
            className: {
              container: 'supabase-container',
              button: 'supabase-button',
              input: 'supabase-input',
              label: 'supabase-label',
              anchor: 'supabase-anchor',
            }
          }}
          providers={[]}
          theme="dark"
        />
      </div>
    </div>
  )
}

export default AuthPage
