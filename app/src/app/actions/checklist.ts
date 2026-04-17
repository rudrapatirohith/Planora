'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import type { ActionResult, ChecklistWithItems } from '@/types/app'
import type { Checklist, ChecklistItem } from '@/types/database'

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

export async function getChecklists(tripId: string): Promise<ChecklistWithItems[]> {
  const { supabase, user } = await getAuthUser()

  const owned = await verifyTripOwnership(supabase, tripId, user.id)
  if (!owned) return []

  const { data } = await supabase
    .from('checklists')
    .select(`
      *,
      items:checklist_items(*)
    `)
    .eq('trip_id', tripId)
    .order('sort_order')

  if (!data) return []

  return data.map(cl => {
    const items = (cl.items || []).sort((a: ChecklistItem, b: ChecklistItem) => a.sort_order - b.sort_order)
    const completedCount = items.filter((i: ChecklistItem) => i.is_checked).length
    return {
      ...cl,
      items,
      completedCount,
      totalCount: items.length,
      percentage: items.length > 0 ? Math.round((completedCount / items.length) * 100) : 0,
    }
  })
}

export async function toggleChecklistItem(
  itemId: string,
  tripId: string,
  isChecked: boolean
): Promise<ActionResult<void>> {
  const { supabase, user } = await getAuthUser()

  const owned = await verifyTripOwnership(supabase, tripId, user.id)
  if (!owned) return { success: false, error: 'Unauthorized' }

  const { error } = await supabase
    .from('checklist_items')
    .update({ is_checked: isChecked })
    .eq('id', itemId)

  if (error) return { success: false, error: error.message }

  revalidatePath(`/trips/${tripId}/checklist`)
  return { success: true }
}

export async function addChecklistItem(
  checklistId: string,
  tripId: string,
  text: string,
  category?: string
): Promise<ActionResult<ChecklistItem>> {
  const { supabase, user } = await getAuthUser()

  const owned = await verifyTripOwnership(supabase, tripId, user.id)
  if (!owned) return { success: false, error: 'Unauthorized' }

  // Get current max sort_order
  const { data: existing } = await supabase
    .from('checklist_items')
    .select('sort_order')
    .eq('checklist_id', checklistId)
    .order('sort_order', { ascending: false })
    .limit(1)

  const sort_order = existing && existing.length > 0 ? existing[0].sort_order + 1 : 0

  const { data: item, error } = await supabase
    .from('checklist_items')
    .insert({ checklist_id: checklistId, trip_id: tripId, text, category: category || null, sort_order })
    .select()
    .single()

  if (error || !item) return { success: false, error: error?.message || 'Failed to add item' }

  revalidatePath(`/trips/${tripId}/checklist`)
  return { success: true, data: item }
}

export async function deleteChecklistItem(
  itemId: string,
  tripId: string
): Promise<ActionResult<void>> {
  const { supabase, user } = await getAuthUser()

  const owned = await verifyTripOwnership(supabase, tripId, user.id)
  if (!owned) return { success: false, error: 'Unauthorized' }

  const { error } = await supabase.from('checklist_items').delete().eq('id', itemId)
  if (error) return { success: false, error: error.message }

  revalidatePath(`/trips/${tripId}/checklist`)
  return { success: true }
}

export async function createChecklist(
  tripId: string,
  name: string,
  type: Checklist['type'] = 'custom'
): Promise<ActionResult<Checklist>> {
  const { supabase, user } = await getAuthUser()

  const owned = await verifyTripOwnership(supabase, tripId, user.id)
  if (!owned) return { success: false, error: 'Unauthorized' }

  const { data: existing } = await supabase
    .from('checklists')
    .select('sort_order')
    .eq('trip_id', tripId)
    .order('sort_order', { ascending: false })
    .limit(1)

  const sort_order = existing && existing.length > 0 ? existing[0].sort_order + 1 : 0

  const { data: checklist, error } = await supabase
    .from('checklists')
    .insert({ trip_id: tripId, name, type, sort_order })
    .select()
    .single()

  if (error || !checklist) return { success: false, error: error?.message || 'Failed to create checklist' }

  revalidatePath(`/trips/${tripId}/checklist`)
  return { success: true, data: checklist }
}


