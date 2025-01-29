import bcrypt from 'bcryptjs'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

import { prisma } from '@/services/database'
import { sendEmail } from '@/services/email'

import PasswordChangedEmail from '../../../../../emails/password-changed-email'

const resetPasswordSchema = z.object({
  token: z.string(),
  email: z.string().email(),
  newPassword: z
    .string()
    .min(6, 'The password must be at least 6 characters long'),
})

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json()
    const { token, email, newPassword } = resetPasswordSchema.parse(body)

    const user = await prisma.user.findUnique({ where: { email } })

    if (!user) {
      return NextResponse.json(
        {
          error: 'Oops! We could not find any user with this email.',
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
          error: 'Invalid or expired token.',
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
      from: 'MyAPP <onboarding@resend.dev>',
      to: email,
      subject: '[MyAPP] Password Reset Notification',
      react: PasswordChangedEmail({ name: user.name! }),
    })

    return NextResponse.json(
      { message: 'Password changed successfully!' },
      { status: 200 },
    )
    // eslint-disable-next-line
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to change password: ' + error.message },
      { status: 500 },
    )
  }
}
