import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Sidebar from '@/components/layout/Sidebar'
import TopNav from '@/components/layout/TopNav'
import UserMenu from '@/components/layout/UserMenu'

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  return (
    <div className="flex min-h-screen" style={{ background: '#0B1120' }}>
      {/* Sidebar */}
      <div className="hidden md:flex flex-col relative">
        <div className="sticky top-0 h-screen flex flex-col">
          <Sidebar />
          {/* User menu at bottom */}
          <div className="absolute bottom-0 left-0 right-0 p-3 border-t border-[rgba(30,45,69,0.6)] bg-[rgba(11,17,32,0.95)]">
            <UserMenu profile={profile} />
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        <TopNav profile={profile} />
        <main className="flex-1 p-6 lg:p-8 aurora-bg">
          {children}
        </main>
      </div>
    </div>
  )
}
