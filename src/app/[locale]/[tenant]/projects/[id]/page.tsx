import { getProject } from "@/app/actions/projects";
import { getUserProfile } from "@/app/actions/auth";
import { getProjectProfitability } from "@/app/actions/expenses";
import {
    Briefcase,
    Clock,
    TrendingUp,
    ArrowLeft,
    CheckCircle2,
    AlertCircle,
    Plus,
    Calendar,
    DollarSign,
    Target
} from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import DeleteButton from "@/components/common/DeleteButton";
import EditProjectDialog from "@/components/projects/EditProjectDialog";
import { deleteProjectAction } from "@/app/actions/projects";

export default async function ProjectDetailPage({
    params,
}: {
    params: Promise<{ locale: string; tenant: string; id: string }>;
}) {
    const { locale, tenant, id } = await params;
    const profile = await getUserProfile();

    if (!profile?.companyId) {
        return <div className="p-8 text-center text-slate-400">No autorizado</div>;
    }

    const project = await getProject(id, profile.companyId);

    if (!project) {
        return notFound();
    }

    // Get profitability data
    const stats = project.estimate_id ? await getProjectProfitability(project.estimate_id) : null;

    const statusColors = {
        PLANNING: "bg-blue-50 text-blue-600 border-blue-100",
        IN_PROGRESS: "bg-amber-50 text-amber-600 border-amber-100",
        COMPLETED: "bg-emerald-50 text-emerald-600 border-emerald-100",
        ON_HOLD: "bg-rose-50 text-rose-600 border-rose-100",
    };

    return (
        <div className="space-y-8 max-w-6xl mx-auto pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <Link
                        href={`/${locale}/${tenant}/projects`}
                        className="flex items-center gap-2 text-slate-400 hover:text-turq-primary transition-colors text-xs font-black uppercase tracking-widest mb-4"
                    >
                        <ArrowLeft size={16} />
                        Portafolio de Proyectos
                    </Link>
                    <div className="flex items-center gap-4">
                        <h1 className="text-4xl font-[900] text-deep-blue tracking-tight font-outfit">
                            {project.name}
                        </h1>
                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest uppercase border ${statusColors[project.status as keyof typeof statusColors]}`}>
                            {project.status.replace('_', ' ')}
                        </span>
                    </div>
                </div>

                <div className="flex gap-3">
                    <DeleteButton
                        id={id}
                        companyId={profile.companyId}
                        onDelete={deleteProjectAction}
                        redirectTo={`/${locale}/${tenant}/projects`}
                    />
                    <button className="flex items-center gap-2 px-5 py-2.5 bg-white border border-turq-primary/10 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all shadow-sm">
                        <Plus size={16} />
                        Nueva Tarea
                    </button>
                    <EditProjectDialog project={project} companyId={profile.companyId} />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left: Project Stats & Profitability */}
                <div className="space-y-8">
                    {/* Profitability Card */}
                    {stats && (
                        <div className="pro-card bg-deep-blue p-8 relative overflow-hidden group">
                            <div className="absolute -top-10 -right-10 text-white/5 group-hover:scale-110 transition-transform">
                                <TrendingUp size={160} />
                            </div>
                            <div className="relative z-10 space-y-6">
                                <h3 className="text-xs font-black text-white/60 uppercase tracking-widest flex items-center gap-2">
                                    <TrendingUp size={16} className="text-turq-primary" />
                                    Métricas de Rentabilidad
                                </h3>

                                <div className="space-y-6">
                                    <div>
                                        <p className="text-turq-primary font-[900] text-3xl font-outfit tracking-tighter">
                                            {stats.marginPercent.toFixed(1)}%
                                        </p>
                                        <p className="text-white/40 text-[10px] font-black uppercase tracking-widest mt-1">Margen de Beneficio</p>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-white/5 p-3 rounded-xl border border-white/10">
                                            <p className="text-white font-bold text-sm">${stats.revenue.toLocaleString()}</p>
                                            <p className="text-[8px] text-white/40 uppercase font-black">Ingresos</p>
                                        </div>
                                        <div className="bg-white/5 p-3 rounded-xl border border-white/10">
                                            <p className="text-rose-400 font-bold text-sm">${stats.totalExpenses.toLocaleString()}</p>
                                            <p className="text-[8px] text-white/40 uppercase font-black">Gastos</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-4 bg-turq-primary rounded-2xl">
                                    <p className="text-deep-blue font-black text-xl tracking-tighter">${stats.margin.toLocaleString()}</p>
                                    <p className="text-deep-blue/40 text-[8px] font-black uppercase tracking-widest">Ganancia Neta Estimada</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Timeline & Details */}
                    <div className="pro-card bg-white p-8 space-y-6">
                        <h3 className="text-sm font-black text-deep-blue uppercase tracking-widest border-b border-slate-50 pb-4">Detalles del Proyecto</h3>

                        <div className="space-y-6">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-slate-50 rounded-xl text-slate-400">
                                    <Calendar size={20} />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Fecha Inicio</span>
                                    <span className="text-sm font-bold text-deep-blue">
                                        {project.start_date ? new Date(project.start_date).toLocaleDateString() : 'Por definir'}
                                    </span>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-slate-50 rounded-xl text-slate-400">
                                    <Target size={20} />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Objetivo Final</span>
                                    <span className="text-sm font-bold text-deep-blue">
                                        {project.end_date ? new Date(project.end_date).toLocaleDateString() : 'Por definir'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right: Tasks & Description */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="pro-card bg-white p-10">
                        <h3 className="text-sm font-black text-deep-blue uppercase tracking-widest mb-6">Descripción del Proyecto</h3>
                        <p className="text-slate-600 font-medium leading-relaxed italic border-l-4 border-turq-primary/20 pl-6 py-2 bg-turq-primary/[0.02] rounded-r-2xl">
                            {project.description || "Sin descripción proporcionada."}
                        </p>
                    </div>

                    {/* Project Tasks List Component Placeholder */}
                    <div className="pro-card bg-white p-8">
                        <div className="flex justify-between items-center mb-10">
                            <h3 className="text-sm font-black text-deep-blue uppercase tracking-widest flex items-center gap-2">
                                <CheckCircle2 size={18} className="text-turq-primary" />
                                Lista de Tareas
                            </h3>
                            <button className="text-[10px] font-black text-turq-primary uppercase tracking-widest hover:underline">Gestionar Tareas →</button>
                        </div>

                        <div className="py-20 text-center border-2 border-dashed border-slate-100 rounded-[2rem]">
                            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-200 mx-auto mb-6">
                                <Clock size={32} />
                            </div>
                            <p className="text-sm font-bold text-slate-400 mb-4 uppercase tracking-widest">No hay tareas programadas</p>
                            <button className="px-6 py-3 bg-deep-blue text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-turq-primary transition-all">
                                Crear Primera Tarea
                            </button>
                        </div>
                    </div>

                    {/* Estimate Link */}
                    {project.estimate_id && (
                        <Link
                            href={`/${locale}/${tenant}/estimates/${project.estimate_id}`}
                            className="block p-8 bg-turq-primary/5 rounded-[2.5rem] border border-turq-primary/10 hover:border-turq-primary group transition-all"
                        >
                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-turq-primary shadow-sm group-hover:rotate-12 transition-transform">
                                        <DollarSign size={20} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Presupuesto Vinculado</p>
                                        <p className="text-sm font-bold text-deep-blue">Ver propuesta comercial original</p>
                                    </div>
                                </div>
                                <ArrowLeft className="rotate-180 text-slate-300 group-hover:text-turq-primary transition-colors" size={20} />
                            </div>
                        </Link>
                    )}
                </div>
            </div>
        </div>
    );
}
