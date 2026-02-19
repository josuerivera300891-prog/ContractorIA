import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'ContractorIA | Estimates & Invoices for Service Businesses',
  description: 'Professional estimate and invoice management for contractors, plumbers, electricians, and service businesses. AI-powered, multi-tenant SaaS platform.',
  openGraph: {
    title: 'ContractorIA | Estimates & Invoices for Service Businesses',
    description: 'Professional estimate and invoice management for contractors, plumbers, electricians, and service businesses.',
    locale: 'en_US',
    siteName: 'ContractorIA',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
