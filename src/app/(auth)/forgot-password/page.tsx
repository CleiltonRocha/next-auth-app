'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { AxiosError } from 'axios'
import { ArrowLeft, Loader2, Mail } from 'lucide-react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { api } from '@/lib/axios'

const forgotPasswordSchema = z.object({
  email: z.string().email('Digite um e-mail válido!'),
})

type ForgotPasswordSchema = z.infer<typeof forgotPasswordSchema>

export default function ForgotPassword() {
  const { register, handleSubmit, formState, setValue } =
    useForm<ForgotPasswordSchema>({
      resolver: zodResolver(forgotPasswordSchema),
    })

  const { errors, isSubmitting } = formState

  const searchParams = useSearchParams()
  const email = searchParams.get('email')

  useEffect(() => {
    if (email) {
      setValue('email', email)
    }
  }, [email, setValue])

  async function handleForgotPassword(data: ForgotPasswordSchema) {
    try {
      const response = await api.post(
        '/users/send-reset-password-instructions',
        data,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      )

      console.log(response)

      toast.success('Email sent successfully!', {
        description: 'Go to your email to create a new password.',
      })
    } catch (error) {
      if (error instanceof AxiosError && error?.response?.data?.error) {
        const errorMessage =
          typeof error.response.data.error === 'string'
            ? error.response.data.error
            : 'Oops! for some reason your email was not sent. Check if you typed it correctly.'

        toast.error('Error sending the email!', {
          description: errorMessage,
        })
      }
    }
  }

  return (
    <>
      <div className="flex flex-col items-start">
        <h2 className="mb-3 text-2xl font-semibold text-primary">MyAPP</h2>
        <h3 className="text-3xl font-medium tracking-tight text-gray-900 dark:text-gray-50">
          Password recovery
        </h3>
        <p className="text-md mt-2 text-gray-600 dark:text-gray-400">
          Enter your email and we will send you the instructions to create a new
          password.
        </p>
      </div>
      <form onSubmit={handleSubmit(handleForgotPassword)}>
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

        <Button
          className="mt-4 flex w-full items-center gap-2"
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Mail className="h-4 w-4" />
          )}
          {isSubmitting ? 'Sending...' : 'Send email'}
        </Button>

        <Link href="/login" className="text-primary">
          <Button
            className="mt-4 flex w-full items-center justify-center gap-2"
            variant="secondary"
            type="button"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
        </Link>
      </form>
    </>
  )
}
