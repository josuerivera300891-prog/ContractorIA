import { Briefcase, BarChart3, Clock, Plus, Search, Filter, PlusCircle } from "lucide-react";
import Link from "next/link";
import { getUserProfile } from "@/app/actions/auth";
import { getProjects } from "@/app/actions/projects";
import { getTranslations } from "next-intl/server";

export default async function ProjectsPage({ params }: { params: Promise<{ locale: string; tenant: string }> }) {
    const { locale, tenant } = await params;
    const profile = await getUserProfile();
    const companyId = profile?.companyId;
    const t = await getTranslations("Projects");
    const tc = await getTranslations("Common");

    const projects = companyId ? await getProjects(companyId) : [];

    const stats = [
        { label: t("stats.in_progress"), value: projects.filter(p => p.status === 'IN_PROGRESS').length.toString(), icon: Briefcase, color: "turq" },
        { label: t("stats.completed"), value: projects.filter(p => p.status === 'COMPLETED').length.toString(), icon: BarChart3, color: "turq" },
        { label: t("stats.pending"), value: projects.filter(p => p.status === 'PLANNING').length.toString(), icon: Clock, color: "turq" }
    ];

    return (
        <div className="space-y-10 font-outfit">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-4xl font-[900] text-deep-blue tracking-tight mb-2">
                        {t.rich("title", {
                            span: (chunks) => <span className="text-turq-primary">{chunks}</span>
                        })}
                    </h1>
                    <p className="text-slate-500 font-medium font-inter">
                        {t("description", { tenant })}
                    </p>
                </div>
                <Link href={`/${locale}/${tenant}/projects/new`}>
                    <button className="pro-button shadow-xl shadow-turq-primary/20 group !py-3 !px-6 text-sm">
                        <Plus size={18} className="group-hover:rotate-90 transition-transform duration-500" />
                        {t("add_button")}
                    </button>
                </Link>
            </div>

            {/* Stats Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {stats.map((stat, i) => (
                    <div key={i} className="pro-card bg-white/60 p-6 border-turq-primary/5">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-turq-primary/10 flex items-center justify-center text-turq-primary">
                                <stat.icon size={22} />
                            </div>
                            <div>
                                <h3 className="text-2xl font-[900] text-deep-blue">{stat.value}</h3>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Main Content Area */}
            <div className="pro-card bg-white/60 p-8 min-h-[400px] flex flex-col">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                    <h2 className="text-xl font-[900] text-deep-blue flex items-center gap-3">
                        <Briefcase className="text-turq-primary" size={24} />
                        {t("list_title")}
                    </h2>
                    <div className="flex gap-3 w-full md:w-auto">
                        <div className="relative flex-1 md:w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                            <input
                                type="text"
                                placeholder={t("search_placeholder")}
                                className="w-full pl-10 pr-4 py-2 rounded-xl border border-turq-primary/10 bg-white/50 focus:outline-none focus:ring-2 focus:ring-turq-primary/20 text-sm font-medium"
                            />
                        </div>
                        <button className="p-2.5 rounded-xl border border-turq-primary/10 bg-white/50 text-slate-500 hover:text-turq-primary transition-colors">
                            <Filter size={18} />
                        </button>
                    </div>
                </div>

                {projects.length === 0 ? (
                    /* Empty State */
                    <div className="flex-1 flex flex-col items-center justify-center py-20 text-center">
                        <div className="w-20 h-20 rounded-full bg-turq-primary/5 flex items-center justify-center text-turq-primary/30 mb-6">
                            <Briefcase size={40} />
                        </div>
                        <h3 className="text-xl font-bold text-deep-blue mb-2">{t("no_projects")}</h3>
                        <p className="text-slate-500 max-w-sm mb-8 font-medium">
                            {t("empty_desc")}
                        </p>
                        <button className="pro-button !px-8 text-xs uppercase tracking-widest font-black">
                            {t("empty_cta")}
                        </button>
                    </div>
                ) : (
                    /* Project List */
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {projects.map((project) => (
                            <Link
                                href={`/${locale}/${tenant}/projects/${project.id}`}
                                key={project.id}
                                className="p-6 rounded-2xl border border-turq-primary/10 bg-white/40 hover:bg-white/60 hover:shadow-xl hover:shadow-turq-primary/5 transition-all group"
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <h4 className="font-bold text-deep-blue group-hover:text-turq-primary transition-colors">{project.name}</h4>
                                    <span className={`text-[10px] font-black px-2 py-1 rounded-full uppercase tracking-widest ${project.status === 'COMPLETED' ? 'bg-emerald-50 text-emerald-600' :
                                        project.status === 'IN_PROGRESS' ? 'bg-blue-50 text-blue-600' : 'bg-slate-50 text-slate-500'
                                        }`}>
                                        {project.status === 'PLANNING' ? t("status.planning") :
                                            project.status === 'IN_PROGRESS' ? t("status.in_progress") : t("status.completed")}
                                    </span>
                                </div>
                                <p className="text-sm text-slate-500 line-clamp-2 mb-4">{project.description}</p>
                                <div className="pt-4 border-t border-turq-primary/5 flex justify-between items-center">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                        {tc("created")}: {new Date(project.created_at).toLocaleDateString()}
                                    </span>
                                    <span className="text-turq-primary font-black text-[10px] uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                                        {t("view_details")}
                                    </span>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
