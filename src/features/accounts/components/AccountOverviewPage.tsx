"use client";

import { useState } from "react";
import { AccountsTree } from "./AccountsTree";
import { Account } from "../types";
import {
    Users,
    BarChart3,
    Database,
    ArrowUpRight,
    Plus,
    CloudUpload
} from "lucide-react";

const MOCK_ACCOUNTS: Account[] = [
    {
        id: "g1",
        name: "North America Division",
        type: "GROUP",
        status: "ACTIVE",
        quota: { used: 850, limit: 1200 },
        children: [
            {
                id: "c1",
                name: "Enterprise Clients",
                type: "CATEGORY",
                status: "ACTIVE",
                quota: { used: 400, limit: 500 },
                children: [
                    { id: "a1", name: "Apple Inc", type: "ACCOUNT", status: "ACTIVE", quota: { used: 150, limit: 200 } },
                    { id: "a2", name: "Microsoft Corp", type: "ACCOUNT", status: "ACTIVE", quota: { used: 250, limit: 300 } },
                ]
            },
            {
                id: "c2",
                name: "SMB Accounts",
                type: "CATEGORY",
                status: "ACTIVE",
                quota: { used: 450, limit: 700 },
                children: [
                    { id: "a3", name: "Local Gym", type: "ACCOUNT", status: "ACTIVE", quota: { used: 50, limit: 100 } },
                ]
            }
        ]
    },
    {
        id: "g2",
        name: "Europe Operations",
        type: "GROUP",
        status: "ACTIVE",
        quota: { used: 200, limit: 1000 },
        children: []
    }
];

export function AccountOverviewPage() {
    const [selectedIds, setSelectedIds] = useState<string[]>([]);

    const stats = [
        { label: "Total Accounts", value: "1,284", icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
        { label: "Active Quota", value: "72.4%", icon: BarChart3, color: "text-turq-primary", bg: "bg-turq-primary/10" },
        { label: "Storage Used", value: "2.4 TB", icon: Database, color: "text-amber-600", bg: "bg-amber-50" },
    ];

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-deep-blue tracking-tight font-outfit">
                        Account <span className="text-turq-primary">Overview</span>
                    </h1>
                    <p className="text-slate-500 font-medium mt-1">Manage hierarchical structures and global quotas.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl font-bold text-sm hover:bg-slate-50 transition-all shadow-sm">
                        <CloudUpload size={18} />
                        Batch Import
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2.5 bg-turq-primary text-white rounded-xl font-bold text-sm hover:bg-turq-light transition-all shadow-md shadow-turq-primary/20">
                        <Plus size={18} />
                        New Account
                    </button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {stats.map((stat, i) => (
                    <div key={i} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between group hover:border-turq-primary/20 transition-all">
                        <div className="flex items-center gap-4">
                            <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                                <stat.icon size={24} />
                            </div>
                            <div>
                                <p className="text-xs font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
                                <p className="text-2xl font-black text-deep-blue mt-0.5">{stat.value}</p>
                            </div>
                        </div>
                        <ArrowUpRight className="text-slate-200 group-hover:text-turq-primary transition-colors" size={20} />
                    </div>
                ))}
            </div>

            {/* Main Content Area */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left: Tree View (Sidepanel style) */}
                <div className="lg:col-span-4 h-[700px]">
                    <AccountsTree accounts={MOCK_ACCOUNTS} onSelect={setSelectedIds} />
                </div>

                {/* Right: Details / Selection Context */}
                <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 shadow-sm p-8 flex flex-col items-center justify-center text-center">
                    {selectedIds.length === 0 ? (
                        <div className="max-w-md space-y-4">
                            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto text-slate-300">
                                <Users size={40} />
                            </div>
                            <h3 className="text-xl font-black text-deep-blue">No Account Selected</h3>
                            <p className="text-slate-500">
                                Select an account from the tree on the left to view detailed metrics,
                                user logs, and specific configurations for that entity.
                            </p>
                        </div>
                    ) : (
                        <div className="w-full h-full flex flex-col">
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="text-xl font-black text-deep-blue">
                                    Selected Analysis ({selectedIds.length})
                                </h3>
                                <span className="px-3 py-1 bg-turq-primary/10 text-turq-primary text-xs font-black rounded-full uppercase">
                                    Batch Mode
                                </span>
                            </div>

                            <div className="flex-1 border-2 border-dashed border-slate-100 rounded-3xl flex items-center justify-center">
                                <p className="text-slate-400 font-medium">Detailed metrics for selected IDs will be displayed here.</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
