'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { AxiosError } from 'axios'
import { EyeIcon, EyeOffIcon, Loader2 } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

import GoogleLogo from '@/assets/google-logo.svg'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { api } from '@/lib/axios'

const authSchema = z.object({
  name: z.string().min(1, 'Digite um nome válido'),
  email: z.string().email('Digite um e-mail válido!'),
  password: z.string().min(8, 'Digite uma senha de pelo menos 8 dígitos'),
})

type AuthSchema = z.infer<typeof authSchema>

export default function SignUp() {
  const [showPassword, setShowPassword] = useState(false)

  const { register, handleSubmit, formState, watch } = useForm<AuthSchema>({
    resolver: zodResolver(authSchema),
  })

  const { errors, isSubmitting } = formState
  const router = useRouter()
  const isShowPasswordDisabled =
    !formState.dirtyFields.password || watch('password') === ''

  async function handleSignUp(data: AuthSchema) {
    try {
      const response = await api.post('/users/signup', data, {
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (response.status === 201) {
        toast.success('Account created successfully!', {
          description: 'Sign in to access MyAPP',
        })
        router.push('/login')
      }
    } catch (error) {
      if (error instanceof AxiosError && error?.response?.data?.error) {
        toast.error('Error creating account', {
          description: error.response.data.error || 'Unknown error',
        })
      }
    }
  }

  return (
    <>
      <div className="flex flex-col items-start">
        <h2 className="mb-3 text-2xl font-semibold text-primary">MyAPP</h2>

        <h3 className="text-3xl font-medium tracking-tight text-gray-900 dark:text-gray-50">
          Create a MyAPP account
        </h3>
        <p className="text-md mt-2 text-gray-600 dark:text-gray-400">
          Already have an account?{' '}
          <Link href="/login" className="text-primary">
            Log in
          </Link>
        </p>
      </div>
      <Button
        className="flex w-full items-center justify-center gap-2"
        variant="secondary"
        onClick={() => signIn('google', { redirect: true })}
      >
        <Image src={GoogleLogo} alt="Google Logo" className="h-4 w-4" />
        Sign up with Google
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
      <form onSubmit={handleSubmit(handleSignUp)}>
        <div className="mt-4 flex flex-col gap-2">
          <Label className="text-muted-foreground" htmlFor="name">
            Your name
          </Label>
          <Input
            id="name"
            placeholder="Enter your name"
            type="text"
            {...register('name')}
            className={`${errors?.name ? 'ring ring-red-400' : ''}`}
          />
          {errors?.name && (
            <p className="mt-1 text-xs text-red-400">{errors?.name.message}</p>
          )}
        </div>
        <div className="mt-4 flex flex-col gap-2">
          <Label className="text-muted-foreground" htmlFor="email">
            Email
          </Label>
          <Input
            id="email"
            placeholder="Enter your e-mail"
            {...register('email')}
            className={`${errors?.email ? 'ring ring-red-400' : ''}`}
          />
          {errors?.email && (
            <p className="mt-1 text-xs text-red-400">{errors?.email.message}</p>
          )}
        </div>
        <div className="mt-4 flex flex-col gap-2">
          <Label className="text-muted-foreground" htmlFor="password">
            Password
          </Label>
          <div className="relative">
            <Input
              id="password"
              placeholder="Enter your password"
              type={showPassword ? 'text' : 'password'}
              {...register('password')}
              className={`${errors?.password ? 'ring ring-red-400' : ''}`}
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
              onClick={() => setShowPassword((prev) => !prev)}
              disabled={isShowPasswordDisabled}
            >
              {showPassword ? (
                <EyeIcon className="h-4 w-4" aria-hidden="true" />
              ) : (
                <EyeOffIcon className="h-4 w-4" aria-hidden="true" />
              )}
              <span className="sr-only">
                {showPassword ? 'Hide password' : 'Show password'}
              </span>
            </Button>
          </div>
          {errors?.password && (
            <p className="mt-1 text-xs text-red-400">
              {errors?.password.message}
            </p>
          )}
        </div>

        <Button className="mt-4 w-full" type="submit" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isSubmitting ? 'Creating...' : 'Create an account'}
        </Button>
      </form>
    </>
  )
}
