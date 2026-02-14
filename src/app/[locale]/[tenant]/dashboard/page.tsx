"use client";

import Link from "next/link";
import { use } from "react";
import {
    PlusCircle,
    Wallet,
    TrendingUp,
    Zap,
    Handshake,
    BrainCircuit,
    Sparkles,
    CheckCircle2,
    ArrowUpRight,
    Search
} from "lucide-react";

export default function TenantDashboard({ params }: { params: Promise<{ tenant: string }> }) {
    const { tenant } = use(params);

    return (
        <div className="space-y-10">
            {/* AI Welcome Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-turq-primary/10 border border-turq-primary/20 text-turq-primary text-[10px] font-black uppercase tracking-widest mb-4">
                        <span className="flex h-1.5 w-1.5 rounded-full bg-turq-primary animate-pulse"></span>
                        Neural Engine Online
                    </div>
                    <h1 className="text-4xl font-[900] text-deep-blue tracking-tight mb-2 font-outfit">
                        Bienvenido, <span className="text-turq-primary">Administrador</span>
                    </h1>
                    <p className="text-slate-500 font-medium font-inter">
                        Analizando el rendimiento de <span className="text-deep-blue font-bold">{tenant}</span> en tiempo real...
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="pro-button shadow-xl shadow-turq-primary/20 hover:scale-105 active:scale-95 group !py-3 !px-6 text-sm">
                        <PlusCircle size={18} className="group-hover:rotate-90 transition-transform duration-500" />
                        Nuevo Presupuesto IA
                    </button>
                </div>
            </div>

            {/* AI Insights Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                    { label: "Presupuestos Activos", value: "24", trend: "+12%", icon: Wallet, color: "turq" },
                    { label: "Margen Proyectado", value: "32.5%", trend: "+2.4%", icon: TrendingUp, color: "turq" },
                    { label: "Eficiencia Operativa", value: "94%", trend: "+5%", icon: Zap, color: "turq" },
                    { label: "Conversión de Tratos", value: "68%", trend: "+8%", icon: Handshake, color: "turq" }
                ].map((stat, i) => (
                    <div key={i} className="pro-card group bg-white/60 hover:bg-white/80 transition-all duration-500 border-turq-primary/5">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 rounded-2xl bg-turq-primary/10 flex items-center justify-center text-turq-primary group-hover:scale-110 transition-transform duration-500">
                                <stat.icon size={22} />
                            </div>
                            <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100 uppercase tracking-wider">
                                {stat.trend}
                            </span>
                        </div>
                        <h3 className="text-3xl font-[900] text-deep-blue mb-1 font-outfit">{stat.value}</h3>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] font-inter">{stat.label}</p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main AI Interaction Area */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="pro-card bg-white/60 p-8 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-turq-primary/5 rounded-full blur-[100px] group-hover:bg-turq-primary/10 transition-all duration-700"></div>
                        <div className="flex items-center justify-between mb-8 relative z-10">
                            <h2 className="text-xl font-[900] text-deep-blue flex items-center gap-3 font-outfit">
                                <BrainCircuit className="text-turq-primary" size={24} />
                                Insights de Inteligencia
                            </h2>
                            <button className="text-[10px] font-black text-turq-primary uppercase tracking-widest hover:text-turq-secondary transition-colors font-inter">
                                Ver análisis completo
                            </button>
                        </div>

                        <div className="space-y-4 relative z-10">
                            {[
                                { title: "Optimización de Costos Detectada", desc: "La IA sugiere reducir el margen en materiales industriales un 2% para ganar el proyecto 'Torre Norte'.", time: "Hace 2 min" },
                                { title: "Riesgo de Plazo Identificado", desc: "Posible retraso en entrega de acero. Se recomienda contactar proveedor alternativo en Panel B.", time: "Hace 15 min" }
                            ].map((insight, idx) => (
                                <div key={idx} className="flex gap-6 p-6 rounded-2xl bg-white/40 border border-turq-primary/5 hover:border-turq-primary/20 transition-all group/item shadow-sm hover:shadow-md">
                                    <div className="w-12 h-12 rounded-full bg-turq-primary/10 flex-shrink-0 flex items-center justify-center text-turq-primary group-hover/item:scale-110 transition-all">
                                        <Sparkles size={20} />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start mb-1">
                                            <h4 className="font-bold text-deep-blue group-hover/item:text-turq-primary transition-colors font-outfit">{insight.title}</h4>
                                            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{insight.time}</span>
                                        </div>
                                        <p className="text-sm text-slate-500 leading-relaxed font-inter">{insight.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="pro-card border-none bg-turq-primary/[0.03] hover:bg-turq-primary/[0.06] p-6 shadow-sm">
                            <h3 className="text-sm font-black text-deep-blue mb-4 uppercase tracking-[0.15em] font-outfit">Proyectos en Radar</h3>
                            <div className="space-y-3">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="flex items-center justify-between p-3.5 rounded-xl bg-white/60 border border-turq-primary/5 shadow-sm group hover:scale-[1.02] transition-transform">
                                        <div className="flex items-center gap-3">
                                            <div className="w-2 h-2 rounded-full bg-turq-primary shadow-[0_0_8px_rgba(6,182,212,0.5)]"></div>
                                            <span className="text-sm font-bold text-deep-blue font-inter">Proyecto Alpha {i}</span>
                                        </div>
                                        <ArrowUpRight size={14} className="text-slate-300 group-hover:text-turq-primary" />
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="pro-card border-none bg-turq-secondary/[0.03] hover:bg-turq-secondary/[0.06] p-6 shadow-sm">
                            <h3 className="text-sm font-black text-deep-blue mb-4 uppercase tracking-[0.15em] font-outfit">Métricas de Equipo</h3>
                            <div className="flex items-center justify-center py-2">
                                <div className="relative w-28 h-28">
                                    <svg className="w-full h-full" viewBox="0 0 36 36">
                                        <path className="text-turq-primary/10" strokeDasharray="100, 100" strokeWidth="3" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                                        <path className="text-turq-primary transition-all duration-1000" strokeDasharray="85, 100" strokeWidth="3" strokeLinecap="round" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                                    </svg>
                                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                                        <span className="text-2xl font-[900] text-deep-blue font-outfit">85%</span>
                                        <span className="text-[8px] font-black text-turq-primary uppercase tracking-widest leading-none font-inter">Score IA</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* AI Agent Sidebar Info */}
                <div className="space-y-8">
                    <div className="pro-card bg-gradient-to-br from-turq-primary/10 to-white/60 p-8 shadow-sm group">
                        <div className="flex items-center gap-3 mb-6 relative z-10">
                            <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-turq-primary shadow-sm group-hover:scale-110 transition-transform duration-500">
                                <CheckCircle2 size={20} />
                            </div>
                            <h3 className="text-sm font-black text-deep-blue uppercase tracking-[0.15em] font-outfit">Sugerencia del Agente</h3>
                        </div>
                        <p className="text-slate-500 text-sm leading-relaxed mb-8 italic font-inter relative z-10">
                            "He notado que los presupuestos enviados los martes tienen un 25% más de probabilidad de ser aprobados. ¿Quieres que programe los borradores actuales?"
                        </p>
                        <button className="pro-button w-full shadow-lg shadow-turq-primary/10 !py-4 !rounded-2xl text-xs tracking-[0.1em] z-10 relative active:scale-95">
                            Ejecutar Optimización
                        </button>
                    </div>

                    <div className="pro-card bg-white/60 p-8 shadow-sm">
                        <h3 className="text-sm font-black text-deep-blue uppercase tracking-[0.15em] mb-8 border-b border-turq-primary/10 pb-4 font-outfit">Actividad Neural</h3>
                        <div className="space-y-6">
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className="flex gap-4 group cursor-help">
                                    <div className="w-1 h-8 bg-gradient-to-b from-turq-primary to-turq-primary/10 rounded-full mt-1 group-hover:scale-y-125 transition-transform duration-300"></div>
                                    <div>
                                        <p className="text-[11px] font-bold text-deep-blue mb-0.5 font-outfit">Prompt analizado {i}</p>
                                        <p className="text-[10px] text-slate-400 font-medium tracking-tight font-inter">Cálculo de materiales completado con 99% de precisión.</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
