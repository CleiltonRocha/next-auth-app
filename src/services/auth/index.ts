import { PrismaAdapter } from '@auth/prisma-adapter'
import bcrypt from 'bcryptjs'
import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider, { GoogleProfile } from 'next-auth/providers/google'

import WelcomeEmail from '../../../emails/welcome-email'
import { prisma } from '../database'
import { sendEmail } from '../email'

export const { auth, handlers, signIn, signOut } = NextAuth({
  pages: {
    signIn: '/login',
    signOut: '/login',
    error: '/login',
    verifyRequest: '/login',
    newUser: '/app',
  },
  session: {
    strategy: 'jwt',
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? '',

      profile: (profile: GoogleProfile) => {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
        }
      },
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const user = await prisma.user.findUnique({
          where: { email: credentials!.email as string },
        })

        if (user) {
          const isValidPassword = bcrypt.compareSync(
            credentials!.password as string,
            user.password!,
          )
          if (isValidPassword) {
            return {
              id: user.id,
              name: user.name,
              email: user.email,
              image: user.image,
            }
          } else {
            return null
          }
        } else {
          return null
        }
      },
    }),
  ],
  adapter: PrismaAdapter(prisma),
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === 'google') {
        const isNewUser =
          (await prisma.user.count({
            where: { email: user.email },
          })) === 0

        if (isNewUser) {
          await sendEmail({
            from: 'Acme <welcome@resend.dev>',
            to: user.email!,
            subject: 'Bem-vindo(a) à nossa plataforma!',
            react: WelcomeEmail({ name: user.name! }),
          })
        }
      }
      return true
    },
  },
})
