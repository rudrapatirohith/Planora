import { notFound } from 'next/navigation'
import { getTripById } from '@/app/actions/trips'
import { getBookings } from '@/app/actions/bookings'
import BookingsClient from '@/components/trips/BookingsClient'
import type { Metadata } from 'next'

export async function generateMetadata({ params }: { params: Promise<{ tripId: string }> }): Promise<Metadata> {
  const { tripId } = await params
  const trip = await getTripById(tripId)
  return { title: trip ? `Bookings — ${trip.name} | Planora` : 'Bookings | Planora' }
}

export default async function BookingsPage({ params }: { params: Promise<{ tripId: string }> }) {
  const { tripId } = await params
  const [trip, bookings] = await Promise.all([
    getTripById(tripId),
    getBookings(tripId),
  ])

  if (!trip) notFound()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold text-white mb-1">Bookings</h1>
        <p className="text-[#8ea3be] text-sm">{trip.name} · {bookings.length} booking{bookings.length !== 1 ? 's' : ''}</p>
      </div>
      <BookingsClient trip={trip} bookings={bookings} />
    </div>
  )
}
