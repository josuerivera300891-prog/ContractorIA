"use client";

import { use, useEffect, useState } from "react";
import { FileText, Plus, Search, Filter, Mail, Receipt, ExternalLink, MoreVertical, Loader2, CheckCircle2, Sparkles, Trash2, Save } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { convertEstimateToInvoiceAction } from "@/app/actions/invoices";
import { sendEstimateEmailAction } from "@/app/actions/email-actions";
import { createEstimateAction } from "@/app/actions/estimates";
import { OCRUpload } from "@/components/OCRUpload";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useCallback } from "react";

interface Estimate {
    id: string;
    company_id: string;
    client_id: string;
    project_id?: string;
    total_amount: number;
    status: string;
    created_at: string;
    client_name?: string;
    estimate_number?: string;
    version?: number;
    total?: number;
}

interface Client {
    id: string;
    first_name: string;
    last_name: string;
    company_name?: string;
}

export default function EstimatesPage({ params }: { params: Promise<{ tenant: string; locale: string }> }) {
    const { tenant, locale } = use(params);
    const [estimates, setEstimates] = useState<Estimate[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [processingId, setProcessingId] = useState<string | null>(null);
    const [extractedItems, setExtractedItems] = useState<any[] | null>(null);
    const [clients, setClients] = useState<Client[]>([]);
    const [selectedClientId, setSelectedClientId] = useState<string>("");
    const [companyId, setCompanyId] = useState<string>("");
    const supabase = createClient();

    const fetchEstimates = useCallback(async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;
        const { data: profile } = await supabase.from('profiles').select('company_id').eq('id', user.id).single();
        if (!profile) return;

        setCompanyId(profile.company_id);

        const { data: estData } = await supabase.from('estimates').select('*').eq('company_id', profile.company_id).order('created_at', { ascending: false });
        setEstimates(estData || []);

        const { data: clientData } = await supabase.from('clients').select('id, first_name, last_name, company_name').eq('company_id', profile.company_id);
        const mappedClients: Client[] = (clientData || []).map((c: any) => ({
            id: c.id,
            first_name: c.first_name,
            last_name: c.last_name,
            company_name: c.company_name
        }));
        setClients(mappedClients);
        if (mappedClients.length > 0) setSelectedClientId(mappedClients[0].id);

        setIsLoading(false);
    }, [supabase, tenant]);

    useEffect(() => {
        fetchEstimates();
    }, [fetchEstimates]);

    const handleSendEmail = async (id: string) => {
        const email = window.prompt("Ingrese el correo del cliente:");
        if (!email) return;
        setProcessingId(id);
        const result = await sendEstimateEmailAction(id, email);
        setProcessingId(null);
        if (result.success) alert("¡Correo enviado con éxito!");
        else alert("Error: " + result.error);
    };

    const handleConvertToInvoice = async (id: string) => {
        if (!window.confirm("¿Desea generar una factura a partir de este presupuesto firmado?")) return;
        setProcessingId(id);
        const result = await convertEstimateToInvoiceAction(id);
        setProcessingId(null);
        if (result.success) {
            alert("¡Factura generada con éxito!");
            fetchEstimates();
        } else alert("Error: " + result.error);
    };

    const handleSaveOCRDraft = async () => {
        if (!selectedClientId) {
            alert("Por favor, seleccione un cliente para el presupuesto.");
            return;
        }
        if (!extractedItems || extractedItems.length === 0) return;

        setIsLoading(true);
        const formData = new FormData();
        formData.append('client_id', selectedClientId);
        formData.append('items', JSON.stringify(extractedItems));
        formData.append('tax_rate', '0');
        formData.append('notes', 'Generado automáticamente vía OCR AI.');

        const result = await createEstimateAction(formData, companyId);
        setIsLoading(false);

        if (result.success) {
            setExtractedItems(null);
            fetchEstimates();
        } else {
            alert("Error al guardar: " + result.error);
        }
    };

    return (
        <div className="space-y-10">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-4xl font-[900] text-deep-blue tracking-tight mb-2 font-outfit">
                        Neural <span className="text-turq-primary">Estimates</span>
                    </h1>
                    <p className="text-slate-500 font-medium font-inter">Gestión inteligente para <span className="text-deep-blue font-bold">{tenant}</span></p>
                </div>
                <div className="flex gap-4 items-center">
                    <OCRUpload onItemsExtracted={(items) => setExtractedItems(items)} />
                    <Link href={`/${locale}/${tenant}/estimates/new`}>
                        <button className="pro-button shadow-xl shadow-turq-primary/20 group !py-3 !px-6 text-sm">
                            <Plus size={18} className="group-hover:rotate-90 transition-transform" /> Crear Presupuesto
                        </button>
                    </Link>
                </div>
            </div>

            <AnimatePresence>
                {extractedItems && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden mb-10"
                    >
                        <div className="pro-card bg-deep-blue text-white p-8 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-8 opacity-10">
                                <Sparkles size={120} />
                            </div>

                            <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                                <div>
                                    <h3 className="text-2xl font-[900] mb-2 flex items-center gap-3">
                                        <Sparkles className="text-turq-primary" size={24} />
                                        Revisión de Materiales (IA)
                                    </h3>
                                    <p className="text-white/60 text-sm font-medium">Gemini ha extraído {extractedItems.length} materiales. Valídalos y asígnalos a un cliente.</p>
                                </div>
                                <div className="flex flex-col gap-2 w-full md:w-auto">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-white/40">Asignar a Cliente</label>
                                    <select
                                        className="bg-white/10 border border-white/20 rounded-xl px-4 py-2 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-turq-primary"
                                        value={selectedClientId}
                                        onChange={(e) => setSelectedClientId(e.target.value)}
                                    >
                                        <option value="" className="text-black">Seleccionar cliente...</option>
                                        {clients.map(c => (
                                            <option key={c.id} value={c.id} className="text-black">
                                                {c.first_name} {c.last_name} {c.company_name ? `(${c.company_name})` : ''}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="mt-8 overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="text-left border-b border-white/10">
                                            <th className="pb-4 text-[10px] font-black uppercase tracking-widest text-white/40">Descripción</th>
                                            <th className="pb-4 text-[10px] font-black uppercase tracking-widest text-white/40 text-center">Cantidad</th>
                                            <th className="pb-4 text-[10px] font-black uppercase tracking-widest text-white/40 text-right pr-4">Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5">
                                        {extractedItems.map((item, idx) => (
                                            <tr key={idx}>
                                                <td className="py-4 text-sm font-bold">{item.description}</td>
                                                <td className="py-4 text-sm font-black text-center">{item.quantity}</td>
                                                <td className="py-4 text-right pr-4">
                                                    <button
                                                        onClick={() => setExtractedItems(prev => prev?.filter((_, i) => i !== idx) || null)}
                                                        className="p-2 text-white/40 hover:text-red-400 transition-colors"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            <div className="mt-8 flex justify-end gap-4">
                                <button
                                    onClick={() => setExtractedItems(null)}
                                    className="px-6 py-3 rounded-2xl bg-white/5 text-white font-black uppercase tracking-widest text-[10px] hover:bg-white/10 transition-all"
                                >
                                    Descartar
                                </button>
                                <button
                                    onClick={handleSaveOCRDraft}
                                    className="px-6 py-3 rounded-2xl bg-turq-primary text-deep-blue font-black uppercase tracking-widest text-[10px] hover:scale-105 transition-all flex items-center gap-2"
                                >
                                    <Save size={14} /> Crear Borrador (Draft)
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="pro-card bg-white/60 p-8 min-h-[500px] relative overflow-hidden group">
                <div className="absolute -top-24 -right-24 w-96 h-96 bg-turq-primary/5 rounded-full blur-[100px]"></div>

                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10 relative z-10 font-outfit">
                    <h2 className="text-xl font-[900] text-deep-blue flex items-center gap-3">
                        <FileText className="text-turq-primary" size={24} /> Historial de Negocios
                    </h2>
                    <div className="flex gap-3 w-full md:w-auto font-inter">
                        <div className="relative flex-1 md:w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                            <input type="text" placeholder="Buscar folio..." className="w-full pl-10 pr-4 py-2 rounded-xl border border-turq-primary/10 bg-white/5 text-sm font-medium" />
                        </div>
                    </div>
                </div>

                {isLoading ? (
                    <div className="flex justify-center py-20"><Loader2 className="animate-spin text-turq-primary" size={40} /></div>
                ) : estimates.length > 0 ? (
                    <div className="relative z-10 overflow-x-auto font-inter">
                        <table className="w-full">
                            <thead>
                                <tr className="text-left border-b border-slate-50">
                                    <th className="pb-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Folio</th>
                                    <th className="pb-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Estado</th>
                                    <th className="pb-4 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Total</th>
                                    <th className="pb-4 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {estimates.map((est) => (
                                    <tr key={est.id} className="group/row hover:bg-turq-primary/[0.02] transition-colors">
                                        <td className="py-5">
                                            <div className="flex flex-col">
                                                <span className="font-bold text-deep-blue text-sm">#{est.estimate_number}</span>
                                                <span className="text-[10px] text-slate-400 font-medium">V.{est.version}</span>
                                            </div>
                                        </td>
                                        <td className="py-5">
                                            <span className={`px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest uppercase ${est.status === 'SIGNED' ? 'bg-emerald-100 text-emerald-600' : 'bg-turq-primary/10 text-turq-primary'
                                                }`}>
                                                {est.status}
                                            </span>
                                        </td>
                                        <td className="py-5 text-right font-black text-deep-blue text-sm">${Number(est.total).toFixed(2)}</td>
                                        <td className="py-5 text-right">
                                            <div className="flex justify-end gap-2">
                                                {est.status === 'SIGNED' && (
                                                    <button
                                                        onClick={() => handleConvertToInvoice(est.id)}
                                                        disabled={processingId === est.id}
                                                        className="p-2 rounded-lg bg-emerald-50 text-emerald-500 hover:bg-emerald-500 hover:text-white transition-all border border-emerald-100"
                                                        title="Convertir a Factura"
                                                    >
                                                        {processingId === est.id ? <Loader2 size={16} className="animate-spin" /> : <Receipt size={16} />}
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => handleSendEmail(est.id)}
                                                    disabled={processingId === est.id}
                                                    className="p-2 rounded-lg bg-turq-primary/5 text-turq-primary hover:bg-turq-primary hover:text-white transition-all border border-turq-primary/10"
                                                    title="Enviar por Correo"
                                                >
                                                    {processingId === est.id ? <Loader2 size={16} className="animate-spin" /> : <Mail size={16} />}
                                                </button>
                                                <Link
                                                    href={`/${locale}/sign/${est.id}`}
                                                    target="_blank"
                                                    className="p-2 rounded-lg bg-white border border-slate-100 text-slate-400 hover:text-deep-blue"
                                                >
                                                    <ExternalLink size={16} />
                                                </Link>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="py-20 text-center">
                        <FileText size={48} className="mx-auto text-slate-100 mb-4" />
                        <p className="text-slate-400 font-medium">No hay presupuestos disponibles.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
