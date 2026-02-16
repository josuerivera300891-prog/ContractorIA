import { getAllTenantsWithMetrics } from "@/app/actions/superadmin";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { TenantStatusToggle } from "../TenantStatusToggle";

export default async function TenantsListPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    const tenants = await getAllTenantsWithMetrics();

    const planBadgeColor: Record<string, string> = {
        free: "bg-slate-700 text-slate-300",
        starter: "bg-blue-900/60 text-blue-300",
        pro: "bg-emerald-900/60 text-emerald-300",
        enterprise: "bg-purple-900/60 text-purple-300",
    };

    return (
        <div className="p-8 lg:p-12 space-y-8">
            <header>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] font-black uppercase tracking-[0.2em] mb-4">
                    Gestión de Tenants
                </div>
                <h1 className="text-3xl font-black text-white tracking-tight">Empresas Registradas</h1>
                <p className="text-slate-500 font-medium mt-1">{tenants.length} empresas en el ecosistema</p>
            </header>

            {/* Cards view */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                {tenants.map((t) => (
                    <div key={t.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-slate-700 transition-all duration-300 group">
                        {/* Header */}
                        <div className="flex items-start justify-between mb-5">
                            <div className="flex items-center gap-3">
                                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center text-white text-sm font-black border border-slate-700">
                                    {t.name.charAt(0)}
                                </div>
                                <div>
                                    <h3 className="text-white font-bold text-sm">{t.name}</h3>
                                    <p className="text-slate-500 font-mono text-[10px]">{t.slug}</p>
                                </div>
                            </div>
                            {t.is_active ? (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-900/40 text-emerald-400 text-[9px] font-black uppercase">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                    Activa
                                </span>
                            ) : (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-red-900/40 text-red-400 text-[9px] font-black uppercase">
                                    <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
                                    Pausada
                                </span>
                            )}
                        </div>

                        {/* Plan */}
                        <div className="flex items-center gap-2 mb-5">
                            <span className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase ${planBadgeColor[t.plan_tier] || "bg-slate-700 text-slate-300"}`}>
                                {t.plan_tier}
                            </span>
                            <span className="text-slate-600 text-[10px]">
                                Desde {new Date(t.created_at).toLocaleDateString("es-MX")}
                            </span>
                        </div>

                        {/* Metrics grid */}
                        <div className="grid grid-cols-3 gap-3 mb-5">
                            <div className="bg-slate-800/40 rounded-lg px-3 py-2 text-center">
                                <p className="text-white font-bold text-sm">{t.member_count}</p>
                                <p className="text-slate-500 text-[9px] font-bold uppercase">Miembros</p>
                            </div>
                            <div className="bg-slate-800/40 rounded-lg px-3 py-2 text-center">
                                <p className="text-white font-bold text-sm">{t.client_count}</p>
                                <p className="text-slate-500 text-[9px] font-bold uppercase">Clientes</p>
                            </div>
                            <div className="bg-slate-800/40 rounded-lg px-3 py-2 text-center">
                                <p className="text-white font-bold text-sm">{t.estimate_count}</p>
                                <p className="text-slate-500 text-[9px] font-bold uppercase">Estimates</p>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                            <TenantStatusToggle companyId={t.id} isActive={t.is_active} companyName={t.name} />
                            <Link
                                href={`/${locale}/superadmin/tenants/${t.id}`}
                                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-800 text-white text-xs font-bold hover:bg-slate-700 transition-colors group-hover:bg-red-500/10 group-hover:text-red-400"
                            >
                                Gestionar <ArrowRight className="w-3 h-3" />
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
