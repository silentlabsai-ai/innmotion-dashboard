import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'InnMotion Pipeline Dashboard',
  description: 'AI-powered pipeline management for tradies',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-background text-white min-h-screen">
        {children}
      </body>
    </html>
  )
}