import { getTenantDetail } from "@/app/actions/superadmin";
import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
    ArrowLeft, Users, UserCheck, FileText, Receipt, FolderKanban,
    Wallet, Mail, Phone, MapPin, CreditCard, Palette, Globe, Shield
} from "lucide-react";
import { TenantStatusToggle } from "../../TenantStatusToggle";
import { PlanChanger } from "./PlanChanger";

export default async function TenantDetailPage({
    params,
}: {
    params: Promise<{ locale: string; id: string }>;
}) {
    const { locale, id } = await params;
    const tenant = await getTenantDetail(id);

    if (!tenant) redirect(`/${locale}/superadmin`);

    const planBadgeColor: Record<string, string> = {
        free: "bg-slate-700 text-slate-300",
        starter: "bg-blue-900/60 text-blue-300",
        pro: "bg-emerald-900/60 text-emerald-300",
        enterprise: "bg-purple-900/60 text-purple-300",
    };

    const metricCards = [
        { label: "Miembros", value: tenant.member_count, icon: Users, color: "from-blue-500 to-blue-700" },
        { label: "Clientes", value: tenant.client_count, icon: UserCheck, color: "from-cyan-500 to-cyan-700" },
        { label: "Presupuestos", value: tenant.estimate_count, icon: FileText, color: "from-emerald-500 to-emerald-700" },
        { label: "Facturas", value: tenant.invoice_count, icon: Receipt, color: "from-amber-500 to-amber-700" },
        { label: "Proyectos", value: tenant.project_count, icon: FolderKanban, color: "from-purple-500 to-purple-700" },
        { label: "Gastos", value: tenant.expense_count, icon: Wallet, color: "from-red-500 to-red-700" },
    ];

    const roleBadge: Record<string, string> = {
        owner: "bg-amber-900/40 text-amber-400",
        admin: "bg-blue-900/40 text-blue-300",
        staff: "bg-slate-700 text-slate-300",
        superadmin: "bg-red-900/40 text-red-400",
    };

    return (
        <div className="p-8 lg:p-12 space-y-10">
            {/* Back + Header */}
            <div>
                <Link
                    href={`/${locale}/superadmin`}
                    className="inline-flex items-center gap-2 text-slate-500 hover:text-white text-xs font-bold transition-colors mb-6"
                >
                    <ArrowLeft className="w-4 h-4" /> Volver al Dashboard
                </Link>

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center text-white text-xl font-black border border-slate-700">
                            {tenant.name.charAt(0)}
                        </div>
                        <div>
                            <h1 className="text-3xl font-black text-white tracking-tight">{tenant.name}</h1>
                            <div className="flex items-center gap-3 mt-1">
                                <span className="text-slate-500 font-mono text-xs">{tenant.slug}</span>
                                <span className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase ${planBadgeColor[tenant.plan_tier]}`}>
                                    {tenant.plan_tier}
                                </span>
                                {tenant.is_active ? (
                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-900/40 text-emerald-400 text-[10px] font-black uppercase">
                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                        Activa
                                    </span>
                                ) : (
                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-red-900/40 text-red-400 text-[10px] font-black uppercase">
                                        <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
                                        Pausada
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <TenantStatusToggle companyId={tenant.id} isActive={tenant.is_active} companyName={tenant.name} />
                        <Link
                            href={`/${locale}/${tenant.slug}/dashboard`}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 text-white text-xs font-bold hover:bg-slate-700 transition-colors border border-slate-700"
                        >
                            <Globe className="w-3.5 h-3.5" />
                            Ver como Tenant
                        </Link>
                    </div>
                </div>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                {metricCards.map((m) => (
                    <div key={m.label} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition-all">
                        <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${m.color} flex items-center justify-center mb-3`}>
                            <m.icon className="w-4 h-4 text-white" />
                        </div>
                        <p className="text-2xl font-black text-white">{m.value}</p>
                        <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mt-0.5">{m.label}</p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Company Info */}
                <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5">
                    <h2 className="text-white font-black text-sm uppercase tracking-widest flex items-center gap-2">
                        <Shield className="w-4 h-4 text-red-400" />
                        Información de la Empresa
                    </h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <InfoRow icon={Mail} label="Email" value={tenant.business_email} />
                        <InfoRow icon={Phone} label="Teléfono" value={tenant.phone} />
                        <InfoRow icon={MapPin} label="Dirección" value={tenant.address} />
                        <InfoRow icon={CreditCard} label="Tax ID" value={tenant.tax_id} />
                        <InfoRow icon={Palette} label="Color Principal" value={tenant.primary_color} isColor />
                        <InfoRow icon={CreditCard} label="Stripe ID" value={tenant.stripe_account_id} />
                    </div>

                    <div className="pt-4 border-t border-slate-800">
                        <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-1">Tasa de Impuesto</p>
                        <p className="text-white font-bold">{tenant.tax_rate}%</p>
                    </div>

                    <div className="pt-4 border-t border-slate-800">
                        <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-1">Registrada</p>
                        <p className="text-white font-bold">{new Date(tenant.created_at).toLocaleDateString("es-MX", { year: "numeric", month: "long", day: "numeric" })}</p>
                    </div>
                </div>

                {/* Plan Management */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5">
                    <h2 className="text-white font-black text-sm uppercase tracking-widest">Gestión del Plan</h2>
                    <PlanChanger companyId={tenant.id} currentPlan={tenant.plan_tier} />

                    {tenant.plan_expires_at && (
                        <div className="pt-4 border-t border-slate-800">
                            <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-1">Expira</p>
                            <p className="text-amber-400 font-bold text-sm">
                                {new Date(tenant.plan_expires_at).toLocaleDateString("es-MX", { year: "numeric", month: "long", day: "numeric" })}
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Members */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
                <div className="px-6 py-5 border-b border-slate-800 flex items-center justify-between">
                    <h2 className="text-white font-black text-sm uppercase tracking-widest flex items-center gap-2">
                        <Users className="w-4 h-4 text-cyan-400" />
                        Miembros ({tenant.members.length})
                    </h2>
                </div>

                {tenant.members.length === 0 ? (
                    <div className="px-6 py-12 text-center text-slate-500 text-sm">
                        No hay miembros registrados en esta empresa.
                    </div>
                ) : (
                    <div className="divide-y divide-slate-800/60">
                        {tenant.members.map((m) => (
                            <div key={m.id} className="flex items-center gap-4 px-6 py-4 hover:bg-slate-800/30 transition-colors">
                                <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                                    {m.avatar_url ? (
                                        <Image src={m.avatar_url} alt="" width={40} height={40} className="w-full h-full rounded-full object-cover" />
                                    ) : (
                                        (m.first_name?.charAt(0) || "?")
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-white font-semibold text-sm truncate">
                                        {m.first_name || ""} {m.last_name || ""}
                                    </p>
                                    <p className="text-slate-500 text-[10px]">
                                        Desde {new Date(m.created_at).toLocaleDateString("es-MX")}
                                    </p>
                                </div>
                                <span className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase ${roleBadge[m.role] || "bg-slate-700 text-slate-300"}`}>
                                    {m.role}
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

// ─── Helper Component ────────────────────────────────────────────────────────

function InfoRow({
    icon: Icon,
    label,
    value,
    isColor,
}: {
    icon: React.ComponentType<{ className?: string }>;
    label: string;
    value: string | null;
    isColor?: boolean;
}) {
    return (
        <div className="flex items-start gap-3">
            <Icon className="w-4 h-4 text-slate-600 mt-0.5 flex-shrink-0" />
            <div>
                <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">{label}</p>
                {isColor && value ? (
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-md border border-slate-700" style={{ backgroundColor: value }} />
                        <p className="text-white text-sm font-semibold font-mono">{value}</p>
                    </div>
                ) : (
                    <p className="text-white text-sm font-semibold">{value || <span className="text-slate-600 italic">No configurado</span>}</p>
                )}
            </div>
        </div>
    );
}
