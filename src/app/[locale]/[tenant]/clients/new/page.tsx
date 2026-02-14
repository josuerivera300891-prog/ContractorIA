"use client";

import { useState } from "react";
import { User, Mail, Phone, MapPin, Building, Save, ArrowLeft, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { createClientAction } from "@/app/actions/clients";
import Link from "next/link";
import { use } from "react";

// This is a Client Component because we need interactivity (form submission)
// We will receive companyId via props or fetch it.
// To simplify, let's fetch profile first in useEffect or just render this inside page.tsx (server component)

export default function NewClientPage({ params }: { params: Promise<{ tenant: string; locale: string }> }) {
    const { tenant, locale } = use(params);
    return <NewClientForm tenant={tenant} locale={locale} />;
}

function NewClientForm({ tenant, locale }: { tenant: string, locale: string }) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);
        const formData = new FormData(e.currentTarget);

        // We need to fetch the companyId on the server side or pass it. 
        // The safest way is to let the server action handle it by looking up the user's profile.
        // I will modify `createClientAction` to fetch companyId if not provided, OR
        // fetch it here.

        // Let's assume createClientAction is smart enough or we fetch it first.
        // Actually, looking at `estimates/page.tsx`, it does:
        // const { data: profile } = await supabase.from('profiles').select('company_id').eq('id', user.id).single();

        // Let's fetch it here for now to be safe.
        // In a real app we'd use a context or server component prop.
        // To keep this file clean, I'll fetch it inside the action or pass a dummy one if the action supports it.
        // Let's check `actions/clients.ts` again. It takes `companyId` as 2nd arg.

        // I'll make a wrapper action or just fetch it here.
        // Let's create a server wrapper in this file? No, client components can't have server actions inline easily without "use server".

        // Let's rely on a new server action wrapper that doesn't need ID, OR fetch it.
        // I'll update `createClientAction` to be smarter in the next step.
        // For now, I'll pass a placeholder and fix the action.

        const companyId = "fetch_from_server"; // Placeholder

        const result = await createClientAction(formData, companyId);

        if (result.success) {
            router.push(`/${locale}/${tenant}/clients`);
            router.refresh();
        } else {
            alert("Error creating client: " + result.error);
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto space-y-8 font-outfit pb-20">
            <div className="flex items-center gap-4">
                <Link href={`/${locale}/${tenant}/clients`} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                    <ArrowLeft size={24} className="text-slate-400" />
                </Link>
                <div>
                    <h1 className="text-3xl font-[900] text-deep-blue">Nuevo Cliente</h1>
                    <p className="text-slate-500 font-medium font-inter">Registra un nuevo contacto para tu cartera.</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="pro-card bg-white p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-widest text-slate-400">Nombre</label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                            <input name="firstName" required type="text" className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-turq-primary/20 font-bold text-deep-blue" placeholder="Ej. Juan" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-widest text-slate-400">Apellido</label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                            <input name="lastName" type="text" className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-turq-primary/20 font-bold text-deep-blue" placeholder="Ej. Pérez" />
                        </div>
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-slate-400">Empresa (Opcional)</label>
                    <div className="relative">
                        <Building className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input name="companyName" type="text" className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-turq-primary/20 font-medium text-deep-blue" placeholder="Ej. Constructora S.A." />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-widest text-slate-400">Email</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                            <input name="email" required type="email" className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-turq-primary/20 font-medium text-deep-blue" placeholder="cliente@email.com" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-widest text-slate-400">Teléfono</label>
                        <div className="relative">
                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                            <input name="phone" type="tel" className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-turq-primary/20 font-medium text-deep-blue" placeholder="+1 (555) 000-0000" />
                        </div>
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-slate-400">Dirección</label>
                    <div className="relative">
                        <MapPin className="absolute left-3 top-3 text-slate-400" size={16} />
                        <textarea name="address" rows={3} className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-turq-primary/20 font-medium text-deep-blue resize-none" placeholder="Dirección completa..." />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-slate-400">Notas Internas</label>
                    <textarea name="notes" rows={3} className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-turq-primary/20 font-medium text-deep-blue resize-none" placeholder="Detalles relevantes..." />
                </div>

                <div className="pt-4 flex justify-end gap-4">
                    <Link href={`/${locale}/${tenant}/clients`} className="px-6 py-3 rounded-xl text-slate-500 font-bold hover:bg-slate-50 transition-colors">
                        Cancelar
                    </Link>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="pro-button shadow-xl shadow-turq-primary/20 flex items-center gap-2"
                    >
                        {isSubmitting ? <Loader2 size={20} className="animate-spin" /> : <Save size={20} />}
                        Guardar Cliente
                    </button>
                </div>
            </form>
        </div>
    );
}
