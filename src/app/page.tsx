import Image from 'next/image'
import Link from 'next/link'

import AuthIcon from '@/assets/auth-icon.svg'
import { Button } from '@/components/ui/button'

export default function LandingPage() {
  return (
    <>
      <div className="relative min-h-dvh overflow-hidden bg-[url('../assets/bg-hero.webp')] bg-cover py-24 lg:py-32">
        <div className="relative z-10">
          <div className="container flex flex-col items-center justify-center py-10 text-center lg:py-16">
            <div className="group relative grid overflow-hidden rounded-xl p-3 shadow-[inset_0_1px_1px_0_rgba(216,236,248,.2),_inset_0_24px_48px_0_rgba(168,216,245,.06),_inset_0_0_0_1px_rgba(186,207,247,.12)] transition-colors duration-200">
              <span>
                <span className="spark mask-gradient absolute inset-0 h-[100%] w-[100%] animate-flip overflow-hidden rounded-xl [mask:linear-gradient(white,_transparent_50%)] before:absolute before:aspect-square before:w-[200%] before:rotate-[-90deg] before:animate-rotate before:bg-[conic-gradient(from_0deg,transparent_0_340deg,white_360deg)] before:content-[''] before:[inset:0_auto_auto_50%] before:[translate:-50%_-15%]" />
              </span>
              <span className="backdrop absolute inset-px rounded-[11px] bg-slate-800" />
              <Image
                src={AuthIcon}
                className="z-10 text-sm font-medium text-neutral-400"
                alt="Lock icon"
              />
            </div>
            <div className="mt-5 max-w-4xl">
              <h1 className="scroll-m-20 bg-gradient-to-b from-white to-slate-500 bg-clip-text text-3xl font-medium tracking-tight text-transparent md:text-5xl lg:text-7xl">
                A versatile authentication system built with Next.js
              </h1>
            </div>
            <div className="mt-5 max-w-3xl">
              <p className="text-xl text-muted-foreground">
                Secure and easy-to-implement authentication for your Next.js
                applications, supporting both Google and custom credentials,
                utilizing Resend and React Email templates.
              </p>
            </div>
            <div className="mt-8 flex justify-center gap-3">
              <Link href="/login">
                <Button size={'lg'}>Get started</Button>
              </Link>
              <Button size={'lg'} variant={'outline'}>
                Learn more
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
