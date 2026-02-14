"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    Briefcase,
    FileText,
    Users,
    BarChart3,
    Settings,
    TrendingUp,
    Zap
} from "lucide-react";

const navItems = [
    { name: "Home", icon: LayoutDashboard, href: "dashboard" },
    { name: "Proyectos", icon: Briefcase, href: "projects" },
    { name: "Presupuestos", icon: FileText, href: "estimates" },
    { name: "Clientes", icon: Users, href: "clients" },
    { name: "Reportes", icon: BarChart3, href: "reports" },
    { name: "Configuración", icon: Settings, href: "settings" },
];

export default function Sidebar({ tenant }: { tenant: string }) {
    const pathname = usePathname();

    return (
        <aside className="w-72 bg-white/70 backdrop-blur-2xl border-r border-turq-primary/10 flex flex-col h-screen sticky top-0 z-30 shadow-premium">
            {/* Logo Section */}
            <div className="p-8">
                <Link href={`/${tenant}/dashboard`} className="flex items-center gap-3 group">
                    <div className="w-10 h-10 bg-turq-primary/10 rounded-2xl flex items-center justify-center shadow-sm transition-all group-hover:scale-110 duration-500">
                        <TrendingUp className="text-turq-primary" size={24} />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-xl font-[950] text-deep-blue tracking-tighter leading-none font-outfit">
                            Contractor<span className="text-turq-primary">IA</span>
                        </span>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1">
                            Enterprise Engine
                        </span>
                    </div>
                </Link>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-6 space-y-2 mt-4">
                {navItems.map((item) => {
                    const isActive = pathname.includes(item.href);
                    const Icon = item.icon;
                    return (
                        <Link
                            key={item.name}
                            href={`/${tenant}/${item.href}`}
                            className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 group ${isActive
                                    ? "bg-turq-primary/10 text-turq-primary shadow-sm"
                                    : "text-slate-500 hover:bg-slate-50 hover:text-deep-blue"
                                }`}
                        >
                            <Icon
                                size={22}
                                className={`transition-colors ${isActive ? "text-turq-primary" : "group-hover:text-turq-primary"}`}
                            />
                            <span className="text-sm font-bold tracking-wide flex-1">{item.name}</span>
                            {isActive && (
                                <div className="w-1.5 h-1.5 rounded-full bg-turq-primary shadow-[0_0_12px_rgba(6,182,212,0.8)] animate-pulse"></div>
                            )}
                        </Link>
                    );
                })}
            </nav>

            {/* AI Status / Profile */}
            <div className="p-6 mt-auto">
                <div className="bg-gradient-to-br from-turq-primary/5 to-white/50 border border-turq-primary/10 rounded-3xl p-5 relative overflow-hidden group hover:border-turq-primary/30 transition-all duration-500">
                    <div className="absolute -top-12 -right-12 w-24 h-24 bg-turq-primary/10 rounded-full blur-2xl group-hover:bg-turq-primary/20 transition-all duration-700"></div>
                    <div className="flex items-center gap-4 relative z-10">
                        <div className="w-10 h-10 rounded-xl bg-white border border-turq-primary/10 flex items-center justify-center shadow-sm">
                            <Zap className="text-turq-primary fill-turq-primary/20" size={18} />
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-[10px] font-black text-turq-primary uppercase tracking-widest leading-none mb-1">AI Engine Active</p>
                            <p className="text-xs font-bold text-deep-blue truncate uppercase tracking-widest">{tenant}</p>
                        </div>
                    </div>
                </div>
            </div>
        </aside>
    );
}
