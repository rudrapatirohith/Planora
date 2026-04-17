import { notFound } from 'next/navigation'
import { getTripById } from '@/app/actions/trips'
import { getExpenses, getBudgetCategories } from '@/app/actions/budget'
import BudgetClient from '@/components/trips/BudgetClient'
import type { Metadata } from 'next'

export async function generateMetadata({ params }: { params: Promise<{ tripId: string }> }): Promise<Metadata> {
  const { tripId } = await params
  const trip = await getTripById(tripId)
  return { title: trip ? `Budget — ${trip.name} | Planora` : 'Budget | Planora' }
}

export default async function BudgetPage({ params }: { params: Promise<{ tripId: string }> }) {
  const { tripId } = await params
  const [trip, expenses, categories] = await Promise.all([
    getTripById(tripId),
    getExpenses(tripId),
    getBudgetCategories(tripId),
  ])

  if (!trip) notFound()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold text-white mb-1">Budget</h1>
        <p className="text-[#8ea3be] text-sm">{trip.name} · {expenses.length} expense{expenses.length !== 1 ? 's' : ''}</p>
      </div>
      <BudgetClient trip={trip} expenses={expenses} categories={categories} />
    </div>
  )
}
