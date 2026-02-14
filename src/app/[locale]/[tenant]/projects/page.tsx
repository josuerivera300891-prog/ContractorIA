"use client";

import { use } from "react";
import { Briefcase, BarChart3, Clock, Plus, Search, Filter } from "lucide-react";

export default function ProjectsPage({ params }: { params: Promise<{ tenant: string }> }) {
    const { tenant } = use(params);

    return (
        <div className="space-y-10">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-4xl font-[900] text-deep-blue tracking-tight mb-2 font-outfit">
                        Gestión de <span className="text-turq-primary">Proyectos</span>
                    </h1>
                    <p className="text-slate-500 font-medium font-inter">
                        Infraestructura activa para <span className="text-deep-blue font-bold">{tenant}</span>
                    </p>
                </div>
                <button className="pro-button shadow-xl shadow-turq-primary/20 group !py-3 !px-6 text-sm">
                    <Plus size={18} className="group-hover:rotate-90 transition-transform duration-500" />
                    Nuevo Proyecto
                </button>
            </div>

            {/* Stats Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { label: "En Ejecución", value: "12", icon: Briefcase, color: "turq" },
                    { label: "Finalizados", value: "48", icon: BarChart3, color: "turq" },
                    { label: "Pendientes", value: "3", icon: Clock, color: "turq" }
                ].map((stat, i) => (
                    <div key={i} className="pro-card bg-white/60 p-6 border-turq-primary/5">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-turq-primary/10 flex items-center justify-center text-turq-primary">
                                <stat.icon size={22} />
                            </div>
                            <div>
                                <h3 className="text-2xl font-[900] text-deep-blue font-outfit">{stat.value}</h3>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Main Content Area */}
            <div className="pro-card bg-white/60 p-8 min-h-[400px] flex flex-col">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                    <h2 className="text-xl font-[900] text-deep-blue font-outfit flex items-center gap-3">
                        <Briefcase className="text-turq-primary" size={24} />
                        Todos los Proyectos
                    </h2>
                    <div className="flex gap-3 w-full md:w-auto">
                        <div className="relative flex-1 md:w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                            <input
                                type="text"
                                placeholder="Buscar proyecto..."
                                className="w-full pl-10 pr-4 py-2 rounded-xl border border-turq-primary/10 bg-white/50 focus:outline-none focus:ring-2 focus:ring-turq-primary/20 text-sm font-medium"
                            />
                        </div>
                        <button className="p-2.5 rounded-xl border border-turq-primary/10 bg-white/50 text-slate-500 hover:text-turq-primary transition-colors">
                            <Filter size={18} />
                        </button>
                    </div>
                </div>

                {/* Empty State / Placeholder */}
                <div className="flex-1 flex flex-col items-center justify-center py-20 text-center">
                    <div className="w-20 h-20 rounded-full bg-turq-primary/5 flex items-center justify-center text-turq-primary/30 mb-6">
                        <Briefcase size={40} />
                    </div>
                    <h3 className="text-xl font-bold text-deep-blue mb-2 font-outfit">No hay proyectos activos</h3>
                    <p className="text-slate-500 max-w-sm mb-8 font-medium">
                        Comienza a utilizar la infraestructura de ContractorIA creando tu primer proyecto inteligente.
                    </p>
                    <button className="pro-button !px-8 text-xs uppercase tracking-widest font-black">
                        Empezar Ahora
                    </button>
                </div>
            </div>
        </div>
    );
}
