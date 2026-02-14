'use client';

import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, DollarSign, PieChart, Activity } from "lucide-react";

interface ProfitabilityData {
    revenue: number;
    totalExpenses: number;
    margin: number;
    marginPercent: number;
}

export function ProfitabilityCard({ data }: { data: ProfitabilityData }) {
    const isHealthy = data.marginPercent > 30; // Rule of thumb for contractors

    return (
        <div className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] p-8 border border-turq-primary/5 shadow-2xl shadow-turq-primary/5">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] mb-1 font-inter">
                        Rentabilidad del Proyecto
                    </h3>
                    <p className="text-2xl font-[900] text-deep-blue tracking-tighter font-outfit">
                        Margen de Ganancia
                    </p>
                </div>
                <div className={`p-4 rounded-2xl ${isHealthy ? 'bg-emerald-50 text-emerald-500' : 'bg-amber-50 text-amber-500'} transition-colors duration-500`}>
                    {isHealthy ? <TrendingUp size={24} /> : <TrendingDown size={24} />}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="p-6 rounded-3xl bg-slate-50/50 border border-slate-100/50 group hover:border-turq-primary/20 transition-all duration-500">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 rounded-lg bg-emerald-100 text-emerald-600">
                            <DollarSign size={16} />
                        </div>
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Ingresos</span>
                    </div>
                    <p className="text-2xl font-black text-deep-blue font-outfit">
                        ${data.revenue.toLocaleString()}
                    </p>
                </div>

                <div className="p-6 rounded-3xl bg-slate-50/50 border border-slate-100/50 group hover:border-turq-primary/20 transition-all duration-500">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 rounded-lg bg-rose-100 text-rose-600">
                            <Activity size={16} />
                        </div>
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Gastos Totales</span>
                    </div>
                    <p className="text-2xl font-black text-deep-blue font-outfit">
                        ${data.totalExpenses.toLocaleString()}
                    </p>
                </div>
            </div>

            <div className="space-y-6">
                <div>
                    <div className="flex justify-between items-end mb-3">
                        <span className="text-sm font-bold text-slate-500 font-inter">Eficiencia del Proyecto</span>
                        <span className={`text-xl font-black font-outfit ${isHealthy ? 'text-turq-primary' : 'text-amber-500'}`}>
                            {data.marginPercent.toFixed(1)}%
                        </span>
                    </div>
                    <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${Math.min(Math.max(data.marginPercent, 0), 100)}%` }}
                            transition={{ duration: 1.5, ease: "easeOut" }}
                            className={`h-full ${isHealthy ? 'bg-turq-primary' : 'bg-amber-500'} shadow-[0_0_15px_rgba(45,212,191,0.4)]`}
                        />
                    </div>
                </div>

                <div className="flex items-center gap-4 p-4 rounded-2xl bg-turq-primary/5 border border-turq-primary/10">
                    <div className="p-2 rounded-xl bg-turq-primary text-white">
                        <PieChart size={20} />
                    </div>
                    <div>
                        <p className="text-[10px] font-bold text-turq-primary uppercase tracking-widest mb-0.5">Utilidad Neta</p>
                        <p className="text-lg font-black text-deep-blue font-outfit">
                            ${data.margin.toLocaleString()}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
