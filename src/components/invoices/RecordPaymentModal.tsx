'use client'

import { useState, useTransition } from 'react'
import { X, DollarSign, Banknote, Building2, CreditCard, Check } from 'lucide-react'
import { recordManualPayment } from '@/app/actions/payments'
import { PaymentMethod } from '@/types/domain'

interface RecordPaymentModalProps {
    invoiceId: string
    balanceDue: number
    isOpen: boolean
    onClose: () => void
}

const paymentMethods: { value: PaymentMethod; label: string; icon: React.ReactNode }[] = [
    { value: 'CASH', label: 'Efectivo', icon: <Banknote size={18} /> },
    { value: 'TRANSFER', label: 'Transferencia', icon: <Building2 size={18} /> },
    { value: 'CHECK', label: 'Cheque', icon: <Check size={18} /> },
    { value: 'MANUAL', label: 'Otro', icon: <CreditCard size={18} /> }
]

export default function RecordPaymentModal({
    invoiceId,
    balanceDue,
    isOpen,
    onClose
}: RecordPaymentModalProps) {
    const [isPending, startTransition] = useTransition()
    const [amount, setAmount] = useState('')
    const [method, setMethod] = useState<PaymentMethod>('CASH')
    const [notes, setNotes] = useState('')
    const [error, setError] = useState('')

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        setError('')

        const numAmount = parseFloat(amount)

        if (isNaN(numAmount) || numAmount <= 0) {
            setError('Ingresa un monto válido')
            return
        }

        if (numAmount > balanceDue) {
            setError('El monto excede el balance pendiente')
            return
        }

        startTransition(async () => {
            const result = await recordManualPayment(invoiceId, numAmount, method, notes || undefined)

            if (result.success) {
                setAmount('')
                setNotes('')
                onClose()
            } else {
                setError(result.error || 'Error registrando pago')
            }
        })
    }

    const handlePayFull = () => {
        setAmount(balanceDue.toString())
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-deep-blue/40 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-slate-100">
                    <h2 className="text-lg font-black text-deep-blue uppercase tracking-wider flex items-center gap-2">
                        <DollarSign size={20} className="text-turq-primary" />
                        Registrar Pago
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-xl hover:bg-slate-100 text-slate-400 transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    {/* Balance Info */}
                    <div className="bg-turq-primary/5 p-4 rounded-2xl border border-turq-primary/10">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                            Balance Pendiente
                        </p>
                        <p className="text-2xl font-black text-deep-blue">
                            ${balanceDue.toLocaleString()}
                        </p>
                    </div>

                    {/* Amount */}
                    <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
                            Monto a Registrar *
                        </label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
                            <input
                                type="number"
                                step="0.01"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                placeholder="0.00"
                                required
                                className="w-full pl-8 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold text-deep-blue placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-turq-primary/20 focus:border-turq-primary transition-all"
                            />
                        </div>
                        <button
                            type="button"
                            onClick={handlePayFull}
                            className="mt-2 text-[10px] font-bold text-turq-primary hover:underline"
                        >
                            Pagar monto completo
                        </button>
                    </div>

                    {/* Payment Method */}
                    <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
                            Método de Pago
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                            {paymentMethods.map((pm) => (
                                <button
                                    key={pm.value}
                                    type="button"
                                    onClick={() => setMethod(pm.value)}
                                    className={`
                                        flex items-center gap-2 px-4 py-3 rounded-xl border text-xs font-bold transition-all
                                        ${method === pm.value
                                            ? 'bg-turq-primary/10 border-turq-primary text-turq-primary'
                                            : 'bg-slate-50 border-slate-100 text-slate-500 hover:bg-slate-100'
                                        }
                                    `}
                                >
                                    {pm.icon}
                                    {pm.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Notes */}
                    <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
                            Notas (opcional)
                        </label>
                        <textarea
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="Referencia, número de cheque, etc..."
                            rows={2}
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-medium text-deep-blue placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-turq-primary/20 focus:border-turq-primary transition-all resize-none"
                        />
                    </div>

                    {/* Error */}
                    {error && (
                        <div className="p-3 bg-rose-50 border border-rose-100 rounded-xl text-xs font-medium text-rose-600">
                            {error}
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-6 py-3 bg-slate-100 text-slate-600 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-slate-200 transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={isPending || !amount}
                            className="flex-1 px-6 py-3 bg-emerald-500 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-emerald-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isPending ? 'Registrando...' : 'Registrar Pago'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
