import { notFound } from 'next/navigation'
import { getTripById } from '@/app/actions/trips'
import { getChecklists } from '@/app/actions/checklist'
import ChecklistClient from '@/components/trips/ChecklistClient'
import type { Metadata } from 'next'

export async function generateMetadata({ params }: { params: Promise<{ tripId: string }> }): Promise<Metadata> {
  const { tripId } = await params
  const trip = await getTripById(tripId)
  return { title: trip ? `Checklist — ${trip.name} | Planora` : 'Checklist | Planora' }
}

export default async function ChecklistPage({ params }: { params: Promise<{ tripId: string }> }) {
  const { tripId } = await params
  const [trip, checklists] = await Promise.all([
    getTripById(tripId),
    getChecklists(tripId),
  ])

  if (!trip) notFound()

  const totalItems = checklists.reduce((s, c) => s + c.totalCount, 0)
  const completedItems = checklists.reduce((s, c) => s + c.completedCount, 0)

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-white mb-1">Checklist</h1>
          <p className="text-[#8ea3be] text-sm">
            {trip.name} · {completedItems}/{totalItems} items complete
          </p>
        </div>
        {totalItems > 0 && (
          <div className="text-right">
            <div className="text-2xl font-display font-bold text-[#D4A017]">
              {Math.round((completedItems / totalItems) * 100)}%
            </div>
            <div className="text-xs text-[#4d6080]">complete</div>
          </div>
        )}
      </div>
      <ChecklistClient trip={trip} checklists={checklists} />
    </div>
  )
}
