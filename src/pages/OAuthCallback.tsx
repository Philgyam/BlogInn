import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { ArrowLeft, Loader2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { useAuth } from '@/context/AuthContext'
import { account, getProfile } from '@/lib/appwrite'

export default function OAuthCallback() {
  const { refreshUser } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [message, setMessage] = useState<string | null>(null)
  const completing = useRef(false)

  const userId = searchParams.get('userId')
  const secret = searchParams.get('secret')

  const providerError =
    searchParams.get('error_description') ||
    searchParams.get('error') ||
    (searchParams.get('status') === 'failed' ? 'Google sign-in was canceled or rejected.' : null)

  useEffect(() => {
    if (providerError) {
      setMessage(providerError)
      return
    }
    if (!userId || !secret) {
      setMessage('Google did not return a valid sign-in token. Please try again.')
      return
    }
    if (completing.current) return
    completing.current = true

    window.history.replaceState({}, '', '/auth/callback')

    let active = true
    account
      .createSession(userId, secret)
      .then(async () => {
        await refreshUser()
        return getProfile(userId)
      })
      .then((profile) => {
        if (active) {
          navigate(profile ? '/home' : '/avatar', { replace: true })
        }
      })
      .catch((error) => {
        if (active) {
          setMessage(error instanceof Error ? error.message : 'Could not finish signing in.')
        }
      })

    return () => {
      active = false
    }
  }, [navigate, providerError, refreshUser, secret, userId])

  return (
    <main className="mesh-bg flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="glass-strong w-full max-w-md border-transparent text-center">
        <CardHeader className="flex flex-col items-center gap-3">
          <span className="flex size-14 items-center justify-center rounded-full bg-primary text-2xl font-bold text-primary-foreground">
            G
          </span>
          <h1 className="text-2xl font-bold">
            {message ? 'Google sign-in did not finish' : 'Finishing your sign-in'}
          </h1>
          <p className="text-sm leading-6 text-muted-foreground">
            {message || 'Checking your BlogInn profile and preparing your account.'}
          </p>
        </CardHeader>
        <CardContent>
          {message ? (
            <div className="flex flex-col gap-2">
              <Button asChild className="h-11 rounded-full">
                <Link to="/signIn">Try Google again</Link>
              </Button>
              <Button variant="ghost" asChild className="rounded-full">
                <Link to="/">
                  <ArrowLeft className="size-4" />
                  Back to BlogInn
                </Link>
              </Button>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2 py-2 text-sm text-muted-foreground">
              <Loader2 className="size-4 animate-spin text-primary" />
              Connecting securely…
            </div>
          )}
        </CardContent>
      </Card>
    </main>
  )
}