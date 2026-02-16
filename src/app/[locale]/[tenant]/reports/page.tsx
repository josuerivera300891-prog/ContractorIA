"use client";

import { use } from "react";
import { BarChart3, TrendingUp, PieChart, Activity, Download, Calendar } from "lucide-react";
import { useTranslations } from "next-intl";

export default function ReportsPage({ params }: { params: Promise<{ tenant: string }> }) {
    const { tenant } = use(params);
    const t = useTranslations("Reports");
    const tc = useTranslations("Common");

    return (
        <div className="space-y-10">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-4xl font-[900] text-deep-blue tracking-tight mb-2 font-outfit">
                        {t.rich("title", {
                            span: (chunks) => <span className="text-turq-primary">{chunks}</span>
                        })}
                    </h1>
                    <p className="text-slate-500 font-medium font-inter">
                        {t("description", { tenant })}
                    </p>
                </div>
                <div className="flex gap-3">
                    <button className="pro-card !py-3 !px-6 text-sm font-bold flex items-center gap-2 border-turq-primary/10 hover:border-turq-primary transition-all">
                        <Calendar size={18} />
                        {t("filters.this_month")}
                    </button>
                    <button className="pro-button shadow-xl shadow-turq-primary/20 !py-3 !px-6 text-sm">
                        <Download size={18} />
                        {t("actions.export")}
                    </button>
                </div>
            </div>

            {/* Main Metrics Group */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="pro-card bg-white/60 p-8 flex flex-col items-center text-center group">
                    <div className="w-16 h-16 rounded-3xl bg-turq-primary/10 text-turq-primary flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform">
                        <TrendingUp size={32} />
                    </div>
                    <h3 className="text-4xl font-[900] text-deep-blue mb-1 font-outfit">+$420k</h3>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">{t("metrics.projected_revenue")}</p>
                    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-turq-primary h-full w-[75%]"></div>
                    </div>
                </div>

                <div className="pro-card bg-white/60 p-8 flex flex-col items-center text-center group">
                    <div className="w-16 h-16 rounded-3xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform">
                        <PieChart size={32} />
                    </div>
                    <h3 className="text-4xl font-[900] text-deep-blue mb-1 font-outfit">82%</h3>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">{t("metrics.acceptance_rate")}</p>
                    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-emerald-500 h-full w-[82%]"></div>
                    </div>
                </div>

                <div className="pro-card bg-white/60 p-8 flex flex-col items-center text-center group">
                    <div className="w-16 h-16 rounded-3xl bg-turq-secondary/10 text-turq-secondary flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform">
                        <Activity size={32} />
                    </div>
                    <h3 className="text-4xl font-[900] text-deep-blue mb-1 font-outfit">1.2s</h3>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">{t("metrics.latency")}</p>
                    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-turq-secondary h-full w-[95%]"></div>
                    </div>
                </div>
            </div>

            {/* Reports Detail Area */}
            <div className="pro-card bg-white/60 p-8 min-h-[400px]">
                <div className="flex items-center justify-between mb-10">
                    <h2 className="text-xl font-[900] text-deep-blue font-outfit flex items-center gap-3">
                        <BarChart3 className="text-turq-primary" size={24} />
                        {t("charts.performance_history")}
                    </h2>
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-turq-primary"></div>
                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider">{t("charts.approved")}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-slate-200"></div>
                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider">{t("charts.pending")}</span>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col items-center justify-center py-20 bg-slate-50/30 rounded-[40px] border border-dashed border-turq-primary/10">
                    <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center text-slate-200 shadow-sm mb-6">
                        <BarChart3 size={32} />
                    </div>
                    <p className="text-slate-400 font-bold font-outfit uppercase tracking-widest">{t("loading.activating")}</p>
                    <p className="text-xs text-slate-400 mt-2">{t("loading.modules")}</p>
                </div>
            </div>
        </div>
    );
}
