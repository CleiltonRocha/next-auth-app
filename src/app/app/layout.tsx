import { SessionProvider } from 'next-auth/react'
import { PropsWithChildren } from 'react'

import { MainHeader } from './_components/main-header'
import { MainSidebar } from './_components/main-sidebar'

export default function Layout({ children }: PropsWithChildren) {
  return (
    <SessionProvider>
      <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
        <MainSidebar />
        <div className="flex flex-col">
          <MainHeader />
          {children}
        </div>
      </div>
    </SessionProvider>
  )
}
