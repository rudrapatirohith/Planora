'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { MapPin, Calendar, Users, DollarSign, FileText, Globe, Plane, ArrowLeft, Loader2 } from 'lucide-react'
import { createTrip } from '@/app/actions/trips'
import { CURRENCIES } from '@/lib/constants'
import type { Metadata } from 'next'

const TRIP_STATUSES = [
  { value: 'planning', label: 'Planning', desc: 'Still in planning phase' },
  { value: 'active', label: 'Active', desc: 'Trip is happening now' },
]

export default function NewTripPage() {
  return <NewTripForm />
}

function NewTripForm() {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    const form = e.currentTarget
    const formData = new FormData(form)

    startTransition(async () => {
      const result = await createTrip(formData)
      if (result.success && result.data) {
        router.push(`/trips/${result.data.id}`)
      } else {
        setError(result.error || 'Failed to create trip')
      }
    })
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Back link */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-[#8ea3be] hover:text-white mb-6 text-sm transition-colors group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        Back to trips
      </button>

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-[#D4A017]/10 border border-[#D4A017]/20 flex items-center justify-center">
            <Plane className="w-5 h-5 text-[#D4A017]" />
          </div>
          <div>
            <h1 className="text-2xl font-display font-bold text-white">Plan a new trip</h1>
            <p className="text-[#8ea3be] text-sm">Fill in the details to get started</p>
          </div>
        </div>
      </div>

      {/* Form card */}
      <div className="rounded-2xl border border-[rgba(30,45,69,0.8)] bg-[rgba(20,29,46,0.6)] backdrop-blur-sm p-8">
        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Trip Name */}
          <div>
            <label className="block text-sm font-semibold text-[#8ea3be] mb-2">
              Trip Name <span className="text-red-400">*</span>
            </label>
            <input
              name="name"
              required
              placeholder="e.g. Summer in Japan"
              className="form-input w-full"
              maxLength={100}
            />
          </div>

          {/* Destination */}
          <div>
            <label className="block text-sm font-semibold text-[#8ea3be] mb-2">
              <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> Destination <span className="text-red-400">*</span></span>
            </label>
            <input
              name="destination"
              required
              placeholder="e.g. Tokyo, Japan"
              className="form-input w-full"
              maxLength={200}
            />
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-[#8ea3be] mb-2">
                <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> Start Date <span className="text-red-400">*</span></span>
              </label>
              <input
                name="start_date"
                type="date"
                required
                className="form-input w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#8ea3be] mb-2">
                <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> End Date <span className="text-red-400">*</span></span>
              </label>
              <input
                name="end_date"
                type="date"
                required
                className="form-input w-full"
              />
            </div>
          </div>

          {/* Travelers + Status */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-[#8ea3be] mb-2">
                <span className="flex items-center gap-1.5"><Users className="w-3.5 h-3.5" /> Travelers</span>
              </label>
              <input
                name="travelers"
                type="number"
                min="1"
                max="100"
                defaultValue="1"
                className="form-input w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#8ea3be] mb-2">Status</label>
              <select name="status" defaultValue="planning" className="form-input w-full">
                {TRIP_STATUSES.map(s => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Budget + Currency */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-[#8ea3be] mb-2">
                <span className="flex items-center gap-1.5"><DollarSign className="w-3.5 h-3.5" /> Total Budget</span>
              </label>
              <input
                name="total_budget"
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
                className="form-input w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#8ea3be] mb-2">
                <span className="flex items-center gap-1.5"><Globe className="w-3.5 h-3.5" /> Currency</span>
              </label>
              <select name="currency" defaultValue="USD" className="form-input w-full">
                {CURRENCIES.map(c => (
                  <option key={c.code} value={c.code}>{c.code} — {c.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-semibold text-[#8ea3be] mb-2">
              <span className="flex items-center gap-1.5"><FileText className="w-3.5 h-3.5" /> Notes</span>
            </label>
            <textarea
              name="notes"
              placeholder="Any notes or special considerations..."
              rows={3}
              className="form-input w-full resize-none"
            />
          </div>

          {/* Error message */}
          {error && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              {error}
            </div>
          )}

          {/* Submit */}
          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              disabled={isPending}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-[#D4A017] text-[#0B1120] font-bold text-sm hover:bg-[#e8b832] transition-all disabled:opacity-60 disabled:cursor-not-allowed hover:-translate-y-px hover:shadow-[0_0_20px_rgba(212,160,23,0.3)]"
            >
              {isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Creating trip...
                </>
              ) : (
                <>
                  <Plane className="w-4 h-4" />
                  Create Trip
                </>
              )}
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-3 rounded-xl border border-[rgba(30,45,69,0.8)] text-[#8ea3be] font-semibold text-sm hover:text-white hover:bg-white/5 transition-all"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
