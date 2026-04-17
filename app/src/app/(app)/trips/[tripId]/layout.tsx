import { notFound } from 'next/navigation'
import { getTripById } from '@/app/actions/trips'
import type { ReactNode } from 'react'

export default async function TripLayout({
  children,
  params,
}: {
  children: ReactNode
  params: Promise<{ tripId: string }>
}) {
  const { tripId } = await params
  const trip = await getTripById(tripId)

  if (!trip) notFound()

  // The (app) layout already provides the shell (sidebar, topnav).
  // Here we just need to inject tripId/tripName context into the Sidebar.
  // Since Sidebar is currently stateless (rendered in parent layout), 
  // we use a data attribute trick or wrap in a context.
  // For now we render children directly - nav context handled by Sidebar's usePathname.
  return <>{children}</>
}
