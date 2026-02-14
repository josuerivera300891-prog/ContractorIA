"use client";

import { use, useEffect, useState } from "react";
import { Receipt, Search, Filter, Download, MoreVertical, Loader2, CreditCard, Clock, ExternalLink } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { createInvoiceCheckoutSession } from "@/app/actions/payments";

export default function InvoicesPage({ params }: { params: Promise<{ tenant: string; locale: string }> }) {
    const { tenant } = use(params);
    const [invoices, setInvoices] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [payingId, setPayingId] = useState<string | null>(null);
    const [locale, setLocale] = useState<string>("en");
    const supabase = createClient();

    useEffect(() => {
        const fetchInvoices = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            // Get current locale from pathname if possible or context
            const path = window.location.pathname;
            const currentLocale = path.split('/')[1] || 'en';
            setLocale(currentLocale);
            const { data: profile } = await supabase.from('profiles').select('company_id').eq('id', user.id).single();
            if (!profile) return;

            const { data } = await supabase
                .from('invoices')
                .select('*')
                .eq('company_id', profile.company_id)
                .order('created_at', { ascending: false });

            setInvoices(data || []);
            setIsLoading(false);
        };

        fetchInvoices();
    }, [tenant]);

    useEffect(() => {
        // Handle success/canceled search params
        const params = new URLSearchParams(window.location.search);
        if (params.get('success')) {
            alert("¡Pago procesado con éxito! La factura se actualizará en unos momentos.");
            // Clean URL
            window.history.replaceState({}, '', window.location.pathname);
        }
        if (params.get('canceled')) {
            alert("El pago fue cancelado. Puedes intentarlo de nuevo cuando gustes.");
            window.history.replaceState({}, '', window.location.pathname);
        }
    }, []);

    const handlePayNow = async (invoiceId: string) => {
        try {
            setPayingId(invoiceId);
            const checkoutUrl = await createInvoiceCheckoutSession(invoiceId, locale, tenant);
            if (checkoutUrl) {
                window.location.href = checkoutUrl;
            }
        } catch (error) {
            console.error("Payment Error:", error);
            alert("No se pudo iniciar el proceso de pago. Verifica tu conexión.");
        } finally {
            setPayingId(null);
        }
    };

    return (
        <div className="space-y-10">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-4xl font-[900] text-deep-blue tracking-tight mb-2 font-outfit">
                        Neural <span className="text-turq-primary">Invoices</span>
                    </h1>
                    <p className="text-slate-500 font-medium font-inter">
                        Centro de cobros para <span className="text-deep-blue font-bold">{tenant}</span>
                    </p>
                </div>
            </div>

            {/* Invoices List */}
            <div className="pro-card bg-white/60 p-8 min-h-[500px] relative overflow-hidden group">
                <div className="absolute -top-24 -right-24 w-96 h-96 bg-turq-primary/5 rounded-full blur-[100px]"></div>

                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10 relative z-10 font-outfit">
                    <h2 className="text-xl font-[900] text-deep-blue flex items-center gap-3">
                        <Receipt className="text-turq-primary" size={24} />
                        Facturas Generadas
                    </h2>
                    <div className="flex gap-3 w-full md:w-auto font-inter">
                        <div className="relative flex-1 md:w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                            <input type="text" placeholder="Buscar factura..." className="w-full pl-10 pr-4 py-2 rounded-xl border border-turq-primary/10 bg-white/5 text-sm font-medium" />
                        </div>
                    </div>
                </div>

                {isLoading ? (
                    <div className="flex justify-center py-20"><Loader2 className="animate-spin text-turq-primary" size={40} /></div>
                ) : invoices.length > 0 ? (
                    <div className="relative z-10 overflow-x-auto font-inter">
                        <table className="w-full">
                            <thead>
                                <tr className="text-left border-b border-slate-50">
                                    <th className="pb-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Folio</th>
                                    <th className="pb-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Estado</th>
                                    <th className="pb-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Vencimiento</th>
                                    <th className="pb-4 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Total</th>
                                    <th className="pb-4 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Saldo</th>
                                    <th className="pb-4 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {invoices.map((inv) => (
                                    <tr key={inv.id} className="group/row hover:bg-turq-primary/[0.02] transition-colors">
                                        <td className="py-5">
                                            <span className="font-bold text-deep-blue text-sm">#{inv.invoice_number}</span>
                                        </td>
                                        <td className="py-5">
                                            <span className={`px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest uppercase ${inv.status === 'PAID' ? 'bg-emerald-100 text-emerald-600' :
                                                inv.status === 'UNPAID' ? 'bg-amber-100 text-amber-600' : 'bg-slate-100 text-slate-500'
                                                }`}>
                                                {inv.status}
                                            </span>
                                        </td>
                                        <td className="py-5 text-sm text-slate-500 font-medium flex items-center gap-2">
                                            <Clock size={14} className="text-slate-300" />
                                            {inv.due_date ? new Date(inv.due_date).toLocaleDateString() : '---'}
                                        </td>
                                        <td className="py-5 text-right font-black text-deep-blue text-sm">${Number(inv.total).toFixed(2)}</td>
                                        <td className="py-5 text-right font-black text-amber-600 text-sm">
                                            ${Number(inv.balance_due).toFixed(2)}
                                        </td>
                                        <td className="py-5 text-right">
                                            {inv.status === 'UNPAID' && (
                                                <button
                                                    onClick={() => handlePayNow(inv.id)}
                                                    disabled={payingId === inv.id}
                                                    className="inline-flex items-center gap-2 px-4 py-2 bg-deep-blue text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-turq-primary transition-all disabled:opacity-50"
                                                >
                                                    {payingId === inv.id ? (
                                                        <Loader2 size={12} className="animate-spin" />
                                                    ) : (
                                                        <CreditCard size={12} />
                                                    )}
                                                    Pagar Ahora
                                                </button>
                                            )}
                                            {inv.status === 'PAID' && (
                                                <span className="inline-flex items-center gap-2 text-emerald-500 text-[10px] font-black uppercase tracking-widest">
                                                    <ExternalLink size={12} /> Pagado
                                                </span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="py-20 text-center">
                        <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center text-slate-200 mx-auto mb-6">
                            <Receipt size={40} />
                        </div>
                        <h3 className="text-xl font-black text-slate-400 uppercase tracking-widest font-outfit mb-2">Sin Facturas</h3>
                        <p className="text-sm text-slate-500 max-w-xs mx-auto font-medium font-inter">Cuando conviertas un presupuesto firmado, aparecerá aquí como una factura pendiente de pago.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
