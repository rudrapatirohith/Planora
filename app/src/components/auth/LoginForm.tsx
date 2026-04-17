'use client'

import { useActionState } from 'react'
import { useFormStatus } from 'react-dom'
import Link from 'next/link'
import { Mail, Lock, Eye, EyeOff, Plane } from 'lucide-react'
import { useState } from 'react'
import { loginWithEmail, loginWithGoogle } from '@/app/actions/auth'
import { BRAND_NAME, BRAND_TAGLINE } from '@/lib/constants'

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      data-cy="login-button"
      className="w-full h-11 rounded-xl bg-[#D4A017] text-[#0B1120] font-semibold text-base font-body hover:bg-[#e8b832] disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-150 hover:-translate-y-px hover:shadow-glow-gold active:translate-y-0 flex items-center justify-center gap-2"
    >
      {pending ? (
        <>
          <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          Signing in...
        </>
      ) : (
        'Sign in'
      )}
    </button>
  )
}

export default function LoginForm() {
  const [state, action] = useActionState(loginWithEmail, null)
  const [showPassword, setShowPassword] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)

  async function handleGoogle() {
    setGoogleLoading(true)
    await loginWithGoogle()
    setGoogleLoading(false)
  }

  return (
    <div className="min-h-screen flex" style={{ background: '#0B1120' }}>
      {/* Left Panel — visual */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(ellipse 80% 60% at 20% 40%, rgba(8,145,178,0.15) 0%, transparent 60%),
              radial-gradient(ellipse 60% 50% at 80% 10%, rgba(212,160,23,0.12) 0%, transparent 60%),
              radial-gradient(ellipse 70% 70% at 50% 80%, rgba(139,92,246,0.08) 0%, transparent 60%),
              #0B1120
            `
          }}
        />
        {/* Floating destination names */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[
            { text: 'Tokyo', x: '15%', y: '20%', delay: '0s', opacity: 0.3 },
            { text: 'Paris', x: '70%', y: '35%', delay: '0.8s', opacity: 0.25 },
            { text: 'Bali', x: '30%', y: '65%', delay: '1.6s', opacity: 0.2 },
            { text: 'New York', x: '60%', y: '70%', delay: '2.4s', opacity: 0.2 },
            { text: 'Santorini', x: '20%', y: '80%', delay: '0.4s', opacity: 0.15 },
            { text: 'Kyoto', x: '75%', y: '15%', delay: '1.2s', opacity: 0.18 },
          ].map((dest) => (
            <div
              key={dest.text}
              className="absolute font-display text-white animate-float"
              style={{
                left: dest.x,
                top: dest.y,
                opacity: dest.opacity,
                fontSize: 'clamp(1rem, 2vw, 1.5rem)',
                fontStyle: 'italic',
                animationDelay: dest.delay,
                animationDuration: `${4 + parseFloat(dest.delay) * 2}s`,
              }}
            >
              {dest.text}
            </div>
          ))}
        </div>

        {/* Center content */}
        <div className="relative z-10 flex flex-col items-center justify-center w-full p-12 text-center">
          <div className="mb-8">
            <div className="w-20 h-20 rounded-2xl bg-[#D4A017]/10 border border-[#D4A017]/20 flex items-center justify-center mx-auto mb-6 animate-float">
              <Plane className="w-10 h-10 text-[#D4A017]" />
            </div>
            <h1 className="text-5xl font-display font-bold text-white mb-3">{BRAND_NAME}</h1>
            <p className="text-xl text-[#8ea3be] font-body">{BRAND_TAGLINE}</p>
          </div>

          <div className="space-y-4 max-w-xs">
            {[
              'Plan day-by-day itineraries',
              'Track budgets & expenses',
              'Manage all your bookings',
              'AI-powered suggestions',
            ].map((feature, i) => (
              <div
                key={feature}
                className="flex items-center gap-3 text-left animate-fade-in-up"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div className="w-5 h-5 rounded-full bg-[#D4A017]/20 border border-[#D4A017]/30 flex items-center justify-center shrink-0">
                  <svg className="w-3 h-3 text-[#D4A017]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-[#8ea3be] text-sm font-body">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel — form */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        {/* Mobile logo */}
        <div className="lg:hidden mb-8 text-center">
          <div className="w-12 h-12 rounded-xl bg-[#D4A017]/10 border border-[#D4A017]/20 flex items-center justify-center mx-auto mb-3">
            <Plane className="w-6 h-6 text-[#D4A017]" />
          </div>
          <h1 className="text-2xl font-display font-bold text-white">{BRAND_NAME}</h1>
        </div>

        <div className="w-full max-w-sm animate-fade-in-up">
          <div className="mb-8">
            <h2 className="text-2xl font-display font-bold text-white mb-2">Welcome back</h2>
            <p className="text-[#8ea3be] text-sm font-body">Sign in to continue planning your adventures</p>
          </div>

          {/* Google OAuth */}
          <button
            type="button"
            onClick={handleGoogle}
            disabled={googleLoading}
            data-cy="google-login-button"
            className="w-full h-11 rounded-xl border border-[rgba(30,45,69,0.8)] bg-[#141d2e] text-white font-medium text-sm font-body hover:bg-[rgba(30,45,69,0.6)] transition-all duration-150 flex items-center justify-center gap-3 mb-5 disabled:opacity-60"
          >
            {googleLoading ? (
              <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            ) : (
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
            )}
            Continue with Google
          </button>

          <div className="relative mb-5">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[rgba(30,45,69,0.8)]" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-[#0B1120] px-3 text-[#4d6080] font-body uppercase tracking-wider">
                or continue with email
              </span>
            </div>
          </div>

          {/* Email/Password form */}
          <form action={action} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#8ea3be] mb-1.5 font-body">
                Email address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#4d6080] pointer-events-none" />
                <input
                  type="email"
                  name="email"
                  required
                  autoComplete="email"
                  placeholder="you@example.com"
                  data-cy="email-input"
                  className="form-input pl-10"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#8ea3be] mb-1.5 font-body">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#4d6080] pointer-events-none" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  required
                  autoComplete="current-password"
                  placeholder="••••••••"
                  data-cy="password-input"
                  className="form-input pl-10 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#4d6080] hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {state?.error && (
              <div
                data-cy="login-error"
                className="rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-400 font-body animate-fade-in"
              >
                {state.error}
              </div>
            )}

            <SubmitButton />
          </form>

          <p className="mt-6 text-center text-sm text-[#4d6080] font-body">
            Don&apos;t have an account?{' '}
            <Link href="/signup" className="text-[#D4A017] hover:text-[#e8b832] font-medium transition-colors">
              Sign up free
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
