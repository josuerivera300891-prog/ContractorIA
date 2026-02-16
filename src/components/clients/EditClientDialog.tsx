'use client'

import { useState } from 'react'
import { Edit3, Loader2, Save } from 'lucide-react'
import Modal from '@/components/common/Modal'
import { updateClientAction } from '@/app/actions/clients'

interface EditClientDialogProps {
    client: any
    companyId: string
}

export default function EditClientDialog({ client, companyId }: EditClientDialogProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setIsLoading(true)

        const formData = new FormData(e.currentTarget)
        try {
            const result = await updateClientAction(client.id, formData, companyId)
            if (result.success) {
                setIsOpen(false)
            } else {
                alert(`Error: ${result.error}`)
            }
        } catch (error) {
            console.error('Update client error:', error)
            alert('Error al actualizar el cliente')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="pro-button !py-2.5 !px-6 text-xs flex items-center gap-2"
            >
                <Edit3 size={16} />
                Editar Cliente
            </button>

            <Modal
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                title="Actualizar Información del Cliente"
            >
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Nombre(s)</label>
                            <input
                                name="firstName"
                                defaultValue={client.first_name}
                                required
                                className="w-full px-5 py-3 rounded-xl bg-slate-50 border border-slate-100 focus:ring-2 focus:ring-turq-primary/20 text-deep-blue font-bold outline-none"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Apellidos</label>
                            <input
                                name="lastName"
                                defaultValue={client.last_name}
                                required
                                className="w-full px-5 py-3 rounded-xl bg-slate-50 border border-slate-100 focus:ring-2 focus:ring-turq-primary/20 text-deep-blue font-bold outline-none"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Empresa (Opcional)</label>
                        <input
                            name="companyName"
                            defaultValue={client.company_name}
                            className="w-full px-5 py-3 rounded-xl bg-slate-50 border border-slate-100 focus:ring-2 focus:ring-turq-primary/20 text-deep-blue font-bold outline-none"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Email</label>
                            <input
                                name="email"
                                type="email"
                                defaultValue={client.email}
                                required
                                className="w-full px-5 py-3 rounded-xl bg-slate-50 border border-slate-100 focus:ring-2 focus:ring-turq-primary/20 text-deep-blue font-bold outline-none"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Teléfono</label>
                            <input
                                name="phone"
                                defaultValue={client.phone}
                                required
                                className="w-full px-5 py-3 rounded-xl bg-slate-50 border border-slate-100 focus:ring-2 focus:ring-turq-primary/20 text-deep-blue font-bold outline-none"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Dirección</label>
                        <textarea
                            name="address"
                            defaultValue={client.address}
                            className="w-full px-5 py-3 rounded-xl bg-slate-50 border border-slate-100 focus:ring-2 focus:ring-turq-primary/20 text-deep-blue font-bold outline-none min-h-[80px] resize-none"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Notas Internas</label>
                        <textarea
                            name="notes"
                            defaultValue={client.notes}
                            className="w-full px-5 py-3 rounded-xl bg-slate-50 border border-slate-100 focus:ring-2 focus:ring-turq-primary/20 text-deep-blue font-bold outline-none min-h-[80px] resize-none"
                        />
                    </div>

                    <div className="pt-4 flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={() => setIsOpen(false)}
                            className="px-6 py-3 rounded-xl bg-slate-50 text-slate-400 font-bold hover:bg-slate-100 transition-all text-sm"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="px-8 py-3 rounded-xl bg-deep-blue text-white font-black text-sm uppercase tracking-widest flex items-center gap-2 hover:bg-turq-primary transition-all disabled:opacity-50"
                        >
                            {isLoading ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                            Guardar Cambios
                        </button>
                    </div>
                </form>
            </Modal>
        </>
    )
}
