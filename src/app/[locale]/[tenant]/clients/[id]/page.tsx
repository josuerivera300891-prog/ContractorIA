import {
    getClientById,
    getClientStats,
    getClientEstimates,
    getClientInvoices,
    getClientProjects,
    getClientActivity,
    deleteClientAction
} from "@/app/actions/clients";
import { getUserProfile } from "@/app/actions/auth";
import {
    Mail,
    Phone,
    Building2,
    MapPin,
    History,
    ArrowLeft,
    MoreHorizontal,
    ExternalLink
} from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import DeleteButton from "@/components/common/DeleteButton";
import EditClientDialog from "@/components/clients/EditClientDialog";
import ClientStatsCard from "@/components/clients/ClientStatsCard";
import ClientTabs from "@/components/clients/ClientTabs";

export default async function ClientDetailPage({
    params,
}: {
    params: Promise<{ locale: string; tenant: string; id: string }>;
}) {
    const { locale, tenant, id } = await params;
    const profile = await getUserProfile();

    if (!profile?.companyId) {
        return <div className="p-8 text-center text-slate-400">No autorizado</div>;
    }

    const client = await getClientById(id);

    if (!client || client.company_id !== profile.companyId) {
        return notFound();
    }

    // Fetch all client data in parallel
    const [stats, estimates, invoices, projects, activity] = await Promise.all([
        getClientStats(id, profile.companyId),
        getClientEstimates(id, profile.companyId),
        getClientInvoices(id, profile.companyId),
        getClientProjects(id, profile.companyId),
        getClientActivity(id, profile.companyId)
    ]);

    return (
        <div className="space-y-8 max-w-6xl mx-auto pb-20">
            {/* Header / Nav */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <Link
                        href={`/${locale}/${tenant}/clients`}
                        className="flex items-center gap-2 text-slate-400 hover:text-turq-primary transition-colors text-xs font-black uppercase tracking-widest mb-4"
                    >
                        <ArrowLeft size={16} />
                        Lista de Clientes
                    </Link>
                    <div className="flex items-center gap-5">
                        <div className="w-16 h-16 rounded-3xl bg-turq-primary/10 flex items-center justify-center text-turq-primary font-black text-2xl uppercase shadow-lg shadow-turq-primary/5">
                            {client.first_name?.charAt(0)}
                        </div>
                        <div>
                            <h1 className="text-4xl font-[900] text-deep-blue tracking-tight font-outfit">
                                {client.first_name} <span className="text-turq-primary">{client.last_name}</span>
                            </h1>
                            <div className="flex items-center gap-3 mt-1 text-slate-500 font-medium">
                                <Building2 size={16} />
                                {client.company_name || "Persona Física"}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex gap-3">
                    <DeleteButton
                        id={id}
                        companyId={profile.companyId}
                        onDelete={deleteClientAction}
                        redirectTo={`/${locale}/${tenant}/clients`}
                    />
                    <EditClientDialog client={client} companyId={profile.companyId} />
                    <button className="p-2.5 bg-white border border-turq-primary/10 rounded-xl text-slate-400 hover:text-deep-blue shadow-sm transition-all">
                        <MoreHorizontal size={20} />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left: Contact Info */}
                <div className="space-y-8">
                    <div className="pro-card bg-white p-8 space-y-8">
                        <h3 className="text-sm font-black text-deep-blue uppercase tracking-widest border-b border-slate-50 pb-4">Detalles de Contacto</h3>

                        <div className="space-y-6">
                            <div className="flex items-center gap-4 group cursor-pointer">
                                <div className="p-3 bg-slate-50 rounded-xl text-slate-400 group-hover:text-turq-primary transition-colors">
                                    <Mail size={20} />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Email</span>
                                    <span className="text-sm font-bold text-deep-blue">{client.email}</span>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 group cursor-pointer">
                                <div className="p-3 bg-slate-50 rounded-xl text-slate-400 group-hover:text-turq-primary transition-colors">
                                    <Phone size={20} />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Teléfono</span>
                                    <span className="text-sm font-bold text-deep-blue">{client.phone}</span>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 group cursor-pointer">
                                <div className="p-3 bg-slate-50 rounded-xl text-slate-400 group-hover:text-turq-primary transition-colors">
                                    <MapPin size={20} />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Dirección</span>
                                    <span className="text-sm font-bold text-deep-blue">{client.address || "No especificada"}</span>
                                </div>
                            </div>
                        </div>

                        {client.notes && (
                            <div className="pt-6 border-t border-slate-50">
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-3">Notas Internas</span>
                                <p className="text-xs font-medium text-slate-500 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100">
                                    {client.notes}
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Stats Card */}
                    <ClientStatsCard stats={stats} />
                </div>

                {/* Right: Activity / Projects / Estimates */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Tabs with real data */}
                    <ClientTabs
                        estimates={estimates}
                        invoices={invoices}
                        projects={projects}
                        activity={activity}
                        clientName={client.first_name}
                        locale={locale}
                        tenant={tenant}
                    />

                    {/* Footer Info */}
                    <div className="bg-turq-primary/5 p-8 rounded-[2.5rem] border border-turq-primary/10 flex items-center justify-between group">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-turq-primary shadow-sm group-hover:scale-110 transition-transform">
                                <History size={20} />
                            </div>
                            <div>
                                <p className="text-xs font-black text-deep-blue uppercase tracking-widest">Cliente desde</p>
                                <p className="text-sm font-medium text-slate-500">{new Date(client.created_at).toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}</p>
                            </div>
                        </div>
                        <button className="w-10 h-10 bg-white rounded-xl border border-turq-primary/10 flex items-center justify-center text-slate-400 hover:text-turq-primary hover:border-turq-primary transition-all">
                            <ExternalLink size={20} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
