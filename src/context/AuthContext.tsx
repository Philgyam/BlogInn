import {
  useCallback,
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react'
import { useNavigate } from 'react-router-dom'
import { ID, OAuthProvider, type Models } from 'appwrite'
import { toast } from 'sonner'

import { account } from '@/lib/appwrite'

interface SignUpInput {
  name: string
  email: string
  password: string
}

interface LoginInput {
  email: string
  password: string
}

interface AuthContextValue {
  user: Models.User<Models.Preferences> | null
  loading: boolean
  loginUser: (input: LoginInput) => Promise<void>
  logoutUser: () => Promise<void>
  signUp: (input: SignUpInput) => Promise<void>
  resendVerification: () => Promise<void>
  loginWithGoogle: () => Promise<void>
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate()
  const [user, setUser] = useState<Models.User<Models.Preferences> | null>(null)
  const [loading, setLoading] = useState(true)

  const refreshUser = useCallback(async () => {
    try {
      const accountDetails = await account.get()
      setUser(accountDetails)
    } catch {
      setUser(null)
    }
  }, [])

  useEffect(() => {
    ;(async () => {
      setLoading(true)
      await refreshUser()
      setLoading(false)
    })()
  }, [refreshUser])

  const clearActiveSession = async () => {
    try {
      await account.deleteSession('current')
    } catch {
      // no active session — nothing to clear
    }
  }

  const loginUser = async ({ email, password }: LoginInput) => {
    setLoading(true)
    try {
      await clearActiveSession()
      await account.createEmailPasswordSession(email, password)
      await refreshUser()
    } catch (error) {
      toast.error('Could not sign in', {
        description: error instanceof Error ? error.message : undefined,
      })
      throw error
    } finally {
      setLoading(false)
    }
  }

  const logoutUser = async () => {
    await account.deleteSession('current')
    setUser(null)
    navigate('/')
  }

  const signUp = async ({ name, email, password }: SignUpInput) => {
    setLoading(true)
    try {
      await clearActiveSession()
      await account.create(ID.unique(), email, password, name)
      await account.createEmailPasswordSession(email, password)
      await account.createVerification(`${window.location.origin}/avatar`)
      await refreshUser()
      navigate('/verify-email', { state: { email } })
    } catch (error) {
      toast.error('Signup failed', {
        description: error instanceof Error ? error.message : undefined,
      })
      throw error
    } finally {
      setLoading(false)
    }
  }

  const resendVerification = async () => {
    await account.createVerification(`${window.location.origin}/avatar`)
  }

  const loginWithGoogle = async () => {
    try {
      await clearActiveSession()
      setUser(null)

      const successUrl = new URL('/auth/callback', window.location.origin)
      const failureUrl = new URL('/auth/callback', window.location.origin)
      failureUrl.searchParams.set('status', 'failed')

      account.createOAuth2Token(
        OAuthProvider.Google,
        successUrl.toString(),
        failureUrl.toString(),
      )
    } catch (error) {
      toast.error('Could not continue with Google', {
        description: error instanceof Error ? error.message : undefined,
      })
      throw error
    }
  }

  return (
    <AuthContext.Provider
      value={{ user, loading, loginUser, logoutUser, signUp, resendVerification, loginWithGoogle, refreshUser }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider')
  return ctx
}
