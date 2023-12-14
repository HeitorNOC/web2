import type { Metadata } from 'next'
import { Roboto as FontSans } from 'next/font/google'
import './globals.css'
import { cn } from '../lib/utils'
import { NextAuthProvider } from './nextAuthProvider'

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["500", "700"]
})

export const metadata: Metadata = {
  title: 'Todo-List',
  description: 'Web2',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt">
      <body className={cn(
        "font-sans antialiased",
        fontSans.variable
      )}>
        <NextAuthProvider>
          {children}
        </NextAuthProvider>
      </body>
    </html>
  )
}
