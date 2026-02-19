'use client'

import { ProjectProgress } from '@/types/domain'

interface ProjectProgressBarProps {
    progress: ProjectProgress
    showDetails?: boolean
}

export default function ProjectProgressBar({ progress, showDetails = true }: ProjectProgressBarProps) {
    const { total, done, inProgress, todo, percent } = progress

    if (total === 0) {
        return (
            <div className="flex items-center gap-3">
                <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full w-0 bg-slate-300 rounded-full" />
                </div>
                <span className="text-[10px] font-black text-slate-400 uppercase">
                    Sin tareas
                </span>
            </div>
        )
    }

    return (
        <div className="space-y-2">
            {/* Progress Bar */}
            <div className="flex items-center gap-3">
                <div className="flex-1 h-3 bg-slate-100 rounded-full overflow-hidden flex">
                    {/* Done portion */}
                    <div
                        className="h-full bg-emerald-500 transition-all duration-500"
                        style={{ width: `${(done / total) * 100}%` }}
                    />
                    {/* In Progress portion */}
                    <div
                        className="h-full bg-amber-400 transition-all duration-500"
                        style={{ width: `${(inProgress / total) * 100}%` }}
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
                <div className="flex items-center gap-4 text-[10px] font-bold">
                    <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full bg-emerald-500" />
                        <span className="text-slate-500">{done} completadas</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full bg-amber-400" />
                        <span className="text-slate-500">{inProgress} en progreso</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full bg-slate-300" />
                        <span className="text-slate-500">{todo} pendientes</span>
                    </div>
                </div>
            )}
        </div>
    )
}
