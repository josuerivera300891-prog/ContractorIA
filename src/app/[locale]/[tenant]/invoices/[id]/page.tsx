import { getInvoiceById } from "@/app/actions/invoices";
import { getUserProfile } from "@/app/actions/auth";
import {
    Receipt,
    ArrowLeft,
    CreditCard,
    Download,
    Printer,
    MoreHorizontal,
    Clock,
    User,
    Calendar,
    CheckCircle2,
    AlertCircle,
    FileText
} from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function InvoiceDetailPage({
    params,
}: {
    params: Promise<{ locale: string; tenant: string; id: string }>;
}) {
    const { locale, tenant, id } = await params;
    const profile = await getUserProfile();

    if (!profile?.companyId) {
        return <div className="p-8 text-center text-slate-400">No autorizado</div>;
    }

    const invoice = await getInvoiceById(id);

    if (!invoice || invoice.company_id !== profile.companyId) {
        return notFound();
    }

    const statusColors = {
        PAID: "bg-emerald-50 text-emerald-600 border-emerald-100",
        UNPAID: "bg-amber-50 text-amber-600 border-amber-100",
        OVERDUE: "bg-rose-50 text-rose-600 border-rose-100",
        PARTIAL: "bg-blue-50 text-blue-600 border-blue-100",
    };

    return (
        <div className="space-y-8 max-w-5xl mx-auto pb-20">
            {/* Nav and Actions */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <Link
                        href={`/${locale}/${tenant}/invoices`}
                        className="flex items-center gap-2 text-slate-400 hover:text-turq-primary transition-colors text-xs font-black uppercase tracking-widest mb-4"
                    >
                        <ArrowLeft size={16} />
                        Todas las Facturas
                    </Link>
                    <div className="flex items-center gap-4">
                        <h1 className="text-4xl font-[900] text-deep-blue tracking-tight font-outfit">
                            Factura <span className="text-turq-primary">#{invoice.invoice_number}</span>
                        </h1>
                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest uppercase border ${statusColors[invoice.status as keyof typeof statusColors]}`}>
                            {invoice.status}
                        </span>
                    </div>
                </div>

                <div className="flex gap-3">
                    <button className="flex items-center gap-2 px-5 py-2.5 bg-white border border-turq-primary/10 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all shadow-sm">
                        <Download size={16} />
                        Descargar
                    </button>
                    {(invoice.status === 'UNPAID' || invoice.status === 'OVERDUE') && (
                        <button className="pro-button !py-2.5 !px-6 text-xs flex items-center gap-2">
                            <CreditCard size={16} />
                            Pagar Ahora
                        </button>
                    )}
                    <button className="p-2.5 bg-white border border-turq-primary/10 rounded-xl text-slate-400 hover:text-deep-blue shadow-sm">
                        <MoreHorizontal size={20} />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main: Invoice Details */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="pro-card bg-white p-12 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-40 h-40 bg-turq-primary/5 rounded-bl-[100px] pointer-events-none group-hover:scale-110 transition-transform"></div>

                        <div className="relative z-10">
                            {/* Billing Info */}
                            <div className="grid grid-cols-2 gap-12 border-b border-slate-50 pb-12 mb-12">
                                <div className="space-y-4">
                                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Facturado A</h3>
                                    <div className="space-y-1">
                                        <p className="text-lg font-black text-deep-blue">
                                            {invoice.clients?.first_name} {invoice.clients?.last_name}
                                        </p>
                                        <p className="text-sm font-medium text-slate-500">{invoice.clients?.company_name}</p>
                                        <p className="text-sm font-medium text-slate-500">{invoice.clients?.address}</p>
                                        <p className="text-sm font-medium text-slate-500">{invoice.clients?.email}</p>
                                    </div>
                                </div>
                                <div className="space-y-4 text-right md:text-left">
                                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Información de pago</h3>
                                    <div className="space-y-2">
                                        <div className="flex justify-between md:justify-start md:gap-4 text-sm">
                                            <span className="text-slate-500 font-medium md:min-w-[120px]">Emisión:</span>
                                            <span className="font-bold text-deep-blue">{new Date(invoice.created_at).toLocaleDateString()}</span>
                                        </div>
                                        <div className="flex justify-between md:justify-start md:gap-4 text-sm">
                                            <span className="text-slate-500 font-medium md:min-w-[120px]">Vencimiento:</span>
                                            <span className="font-bold text-rose-500 underline decoration-rose-500/20 underline-offset-4">
                                                {new Date(invoice.due_date).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <div className="flex justify-between md:justify-start md:gap-4 text-sm">
                                            <span className="text-slate-500 font-medium md:min-w-[120px]">Referencia:</span>
                                            <span className="font-bold text-deep-blue">EST-{invoice.id.split('-')[0].toUpperCase()}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Items */}
                            <div className="space-y-8">
                                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Conceptos Facturados</h3>
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="border-b border-slate-50">
                                            <th className="pb-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Servicio / Producto</th>
                                            <th className="pb-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Cant.</th>
                                            <th className="pb-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Precio</th>
                                            <th className="pb-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Subtotal</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50">
                                        {(invoice.items as any[] || []).map((item, idx) => (
                                            <tr key={idx} className="group/item">
                                                <td className="py-6">
                                                    <p className="font-bold text-deep-blue leading-tight transition-colors group-hover/item:text-turq-primary">{item.description}</p>
                                                    <span className="text-[10px] font-medium text-slate-400 uppercase">{item.unit_type}</span>
                                                </td>
                                                <td className="py-6 text-right text-sm font-bold text-slate-600">{item.quantity}</td>
                                                <td className="py-6 text-right text-sm font-medium text-slate-500">${Number(item.rate).toFixed(2)}</td>
                                                <td className="py-6 text-right text-sm font-black text-deep-blue">${Number(item.total).toFixed(2)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Totals Summary */}
                            <div className="mt-12 pt-12 border-t border-slate-50 flex justify-end">
                                <div className="w-full max-w-xs space-y-4">
                                    <div className="flex justify-between text-sm font-medium text-slate-500">
                                        <span>Subtotal Neto:</span>
                                        <span>${Number(invoice.subtotal).toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm font-medium text-slate-500">
                                        <span>Impuestos:</span>
                                        <span>${Number(invoice.tax_amount).toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between items-center pt-5 border-t border-slate-100">
                                        <span className="text-deep-blue font-black text-lg">TOTAL FACTURA:</span>
                                        <span className="text-turq-primary font-black text-3xl tracking-tighter">
                                            ${Number(invoice.total).toFixed(2)}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl border border-slate-100 italic">
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Saldo Pendiente:</span>
                                        <span className={`text-sm font-black ${invoice.balance_due > 0 ? 'text-amber-600' : 'text-emerald-600'}`}>
                                            ${Number(invoice.balance_due).toFixed(2)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-8">
                    {/* Payment Status Card */}
                    <div className={`pro-card p-8 relative overflow-hidden ${invoice.status === 'PAID' ? 'bg-emerald-600' : 'bg-deep-blue'}`}>
                        <div className="absolute -bottom-10 -right-10 text-white/5">
                            <CreditCard size={140} />
                        </div>
                        <div className="relative z-10 space-y-6">
                            <h3 className="text-[10px] font-black text-white/60 uppercase tracking-widest flex items-center gap-2">
                                <div className={`w-2 h-2 rounded-full animate-pulse ${invoice.status === 'PAID' ? 'bg-emerald-300' : 'bg-amber-400'}`}></div>
                                Estado de Liquidación
                            </h3>
                            <div>
                                <p className="text-white font-[900] text-3xl font-outfit tracking-tighter">
                                    {invoice.status === 'PAID' ? 'Completado' : 'Pendiente'}
                                </p>
                                <p className="text-turq-primary text-[10px] font-black uppercase tracking-widest mt-1">
                                    {invoice.status === 'PAID' ? 'Factura pagada en su totalidad' : 'A la espera de confirmación de pago'}
                                </p>
                            </div>
                            <button className="w-full py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-2xl text-[10px] font-black text-white uppercase tracking-widest transition-all">
                                Ver Historial de Pagos
                            </button>
                        </div>
                    </div>

                    {/* Timeline */}
                    <div className="pro-card bg-white p-8">
                        <h3 className="text-sm font-black text-deep-blue uppercase tracking-widest mb-8 flex items-center gap-2">
                            <Clock size={18} className="text-turq-primary" />
                            Historial
                        </h3>
                        <div className="space-y-8">
                            <div className="relative pl-6 border-l-2 border-turq-primary/10">
                                <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-turq-primary border-2 border-white shadow-sm"></div>
                                <div className="space-y-1">
                                    <p className="text-xs font-black text-deep-blue uppercase tracking-widest">Generada</p>
                                    <p className="text-[10px] font-medium text-slate-400">{new Date(invoice.created_at).toLocaleString()}</p>
                                    <p className="text-[10px] text-slate-500 italic">Desde presupuesto EST-{invoice.id.split('-')[0].toUpperCase()}</p>
                                </div>
                            </div>
                            <div className="relative pl-6">
                                <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-slate-100 border-2 border-white"></div>
                                <div className="space-y-1">
                                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Vencimiento</p>
                                    <p className="text-[10px] font-medium text-slate-400">{new Date(invoice.due_date).toLocaleDateString()}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Quick Help */}
                    <div className="bg-turq-primary/5 p-8 rounded-[2.5rem] border border-turq-primary/10 text-center">
                        <AlertCircle className="mx-auto text-turq-primary mb-4" size={32} />
                        <h4 className="text-sm font-black text-deep-blue mb-2">¿Problemas con el pago?</h4>
                        <p className="text-xs font-medium text-slate-500 mb-6">Contacta con soporte si el cliente reporta fallas en la pasarela de Stripe.</p>
                        <button className="text-[10px] font-black text-turq-primary uppercase tracking-widest hover:underline">Soporte Técnico →</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
