'use client'

import Link from 'next/link'
import { Card } from '@/components/ui/card'

interface QuickActionsProps {
  locale: string
  tenant: string
}

export function QuickActions({ locale, tenant }: QuickActionsProps) {
  const actions = [
    {
      title: 'New Estimate',
      description: 'Create with AI assistance',
      href: `/${locale}/${tenant}/estimates/new`,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      ),
      color: 'bg-turq-primary'
    },
    {
      title: 'Clients',
      description: 'Manage your clients',
      href: `/${locale}/${tenant}/clients`,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      color: 'bg-emerald-500'
    },
    {
      title: 'Invoices',
      description: 'Track payments',
      href: `/${locale}/${tenant}/invoices`,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: 'bg-amber-500'
    }
  ]

  return (
    <Card className="p-6">
      <h3 className="font-semibold text-deep-blue mb-4">Quick Actions</h3>
      <div className="space-y-3">
        {actions.map((action, index) => (
          <Link
            key={index}
            href={action.href}
            className="flex items-center gap-4 p-4 rounded-xl border border-slate-200 hover:border-turq-primary/30 hover:bg-slate-50 transition-all group"
          >
            <div className={`${action.color} text-white p-3 rounded-lg group-hover:scale-110 transition-transform flex-shrink-0`}>
              {action.icon}
            </div>
            <div className="min-w-0">
              <p className="font-medium text-deep-blue">{action.title}</p>
              <p className="text-sm text-slate-500">{action.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </Card>
  )
}
