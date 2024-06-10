import bcrypt from 'bcryptjs'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

import { prisma } from '@/services/database'
import { sendEmail } from '@/services/email'

import PasswordChangedEmail from '../../../../../emails/password-changed-email'

const resetPasswordSchema = z.object({
  token: z.string(),
  email: z.string().email(),
  newPassword: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres'),
})

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json()
    const { token, email, newPassword } = resetPasswordSchema.parse(body)

    const user = await prisma.user.findUnique({ where: { email } })

    if (!user) {
      return NextResponse.json(
        {
          error: 'Ops! Não encontramos nenhum usuário com esse e-mail.',
        },
        { status: 404 },
      )
    }

    const tokenIsValid = bcrypt.compareSync(token, user.resetToken ?? '')

    if (
      !tokenIsValid ||
      (user.resetTokenExpiry && user.resetTokenExpiry < new Date())
    ) {
      return NextResponse.json(
        {
          error: 'Token inválido ou expirado.',
        },
        { status: 400 },
      )
    }

    const hashedPassword = bcrypt.hashSync(newPassword, 10)

    await prisma.user.update({
      where: { email },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null,
      },
    })

    await sendEmail({
      from: 'Examify <onboarding@resend.dev>',
      to: email,
      subject: '[Examify] Aviso de Redefinição de senha',
      react: PasswordChangedEmail({ name: user.name! }),
    })

    return NextResponse.json(
      { message: 'Senha alterada com sucesso!' },
      { status: 200 },
    )
    // eslint-disable-next-line
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Falha ao alterar a senha: ' + error.message },
      { status: 500 },
    )
  }
}
