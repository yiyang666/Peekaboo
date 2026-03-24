import { useEffect, useRef, useState } from 'react'
import PeekabooCharacters from '../components/PeekabooCharacters'
import { usePeekabooPupilVisuals } from '../hooks/usePeekabooPupilVisuals'
import type { InteractionState } from '../types/interaction'

export type { InteractionState } from '../types/interaction'

function EyeIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  )
}

function EyeOffIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
      <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
      <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
      <line x1="2" x2="22" y1="2" y2="22" />
    </svg>
  )
}

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden>
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  )
}

const inputClass =
  'w-full rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 text-gray-900 shadow-sm outline-none transition placeholder:text-gray-400 focus:border-gray-300 focus:ring-2 focus:ring-gray-900/10'

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [interactionState, setInteractionState] =
    useState<InteractionState>('IDLE')
  const emailInputRef = useRef<HTMLInputElement>(null)
  const passwordInputRef = useRef<HTMLInputElement>(null)

  const { eyeGroupRefs, pupilRefs } = usePeekabooPupilVisuals(
    interactionState,
    emailInputRef,
    passwordInputRef,
  )

  useEffect(() => {
    console.log('[InteractionState]', interactionState)
  }, [interactionState])

  function handleTogglePasswordVisible() {
    const nextVisible = !showPassword
    setShowPassword(nextVisible)
    if (nextVisible) {
      setInteractionState('PASSWORD_VISIBLE')
    } else {
      requestAnimationFrame(() => {
        const el = passwordInputRef.current
        const passwordFocused = el != null && document.activeElement === el
        setInteractionState(passwordFocused ? 'PASSWORD_FOCUS' : 'IDLE')
      })
    }
  }

  function handleEmailFocus() {
    if (showPassword) {
      setInteractionState('PASSWORD_VISIBLE')
      return
    }
    setInteractionState('EMAIL_FOCUS')
  }

  function handlePasswordFocus() {
    if (showPassword) {
      setInteractionState('PASSWORD_VISIBLE')
      return
    }
    setInteractionState('PASSWORD_FOCUS')
  }

  function handleInputBlur() {
    if (showPassword) {
      setInteractionState('PASSWORD_VISIBLE')
      return
    }
    setInteractionState('IDLE')
  }

  return (
    <div className="flex min-h-screen flex-row">
      <aside
        className="relative flex min-h-screen w-1/2 min-w-0 flex-col overflow-hidden bg-[#373F47]"
        aria-label="品牌与角色插画"
      >
        <header className="relative z-10 flex items-center gap-2 px-8 pt-8">
          <span
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/15 text-sm font-bold text-white"
            aria-hidden
          >
            P
          </span>
          <span className="text-sm font-semibold tracking-wide text-white">
            Peekaboo
          </span>
        </header>

        <div className="pointer-events-none flex min-h-0 flex-1 flex-col items-center justify-center px-4 py-8">
          <PeekabooCharacters
            interactionState={interactionState}
            eyeGroupRefs={eyeGroupRefs}
            pupilRefs={pupilRefs}
          />
        </div>
      </aside>

      <main className="flex w-1/2 min-w-0 flex-col justify-center bg-[#F8F9FA] px-8 py-12">
        <div className="mx-auto w-full max-w-md">
          <h1 className="text-3xl font-semibold tracking-tight text-gray-900">
            Welcome back!
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Enter your details to sign in.
          </p>

          <form
            className="mt-10 space-y-5"
            onSubmit={(e) => {
              e.preventDefault()
            }}
          >
            <div>
              <label
                htmlFor="email"
                className="mb-1.5 block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <input
                ref={emailInputRef}
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                className={inputClass}
                onFocus={handleEmailFocus}
                onBlur={handleInputBlur}
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-1.5 block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <div className="relative">
                <input
                  ref={passwordInputRef}
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  className={`${inputClass} pr-11`}
                  onFocus={handlePasswordFocus}
                  onBlur={handleInputBlur}
                />
                <button
                  type="button"
                  onClick={handleTogglePasswordVisible}
                  className="absolute right-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-md text-gray-500 transition hover:bg-gray-100 hover:text-gray-800"
                  aria-label={showPassword ? '隐藏密码' : '显示密码'}
                >
                  {showPassword ? (
                    <EyeOffIcon className="h-5 w-5" />
                  ) : (
                    <EyeIcon className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            <label className="flex cursor-pointer items-center gap-2.5">
              <input
                type="checkbox"
                name="remember"
                className="h-4 w-4 rounded border-gray-300 text-gray-900 focus:ring-gray-900/20"
              />
              <span className="text-sm text-gray-700">Remember me</span>
            </label>

            <button
              type="submit"
              className="w-full rounded-lg bg-gray-900 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2"
            >
              Log in
            </button>
          </form>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center" aria-hidden>
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-[#F8F9FA] px-3 text-gray-400">or</span>
            </div>
          </div>

          <button
            type="button"
            className="flex w-full items-center justify-center gap-2.5 rounded-lg border border-gray-200 bg-white py-3 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-900/10"
          >
            <GoogleIcon className="h-5 w-5" />
            Log in with Google
          </button>
        </div>
      </main>
    </div>
  )
}
