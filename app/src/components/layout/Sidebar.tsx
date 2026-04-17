'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Map,
  Plane,
  Wallet,
  CheckSquare,
  Settings,
  ChevronLeft,
  ChevronRight,
  Globe,
  BookOpen,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { BRAND_NAME } from '@/lib/constants'

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/trips', label: 'My Trips', icon: Globe },
]

interface SidebarProps {
  tripId?: string
  tripName?: string
}

export default function Sidebar({ tripId: propTripId, tripName }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false)
  const pathname = usePathname()

  // Auto-detect tripId from pathname if not provided as prop
  const tripIdMatch = pathname.match(/^\/trips\/([^/]+)/)
  const tripId = propTripId || (tripIdMatch ? tripIdMatch[1] : undefined)
  const isNewTrip = pathname === '/trips/new'

  const tripNavItems = tripId && !isNewTrip ? [
    { href: `/trips/${tripId}`, label: 'Overview', icon: Map },
    { href: `/trips/${tripId}/itinerary`, label: 'Itinerary', icon: Plane },
    { href: `/trips/${tripId}/bookings`, label: 'Bookings', icon: BookOpen },
    { href: `/trips/${tripId}/budget`, label: 'Budget', icon: Wallet },
    { href: `/trips/${tripId}/checklist`, label: 'Checklist', icon: CheckSquare },
  ] : []

  return (
    <aside
      className={cn(
        'relative flex flex-col border-r border-[rgba(30,45,69,0.8)] bg-[rgba(11,17,32,0.95)] backdrop-blur-xl transition-all duration-300 shrink-0',
        collapsed ? 'w-16' : 'w-64'
      )}
      style={{ minHeight: '100vh' }}
    >
      {/* Logo */}
      <div className={cn(
        'flex items-center gap-3 px-4 py-5 border-b border-[rgba(30,45,69,0.6)]',
        collapsed && 'justify-center px-2'
      )}>
        <div className="w-8 h-8 rounded-lg bg-[#D4A017]/15 border border-[#D4A017]/25 flex items-center justify-center shrink-0">
          <Plane className="w-4 h-4 text-[#D4A017]" />
        </div>
        {!collapsed && (
          <span className="font-display font-bold text-lg text-white tracking-tight">{BRAND_NAME}</span>
        )}
      </div>

      {/* Main nav */}
      <nav className="flex-1 px-2 pt-4 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map(item => {
          const Icon = item.icon
          const active = pathname === item.href || (item.href === '/trips' && pathname.startsWith('/trips') && !tripNavItems.length)
          return (
            <Link
              key={item.href}
              href={item.href}
              title={collapsed ? item.label : undefined}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group',
                active
                  ? 'bg-[#D4A017]/10 text-[#D4A017] border border-[#D4A017]/15'
                  : 'text-[#8ea3be] hover:text-white hover:bg-white/5',
                collapsed && 'justify-center px-2'
              )}
            >
              <Icon className={cn('shrink-0', active ? 'text-[#D4A017]' : 'text-[#4d6080] group-hover:text-white', collapsed ? 'w-5 h-5' : 'w-4 h-4')} />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          )
        })}

        {/* Trip context nav */}
        {tripNavItems.length > 0 && (
          <>
            <div className={cn('pt-4 pb-2', !collapsed && 'px-3')}>
              {!collapsed && (
                <div className="mb-2">
                  <p className="text-[10px] text-[#4d6080] uppercase tracking-widest font-semibold mb-1">Current Trip</p>
                  {tripName && (
                    <p className="text-xs text-[#8ea3be] truncate font-medium">{tripName}</p>
                  )}
                </div>
              )}
              <div className={cn('h-px bg-[rgba(30,45,69,0.6)]', collapsed && 'mx-2')} />
            </div>

            {tripNavItems.map(item => {
              const Icon = item.icon
              const active = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  title={collapsed ? item.label : undefined}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-150 group',
                    active
                      ? 'bg-[#0891B2]/10 text-[#22d3ee] border border-[#0891B2]/15'
                      : 'text-[#8ea3be] hover:text-white hover:bg-white/5',
                    collapsed && 'justify-center px-2'
                  )}
                >
                  <Icon className={cn('shrink-0', active ? 'text-[#22d3ee]' : 'text-[#4d6080] group-hover:text-white', collapsed ? 'w-5 h-5' : 'w-4 h-4')} />
                  {!collapsed && <span>{item.label}</span>}
                </Link>
              )
            })}
          </>
        )}
      </nav>

      {/* Settings & collapse */}
      <div className="p-2 border-t border-[rgba(30,45,69,0.6)] space-y-1">
        <Link
          href="/settings"
          title={collapsed ? 'Settings' : undefined}
          className={cn(
            'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-[#8ea3be] hover:text-white hover:bg-white/5 transition-all duration-150 group',
            collapsed && 'justify-center px-2'
          )}
        >
          <Settings className="w-4 h-4 text-[#4d6080] group-hover:text-white shrink-0" />
          {!collapsed && <span>Settings</span>}
        </Link>

        <button
          onClick={() => setCollapsed(!collapsed)}
          className={cn(
            'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-[#4d6080] hover:text-white hover:bg-white/5 transition-all duration-150 w-full',
            collapsed && 'justify-center px-2'
          )}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : (
            <>
              <ChevronLeft className="w-4 h-4" />
              <span>Collapse</span>
            </>
          )}
        </button>
      </div>
    </aside>
  )
}
