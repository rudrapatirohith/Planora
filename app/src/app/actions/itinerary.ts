'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import type { ActionResult, ItineraryDayWithItems } from '@/types/app'
import type { ItineraryItem } from '@/types/database'

const ItemSchema = z.object({
  day_id: z.string().uuid(),
  trip_id: z.string().uuid(),
  type: z.enum(['activity', 'flight', 'hotel', 'transport', 'food', 'sightseeing', 'other']),
  title: z.string().min(1, 'Title is required').max(200),
  description: z.string().optional(),
  start_time: z.string().optional(),
  end_time: z.string().optional(),
  location: z.string().optional(),
  booking_reference: z.string().optional(),
  amount: z.coerce.number().min(0).optional(),
  currency: z.string().default('USD'),
  notes: z.string().optional(),
})

async function getAuthUser() {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error || !user) redirect('/login')
  return { supabase, user }
}

async function verifyTripOwnership(supabase: Awaited<ReturnType<typeof createClient>>, tripId: string, userId: string) {
  const { data } = await supabase.from('trips').select('id').eq('id', tripId).eq('user_id', userId).single()
  return !!data
}

export async function getItineraryDays(tripId: string): Promise<ItineraryDayWithItems[]> {
  const { supabase, user } = await getAuthUser()

  const owned = await verifyTripOwnership(supabase, tripId, user.id)
  if (!owned) return []

  const { data: days } = await supabase
    .from('itinerary_days')
    .select(`
      *,
      items:itinerary_items(*)
    `)
    .eq('trip_id', tripId)
    .order('day_number', { ascending: true })

  if (!days) return []

  return days.map(day => ({
    ...day,
    items: (day.items || []).sort((a: ItineraryItem, b: ItineraryItem) => {
      if (a.start_time && b.start_time) return a.start_time.localeCompare(b.start_time)
      return a.sort_order - b.sort_order
    }),
  }))
}

export async function addItineraryItem(formData: FormData): Promise<ActionResult<ItineraryItem>> {
  const { supabase, user } = await getAuthUser()

  const raw = {
    day_id: formData.get('day_id'),
    trip_id: formData.get('trip_id'),
    type: formData.get('type'),
    title: formData.get('title'),
    description: formData.get('description') || undefined,
    start_time: formData.get('start_time') || undefined,
    end_time: formData.get('end_time') || undefined,
    location: formData.get('location') || undefined,
    booking_reference: formData.get('booking_reference') || undefined,
    amount: formData.get('amount') || undefined,
    currency: formData.get('currency') || 'USD',
    notes: formData.get('notes') || undefined,
  }

  const parsed = ItemSchema.safeParse(raw)
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message }
  }

  const owned = await verifyTripOwnership(supabase, parsed.data.trip_id, user.id)
  if (!owned) return { success: false, error: 'Unauthorized' }

  // Get current max sort_order for this day
  const { data: existing } = await supabase
    .from('itinerary_items')
    .select('sort_order')
    .eq('day_id', parsed.data.day_id)
    .order('sort_order', { ascending: false })
    .limit(1)

  const sort_order = existing && existing.length > 0 ? existing[0].sort_order + 1 : 0

  const { data: item, error } = await supabase
    .from('itinerary_items')
    .insert({ ...parsed.data, sort_order } as any)
    .select()
    .single()

  if (error || !item) {
    return { success: false, error: error?.message || 'Failed to add item' }
  }

  revalidatePath(`/trips/${parsed.data.trip_id}/itinerary`)
  return { success: true, data: item }
}

export async function updateItineraryItem(itemId: string, formData: FormData): Promise<ActionResult<ItineraryItem>> {
  const { supabase, user } = await getAuthUser()

  const tripId = formData.get('trip_id') as string
  const owned = await verifyTripOwnership(supabase, tripId, user.id)
  if (!owned) return { success: false, error: 'Unauthorized' }

  const update = {
    type: formData.get('type'),
    title: formData.get('title'),
    description: formData.get('description') || null,
    start_time: formData.get('start_time') || null,
    end_time: formData.get('end_time') || null,
    location: formData.get('location') || null,
    booking_reference: formData.get('booking_reference') || null,
    amount: formData.get('amount') ? parseFloat(formData.get('amount') as string) : null,
    currency: formData.get('currency') || 'USD',
    notes: formData.get('notes') || null,
  }

  const { data: item, error } = await supabase
    .from('itinerary_items')
    .update(update as any)
    .eq('id', itemId)
    .select()
    .single()

  if (error || !item) {
    return { success: false, error: error?.message || 'Failed to update item' }
  }

  revalidatePath(`/trips/${tripId}/itinerary`)
  return { success: true, data: item }
}

export async function deleteItineraryItem(itemId: string, tripId: string): Promise<ActionResult<void>> {
  const { supabase, user } = await getAuthUser()

  const owned = await verifyTripOwnership(supabase, tripId, user.id)
  if (!owned) return { success: false, error: 'Unauthorized' }

  const { error } = await supabase
    .from('itinerary_items')
    .delete()
    .eq('id', itemId)

  if (error) return { success: false, error: error.message }

  revalidatePath(`/trips/${tripId}/itinerary`)
  return { success: true }
}

export async function reorderItineraryItems(
  dayId: string,
  tripId: string,
  orderedIds: string[]
): Promise<ActionResult<void>> {
  const { supabase, user } = await getAuthUser()

  const owned = await verifyTripOwnership(supabase, tripId, user.id)
  if (!owned) return { success: false, error: 'Unauthorized' }

  await Promise.all(
    orderedIds.map((id, index) =>
      supabase.from('itinerary_items').update({ sort_order: index }).eq('id', id).eq('day_id', dayId)
    )
  )

  revalidatePath(`/trips/${tripId}/itinerary`)
  return { success: true }
}


