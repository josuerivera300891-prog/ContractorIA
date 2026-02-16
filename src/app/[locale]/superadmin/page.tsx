import { getGlobalMetrics, getAllTenantsWithMetrics } from "@/app/actions/superadmin";
import { Building2, Users, FileText, Receipt, Activity, Pause, ArrowRight } from "lucide-react";
import Link from "next/link";
import { TenantStatusToggle } from "./TenantStatusToggle";

export default async function SuperAdminDashboard({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;

    const [metrics, tenants] = await Promise.all([
        getGlobalMetrics(),
        getAllTenantsWithMetrics(),
    ]);

    const statCards = [
        { label: "Total Empresas", value: metrics.total_companies, icon: Building2, color: "from-blue-500 to-blue-700" },
        { label: "Activas", value: metrics.active_companies, icon: Activity, color: "from-emerald-500 to-emerald-700" },
        { label: "Pausadas", value: metrics.paused_companies, icon: Pause, color: "from-amber-500 to-amber-700" },
        { label: "Total Usuarios", value: metrics.total_users, icon: Users, color: "from-purple-500 to-purple-700" },
    ];

    const planBadgeColor: Record<string, string> = {
        free: "bg-slate-700 text-slate-300",
        starter: "bg-blue-900/60 text-blue-300",
        pro: "bg-emerald-900/60 text-emerald-300",
        enterprise: "bg-purple-900/60 text-purple-300",
    };

    return (
        <div className="p-8 lg:p-12 space-y-10">
            {/* Header */}
            <header>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] font-black uppercase tracking-[0.2em] mb-4">
                    Panel de Control
                </div>
                <h1 className="text-4xl font-black text-white tracking-tight">Dashboard Global</h1>
                <p className="text-slate-500 font-medium mt-1">Gestión centralizada del ecosistema ContractorIA</p>
            </header>

            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {statCards.map((card) => (
                    <div key={card.label} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-slate-700 transition-all duration-300 group">
                        <div className="flex items-center justify-between mb-4">
                            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center shadow-lg`}>
                                <card.icon className="w-5 h-5 text-white" />
                            </div>
                        </div>
                        <p className="text-3xl font-black text-white">{card.value}</p>
                        <p className="text-slate-500 text-xs font-semibold uppercase tracking-widest mt-1">{card.label}</p>
                    </div>
                ))}
            </div>

            {/* Secondary metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                    <div className="flex items-center gap-3 mb-1">
                        <FileText className="w-4 h-4 text-cyan-400" />
                        <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Total Presupuestos</p>
                    </div>
                    <p className="text-2xl font-black text-white">{metrics.total_estimates}</p>
                </div>
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                    <div className="flex items-center gap-3 mb-1">
                        <Receipt className="w-4 h-4 text-cyan-400" />
                        <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Total Facturas</p>
                    </div>
                    <p className="text-2xl font-black text-white">{metrics.total_invoices}</p>
                </div>
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                    <div className="flex items-center gap-3 mb-1">
                        <Users className="w-4 h-4 text-cyan-400" />
                        <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Total Clientes</p>
                    </div>
                    <p className="text-2xl font-black text-white">{metrics.total_clients}</p>
                </div>
            </div>

            {/* Plan Distribution */}
            {metrics.plan_distribution.length > 0 && (
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                    <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-4">Distribución por Plan</h3>
                    <div className="flex gap-4 flex-wrap">
                        {metrics.plan_distribution.map((p) => (
                            <div key={p.tier} className="flex items-center gap-3 bg-slate-800/50 px-4 py-2 rounded-xl">
                                <span className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase ${planBadgeColor[p.tier] || "bg-slate-700 text-slate-300"}`}>
                                    {p.tier}
                                </span>
                                <span className="text-white font-bold text-lg">{p.count}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Tenants Table */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
                <div className="px-8 py-5 border-b border-slate-800 flex items-center justify-between">
                    <h2 className="text-white font-black text-lg">Todas las Empresas</h2>
                    <span className="text-slate-500 text-xs font-bold">{tenants.length} registradas</span>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-800/40 border-b border-slate-800">
                            <tr className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                                <th className="px-8 py-4">Empresa</th>
                                <th className="px-4 py-4">Plan</th>
                                <th className="px-4 py-4">Estado</th>
                                <th className="px-4 py-4 text-center">Miembros</th>
                                <th className="px-4 py-4 text-center">Clientes</th>
                                <th className="px-4 py-4 text-center">Estimates</th>
                                <th className="px-4 py-4">Registro</th>
                                <th className="px-4 py-4 text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/60">
                            {tenants.map((t) => (
                                <tr key={t.id} className="hover:bg-slate-800/30 transition-colors">
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center text-white text-xs font-black border border-slate-700">
                                                {t.name.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="text-white font-bold text-sm">{t.name}</p>
                                                <p className="text-slate-500 font-mono text-[10px]">{t.slug}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-5">
                                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase ${planBadgeColor[t.plan_tier] || "bg-slate-700 text-slate-300"}`}>
                                            {t.plan_tier}
                                        </span>
                                    </td>
                                    <td className="px-4 py-5">
                                        {t.is_active ? (
                                            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-emerald-900/40 text-emerald-400 text-[10px] font-black uppercase">
                                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                                Activa
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-red-900/40 text-red-400 text-[10px] font-black uppercase">
                                                <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
                                                Pausada
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-4 py-5 text-center text-slate-400 text-sm font-semibold">{t.member_count}</td>
                                    <td className="px-4 py-5 text-center text-slate-400 text-sm font-semibold">{t.client_count}</td>
                                    <td className="px-4 py-5 text-center text-slate-400 text-sm font-semibold">{t.estimate_count}</td>
                                    <td className="px-4 py-5 text-slate-500 text-xs">{new Date(t.created_at).toLocaleDateString("es-MX")}</td>
                                    <td className="px-4 py-5 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <TenantStatusToggle companyId={t.id} isActive={t.is_active} companyName={t.name} />
                                            <Link
                                                href={`/${locale}/superadmin/tenants/${t.id}`}
                                                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-800 text-white text-xs font-bold hover:bg-slate-700 transition-colors"
                                            >
                                                Gestionar
                                                <ArrowRight className="w-3 h-3" />
                                            </Link>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
