import { Suspense } from 'react'
import Link from 'next/link'
import { Plus } from 'lucide-react'
import { getTrips } from '@/app/actions/trips'
import TripsClient from '@/components/trips/TripsClient'
import { SkeletonCard } from '@/components/ui/skeleton'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'My Trips | Planora',
}

async function TripsContent({ status }: { status?: string }) {
  const trips = await getTrips(status)
  return <TripsClient trips={trips} currentStatus={status} />
}

export default async function TripsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>
}) {
  const { status } = await searchParams

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold text-white mb-1">My Trips</h1>
          <p className="text-[#8ea3be] font-body text-sm">Manage and organize all your travel adventures</p>
        </div>
        <Link
          href="/trips/new"
          data-cy="new-trip-button"
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#D4A017] text-[#0B1120] font-semibold text-sm hover:bg-[#e8b832] transition-all hover:-translate-y-px"
        >
          <Plus className="w-4 h-4" />
          New Trip
        </Link>
      </div>

      <Suspense fallback={
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1,2,3,4,5,6].map(i => <SkeletonCard key={i} />)}
        </div>
      }>
        <TripsContent status={status} />
      </Suspense>
    </div>
  )
}
