'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Edit2, Archive, Trash2, X, Loader2, MapPin, Calendar, Users, DollarSign, FileText, Globe } from 'lucide-react'
import { updateTrip, deleteTrip, archiveTrip } from '@/app/actions/trips'
import { CURRENCIES } from '@/lib/constants'
import type { Trip } from '@/types/database'

interface Props {
  trip: Trip
}

export default function TripOverviewClient({ trip }: Props) {
  const [showEdit, setShowEdit] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const router = useRouter()

  function handleUpdate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    const formData = new FormData(e.currentTarget)
    startTransition(async () => {
      const result = await updateTrip(trip.id, formData)
      if (result.success) {
        setShowEdit(false)
        router.refresh()
      } else {
        setError(result.error || 'Failed to update')
      }
    })
  }

  function handleDelete() {
    if (!confirmDelete) { setConfirmDelete(true); return }
    startTransition(async () => {
      await deleteTrip(trip.id)
      router.push('/trips')
    })
  }

  function handleArchive() {
    startTransition(async () => {
      await archiveTrip(trip.id)
      router.refresh()
    })
  }

  return (
    <>
      <div className="flex items-center gap-2">
        <button
          onClick={() => setShowEdit(true)}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/10 text-white text-sm font-medium hover:bg-white/20 transition-all border border-white/10"
        >
          <Edit2 className="w-3.5 h-3.5" />
          Edit
        </button>
        {trip.status !== 'archived' && (
          <button
            onClick={handleArchive}
            disabled={isPending}
            className="p-2 rounded-xl bg-white/10 text-white/70 hover:text-white hover:bg-white/20 transition-all border border-white/10"
            title="Archive trip"
          >
            <Archive className="w-4 h-4" />
          </button>
        )}
        <button
          onClick={handleDelete}
          disabled={isPending}
          className={`p-2 rounded-xl transition-all border ${confirmDelete ? 'bg-red-500/20 text-red-400 border-red-500/30' : 'bg-white/10 text-white/70 hover:text-red-400 hover:bg-red-500/10 border-white/10'}`}
          title={confirmDelete ? 'Click again to confirm delete' : 'Delete trip'}
        >
          {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
        </button>
      </div>

      {/* Edit modal */}
      {showEdit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setShowEdit(false)} />
          <div className="relative w-full max-w-lg rounded-2xl border border-[rgba(30,45,69,0.8)] bg-[#111827] shadow-[0_20px_60px_rgba(0,0,0,0.6)] p-6 animate-scale-in">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-display font-bold text-white">Edit Trip</h2>
              <button onClick={() => setShowEdit(false)} className="p-1.5 rounded-lg text-[#4d6080] hover:text-white hover:bg-white/10 transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#8ea3be] mb-1.5">Trip Name</label>
                <input name="name" defaultValue={trip.name} required className="form-input w-full" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#8ea3be] mb-1.5">
                  <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> Destination</span>
                </label>
                <input name="destination" defaultValue={trip.destination} required className="form-input w-full" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#8ea3be] mb-1.5">Start Date</label>
                  <input name="start_date" type="date" defaultValue={trip.start_date} required className="form-input w-full" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#8ea3be] mb-1.5">End Date</label>
                  <input name="end_date" type="date" defaultValue={trip.end_date} required className="form-input w-full" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#8ea3be] mb-1.5">
                    <span className="flex items-center gap-1"><Users className="w-3 h-3" /> Travelers</span>
                  </label>
                  <input name="travelers" type="number" min="1" defaultValue={trip.travelers} className="form-input w-full" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#8ea3be] mb-1.5">Status</label>
                  <select name="status" defaultValue={trip.status} className="form-input w-full">
                    {['planning','active','completed','archived'].map(s => (
                      <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#8ea3be] mb-1.5">
                    <span className="flex items-center gap-1"><DollarSign className="w-3 h-3" /> Budget</span>
                  </label>
                  <input name="total_budget" type="number" min="0" defaultValue={trip.total_budget || ''} className="form-input w-full" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#8ea3be] mb-1.5">Currency</label>
                  <select name="currency" defaultValue={trip.currency} className="form-input w-full">
                    {CURRENCIES.map(c => <option key={c.code} value={c.code}>{c.code}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#8ea3be] mb-1.5">Notes</label>
                <textarea name="notes" defaultValue={trip.notes || ''} rows={2} className="form-input w-full resize-none" />
              </div>

              {error && (
                <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs">{error}</div>
              )}

              <div className="flex gap-2 pt-1">
                <button type="submit" disabled={isPending} className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#D4A017] text-[#0B1120] font-bold text-sm hover:bg-[#e8b832] transition-all disabled:opacity-60">
                  {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                  Save Changes
                </button>
                <button type="button" onClick={() => setShowEdit(false)} className="px-4 py-2.5 rounded-xl border border-[rgba(30,45,69,0.8)] text-[#8ea3be] text-sm hover:text-white transition-colors">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
