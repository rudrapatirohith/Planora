'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { LogOut, User, Settings, ChevronDown } from 'lucide-react'
import { logout } from '@/app/actions/auth'
import { getInitials } from '@/lib/utils'
import type { Profile } from '@/types/database'

interface UserMenuProps {
  profile: Profile | null
  collapsed?: boolean
}

export default function UserMenu({ profile, collapsed = false }: UserMenuProps) {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  function handleLogout() {
    startTransition(async () => {
      await logout()
    })
  }

  const initials = getInitials(profile?.full_name || profile?.email)
  const displayName = profile?.full_name || profile?.email?.split('@')[0] || 'User'

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          data-cy="user-menu-trigger"
          className="flex items-center gap-2.5 rounded-xl px-2 py-2 hover:bg-white/5 transition-colors w-full text-left"
        >
          {/* Avatar */}
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#D4A017] to-[#0891B2] flex items-center justify-center text-[#0B1120] text-xs font-bold shrink-0 overflow-hidden">
            {profile?.avatar_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={profile.avatar_url} alt={displayName} className="w-full h-full object-cover" />
            ) : (
              <span>{initials}</span>
            )}
          </div>

          {!collapsed && (
            <>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">{displayName}</p>
                <p className="text-xs text-[#4d6080] truncate">{profile?.email}</p>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-[#4d6080] shrink-0" />
            </>
          )}
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" side="right" className="w-56">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium text-white">{displayName}</p>
            <p className="text-xs text-[#4d6080] truncate">{profile?.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        <DropdownMenuItem
          data-cy="profile-link"
          onClick={() => router.push('/settings/profile')}
          className="flex items-center gap-2 cursor-pointer"
        >
          <User className="w-4 h-4" />
          Profile
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => router.push('/settings')}
          className="flex items-center gap-2 cursor-pointer"
        >
          <Settings className="w-4 h-4" />
          Settings
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          data-cy="logout-button"
          onClick={handleLogout}
          className="flex items-center gap-2 cursor-pointer text-red-400 focus:text-red-400 focus:bg-red-500/10"
          disabled={isPending}
        >
          <LogOut className="w-4 h-4" />
          {isPending ? 'Signing out...' : 'Sign out'}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
