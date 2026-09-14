import { Outlet } from 'react-router-dom'

import { DesktopSidebar, MobileBottomNav, MobileHeader } from '@/components/AppSidebar'

export default function AppLayout() {
  return (
    <div className="mesh-bg flex min-h-screen bg-transparent">
      <DesktopSidebar />
      <div className="flex min-h-screen flex-1 flex-col">
        <MobileHeader />
        <main className="flex-1 pb-24 lg:pb-0">
          <Outlet />
        </main>
        <MobileBottomNav />
      </div>
    </div>
  )
}
