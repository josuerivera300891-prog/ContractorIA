'use client'

interface PaymentProgressBarProps {
    total: number
    paid: number
    showDetails?: boolean
}

export default function PaymentProgressBar({ total, paid, showDetails = true }: PaymentProgressBarProps) {
    const balance = total - paid
    const percent = total > 0 ? Math.round((paid / total) * 100) : 0

    return (
        <div className="space-y-2">
            {/* Progress Bar */}
            <div className="flex items-center gap-3">
                <div className="flex-1 h-3 bg-slate-100 rounded-full overflow-hidden">
                    <div
                        className={`h-full transition-all duration-500 ${
                            percent === 100 ? 'bg-emerald-500' : 'bg-turq-primary'
                        }`}
                        style={{ width: `${percent}%` }}
                    />
                </div>
                <span className={`
                    text-sm font-black tabular-nums
                    ${percent === 100 ? 'text-emerald-500' : 'text-deep-blue'}
                `}>
                    {percent}%
                </span>
            </div>

            {/* Details */}
            {showDetails && (
                <div className="flex items-center justify-between text-xs font-medium">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1.5">
                            <div className={`w-2 h-2 rounded-full ${percent === 100 ? 'bg-emerald-500' : 'bg-turq-primary'}`} />
                            <span className="text-slate-500">
                                Pagado: <span className="font-bold text-deep-blue">${paid.toLocaleString()}</span>
                            </span>
                        </div>
                        {balance > 0 && (
                            <div className="flex items-center gap-1.5">
                                <div className="w-2 h-2 rounded-full bg-slate-300" />
                                <span className="text-slate-500">
                                    Pendiente: <span className="font-bold text-rose-500">${balance.toLocaleString()}</span>
                                </span>
                            </div>
                        )}
                    </div>
                    <span className="text-slate-400">
                        Total: ${total.toLocaleString()}
                    </span>
                </div>
            )}
        </div>
    )
}
