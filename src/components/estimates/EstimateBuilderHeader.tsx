"use client";

import { useEstimate } from "./EstimateContext";
import { Sparkles, Save, Send, ArrowLeft, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { createEstimateAction, updateEstimateAction } from "@/app/actions/estimates";

export function EstimateBuilderHeader() {
    const { estimate, company, selectedClient, builderStatus, setBuilderStatus, getEstimatePayload } = useEstimate();
    const params = useParams<{ locale: string; tenant: string }>();

    const canSave = selectedClient && (estimate.items?.length ?? 0) > 0;

    const handleSaveDraft = async () => {
        if (!canSave || !company?.id) return;

        setBuilderStatus('saving');
        try {
            const payload = getEstimatePayload();
            if (!payload) {
                setBuilderStatus('error');
                return;
            }

            const formData = new FormData();
            formData.set('client_id', payload.client_id);
            formData.set('items', JSON.stringify(payload.items));
            formData.set('tax_rate', String(payload.tax_rate));
            formData.set('notes', payload.notes);
            formData.set('deposit_type', 'NONE');
            formData.set('deposit_value', '0');

            const result = await createEstimateAction(formData, company.id);

            if (result.success) {
                setBuilderStatus('saved');
                // Reset after 3s
                setTimeout(() => setBuilderStatus('editing'), 3000);
            } else {
                console.error('Save draft error:', result.error);
                setBuilderStatus('error');
                setTimeout(() => setBuilderStatus('editing'), 3000);
            }
        } catch (err) {
            console.error('Save draft exception:', err);
            setBuilderStatus('error');
            setTimeout(() => setBuilderStatus('editing'), 3000);
        }
    };

    const handleFinalize = async () => {
        if (!canSave || !company?.id) return;

        setBuilderStatus('sending');
        try {
            const payload = getEstimatePayload();
            if (!payload) {
                setBuilderStatus('error');
                return;
            }

            // Save first as DRAFT
            const formData = new FormData();
            formData.set('client_id', payload.client_id);
            formData.set('items', JSON.stringify(payload.items));
            formData.set('tax_rate', String(payload.tax_rate));
            formData.set('notes', payload.notes);
            formData.set('deposit_type', 'NONE');
            formData.set('deposit_value', '0');

            const createResult = await createEstimateAction(formData, company.id);

            if (!createResult.success || !createResult.data) {
                console.error('Finalize create error:', createResult.error);
                setBuilderStatus('error');
                setTimeout(() => setBuilderStatus('editing'), 3000);
                return;
            }

            // Then update status to SENT
            const updateResult = await updateEstimateAction(
                createResult.data.id,
                company.id,
                { status: 'SENT' }
            );

            if (updateResult.success) {
                setBuilderStatus('sent');
            } else {
                console.error('Finalize update error:', updateResult.error);
                setBuilderStatus('error');
                setTimeout(() => setBuilderStatus('editing'), 3000);
            }
        } catch (err) {
            console.error('Finalize exception:', err);
            setBuilderStatus('error');
            setTimeout(() => setBuilderStatus('editing'), 3000);
        }
    };

    const statusBadge = () => {
        switch (builderStatus) {
            case 'saving':
                return (
                    <div className="flex items-center gap-2 px-4 py-1.5 bg-amber-50 text-amber-600 rounded-full border border-amber-100">
                        <Loader2 size={12} className="animate-spin" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Guardando...</span>
                    </div>
                );
            case 'saved':
                return (
                    <div className="flex items-center gap-2 px-4 py-1.5 bg-emerald-50 text-emerald-600 rounded-full border border-emerald-100">
                        <CheckCircle2 size={12} />
                        <span className="text-[10px] font-black uppercase tracking-widest">Borrador Guardado</span>
                    </div>
                );
            case 'sending':
                return (
                    <div className="flex items-center gap-2 px-4 py-1.5 bg-blue-50 text-blue-600 rounded-full border border-blue-100">
                        <Loader2 size={12} className="animate-spin" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Enviando...</span>
                    </div>
                );
            case 'sent':
                return (
                    <div className="flex items-center gap-2 px-4 py-1.5 bg-turq-primary/10 text-turq-primary rounded-full border border-turq-primary/20">
                        <CheckCircle2 size={12} />
                        <span className="text-[10px] font-black uppercase tracking-widest">Enviado ✓</span>
                    </div>
                );
            case 'error':
                return (
                    <div className="flex items-center gap-2 px-4 py-1.5 bg-rose-50 text-rose-600 rounded-full border border-rose-100">
                        <AlertCircle size={12} />
                        <span className="text-[10px] font-black uppercase tracking-widest">Error</span>
                    </div>
                );
            default:
                return (
                    <div className="flex items-center gap-2 px-4 py-1.5 bg-emerald-50 text-emerald-600 rounded-full border border-emerald-100">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Live Syncing</span>
                    </div>
                );
        }
    };

    const isDisabled = builderStatus === 'saving' || builderStatus === 'sending' || builderStatus === 'sent';

    return (
        <header className="h-20 border-b border-primary/10 bg-white flex items-center justify-between px-8 z-10 shadow-sm relative">
            <div className="flex items-center gap-4">
                <Link href={`/${params.locale}/${params.tenant}/estimates`} className="pro-button !p-2 !bg-transparent !text-slate-400 hover:!text-turq-primary">
                    <ArrowLeft size={20} />
                </Link>
                <div className="bg-turq-primary p-2.5 rounded-xl shadow-lg shadow-turq-primary/30">
                    <Sparkles className="text-deep-blue" size={24} />
                </div>
                <div>
                    <h1 className="text-xl font-[900] text-deep-blue tracking-tight font-outfit">
                        Neural <span className="text-turq-primary">Builder</span>
                    </h1>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">AI-Powered Estimator</p>
                </div>
            </div>

            <div className="flex items-center gap-4">
                {statusBadge()}

                <button
                    onClick={handleSaveDraft}
                    disabled={!canSave || isDisabled}
                    className="px-5 py-2.5 border border-slate-200 rounded-xl text-slate-500 font-bold text-sm hover:bg-slate-50 hover:text-deep-blue transition-colors flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent"
                >
                    {builderStatus === 'saving' ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                    Guardar Borrador
                </button>

                <button
                    onClick={handleFinalize}
                    disabled={!canSave || isDisabled}
                    className="pro-button shadow-xl shadow-turq-primary/20 !py-2.5 !px-6 text-sm flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                    {builderStatus === 'sending' ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                    Finalizar y Enviar
                </button>
            </div>
        </header>
    );
}
