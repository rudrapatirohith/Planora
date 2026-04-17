'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { MapPin, Calendar, Users, Globe, Clock, ArrowRight, Plus, Filter, Trash2, Archive, Edit2 } from 'lucide-react'
import { deleteTrip, archiveTrip } from '@/app/actions/trips'
import { Badge } from '@/components/ui/badge'
import { formatDate, getDaysUntil, getDaysBetween, getTripStatusColor } from '@/lib/utils'
import type { Trip } from '@/types/database'

const STATUS_TABS = [
  { value: 'all', label: 'All Trips' },
  { value: 'planning', label: 'Planning' },
  { value: 'active', label: 'Active' },
  { value: 'completed', label: 'Completed' },
  { value: 'archived', label: 'Archived' },
]

const CARD_GRADIENTS = [
  'from-blue-900/70 to-indigo-900/70',
  'from-emerald-900/70 to-teal-900/70',
  'from-amber-900/70 to-orange-900/70',
  'from-purple-900/70 to-pink-900/70',
  'from-cyan-900/70 to-blue-900/70',
  'from-rose-900/70 to-red-900/70',
]

function TripCard({ trip }: { trip: Trip }) {
  const [isPending, startTransition] = useTransition()
  const [confirming, setConfirming] = useState<'delete' | 'archive' | null>(null)
  const router = useRouter()

  const daysUntil = getDaysUntil(trip.start_date)
  const duration = getDaysBetween(trip.start_date, trip.end_date)
  const isPast = new Date(trip.end_date) < new Date()
  const gradient = CARD_GRADIENTS[trip.name.charCodeAt(0) % CARD_GRADIENTS.length]

  function handleDelete() {
    if (confirming === 'delete') {
      startTransition(async () => {
        await deleteTrip(trip.id)
        setConfirming(null)
        router.refresh()
      })
    } else {
      setConfirming('delete')
    }
  }

  function handleArchive() {
    startTransition(async () => {
      await archiveTrip(trip.id)
      setConfirming(null)
      router.refresh()
    })
  }

  return (
    <div className="group relative rounded-2xl border border-[rgba(30,45,69,0.8)] overflow-hidden hover:border-[rgba(212,160,23,0.2)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(0,0,0,0.4)]">
      {/* Header gradient */}
      <Link href={`/trips/${trip.id}`}>
        <div className={`h-36 bg-gradient-to-br ${gradient} relative overflow-hidden cursor-pointer`}>
          <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 30% 50%, rgba(255,255,255,0.08) 0%, transparent 50%)' }} />
          <div className="absolute bottom-4 left-4">
            <div className="flex items-center gap-1.5 mb-1">
              <MapPin className="w-3.5 h-3.5 text-white/60" />
              <span className="text-white/60 text-xs">{trip.destination}</span>
            </div>
            <h3 className="text-white font-display font-semibold text-lg leading-tight">{trip.name}</h3>
          </div>
          <div className="absolute top-3 right-3">
            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider border ${getTripStatusColor(trip.status)}`}>
              {trip.status}
            </span>
          </div>
        </div>
      </Link>

      {/* Body */}
      <div className="p-4 bg-[rgba(20,29,46,0.85)] backdrop-blur-sm">
        <div className="flex items-center justify-between text-xs text-[#8ea3be] mb-3">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-[#4d6080]" />
            <span>{formatDate(trip.start_date, 'MMM d')} — {formatDate(trip.end_date, 'MMM d, yyyy')}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-[#4d6080]" />
            <span>{trip.travelers}</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="text-xs">
            {isPast ? (
              <span className="text-[#4d6080]">{duration} days</span>
            ) : daysUntil > 0 ? (
              <span className="text-[#D4A017] font-semibold">In {daysUntil} days</span>
            ) : trip.status === 'active' ? (
              <span className="text-emerald-400 font-semibold">Happening now</span>
            ) : (
              <span className="text-[#4d6080]">{duration} days</span>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Link
              href={`/trips/${trip.id}`}
              className="p-1.5 rounded-lg hover:bg-white/10 text-[#4d6080] hover:text-[#D4A017] transition-colors"
              title="View trip"
            >
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <Link
              href={`/trips/${trip.id}/edit`}
              className="p-1.5 rounded-lg hover:bg-white/10 text-[#4d6080] hover:text-white transition-colors"
              title="Edit trip"
            >
              <Edit2 className="w-3.5 h-3.5" />
            </Link>
            {trip.status !== 'archived' && (
              <button
                onClick={handleArchive}
                disabled={isPending}
                className="p-1.5 rounded-lg hover:bg-white/10 text-[#4d6080] hover:text-[#0891B2] transition-colors"
                title="Archive trip"
              >
                <Archive className="w-3.5 h-3.5" />
              </button>
            )}
            <button
              onClick={handleDelete}
              disabled={isPending}
              className={`p-1.5 rounded-lg transition-colors ${confirming === 'delete' ? 'bg-red-500/20 text-red-400' : 'hover:bg-white/10 text-[#4d6080] hover:text-red-400'}`}
              title={confirming === 'delete' ? 'Click again to confirm delete' : 'Delete trip'}
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {confirming === 'delete' && (
          <div className="mt-2 text-xs text-red-400 font-medium animate-fade-in">
            Click 🗑️ again to permanently delete this trip
          </div>
        )}
      </div>
    </div>
  )
}

function EmptyState({ status }: { status?: string }) {
  return (
    <div className="col-span-full text-center py-20">
      <div className="text-5xl mb-5 animate-float">
        {status === 'completed' ? '🏆' : status === 'archived' ? '📦' : status === 'active' ? '🗺️' : '✈️'}
      </div>
      <h3 className="text-xl font-display font-semibold text-white mb-3">
        {status && status !== 'all' ? `No ${status} trips` : 'Start your journey'}
      </h3>
      <p className="text-[#8ea3be] font-body text-sm mb-8 max-w-xs mx-auto">
        {status === 'completed'
          ? 'Complete a trip to see it here.'
          : status === 'archived'
          ? "Archived trips will appear here."
          : "Create your first trip and start planning your next adventure."}
      </p>
      <Link
        href="/trips/new"
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#D4A017] text-[#0B1120] font-semibold text-sm hover:bg-[#e8b832] transition-all hover:-translate-y-px"
      >
        <Plus className="w-4 h-4" />
        New Trip
      </Link>
    </div>
  )
}

interface TripsClientProps {
  trips: Trip[]
  currentStatus?: string | Promise<string | undefined>
}

export default function TripsClient({ trips, currentStatus: statusProp }: TripsClientProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const status = searchParams.get('status') || 'all'

  function handleTabChange(value: string) {
    const params = new URLSearchParams(searchParams.toString())
    if (value === 'all') {
      params.delete('status')
    } else {
      params.set('status', value)
    }
    router.push(`/trips?${params.toString()}`)
  }

  return (
    <div className="space-y-6">
      {/* Status filter tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
        {STATUS_TABS.map(tab => (
          <button
            key={tab.value}
            onClick={() => handleTabChange(tab.value)}
            className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
              status === tab.value
                ? 'bg-[#D4A017]/10 text-[#D4A017] border border-[#D4A017]/20'
                : 'text-[#8ea3be] hover:text-white hover:bg-white/5 border border-transparent'
            }`}
          >
            {tab.label}
            {tab.value !== 'all' && trips.filter(t => t.status === tab.value).length > 0 && (
              <span className="ml-1.5 text-[10px] px-1.5 py-0.5 rounded-full bg-white/10">
                {trips.filter(t => t.status === tab.value).length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Trips grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {trips.length === 0 ? (
          <EmptyState status={status} />
        ) : (
          <>
            {trips.map((trip, i) => (
              <div key={trip.id} className="animate-fade-in-up" style={{ animationDelay: `${i * 0.05}s` }}>
                <TripCard trip={trip} />
              </div>
            ))}
            {/* New trip card */}
            <Link href="/trips/new">
              <div className="rounded-2xl border-2 border-dashed border-[rgba(30,45,69,0.8)] hover:border-[#D4A017]/30 transition-all duration-300 flex flex-col items-center justify-center p-8 text-center cursor-pointer group min-h-[240px] hover:bg-[#D4A017]/3">
                <div className="w-12 h-12 rounded-2xl bg-[#D4A017]/10 border border-[#D4A017]/20 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <Plus className="w-6 h-6 text-[#D4A017]" />
                </div>
                <p className="text-[#8ea3be] font-medium text-sm">Plan a new trip</p>
                <p className="text-[#4d6080] text-xs mt-1">Add your next adventure</p>
              </div>
            </Link>
          </>
        )}
      </div>
    </div>
  )
}
