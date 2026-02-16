'use client'

import { useState } from 'react'
import { Trash2, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface DeleteButtonProps {
    id: string
    companyId: string
    onDelete: (id: string, companyId: string) => Promise<{ success: boolean; error?: string }>
    redirectTo?: string
    confirmMessage?: string
    className?: string
}

export default function DeleteButton({
    id,
    companyId,
    onDelete,
    redirectTo,
    confirmMessage = "¿Estás seguro de que deseas eliminar este registro? Esta acción no se puede deshacer.",
    className = ""
}: DeleteButtonProps) {
    const [isLoading, setIsLoading] = useState(false)
    const [showConfirm, setShowConfirm] = useState(false)
    const router = useRouter()

    const handleDelete = async () => {
        setIsLoading(true)
        try {
            const result = await onDelete(id, companyId)
            if (result.success) {
                if (redirectTo) {
                    router.push(redirectTo)
                }
            } else {
                alert(`Error: ${result.error}`)
            }
        } catch (error) {
            console.error('Delete error:', error)
            alert('Ocurrió un error inesperado.')
        } finally {
            setIsLoading(false)
            setShowConfirm(false)
        }
    }

    if (showConfirm) {
        return (
            <div className="flex items-center gap-2 animate-in fade-in slide-in-from-right-4 duration-300">
                <span className="text-[10px] font-black text-rose-500 uppercase tracking-widest hidden sm:inline">¿Confirmar?</span>
                <button
                    onClick={handleDelete}
                    disabled={isLoading}
                    className="p-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition-colors disabled:opacity-50"
                >
                    {isLoading ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                </button>
                <button
                    onClick={() => setShowConfirm(false)}
                    disabled={isLoading}
                    className="p-2 bg-slate-100 text-slate-400 rounded-lg hover:bg-slate-200 transition-colors disabled:opacity-50 text-[10px] font-black uppercase"
                >
                    Cancelar
                </button>
            </div>
        )
    }

    return (
        <button
            onClick={() => setShowConfirm(true)}
            className={`p-2.5 bg-rose-50 text-rose-500 rounded-xl hover:bg-rose-100 transition-all border border-rose-100 shadow-sm group ${className}`}
            title="Eliminar"
        >
            <Trash2 size={18} className="group-hover:scale-110 transition-transform" />
        </button>
    )
}
