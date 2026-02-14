"use client";

import { useEstimate } from "./EstimateContext";
import { Sparkles, Save, Send, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export function EstimateBuilderHeader() {
    const { estimate } = useEstimate();

    return (
        <header className="h-20 border-b border-primary/10 bg-white flex items-center justify-between px-8 z-10 shadow-sm relative">
            <div className="flex items-center gap-4">
                <Link href="/[locale]/[tenant]/dashboard" className="pro-button !p-2 !bg-transparent !text-slate-400 hover:!text-turq-primary">
                    ←
                </Link>
                <div className="bg-turq-primary p-2.5 rounded-xl shadow-lg shadow-turq-primary/30">
                    <Sparkles className="text-deep-blue" size={24} />
                </div>
                <div>
                    <h1 className="text-xl font-[900] text-deep-blue tracking-tight font-outfit">
                        Neural <span className="text-turq-primary">Builder</span>
                    </h1>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">AI-Powered Estimator</p>
                </div>
            </div>

            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 px-4 py-1.5 bg-emerald-50 text-emerald-600 rounded-full border border-emerald-100">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span className="text-[10px] font-black uppercase tracking-widest">Live Syncing</span>
                </div>

                <button className="px-5 py-2.5 border border-slate-200 rounded-xl text-slate-500 font-bold text-sm hover:bg-slate-50 hover:text-deep-blue transition-colors flex items-center gap-2">
                    <Save size={18} />
                    Guardar Borrador
                </button>

                <button className="pro-button shadow-xl shadow-turq-primary/20 !py-2.5 !px-6 text-sm flex items-center gap-2">
                    <Send size={18} />
                    Finalizar y Enviar
                </button>
            </div>
        </header>
    );
}
