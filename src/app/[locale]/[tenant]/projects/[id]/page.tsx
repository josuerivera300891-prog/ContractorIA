import { Briefcase, Calendar, CheckCircle2, Clock, DollarSign, ListTodo, Plus, TrendingUp, ChevronLeft } from "lucide-react";
import { createClient } from "@/utils/supabase/server";
import { getProject } from "@/app/actions/projects";
import { getProjectProfitability } from "@/app/actions/expenses";
import { getProjectTasks, updateTaskStatusAction } from "@/app/actions/tasks";
import { getUserProfile } from "@/app/actions/auth";
import { ProfitabilityCard } from "@/components/ProfitabilityCard";
import Link from "next/link";
import { revalidatePath } from "next/cache";

export default async function ProjectDetailPage({
    params: { locale, tenant, id }
}: {
    params: { locale: string; tenant: string; id: string }
}) {
    const profile = await getUserProfile();
    const companyId = profile?.companyId;
    if (!companyId) return <div>No autorizado</div>;

    const project = await getProject(id, companyId);
    if (!project) return <div>Proyecto no encontrado</div>;

    const tasks = await getProjectTasks(id, companyId);
    const profitability = project.estimate_id
        ? await getProjectProfitability(project.estimate_id)
        : null;

    const completedTasks = tasks.filter(t => t.status === 'DONE').length;
    const progress = tasks.length > 0 ? (completedTasks / tasks.length) * 100 : 0;

    async function handleUpdateStatus(taskId: string, newStatus: string) {
        'use server'
        await updateTaskStatusAction(taskId, newStatus as any, id, companyId as string);
    }

    return (
        <div className="space-y-10 font-outfit max-w-7xl mx-auto p-4 md:p-8">
            {/* Header / Navigation */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <Link
                        href={`/${locale}/${tenant}/projects`}
                        className="flex items-center gap-2 text-slate-400 hover:text-turq-primary transition-colors text-sm font-bold uppercase tracking-widest mb-4"
                    >
                        <ChevronLeft size={16} />
                        Volver a Proyectos
                    </Link>
                    <h1 className="text-4xl font-[900] text-deep-blue tracking-tight mb-2">
                        {project.name}
                    </h1>
                    <div className="flex flex-wrap gap-4 text-slate-500 font-medium font-inter">
                        <span className="flex items-center gap-2 bg-slate-100 px-3 py-1 rounded-full text-xs">
                            <Briefcase size={14} className="text-turq-primary" />
                            {project.status}
                        </span>
                        <span className="flex items-center gap-2 bg-slate-100 px-3 py-1 rounded-full text-xs">
                            <Calendar size={14} className="text-turq-primary" />
                            {project.start_date ? new Date(project.start_date).toLocaleDateString() : 'Sin fecha'}
                        </span>
                    </div>
                </div>
                <div className="flex gap-4">
                    <button className="pro-button-secondary !py-2.5 !px-5 text-sm">
                        Editar Proyecto
                    </button>
                    <button className="pro-button !py-2.5 !px-5 text-sm">
                        Completar Proyecto
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Metrics and Info */}
                <div className="lg:col-span-1 space-y-8">
                    {profitability && (
                        <ProfitabilityCard data={profitability} />
                    )}

                    <div className="pro-card p-8 bg-deep-blue text-white overflow-hidden relative group rounded-[2.5rem]">
                        <div className="relative z-10">
                            <h3 className="text-lg font-bold mb-6 font-outfit">Progreso Operativo</h3>
                            <div className="flex items-end justify-between mb-2">
                                <span className="text-3xl font-black">{Math.round(progress)}%</span>
                                <span className="text-xs font-bold text-blue-200/50 uppercase tracking-widest">
                                    {completedTasks}/{tasks.length} Tareas
                                </span>
                            </div>
                            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-turq-primary transition-all duration-1000"
                                    style={{ width: `${progress}%` }}
                                />
                            </div>
                        </div>
                        <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-turq-primary opacity-10 rounded-full blur-3xl group-hover:opacity-20 transition-opacity" />
                    </div>

                    <div className="pro-card p-8 rounded-[2.5rem] border-turq-primary/5">
                        <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                            <DollarSign size={16} className="text-turq-primary" />
                            Resumen Financiero
                        </h3>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center py-3 border-b border-turq-primary/5">
                                <span className="text-sm font-medium text-slate-500">Presupuesto</span>
                                <span className="font-bold text-deep-blue">${profitability?.revenue.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between items-center py-3 border-b border-turq-primary/5">
                                <span className="text-sm font-medium text-slate-500">Gastos Reales</span>
                                <span className="font-bold text-rose-500">${profitability?.totalExpenses.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between items-center py-3 font-outfit">
                                <span className="text-sm font-black text-deep-blue">Utilidad Bruta</span>
                                <span className="text-lg font-black text-emerald-500">${profitability?.margin.toLocaleString()}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Tasks & Timeline */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="pro-card p-8 rounded-[2.5rem] border-turq-primary/5 min-h-[500px]">
                        <div className="flex justify-between items-center mb-8">
                            <h3 className="text-xl font-[900] text-deep-blue flex items-center gap-3">
                                <ListTodo className="text-turq-primary" size={24} />
                                Plan de Ejecución
                            </h3>
                            <button className="flex items-center gap-2 text-turq-primary font-black text-xs uppercase tracking-widest hover:bg-turq-primary/5 px-4 py-2 rounded-xl transition-all">
                                <Plus size={16} />
                                Nueva Tarea
                            </button>
                        </div>

                        {tasks.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-20 text-center opacity-40">
                                <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-4">
                                    <ListTodo size={32} />
                                </div>
                                <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">No hay tareas programadas</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {tasks.map((task) => (
                                    <div
                                        key={task.id}
                                        className={`group flex items-center justify-between p-6 rounded-2xl border transition-all duration-300 ${task.status === 'DONE'
                                                ? 'bg-slate-50/50 border-slate-100 opacity-60'
                                                : 'bg-white border-turq-primary/5 hover:border-turq-primary/20 hover:shadow-xl hover:shadow-turq-primary/5'
                                            }`}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${task.status === 'DONE' ? 'bg-emerald-100 text-emerald-600' : 'bg-turq-primary/5 text-turq-primary'
                                                }`}>
                                                {task.status === 'DONE' ? <CheckCircle2 size={20} /> : <Clock size={20} />}
                                            </div>
                                            <div>
                                                <h4 className={`font-bold transition-all ${task.status === 'DONE' ? 'line-through text-slate-400' : 'text-deep-blue'}`}>
                                                    {task.title}
                                                </h4>
                                                {task.due_date && (
                                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                                                        Fecha límite: {new Date(task.due_date).toLocaleDateString()}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            {task.status !== 'DONE' && (
                                                <button
                                                    className="px-4 py-2 bg-emerald-500 text-white rounded-lg text-xs font-black uppercase tracking-widest hover:bg-emerald-600 transition-colors"
                                                >
                                                    Finalizar
                                                </button>
                                            )}
                                            <button className="p-2 text-slate-300 hover:text-rose-500 transition-colors">
                                                <Plus size={16} className="rotate-45" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="pro-card p-8 rounded-[2.5rem] border-turq-primary/5 bg-slate-50/30">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                <TrendingUp size={16} className="text-turq-primary" />
                                Notas del Proyecto
                            </h3>
                        </div>
                        <p className="text-slate-500 text-sm leading-relaxed font-inter italic">
                            {project.description || "Sin descripción adicional de ejecución."}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
