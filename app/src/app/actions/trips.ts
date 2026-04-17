'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import type {
  Trip,
  ActionResult,
  CreateTripFormData,
} from '@/types/app'
import {
  DEFAULT_BUDGET_CATEGORIES,
  DEFAULT_PACKING_ITEMS,
  DEFAULT_DOCUMENT_ITEMS,
  DEFAULT_REMINDER_ITEMS,
} from '@/lib/constants'
import { generateDaysBetween } from '@/lib/utils'
import { format } from 'date-fns'

const TripSchema = z.object({
  name: z.string().min(1, 'Trip name is required').max(100),
  destination: z.string().min(1, 'Destination is required').max(200),
  start_date: z.string().min(1, 'Start date is required'),
  end_date: z.string().min(1, 'End date is required'),
  travelers: z.coerce.number().int().min(1).max(100).default(1),
  status: z.enum(['planning', 'active', 'completed', 'archived']).default('planning'),
  notes: z.string().optional(),
  total_budget: z.coerce.number().min(0).optional(),
  currency: z.string().default('USD'),
}).refine(data => data.end_date >= data.start_date, {
  message: 'End date must be after start date',
  path: ['end_date'],
})

async function getAuthUser() {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error || !user) redirect('/login')
  return { supabase, user }
}

async function initializeTripData(supabase: Awaited<ReturnType<typeof createClient>>, tripId: string, startDate: string, endDate: string) {
  // Create itinerary days
  const days = generateDaysBetween(startDate, endDate)
  const dayInserts = days.map((date, index) => ({
    trip_id: tripId,
    day_date: format(date, 'yyyy-MM-dd'),
    day_number: index + 1,
  }))

  if (dayInserts.length > 0) {
    await supabase.from('itinerary_days').insert(dayInserts)
  }

  // Create default budget categories
  const categoryInserts = DEFAULT_BUDGET_CATEGORIES.map((cat, idx) => ({
    trip_id: tripId,
    name: cat.name,
    color: cat.color,
    planned_amount: 0,
    sort_order: idx,
  }))
  await supabase.from('budget_categories').insert(categoryInserts)

  // Create default checklists
  const checklistTypes = [
    { name: 'Packing List', type: 'packing' as const, items: DEFAULT_PACKING_ITEMS, sort: 0 },
    { name: 'Documents', type: 'documents' as const, items: DEFAULT_DOCUMENT_ITEMS, sort: 1 },
    { name: 'Reminders', type: 'reminders' as const, items: DEFAULT_REMINDER_ITEMS, sort: 2 },
  ]

  for (const cl of checklistTypes) {
    const { data: checklist } = await supabase
      .from('checklists')
      .insert({ trip_id: tripId, name: cl.name, type: cl.type, sort_order: cl.sort })
      .select('id')
      .single()

    if (checklist) {
      const itemInserts = cl.items.map((item, idx) => ({
        checklist_id: checklist.id,
        trip_id: tripId,
        text: item.text,
        category: item.category,
        sort_order: idx,
      }))
      await supabase.from('checklist_items').insert(itemInserts)
    }
  }
}

export async function createTrip(formData: FormData): Promise<ActionResult<Trip>> {
  const { supabase, user } = await getAuthUser()

  const raw = {
    name: formData.get('name'),
    destination: formData.get('destination'),
    start_date: formData.get('start_date'),
    end_date: formData.get('end_date'),
    travelers: formData.get('travelers'),
    status: formData.get('status'),
    notes: formData.get('notes'),
    total_budget: formData.get('total_budget'),
    currency: formData.get('currency'),
  }

  const parsed = TripSchema.safeParse(raw)
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message }
  }

  const { data: trip, error } = await supabase
    .from('trips')
    .insert({ ...parsed.data, user_id: user.id } as any)
    .select()
    .single()

  if (error || !trip) {
    return { success: false, error: error?.message || 'Failed to create trip' }
  }

  // Initialize default data in background
  await initializeTripData(supabase, trip.id, trip.start_date, trip.end_date)

  revalidatePath('/dashboard')
  revalidatePath('/trips')
  return { success: true, data: trip }
}

export async function updateTrip(tripId: string, formData: FormData): Promise<ActionResult<Trip>> {
  const { supabase, user } = await getAuthUser()

  const raw = {
    name: formData.get('name'),
    destination: formData.get('destination'),
    start_date: formData.get('start_date'),
    end_date: formData.get('end_date'),
    travelers: formData.get('travelers'),
    status: formData.get('status'),
    notes: formData.get('notes'),
    total_budget: formData.get('total_budget'),
    currency: formData.get('currency'),
  }

  const parsed = TripSchema.safeParse(raw)
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message }
  }

  const { data: trip, error } = await supabase
    .from('trips')
    .update(parsed.data)
    .eq('id', tripId)
    .eq('user_id', user.id)
    .select()
    .single()

  if (error || !trip) {
    return { success: false, error: error?.message || 'Failed to update trip' }
  }

  revalidatePath('/trips')
  revalidatePath(`/trips/${tripId}`)
  revalidatePath('/dashboard')
  return { success: true, data: trip }
}

export async function deleteTrip(tripId: string): Promise<ActionResult<void>> {
  const { supabase, user } = await getAuthUser()

  const { error } = await supabase
    .from('trips')
    .delete()
    .eq('id', tripId)
    .eq('user_id', user.id)

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath('/trips')
  revalidatePath('/dashboard')
  return { success: true }
}

export async function archiveTrip(tripId: string): Promise<ActionResult<Trip>> {
  const { supabase, user } = await getAuthUser()

  const { data: trip, error } = await supabase
    .from('trips')
    .update({ status: 'archived' })
    .eq('id', tripId)
    .eq('user_id', user.id)
    .select()
    .single()

  if (error || !trip) {
    return { success: false, error: error?.message || 'Failed to archive trip' }
  }

  revalidatePath('/trips')
  revalidatePath('/dashboard')
  revalidatePath(`/trips/${tripId}`)
  return { success: true, data: trip }
}

export async function getTrips(status?: string | null): Promise<Trip[]> {
  const { supabase, user } = await getAuthUser()

  let query = supabase
    .from('trips')
    .select('*')
    .eq('user_id', user.id)
    .order('start_date', { ascending: false })

  if (status && status !== 'all') {
    query = query.eq('status', status)
  }

  const { data } = await query
  return data || []
}

export async function getTripById(tripId: string): Promise<Trip | null> {
  const { supabase, user } = await getAuthUser()

  const { data } = await supabase
    .from('trips')
    .select('*')
    .eq('id', tripId)
    .eq('user_id', user.id)
    .single()

  return data
}

export async function getUpcomingTrips(limit = 3): Promise<Trip[]> {
  const { supabase, user } = await getAuthUser()

  const today = format(new Date(), 'yyyy-MM-dd')

  const { data } = await supabase
    .from('trips')
    .select('*')
    .eq('user_id', user.id)
    .neq('status', 'archived')
    .gte('start_date', today)
    .order('start_date', { ascending: true })
    .limit(limit)

  return data || []
}

export async function getTripStats() {
  const { supabase, user } = await getAuthUser()

  const { data: trips } = await supabase
    .from('trips')
    .select('status, start_date, end_date, destination')
    .eq('user_id', user.id)

  if (!trips) return { totalTrips: 0, upcomingTrips: 0, totalDays: 0, destinations: 0 }

  const today = new Date().toISOString().split('T')[0]
  const upcomingTrips = trips.filter(t => t.start_date >= today && t.status !== 'archived').length
  const completedTrips = trips.filter(t => t.status === 'completed')
  const totalDays = completedTrips.reduce((acc, t) => {
    const days = generateDaysBetween(t.start_date, t.end_date).length
    return acc + days
  }, 0)
  const uniqueDestinations = new Set(trips.map(t => t.destination.split(',')[0].trim())).size

  return {
    totalTrips: trips.length,
    upcomingTrips,
    totalDays,
    destinations: uniqueDestinations,
  }
}


