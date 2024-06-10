'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { AxiosError } from 'axios'
import { ArrowLeft, Loader2, Mail } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

import Logo from '@/assets/icon-logo.svg'
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
      console.log('EMAIL', email)
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

      toast.success('Email enviado com sucesso!', {
        description: 'Corre lá no seu e-mail pra você criar uma nova senha.',
      })
    } catch (error) {
      if (error instanceof AxiosError && error?.response?.data?.error) {
        const errorMessage =
          typeof error.response.data.error === 'string'
            ? error.response.data.error
            : 'Ops! por algum motivo seu e-mail não foi enviado. Verifique se digitou corretamente.'

        toast.error('Erro ao enviar o e-mail!', {
          description: errorMessage,
        })
      }
    }
  }

  return (
    <>
      <div className="flex flex-col items-start">
        <Image src={Logo} alt="Logo" className="mb-3 h-12 w-12" />

        <h3 className="text-3xl font-medium tracking-tight text-gray-900 dark:text-gray-50">
          Recuperação de senha
        </h3>
        <p className="text-md mt-2 text-gray-600 dark:text-gray-400">
          Digite o seu e-mail que a gente manda as instruções pra você criar uma
          nova senha, beleza?
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
          {isSubmitting ? 'Enviando...' : 'Enviar E-mail'}
        </Button>

        <Link href="/login" className="text-primary">
          <Button
            className="mt-4 flex w-full items-center justify-center gap-2"
            variant="secondary"
            type="button"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </Button>
        </Link>
      </form>
    </>
  )
}
