"use client";

import { Search, Bell, Zap, Sparkles } from "lucide-react";

export default function DashboardHeader() {
    return (
        <header className="h-20 bg-white/40 backdrop-blur-xl border-b border-turq-primary/10 flex items-center justify-between px-10 sticky top-0 z-20">
            {/* Search Bar - Premium Glass Style */}
            <div className="flex-1 max-w-2xl">
                <div className="relative group">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-turq-primary to-turq-secondary rounded-2xl blur opacity-0 group-focus-within:opacity-10 transition duration-500"></div>
                    <div className="relative flex items-center bg-white/50 border border-turq-primary/10 rounded-2xl group-focus-within:bg-white transition-all duration-300">
                        <Search className="absolute left-4 text-slate-400 group-focus-within:text-turq-primary transition-colors" size={18} />
                        <input
                            type="text"
                            placeholder="Pregúntale a Contractor IA..."
                            className="w-full bg-transparent py-3 pl-12 pr-4 text-sm text-deep-blue focus:outline-none placeholder:text-slate-400 font-medium"
                        />
                        <div className="pr-4 flex items-center gap-2">
                            <kbd className="hidden sm:inline-flex h-5 items-center gap-1 rounded border border-slate-200 bg-slate-50 px-1.5 font-mono text-[10px] font-medium text-slate-400">
                                <span className="text-xs">⌘</span>K
                            </kbd>
                        </div>
                    </div>
                </div>
            </div>

            {/* AI Utilities */}
            <div className="flex items-center gap-6">
                <div className="flex items-center gap-2 border-r border-slate-200 pr-6">
                    <button className="w-10 h-10 rounded-xl hover:bg-turq-primary/5 flex items-center justify-center text-slate-400 hover:text-turq-primary transition-all group">
                        <Zap size={20} className="group-hover:fill-turq-primary/10" />
                    </button>
                    <button className="w-10 h-10 rounded-xl hover:bg-turq-primary/5 flex items-center justify-center text-slate-400 hover:text-turq-primary transition-all relative group">
                        <Sparkles size={20} className="group-hover:fill-turq-primary/10" />
                        <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-turq-primary rounded-full border-2 border-white"></span>
                    </button>
                    <button className="w-10 h-10 rounded-xl hover:bg-turq-primary/5 flex items-center justify-center text-slate-400 hover:text-turq-primary transition-all group">
                        <Bell size={20} className="group-hover:fill-turq-primary/10" />
                    </button>
                </div>

                <div className="flex items-center gap-3 pl-2">
                    <div className="flex flex-col items-end mr-1 hidden sm:flex">
                        <span className="text-xs font-black text-deep-blue leading-none">Admin</span>
                        <span className="text-[10px] font-bold text-slate-400">Standard Plan</span>
                    </div>
                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-turq-primary to-turq-secondary p-[1px] shadow-sm transform hover:scale-105 transition-transform duration-300">
                        <div className="w-full h-full rounded-2xl bg-white flex items-center justify-center overflow-hidden">
                            <img
                                src="https://i.pravatar.cc/150?u=sam"
                                alt="User"
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}
