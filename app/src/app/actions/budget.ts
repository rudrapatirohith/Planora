'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import type { ActionResult, ExpenseWithCategory, BudgetCategoryWithStats } from '@/types/app'
import type { Expense, BudgetCategory, ExpenseSplit } from '@/types/database'

const ExpenseSchema = z.object({
  trip_id: z.string().uuid(),
  category_id: z.string().uuid().optional().nullable(),
  title: z.string().min(1, 'Title is required').max(200),
  amount: z.coerce.number().min(0, 'Amount must be positive'),
  currency: z.string().default('USD'),
  date: z.string().min(1, 'Date is required'),
  paid_by: z.string().optional(),
  notes: z.string().optional(),
  is_split: z.coerce.boolean().default(false),
})

const CategorySchema = z.object({
  trip_id: z.string().uuid(),
  name: z.string().min(1, 'Category name is required').max(50),
  planned_amount: z.coerce.number().min(0).default(0),
  color: z.string().default('#6366f1'),
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

export async function getExpenses(tripId: string): Promise<ExpenseWithCategory[]> {
  const { supabase, user } = await getAuthUser()

  const owned = await verifyTripOwnership(supabase, tripId, user.id)
  if (!owned) return []

  const { data } = await supabase
    .from('expenses')
    .select(`
      *,
      category:budget_categories(*),
      splits:expense_splits(*)
    `)
    .eq('trip_id', tripId)
    .order('date', { ascending: false })

  return (data || []) as ExpenseWithCategory[]
}

export async function getBudgetCategories(tripId: string): Promise<BudgetCategoryWithStats[]> {
  const { supabase, user } = await getAuthUser()

  const owned = await verifyTripOwnership(supabase, tripId, user.id)
  if (!owned) return []

  const [{ data: categories }, { data: expenses }] = await Promise.all([
    supabase.from('budget_categories').select('*').eq('trip_id', tripId).order('sort_order'),
    supabase.from('expenses').select('category_id, amount').eq('trip_id', tripId),
  ])

  if (!categories) return []

  const expensesByCategory = (expenses || []).reduce<Record<string, number>>((acc, exp) => {
    if (exp.category_id) {
      acc[exp.category_id] = (acc[exp.category_id] || 0) + (exp.amount || 0)
    }
    return acc
  }, {})

  return categories.map(cat => {
    const actual = expensesByCategory[cat.id] || 0
    const planned = cat.planned_amount || 0
    const percentage = planned > 0 ? Math.round((actual / planned) * 100) : actual > 0 ? 100 : 0
    return {
      ...cat,
      actual_amount: actual,
      variance: planned - actual,
      percentage,
      isOverBudget: actual > planned && planned > 0,
    }
  })
}

export async function createExpense(formData: FormData): Promise<ActionResult<Expense>> {
  const { supabase, user } = await getAuthUser()

  const raw = {
    trip_id: formData.get('trip_id'),
    category_id: formData.get('category_id') || null,
    title: formData.get('title'),
    amount: formData.get('amount'),
    currency: formData.get('currency') || 'USD',
    date: formData.get('date'),
    paid_by: formData.get('paid_by') || undefined,
    notes: formData.get('notes') || undefined,
    is_split: formData.get('is_split') === 'true',
  }

  const parsed = ExpenseSchema.safeParse(raw)
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message }
  }

  const owned = await verifyTripOwnership(supabase, parsed.data.trip_id, user.id)
  if (!owned) return { success: false, error: 'Unauthorized' }

  const { data: expense, error } = await supabase
    .from('expenses')
    .insert({ ...parsed.data, amount_usd: parsed.data.currency === 'USD' ? parsed.data.amount : null } as any)
    .select()
    .single()

  if (error || !expense) {
    return { success: false, error: error?.message || 'Failed to create expense' }
  }

  // Handle splits if provided
  const splitsJson = formData.get('splits') as string
  if (splitsJson && parsed.data.is_split) {
    try {
      const splits = JSON.parse(splitsJson) as Array<{ person_name: string; amount_owed: number }>
      if (splits.length > 0) {
        await supabase.from('expense_splits').insert(
          splits.map(s => ({ expense_id: expense.id, person_name: s.person_name, amount_owed: s.amount_owed }))
        )
      }
    } catch {}
  }

  revalidatePath(`/trips/${parsed.data.trip_id}/budget`)
  return { success: true, data: expense }
}

export async function updateExpense(expenseId: string, formData: FormData): Promise<ActionResult<Expense>> {
  const { supabase, user } = await getAuthUser()

  const tripId = formData.get('trip_id') as string
  const owned = await verifyTripOwnership(supabase, tripId, user.id)
  if (!owned) return { success: false, error: 'Unauthorized' }

  const update = {
    category_id: formData.get('category_id') || null,
    title: formData.get('title'),
    amount: parseFloat(formData.get('amount') as string),
    currency: formData.get('currency') || 'USD',
    date: formData.get('date'),
    paid_by: formData.get('paid_by') || null,
    notes: formData.get('notes') || null,
  }

  const { data: expense, error } = await supabase
    .from('expenses')
    .update(update as any)
    .eq('id', expenseId)
    .select()
    .single()

  if (error || !expense) {
    return { success: false, error: error?.message || 'Failed to update expense' }
  }

  revalidatePath(`/trips/${tripId}/budget`)
  return { success: true, data: expense }
}

export async function deleteExpense(expenseId: string, tripId: string): Promise<ActionResult<void>> {
  const { supabase, user } = await getAuthUser()

  const owned = await verifyTripOwnership(supabase, tripId, user.id)
  if (!owned) return { success: false, error: 'Unauthorized' }

  const { error } = await supabase.from('expenses').delete().eq('id', expenseId)
  if (error) return { success: false, error: error.message }

  revalidatePath(`/trips/${tripId}/budget`)
  return { success: true }
}

export async function createBudgetCategory(formData: FormData): Promise<ActionResult<BudgetCategory>> {
  const { supabase, user } = await getAuthUser()

  const raw = {
    trip_id: formData.get('trip_id'),
    name: formData.get('name'),
    planned_amount: formData.get('planned_amount') || 0,
    color: formData.get('color') || '#6366f1',
  }

  const parsed = CategorySchema.safeParse(raw)
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message }
  }

  const owned = await verifyTripOwnership(supabase, parsed.data.trip_id, user.id)
  if (!owned) return { success: false, error: 'Unauthorized' }

  const { data: cat, error } = await supabase
    .from('budget_categories')
    .insert(parsed.data as any)
    .select()
    .single()

  if (error || !cat) return { success: false, error: error?.message || 'Failed to create category' }

  revalidatePath(`/trips/${parsed.data.trip_id}/budget`)
  return { success: true, data: cat }
}

export async function updateBudgetCategory(
  categoryId: string,
  formData: FormData
): Promise<ActionResult<BudgetCategory>> {
  const { supabase, user } = await getAuthUser()

  const tripId = formData.get('trip_id') as string
  const owned = await verifyTripOwnership(supabase, tripId, user.id)
  if (!owned) return { success: false, error: 'Unauthorized' }

  const { data: cat, error } = await supabase
    .from('budget_categories')
    .update({
      name: formData.get('name'),
      planned_amount: parseFloat(formData.get('planned_amount') as string) || 0,
      color: formData.get('color') || '#6366f1',
    })
    .eq('id', categoryId)
    .select()
    .single()

  if (error || !cat) return { success: false, error: error?.message || 'Failed to update' }

  revalidatePath(`/trips/${tripId}/budget`)
  return { success: true, data: cat }
}

export async function deleteBudgetCategory(categoryId: string, tripId: string): Promise<ActionResult<void>> {
  const { supabase, user } = await getAuthUser()

  const owned = await verifyTripOwnership(supabase, tripId, user.id)
  if (!owned) return { success: false, error: 'Unauthorized' }

  const { error } = await supabase.from('budget_categories').delete().eq('id', categoryId)
  if (error) return { success: false, error: error.message }

  revalidatePath(`/trips/${tripId}/budget`)
  return { success: true }
}

export async function toggleSplitReimbursement(
  splitId: string,
  tripId: string,
  isReimbursed: boolean
): Promise<ActionResult<void>> {
  const { supabase, user } = await getAuthUser()

  const owned = await verifyTripOwnership(supabase, tripId, user.id)
  if (!owned) return { success: false, error: 'Unauthorized' }

  const { error } = await supabase
    .from('expense_splits')
    .update({ is_reimbursed: isReimbursed })
    .eq('id', splitId)

  if (error) return { success: false, error: error.message }

  revalidatePath(`/trips/${tripId}/budget`)
  return { success: true }
}


