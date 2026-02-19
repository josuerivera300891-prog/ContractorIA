'use client'

import { useState } from 'react'
import { History, FileText, Receipt, Briefcase } from 'lucide-react'
import Link from 'next/link'

interface Estimate {
    id: string
    estimate_number?: string
    status: string
    total: number
    created_at: string
}

interface Invoice {
    id: string
    invoice_number: string
    status: string
    total: number
    balance_due: number
    due_date: string
    created_at: string
}

interface Project {
    id: string
    name: string
    status: string
    start_date?: string
    end_date?: string
    created_at: string
}

interface Activity {
    id: string
    action: string
    metadata: Record<string, unknown>
    created_at: string
}

interface ClientTabsProps {
    estimates: Estimate[]
    invoices: Invoice[]
    projects: Project[]
    activity: Activity[]
    clientName: string
    locale: string
    tenant: string
}

type TabType = 'activity' | 'estimates' | 'invoices' | 'projects'

const statusColors: Record<string, string> = {
    DRAFT: 'bg-slate-100 text-slate-600',
    SENT: 'bg-blue-100 text-blue-600',
    VIEWED: 'bg-purple-100 text-purple-600',
    APPROVED: 'bg-emerald-100 text-emerald-600',
    SIGNED: 'bg-emerald-100 text-emerald-600',
    REJECTED: 'bg-rose-100 text-rose-600',
    UNPAID: 'bg-amber-100 text-amber-600',
    PARTIAL: 'bg-blue-100 text-blue-600',
    PAID: 'bg-emerald-100 text-emerald-600',
    OVERDUE: 'bg-rose-100 text-rose-600',
    PLANNING: 'bg-blue-100 text-blue-600',
    IN_PROGRESS: 'bg-amber-100 text-amber-600',
    COMPLETED: 'bg-emerald-100 text-emerald-600',
    ON_HOLD: 'bg-rose-100 text-rose-600'
}

const actionLabels: Record<string, string> = {
    CLIENT_CREATED: 'Cliente creado',
    CLIENT_UPDATED: 'Cliente actualizado',
    ESTIMATE_CREATED: 'Presupuesto creado',
    ESTIMATE_UPDATED: 'Presupuesto actualizado',
    ESTIMATE_SENT: 'Presupuesto enviado',
    ESTIMATE_SIGNED: 'Presupuesto firmado',
    INVOICE_CREATED: 'Factura generada',
    PAYMENT_RECORDED: 'Pago registrado',
    PROJECT_CREATED: 'Proyecto creado',
    PROJECT_UPDATED: 'Proyecto actualizado'
}

export default function ClientTabs({
    estimates,
    invoices,
    projects,
    activity,
    clientName,
    locale,
    tenant
}: ClientTabsProps) {
    const [activeTab, setActiveTab] = useState<TabType>('activity')

    const tabs: { id: TabType; label: string; icon: React.ReactNode; count: number }[] = [
        { id: 'activity', label: 'Actividad', icon: <History size={16} />, count: activity.length },
        { id: 'estimates', label: 'Presupuestos', icon: <FileText size={16} />, count: estimates.length },
        { id: 'invoices', label: 'Facturas', icon: <Receipt size={16} />, count: invoices.length },
        { id: 'projects', label: 'Proyectos', icon: <Briefcase size={16} />, count: projects.length }
    ]

    const hasNoData = estimates.length === 0 && invoices.length === 0 && projects.length === 0 && activity.length === 0

    return (
        <div className="space-y-6">
            {/* Tab Navigation */}
            <div className="flex gap-1 border-b border-slate-100 overflow-x-auto">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`
                            flex items-center gap-2 px-5 py-4 border-b-2 transition-all whitespace-nowrap
                            ${activeTab === tab.id
                                ? 'border-turq-primary text-deep-blue'
                                : 'border-transparent text-slate-400 hover:text-deep-blue'
                            }
                        `}
                    >
                        {tab.icon}
                        <span className="text-xs font-black uppercase tracking-widest">{tab.label}</span>
                        {tab.count > 0 && (
                            <span className="px-2 py-0.5 bg-slate-100 rounded-full text-[10px] font-bold">
                                {tab.count}
                            </span>
                        )}
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            <div className="min-h-[300px]">
                {/* Empty State */}
                {hasNoData && activeTab === 'activity' && (
                    <div className="pro-card bg-white/60 border-dashed p-12 text-center">
                        <div className="w-20 h-20 bg-slate-50 rounded-[2rem] flex items-center justify-center text-slate-200 mx-auto mb-6">
                            <History size={40} />
                        </div>
                        <h3 className="text-xl font-black text-slate-400 uppercase tracking-widest font-outfit mb-2">
                            Sin Historial Reciente
                        </h3>
                        <p className="text-sm text-slate-500 max-w-xs mx-auto font-medium">
                            Comienza a trabajar con {clientName} creando su primer presupuesto o proyecto.
                        </p>
                    </div>
                )}

                {/* Activity Tab */}
                {activeTab === 'activity' && activity.length > 0 && (
                    <div className="space-y-4">
                        {activity.map((item) => (
                            <div
                                key={item.id}
                                className="flex items-start gap-4 p-4 bg-white rounded-xl border border-slate-100"
                            >
                                <div className="w-10 h-10 bg-turq-primary/10 rounded-full flex items-center justify-center text-turq-primary flex-shrink-0">
                                    <History size={18} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-bold text-deep-blue">
                                        {actionLabels[item.action] || item.action}
                                    </p>
                                    <p className="text-[10px] text-slate-400 mt-1">
                                        {new Date(item.created_at).toLocaleDateString('es-ES', {
                                            day: 'numeric',
                                            month: 'short',
                                            year: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Estimates Tab */}
                {activeTab === 'estimates' && (
                    <div className="space-y-3">
                        {estimates.length === 0 ? (
                            <p className="text-center text-slate-400 py-8">Sin presupuestos</p>
                        ) : (
                            estimates.map((est) => (
                                <Link
                                    key={est.id}
                                    href={`/${locale}/${tenant}/estimates/${est.id}`}
                                    className="flex items-center justify-between p-4 bg-white rounded-xl border border-slate-100 hover:border-turq-primary transition-colors group"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 group-hover:text-turq-primary group-hover:bg-turq-primary/10 transition-colors">
                                            <FileText size={18} />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-deep-blue">
                                                #{est.estimate_number || est.id.slice(0, 8)}
                                            </p>
                                            <p className="text-[10px] text-slate-400">
                                                {new Date(est.created_at).toLocaleDateString('es-ES')}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className={`px-2 py-1 rounded-full text-[9px] font-black uppercase ${statusColors[est.status] || 'bg-slate-100 text-slate-600'}`}>
                                            {est.status}
                                        </span>
                                        <span className="text-sm font-bold text-deep-blue">
                                            ${Number(est.total).toLocaleString()}
                                        </span>
                                    </div>
                                </Link>
                            ))
                        )}
                    </div>
                )}

                {/* Invoices Tab */}
                {activeTab === 'invoices' && (
                    <div className="space-y-3">
                        {invoices.length === 0 ? (
                            <p className="text-center text-slate-400 py-8">Sin facturas</p>
                        ) : (
                            invoices.map((inv) => (
                                <Link
                                    key={inv.id}
                                    href={`/${locale}/${tenant}/invoices/${inv.id}`}
                                    className="flex items-center justify-between p-4 bg-white rounded-xl border border-slate-100 hover:border-turq-primary transition-colors group"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 group-hover:text-turq-primary group-hover:bg-turq-primary/10 transition-colors">
                                            <Receipt size={18} />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-deep-blue">
                                                #{inv.invoice_number}
                                            </p>
                                            <p className="text-[10px] text-slate-400">
                                                Vence: {new Date(inv.due_date).toLocaleDateString('es-ES')}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className={`px-2 py-1 rounded-full text-[9px] font-black uppercase ${statusColors[inv.status] || 'bg-slate-100 text-slate-600'}`}>
                                            {inv.status}
                                        </span>
                                        <div className="text-right">
                                            <p className="text-sm font-bold text-deep-blue">
                                                ${Number(inv.total).toLocaleString()}
                                            </p>
                                            {inv.balance_due > 0 && (
                                                <p className="text-[10px] text-amber-500 font-medium">
                                                    Debe: ${Number(inv.balance_due).toLocaleString()}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </Link>
                            ))
                        )}
                    </div>
                )}

                {/* Projects Tab */}
                {activeTab === 'projects' && (
                    <div className="space-y-3">
                        {projects.length === 0 ? (
                            <p className="text-center text-slate-400 py-8">Sin proyectos</p>
                        ) : (
                            projects.map((proj) => (
                                <Link
                                    key={proj.id}
                                    href={`/${locale}/${tenant}/projects/${proj.id}`}
                                    className="flex items-center justify-between p-4 bg-white rounded-xl border border-slate-100 hover:border-turq-primary transition-colors group"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 group-hover:text-turq-primary group-hover:bg-turq-primary/10 transition-colors">
                                            <Briefcase size={18} />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-deep-blue">
                                                {proj.name}
                                            </p>
                                            <p className="text-[10px] text-slate-400">
                                                {proj.start_date
                                                    ? `Inicio: ${new Date(proj.start_date).toLocaleDateString('es-ES')}`
                                                    : 'Sin fecha de inicio'
                                                }
                                            </p>
                                        </div>
                                    </div>
                                    <span className={`px-2 py-1 rounded-full text-[9px] font-black uppercase ${statusColors[proj.status] || 'bg-slate-100 text-slate-600'}`}>
                                        {proj.status.replace('_', ' ')}
                                    </span>
                                </Link>
                            ))
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}
