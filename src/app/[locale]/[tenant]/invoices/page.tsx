import { createClient } from "@/lib/supabase/server";
import { getUserProfile } from "@/app/actions/auth";
import { Receipt, CreditCard, Clock, ExternalLink, Search } from "lucide-react";
import Link from "next/link";
import { getTranslations } from "next-intl/server";

export default async function InvoicesPage({
    params,
}: {
    params: Promise<{ tenant: string; locale: string }>;
}) {
    const { tenant, locale } = await params;
    const supabase = await createClient();
    const t = await getTranslations("Invoices");
    const tc = await getTranslations("Common");

    // Secure: get company_id from authenticated user profile
    const profile = await getUserProfile();
    if (!profile?.companyId) {
        return <div className="p-8 text-center text-slate-400">{tc("unauthorized")}</div>;
    }

    const { data: invoices } = await supabase
        .from("invoices")
        .select(`
            *,
            clients (
                first_name,
                last_name,
                company_name
            )
        `)
        .eq("company_id", profile.companyId)
        .order("created_at", { ascending: false });

    const statusBadge = (status: string) => {
        switch (status) {
            case "PAID":
                return "bg-emerald-100 text-emerald-600";
            case "UNPAID":
                return "bg-amber-100 text-amber-600";
            case "OVERDUE":
                return "bg-rose-100 text-rose-600";
            case "PARTIAL":
                return "bg-blue-100 text-blue-600";
            default:
                return "bg-slate-100 text-slate-500";
        }
    };

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
            </div>

            {/* Invoices List */}
            <div className="pro-card bg-white/60 p-8 min-h-[500px] relative overflow-hidden group">
                <div className="absolute -top-24 -right-24 w-96 h-96 bg-turq-primary/5 rounded-full blur-[100px]"></div>

                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10 relative z-10 font-outfit">
                    <h2 className="text-xl font-[900] text-deep-blue flex items-center gap-3">
                        <Receipt className="text-turq-primary" size={24} />
                        {t("history")}
                    </h2>
                    <div className="flex gap-3 w-full md:w-auto font-inter">
                        <div className="relative flex-1 md:w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                            <input type="text" placeholder={t("search_placeholder")} className="w-full pl-10 pr-4 py-2 rounded-xl border border-turq-primary/10 bg-white/5 text-sm font-medium" />
                        </div>
                    </div>
                </div>

                {(invoices && invoices.length > 0) ? (
                    <div className="relative z-10 overflow-x-auto font-inter">
                        <table className="w-full">
                            <thead>
                                <tr className="text-left border-b border-slate-50">
                                    <th className="pb-4 text-[10px] font-black uppercase tracking-widest text-slate-400">{t("table.folio")}</th>
                                    <th className="pb-4 text-[10px] font-black uppercase tracking-widest text-slate-400">{t("table.client")}</th>
                                    <th className="pb-4 text-[10px] font-black uppercase tracking-widest text-slate-400">{t("table.status")}</th>
                                    <th className="pb-4 text-[10px] font-black uppercase tracking-widest text-slate-400">{t("table.due_date")}</th>
                                    <th className="pb-4 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">{t("table.total")}</th>
                                    <th className="pb-4 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">{t("table.balance")}</th>
                                    <th className="pb-4 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">{t("table.actions")}</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {invoices.map((inv) => (
                                    <tr key={inv.id} className="group/row hover:bg-turq-primary/[0.02] transition-colors">
                                        <td className="py-5">
                                            <Link
                                                href={`/${locale}/${tenant}/invoices/${inv.id}`}
                                                className="font-bold text-deep-blue text-sm hover:text-turq-primary transition-colors"
                                            >
                                                #{inv.invoice_number}
                                            </Link>
                                        </td>
                                        <td className="py-5 text-sm text-slate-600 font-medium">
                                            {inv.clients
                                                ? `${(inv.clients as any).first_name} ${(inv.clients as any).last_name || ""}`
                                                : "—"}
                                        </td>
                                        <td className="py-5">
                                            <span className={`px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest uppercase ${statusBadge(inv.status)}`}>
                                                {t(`status_labels.${inv.status.toLowerCase()}`)}
                                            </span>
                                        </td>
                                        <td className="py-5 text-sm text-slate-500 font-medium">
                                            <span className="flex items-center gap-2">
                                                <Clock size={14} className="text-slate-300" />
                                                {inv.due_date ? new Date(inv.due_date).toLocaleDateString() : "---"}
                                            </span>
                                        </td>
                                        <td className="py-5 text-right font-black text-deep-blue text-sm">${Number(inv.total).toFixed(2)}</td>
                                        <td className="py-5 text-right font-black text-amber-600 text-sm">
                                            ${Number(inv.balance_due).toFixed(2)}
                                        </td>
                                        <td className="py-5 text-right">
                                            <Link
                                                href={`/${locale}/${tenant}/invoices/${inv.id}`}
                                                className="inline-flex items-center gap-2 px-4 py-2 bg-deep-blue text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-turq-primary transition-all"
                                            >
                                                <ExternalLink size={12} />
                                                {t("view_detail")}
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="py-20 text-center">
                        <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center text-slate-200 mx-auto mb-6">
                            <Receipt size={40} />
                        </div>
                        <h3 className="text-xl font-black text-slate-400 uppercase tracking-widest font-outfit mb-2">{t("empty.title")}</h3>
                        <p className="text-sm text-slate-500 max-w-xs mx-auto font-medium font-inter">{t("empty.description")}</p>
                    </div>
                )}
            </div>
        </div>
    );
}
