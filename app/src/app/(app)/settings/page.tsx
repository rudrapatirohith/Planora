import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import SettingsClient from '@/components/settings/SettingsClient'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Settings | Planora',
  description: 'Manage your Planora account settings and preferences.',
}

export default async function SettingsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold text-white mb-1">Settings</h1>
        <p className="text-[#8ea3be] text-sm">Manage your account and preferences</p>
      </div>
      <SettingsClient profile={profile} userEmail={user.email || ''} />
    </div>
  )
}
