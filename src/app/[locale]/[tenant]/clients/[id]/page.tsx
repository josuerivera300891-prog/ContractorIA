import { getClientById } from "@/app/actions/clients";
import { getUserProfile } from "@/app/actions/auth";
import {
    User,
    Mail,
    Phone,
    Building2,
    MapPin,
    History,
    Plus,
    ArrowLeft,
    MoreHorizontal,
    Briefcase,
    Receipt,
    ExternalLink
} from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import DeleteButton from "@/components/common/DeleteButton";
import EditClientDialog from "@/components/clients/EditClientDialog";
import { deleteClientAction } from "@/app/actions/clients";

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
                    <div className="pro-card bg-deep-blue p-8 relative overflow-hidden">
                        <div className="absolute -bottom-10 -right-10 text-white/5 rotate-12">
                            <Briefcase size={120} />
                        </div>
                        <div className="relative z-10 space-y-6">
                            <h3 className="text-xs font-black text-white/60 uppercase tracking-widest">Relación Comercial</h3>
                            <div className="space-y-4">
                                <div>
                                    <p className="text-white font-[900] text-3xl font-outfit tracking-tighter">$0.00</p>
                                    <p className="text-turq-primary text-[10px] font-black uppercase tracking-widest mt-1">Facturado Total</p>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="bg-white/5 p-3 rounded-xl border border-white/10">
                                        <p className="text-white font-black text-lg">0</p>
                                        <p className="text-[8px] text-white/40 uppercase font-black">Proyectos</p>
                                    </div>
                                    <div className="bg-white/5 p-3 rounded-xl border border-white/10">
                                        <p className="text-white font-black text-lg">0</p>
                                        <p className="text-[8px] text-white/40 uppercase font-black">Presupuestos</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right: Activity / Projects / Estimates */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Status Tabs Placeholder */}
                    <div className="flex gap-4 border-b border-slate-100 pb-px font-outfit">
                        <button className="px-6 py-4 border-b-2 border-turq-primary text-deep-blue text-sm font-black uppercase tracking-widest">Actividad</button>
                        <button className="px-6 py-4 border-b-2 border-transparent text-slate-400 text-sm font-black uppercase tracking-widest hover:text-deep-blue transition-all">Presupuestos</button>
                        <button className="px-6 py-4 border-b-2 border-transparent text-slate-400 text-sm font-black uppercase tracking-widest hover:text-deep-blue transition-all">Proyectos</button>
                        <button className="px-6 py-4 border-b-2 border-transparent text-slate-400 text-sm font-black uppercase tracking-widest hover:text-deep-blue transition-all">Facturas</button>
                    </div>

                    {/* Content Area */}
                    <div className="pro-card bg-white/60 border-dashed p-12 text-center">
                        <div className="w-20 h-20 bg-slate-50 rounded-[2rem] flex items-center justify-center text-slate-200 mx-auto mb-6">
                            <History size={40} />
                        </div>
                        <h3 className="text-xl font-black text-slate-400 uppercase tracking-widest font-outfit mb-2">Sin Historial Reciente</h3>
                        <p className="text-sm text-slate-500 max-w-xs mx-auto font-medium font-inter mb-8">Comienza a trabajar con {client.first_name} creando su primer presupuesto o proyecto.</p>
                        <div className="flex flex-wrap justify-center gap-4">
                            <button className="px-6 py-3 bg-white border border-turq-primary/10 rounded-2xl text-xs font-black text-deep-blue hover:bg-turq-primary hover:text-white transition-all shadow-sm flex items-center gap-2">
                                <Receipt size={16} />
                                Nuevo Presupuesto
                            </button>
                            <button className="px-6 py-3 bg-white border border-turq-primary/10 rounded-2xl text-xs font-black text-deep-blue hover:bg-turq-primary hover:text-white transition-all shadow-sm flex items-center gap-2">
                                <Briefcase size={16} />
                                Crear Proyecto
                            </button>
                        </div>
                    </div>

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
