import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'DevOps Pusher - Deployment Dashboard',
  description: 'Modern DevOps dashboard for managing deployments and monitoring builds',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="font-sans">{children}</body>
    </html>
  )
}
