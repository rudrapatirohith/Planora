'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import {
  Plus, X, Loader2, ChevronDown, ChevronUp, Clock,
  MapPin, Star, Plane, Building2, Car, UtensilsCrossed,
  Camera, MoreHorizontal, DollarSign, FileText, Trash2, Edit2
} from 'lucide-react'
import { addItineraryItem, updateItineraryItem, deleteItineraryItem } from '@/app/actions/itinerary'
import { ITINERARY_TYPES, CURRENCIES } from '@/lib/constants'
import { formatDate } from '@/lib/utils'
import type { Trip, ItineraryItem } from '@/types/database'
import type { ItineraryDayWithItems } from '@/types/app'

const TYPE_ICONS: Record<string, React.ElementType> = {
  activity: Star,
  flight: Plane,
  hotel: Building2,
  transport: Car,
  food: UtensilsCrossed,
  sightseeing: Camera,
  other: MoreHorizontal,
}

interface Props {
  trip: Trip
  days: ItineraryDayWithItems[]
}

interface ItemFormState {
  type: ItineraryItem['type']
  title: string
  description: string
  start_time: string
  end_time: string
  location: string
  booking_reference: string
  amount: string
  currency: string
  notes: string
}

const defaultForm = (): ItemFormState => ({
  type: 'activity',
  title: '',
  description: '',
  start_time: '',
  end_time: '',
  location: '',
  booking_reference: '',
  amount: '',
  currency: 'USD',
  notes: '',
})

function ItemForm({
  tripId, dayId, onClose, existing,
}: {
  tripId: string
  dayId: string
  onClose: () => void
  existing?: ItineraryItem
}) {
  const [form, setForm] = useState<ItemFormState>(existing ? {
    type: existing.type,
    title: existing.title,
    description: existing.description || '',
    start_time: existing.start_time || '',
    end_time: existing.end_time || '',
    location: existing.location || '',
    booking_reference: existing.booking_reference || '',
    amount: existing.amount?.toString() || '',
    currency: existing.currency,
    notes: existing.notes || '',
  } : defaultForm())
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    const fd = new FormData()
    fd.append('day_id', dayId)
    fd.append('trip_id', tripId)
    Object.entries(form).forEach(([k, v]) => { if (v) fd.append(k, v) })

    startTransition(async () => {
      const result = existing
        ? await updateItineraryItem(existing.id, fd)
        : await addItineraryItem(fd)
      if (result.success) {
        onClose()
        router.refresh()
      } else {
        setError(result.error || 'Failed to save')
      }
    })
  }

  const typeInfo = ITINERARY_TYPES.find(t => t.value === form.type)

  return (
    <form onSubmit={handleSubmit} className="p-4 rounded-xl border border-[rgba(30,45,69,0.8)] bg-[rgba(11,17,32,0.8)] backdrop-blur-sm space-y-3">
      <div className="flex items-center justify-between mb-1">
        <h3 className="text-sm font-semibold text-white">{existing ? 'Edit Item' : 'Add Item'}</h3>
        <button type="button" onClick={onClose} className="p-1 rounded-lg text-[#4d6080] hover:text-white hover:bg-white/10 transition-colors">
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Type selector */}
      <div className="flex gap-2 flex-wrap">
        {ITINERARY_TYPES.map(t => {
          const Icon = TYPE_ICONS[t.value] || Star
          const isActive = form.type === t.value
          return (
            <button
              key={t.value}
              type="button"
              onClick={() => setForm(f => ({ ...f, type: t.value as ItineraryItem['type'] }))}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all border ${isActive ? 'border-current' : 'border-transparent hover:bg-white/5'}`}
              style={isActive ? { background: `${t.color}15`, color: t.color, borderColor: `${t.color}30` } : { color: '#4d6080' }}
            >
              <Icon className="w-3 h-3" />
              {t.label}
            </button>
          )
        })}
      </div>

      <div>
        <input
          value={form.title}
          onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
          placeholder="Title *"
          required
          className="form-input w-full text-sm"
        />
      </div>
      <div className="grid grid-cols-2 gap-2">
        <input
          type="time"
          value={form.start_time}
          onChange={e => setForm(f => ({ ...f, start_time: e.target.value }))}
          className="form-input text-sm"
          placeholder="Start time"
        />
        <input
          type="time"
          value={form.end_time}
          onChange={e => setForm(f => ({ ...f, end_time: e.target.value }))}
          className="form-input text-sm"
          placeholder="End time"
        />
      </div>
      <input
        value={form.location}
        onChange={e => setForm(f => ({ ...f, location: e.target.value }))}
        placeholder="Location"
        className="form-input w-full text-sm"
      />
      <div className="grid grid-cols-2 gap-2">
        <input
          type="number"
          value={form.amount}
          onChange={e => setForm(f => ({ ...f, amount: e.target.value }))}
          placeholder="Amount"
          min="0"
          step="0.01"
          className="form-input text-sm"
        />
        <select value={form.currency} onChange={e => setForm(f => ({ ...f, currency: e.target.value }))} className="form-input text-sm">
          {CURRENCIES.map(c => <option key={c.code} value={c.code}>{c.code}</option>)}
        </select>
      </div>
      <textarea
        value={form.notes}
        onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
        placeholder="Notes..."
        rows={2}
        className="form-input w-full text-sm resize-none"
      />

      {error && <div className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">{error}</div>}

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={isPending}
          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-[#D4A017] text-[#0B1120] font-bold text-xs hover:bg-[#e8b832] transition-all disabled:opacity-60"
        >
          {isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
          {existing ? 'Save' : 'Add'}
        </button>
        <button type="button" onClick={onClose} className="px-4 rounded-xl border border-[rgba(30,45,69,0.8)] text-[#8ea3be] text-xs hover:text-white transition-colors">
          Cancel
        </button>
      </div>
    </form>
  )
}

function ItineraryItemCard({ item, tripId }: { item: ItineraryItem; tripId: string }) {
  const [editing, setEditing] = useState(false)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()
  const Icon = TYPE_ICONS[item.type] || Star
  const typeInfo = ITINERARY_TYPES.find(t => t.value === item.type)
  const color = typeInfo?.color || '#6b7280'

  function handleDelete() {
    startTransition(async () => {
      await deleteItineraryItem(item.id, tripId)
      router.refresh()
    })
  }

  if (editing) {
    return <ItemForm tripId={tripId} dayId={item.day_id} onClose={() => setEditing(false)} existing={item} />
  }

  return (
    <div className="group flex items-start gap-3 p-3 rounded-xl hover:bg-white/3 transition-all border border-transparent hover:border-[rgba(30,45,69,0.4)]">
      <div className="mt-0.5 w-7 h-7 rounded-lg flex items-center justify-center shrink-0" style={{ background: `${color}15`, border: `1px solid ${color}25` }}>
        <Icon className="w-3.5 h-3.5" style={{ color }} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-white">{item.title}</span>
          {item.start_time && (
            <span className="text-xs text-[#4d6080] flex items-center gap-0.5">
              <Clock className="w-2.5 h-2.5" />
              {item.start_time}{item.end_time ? ` — ${item.end_time}` : ''}
            </span>
          )}
        </div>
        {item.location && (
          <div className="flex items-center gap-1 text-xs text-[#4d6080] mt-0.5">
            <MapPin className="w-2.5 h-2.5" />
            {item.location}
          </div>
        )}
        {item.notes && <p className="text-xs text-[#8ea3be] mt-1 line-clamp-1">{item.notes}</p>}
        {item.amount && (
          <span className="text-xs font-semibold text-[#D4A017] mt-1 block">
            {item.currency} {item.amount.toFixed(2)}
          </span>
        )}
      </div>
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
        <button onClick={() => setEditing(true)} className="p-1.5 rounded-lg text-[#4d6080] hover:text-white hover:bg-white/10 transition-colors">
          <Edit2 className="w-3 h-3" />
        </button>
        <button onClick={handleDelete} disabled={isPending} className="p-1.5 rounded-lg text-[#4d6080] hover:text-red-400 hover:bg-red-500/10 transition-colors">
          {isPending ? <Loader2 className="w-3 h-3 animate-spin" /> : <Trash2 className="w-3 h-3" />}
        </button>
      </div>
    </div>
  )
}

function DayCard({ day, trip }: { day: ItineraryDayWithItems; trip: Trip }) {
  const [expanded, setExpanded] = useState(true)
  const [adding, setAdding] = useState(false)

  return (
    <div className="rounded-2xl border border-[rgba(30,45,69,0.8)] bg-[rgba(20,29,46,0.6)] backdrop-blur-sm overflow-hidden">
      {/* Day header */}
      <div
        className="flex items-center justify-between px-5 py-4 cursor-pointer hover:bg-white/3 transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#D4A017]/10 border border-[#D4A017]/20 flex items-center justify-center">
            <span className="text-[#D4A017] font-bold text-sm">{day.day_number}</span>
          </div>
          <div>
            <div className="text-sm font-semibold text-white">Day {day.day_number}</div>
            <div className="text-xs text-[#4d6080]">{formatDate(day.day_date, 'EEEE, MMMM d')}</div>
          </div>
          {day.items.length > 0 && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-white/6 text-[#8ea3be]">
              {day.items.length} item{day.items.length !== 1 ? 's' : ''}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {!adding && (
            <button
              onClick={e => { e.stopPropagation(); setAdding(true); setExpanded(true) }}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs text-[#D4A017] hover:bg-[#D4A017]/10 transition-colors border border-transparent hover:border-[#D4A017]/20"
            >
              <Plus className="w-3.5 h-3.5" />
              Add
            </button>
          )}
          {expanded ? <ChevronUp className="w-4 h-4 text-[#4d6080]" /> : <ChevronDown className="w-4 h-4 text-[#4d6080]" />}
        </div>
      </div>

      {/* Day content */}
      {expanded && (
        <div className="px-5 pb-4 space-y-1 border-t border-[rgba(30,45,69,0.4)]">
          {day.items.length === 0 && !adding && (
            <p className="text-xs text-[#4d6080] py-4 text-center">
              No items yet.{' '}
              <button onClick={() => setAdding(true)} className="text-[#D4A017] hover:text-[#e8b832] transition-colors">
                Add an activity
              </button>
            </p>
          )}
          {day.items.map(item => (
            <ItineraryItemCard key={item.id} item={item} tripId={trip.id} />
          ))}
          {adding && (
            <div className="mt-2">
              <ItemForm tripId={trip.id} dayId={day.id} onClose={() => setAdding(false)} />
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default function ItineraryClient({ trip, days }: Props) {
  return (
    <div className="space-y-4">
      {days.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-4xl mb-4">🗓️</div>
          <h3 className="text-lg font-display font-semibold text-white mb-2">No itinerary days yet</h3>
          <p className="text-[#8ea3be] text-sm">Set a start and end date for your trip to auto-generate days.</p>
        </div>
      ) : (
        days.map(day => (
          <DayCard key={day.id} day={day} trip={trip} />
        ))
      )}
    </div>
  )
}
