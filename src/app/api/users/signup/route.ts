import bcrypt from 'bcryptjs'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

import { prisma } from '@/services/database'
import { sendEmail } from '@/services/email'

import WelcomeEmail from '../../../../../emails/welcome-email'

const signUpSchema = z.object({
  email: z.string().email(),
  password: z.string(),
  name: z.string(),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { email, password, name } = signUpSchema.parse(body)

    if (!email || !password) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    }

    const hashedPassword = bcrypt.hashSync(password, 10)

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
      },
    })

    await sendEmail({
      from: 'MyAPP <welcome@resend.dev>',
      to: email,
      subject: 'Welcome to MyAPP!',
      react: WelcomeEmail({ name }),
    })

    return NextResponse.json(user, { status: 201 })
    // eslint-disable-next-line
  } catch (error: any) {
    if (error?.code === 'P2002' && error.meta?.target?.includes('email')) {
      return NextResponse.json(
        { error: 'This email is already in use.' },
        { status: 409 },
      )
    } else {
      return NextResponse.json(
        { error: 'Failed to create user' },
        { status: 500 },
      )
    }
  }
}
