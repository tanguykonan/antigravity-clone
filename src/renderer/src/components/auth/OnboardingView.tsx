import React, { useState } from 'react'
import appLogo from '../../assets/logo.png'

interface OnboardingViewProps {
  onLoginSuccess: (provider: 'github' | 'gitlab') => void
}

export const OnboardingView: React.FC<OnboardingViewProps> = ({ onLoginSuccess }) => {
  const [selectedProvider, setSelectedProvider] = useState<'github' | 'gitlab'>('github')
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = (provider: 'github' | 'gitlab') => {
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      onLoginSuccess(provider)
    }, 1000)
  }

  return (
    <div
      className="relative flex flex-col items-center justify-center w-full h-full select-none overflow-hidden"
      style={{
        backgroundColor: '#151613',
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Segoe UI", Roboto, sans-serif'
      }}
    >
      {/* ── Halo lumineux ambiant doux & diffus ── */}
      <div
        className="absolute pointer-events-none w-[540px] h-[540px] rounded-full blur-[140px] opacity-15"
        style={{
          background:
            'radial-gradient(circle, rgba(74, 144, 226, 0.35) 0%, rgba(220, 68, 85, 0.2) 45%, rgba(21, 22, 19, 0) 70%)',
          top: '28%',
          left: '50%',
          transform: 'translate(-50%, -50%)'
        }}
      />

      {/* ── Contenu central ── */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-md w-full animate-in fade-in zoom-in-95 duration-500">
        {/* Logo officiel pur et net */}
        <div className="relative mb-8 flex items-center justify-center">
          <img
            src={appLogo}
            alt="Logo"
            className="w-[72px] h-[72px] object-contain transition-transform duration-300 hover:scale-[1.03]"
            draggable={false}
          />
        </div>

        {/* Titre de bienvenue */}
        <h1
          className="text-white tracking-tight mb-8"
          style={{
            fontSize: '28px',
            fontWeight: 600,
            letterSpacing: '-0.02em'
          }}
        >
          Welcome to Progravity
        </h1>

        {/* Bouton de connexion principal */}
        <div className="w-full max-w-[280px] flex flex-col items-center gap-3.5">
          <button
            type="button"
            disabled={isLoading}
            onClick={() => handleLogin(selectedProvider)}
            className="w-full h-[46px] flex items-center justify-center gap-3 px-5 rounded-xl transition-all duration-200 cursor-pointer active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed group"
            style={{
              backgroundColor: '#222420',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              boxShadow:
                '0 8px 24px -4px rgba(0, 0, 0, 0.6), 0 2px 6px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.12)',
              color: '#ffffff',
              fontSize: '14px',
              fontWeight: 500
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.09)'
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.22)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#222420'
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.12)'
            }}
          >
            {isLoading ? (
              <div className="flex items-center gap-2.5">
                <svg
                  className="animate-spin h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                <span style={{ fontSize: '13.5px' }}>Connecting...</span>
              </div>
            ) : selectedProvider === 'github' ? (
              <>
                {/* Icône GitHub SVG officielle */}
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="text-white flex-shrink-0"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                  />
                </svg>
                <span>Continue with GitHub</span>
              </>
            ) : (
              <>
                {/* Icône GitLab SVG officielle */}
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="flex-shrink-0"
                >
                  <path
                    d="M22.65 14.39L20.67 8.3c-.16-.48-.68-.78-1.19-.68-.5.1-.87.52-.87 1.03v.23l-3.02 9.29h-7.18L5.39 8.88v-.23c0-.51-.37-.93-.87-1.03-.51-.1-1.03.2-1.19.68L1.35 14.39c-.19.58-.01 1.22.45 1.6l10.2 7.78 10.2-7.78c.46-.38.64-1.02.45-1.6z"
                    fill="#E24329"
                  />
                  <path
                    d="M12 23.77l-3.59-11.04h7.18L12 23.77z"
                    fill="#E24329"
                  />
                  <path
                    d="M1.35 14.39l2.06-6.33 5 15.71-7.06-9.38z"
                    fill="#FC6D26"
                  />
                  <path
                    d="M22.65 14.39l-2.06-6.33-5 15.71 7.06-9.38z"
                    fill="#FC6D26"
                  />
                  <path
                    d="M8.41 12.73L5.39 8.88c-.28-.35-.74-.47-1.15-.31-.41.17-.67.57-.65 1.01v.05l1.83 5.62 2.99-2.52z"
                    fill="#FCA326"
                  />
                  <path
                    d="M15.59 12.73l3.02-3.85c.28-.35.74-.47 1.15-.31.41.17.67.57.65 1.01v.05l-1.83 5.62-2.99-2.52z"
                    fill="#FCA326"
                  />
                </svg>
                <span>Continue with GitLab</span>
              </>
            )}
          </button>

          {/* Lien alternatif : Basculer entre GitLab et GitHub */}
          <button
            type="button"
            onClick={() =>
              setSelectedProvider((prev) => (prev === 'github' ? 'gitlab' : 'github'))
            }
            className="text-[13px] text-[#7a7c78] hover:text-[#dcded9] transition-colors cursor-pointer underline underline-offset-4 decoration-transparent hover:decoration-[#7a7c78] mt-1"
          >
            {selectedProvider === 'github'
              ? 'Use GitLab instead'
              : 'Use GitHub instead'}
          </button>
        </div>
      </div>
    </div>
  )
}
