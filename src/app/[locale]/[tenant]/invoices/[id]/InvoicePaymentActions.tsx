'use client'

import { useState, useTransition } from 'react'
import { CreditCard, Banknote, DollarSign } from 'lucide-react'
import { createPartialPaymentCheckout } from '@/app/actions/payments'
import { RecordPaymentModal } from '@/components/invoices'

interface InvoicePaymentActionsProps {
    invoiceId: string
    balanceDue: number
    total: number
    status: string
    locale: string
    tenant: string
}

export default function InvoicePaymentActions({
    invoiceId,
    balanceDue,
    total,
    status,
    locale,
    tenant
}: InvoicePaymentActionsProps) {
    const [isPending, startTransition] = useTransition()
    const [showManualPayment, setShowManualPayment] = useState(false)
    const [showPartialPayment, setShowPartialPayment] = useState(false)
    const [partialAmount, setPartialAmount] = useState('')
    const [error, setError] = useState('')

    const canPay = status === 'UNPAID' || status === 'OVERDUE' || status === 'PARTIAL'

    const handleFullPayment = () => {
        startTransition(async () => {
            try {
                const url = await createPartialPaymentCheckout(invoiceId, balanceDue, locale, tenant)
                window.location.href = url
            } catch (err: any) {
                setError(err.message)
            }
        })
    }

    const handlePartialPayment = () => {
        const amount = parseFloat(partialAmount)
        if (isNaN(amount) || amount <= 0) {
            setError('Ingresa un monto válido')
            return
        }
        if (amount > balanceDue) {
            setError('El monto excede el balance pendiente')
            return
        }

        startTransition(async () => {
            try {
                const url = await createPartialPaymentCheckout(invoiceId, amount, locale, tenant)
                window.location.href = url
            } catch (err: any) {
                setError(err.message)
            }
        })
    }

    if (!canPay) {
        return null
    }

    return (
        <>
            <div className="space-y-3">
                {/* Pago completo con tarjeta */}
                <button
                    onClick={handleFullPayment}
                    disabled={isPending}
                    className="w-full pro-button !py-3 text-xs flex items-center justify-center gap-2 disabled:opacity-50"
                >
                    <CreditCard size={16} />
                    {isPending ? 'Procesando...' : `Pagar $${balanceDue.toLocaleString()} con Tarjeta`}
                </button>

                {/* Toggle pago parcial */}
                {!showPartialPayment ? (
                    <button
                        onClick={() => setShowPartialPayment(true)}
                        className="w-full py-3 bg-slate-100 hover:bg-slate-200 rounded-2xl text-[10px] font-black text-slate-600 uppercase tracking-widest transition-all flex items-center justify-center gap-2"
                    >
                        <DollarSign size={14} />
                        Pago Parcial con Tarjeta
                    </button>
                ) : (
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-3">
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">$</span>
                            <input
                                type="number"
                                step="0.01"
                                value={partialAmount}
                                onChange={(e) => {
                                    setPartialAmount(e.target.value)
                                    setError('')
                                }}
                                placeholder="0.00"
                                className="w-full pl-7 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-deep-blue focus:outline-none focus:ring-2 focus:ring-turq-primary/20"
                            />
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => {
                                    setShowPartialPayment(false)
                                    setPartialAmount('')
                                    setError('')
                                }}
                                className="flex-1 py-2 bg-slate-200 rounded-xl text-[10px] font-black text-slate-500 uppercase"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handlePartialPayment}
                                disabled={isPending || !partialAmount}
                                className="flex-1 py-2 bg-turq-primary rounded-xl text-[10px] font-black text-white uppercase disabled:opacity-50"
                            >
                                Pagar
                            </button>
                        </div>
                    </div>
                )}

                {/* Registrar pago manual */}
                <button
                    onClick={() => setShowManualPayment(true)}
                    className="w-full py-3 bg-white border border-slate-200 hover:border-turq-primary rounded-2xl text-[10px] font-black text-slate-600 uppercase tracking-widest transition-all flex items-center justify-center gap-2"
                >
                    <Banknote size={14} />
                    Registrar Pago Manual
                </button>

                {/* Error */}
                {error && (
                    <p className="text-xs text-rose-500 font-medium text-center">{error}</p>
                )}
            </div>

            {/* Modal de pago manual */}
            <RecordPaymentModal
                invoiceId={invoiceId}
                balanceDue={balanceDue}
                isOpen={showManualPayment}
                onClose={() => setShowManualPayment(false)}
            />
        </>
    )
}
