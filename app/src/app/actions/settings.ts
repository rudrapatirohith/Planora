'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import type { ActionResult } from '@/types/app'
import type { Profile } from '@/types/database'

const ProfileSchema = z.object({
  full_name: z.string().max(100).optional(),
  preferred_currency: z.string().default('USD'),
})

async function getAuthUser() {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error || !user) redirect('/login')
  return { supabase, user }
}

export async function updateProfile(formData: FormData): Promise<ActionResult<Profile>> {
  const { supabase, user } = await getAuthUser()

  const raw = {
    full_name: formData.get('full_name') || undefined,
    preferred_currency: formData.get('preferred_currency') || 'USD',
  }

  const parsed = ProfileSchema.safeParse(raw)
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message }
  }

  const { data: profile, error } = await supabase
    .from('profiles')
    .update({ ...parsed.data, updated_at: new Date().toISOString() })
    .eq('id', user.id)
    .select()
    .single()

  if (error || !profile) {
    return { success: false, error: error?.message || 'Failed to update profile' }
  }

  revalidatePath('/settings')
  return { success: true, data: profile }
}

export async function signOut(): Promise<void> {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/login')
}


