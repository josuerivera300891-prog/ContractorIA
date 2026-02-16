'use client'

import { useState } from 'react'
import { Edit3, Loader2, Save } from 'lucide-react'
import Modal from '@/components/common/Modal'
import { updateProjectAction } from '@/app/actions/projects'

interface EditProjectDialogProps {
    project: any
    companyId: string
}

export default function EditProjectDialog({ project, companyId }: EditProjectDialogProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setIsLoading(true)

        const formData = new FormData(e.currentTarget)
        const data = {
            name: formData.get('name') as string,
            description: formData.get('description') as string,
            status: formData.get('status') as string,
            start_date: formData.get('startDate') as string,
            end_date: formData.get('endDate') as string,
        }

        try {
            const result = await updateProjectAction(project.id, companyId, data)
            if (result.success) {
                setIsOpen(false)
            } else {
                alert(`Error: ${result.error}`)
            }
        } catch (error) {
            console.error('Update project error:', error)
            alert('Error al actualizar el proyecto')
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
                Gestionar Proyecto
            </button>

            <Modal
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                title="Configuración del Proyecto"
            >
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Nombre del Proyecto</label>
                        <input
                            name="name"
                            defaultValue={project.name}
                            required
                            className="w-full px-5 py-3 rounded-xl bg-slate-50 border border-slate-100 focus:ring-2 focus:ring-turq-primary/20 text-deep-blue font-bold outline-none"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Estado del Proyecto</label>
                        <select
                            name="status"
                            defaultValue={project.status}
                            className="w-full px-5 py-3 rounded-xl bg-slate-50 border border-slate-100 focus:ring-2 focus:ring-turq-primary/20 text-deep-blue font-bold outline-none appearance-none"
                        >
                            <option value="PLANNING">Planeación</option>
                            <option value="IN_PROGRESS">En Progreso</option>
                            <option value="ON_HOLD">En Pausa</option>
                            <option value="COMPLETED">Finalizado</option>
                        </select>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Fecha Inicio</label>
                            <input
                                name="startDate"
                                type="date"
                                defaultValue={project.start_date?.split('T')[0]}
                                className="w-full px-5 py-3 rounded-xl bg-slate-50 border border-slate-100 focus:ring-2 focus:ring-turq-primary/20 text-deep-blue font-bold outline-none"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Fecha Entrega</label>
                            <input
                                name="endDate"
                                type="date"
                                defaultValue={project.end_date?.split('T')[0]}
                                className="w-full px-5 py-3 rounded-xl bg-slate-50 border border-slate-100 focus:ring-2 focus:ring-turq-primary/20 text-deep-blue font-bold outline-none"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Descripción / Alcance</label>
                        <textarea
                            name="description"
                            defaultValue={project.description}
                            className="w-full px-5 py-3 rounded-xl bg-slate-50 border border-slate-100 focus:ring-2 focus:ring-turq-primary/20 text-deep-blue font-bold outline-none min-h-[120px] resize-none"
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
                            className="px-8 py-3 rounded-xl bg-deep-blue text-white font-black text-sm uppercase tracking-widest flex items-center gap-2 hover:bg-turq-primary transition-all disabled:opacity-50 shadow-lg shadow-turq-primary/10"
                        >
                            {isLoading ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                            Actualizar Proyecto
                        </button>
                    </div>
                </form>
            </Modal>
        </>
    )
}
