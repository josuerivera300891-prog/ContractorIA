'use client'

import { useState, useTransition } from 'react'
import { X, Plus, Calendar, Flag } from 'lucide-react'
import { createProjectTaskAction, updateTaskAction } from '@/app/actions/tasks'
import { ProjectTask, TaskPriority } from '@/types/domain'

interface CreateTaskModalProps {
    projectId: string
    companyId: string
    isOpen: boolean
    onClose: () => void
    editTask?: ProjectTask | null
}

export default function CreateTaskModal({
    projectId,
    companyId,
    isOpen,
    onClose,
    editTask
}: CreateTaskModalProps) {
    const [isPending, startTransition] = useTransition()
    const [title, setTitle] = useState(editTask?.title || '')
    const [description, setDescription] = useState(editTask?.description || '')
    const [dueDate, setDueDate] = useState(editTask?.due_date || '')
    const [priority, setPriority] = useState<TaskPriority>(editTask?.priority || 'medium')

    const isEditing = !!editTask

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        startTransition(async () => {
            if (isEditing && editTask) {
                await updateTaskAction(editTask.id, companyId, {
                    title,
                    description,
                    due_date: dueDate || null,
                    priority
                })
            } else {
                const formData = new FormData()
                formData.set('project_id', projectId)
                formData.set('title', title)
                formData.set('description', description)
                if (dueDate) formData.set('due_date', dueDate)

                await createProjectTaskAction(formData, companyId)
            }

            // Reset form
            setTitle('')
            setDescription('')
            setDueDate('')
            setPriority('medium')
            onClose()
        })
    }

    if (!isOpen) return null

    const priorityOptions: { value: TaskPriority; label: string; color: string }[] = [
        { value: 'low', label: 'Baja', color: 'bg-slate-100 text-slate-600 border-slate-200' },
        { value: 'medium', label: 'Media', color: 'bg-amber-50 text-amber-600 border-amber-200' },
        { value: 'high', label: 'Alta', color: 'bg-rose-50 text-rose-600 border-rose-200' }
    ]

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-deep-blue/40 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-slate-100">
                    <h2 className="text-lg font-black text-deep-blue uppercase tracking-wider">
                        {isEditing ? 'Editar Tarea' : 'Nueva Tarea'}
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
                    {/* Title */}
                    <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
                            Título *
                        </label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="¿Qué necesitas hacer?"
                            required
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-medium text-deep-blue placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-turq-primary/20 focus:border-turq-primary transition-all"
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
                            Descripción
                        </label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Detalles adicionales..."
                            rows={3}
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-medium text-deep-blue placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-turq-primary/20 focus:border-turq-primary transition-all resize-none"
                        />
                    </div>

                    {/* Due Date & Priority */}
                    <div className="grid grid-cols-2 gap-4">
                        {/* Due Date */}
                        <div>
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
                                <Calendar size={12} className="inline mr-1" />
                                Fecha límite
                            </label>
                            <input
                                type="date"
                                value={dueDate}
                                onChange={(e) => setDueDate(e.target.value)}
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-medium text-deep-blue focus:outline-none focus:ring-2 focus:ring-turq-primary/20 focus:border-turq-primary transition-all"
                            />
                        </div>

                        {/* Priority */}
                        <div>
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
                                <Flag size={12} className="inline mr-1" />
                                Prioridad
                            </label>
                            <div className="flex gap-2">
                                {priorityOptions.map((opt) => (
                                    <button
                                        key={opt.value}
                                        type="button"
                                        onClick={() => setPriority(opt.value)}
                                        className={`
                                            flex-1 px-2 py-2.5 rounded-xl text-[10px] font-black uppercase
                                            border transition-all
                                            ${priority === opt.value
                                                ? opt.color + ' ring-2 ring-offset-1'
                                                : 'bg-slate-50 text-slate-400 border-slate-100 hover:bg-slate-100'
                                            }
                                        `}
                                    >
                                        {opt.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-6 py-3 bg-slate-100 text-slate-600 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-slate-200 transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={isPending || !title.trim()}
                            className="flex-1 px-6 py-3 bg-turq-primary text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-deep-blue transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {isPending ? (
                                <span className="animate-pulse">Guardando...</span>
                            ) : (
                                <>
                                    <Plus size={16} />
                                    {isEditing ? 'Guardar' : 'Crear Tarea'}
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
