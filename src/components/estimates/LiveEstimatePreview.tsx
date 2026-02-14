"use client";

import { useEstimate } from "./EstimateContext";
import { Estimate, LineItem } from "@/types/domain";
import { MoreHorizontal, ZoomIn, ZoomOut, Printer, Download, Eye } from "lucide-react";

export function LiveEstimatePreview() {
    const { estimate, company } = useEstimate();

    return (
        <section className="flex-1 bg-slate-100 overflow-y-auto p-12 custom-scrollbar font-inter flex flex-col items-center">
            {/* Toolbar */}
            <div className="w-full max-w-4xl mb-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="flex bg-white rounded-lg border border-slate-200 p-1 shadow-sm">
                        <button className="px-4 py-1.5 text-xs font-bold bg-deep-blue text-white rounded shadow-sm">Vista Previa</button>
                        <button className="px-4 py-1.5 text-xs font-bold text-slate-500 hover:text-deep-blue hover:bg-slate-50 rounded transition-colors">Editor Manual</button>
                    </div>
                    <span className="text-slate-300 text-sm">|</span>
                    <div className="flex items-center gap-2 text-slate-500 text-xs font-bold uppercase tracking-wider">
                        <Eye size={16} /> PDF View
                    </div>
                </div>
                <div className="flex items-center gap-2 bg-white rounded-lg border border-slate-200 p-1 shadow-sm">
                    <button className="p-2 text-slate-400 hover:text-deep-blue hover:bg-slate-50 rounded transition-colors"><ZoomOut size={16} /></button>
                    <span className="text-xs font-bold text-slate-600 w-12 text-center">100%</span>
                    <button className="p-2 text-slate-400 hover:text-deep-blue hover:bg-slate-50 rounded transition-colors"><ZoomIn size={16} /></button>
                </div>
            </div>

            {/* Paper */}
            <div className="w-full max-w-4xl bg-white min-h-[11in] rounded-sm shadow-2xl p-16 relative">
                {/* Header */}
                <div className="flex justify-between items-start mb-16">
                    <div className="flex gap-6">
                        {company?.logo_url ? (
                            <img src={company.logo_url} alt={company.name} className="w-20 h-20 object-contain rounded-xl" />
                        ) : (
                            <div className="w-20 h-20 bg-deep-blue text-white rounded-2xl flex items-center justify-center text-3xl font-black">
                                {company?.name?.charAt(0) || 'C'}
                            </div>
                        )}
                        <div>
                            <h3 className="font-[900] text-xl text-deep-blue uppercase tracking-tight">
                                {company?.name || 'Contractor IA'}
                            </h3>
                            <p className="text-xs text-slate-500 font-medium mt-1">
                                {company?.settings?.address || 'Dirección de la empresa'}<br />
                                {company?.settings?.address?.includes('Monterrey') ? '' : ''}
                            </p>
                        </div>
                    </div>
                    <div className="text-right space-y-1">
                        <h2 className="text-4xl font-[200] text-slate-300 uppercase tracking-[0.2em]">Estimate</h2>
                        <p className="text-sm font-bold text-deep-blue">#{estimate.number}</p>
                        <p className="text-xs text-slate-400 font-medium">Fecha: {new Date().toLocaleDateString()}</p>
                    </div>
                </div>

                {/* Client Info */}
                <div className="grid grid-cols-2 gap-12 mb-16 pb-8 border-b border-slate-100">
                    <div>
                        <span className="text-[10px] uppercase font-black text-slate-300 tracking-widest block mb-3">Presupuesto Para</span>
                        {estimate.client_id ? (
                            <div>
                                <h4 className="font-bold text-deep-blue text-lg">Cliente Seleccionado</h4>
                                <p className="text-sm text-slate-500 font-medium mt-1">Dirección del cliente...</p>
                            </div>
                        ) : (
                            <div className="p-4 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50 text-center">
                                <p className="text-xs font-bold text-slate-400">Sin Cliente Asignado</p>
                            </div>
                        )}
                    </div>
                    <div className="text-right">
                        <span className="text-[10px] uppercase font-black text-slate-300 tracking-widest block mb-3">Proyecto</span>
                        <h4 className="font-bold text-deep-blue text-lg">Nueva Cotización</h4>
                        <p className="text-sm text-slate-500 font-medium mt-1">V.{estimate.version || 1}</p>
                    </div>
                </div>

                {/* Items Table */}
                <div className="mb-12">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b-2 border-slate-100">
                                <th className="py-4 text-[10px] uppercase font-black text-slate-300 tracking-widest w-1/2">Descripción / Servicio</th>
                                <th className="py-4 text-[10px] uppercase font-black text-slate-300 tracking-widest text-center">Unidad</th>
                                <th className="py-4 text-[10px] uppercase font-black text-slate-300 tracking-widest text-center">Cant.</th>
                                <th className="py-4 text-[10px] uppercase font-black text-slate-300 tracking-widest text-right">Precio Unit.</th>
                                <th className="py-4 text-[10px] uppercase font-black text-slate-300 tracking-widest text-right">Total</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {estimate.items && estimate.items.length > 0 ? (
                                estimate.items.map((item, idx) => (
                                    <tr key={idx} className="group hover:bg-slate-50 transition-colors">
                                        <td className="py-5 pr-4">
                                            <div className="font-bold text-deep-blue text-sm">{item.description}</div>
                                        </td>
                                        <td className="py-5 text-center text-xs font-bold text-slate-400 uppercase tracking-wider">{item.unit_type}</td>
                                        <td className="py-5 text-center text-sm font-bold text-deep-blue">{item.quantity}</td>
                                        <td className="py-5 text-right text-sm font-medium text-slate-500">${item.rate.toFixed(2)}</td>
                                        <td className="py-5 text-right text-sm font-black text-deep-blue">${(item.quantity * item.rate).toFixed(2)}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="py-12 text-center text-slate-300 font-medium italic">
                                        No hay ítems agregados. Usa el chat para describir el trabajo.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Totals */}
                <div className="flex justify-end">
                    <div className="w-72 space-y-3">
                        <div className="flex justify-between text-sm font-medium">
                            <span className="text-slate-400">Subtotal</span>
                            <span className="text-deep-blue font-bold">${estimate.subtotal?.toFixed(2) || '0.00'}</span>
                        </div>
                        <div className="flex justify-between text-sm font-medium items-center">
                            <span className="text-slate-400">Impuestos ({estimate.tax_rate || 0}%)</span>
                            <span className="text-deep-blue font-bold">${estimate.tax_amount?.toFixed(2) || '0.00'}</span>
                        </div>
                        <div className="pt-4 border-t-2 border-slate-100 flex justify-between items-end mt-4">
                            <span className="text-xl font-[900] text-deep-blue uppercase tracking-tight">Total</span>
                            <div className="text-right">
                                <span className="text-3xl font-[900] text-turq-primary">${estimate.total?.toFixed(2) || '0.00'}</span>
                                <p className="text-[10px] text-slate-300 font-black uppercase tracking-widest mt-1">USD</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer terms */}
                <div className="mt-20 pt-8 border-t border-slate-100">
                    <h5 className="text-[10px] uppercase font-black text-slate-300 tracking-widest mb-2">Términos y Condiciones</h5>
                    <p className="text-[10px] text-slate-400 font-medium leading-relaxed max-w-2xl">
                        Este presupuesto es válido por 30 días. Se requiere un depósito del 50% para comenzar el trabajo. El resto se paga al finalizar. Los cambios en el alcance se cotizarán por separado.
                    </p>
                </div>
            </div>

            <div className="h-20"></div>
        </section>
    );
}
