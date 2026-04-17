import { Suspense } from 'react'
import Link from 'next/link'
import { Plus, Globe, Calendar, TrendingUp, MapPin, ArrowRight, Clock, Users } from 'lucide-react'
import { getTrips, getTripStats, getUpcomingTrips } from '@/app/actions/trips'
import { formatDate, getDaysUntil, getDaysBetween, getTripStatusColor } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { SkeletonCard } from '@/components/ui/skeleton'
import type { Trip } from '@/types/database'

function StatCard({ icon: Icon, label, value, sublabel, color = '#D4A017' }: {
  icon: React.ElementType
  label: string
  value: string | number
  sublabel?: string
  color?: string
}) {
  return (
    <div className="rounded-2xl border border-[rgba(30,45,69,0.8)] bg-[rgba(20,29,46,0.6)] backdrop-blur-sm p-5 hover:border-[rgba(212,160,23,0.15)] transition-all duration-300 group">
      <div className="flex items-start justify-between mb-3">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ background: `${color}15`, border: `1px solid ${color}25` }}
        >
          <Icon className="w-5 h-5" style={{ color }} />
        </div>
      </div>
      <div>
        <div className="text-3xl font-display font-bold text-white mb-1">{value}</div>
        <div className="text-sm font-medium text-[#8ea3be]">{label}</div>
        {sublabel && <div className="text-xs text-[#4d6080] mt-0.5">{sublabel}</div>}
      </div>
    </div>
  )
}

function TripCard({ trip }: { trip: Trip }) {
  const daysUntil = getDaysUntil(trip.start_date)
  const duration = getDaysBetween(trip.start_date, trip.end_date)
  const isPast = new Date(trip.end_date) < new Date()

  // gradient backgrounds for trip cards
  const gradients = [
    'from-blue-900/60 to-indigo-900/60',
    'from-emerald-900/60 to-teal-900/60',
    'from-amber-900/60 to-orange-900/60',
    'from-purple-900/60 to-pink-900/60',
    'from-cyan-900/60 to-blue-900/60',
    'from-rose-900/60 to-red-900/60',
  ]
  const gradient = gradients[trip.name.charCodeAt(0) % gradients.length]

  return (
    <Link href={`/trips/${trip.id}`} data-cy="trip-card">
      <div className="group relative rounded-2xl border border-[rgba(30,45,69,0.8)] overflow-hidden hover:border-[rgba(212,160,23,0.2)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(0,0,0,0.4)] cursor-pointer">
        {/* Header gradient */}
        <div className={`h-32 bg-gradient-to-br ${gradient} relative overflow-hidden`}>
          <div className="absolute inset-0 opacity-20">
            <div className="absolute inset-0" style={{
              backgroundImage: 'radial-gradient(circle at 30% 50%, rgba(255,255,255,0.1) 0%, transparent 50%)',
            }} />
          </div>
          {/* Destination */}
          <div className="absolute bottom-4 left-4">
            <div className="flex items-center gap-1.5 mb-1">
              <MapPin className="w-3.5 h-3.5 text-white/70" />
              <span className="text-white/70 text-xs font-body">{trip.destination}</span>
            </div>
            <h3 className="text-white font-display font-semibold text-lg leading-tight">{trip.name}</h3>
          </div>
          {/* Status badge */}
          <div className="absolute top-3 right-3">
            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider border ${getTripStatusColor(trip.status)}`}>
              {trip.status}
            </span>
          </div>
        </div>

        {/* Body */}
        <div className="p-4 bg-[rgba(20,29,46,0.8)] backdrop-blur-sm">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-1.5 text-[#8ea3be]">
              <Calendar className="w-3.5 h-3.5 text-[#4d6080]" />
              <span className="font-body text-xs">
                {formatDate(trip.start_date, 'MMM d')} — {formatDate(trip.end_date, 'MMM d, yyyy')}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-[#8ea3be]">
              <Users className="w-3.5 h-3.5 text-[#4d6080]" />
              <span className="font-body text-xs">{trip.travelers}</span>
            </div>
          </div>

          <div className="flex items-center justify-between mt-3">
            <div className="text-xs font-body">
              {isPast ? (
                <span className="text-[#4d6080]">{duration} days</span>
              ) : daysUntil > 0 ? (
                <span className="text-[#D4A017] font-medium">In {daysUntil} days</span>
              ) : trip.status === 'active' ? (
                <span className="text-emerald-400 font-medium">Happening now</span>
              ) : (
                <span className="text-[#4d6080]">{duration} days</span>
              )}
            </div>
            <div className="flex items-center gap-1 text-[#4d6080] group-hover:text-[#D4A017] transition-colors">
              <span className="text-xs font-body">View</span>
              <ArrowRight className="w-3 h-3" />
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}

async function DashboardContent() {
  const [stats, upcomingTrips, allTrips] = await Promise.all([
    getTripStats(),
    getUpcomingTrips(5),
    getTrips(),
  ])

  const recentTrips = allTrips.slice(0, 6)

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* Hero greeting */}
      <div>
        <h1 className="text-4xl font-display font-bold text-white mb-2">
          Welcome back ✈️
        </h1>
        <p className="text-[#8ea3be] font-body">
          {stats.upcomingTrips > 0
            ? `You have ${stats.upcomingTrips} upcoming trip${stats.upcomingTrips > 1 ? 's' : ''} — let's keep planning.`
            : "Ready to plan your next adventure? Let's go."}
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="animate-fade-in-up stagger-1">
          <StatCard
            icon={Globe}
            label="Total Trips"
            value={stats.totalTrips}
            sublabel="All time"
            color="#D4A017"
          />
        </div>
        <div className="animate-fade-in-up stagger-2">
          <StatCard
            icon={Clock}
            label="Upcoming"
            value={stats.upcomingTrips}
            sublabel="Trips planned"
            color="#0891B2"
          />
        </div>
        <div className="animate-fade-in-up stagger-3">
          <StatCard
            icon={Calendar}
            label="Days Traveled"
            value={stats.totalDays}
            sublabel="Completed trips"
            color="#10b981"
          />
        </div>
        <div className="animate-fade-in-up stagger-4">
          <StatCard
            icon={MapPin}
            label="Destinations"
            value={stats.destinations}
            sublabel="Unique places"
            color="#a78bfa"
          />
        </div>
      </div>

      {/* Upcoming trips */}
      {upcomingTrips.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-display font-semibold text-white">Upcoming Trips</h2>
            <Link href="/trips" className="text-sm text-[#D4A017] hover:text-[#e8b832] font-body flex items-center gap-1 transition-colors">
              View all <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {upcomingTrips.map(trip => (
              <div key={trip.id} className="animate-fade-in-up">
                <TripCard trip={trip} />
              </div>
            ))}
            {/* Add trip CTA */}
            <Link href="/trips/new" data-cy="new-trip-cta">
              <div className="rounded-2xl border-2 border-dashed border-[rgba(30,45,69,0.8)] hover:border-[#D4A017]/30 transition-all duration-300 flex flex-col items-center justify-center p-8 text-center cursor-pointer group min-h-[220px] hover:bg-[#D4A017]/3">
                <div className="w-12 h-12 rounded-2xl bg-[#D4A017]/10 border border-[#D4A017]/20 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <Plus className="w-6 h-6 text-[#D4A017]" />
                </div>
                <p className="text-[#8ea3be] font-medium text-sm font-body">Plan new trip</p>
                <p className="text-[#4d6080] text-xs font-body mt-1">Add your next adventure</p>
              </div>
            </Link>
          </div>
        </section>
      )}

      {/* Recent trips / empty state */}
      {allTrips.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-6xl mb-4 animate-float">✈️</div>
          <h2 className="text-2xl font-display font-bold text-white mb-3">Plan your first trip</h2>
          <p className="text-[#8ea3be] font-body mb-8 max-w-sm mx-auto">
            Start by creating a trip. Add your itinerary, manage bookings, and track your budget — all in one place.
          </p>
          <Link
            href="/trips/new"
            data-cy="create-first-trip"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#D4A017] text-[#0B1120] font-semibold hover:bg-[#e8b832] transition-all hover:-translate-y-px hover:shadow-glow-gold"
          >
            <Plus className="w-4 h-4" />
            Create your first trip
          </Link>
        </div>
      ) : recentTrips.length > 0 && upcomingTrips.length === 0 ? (
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-display font-semibold text-white">Your Trips</h2>
            <Link href="/trips/new" className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#D4A017] text-[#0B1120] text-sm font-semibold hover:bg-[#e8b832] transition-all">
              <Plus className="w-4 h-4" /> New Trip
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {recentTrips.map(trip => (
              <TripCard key={trip.id} trip={trip} />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  )
}

export default function DashboardPage() {
  return (
    <Suspense fallback={
      <div className="space-y-8">
        <div className="space-y-2">
          <div className="h-10 w-72 rounded-xl skeleton" />
          <div className="h-5 w-96 rounded-lg skeleton" />
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[1,2,3,4].map(i => (
            <div key={i} className="h-28 rounded-2xl skeleton" />
          ))}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1,2,3].map(i => <SkeletonCard key={i} />)}
        </div>
      </div>
    }>
      <DashboardContent />
    </Suspense>
  )
}
