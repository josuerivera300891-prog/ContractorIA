'use client'

import { Briefcase, Receipt, FileText, DollarSign } from 'lucide-react'

interface ClientStats {
    totalInvoiced: number
    totalPaid: number
    balanceDue: number
    estimatesCount: number
    projectsCount: number
    invoicesCount: number
}

interface ClientStatsCardProps {
    stats: ClientStats
}

export default function ClientStatsCard({ stats }: ClientStatsCardProps) {
    return (
        <div className="pro-card bg-deep-blue p-8 relative overflow-hidden">
            <div className="absolute -bottom-10 -right-10 text-white/5 rotate-12">
                <Briefcase size={120} />
            </div>
            <div className="relative z-10 space-y-6">
                <h3 className="text-xs font-black text-white/60 uppercase tracking-widest">
                    Relación Comercial
                </h3>

                {/* Main Stats */}
                <div className="space-y-4">
                    <div>
                        <p className="text-white font-[900] text-3xl font-outfit tracking-tighter">
                            ${stats.totalInvoiced.toLocaleString()}
                        </p>
                        <p className="text-turq-primary text-[10px] font-black uppercase tracking-widest mt-1">
                            Facturado Total
                        </p>
                    </div>

                    {/* Sub Stats Grid */}
                    <div className="grid grid-cols-2 gap-3">
                        <div className="bg-white/5 p-3 rounded-xl border border-white/10">
                            <div className="flex items-center gap-2">
                                <DollarSign size={14} className="text-emerald-400" />
                                <p className="text-emerald-400 font-black text-lg">
                                    ${stats.totalPaid.toLocaleString()}
                                </p>
                            </div>
                            <p className="text-[8px] text-white/40 uppercase font-black">Cobrado</p>
                        </div>
                        <div className="bg-white/5 p-3 rounded-xl border border-white/10">
                            <div className="flex items-center gap-2">
                                <DollarSign size={14} className="text-amber-400" />
                                <p className="text-amber-400 font-black text-lg">
                                    ${stats.balanceDue.toLocaleString()}
                                </p>
                            </div>
                            <p className="text-[8px] text-white/40 uppercase font-black">Pendiente</p>
                        </div>
                    </div>

                    {/* Counts Grid */}
                    <div className="grid grid-cols-3 gap-2 pt-4 border-t border-white/10">
                        <div className="text-center">
                            <div className="flex items-center justify-center gap-1">
                                <FileText size={12} className="text-white/40" />
                                <p className="text-white font-black text-lg">{stats.estimatesCount}</p>
                            </div>
                            <p className="text-[8px] text-white/40 uppercase font-black">Presupuestos</p>
                        </div>
                        <div className="text-center">
                            <div className="flex items-center justify-center gap-1">
                                <Receipt size={12} className="text-white/40" />
                                <p className="text-white font-black text-lg">{stats.invoicesCount}</p>
                            </div>
                            <p className="text-[8px] text-white/40 uppercase font-black">Facturas</p>
                        </div>
                        <div className="text-center">
                            <div className="flex items-center justify-center gap-1">
                                <Briefcase size={12} className="text-white/40" />
                                <p className="text-white font-black text-lg">{stats.projectsCount}</p>
                            </div>
                            <p className="text-[8px] text-white/40 uppercase font-black">Proyectos</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
