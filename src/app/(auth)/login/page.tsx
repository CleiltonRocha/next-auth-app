'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

import GoogleLogo from '@/assets/google-logo.svg'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const authSchema = z.object({
  email: z.string().email('Digite um e-mail válido!'),
  password: z.string().min(8, 'Digite uma senha de pelo menos 8 dígitos'),
})

type AuthSchema = z.infer<typeof authSchema>

export default function SignIn() {
  const { register, handleSubmit, formState, watch } = useForm<AuthSchema>({
    resolver: zodResolver(authSchema),
  })

  const { errors, isSubmitting } = formState

  const router = useRouter()

  async function handleSignIn(data: AuthSchema) {
    const result = await signIn('credentials', {
      email: data.email,
      password: data.password,
      redirect: false,
    })

    if (result?.error) {
      toast.error('Login Error', {
        description: 'Invalid email or password',
      })
    } else {
      router.push('/app')
    }
  }

  return (
    <>
      <div className="flex flex-col items-start">
        <h2 className="mb-3 text-2xl font-semibold text-primary">MyAPP</h2>

        <h3 className="text-3xl font-medium tracking-tight text-gray-900 dark:text-gray-50">
          Log in to MyAPP
        </h3>
        <p className="text-md mt-2 text-gray-600 dark:text-gray-400">
          Don&apos;t have an account?{' '}
          <Link href="/signup" className="text-blue-500">
            Sign up
          </Link>
        </p>
      </div>
      <Button
        className="flex w-full items-center justify-center gap-2"
        variant="outline"
        onClick={() => signIn('google', { redirect: true })}
      >
        <Image src={GoogleLogo} alt="Google Logo" className="h-4 w-4" />
        login with Google
      </Button>
      <div className="mb-6 mt-6 flex items-center justify-center">
        <div
          aria-hidden="true"
          className="h-px w-full bg-muted"
          data-orientation="horizontal"
          role="separator"
        ></div>
        <span className="text-slate-11 mx-4 text-xs font-normal">OR</span>
        <div
          aria-hidden="true"
          className="h-px w-full bg-muted"
          data-orientation="horizontal"
          role="separator"
        ></div>
      </div>
      <form onSubmit={handleSubmit(handleSignIn)}>
        <div className="flex flex-col gap-2">
          <Label className="text-muted-foreground" htmlFor="email">
            Email
          </Label>
          <Input
            id="email"
            placeholder="Email address"
            {...register('email')}
            className={`${errors?.email ? 'ring ring-red-400' : ''}`}
          />
          {errors?.email && (
            <p className="mt-1 text-xs text-red-400">{errors?.email.message}</p>
          )}
        </div>
        <div className="mt-4 flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <Label className="text-muted-foreground" htmlFor="password">
              Password
            </Label>
            <Link
              href={`/forgot-password?email=${watch('email') ?? ''}`}
              className="text-blue-500 text-primary"
            >
              Forgot your password?
            </Link>
          </div>
          <Input
            id="password"
            placeholder="Your password"
            type="password"
            {...register('password')}
            className={`${errors?.password ? 'ring ring-red-400' : ''}`}
          />
          {errors?.password && (
            <p className="mt-1 text-xs text-red-400">
              {errors?.password.message}
            </p>
          )}
        </div>

        <Button className="mt-4 w-full" type="submit" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isSubmitting ? 'Logging in...' : 'Log in'}
        </Button>
      </form>
    </>
  )
}
