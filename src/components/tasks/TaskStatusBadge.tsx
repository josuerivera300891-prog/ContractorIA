'use client'

import { TaskStatus } from '@/types/domain'

interface TaskStatusBadgeProps {
    status: TaskStatus
    size?: 'sm' | 'md'
}

const statusConfig = {
    TODO: {
        label: 'Por hacer',
        bg: 'bg-slate-100',
        text: 'text-slate-600',
        border: 'border-slate-200'
    },
    IN_PROGRESS: {
        label: 'En progreso',
        bg: 'bg-amber-50',
        text: 'text-amber-600',
        border: 'border-amber-200'
    },
    DONE: {
        label: 'Completada',
        bg: 'bg-emerald-50',
        text: 'text-emerald-600',
        border: 'border-emerald-200'
    }
}

export default function TaskStatusBadge({ status, size = 'md' }: TaskStatusBadgeProps) {
    const config = statusConfig[status]
    const sizeClasses = size === 'sm'
        ? 'px-2 py-0.5 text-[9px]'
        : 'px-3 py-1 text-[10px]'

    return (
        <span className={`
            ${sizeClasses}
            ${config.bg} ${config.text}
            border ${config.border}
            font-black uppercase tracking-widest
            rounded-full
        `}>
            {config.label}
        </span>
    )
}
