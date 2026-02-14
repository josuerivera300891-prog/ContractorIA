"use client";

import { use } from "react";
import { FileText, Plus, Search, Filter, Sparkles, BrainCircuit } from "lucide-react";

export default function EstimatesPage({ params }: { params: Promise<{ tenant: string }> }) {
    const { tenant } = use(params);

    return (
        <div className="space-y-10">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-4xl font-[900] text-deep-blue tracking-tight mb-2 font-outfit">
                        Neural <span className="text-turq-primary">Estimates</span>
                    </h1>
                    <p className="text-slate-500 font-medium font-inter">
                        Generación inteligente para <span className="text-deep-blue font-bold">{tenant}</span>
                    </p>
                </div>
                <button className="pro-button shadow-xl shadow-turq-primary/20 group !py-3 !px-6 text-sm">
                    <Sparkles size={18} className="group-hover:animate-pulse" />
                    Generar con IA
                </button>
            </div>

            {/* Estimates List / Placeholder */}
            <div className="pro-card bg-white/60 p-8 min-h-[500px] relative overflow-hidden group">
                <div className="absolute -top-24 -right-24 w-96 h-96 bg-turq-primary/5 rounded-full blur-[100px] group-hover:bg-turq-primary/10 transition-all duration-1000"></div>

                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10 relative z-10">
                    <h2 className="text-xl font-[900] text-deep-blue font-outfit flex items-center gap-3">
                        <FileText className="text-turq-primary" size={24} />
                        Presupuestos Generados
                    </h2>
                    <div className="flex gap-3 w-full md:w-auto">
                        <div className="relative flex-1 md:w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                            <input
                                type="text"
                                placeholder="Buscar presupuesto..."
                                className="w-full pl-10 pr-4 py-2 rounded-xl border border-turq-primary/10 bg-white/50 focus:outline-none focus:ring-2 focus:ring-turq-primary/20 text-sm font-medium"
                            />
                        </div>
                        <button className="p-2.5 rounded-xl border border-turq-primary/10 bg-white/50 text-slate-500 hover:text-turq-primary transition-colors">
                            <Filter size={18} />
                        </button>
                    </div>
                </div>

                {/* AI Interaction Teaser */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12 relative z-10">
                    <div className="p-6 rounded-3xl bg-gradient-to-br from-turq-primary/5 to-white/40 border border-turq-primary/10 flex items-center gap-6">
                        <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center text-turq-primary shadow-sm">
                            <BrainCircuit size={28} />
                        </div>
                        <div>
                            <h4 className="font-bold text-deep-blue font-outfit">Sugerencia de la Red</h4>
                            <p className="text-xs text-slate-500 font-medium">Analiza planos PDF para generar costos en segundos.</p>
                        </div>
                    </div>
                    <div className="p-6 rounded-3xl bg-gradient-to-br from-turq-secondary/5 to-white/40 border border-turq-secondary/10 flex items-center gap-6">
                        <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center text-turq-secondary shadow-sm">
                            <Sparkles size={28} />
                        </div>
                        <div>
                            <h4 className="font-bold text-deep-blue font-outfit">Optimización de Margen</h4>
                            <p className="text-xs text-slate-500 font-medium">Calcula el ROI proyectado automáticamente.</p>
                        </div>
                    </div>
                </div>

                {/* Empty State */}
                <div className="flex-1 flex flex-col items-center justify-center py-12 text-center relative z-10">
                    <div className="w-24 h-24 rounded-3xl bg-white border border-turq-primary/5 shadow-premium flex items-center justify-center text-turq-primary/20 mb-8 transform rotate-6 hover:rotate-0 transition-transform duration-500">
                        <FileText size={48} />
                    </div>
                    <h3 className="text-2xl font-black text-deep-blue mb-3 font-outfit tracking-tight">Tu bandeja está vacía</h3>
                    <p className="text-slate-500 max-w-sm mb-10 font-medium leading-relaxed">
                        Utiliza el motor de ContractorIA para crear presupuestos que impresionen a tus clientes.
                    </p>
                    <button className="pro-button !px-12 !h-14 text-sm shadow-2xl shadow-turq-primary/30">
                        Crear Mi Primer Presupuesto
                    </button>
                </div>
            </div>
        </div>
    );
}
