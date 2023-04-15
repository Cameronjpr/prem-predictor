import { ClerkProvider, UserButton, auth } from '@clerk/nextjs/app-beta'
import { Analytics } from '@vercel/analytics/react'

import './globals.css'
import Link from 'next/link'

export const metadata = {
  title: 'PremPredictor',
  description: 'PremPredictor',
  viewport:
    'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { userId } = auth()

  return (
    <html lang="en">
      <ClerkProvider>
        <body className="bg-slate-100 mx-auto overscroll-x-none">
          <header>
            <nav className="w-full flex flex-row p-4 border-b-2 bg-amber-300 justify-between h-16 ">
              <div className="flex flex-row gap-4 items-center text-amber-950 text-md">
                <Link href="/play">Play</Link>
                <Link href="/leaderboard">Leaderboard</Link>
                <Link href="/play/summary">Summary</Link>
                <Link href="/admin">Admin</Link>
              </div>
              <div className="justify-self-end">
                {userId ? <UserButton /> : <Link href="/sign-in">Sign in</Link>}
              </div>
            </nav>
          </header>
          <main className="p-4">{children}</main>
          <Analytics />
        </body>
      </ClerkProvider>
    </html>
  )
}
