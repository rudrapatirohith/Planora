'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { User, Globe, LogOut, Loader2, Save, AlertTriangle, Mail } from 'lucide-react'
import { updateProfile, signOut } from '@/app/actions/settings'
import { getInitials } from '@/lib/utils'
import { CURRENCIES } from '@/lib/constants'
import type { Profile } from '@/types/database'

interface Props {
  profile: Profile | null
  userEmail: string
}

export default function SettingsClient({ profile, userEmail }: Props) {
  const [isPending, startTransition] = useTransition()
  const [isSigningOut, startSignOutTransition] = useTransition()
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const router = useRouter()

  function handleUpdateProfile(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setMessage(null)
    const formData = new FormData(e.currentTarget)
    startTransition(async () => {
      const result = await updateProfile(formData)
      if (result.success) {
        setMessage({ type: 'success', text: 'Profile updated successfully!' })
        router.refresh()
      } else {
        setMessage({ type: 'error', text: result.error || 'Failed to update profile' })
      }
    })
  }

  function handleSignOut() {
    startSignOutTransition(async () => {
      await signOut()
    })
  }

  const initials = getInitials(profile?.full_name || userEmail)

  return (
    <div className="space-y-5">
      {/* Account section */}
      <div className="rounded-2xl border border-[rgba(30,45,69,0.8)] bg-[rgba(20,29,46,0.6)] backdrop-blur-sm p-6">
        <h2 className="text-base font-display font-semibold text-white mb-5 flex items-center gap-2">
          <User className="w-4 h-4 text-[#D4A017]" />
          Profile
        </h2>

        {/* Avatar */}
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-2xl bg-[#D4A017]/15 border border-[#D4A017]/25 flex items-center justify-center">
            {profile?.avatar_url ? (
              <img src={profile.avatar_url} alt="Avatar" className="w-full h-full object-cover rounded-2xl" />
            ) : (
              <span className="text-[#D4A017] font-display font-bold text-xl">{initials}</span>
            )}
          </div>
          <div>
            <div className="text-white font-semibold text-sm">{profile?.full_name || 'Traveler'}</div>
            <div className="text-[#8ea3be] text-xs flex items-center gap-1.5 mt-0.5">
              <Mail className="w-3 h-3" />
              {userEmail}
            </div>
          </div>
        </div>

        <form onSubmit={handleUpdateProfile} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#8ea3be] mb-1.5">Full Name</label>
            <input
              name="full_name"
              defaultValue={profile?.full_name || ''}
              placeholder="Your name"
              className="form-input w-full"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#8ea3be] mb-1.5">
              <span className="flex items-center gap-1.5"><Globe className="w-3 h-3" /> Preferred Currency</span>
            </label>
            <select
              name="preferred_currency"
              defaultValue={profile?.preferred_currency || 'USD'}
              className="form-input w-full"
            >
              {CURRENCIES.map(c => (
                <option key={c.code} value={c.code}>{c.code} — {c.name} ({c.symbol})</option>
              ))}
            </select>
          </div>

          {message && (
            <div className={`p-3 rounded-xl text-sm border ${message.type === 'success'
              ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
              : 'bg-red-500/10 border-red-500/20 text-red-400'}`}>
              {message.text}
            </div>
          )}

          <button
            type="submit"
            disabled={isPending}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#D4A017] text-[#0B1120] font-bold text-sm hover:bg-[#e8b832] transition-all disabled:opacity-60 hover:-translate-y-px"
          >
            {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save Changes
          </button>
        </form>
      </div>

      {/* Account info */}
      <div className="rounded-2xl border border-[rgba(30,45,69,0.8)] bg-[rgba(20,29,46,0.6)] backdrop-blur-sm p-6">
        <h2 className="text-base font-display font-semibold text-white mb-4 flex items-center gap-2">
          <Mail className="w-4 h-4 text-[#0891B2]" />
          Account
        </h2>
        <div className="flex items-center justify-between py-3 border-b border-[rgba(30,45,69,0.4)]">
          <div>
            <div className="text-sm font-medium text-white">Email address</div>
            <div className="text-xs text-[#4d6080] mt-0.5">{userEmail}</div>
          </div>
        </div>
        <div className="flex items-center justify-between pt-3">
          <div>
            <div className="text-sm font-medium text-white">Session</div>
            <div className="text-xs text-[#4d6080] mt-0.5">You are currently signed in</div>
          </div>
          <button
            onClick={handleSignOut}
            disabled={isSigningOut}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-[#8ea3be] hover:text-white hover:bg-white/8 border border-[rgba(30,45,69,0.8)] transition-all"
          >
            {isSigningOut ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <LogOut className="w-3.5 h-3.5" />}
            Sign Out
          </button>
        </div>
      </div>

      {/* Danger zone */}
      <div className="rounded-2xl border border-red-500/20 bg-red-500/5 backdrop-blur-sm p-6">
        <h2 className="text-base font-display font-semibold text-red-400 mb-3 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4" />
          Danger Zone
        </h2>
        <p className="text-xs text-[#8ea3be] mb-4">
          Permanently delete your account and all associated trip data. This action cannot be undone.
        </p>
        <button
          disabled
          className="px-4 py-2 rounded-xl text-sm font-semibold text-red-400 border border-red-500/20 opacity-40 cursor-not-allowed"
          title="Contact support to delete your account"
        >
          Delete Account
        </button>
      </div>
    </div>
  )
}
