'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import {
  Plus, X, Loader2, Plane, Building2, Train, Bus,
  Car, Map, Package, Trash2, Edit2, DollarSign, FileText, Calendar
} from 'lucide-react'
import { createBooking, updateBooking, deleteBooking } from '@/app/actions/bookings'
import { BOOKING_TYPES, BOOKING_STATUSES, CURRENCIES } from '@/lib/constants'
import { formatDate, formatCurrency } from '@/lib/utils'
import type { Trip, Booking } from '@/types/database'

const TYPE_ICONS: Record<string, React.ElementType> = {
  flight: Plane,
  hotel: Building2,
  train: Train,
  bus: Bus,
  car_rental: Car,
  tour: Map,
  other: Package,
}

const TYPE_COLORS: Record<string, string> = {
  flight: '#3b82f6',
  hotel: '#8b5cf6',
  train: '#10b981',
  bus: '#f59e0b',
  car_rental: '#06b6d4',
  tour: '#D4A017',
  other: '#6b7280',
}

interface Props {
  trip: Trip
  bookings: Booking[]
}

interface BookingFormState {
  type: Booking['type']
  title: string
  provider: string
  confirmation_number: string
  start_date: string
  end_date: string
  amount: string
  currency: string
  status: Booking['status']
  notes: string
}

const defaultForm = (tripCurrency = 'USD'): BookingFormState => ({
  type: 'flight',
  title: '',
  provider: '',
  confirmation_number: '',
  start_date: '',
  end_date: '',
  amount: '',
  currency: tripCurrency,
  status: 'confirmed',
  notes: '',
})

function BookingModal({
  tripId,
  tripCurrency,
  onClose,
  existing,
}: {
  tripId: string
  tripCurrency: string
  onClose: () => void
  existing?: Booking
}) {
  const [form, setForm] = useState<BookingFormState>(existing ? {
    type: existing.type,
    title: existing.title,
    provider: existing.provider || '',
    confirmation_number: existing.confirmation_number || '',
    start_date: existing.start_date || '',
    end_date: existing.end_date || '',
    amount: existing.amount?.toString() || '',
    currency: existing.currency,
    status: existing.status,
    notes: existing.notes || '',
  } : defaultForm(tripCurrency))
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    const fd = new FormData()
    fd.append('trip_id', tripId)
    Object.entries(form).forEach(([k, v]) => { if (v) fd.append(k, v) })

    startTransition(async () => {
      const result = existing
        ? await updateBooking(existing.id, fd)
        : await createBooking(fd)
      if (result.success) {
        onClose()
        router.refresh()
      } else {
        setError(result.error || 'Failed to save')
      }
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg rounded-2xl border border-[rgba(30,45,69,0.8)] bg-[#111827] shadow-[0_20px_60px_rgba(0,0,0,0.6)] p-6 animate-scale-in max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-display font-bold text-white">{existing ? 'Edit Booking' : 'Add Booking'}</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg text-[#4d6080] hover:text-white hover:bg-white/10 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Type buttons */}
          <div>
            <label className="block text-xs font-semibold text-[#8ea3be] mb-2">Type</label>
            <div className="flex gap-2 flex-wrap">
              {BOOKING_TYPES.map(t => {
                const Icon = TYPE_ICONS[t.value] || Package
                const color = TYPE_COLORS[t.value] || '#6b7280'
                const isActive = form.type === t.value
                return (
                  <button
                    key={t.value}
                    type="button"
                    onClick={() => setForm(f => ({ ...f, type: t.value as Booking['type'] }))}
                    className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all border"
                    style={isActive
                      ? { background: `${color}15`, color, borderColor: `${color}30` }
                      : { color: '#4d6080', borderColor: 'rgba(30,45,69,0.6)' }}
                  >
                    <Icon className="w-3 h-3" />
                    {t.label}
                  </button>
                )
              })}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#8ea3be] mb-1.5">Title *</label>
            <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} required placeholder="e.g. Flight to Tokyo" className="form-input w-full" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#8ea3be] mb-1.5">Provider</label>
              <input value={form.provider} onChange={e => setForm(f => ({ ...f, provider: e.target.value }))} placeholder="e.g. JAL, Marriott" className="form-input w-full" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#8ea3be] mb-1.5">Confirmation #</label>
              <input value={form.confirmation_number} onChange={e => setForm(f => ({ ...f, confirmation_number: e.target.value }))} placeholder="ABC123" className="form-input w-full" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#8ea3be] mb-1.5">Check-in / Departure</label>
              <input type="date" value={form.start_date} onChange={e => setForm(f => ({ ...f, start_date: e.target.value }))} className="form-input w-full" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#8ea3be] mb-1.5">Check-out / Arrival</label>
              <input type="date" value={form.end_date} onChange={e => setForm(f => ({ ...f, end_date: e.target.value }))} className="form-input w-full" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#8ea3be] mb-1.5">Amount</label>
              <input type="number" value={form.amount} onChange={e => setForm(f => ({ ...f, amount: e.target.value }))} placeholder="0.00" min="0" step="0.01" className="form-input w-full" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#8ea3be] mb-1.5">Currency</label>
              <select value={form.currency} onChange={e => setForm(f => ({ ...f, currency: e.target.value }))} className="form-input w-full">
                {CURRENCIES.map(c => <option key={c.code} value={c.code}>{c.code}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#8ea3be] mb-1.5">Status</label>
            <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value as Booking['status'] }))} className="form-input w-full">
              {BOOKING_STATUSES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#8ea3be] mb-1.5">Notes</label>
            <textarea value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} rows={2} className="form-input w-full resize-none" placeholder="Additional info..." />
          </div>

          {error && <div className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">{error}</div>}

          <div className="flex gap-2 pt-1">
            <button type="submit" disabled={isPending} className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#D4A017] text-[#0B1120] font-bold text-sm hover:bg-[#e8b832] transition-all disabled:opacity-60">
              {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
              {existing ? 'Save Changes' : 'Add Booking'}
            </button>
            <button type="button" onClick={onClose} className="px-4 rounded-xl border border-[rgba(30,45,69,0.8)] text-[#8ea3be] text-sm hover:text-white transition-colors">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function BookingCard({ booking, tripId }: { booking: Booking; tripId: string }) {
  const [editing, setEditing] = useState(false)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()
  const Icon = TYPE_ICONS[booking.type] || Package
  const color = TYPE_COLORS[booking.type] || '#6b7280'

  function handleDelete() {
    startTransition(async () => {
      await deleteBooking(booking.id, tripId)
      router.refresh()
    })
  }

  const statusConfig = {
    confirmed: { bg: 'bg-emerald-500/15', text: 'text-emerald-400', border: 'border-emerald-500/20' },
    pending: { bg: 'bg-amber-500/15', text: 'text-amber-400', border: 'border-amber-500/20' },
    cancelled: { bg: 'bg-red-500/15', text: 'text-red-400', border: 'border-red-500/20' },
    completed: { bg: 'bg-blue-500/15', text: 'text-blue-400', border: 'border-blue-500/20' },
  }[booking.status]

  return (
    <>
      <div className="group p-4 rounded-xl border border-[rgba(30,45,69,0.6)] bg-[rgba(20,29,46,0.4)] hover:border-[rgba(30,45,69,0.9)] transition-all hover:bg-[rgba(20,29,46,0.7)]">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${color}15`, border: `1px solid ${color}25` }}>
            <Icon className="w-4 h-4" style={{ color }} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="text-sm font-semibold text-white">{booking.title}</h3>
                {booking.provider && <p className="text-xs text-[#4d6080]">{booking.provider}</p>}
              </div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider border shrink-0 ${statusConfig.bg} ${statusConfig.text} ${statusConfig.border}`}>
                {booking.status}
              </span>
            </div>

            <div className="flex items-center gap-4 mt-2 text-xs text-[#8ea3be]">
              {(booking.start_date || booking.end_date) && (
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-[#4d6080]" />
                  {booking.start_date && formatDate(booking.start_date, 'MMM d')}
                  {booking.end_date && ` — ${formatDate(booking.end_date, 'MMM d')}`}
                </div>
              )}
              {booking.confirmation_number && (
                <div className="flex items-center gap-1">
                  <FileText className="w-3 h-3 text-[#4d6080]" />
                  {booking.confirmation_number}
                </div>
              )}
              {booking.amount && (
                <div className="flex items-center gap-1 text-[#D4A017] font-semibold">
                  <DollarSign className="w-3 h-3" />
                  {formatCurrency(booking.amount, booking.currency)}
                </div>
              )}
            </div>

            {booking.notes && <p className="text-xs text-[#4d6080] mt-1.5 line-clamp-1">{booking.notes}</p>}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
            <button onClick={() => setEditing(true)} className="p-1.5 rounded-lg text-[#4d6080] hover:text-white hover:bg-white/10 transition-colors">
              <Edit2 className="w-3.5 h-3.5" />
            </button>
            <button onClick={handleDelete} disabled={isPending} className="p-1.5 rounded-lg text-[#4d6080] hover:text-red-400 hover:bg-red-500/10 transition-colors">
              {isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>
      </div>

      {editing && (
        <BookingModal
          tripId={tripId}
          tripCurrency={booking.currency}
          onClose={() => setEditing(false)}
          existing={booking}
        />
      )}
    </>
  )
}

export default function BookingsClient({ trip, bookings }: Props) {
  const [showAdd, setShowAdd] = useState(false)

  // Group by type
  const grouped = BOOKING_TYPES.reduce<Record<string, Booking[]>>((acc, t) => {
    const items = bookings.filter(b => b.type === t.value)
    if (items.length > 0) acc[t.value] = items
    return acc
  }, {})

  const totalAmount = bookings.reduce((sum, b) => sum + (b.amount || 0), 0)

  return (
    <div className="space-y-4">
      {/* Header bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {bookings.length > 0 && (
            <>
              <span className="text-sm text-[#8ea3be]">
                {bookings.filter(b => b.status === 'confirmed').length} confirmed
              </span>
              {totalAmount > 0 && (
                <span className="text-sm text-[#D4A017] font-semibold">
                  {formatCurrency(totalAmount, trip.currency)} total
                </span>
              )}
            </>
          )}
        </div>
        <button
          onClick={() => setShowAdd(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#D4A017] text-[#0B1120] font-semibold text-sm hover:bg-[#e8b832] transition-all hover:-translate-y-px"
        >
          <Plus className="w-4 h-4" />
          Add Booking
        </button>
      </div>

      {/* Grouped sections */}
      {bookings.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-4xl mb-4">🎫</div>
          <h3 className="text-lg font-display font-semibold text-white mb-2">No bookings yet</h3>
          <p className="text-[#8ea3be] text-sm mb-6">Add your flights, hotels, and transport confirmations.</p>
          <button
            onClick={() => setShowAdd(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#D4A017] text-[#0B1120] font-semibold text-sm hover:bg-[#e8b832] transition-all"
          >
            <Plus className="w-4 h-4" />
            Add first booking
          </button>
        </div>
      ) : (
        Object.entries(grouped).map(([type, items]) => {
          const typeInfo = BOOKING_TYPES.find(t => t.value === type)
          const Icon = TYPE_ICONS[type] || Package
          const color = TYPE_COLORS[type] || '#6b7280'
          return (
            <div key={type}>
              <div className="flex items-center gap-2 mb-2 px-1">
                <Icon className="w-3.5 h-3.5" style={{ color }} />
                <span className="text-xs font-bold uppercase tracking-wider" style={{ color }}>
                  {typeInfo?.label || type}
                </span>
                <span className="text-xs text-[#4d6080]">({items.length})</span>
              </div>
              <div className="space-y-2">
                {items.map(b => (
                  <BookingCard key={b.id} booking={b} tripId={trip.id} />
                ))}
              </div>
            </div>
          )
        })
      )}

      {showAdd && (
        <BookingModal
          tripId={trip.id}
          tripCurrency={trip.currency}
          onClose={() => setShowAdd(false)}
        />
      )}
    </div>
  )
}
