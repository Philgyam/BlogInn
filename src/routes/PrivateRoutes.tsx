import { Navigate, Outlet } from 'react-router-dom'

import { useAuth } from '@/context/AuthContext'
import { ProfileProvider } from '@/context/ProfileContext'
import { Loader } from '@/components/Loader'

export default function PrivateRoutes() {
  const { user, loading } = useAuth()

  if (loading) return <Loader />
  if (!user) return <Navigate to="/" replace />

  return (
    <ProfileProvider>
      <Outlet />
    </ProfileProvider>
  )
}
