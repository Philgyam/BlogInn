import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { MailCheck, ArrowRight, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { useAuth } from '@/context/AuthContext'

export default function VerifyEmail() {
  const { user, resendVerification } = useAuth()
  const location = useLocation()
  const email = (location.state as { email?: string } | null)?.email ?? user?.email

  const [resending, setResending] = useState(false)

  const handleResend = async () => {
    setResending(true)
    try {
      await resendVerification()
      toast.success('Verification email sent', {
        description: 'Check your inbox — and your spam folder just in case.',
      })
    } catch (error) {
      toast.error('Could not resend the email', {
        description: error instanceof Error ? error.message : undefined,
      })
    } finally {
      setResending(false)
    }
  }

  return (
    <div className="mesh-bg flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="glass-strong w-full max-w-md border-transparent text-center">
        <CardHeader className="flex flex-col items-center gap-3">
          <div className="glass flex size-16 items-center justify-center rounded-full text-primary">
            <MailCheck className="size-8" />
          </div>
          <h1 className="text-2xl font-bold">Check your inbox</h1>
          <p className="text-sm text-muted-foreground">
            We&apos;ve sent a verification link to
            {email ? (
              <>
                {' '}
                <span className="font-medium text-foreground">{email}</span>.
              </>
            ) : (
              ' your email address.'
            )}{' '}
            Click it to confirm your account.
          </p>
        </CardHeader>

        <CardContent className="flex flex-col gap-3">
          <Button asChild className="h-11 text-base">
            <Link to="/avatar">
              Continue to setup <ArrowRight className="size-4" />
            </Link>
          </Button>

          <Button
            variant="outline"
            onClick={handleResend}
            disabled={resending}
            className="glass h-11 border-transparent text-base"
          >
            {resending && <Loader2 className="animate-spin" />}
            Resend email
          </Button>

          <p className="mt-2 text-xs text-muted-foreground">
            Didn&apos;t get it? Wait a minute, then resend. You can verify later from your
            profile too.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
