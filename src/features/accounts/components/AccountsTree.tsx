"use client";

import { useState } from "react";
import {
    ChevronRight,
    ChevronDown,
    Folder,
    Database,
    User,
    Search,
    Filter,
    MoreVertical,
    Download,
    CheckSquare,
    Square
} from "lucide-react";
import { Account, TreeState } from "../types";

interface Props {
    accounts: Account[];
    onSelect: (ids: string[]) => void;
    onRefresh?: () => void;
}

export function AccountsTree({ accounts, onSelect }: Props) {
    const [state, setState] = useState<TreeState>({
        expandedIds: [],
        selectedIds: [],
        searchQuery: "",
    });

    const toggleExpand = (id: string) => {
        setState(prev => ({
            ...prev,
            expandedIds: prev.expandedIds.includes(id)
                ? prev.expandedIds.filter(i => i !== id)
                : [...prev.expandedIds, id]
        }));
    };

    const toggleSelect = (id: string) => {
        const newSelected = state.selectedIds.includes(id)
            ? state.selectedIds.filter(i => i !== id)
            : [...state.selectedIds, id];

        setState(prev => ({ ...prev, selectedIds: newSelected }));
        onSelect(newSelected);
    };

    const renderIcon = (type: Account['type']) => {
        switch (type) {
            case 'GROUP': return <Folder className="text-amber-500" size={18} />;
            case 'CATEGORY': return <Database className="text-turq-primary" size={18} />;
            case 'ACCOUNT': return <User className="text-slate-400" size={18} />;
        }
    };

    const renderNode = (node: Account, level: number = 0) => {
        const isExpanded = state.expandedIds.includes(node.id);
        const isSelected = state.selectedIds.includes(node.id);
        const hasChildren = node.children && node.children.length > 0;

        if (state.searchQuery && !node.name.toLowerCase().includes(state.searchQuery.toLowerCase()) && !hasChildren) {
            return null;
        }

        return (
            <div key={node.id} className="select-none">
                <div
                    className={`
            flex items-center gap-2 py-2 px-3 rounded-lg cursor-pointer transition-colors
            ${isSelected ? 'bg-turq-primary/10' : 'hover:bg-slate-50'}
          `}
                    style={{ paddingLeft: `${level * 1.5 + 0.75}rem` }}
                    onClick={() => hasChildren ? toggleExpand(node.id) : toggleSelect(node.id)}
                >
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                        {hasChildren ? (
                            <button
                                onClick={(e) => { e.stopPropagation(); toggleExpand(node.id); }}
                                className="p-1 hover:bg-slate-200 rounded transition-colors"
                            >
                                {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                            </button>
                        ) : (
                            <div className="w-6" />
                        )}

                        <button
                            onClick={(e) => { e.stopPropagation(); toggleSelect(node.id); }}
                            className="text-slate-400 hover:text-turq-primary transition-colors"
                        >
                            {isSelected ? <CheckSquare size={16} className="text-turq-primary" /> : <Square size={16} />}
                        </button>

                        {renderIcon(node.type)}

                        <span className={`text-sm font-medium truncate ${isSelected ? 'text-turq-primary' : 'text-slate-700'}`}>
                            {node.name}
                        </span>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="hidden md:flex flex-col items-end">
                            <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-turq-primary"
                                    style={{ width: `${(node.quota.used / node.quota.limit) * 100}%` }}
                                />
                            </div>
                            <span className="text-[10px] text-slate-400 mt-0.5">
                                {node.quota.used} / {node.quota.limit}
                            </span>
                        </div>
                        <button className="p-1 text-slate-400 hover:text-slate-600">
                            <MoreVertical size={14} />
                        </button>
                    </div>
                </div>

                {hasChildren && isExpanded && (
                    <div className="mt-1">
                        {node.children?.map(child => renderNode(child, level + 1))}
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-full">
            {/* Header / Toolbar */}
            <div className="p-4 border-b border-slate-100 bg-slate-50/50 space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-sm font-black text-deep-blue uppercase tracking-wider">Account Tree</h3>
                    <div className="flex items-center gap-2">
                        <button className="p-2 text-slate-500 hover:bg-white hover:text-turq-primary rounded-xl border border-transparent hover:border-slate-200 transition-all shadow-sm">
                            <Download size={18} />
                        </button>
                        <button className="p-2 text-slate-500 hover:bg-white hover:text-turq-primary rounded-xl border border-transparent hover:border-slate-200 transition-all shadow-sm">
                            <Filter size={18} />
                        </button>
                    </div>
                </div>

                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input
                        type="text"
                        placeholder="Search accounts..."
                        className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-turq-primary/20 focus:border-turq-primary transition-all"
                        value={state.searchQuery}
                        onChange={(e) => setState(prev => ({ ...prev, searchQuery: e.target.value }))}
                    />
                </div>
            </div>

            {/* Tree Content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-1 custom-scrollbar">
                {accounts.map(account => renderNode(account))}
            </div>

            {/* Footer / Batch Actions */}
            {state.selectedIds.length > 0 && (
                <div className="p-4 bg-deep-blue text-white flex items-center justify-between animate-in slide-in-from-bottom duration-300">
                    <span className="text-xs font-bold">{state.selectedIds.length} accounts selected</span>
                    <div className="flex gap-2">
                        <button className="px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-xs font-bold transition-colors">
                            Batch Move
                        </button>
                        <button className="px-3 py-1.5 bg-turq-primary hover:bg-turq-light text-white rounded-lg text-xs font-bold transition-colors">
                            Export Selected
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
