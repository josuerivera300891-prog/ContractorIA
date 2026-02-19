'use client'

import { Card } from '@/components/ui/card'
import Link from 'next/link'

interface AdminDashboardProps {
  stats: {
    totalClients: number
    totalEstimates: number
    totalProjects: number
    pendingEstimates: number
    monthlyRevenue: number
    activeProjects: number
  }
}

export function AdminDashboard({ stats }: AdminDashboardProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount)
  }

  return (
    <div className="space-y-8">
      {/* Overview Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          title="Total Clients"
          value={stats.totalClients}
          subtitle="registered"
          icon={<UsersIcon className="w-6 h-6 text-turq-primary" />}
          color="primary"
        />
        <StatCard
          title="Estimates"
          value={stats.totalEstimates}
          subtitle={`${stats.pendingEstimates} pending`}
          icon={<DocumentIcon className="w-6 h-6 text-amber-500" />}
          color="warning"
        />
        <StatCard
          title="Active Projects"
          value={stats.activeProjects}
          subtitle={`of ${stats.totalProjects} total`}
          icon={<BriefcaseIcon className="w-6 h-6 text-emerald-500" />}
          color="success"
        />
        <StatCard
          title="Monthly Revenue"
          value={formatCurrency(stats.monthlyRevenue)}
          subtitle="this month"
          icon={<CurrencyIcon className="w-6 h-6 text-deep-blue" />}
          color="accent"
          isLarge
        />
      </div>

      {/* Quick Actions */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold text-deep-blue mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link href="estimates/new" className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
            <PlusIcon className="w-8 h-8 text-turq-primary" />
            <div>
              <p className="font-medium text-deep-blue">New Estimate</p>
              <p className="text-xs text-slate-500">Create with AI</p>
            </div>
          </Link>
          <Link href="clients" className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
            <UsersIcon className="w-8 h-8 text-emerald-500" />
            <div>
              <p className="font-medium text-deep-blue">Clients</p>
              <p className="text-xs text-slate-500">Manage clients</p>
            </div>
          </Link>
          <Link href="invoices" className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
            <CurrencyIcon className="w-8 h-8 text-amber-500" />
            <div>
              <p className="font-medium text-deep-blue">Invoices</p>
              <p className="text-xs text-slate-500">View payments</p>
            </div>
          </Link>
          <Link href="projects" className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
            <BriefcaseIcon className="w-8 h-8 text-deep-blue" />
            <div>
              <p className="font-medium text-deep-blue">Projects</p>
              <p className="text-xs text-slate-500">Track progress</p>
            </div>
          </Link>
        </div>
      </Card>
    </div>
  )
}

// Sub-components
function StatCard({
  title,
  value,
  subtitle,
  icon,
  color,
  isLarge = false
}: {
  title: string
  value: string | number
  subtitle: string
  icon: React.ReactNode
  color: 'primary' | 'accent' | 'warning' | 'success'
  isLarge?: boolean
}) {
  const bgColors = {
    primary: 'bg-cyan-50',
    accent: 'bg-slate-50',
    warning: 'bg-amber-50',
    success: 'bg-emerald-50'
  }

  return (
    <Card className={`p-4 ${bgColors[color]}`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-slate-500">{title}</p>
          <p className={`font-bold text-deep-blue ${isLarge ? 'text-xl' : 'text-2xl'}`}>{value}</p>
          <p className="text-xs text-slate-500 mt-1">{subtitle}</p>
        </div>
        {icon}
      </div>
    </Card>
  )
}

// Icons
function UsersIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  )
}

function DocumentIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  )
}

function CurrencyIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  )
}

function PlusIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
    </svg>
  )
}

function BriefcaseIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  )
}
