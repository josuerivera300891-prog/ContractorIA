import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import { SigningForm } from '@/components/SigningForm';
import { DownloadPDF } from '@/components/DownloadPDF';
import { FileText, MapPin, Calendar, Building2, ShieldCheck, Download, CheckCircle2 } from 'lucide-react';
import React from 'react';

export default async function SignPage({ params }: { params: Promise<{ id: string; locale: string }> }) {
    const { id, locale } = await params;
    const supabase = await createClient();

    // Fetch estimate with items and company branding
    const { data: estimate, error } = await supabase
        .from('estimates')
        .select(`
            *,
            companies (
                name,
                logo_url,
                primary_color,
                secondary_color,
                accent_color,
                default_terms
            )
        `)
        .eq('id', id)
        .single();

    if (error || !estimate) {
        return notFound();
    }

    const company = estimate.companies;
    const isSigned = estimate.status === 'SIGNED';

    return (
        <div
            className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8 font-inter"
            style={{
                '--primary': company.primary_color || '#06b6d4',
                '--secondary': company.secondary_color || '#1e3a8a',
            } as React.CSSProperties}
        >
            <div className="max-w-4xl mx-auto" id="printable-document">
                {/* Header / Branding */}
                <div className="bg-white rounded-[2.5rem] p-10 shadow-xl shadow-slate-200/50 mb-10 flex flex-col md:flex-row justify-between items-center gap-8 border border-white">
                    <div className="flex items-center gap-6">
                        {company.logo_url ? (
                            <img src={company.logo_url} alt={company.name} className="h-16 w-auto object-contain" />
                        ) : (
                            <div className="h-16 w-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary font-black text-2xl">
                                {company.name.substring(0, 1)}
                            </div>
                        )}
                        <div>
                            <h2 className="text-xl font-black text-secondary tracking-tight">{company.name}</h2>
                            <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">Documento Oficial</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <span className={`px-6 py-2 rounded-full text-[10px] font-black tracking-widest uppercase ${isSigned ? 'bg-emerald-100 text-emerald-600' : 'bg-primary/10 text-primary'
                            }`}>
                            {isSigned ? 'Firmado Legamente' : 'Pendiente de Firma'}
                        </span>
                        <div className="mt-2 text-slate-400 font-medium text-sm flex items-center justify-end gap-2">
                            <Calendar size={14} /> Issued: {new Date(estimate.date_issued).toLocaleDateString()}
                        </div>
                    </div>
                </div>

                {/* Estimate Body */}
                <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 overflow-hidden border border-white">
                    <div className="p-10 border-b border-slate-50">
                        <div className="flex justify-between items-start mb-10">
                            <div>
                                <h1 className="text-4xl font-black text-secondary mb-2 tracking-tighter">PRESUPUESTO <span className="text-primary">#{estimate.estimate_number || '---'}</span></h1>
                                <p className="text-slate-400 font-medium max-w-md">{estimate.scope_summary || 'Resumen de servicios profesionales.'}</p>
                            </div>
                            <div className="p-4 bg-slate-50 rounded-3xl border border-slate-100">
                                <FileText className="text-secondary opacity-20" size={40} />
                            </div>
                        </div>

                        {/* Items Table */}
                        <div className="space-y-4">
                            <div className="grid grid-cols-12 gap-4 px-4 py-3 bg-slate-50 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-400">
                                <div className="col-span-6">Descripción</div>
                                <div className="col-span-2 text-center">Cant</div>
                                <div className="col-span-2 text-right">Precio</div>
                                <div className="col-span-2 text-right">Total</div>
                            </div>
                            {(estimate.items || []).map((item: any, idx: number) => (
                                <div key={idx} className="grid grid-cols-12 gap-4 px-4 py-4 items-center border-b border-slate-50 last:border-none">
                                    <div className="col-span-6 font-bold text-secondary text-sm">{item.description}</div>
                                    <div className="col-span-2 text-center text-slate-500 font-medium text-sm">{item.quantity}</div>
                                    <div className="col-span-2 text-right text-slate-500 font-medium text-sm">${Number(item.unit_price).toFixed(2)}</div>
                                    <div className="col-span-2 text-right font-black text-secondary text-sm">${Number(item.total).toFixed(2)}</div>
                                </div>
                            ))}
                        </div>

                        {/* Totals */}
                        <div className="mt-10 flex flex-col items-end space-y-3">
                            <div className="flex justify-between w-64 text-sm text-slate-500 font-medium">
                                <span>Subtotal</span>
                                <span>${Number(estimate.subtotal).toFixed(2)}</span>
                            </div>
                            {estimate.tax_enabled && (
                                <div className="flex justify-between w-64 text-sm text-slate-500 font-medium">
                                    <span>Impuestos ({estimate.tax_rate}%)</span>
                                    <span>${Number(estimate.tax_amount).toFixed(2)}</span>
                                </div>
                            )}
                            <div className="flex justify-between w-64 pt-3 border-t border-slate-100">
                                <span className="font-black text-secondary uppercase tracking-widest text-xs">Total</span>
                                <span className="text-2xl font-black text-primary">${Number(estimate.total).toFixed(2)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Terms & Signing */}
                    <div className="bg-slate-50/50 p-10">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                            <div className="space-y-6">
                                <h3 className="text-sm font-black text-secondary uppercase tracking-widest flex items-center gap-2">
                                    <ShieldCheck size={16} className="text-primary" /> Términos y Condiciones
                                </h3>
                                <div className="text-xs text-slate-500 leading-relaxed font-medium bg-white/50 p-6 rounded-3xl border border-slate-100">
                                    {estimate.terms_text || company.default_terms || 'Sin términos específicos para este documento.'}
                                </div>
                            </div>

                            <div className="space-y-6">
                                {isSigned ? (
                                    <div className="bg-emerald-50 rounded-[2.5rem] p-10 border border-emerald-100 text-center space-y-4">
                                        <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center text-white mx-auto shadow-lg shadow-emerald-200">
                                            <CheckCircle2 size={40} />
                                        </div>
                                        <h3 className="text-xl font-black text-emerald-700">Documento Firmado</h3>
                                        <p className="text-sm text-emerald-600/70 font-medium">Este acuerdo es legalmente vinculante. Los términos ya no pueden ser modificados.</p>
                                        <DownloadPDF
                                            elementId="printable-document"
                                            filename={`Presupuesto-${estimate.estimate_number}`}
                                            label="Descargar Copia PDF"
                                        />
                                    </div>
                                ) : (
                                    <SigningForm estimateId={id} />
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-10 text-center text-slate-300 text-[10px] font-medium uppercase tracking-[0.2em]">
                    Powered by ContractorIA &bull; Secure Digital Signature Portal
                </div>
            </div>
        </div>
    );
}
