'use client'

import { InvoicePayment } from '@/types/domain'
import {
    CreditCard,
    Banknote,
    Building2,
    Check,
    Clock,
    CheckCircle2,
    XCircle,
    RefreshCw
} from 'lucide-react'

interface PaymentHistoryProps {
    payments: InvoicePayment[]
}

const methodIcons: Record<string, React.ReactNode> = {
    STRIPE: <CreditCard size={16} />,
    CASH: <Banknote size={16} />,
    TRANSFER: <Building2 size={16} />,
    CHECK: <Check size={16} />,
    MANUAL: <Banknote size={16} />
}

const methodLabels: Record<string, string> = {
    STRIPE: 'Tarjeta',
    CASH: 'Efectivo',
    TRANSFER: 'Transferencia',
    CHECK: 'Cheque',
    MANUAL: 'Manual'
}

const statusConfig: Record<string, { icon: React.ReactNode; color: string; label: string }> = {
    PENDING: {
        icon: <Clock size={14} />,
        color: 'text-amber-500 bg-amber-50',
        label: 'Pendiente'
    },
    COMPLETED: {
        icon: <CheckCircle2 size={14} />,
        color: 'text-emerald-500 bg-emerald-50',
        label: 'Completado'
    },
    FAILED: {
        icon: <XCircle size={14} />,
        color: 'text-rose-500 bg-rose-50',
        label: 'Fallido'
    },
    REFUNDED: {
        icon: <RefreshCw size={14} />,
        color: 'text-slate-500 bg-slate-50',
        label: 'Reembolsado'
    }
}

export default function PaymentHistory({ payments }: PaymentHistoryProps) {
    if (payments.length === 0) {
        return (
            <div className="py-8 text-center">
                <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 mx-auto mb-3">
                    <CreditCard size={24} />
                </div>
                <p className="text-xs font-medium text-slate-400">Sin pagos registrados</p>
            </div>
        )
    }

    return (
        <div className="space-y-3">
            {payments.map((payment) => {
                const status = statusConfig[payment.status]

                return (
                    <div
                        key={payment.id}
                        className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100"
                    >
                        <div className="flex items-center gap-3">
                            {/* Method Icon */}
                            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-slate-500 shadow-sm">
                                {methodIcons[payment.payment_method]}
                            </div>

                            {/* Details */}
                            <div>
                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-bold text-deep-blue">
                                        ${payment.amount.toLocaleString()}
                                    </span>
                                    <span className={`
                                        flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold
                                        ${status.color}
                                    `}>
                                        {status.icon}
                                        {status.label}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-0.5">
                                    <span>{methodLabels[payment.payment_method]}</span>
                                    <span>•</span>
                                    <span>
                                        {payment.paid_at
                                            ? new Date(payment.paid_at).toLocaleDateString('es-ES', {
                                                day: 'numeric',
                                                month: 'short',
                                                year: 'numeric'
                                            })
                                            : new Date(payment.created_at).toLocaleDateString('es-ES', {
                                                day: 'numeric',
                                                month: 'short',
                                                year: 'numeric'
                                            })
                                        }
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Notes */}
                        {payment.notes && (
                            <p className="text-[10px] text-slate-400 max-w-[150px] truncate">
                                {payment.notes}
                            </p>
                        )}
                    </div>
                )
            })}
        </div>
    )
}
