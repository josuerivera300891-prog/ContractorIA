import { Plus, TrendingUp, Clock, AlertCircle, Briefcase, FileText, Users, Receipt } from "lucide-react";
import { createClient } from "@/utils/supabase/server";
import { getUserProfile } from "@/app/actions/auth";
import { getTranslations } from "next-intl/server";
import { ProfitabilityCard } from "@/components/ProfitabilityCard";

export default async function TenantDashboard({ params }: { params: Promise<{ tenant: string }> }) {
    const { tenant } = await params;
    const supabase = await createClient();
    const profile = await getUserProfile();
    const companyId = profile?.companyId;
    const t = await getTranslations("Dashboard");

    // Fetch real metrics from Supabase
    const { count: projectsCount } = await supabase
        .from('projects')
        .select('*', { count: 'exact', head: true })
        .eq('company_id', companyId);

    const { count: clientsCount } = await supabase
        .from('clients')
        .select('*', { count: 'exact', head: true })
        .eq('company_id', companyId);

    // Estimates and Revenue
    const { data: estimates } = await supabase
        .from('estimates')
        .select('total, status')
        .eq('company_id', companyId)
        .neq('status', 'CANCELED');

    const estimatesCount = estimates?.length || 0;
    const totalRevenue = estimates?.reduce((acc, est) => acc + Number(est.total), 0) || 0;

    // Expenses
    const { data: expensesData } = await supabase
        .from('expenses')
        .select('amount')
        .eq('company_id', companyId);

    const totalExpenses = expensesData?.reduce((acc, exp) => acc + Number(exp.amount), 0) || 0;

    // Profitability calc for aggregated view
    const margin = totalRevenue - totalExpenses;
    const marginPercent = totalRevenue > 0 ? (margin / totalRevenue) * 100 : 0;

    const stats = [
        {
            title: t("projects"),
            value: projectsCount?.toString() || "0",
            change: "+12%",
            icon: Briefcase,
            color: "turq"
        },
        {
            title: t("estimates"),
            value: estimatesCount.toString(),
            change: "+5%",
            icon: FileText,
            color: "blue"
        },
        {
            title: t("clients"),
            value: clientsCount?.toString() || "0",
            change: "+8%",
            icon: Users,
            color: "indigo"
        },
        {
            title: "Gastos Totales",
            value: `$${(totalExpenses / 1000).toFixed(1)}k`,
            change: "-2%",
            icon: Receipt,
            color: "rose"
        },
    ];

    return (
        <div className="space-y-10 font-outfit">
            {/* Contextual Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-4xl font-[900] text-deep-blue tracking-tight mb-2">
                        {t("welcome")}, <span className="text-turq-primary capitalize">{profile?.user?.user_metadata?.first_name || 'User'}</span>
                    </h1>
                    <p className="text-slate-500 font-medium font-inter">
                        {t("infrastructure")} • <span className="text-deep-blue font-bold opacity-80">{tenant}</span>
                    </p>
                </div>
                <button className="pro-button shadow-xl shadow-turq-primary/20 group animate-in fade-in slide-in-from-right duration-500">
                    <Plus size={18} className="group-hover:rotate-90 transition-transform duration-500" />
                    Nuevo Presupuesto
                </button>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, i) => (
                    <div key={i} className="pro-card group hover:scale-[1.02] transition-transform duration-300">
                        <div className="flex justify-between items-start mb-4">
                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors duration-300 ${stat.color === 'rose' ? 'bg-rose-50 text-rose-500 group-hover:bg-rose-500 group-hover:text-white' : 'bg-turq-primary/10 text-turq-primary group-hover:bg-turq-primary group-hover:text-white'
                                }`}>
                                <stat.icon size={22} strokeWidth={2.5} />
                            </div>
                            <span className={`text-[10px] font-black px-2 py-1 rounded-lg ${stat.color === 'rose' ? 'text-rose-500 bg-rose-50' : 'text-emerald-500 bg-emerald-50'}`}>
                                {stat.change}
                            </span>
                        </div>
                        <h3 className="text-3xl font-[900] text-deep-blue mb-1 leading-none tracking-tight">
                            {stat.value}
                        </h3>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                            {stat.title}
                        </p>
                    </div>
                ))}
            </div>

            {/* Operational Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Profitability Activity */}
                <div className="lg:col-span-2">
                    <ProfitabilityCard data={{
                        revenue: totalRevenue,
                        totalExpenses: totalExpenses,
                        margin: margin,
                        marginPercent: marginPercent
                    }} />
                </div>

                {/* Status Column */}
                <div className="space-y-6">
                    <div className="pro-card bg-deep-blue p-8 text-white relative overflow-hidden group rounded-[2.5rem]">
                        <div className="relative z-10">
                            <h4 className="text-lg font-bold mb-2 font-outfit">Suscripción SaaS</h4>
                            <p className="text-blue-100/60 text-sm mb-6 font-medium font-inter">Tu empresa está bajo el plan <span className="text-turq-primary font-black">Unlimited PRO</span>.</p>
                            <div className="space-y-3 mb-6">
                                <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-blue-200/50">
                                    <span>Presupuestos IA</span>
                                    <span>Ilimitado</span>
                                </div>
                                <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                                    <div className="h-full bg-turq-primary w-full" />
                                </div>
                            </div>
                            <button className="w-full py-3 bg-white/10 hover:bg-white/20 border border-white/10 rounded-xl font-black text-xs uppercase tracking-widest transition-all">
                                Ver Facturación
                            </button>
                        </div>
                        <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-turq-primary opacity-10 rounded-full blur-3xl group-hover:opacity-20 transition-opacity" />
                    </div>

                    <div className="pro-card p-6 border-turq-primary/10 rounded-[2.5rem]">
                        <h4 className="text-sm font-black text-deep-blue uppercase tracking-widest mb-6 flex items-center gap-2">
                            <Clock size={16} className="text-turq-primary" />
                            Actividad Reciente
                        </h4>
                        <div className="space-y-4 font-inter text-center py-6">
                            <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mx-auto text-slate-300 mb-2">
                                <AlertCircle size={24} />
                            </div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Sin alertas críticas</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
