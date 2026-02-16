import { getEstimateById } from "@/app/actions/estimates";
import { getUserProfile } from "@/app/actions/auth";
import {
    Clock,
    Calendar,
    User,
    FileText,
    ArrowLeft,
    Download,
    Send,
    MoreVertical,
    CheckCircle2,
    AlertCircle,
    Printer,
    Edit3
} from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import DeleteButton from "@/components/common/DeleteButton";
import EstimateStatusDropdown from "@/components/estimates/EstimateStatusDropdown";
import { deleteEstimateAction, updateEstimateAction } from "@/app/actions/estimates";
import { convertEstimateToInvoiceAction } from "@/app/actions/invoices";

export default async function EstimateDetailPage({
    params,
}: {
    params: Promise<{ locale: string; tenant: string; id: string }>;
}) {
    const { locale, tenant, id } = await params;
    const profile = await getUserProfile();

    if (!profile?.companyId) {
        return <div className="p-8 text-center text-slate-400">No autorizado</div>;
    }

    const estimate = await getEstimateById(id);

    if (!estimate || estimate.company_id !== profile.companyId) {
        return notFound();
    }

    const statusColors = {
        DRAFT: "bg-slate-100 text-slate-600 border-slate-200",
        SENT: "bg-blue-50 text-blue-600 border-blue-100",
        SIGNED: "bg-emerald-50 text-emerald-600 border-emerald-100",
        DECLINED: "bg-rose-50 text-rose-600 border-rose-100",
        EXPIRED: "bg-amber-50 text-amber-600 border-amber-100",
    };

    return (
        <div className="space-y-8 max-w-5xl mx-auto pb-20">
            {/* Header / Navigation */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <Link
                        href={`/${locale}/${tenant}/estimates`}
                        className="flex items-center gap-2 text-slate-400 hover:text-turq-primary transition-colors text-xs font-black uppercase tracking-widest mb-4"
                    >
                        <ArrowLeft size={16} />
                        Volver a Presupuestos
                    </Link>
                    <div className="flex items-center gap-4">
                        <h1 className="text-4xl font-[900] text-deep-blue tracking-tight font-outfit">
                            Presupuesto <span className="text-turq-primary">#{estimate.estimate_number}</span>
                        </h1>
                        <EstimateStatusDropdown estimate={estimate} companyId={profile.companyId} />
                    </div>
                </div>

                <div className="flex gap-3">
                    {estimate.status === 'DRAFT' && (
                        <DeleteButton
                            id={id}
                            companyId={profile.companyId}
                            onDelete={deleteEstimateAction}
                            redirectTo={`/${locale}/${tenant}/estimates`}
                        />
                    )}
                    <button className="flex items-center gap-2 px-5 py-2.5 bg-white border border-turq-primary/10 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all shadow-sm">
                        <FileText size={16} />
                        Revisión
                    </button>
                    <button className="pro-button !py-2.5 !px-6 text-xs flex items-center gap-2">
                        <Send size={16} />
                        Enviar al Cliente
                    </button>
                    <button className="p-2.5 bg-white border border-turq-primary/10 rounded-xl text-slate-400 hover:text-deep-blue">
                        <MoreVertical size={20} />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main content - Estimate Body */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="pro-card bg-white p-10 relative overflow-hidden">
                        {/* Decorative watermark */}
                        <div className="absolute top-10 right-10 text-turq-primary/5 opacity-20 pointer-events-none">
                            <FileText size={200} />
                        </div>

                        <div className="relative z-10">
                            {/* Summary Header */}
                            <div className="grid grid-cols-2 gap-10 border-b border-slate-50 pb-10 mb-10">
                                <div className="space-y-4">
                                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Información del Cliente</h3>
                                    <div className="space-y-1">
                                        <p className="text-lg font-black text-deep-blue">
                                            {estimate.clients?.first_name} {estimate.clients?.last_name}
                                        </p>
                                        <p className="text-sm font-medium text-slate-500">{estimate.clients?.company_name}</p>
                                        <p className="text-sm font-medium text-slate-500">{estimate.clients?.email}</p>
                                        <p className="text-sm font-medium text-slate-500">{estimate.clients?.phone}</p>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Detalles del Presupuesto</h3>
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-slate-500 font-medium">Fecha Emisión:</span>
                                            <span className="font-bold text-deep-blue">{new Date(estimate.created_at).toLocaleDateString()}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-slate-500 font-medium">Versión:</span>
                                            <span className="font-bold text-deep-blue">v{estimate.version}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-slate-500 font-medium">Validez:</span>
                                            <span className="font-bold text-deep-blue text-amber-600">30 Días</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Line Items Table */}
                            <div className="space-y-6">
                                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Conceptos y Servicios</h3>
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="border-b border-slate-50">
                                            <th className="pb-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Descripción</th>
                                            <th className="pb-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Cant. / Unid</th>
                                            <th className="pb-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Precio</th>
                                            <th className="pb-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Total</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50">
                                        {(estimate.items as any[] || []).map((item, idx) => (
                                            <tr key={idx}>
                                                <td className="py-5">
                                                    <p className="font-bold text-deep-blue leading-tight">{item.description}</p>
                                                    <span className="text-[10px] font-medium text-slate-400 uppercase">{item.unit_type}</span>
                                                </td>
                                                <td className="py-5">
                                                    <span className="text-sm font-bold text-slate-600">{item.quantity}</span>
                                                </td>
                                                <td className="py-5 text-right font-medium text-slate-500 text-sm">
                                                    ${Number(item.rate).toFixed(2)}
                                                </td>
                                                <td className="py-5 text-right font-black text-deep-blue text-sm">
                                                    ${Number(item.total).toFixed(2)}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Totals Section */}
                            <div className="mt-10 pt-10 border-t border-slate-50 flex justify-end">
                                <div className="w-full max-w-xs space-y-4">
                                    <div className="flex justify-between text-sm font-medium text-slate-500">
                                        <span>Subtotal:</span>
                                        <span>${Number(estimate.subtotal).toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm font-medium text-slate-500">
                                        <span>IVA ({estimate.tax_rate}%):</span>
                                        <span>${Number(estimate.tax_amount).toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between items-center pt-4 border-t border-slate-100">
                                        <span className="text-deep-blue font-black text-lg">TOTAL:</span>
                                        <span className="text-turq-primary font-black text-2xl tracking-tighter">
                                            ${Number(estimate.total).toFixed(2)}
                                        </span>
                                    </div>
                                    {estimate.deposit_amount > 0 && (
                                        <div className="flex justify-between text-sm font-bold text-emerald-600 bg-emerald-50 p-3 rounded-xl border border-emerald-100">
                                            <span>Depósito Requerido ({estimate.deposit_type}):</span>
                                            <span>${Number(estimate.deposit_amount).toFixed(2)}</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Notes Section */}
                            {estimate.notes && (
                                <div className="mt-10 p-6 bg-slate-50 rounded-2xl border border-slate-100">
                                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Términos y Condiciones / Notas</h4>
                                    <p className="text-sm text-slate-600 font-medium leading-relaxed">{estimate.notes}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Sidebar - Timeline and Actions */}
                <div className="space-y-8">
                    {/* Activity Timeline */}
                    <div className="pro-card bg-white p-8">
                        <h3 className="text-sm font-black text-deep-blue uppercase tracking-widest mb-6 flex items-center gap-2">
                            <Clock size={18} className="text-turq-primary" />
                            Actividad Reciente
                        </h3>
                        <div className="space-y-6">
                            <div className="relative pl-6 pb-6 border-l-2 border-turq-primary/10 last:border-0 last:pb-0">
                                <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-turq-primary border-2 border-white"></div>
                                <div className="space-y-1">
                                    <p className="text-xs font-black text-deep-blue">Presupuesto Creado</p>
                                    <p className="text-[10px] font-medium text-slate-400">{new Date(estimate.created_at).toLocaleString()}</p>
                                    <p className="text-[10px] text-slate-500 italic mt-1">v.1 Versión Inicial por Sistema</p>
                                </div>
                            </div>
                            {estimate.status === 'SIGNED' && (
                                <div className="relative pl-6 pb-6 border-l-2 border-turq-primary/10 last:border-0 last:pb-0">
                                    <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white"></div>
                                    <div className="space-y-1">
                                        <p className="text-xs font-black text-emerald-600 uppercase tracking-widest tracking-widest">Firmado por Cliente</p>
                                        <p className="text-[10px] font-medium text-slate-400">---</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Quick Stats / Info */}
                    <div className="pro-card bg-deep-blue p-8 relative overflow-hidden">
                        <div className="absolute -bottom-10 -right-10 text-white/5 rotate-12">
                            <AlertCircle size={120} />
                        </div>
                        <div className="relative z-10 space-y-4">
                            <h3 className="text-xs font-black text-white/60 uppercase tracking-widest">Resumen de Propuesta</h3>
                            <div className="space-y-6">
                                <div>
                                    <p className="text-white font-[900] text-3xl font-outfit tracking-tighter">${Number(estimate.total).toFixed(2)}</p>
                                    <p className="text-turq-primary text-[10px] font-black uppercase tracking-widest mt-1">Valor Total del Proyecto</p>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-white/5 p-3 rounded-xl border border-white/10">
                                        <p className="text-white/80 font-black text-base">{estimate.items.length}</p>
                                        <p className="text-[8px] text-white/40 uppercase font-black">Conceptos</p>
                                    </div>
                                    <div className="bg-white/5 p-3 rounded-xl border border-white/10">
                                        <p className="text-white/80 font-black text-base">30d</p>
                                        <p className="text-[8px] text-white/40 uppercase font-black">Validez</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Quick Help */}
                    <div className="bg-turq-primary/5 p-8 rounded-[2rem] border border-turq-primary/10 text-center">
                        <AlertCircle className="mx-auto text-turq-primary mb-4" size={32} />
                        <h4 className="text-sm font-black text-deep-blue mb-2">¿Necesitas cambios?</h4>
                        <p className="text-xs font-medium text-slate-500 mb-6">Puedes crear una nueva revisión basada en esta versión sin perder el historial.</p>
                        <button className="text-xs font-black text-turq-primary uppercase tracking-widest hover:underline">Crear Nueva Revisión →</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
