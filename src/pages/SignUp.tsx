import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ArrowRight, Loader2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { PasswordInput } from '@/components/ui/password-input'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { useAuth } from '@/context/AuthContext'

const AVATAR_IMAGE =
  'https://img.freepik.com/free-photo/3d-illustration-cartoon-female-tourist-with-camera_1142-32317.jpg?t=st=1713258403~exp=1713262003~hmac=40049ffdfe6e43796fc517fe880d3bad4d055e48e00946120ef1431cc510c8f7&w=740'

const signUpSchema = z
  .object({
    name: z.string().min(2, 'Name is too short'),
    email: z.string().email('Enter a valid email'),
    password: z.string().min(8, 'At least 8 characters'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

type SignUpValues = z.infer<typeof signUpSchema>

export default function SignUp() {
  const { signUp, loginWithGoogle } = useAuth()
  const [googleSubmitting, setGoogleSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignUpValues>({ resolver: zodResolver(signUpSchema) })

  const onSubmit = async (values: SignUpValues) => {
    try {
      await signUp(values)
    } catch {
      // toast already shown by AuthContext
    }
  }

  const handleGoogleSignIn = async () => {
    setGoogleSubmitting(true)
    try {
      await loginWithGoogle()
    } catch {
      setGoogleSubmitting(false)
    }
  }

  return (
    <div className="mesh-bg flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="glass-strong w-full max-w-md border-transparent">
        <CardHeader className="flex flex-col items-center gap-2 text-center">
          <div className="mb-2 size-20 overflow-hidden rounded-full shadow-lg">
            <img src={AVATAR_IMAGE} alt="" className="size-full object-cover" />
          </div>
          <h1 className="text-3xl font-bold text-primary">BlogInn</h1>
          <p className="text-sm text-muted-foreground">
            Join our community of writers and readers
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="name">Username</Label>
              <Input id="name" placeholder="Your name" {...register('name')} />
              {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="you@example.com" {...register('email')} />
              {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="password">Password</Label>
              <PasswordInput
                id="password"
                autoComplete="new-password"
                placeholder="••••••••"
                {...register('password')}
              />
              {errors.password && (
                <p className="text-sm text-destructive">{errors.password.message}</p>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="confirmPassword">Confirm password</Label>
              <PasswordInput
                id="confirmPassword"
                autoComplete="new-password"
                placeholder="••••••••"
                {...register('confirmPassword')}
              />
              {errors.confirmPassword && (
                <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>
              )}
            </div>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="animate-spin" />}
              Sign up
              <ArrowRight className="size-4" />
            </Button>
          </form>

          <div className="my-6 flex items-center gap-3 text-xs text-muted-foreground">
            <div className="h-px flex-1 bg-border" />
            Or continue with
            <div className="h-px flex-1 bg-border" />
          </div>

          <Button
            type="button"
            variant="outline"
            className="glass h-11 w-full border-transparent text-base"
            onClick={handleGoogleSignIn}
            disabled={googleSubmitting}
          >
            {googleSubmitting ? (
              <Loader2 className="animate-spin" />
            ) : (
              <span className="flex size-5 items-center justify-center rounded-full bg-white text-xs font-bold text-[#4285f4] shadow-sm">
                G
              </span>
            )}
            Continue with Google
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
