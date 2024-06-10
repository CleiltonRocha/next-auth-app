'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { AxiosError } from 'axios'
import { EyeIcon, EyeOffIcon, Loader2 } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

import Logo from '@/assets/icon-logo.svg'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { api } from '@/lib/axios'

const resetPasswordSchema = z
  .object({
    email: z.string().email('Digite um e-mail válido!'),
    token: z.string().nonempty('Token é obrigatório!'),
    newPassword: z.string().min(8, 'A senha deve ter pelo menos 8 caracteres'),
    confirmPassword: z
      .string()
      .min(8, 'A senha deve ter pelo menos 8 caracteres'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'As senhas não correspondem',
    path: ['confirmPassword'],
  })

type ResetPasswordSchema = z.infer<typeof resetPasswordSchema>

export default function ResetPassword() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const { register, handleSubmit, formState, setValue, watch } =
    useForm<ResetPasswordSchema>({
      resolver: zodResolver(resetPasswordSchema),
    })

  const { errors, isSubmitting } = formState

  const searchParams = useSearchParams()
  const token = searchParams.get('token')
  const email = searchParams.get('email')

  useEffect(() => {
    if (token) {
      setValue('token', token)
    }
    if (email) {
      setValue('email', email)
    }
  }, [token, email, setValue])

  const isShowPasswordDisabled =
    !formState.dirtyFields.newPassword || watch('newPassword') === ''
  const isShowConfirmPasswordDisabled =
    !formState.dirtyFields.confirmPassword || watch('confirmPassword') === ''

  async function handleResetPassword(data: ResetPasswordSchema) {
    try {
      await api.put('/users/reset-password', data, {
        headers: {
          'Content-Type': 'application/json',
        },
      })

      router.push('/login')

      toast.success('Senha alterada com sucesso!', {
        description:
          'Sua senha foi alterada. Agora você pode fazer login com a nova senha.',
      })
    } catch (error) {
      if (error instanceof AxiosError && error?.response?.data?.error) {
        const errorMessage =
          typeof error.response.data.error === 'string'
            ? error.response.data.error
            : 'Ops! por algum motivo não consegui alterar a seua senha 🫤'

        toast.error('Erro ao tentar alterar a senha!', {
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
          Redefinição de senha
        </h3>
        <p className="text-md mt-2 text-gray-600 dark:text-gray-400">
          Agora é só digitar uma nova senha para fazer a alteração.
        </p>
      </div>
      <form onSubmit={handleSubmit(handleResetPassword)}>
        <input type="hidden" {...register('token')} />
        <input type="hidden" {...register('email')} />

        <div className="mt-4 flex flex-col gap-2">
          <Label className="text-muted-foreground" htmlFor="password">
            Nova senha
          </Label>
          <div className="relative">
            <Input
              id="password"
              placeholder="Digite uma nova senha"
              type={showPassword ? 'text' : 'password'}
              {...register('newPassword')}
              className={`${errors?.newPassword ? 'ring ring-red-400' : ''}`}
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
          {errors?.newPassword && (
            <p className="mt-1 text-xs text-red-400">
              {errors?.newPassword.message}
            </p>
          )}
        </div>
        <div className="mt-4 flex flex-col gap-2">
          <Label className="text-muted-foreground" htmlFor="confirm_password">
            Confirme sua senha
          </Label>
          <div className="relative">
            <Input
              id="confirm_password"
              placeholder="Confirme sua senha"
              type={showConfirmPassword ? 'text' : 'password'}
              {...register('confirmPassword')}
              className={`${errors?.confirmPassword ? 'ring ring-red-400' : ''}`}
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
              onClick={() => setShowConfirmPassword((prev) => !prev)}
              disabled={isShowConfirmPasswordDisabled}
            >
              {showConfirmPassword ? (
                <EyeIcon className="h-4 w-4" aria-hidden="true" />
              ) : (
                <EyeOffIcon className="h-4 w-4" aria-hidden="true" />
              )}
              <span className="sr-only">
                {showConfirmPassword ? 'Hide password' : 'Show password'}
              </span>
            </Button>
          </div>
          {errors?.confirmPassword && (
            <p className="mt-1 text-xs text-red-400">
              {errors?.confirmPassword.message}
            </p>
          )}
        </div>

        <Button
          className="mt-4 flex w-full items-center gap-2"
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isSubmitting ? 'Alterando...' : 'Alterar Senha'}
        </Button>
        <Link href="/login">
          <Button className="mt-4 w-full" variant="secondary">
            Voltar
          </Button>
        </Link>
      </form>
    </>
  )
}
