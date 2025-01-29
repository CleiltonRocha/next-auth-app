import bcrypt from 'bcryptjs'
import crypto from 'crypto'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

import { prisma } from '@/services/database'
import { sendEmail } from '@/services/email'

import { PasswordResetInstructions } from '../../../../../emails/password-reset-instructions'

const sendResetPasswordInstructionsSchema = z.object({
  email: z.string().email(),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { email } = sendResetPasswordInstructionsSchema.parse(body)

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    const user = await prisma.user.findUnique({ where: { email } })

    if (!user) {
      return NextResponse.json(
        {
          error:
            'Oops! We could not find any user with this email. Please check if you typed it correctly.',
        },
        { status: 404 },
      )
    }

    // Generate a reset token and its expiration time
    const resetToken = crypto.randomBytes(32).toString('hex')
    const hashedResetToken = bcrypt.hashSync(resetToken, 10)
    const resetTokenExpiry = new Date(Date.now() + 3600000) // 1 hour from now

    await prisma.user.update({
      where: { email },
      data: {
        resetToken: hashedResetToken,
        resetTokenExpiry,
      },
    })

    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${resetToken}&email=${email}`

    await sendEmail({
      from: 'MyAPP <onboarding@resend.dev>',
      to: email,
      subject: '[MyAPP] Password Recovery',
      react: PasswordResetInstructions({ name: user.name!, resetUrl }),
    })

    return NextResponse.json(
      { message: 'Password reset email sent' },
      { status: 200 },
    )
    // eslint-disable-next-line
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to send password reset email' + error },
      { status: 500 },
    )
  }
}
