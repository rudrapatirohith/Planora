import { notFound } from 'next/navigation'
import { getTripById } from '@/app/actions/trips'
import { getItineraryDays } from '@/app/actions/itinerary'
import ItineraryClient from '@/components/trips/ItineraryClient'
import type { Metadata } from 'next'

export async function generateMetadata({ params }: { params: Promise<{ tripId: string }> }): Promise<Metadata> {
  const { tripId } = await params
  const trip = await getTripById(tripId)
  return { title: trip ? `Itinerary — ${trip.name} | Planora` : 'Itinerary | Planora' }
}

export default async function ItineraryPage({ params }: { params: Promise<{ tripId: string }> }) {
  const { tripId } = await params
  const [trip, days] = await Promise.all([
    getTripById(tripId),
    getItineraryDays(tripId),
  ])

  if (!trip) notFound()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold text-white mb-1">Itinerary</h1>
        <p className="text-[#8ea3be] text-sm">{trip.name} · {days.length} days</p>
      </div>
      <ItineraryClient trip={trip} days={days} />
    </div>
  )
}
