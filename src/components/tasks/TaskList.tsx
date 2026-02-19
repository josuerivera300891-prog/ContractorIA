'use client'

import { useState } from 'react'
import { ProjectTask, TaskStatus } from '@/types/domain'
import TaskCard from './TaskCard'
import CreateTaskModal from './CreateTaskModal'
import { Plus, ListTodo, Clock, CheckCircle2 } from 'lucide-react'

interface TaskListProps {
    tasks: ProjectTask[]
    projectId: string
    companyId: string
}

export default function TaskList({ tasks, projectId, companyId }: TaskListProps) {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingTask, setEditingTask] = useState<ProjectTask | null>(null)
    const [viewMode, setViewMode] = useState<'list' | 'kanban'>('list')

    // Group tasks by status
    const groupedTasks = {
        TODO: tasks.filter(t => t.status === 'TODO'),
        IN_PROGRESS: tasks.filter(t => t.status === 'IN_PROGRESS'),
        DONE: tasks.filter(t => t.status === 'DONE')
    }

    const handleEdit = (task: ProjectTask) => {
        setEditingTask(task)
        setIsModalOpen(true)
    }

    const handleCloseModal = () => {
        setIsModalOpen(false)
        setEditingTask(null)
    }

    const columnConfig: Record<TaskStatus, { icon: React.ReactNode; label: string; color: string }> = {
        TODO: {
            icon: <ListTodo size={16} />,
            label: 'Por hacer',
            color: 'text-slate-500 bg-slate-50'
        },
        IN_PROGRESS: {
            icon: <Clock size={16} />,
            label: 'En progreso',
            color: 'text-amber-500 bg-amber-50'
        },
        DONE: {
            icon: <CheckCircle2 size={16} />,
            label: 'Completadas',
            color: 'text-emerald-500 bg-emerald-50'
        }
    }

    if (tasks.length === 0) {
        return (
            <>
                <div className="py-16 text-center border-2 border-dashed border-slate-100 rounded-[2rem]">
                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-200 mx-auto mb-6">
                        <ListTodo size={32} />
                    </div>
                    <p className="text-sm font-bold text-slate-400 mb-4 uppercase tracking-widest">
                        No hay tareas programadas
                    </p>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="px-6 py-3 bg-deep-blue text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-turq-primary transition-all"
                    >
                        Crear Primera Tarea
                    </button>
                </div>

                <CreateTaskModal
                    projectId={projectId}
                    companyId={companyId}
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    editTask={editingTask}
                />
            </>
        )
    }

    return (
        <>
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                    {/* View Toggle */}
                    <div className="flex bg-slate-100 rounded-xl p-1">
                        <button
                            onClick={() => setViewMode('list')}
                            className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                                viewMode === 'list'
                                    ? 'bg-white text-deep-blue shadow-sm'
                                    : 'text-slate-500 hover:text-deep-blue'
                            }`}
                        >
                            Lista
                        </button>
                        <button
                            onClick={() => setViewMode('kanban')}
                            className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                                viewMode === 'kanban'
                                    ? 'bg-white text-deep-blue shadow-sm'
                                    : 'text-slate-500 hover:text-deep-blue'
                            }`}
                        >
                            Kanban
                        </button>
                    </div>

                    <span className="text-xs text-slate-400 font-medium">
                        {tasks.length} tarea{tasks.length !== 1 ? 's' : ''}
                    </span>
                </div>

                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 px-4 py-2.5 bg-turq-primary text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-deep-blue transition-all"
                >
                    <Plus size={14} />
                    Nueva Tarea
                </button>
            </div>

            {/* Kanban View */}
            {viewMode === 'kanban' && (
                <div className="grid grid-cols-3 gap-4">
                    {(['TODO', 'IN_PROGRESS', 'DONE'] as TaskStatus[]).map((status) => (
                        <div key={status} className="space-y-3">
                            {/* Column Header */}
                            <div className={`flex items-center gap-2 px-3 py-2 rounded-xl ${columnConfig[status].color}`}>
                                {columnConfig[status].icon}
                                <span className="text-[10px] font-black uppercase tracking-widest">
                                    {columnConfig[status].label}
                                </span>
                                <span className="ml-auto text-[10px] font-bold opacity-60">
                                    {groupedTasks[status].length}
                                </span>
                            </div>

                            {/* Cards */}
                            <div className="space-y-3 min-h-[200px]">
                                {groupedTasks[status].map((task) => (
                                    <TaskCard
                                        key={task.id}
                                        task={task}
                                        companyId={companyId}
                                        onEdit={handleEdit}
                                    />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* List View */}
            {viewMode === 'list' && (
                <div className="space-y-3">
                    {tasks.map((task) => (
                        <TaskCard
                            key={task.id}
                            task={task}
                            companyId={companyId}
                            onEdit={handleEdit}
                        />
                    ))}
                </div>
            )}

            {/* Modal */}
            <CreateTaskModal
                projectId={projectId}
                companyId={companyId}
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                editTask={editingTask}
            />
        </>
    )
}
