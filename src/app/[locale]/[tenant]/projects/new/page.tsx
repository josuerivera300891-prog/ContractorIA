"use client";

import { use, useState, useEffect } from "react";
import { Plus, Briefcase, Calendar, MapPin, Users, FileText, CheckCircle2, ChevronRight, Loader2 } from "lucide-react";
import { createProjectAction } from "@/app/actions/projects";
import { createClient as createSupabaseClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function NewProjectPage({ params }: { params: Promise<{ tenant: string; locale: string }> }) {
    const { tenant, locale } = use(params);
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [clients, setClients] = useState<any[]>([]);
    const [companyId, setCompanyId] = useState<string>("");
    const supabase = createSupabaseClient();

    useEffect(() => {
        const fetchData = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;
            const { data: profile } = await supabase.from('profiles').select('company_id').eq('id', user.id).single();
            if (!profile) return;
            setCompanyId(profile.company_id);

            const { data: clientData } = await supabase.from('clients').select('id, first_name, last_name, company_name').eq('company_id', profile.company_id);
            setClients(clientData || []);
        };
        fetchData();
    }, [tenant]);

    async function handleSubmit(formData: FormData) {
        setIsSubmitting(true);
        try {
            const result = await createProjectAction(formData, companyId);
            if (result.success) {
                router.push(`/${locale}/${tenant}/projects`);
            } else {
                alert("Error: " + result.error);
            }
        } catch (error) {
            console.error(error);
            alert("Unexpected error occurred");
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div className="max-w-4xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-4xl font-[900] text-deep-blue tracking-tight mb-2 font-outfit">
                        Nuevo <span className="text-turq-primary">Proyecto</span>
                    </h1>
                    <p className="text-slate-500 font-medium font-inter">Configura los detalles operativos de tu nueva obra.</p>
                </div>
            </div>

            <form action={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2 space-y-6">
                    <div className="pro-card p-8 space-y-8">
                        {/* Section: Basic Info */}
                        <div className="space-y-6">
                            <h3 className="text-sm font-black text-deep-blue uppercase tracking-widest flex items-center gap-2">
                                <Briefcase size={16} className="text-turq-primary" />
                                Información General
                            </h3>

                            <div className="grid grid-cols-1 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Nombre del Proyecto</label>
                                    <input
                                        name="name"
                                        required
                                        placeholder="Ej. Remodelación Residencia Smith"
                                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-sm font-bold text-deep-blue focus:outline-none focus:ring-4 focus:ring-turq-primary/10 transition-all placeholder:text-slate-300"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Descripción</label>
                                    <textarea
                                        name="description"
                                        rows={4}
                                        placeholder="Describe el alcance del proyecto..."
                                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-sm font-bold text-deep-blue focus:outline-none focus:ring-4 focus:ring-turq-primary/10 transition-all placeholder:text-slate-300"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Section: Client & Timeline */}
                        <div className="pt-8 border-t border-slate-50 grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Asignar Cliente</label>
                                <div className="relative group">
                                    <Users className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-turq-primary transition-colors" size={18} />
                                    <select
                                        name="client_id"
                                        required
                                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-12 pr-5 py-4 text-sm font-bold text-deep-blue focus:outline-none focus:ring-4 focus:ring-turq-primary/10 transition-all appearance-none"
                                    >
                                        <option value="">Seleccionar cliente...</option>
                                        {clients.map(c => (
                                            <option key={c.id} value={c.id}>{c.first_name} {c.last_name} {c.company_name ? `(${c.company_name})` : ''}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Fecha Estimada de Inicio</label>
                                <div className="relative group">
                                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-turq-primary transition-colors" size={18} />
                                    <input
                                        type="date"
                                        name="start_date"
                                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-12 pr-5 py-4 text-sm font-bold text-deep-blue focus:outline-none focus:ring-4 focus:ring-turq-primary/10 transition-all"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Section: Location */}
                        <div className="pt-8 border-t border-slate-50 space-y-6">
                            <h3 className="text-sm font-black text-deep-blue uppercase tracking-widest flex items-center gap-2">
                                <MapPin size={16} className="text-turq-primary" />
                                Ubicación de la Obra
                            </h3>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Dirección del Proyecto</label>
                                <input
                                    name="address"
                                    placeholder="Calle, Número, Colonia, Ciudad..."
                                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-sm font-bold text-deep-blue focus:outline-none focus:ring-4 focus:ring-turq-primary/10 transition-all placeholder:text-slate-300"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar Info */}
                <div className="space-y-6">
                    <div className="pro-card bg-deep-blue p-8 text-white relative overflow-hidden rounded-[2.5rem]">
                        <div className="relative z-10 space-y-6">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-turq-primary">
                                    <CheckCircle2 size={24} />
                                </div>
                                <h4 className="font-bold text-lg font-outfit">Paso 1 de 2</h4>
                            </div>
                            <p className="text-blue-100/60 text-sm font-medium">Después de crear el proyecto, podrás definir hitos y tareas operativas.</p>

                            <hr className="border-white/10" />

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full pro-button shadow-2xl shadow-turq-primary/20 !py-4 flex items-center justify-center gap-3 group"
                            >
                                {isSubmitting ? <Loader2 size={18} className="animate-spin text-deep-blue" /> : <Plus size={18} className="text-deep-blue" />}
                                <span className="text-deep-blue">Crear Proyecto</span>
                                <ChevronRight size={16} className="text-deep-blue group-hover:translate-x-1 transition-transform" />
                            </button>

                            <button
                                type="button"
                                onClick={() => router.back()}
                                className="w-full py-4 text-xs font-black uppercase tracking-widest text-blue-200/50 hover:text-white transition-colors"
                            >
                                Cancelar
                            </button>
                        </div>
                        <div className="absolute bottom-0 right-0 -mb-12 -mr-12 w-48 h-48 bg-turq-primary opacity-10 rounded-full blur-[80px]" />
                    </div>

                    <div className="pro-card p-6 border-turq-primary/10 rounded-[2rem] bg-slate-50/50">
                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                            Consejo del Sistema
                        </h4>
                        <p className="text-xs text-slate-500 font-medium leading-relaxed italic">
                            &quot;Vincular un cliente al proyecto te permitirá generar reportes de rentabilidad automáticos y centralizar el historial de cobros.&quot;
                        </p>
                    </div>
                </div>
            </form>
        </div>
    );
}
