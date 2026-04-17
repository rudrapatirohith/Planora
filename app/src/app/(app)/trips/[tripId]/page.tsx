import { notFound } from 'next/navigation'
import Link from 'next/link'
import {
  MapPin, Calendar, Users, DollarSign, Plane, Map, Wallet,
  CheckSquare, Globe, ArrowRight, Edit2, Archive, Clock
} from 'lucide-react'
import { getTripById } from '@/app/actions/trips'
import { getBookings } from '@/app/actions/bookings'
import { getExpenses, getBudgetCategories } from '@/app/actions/budget'
import { getChecklists } from '@/app/actions/checklist'
import { getItineraryDays } from '@/app/actions/itinerary'
import { formatDate, getDaysBetween, getDaysUntil, getTripStatusColor, formatCurrency } from '@/lib/utils'
import TripOverviewClient from '@/components/trips/TripOverviewClient'
import type { Metadata } from 'next'

export async function generateMetadata({ params }: { params: Promise<{ tripId: string }> }): Promise<Metadata> {
  const { tripId } = await params
  const trip = await getTripById(tripId)
  return { title: trip ? `${trip.name} | Planora` : 'Trip | Planora' }
}

export default async function TripOverviewPage({ params }: { params: Promise<{ tripId: string }> }) {
  const { tripId } = await params
  const trip = await getTripById(tripId)
  if (!trip) notFound()

  const [bookings, expenses, categories, checklists, itineraryDays] = await Promise.all([
    getBookings(tripId),
    getExpenses(tripId),
    getBudgetCategories(tripId),
    getChecklists(tripId),
    getItineraryDays(tripId),
  ])

  const duration = getDaysBetween(trip.start_date, trip.end_date)
  const daysUntil = getDaysUntil(trip.start_date)
  const isPast = new Date(trip.end_date) < new Date()

  const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0)
  const totalBudget = trip.total_budget || 0
  const budgetPct = totalBudget > 0 ? Math.min(100, Math.round((totalSpent / totalBudget) * 100)) : 0

  const confirmedBookings = bookings.filter(b => b.status === 'confirmed').length
  const totalItineraryItems = itineraryDays.reduce((sum, d) => sum + d.items.length, 0)
  const checklistOverall = checklists.reduce(
    (acc, cl) => ({ completed: acc.completed + cl.completedCount, total: acc.total + cl.totalCount }),
    { completed: 0, total: 0 }
  )

  const CARD_GRADIENTS = [
    'from-blue-900/70 to-indigo-900/70',
    'from-emerald-900/70 to-teal-900/70',
    'from-amber-900/70 to-orange-900/70',
    'from-purple-900/70 to-pink-900/70',
  ]
  const gradient = CARD_GRADIENTS[trip.name.charCodeAt(0) % CARD_GRADIENTS.length]

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-fade-in-up">
      {/* Hero card */}
      <div className={`rounded-2xl bg-gradient-to-br ${gradient} relative overflow-hidden`}>
        <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 30% 50%, rgba(255,255,255,0.06) 0%, transparent 50%)' }} />
        <div className="relative p-8">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="w-4 h-4 text-white/60" />
                <span className="text-white/60 text-sm">{trip.destination}</span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider border ml-2 ${getTripStatusColor(trip.status)}`}>
                  {trip.status}
                </span>
              </div>
              <h1 className="text-3xl font-display font-bold text-white mb-4">{trip.name}</h1>
              <div className="flex items-center gap-6 text-sm text-white/70 flex-wrap">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4" />
                  <span>{formatDate(trip.start_date, 'MMM d')} — {formatDate(trip.end_date, 'MMM d, yyyy')}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4" />
                  <span>{duration} days</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Users className="w-4 h-4" />
                  <span>{trip.travelers} traveler{trip.travelers !== 1 ? 's' : ''}</span>
                </div>
                {totalBudget > 0 && (
                  <div className="flex items-center gap-1.5">
                    <DollarSign className="w-4 h-4" />
                    <span>{formatCurrency(totalBudget, trip.currency)} budget</span>
                  </div>
                )}
              </div>

              {/* Countdown */}
              {!isPast && daysUntil > 0 && (
                <div className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-sm">
                  <Plane className="w-3.5 h-3.5 text-[#D4A017]" />
                  <span className="text-white text-sm font-semibold">
                    {daysUntil === 1 ? 'Tomorrow!' : `${daysUntil} days until departure`}
                  </span>
                </div>
              )}
              {trip.status === 'active' && (
                <div className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-500/30">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-emerald-300 text-sm font-semibold">Happening now</span>
                </div>
              )}
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-2">
              <TripOverviewClient trip={trip} />
            </div>
          </div>
        </div>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            href: `itinerary`,
            icon: Map,
            label: 'Itinerary Items',
            value: totalItineraryItems,
            sub: `${itineraryDays.length} days planned`,
            color: '#D4A017',
          },
          {
            href: `bookings`,
            icon: Globe,
            label: 'Bookings',
            value: bookings.length,
            sub: `${confirmedBookings} confirmed`,
            color: '#0891B2',
          },
          {
            href: `budget`,
            icon: Wallet,
            label: totalBudget > 0 ? 'Budget Used' : 'Total Spent',
            value: totalBudget > 0 ? `${budgetPct}%` : formatCurrency(totalSpent, trip.currency),
            sub: totalBudget > 0 ? `${formatCurrency(totalSpent, trip.currency)} of ${formatCurrency(totalBudget, trip.currency)}` : `${expenses.length} expenses`,
            color: budgetPct > 90 ? '#ef4444' : '#10b981',
          },
          {
            href: `checklist`,
            icon: CheckSquare,
            label: 'Checklist',
            value: checklistOverall.total > 0
              ? `${checklistOverall.completed}/${checklistOverall.total}`
              : '—',
            sub: checklistOverall.total > 0
              ? `${Math.round((checklistOverall.completed / checklistOverall.total) * 100)}% complete`
              : 'No items yet',
            color: '#a78bfa',
          },
        ].map(stat => {
          const Icon = stat.icon
          return (
            <Link key={stat.href} href={stat.href}>
              <div className="rounded-2xl border border-[rgba(30,45,69,0.8)] bg-[rgba(20,29,46,0.6)] backdrop-blur-sm p-5 hover:border-[rgba(212,160,23,0.15)] transition-all duration-200 group cursor-pointer hover:-translate-y-0.5">
                <div className="flex items-start justify-between mb-3">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: `${stat.color}15`, border: `1px solid ${stat.color}25` }}>
                    <Icon className="w-4 h-4" style={{ color: stat.color }} />
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-[#4d6080] group-hover:text-[#D4A017] transition-colors" />
                </div>
                <div className="text-2xl font-display font-bold text-white mb-0.5">{stat.value}</div>
                <div className="text-sm text-[#8ea3be]">{stat.label}</div>
                <div className="text-xs text-[#4d6080] mt-0.5">{stat.sub}</div>
              </div>
            </Link>
          )
        })}
      </div>

      {/* Budget progress bar (if budget set) */}
      {totalBudget > 0 && (
        <div className="rounded-2xl border border-[rgba(30,45,69,0.8)] bg-[rgba(20,29,46,0.6)] backdrop-blur-sm p-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-display font-semibold text-white">Budget Overview</h2>
            <Link href="budget" className="text-xs text-[#D4A017] hover:text-[#e8b832] transition-colors flex items-center gap-1">
              Manage <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-[#8ea3be]">Spent: <span className="text-white font-semibold">{formatCurrency(totalSpent, trip.currency)}</span></span>
            <span className="text-[#8ea3be]">Budget: <span className="text-white font-semibold">{formatCurrency(totalBudget, trip.currency)}</span></span>
          </div>
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{
                width: `${budgetPct}%`,
                background: budgetPct > 90 ? '#ef4444' : budgetPct > 70 ? '#f59e0b' : '#10b981',
              }}
            />
          </div>
          <div className="text-xs text-[#4d6080] mt-2">{budgetPct}% of budget used</div>
        </div>
      )}

      {/* Upcoming bookings */}
      {bookings.length > 0 && (
        <div className="rounded-2xl border border-[rgba(30,45,69,0.8)] bg-[rgba(20,29,46,0.6)] backdrop-blur-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-display font-semibold text-white">Bookings</h2>
            <Link href="bookings" className="text-xs text-[#D4A017] hover:text-[#e8b832] transition-colors flex items-center gap-1">
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="space-y-2">
            {bookings.slice(0, 4).map(b => (
              <div key={b.id} className="flex items-center justify-between py-2 border-b border-[rgba(30,45,69,0.4)] last:border-0">
                <div className="flex items-center gap-3">
                  <div className="text-xs font-semibold uppercase text-[#4d6080] w-14 shrink-0">{b.type}</div>
                  <div>
                    <div className="text-sm text-white font-medium">{b.title}</div>
                    {b.provider && <div className="text-xs text-[#4d6080]">{b.provider}</div>}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {b.amount && <span className="text-sm text-[#8ea3be]">{formatCurrency(b.amount, b.currency)}</span>}
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase
                    ${b.status === 'confirmed' ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20'
                    : b.status === 'pending' ? 'bg-amber-500/15 text-amber-400 border border-amber-500/20'
                    : b.status === 'cancelled' ? 'bg-red-500/15 text-red-400 border border-red-500/20'
                    : 'bg-blue-500/15 text-blue-400 border border-blue-500/20'}`}>
                    {b.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Notes */}
      {trip.notes && (
        <div className="rounded-2xl border border-[rgba(30,45,69,0.8)] bg-[rgba(20,29,46,0.6)] backdrop-blur-sm p-6">
          <h2 className="text-base font-display font-semibold text-white mb-3">Notes</h2>
          <p className="text-[#8ea3be] text-sm leading-relaxed whitespace-pre-line">{trip.notes}</p>
        </div>
      )}
    </div>
  )
}
