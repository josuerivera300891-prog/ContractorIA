'use client'

import { ProjectTask, TaskStatus } from '@/types/domain'
import { updateTaskStatusAction, deleteTaskAction } from '@/app/actions/tasks'
import TaskStatusBadge from './TaskStatusBadge'
import {
    Calendar,
    MoreHorizontal,
    CheckCircle2,
    Circle,
    Clock,
    Trash2,
    GripVertical
} from 'lucide-react'
import { useState, useTransition } from 'react'

interface TaskCardProps {
    task: ProjectTask
    companyId: string
    onEdit?: (task: ProjectTask) => void
}

export default function TaskCard({ task, companyId, onEdit }: TaskCardProps) {
    const [isPending, startTransition] = useTransition()
    const [showMenu, setShowMenu] = useState(false)

    const handleStatusChange = (newStatus: TaskStatus) => {
        startTransition(async () => {
            await updateTaskStatusAction(task.id, newStatus, task.project_id, companyId)
        })
    }

    const handleDelete = () => {
        if (confirm('¿Eliminar esta tarea?')) {
            startTransition(async () => {
                await deleteTaskAction(task.id, companyId)
            })
        }
        setShowMenu(false)
    }

    const priorityColors = {
        low: 'border-l-slate-300',
        medium: 'border-l-amber-400',
        high: 'border-l-rose-500'
    }

    const statusIcon = {
        TODO: <Circle size={18} className="text-slate-400" />,
        IN_PROGRESS: <Clock size={18} className="text-amber-500" />,
        DONE: <CheckCircle2 size={18} className="text-emerald-500" />
    }

    return (
        <div className={`
            group relative bg-white rounded-2xl border border-slate-100
            shadow-sm hover:shadow-md transition-all duration-200
            border-l-4 ${priorityColors[task.priority]}
            ${isPending ? 'opacity-50' : ''}
        `}>
            <div className="p-4">
                {/* Header */}
                <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 flex-1">
                        {/* Drag Handle */}
                        <div className="pt-0.5 cursor-grab opacity-0 group-hover:opacity-100 transition-opacity">
                            <GripVertical size={16} className="text-slate-300" />
                        </div>

                        {/* Status Toggle */}
                        <button
                            onClick={() => {
                                const nextStatus: Record<TaskStatus, TaskStatus> = {
                                    TODO: 'IN_PROGRESS',
                                    IN_PROGRESS: 'DONE',
                                    DONE: 'TODO'
                                }
                                handleStatusChange(nextStatus[task.status])
                            }}
                            className="pt-0.5 hover:scale-110 transition-transform"
                            disabled={isPending}
                        >
                            {statusIcon[task.status]}
                        </button>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                            <h4 className={`
                                text-sm font-bold text-deep-blue
                                ${task.status === 'DONE' ? 'line-through text-slate-400' : ''}
                            `}>
                                {task.title}
                            </h4>
                            {task.description && (
                                <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                                    {task.description}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Actions Menu */}
                    <div className="relative">
                        <button
                            onClick={() => setShowMenu(!showMenu)}
                            className="p-1.5 rounded-lg hover:bg-slate-50 text-slate-400 hover:text-slate-600 transition-colors"
                        >
                            <MoreHorizontal size={16} />
                        </button>

                        {showMenu && (
                            <>
                                <div
                                    className="fixed inset-0 z-10"
                                    onClick={() => setShowMenu(false)}
                                />
                                <div className="absolute right-0 top-full mt-1 bg-white rounded-xl shadow-lg border border-slate-100 py-1 z-20 min-w-[140px]">
                                    <button
                                        onClick={() => {
                                            onEdit?.(task)
                                            setShowMenu(false)
                                        }}
                                        className="w-full px-4 py-2 text-left text-xs font-medium text-slate-600 hover:bg-slate-50"
                                    >
                                        Editar
                                    </button>
                                    <button
                                        onClick={handleDelete}
                                        className="w-full px-4 py-2 text-left text-xs font-medium text-rose-600 hover:bg-rose-50 flex items-center gap-2"
                                    >
                                        <Trash2 size={14} />
                                        Eliminar
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-50">
                    <TaskStatusBadge status={task.status} size="sm" />

                    {task.due_date && (
                        <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-medium">
                            <Calendar size={12} />
                            {new Date(task.due_date).toLocaleDateString('es-ES', {
                                day: 'numeric',
                                month: 'short'
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
