import { Clock, Shield, User, Info, Calendar, Filter, ArrowUpRight } from "lucide-react";
import { getAuditLogs } from "@/app/actions/audit";
import { getUserProfile } from "@/app/actions/auth";
import { createClient } from "@/utils/supabase/server";
import { getTranslations } from "next-intl/server";

export default async function AuditPage({
    params,
}: {
    params: Promise<{ locale: string; tenant: string }>;
}) {
    const { locale, tenant } = await params;
    const profile = await getUserProfile();
    const companyId = profile?.companyId;
    const t = await getTranslations("Audit");
    const tc = await getTranslations("Common");

    if (!companyId) return <div>{tc("unauthorized")}</div>;

    const logs = await getAuditLogs(companyId);

    const getActionBadgeColor = (action: string) => {
        if (action.includes('CREATED')) return 'bg-emerald-50 text-emerald-600 border-emerald-100';
        if (action.includes('DELETED')) return 'bg-rose-50 text-rose-600 border-rose-100';
        if (action.includes('UPDATED')) return 'bg-amber-50 text-amber-600 border-amber-100';
        if (action.includes('SIGNED')) return 'bg-purple-50 text-purple-600 border-purple-100';
        return 'bg-blue-50 text-blue-600 border-blue-100';
    };

    return (
        <div className="p-8 space-y-10 max-w-7xl mx-auto font-outfit">
            {/* Header Content */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div className="space-y-2">
                    <div className="flex items-center gap-2 text-turq-primary font-black text-xs uppercase tracking-widest mb-2">
                        <Shield size={16} />
                        {t("subtitle")}
                    </div>
                    <h1 className="text-4xl font-[900] text-deep-blue tracking-tight">
                        {t("title")}
                    </h1>
                    <p className="text-slate-500 font-medium font-inter">
                        {t("description")}
                    </p>
                </div>

                <div className="flex gap-3">
                    <button className="flex items-center gap-2 px-5 py-2.5 bg-white border border-turq-primary/10 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all">
                        <Filter size={16} />
                        {t("actions.filter")}
                    </button>
                    <button className="flex items-center gap-2 px-5 py-2.5 bg-deep-blue text-white rounded-xl text-xs font-bold hover:bg-deep-blue/90 transition-all">
                        <ArrowUpRight size={16} />
                        {t("actions.export")}
                    </button>
                </div>
            </div>

            {/* Audit Logs List */}
            <div className="pro-card bg-white/80 backdrop-blur-xl rounded-[2.5rem] border border-turq-primary/5 shadow-2xl shadow-turq-primary/5 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50 border-b border-turq-primary/5">
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">{t("table.timestamp")}</th>
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">{t("table.action")}</th>
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">{t("table.user")}</th>
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">{t("table.details")}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-turq-primary/5">
                            {logs.map((log) => (
                                <tr key={log.id} className="hover:bg-turq-primary/5 transition-colors group">
                                    <td className="px-8 py-6">
                                        <div className="flex flex-col">
                                            <span className="text-sm font-bold text-deep-blue">
                                                {new Date(log.created_at).toLocaleDateString(locale)}
                                            </span>
                                            <span className="text-[10px] font-medium text-slate-400 tabular-nums">
                                                {new Date(log.created_at).toLocaleTimeString(locale)}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest border ${getActionBadgeColor(log.action)}`}>
                                            {log.action.replace(/_/g, ' ')}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-turq-primary/10 flex items-center justify-center text-turq-primary font-black text-xs uppercase">
                                                {log.actor?.full_name?.charAt(0) || 'U'}
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-sm font-bold text-deep-blue">
                                                    {log.actor?.full_name || t("system")}
                                                </span>
                                                <span className="text-[10px] font-medium text-slate-400">
                                                    {log.actor?.email}
                                                </span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="max-w-xs overflow-hidden text-ellipsis">
                                            <pre className="text-[10px] font-inter text-slate-500 bg-slate-50 p-2 rounded-lg border border-slate-100 overflow-x-auto">
                                                {JSON.stringify(log.metadata, null, 2)}
                                            </pre>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
