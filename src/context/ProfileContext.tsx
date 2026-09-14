import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react'

import { getProfile, upsertProfile } from '@/lib/appwrite'
import { useAuth } from '@/context/AuthContext'
import type { ProfileDoc } from '@/types'

interface ProfileContextValue {
  profile: ProfileDoc | null
  username: string
  avatar: string
  loading: boolean
  refreshProfile: () => Promise<void>
  saveProfile: (
    data: Partial<Pick<ProfileDoc, 'username' | 'UserDescription' | 'UserAvatar' | 'interests'>>,
  ) => Promise<void>
}

const ProfileContext = createContext<ProfileContextValue | null>(null)

export function ProfileProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const [profile, setProfile] = useState<ProfileDoc | null>(null)
  const [loading, setLoading] = useState(false)

  const refreshProfile = useCallback(async () => {
    if (!user) {
      setProfile(null)
      return
    }
    setLoading(true)
    try {
      const doc = await getProfile(user.$id)
      setProfile(doc)
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => {
    refreshProfile()
  }, [refreshProfile])

  const saveProfile: ProfileContextValue['saveProfile'] = async (data) => {
    if (!user) return
    const doc = await upsertProfile(user.$id, data)
    setProfile(doc)
  }

  const storedAvatar = profile?.UserAvatar || ''
  const avatar = storedAvatar.includes('66201769ed5710073074') ? '' : storedAvatar

  return (
    <ProfileContext.Provider
      value={{
        profile,
        username: profile?.username || user?.name || '',
        avatar,
        loading,
        refreshProfile,
        saveProfile,
      }}
    >
      {children}
    </ProfileContext.Provider>
  )
}

export function useProfile() {
  const ctx = useContext(ProfileContext)
  if (!ctx) throw new Error('useProfile must be used within a ProfileProvider')
  return ctx
}
