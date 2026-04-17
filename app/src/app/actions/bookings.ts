'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import type { ActionResult } from '@/types/app'
import type { Booking, Database } from '@/types/database'

type BookingInsert = Database['public']['Tables']['bookings']['Insert']
type BookingUpdate = Database['public']['Tables']['bookings']['Update']

const BookingSchema = z.object({
  trip_id: z.string().uuid(),
  type: z.enum(['flight', 'hotel', 'train', 'bus', 'car_rental', 'tour', 'other']),
  title: z.string().min(1, 'Title is required').max(200),
  provider: z.string().nullable().optional(),
  confirmation_number: z.string().nullable().optional(),
  start_date: z.string().nullable().optional(),
  end_date: z.string().nullable().optional(),
  amount: z.coerce.number().min(0).nullable().optional(),
  currency: z.string().default('USD'),
  status: z.enum(['pending', 'confirmed', 'cancelled', 'completed']).default('confirmed'),
  notes: z.string().nullable().optional(),
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

export async function getBookings(tripId: string, type?: string | null): Promise<Booking[]> {
  const { supabase, user } = await getAuthUser()

  const owned = await verifyTripOwnership(supabase, tripId, user.id)
  if (!owned) return []

  let query = supabase
    .from('bookings')
    .select('*')
    .eq('trip_id', tripId)
    .order('start_date', { ascending: true })

  if (type && type !== 'all') {
    query = query.eq('type', type)
  }

  const { data } = await query
  return data || []
}

export async function createBooking(formData: FormData): Promise<ActionResult<Booking>> {
  const { supabase, user } = await getAuthUser()

  const raw = {
    trip_id: formData.get('trip_id'),
    type: formData.get('type'),
    title: formData.get('title'),
    provider: formData.get('provider') || null,
    confirmation_number: formData.get('confirmation_number') || null,
    start_date: formData.get('start_date') || null,
    end_date: formData.get('end_date') || null,
    amount: formData.get('amount') || null,
    currency: formData.get('currency') || 'USD',
    status: formData.get('status') || 'confirmed',
    notes: formData.get('notes') || null,
  }

  const parsed = BookingSchema.safeParse(raw)
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message }
  }

  const owned = await verifyTripOwnership(supabase, parsed.data.trip_id, user.id)
  if (!owned) return { success: false, error: 'Unauthorized' }

  const insert: BookingInsert = {
    trip_id: parsed.data.trip_id,
    type: parsed.data.type,
    title: parsed.data.title,
    provider: parsed.data.provider ?? null,
    confirmation_number: parsed.data.confirmation_number ?? null,
    start_date: parsed.data.start_date ?? null,
    end_date: parsed.data.end_date ?? null,
    amount: parsed.data.amount ?? null,
    currency: parsed.data.currency,
    status: parsed.data.status,
    notes: parsed.data.notes ?? null,
  }

  const { data: booking, error } = await supabase
    .from('bookings')
    .insert(insert)
    .select()
    .single()

  if (error || !booking) {
    return { success: false, error: error?.message || 'Failed to create booking' }
  }

  revalidatePath(`/trips/${parsed.data.trip_id}/bookings`)
  return { success: true, data: booking }
}

export async function updateBooking(bookingId: string, formData: FormData): Promise<ActionResult<Booking>> {
  const { supabase, user } = await getAuthUser()

  const tripId = formData.get('trip_id') as string
  const owned = await verifyTripOwnership(supabase, tripId, user.id)
  if (!owned) return { success: false, error: 'Unauthorized' }

  const update: BookingUpdate = {
    type: formData.get('type') as BookingUpdate['type'],
    title: formData.get('title') as string,
    provider: (formData.get('provider') as string) || null,
    confirmation_number: (formData.get('confirmation_number') as string) || null,
    start_date: (formData.get('start_date') as string) || null,
    end_date: (formData.get('end_date') as string) || null,
    amount: formData.get('amount') ? parseFloat(formData.get('amount') as string) : null,
    currency: (formData.get('currency') as string) || 'USD',
    status: formData.get('status') as BookingUpdate['status'],
    notes: (formData.get('notes') as string) || null,
  }

  const { data: booking, error } = await supabase
    .from('bookings')
    .update(update)
    .eq('id', bookingId)
    .select()
    .single()

  if (error || !booking) {
    return { success: false, error: error?.message || 'Failed to update booking' }
  }

  revalidatePath(`/trips/${tripId}/bookings`)
  return { success: true, data: booking }
}

export async function deleteBooking(bookingId: string, tripId: string): Promise<ActionResult<void>> {
  const { supabase, user } = await getAuthUser()

  const owned = await verifyTripOwnership(supabase, tripId, user.id)
  if (!owned) return { success: false, error: 'Unauthorized' }

  const { error } = await supabase.from('bookings').delete().eq('id', bookingId)
  if (error) return { success: false, error: error.message }

  revalidatePath(`/trips/${tripId}/bookings`)
  return { success: true }
}
