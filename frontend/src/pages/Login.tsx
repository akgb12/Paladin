import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'

export default function Login() {
  const { user, config, loading, signInWithGoogle, signInAsDev } = useAuth()
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const oauthError = params.get('error') === 'oauth'

  useEffect(() => {
    if (user) navigate('/', { replace: true })
  }, [user, navigate])

  return (
    <div className="min-h-screen w-full flex items-center justify-center px-4 py-10">
      <div className="card-soft w-full max-w-md overflow-hidden">
        <div className="relative bg-ink-900 text-parchment-50 px-7 py-8 bg-tile">
          <div className="absolute inset-0 pointer-events-none" style={{
            background: 'radial-gradient(420px 220px at 80% 40%, rgba(245,158,11,0.30) 0%, rgba(245,158,11,0) 60%)'
          }} />
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-11 w-11 rounded-xl bg-white border-2 border-ink-900 flex items-center justify-center shadow-brutal-sm overflow-hidden">
                <img src="/paladin-logo.png" alt="Paladin" className="h-10 w-10 object-contain" />
              </div>
              <div className="flex flex-col leading-none">
                <span className="font-display font-extrabold text-xl tracking-tight">PALADIN</span>
                <span className="text-[10px] uppercase tracking-[0.22em] text-parchment-50/60 font-mono font-bold">Receipt Vault</span>
              </div>
            </div>

            <span className="tag-mono text-gold-300">// THE GATE</span>
            <h1 className="font-display font-extrabold text-3xl leading-tight mt-1">
              Enter the <span className="text-gradient-gold">Vault.</span>
            </h1>
            <p className="text-parchment-50/65 text-sm mt-2">
              Every receipt you upload gets filed under your name. Forever.
            </p>
          </div>
        </div>

        <div className="px-7 py-7 space-y-3">
          {oauthError && (
            <div className="rounded-xl border-2 border-rose-700 bg-rose-50 text-rose-700 px-3 py-2 text-sm font-mono">
              Google sign-in was cancelled or failed. Try again.
            </div>
          )}

          {loading ? (
            <div className="h-12 rounded-xl bg-parchment-100 animate-pulse" />
          ) : (
            <>
              {config?.googleEnabled && (
                <button onClick={signInWithGoogle} className="btn-secondary w-full !py-3 text-base">
                  <GoogleMark />
                  Sign in with Google
                </button>
              )}

              {config?.devLoginEnabled && (
                <button onClick={signInAsDev} className="btn-primary w-full !py-3 text-base">
                  <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10 2.5l2 4.5 5 .6-3.7 3.3 1 5L10 13l-4.3 2.9 1-5L3 7.6l5-.6L10 2.5z"/>
                  </svg>
                  Continue as Dev Knight
                </button>
              )}

              {!config?.googleEnabled && (
                <p className="text-[11px] font-mono text-ink-500 text-center pt-1">
                  Google sign-in is not configured. Set <span className="text-ink-900 font-bold">GOOGLE_CLIENT_ID</span> and <span className="text-ink-900 font-bold">GOOGLE_CLIENT_SECRET</span> to enable it.
                </p>
              )}
            </>
          )}

          <p className="text-center text-[10px] uppercase tracking-[0.2em] font-mono text-ink-500 pt-3">
            By signing in you swear to file every receipt.
          </p>
        </div>
      </div>
    </div>
  )
}

function GoogleMark() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 48 48">
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.9 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.8 1.1 7.9 3l5.7-5.7C34 5.1 29.3 3 24 3 12.4 3 3 12.4 3 24s9.4 21 21 21c10.5 0 20-7.6 20-21 0-1.2-.1-2.3-.4-3.5z"/>
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.5 16.1 18.9 13 24 13c3 0 5.8 1.1 7.9 3l5.7-5.7C34 7.1 29.3 5 24 5 16.3 5 9.6 9.4 6.3 14.7z"/>
      <path fill="#4CAF50" d="M24 45c5.2 0 9.9-2 13.4-5.2l-6.2-5.2c-2 1.4-4.5 2.3-7.2 2.3-5.2 0-9.6-3.1-11.3-7.6l-6.5 5C9.3 40.5 16.1 45 24 45z"/>
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.3 4.3-4.1 5.7l6.2 5.2c-.4.4 6.6-4.8 6.6-14.9 0-1.2-.1-2.3-.4-3.5z"/>
    </svg>
  )
}
