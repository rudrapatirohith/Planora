'use client'

import { useActionState } from 'react'
import { useFormStatus } from 'react-dom'
import Link from 'next/link'
import { Mail, Lock, User, Eye, EyeOff, Plane } from 'lucide-react'
import { useState } from 'react'
import { signupWithEmail, loginWithGoogle } from '@/app/actions/auth'
import { BRAND_NAME } from '@/lib/constants'

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      data-cy="signup-button"
      className="w-full h-11 rounded-xl bg-[#D4A017] text-[#0B1120] font-semibold text-base font-body hover:bg-[#e8b832] disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-150 hover:-translate-y-px hover:shadow-glow-gold flex items-center justify-center gap-2"
    >
      {pending ? (
        <>
          <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          Creating account...
        </>
      ) : (
        'Create free account'
      )}
    </button>
  )
}

export default function SignupForm() {
  const [state, action] = useActionState(signupWithEmail, null)
  const [showPassword, setShowPassword] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)

  async function handleGoogle() {
    setGoogleLoading(true)
    await loginWithGoogle()
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12" style={{ background: '#0B1120' }}>
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse 80% 60% at 20% 40%, rgba(8,145,178,0.08) 0%, transparent 60%),
            radial-gradient(ellipse 60% 50% at 80% 20%, rgba(212,160,23,0.06) 0%, transparent 60%),
            #0B1120
          `
        }}
      />

      <div className="relative z-10 w-full max-w-sm animate-fade-in-up">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-[#D4A017]/10 border border-[#D4A017]/20 flex items-center justify-center mx-auto mb-4">
            <Plane className="w-7 h-7 text-[#D4A017]" />
          </div>
          <h1 className="text-3xl font-display font-bold text-white mb-1">{BRAND_NAME}</h1>
          <p className="text-[#8ea3be] text-sm font-body">Create your free account to get started</p>
        </div>

        <div className="rounded-2xl border border-[rgba(30,45,69,0.8)] bg-[rgba(20,29,46,0.7)] backdrop-blur-sm p-6">
          {/* Google */}
          <button
            type="button"
            onClick={handleGoogle}
            disabled={googleLoading}
            data-cy="google-signup-button"
            className="w-full h-11 rounded-xl border border-[rgba(30,45,69,0.8)] bg-[#141d2e] text-white font-medium text-sm font-body hover:bg-[rgba(30,45,69,0.6)] transition-all flex items-center justify-center gap-3 mb-5 disabled:opacity-60"
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
              <span className="bg-[rgba(20,29,46,0.7)] px-3 text-[#4d6080] font-body uppercase tracking-wider">
                or with email
              </span>
            </div>
          </div>

          <form action={action} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#8ea3be] mb-1.5 font-body">Full name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#4d6080] pointer-events-none" />
                <input
                  type="text"
                  name="full_name"
                  required
                  autoComplete="name"
                  placeholder="Jane Smith"
                  data-cy="name-input"
                  className="form-input pl-10"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#8ea3be] mb-1.5 font-body">Email address</label>
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
              <label className="block text-sm font-medium text-[#8ea3be] mb-1.5 font-body">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#4d6080] pointer-events-none" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  required
                  autoComplete="new-password"
                  placeholder="Min. 8 characters"
                  data-cy="password-input"
                  className="form-input pl-10 pr-10"
                  minLength={8}
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
              <div data-cy="signup-error" className="rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-400 font-body animate-fade-in">
                {state.error}
              </div>
            )}

            <SubmitButton />
          </form>

          <p className="mt-4 text-xs text-center text-[#4d6080] font-body">
            By signing up, you agree to our{' '}
            <Link href="/terms" className="text-[#D4A017] hover:underline">Terms</Link>
            {' '}and{' '}
            <Link href="/privacy" className="text-[#D4A017] hover:underline">Privacy Policy</Link>
          </p>
        </div>

        <p className="mt-6 text-center text-sm text-[#4d6080] font-body">
          Already have an account?{' '}
          <Link href="/login" className="text-[#D4A017] hover:text-[#e8b832] font-medium transition-colors">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
