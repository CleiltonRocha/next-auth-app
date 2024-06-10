import Image from 'next/image'

import BgAuth from '@/assets/bg-auth.jpg'

interface AuthLayoutProps {
  children: React.ReactNode
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="flex min-h-[100dvh] items-center bg-slate-50 dark:bg-gray-950 lg:grid lg:grid-cols-2 lg:place-items-center">
      <div className="hidden h-full p-6 lg:block">
        <Image src={BgAuth} alt="" className="h-full rounded-[32px]" />
      </div>
      <div className="mx-auto w-full max-w-md space-y-6 px-4 py-12">
        {children}
      </div>
    </div>
  )
}
