"use client";

import { use, useState } from "react";
import { User, Building2, Bell, Shield, CreditCard, ChevronRight, Palette, Link as LinkIcon, Settings, Loader2 } from "lucide-react";
import { updateCompanyBranding } from "@/app/actions/settings";

type Tab = 'profile' | 'organization' | 'notifications' | 'security' | 'subscription';

export default function SettingsPage({ params }: { params: Promise<{ tenant: string }> }) {
    const { tenant } = use(params);
    const [activeTab, setActiveTab] = useState<Tab>('profile');
    const [isSaving, setIsSaving] = useState(false);

    const handleBrandingSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSaving(true);
        const formData = new FormData(e.currentTarget);
        const result = await updateCompanyBranding(formData);
        setIsSaving(false);
        if (result.success) {
            alert("¡Branding actualizado con éxito! Los cambios se reflejarán en todo el sistema.");
        } else {
            alert("Error: " + result.error);
        }
    };

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
                        { id: 'profile', label: "Perfil", icon: User },
                        { id: 'organization', label: "Organización", icon: Building2 },
                        { id: 'notifications', label: "Notificaciones", icon: Bell },
                        { id: 'security', label: "Seguridad", icon: Shield },
                        { id: 'subscription', label: "Suscripción", icon: CreditCard }
                    ].map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id as Tab)}
                            className={`w-full flex items-center justify-between px-6 py-4 rounded-2xl transition-all duration-300 font-bold text-sm ${activeTab === item.id
                                ? "bg-turq-primary shadow-lg shadow-turq-primary/20 text-white"
                                : "bg-white/50 text-slate-500 hover:bg-white hover:text-deep-blue"
                                }`}
                        >
                            <div className="flex items-center gap-4">
                                <item.icon size={18} />
                                <span className="font-outfit uppercase tracking-widest text-[10px] font-black">{item.label}</span>
                            </div>
                            <ChevronRight size={14} className={activeTab === item.id ? "text-white/70" : "text-slate-300"} />
                        </button>
                    ))}
                </div>

                {/* Settings Display Card */}
                <div className="lg:col-span-3">
                    <div className="pro-card bg-white/60 p-10 min-h-[600px] relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-80 h-80 bg-turq-primary/5 rounded-full blur-[120px]"></div>

                        <div className="relative z-10 font-inter">
                            {activeTab === 'profile' && (
                                <>
                                    <h2 className="text-2xl font-[900] text-deep-blue mb-10 font-outfit flex items-center gap-4">
                                        <div className="p-3 bg-turq-primary/10 rounded-2xl text-turq-primary shadow-sm">
                                            <User size={24} />
                                        </div>
                                        Ajustes de Perfil
                                    </h2>

                                    <div className="space-y-8 max-w-2xl">
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Nombre Completo</label>
                                            <input type="text" defaultValue="Administrador Senior" className="w-full px-6 py-4 rounded-2xl border border-turq-primary/10 bg-white/70 focus:outline-none focus:ring-2 focus:ring-turq-primary/20 text-slate-700 font-bold" />
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Correo Electrónico</label>
                                            <input type="email" defaultValue="admin@contractoria.ai" className="w-full px-6 py-4 rounded-2xl border border-turq-primary/10 bg-white/70 focus:outline-none focus:ring-2 focus:ring-turq-primary/20 text-slate-700 font-bold" />
                                        </div>
                                    </div>
                                </>
                            )}

                            {activeTab === 'organization' && (
                                <form onSubmit={handleBrandingSubmit}>
                                    <h2 className="text-2xl font-[900] text-deep-blue mb-10 font-outfit flex items-center gap-4">
                                        <div className="p-3 bg-turq-primary/10 rounded-2xl text-turq-primary shadow-sm">
                                            <Building2 size={24} />
                                        </div>
                                        Identidad Corporativa (Branding)
                                    </h2>

                                    <div className="space-y-8 max-w-2xl">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-3">
                                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1 flex items-center gap-2">
                                                    <Palette size={12} /> Color Primario
                                                </label>
                                                <div className="flex gap-3">
                                                    <input type="color" name="primary_color" defaultValue="#06b6d4" className="w-14 h-14 rounded-xl border-none cursor-pointer" />
                                                    <input type="text" defaultValue="#06b6d4" className="flex-1 px-4 py-3 rounded-xl border border-turq-primary/10 text-sm font-bold bg-white/50" />
                                                </div>
                                            </div>

                                            <div className="space-y-3">
                                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Color Secundario</label>
                                                <div className="flex gap-3">
                                                    <input type="color" name="secondary_color" defaultValue="#1e3a8a" className="w-14 h-14 rounded-xl border-none cursor-pointer" />
                                                    <input type="text" defaultValue="#1e3a8a" className="flex-1 px-4 py-3 rounded-xl border border-turq-primary/10 text-sm font-bold bg-white/50" />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Logo URL (Secure Storage)</label>
                                            <div className="relative">
                                                <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                                <input
                                                    type="text"
                                                    name="logo_url"
                                                    placeholder="https://..."
                                                    className="w-full pl-12 pr-6 py-4 rounded-2xl border border-turq-primary/10 bg-white/70 focus:outline-none focus:ring-2 focus:ring-turq-primary/20 text-slate-700 font-bold"
                                                />
                                            </div>
                                            <p className="text-[10px] text-slate-400 font-medium pl-1 italic flex items-center gap-1">
                                                <Shield size={10} className="text-turq-primary" /> Se recomienda usar URLs firmadas de Supabase Storage.
                                            </p>
                                        </div>

                                        <div className="pt-10 flex justify-end gap-4">
                                            <button
                                                type="submit"
                                                disabled={isSaving}
                                                className="pro-button !px-10 !h-14 text-xs shadow-2xl shadow-turq-primary/20 disabled:opacity-50 flex items-center gap-2"
                                            >
                                                {isSaving && <Loader2 size={16} className="animate-spin" />}
                                                {isSaving ? "Sincronizando..." : "Aplicar Branding Global"}
                                            </button>
                                        </div>
                                    </div>
                                </form>
                            )}

                            {activeTab !== 'profile' && activeTab !== 'organization' && (
                                <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
                                    <div className="w-20 h-20 rounded-full bg-slate-50 flex items-center justify-center text-slate-300">
                                        <Settings size={40} className="animate-spin-slow" />
                                    </div>
                                    <h3 className="text-lg font-black text-slate-400 uppercase tracking-widest font-outfit">Módulo en Desarrollo</h3>
                                    <p className="text-sm text-slate-500 max-w-xs font-medium">Esta sección del Centro de Control se habilitará en la próxima fase del Sprint.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
