"use client";

import React, { useState } from 'react';
import { SignaturePad } from '@/components/SignaturePad';
import { signEstimateAction } from '@/app/actions/signatures';
import { uploadDocumentAction } from '@/app/actions/storage';
import { generatePDF } from '@/lib/pdf-generator';
import { Loader2, CheckCircle2 } from 'lucide-react';

export function SigningForm({ estimateId }: { estimateId: string }) {
    const [isSaving, setIsSaving] = useState(false);
    const [signature, setSignature] = useState("");

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!signature) {
            alert("Por favor, estampe su firma antes de continuar.");
            return;
        }

        setIsSaving(true);
        const formData = new FormData(e.currentTarget);
        formData.append('signature_data', signature);

        const result = await signEstimateAction(formData);

        if (result.success) {
            // New: Automatic PDF Backup
            try {
                const pdfBase64 = await generatePDF('printable-document', ''); // No filename = no download
                if (pdfBase64) {
                    await uploadDocumentAction(
                        pdfBase64,
                        'estimates',
                        `Presupuesto-${estimateId}`,
                        estimateId
                    );
                }
            } catch (err) {
                console.error("Backup automatico fallido:", err);
            }

            window.location.reload(); // Refresh to show signed state
        } else {
            alert("Error: " + result.error);
        }
        setIsSaving(false);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <input type="hidden" name="estimate_id" value={estimateId} />

            <div className="space-y-4">
                <h3 className="text-sm font-black text-secondary uppercase tracking-widest">Firme Aquí</h3>
                <SignaturePad
                    onSave={(data) => setSignature(data)}
                    onClear={() => setSignature("")}
                />
            </div>

            <div className="space-y-4 pt-4">
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Nombre Completo del Firmante</label>
                    <input
                        type="text"
                        name="signer_name"
                        required
                        className="w-full px-6 py-4 rounded-2xl border border-slate-100 bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 text-slate-700 font-bold"
                        placeholder="Ej. Jane Doe"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Correo Electrónico de Confirmación</label>
                    <input
                        type="email"
                        name="signer_email"
                        required
                        className="w-full px-6 py-4 rounded-2xl border border-slate-100 bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 text-slate-700 font-bold"
                        placeholder="jane@ejemplo.com"
                    />
                </div>
            </div>

            <button
                type="submit"
                disabled={isSaving}
                className="w-full py-5 rounded-[2rem] bg-secondary text-white font-black uppercase tracking-[0.2em] text-xs hover:bg-primary transition-all shadow-xl shadow-secondary/10 disabled:opacity-50 flex items-center justify-center gap-2"
            >
                {isSaving && <Loader2 size={16} className="animate-spin" />}
                {isSaving ? "Sellando Documento..." : "Aceptar y Firmar Digitalmente"}
            </button>
            <p className="text-[9px] text-slate-400 text-center font-medium px-6">
                Al hacer clic, usted acepta que esta firma digital es tan válida como una firma física bajo las leyes locales e internacionales de comercio electrónico.
            </p>
        </form>
    );
}
