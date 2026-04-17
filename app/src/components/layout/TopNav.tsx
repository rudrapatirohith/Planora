'use client'

import { usePathname } from 'next/navigation'
import { Bell, Search } from 'lucide-react'
import UserMenu from './UserMenu'
import type { Profile } from '@/types/database'

// Map routes to readable titles
function getPageTitle(pathname: string): string {
  if (pathname === '/dashboard') return 'Dashboard'
  if (pathname === '/trips') return 'My Trips'
  if (pathname === '/trips/new') return 'New Trip'
  if (pathname.match(/\/trips\/[^/]+\/itinerary/)) return 'Itinerary'
  if (pathname.match(/\/trips\/[^/]+\/bookings/)) return 'Bookings'
  if (pathname.match(/\/trips\/[^/]+\/budget/)) return 'Budget & Expenses'
  if (pathname.match(/\/trips\/[^/]+\/checklist/)) return 'Checklist'
  if (pathname.match(/\/trips\/[^/]+\/edit/)) return 'Edit Trip'
  if (pathname.match(/\/trips\/[^/]+/)) return 'Trip Details'
  if (pathname === '/settings') return 'Settings'
  if (pathname === '/settings/profile') return 'Profile'
  return 'Planora'
}

interface TopNavProps {
  profile: Profile | null
}

export default function TopNav({ profile }: TopNavProps) {
  const pathname = usePathname()
  const title = getPageTitle(pathname)

  return (
    <header className="sticky top-0 z-40 flex items-center justify-between px-6 py-3 border-b border-[rgba(30,45,69,0.6)] bg-[rgba(11,17,32,0.85)] backdrop-blur-xl">
      <div className="flex items-center gap-3">
        <h1 className="text-lg font-display font-semibold text-white hidden sm:block">{title}</h1>
      </div>

      <div className="flex items-center gap-2">
        {/* Search placeholder */}
        <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[rgba(30,45,69,0.8)] bg-[rgba(20,29,46,0.5)] text-[#4d6080] text-sm hover:bg-[rgba(30,45,69,0.4)] transition-colors">
          <Search className="w-4 h-4" />
          <span className="hidden sm:block text-xs">Search...</span>
          <kbd className="hidden sm:block text-[10px] px-1.5 py-0.5 rounded bg-[rgba(30,45,69,0.8)] border border-[rgba(30,45,69,0.8)]">⌘K</kbd>
        </button>

        {/* Notifications */}
        <button className="relative w-9 h-9 rounded-lg border border-[rgba(30,45,69,0.8)] bg-[rgba(20,29,46,0.5)] flex items-center justify-center text-[#4d6080] hover:text-white hover:bg-[rgba(30,45,69,0.4)] transition-colors">
          <Bell className="w-4 h-4" />
        </button>

        {/* Mobile user menu */}
        <div className="md:hidden">
          <UserMenu profile={profile} />
        </div>
      </div>
    </header>
  )
}
