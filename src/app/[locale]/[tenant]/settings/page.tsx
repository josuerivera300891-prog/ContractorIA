"use client";

import { use } from "react";
import { Settings, User, Building2, Bell, Shield, CreditCard, ChevronRight } from "lucide-react";

export default function SettingsPage({ params }: { params: Promise<{ tenant: string }> }) {
    const { tenant } = use(params);

    return (
        <div className="space-y-10">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-4xl font-[900] text-deep-blue tracking-tight mb-2 font-outfit">
                        Centro de <span className="text-turq-primary">Control</span>
                    </h1>
                    <p className="text-slate-500 font-medium font-inter">
                        Configuración global para <span className="text-deep-blue font-bold">{tenant}</span>
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
                {/* Lateral Settings Menu */}
                <div className="lg:col-span-1 space-y-4">
                    {[
                        { label: "Perfil", icon: User, active: true },
                        { label: "Organización", icon: Building2 },
                        { label: "Notificaciones", icon: Bell },
                        { label: "Seguridad", icon: Shield },
                        { label: "Suscripción", icon: CreditCard }
                    ].map((item, i) => (
                        <button
                            key={i}
                            className={`w-full flex items-center justify-between px-6 py-4 rounded-2xl transition-all duration-300 font-bold text-sm ${item.active
                                    ? "bg-turq-primary shadow-lg shadow-turq-primary/20 text-white"
                                    : "bg-white/50 text-slate-500 hover:bg-white hover:text-deep-blue"
                                }`}
                        >
                            <div className="flex items-center gap-4">
                                <item.icon size={18} />
                                <span className="font-outfit uppercase tracking-widest text-[10px] font-black">{item.label}</span>
                            </div>
                            <ChevronRight size={14} className={item.active ? "text-white/70" : "text-slate-300"} />
                        </button>
                    ))}
                </div>

                {/* Settings Display Card */}
                <div className="lg:col-span-3">
                    <div className="pro-card bg-white/60 p-10 min-h-[600px] relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-80 h-80 bg-turq-primary/5 rounded-full blur-[120px]"></div>

                        <div className="relative z-10">
                            <h2 className="text-2xl font-[900] text-deep-blue mb-10 font-outfit flex items-center gap-4">
                                <div className="p-3 bg-turq-primary/10 rounded-2xl text-turq-primary shadow-sm">
                                    <User size={24} />
                                </div>
                                Ajustes de Perfil
                            </h2>

                            <div className="space-y-8 max-w-2xl">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Nombre Completo</label>
                                    <input
                                        type="text"
                                        defaultValue="Administrador Senior"
                                        className="w-full px-6 py-4 rounded-2xl border border-turq-primary/10 bg-white/70 focus:outline-none focus:ring-2 focus:ring-turq-primary/20 text-slate-700 font-bold font-inter"
                                    />
                                </div>

                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Correo Electrónico</label>
                                    <input
                                        type="email"
                                        defaultValue="admin@contractoria.ai"
                                        className="w-full px-6 py-4 rounded-2xl border border-turq-primary/10 bg-white/70 focus:outline-none focus:ring-2 focus:ring-turq-primary/20 text-slate-700 font-bold font-inter"
                                    />
                                </div>

                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Organización Activa</label>
                                    <div className="w-full px-6 py-4 rounded-2xl border border-turq-primary/5 bg-slate-50 text-slate-400 font-bold font-inter cursor-not-allowed flex items-center justify-between">
                                        <span>{tenant}</span>
                                        <Shield size={16} className="text-emerald-400" />
                                    </div>
                                    <p className="text-[10px] text-slate-400 font-medium pl-1 italic">El ID del Tenant está bloqueado por seguridad del sistema.</p>
                                </div>

                                <div className="pt-10 flex justify-end gap-4">
                                    <button className="px-8 py-4 rounded-2xl text-xs font-black uppercase tracking-widest text-slate-400 hover:text-deep-blue transition-colors">
                                        Descartar
                                    </button>
                                    <button className="pro-button !px-10 !h-14 text-xs shadow-2xl shadow-turq-primary/20">
                                        Guardar Cambios
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
