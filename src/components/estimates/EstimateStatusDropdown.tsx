'use client'

import { useState } from 'react'
import { ChevronDown, Loader2, Check } from 'lucide-react'
import { updateEstimateAction } from '@/app/actions/estimates'

interface EstimateStatusDropdownProps {
    estimate: any
    companyId: string
}

export default function EstimateStatusDropdown({ estimate, companyId }: EstimateStatusDropdownProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const statuses = [
        { label: 'Borrador', value: 'DRAFT', color: 'bg-slate-100 text-slate-600' },
        { label: 'Enviado', value: 'SENT', color: 'bg-blue-100 text-blue-600' },
        { label: 'Aceptado', value: 'ACCEPTED', color: 'bg-emerald-100 text-emerald-600' },
        { label: 'Rechazado', value: 'REJECTED', color: 'bg-rose-100 text-rose-600' },
        { label: 'Expirado', value: 'EXPIRED', color: 'bg-amber-100 text-amber-600' },
    ]

    const handleUpdate = async (newStatus: string) => {
        if (newStatus === estimate.status) return

        setIsLoading(true)
        try {
            const result = await updateEstimateAction(estimate.id, companyId, { status: newStatus })
            if (result.success) {
                setIsOpen(false)
            } else {
                alert(`Error: ${result.error}`)
            }
        } catch (error) {
            console.error('Update estimate status error:', error)
        } finally {
            setIsLoading(false)
        }
    }

    const currentStatus = statuses.find(s => s.value === estimate.status) || statuses[0]

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                disabled={isLoading}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-[10px] font-black tracking-widest uppercase border transition-all ${currentStatus.color} border-current/10 hover:border-current/30 disabled:opacity-50`}
            >
                {isLoading ? <Loader2 size={12} className="animate-spin" /> : estimate.status.replace('_', ' ')}
                <ChevronDown size={14} className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <div className="absolute top-full mt-2 right-0 w-48 bg-white rounded-2xl shadow-xl border border-turq-primary/10 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2">
                    {statuses.map((status) => (
                        <button
                            key={status.value}
                            onClick={() => handleUpdate(status.value)}
                            className={`w-full flex items-center justify-between px-5 py-3 text-left text-xs font-bold transition-colors hover:bg-slate-50 ${estimate.status === status.value ? 'text-turq-primary bg-turq-primary/5' : 'text-slate-600'}`}
                        >
                            {status.label}
                            {estimate.status === status.value && <Check size={14} />}
                        </button>
                    ))}
                </div>
            )}
        </div>
    )
}
