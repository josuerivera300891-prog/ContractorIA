"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    Briefcase,
    BarChart3,
    Users,
    FileText,
    Settings,
    Menu,
    X,
    ChevronRight,
    PlusCircle,
    Receipt,
    Clock
} from "lucide-react";
import { useTranslations } from "next-intl";

export function Sidebar({ tenant, locale }: { tenant: string; locale: string }) {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();
    const t = useTranslations("Sidebar");

    const menuItems = [
        {
            group: t("infrastructure"),
            items: [
                { name: t("dashboard"), href: `/${locale}/${tenant}/dashboard`, icon: LayoutDashboard },
                { name: t("accounts"), href: `/${locale}/${tenant}/accounts`, icon: PlusCircle },
                { name: t("projects"), href: `/${locale}/${tenant}/projects`, icon: Briefcase },
                { name: t("estimates"), href: `/${locale}/${tenant}/estimates`, icon: BarChart3 },
                { name: "Invoices", href: `/${locale}/${tenant}/invoices`, icon: Receipt },
            ]
        },
        {
            group: t("administration"),
            items: [
                { name: t("clients"), href: `/${locale}/${tenant}/clients`, icon: Users },
                { name: t("expenses"), href: `/${locale}/${tenant}/expenses`, icon: Receipt },
                { name: t("reports"), href: `/${locale}/${tenant}/reports`, icon: FileText },
                { name: t("audit"), href: `/${locale}/${tenant}/audit`, icon: Clock },
                { name: t("settings"), href: `/${locale}/${tenant}/settings`, icon: Settings },
            ]
        }
    ];

    const isActive = (path: string) => pathname === path;

    return (
        <>
            {/* Mobile Toggle */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="lg:hidden fixed top-6 left-6 z-50 p-2.5 bg-white/80 backdrop-blur-md rounded-xl border border-turq-primary/10 shadow-lg text-deep-blue"
            >
                {isOpen ? <X size={20} /> : <Menu size={20} />}
            </button>

            {/* Sidebar Container */}
            <aside className={`
        fixed inset-y-0 left-0 z-40 w-72 bg-white/80 backdrop-blur-xl border-r border-turq-primary/5 transition-transform duration-500 ease-out
        lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
                <div className="flex flex-col h-full p-8">
                    {/* Logo Area */}
                    <div className="mb-12">
                        <Link href={`/${locale}/${tenant}/dashboard`} className="flex items-center gap-3 group">
                            <div className="w-10 h-10 bg-turq-primary rounded-xl flex items-center justify-center shadow-lg shadow-turq-primary/20 group-hover:rotate-12 transition-transform duration-500">
                                <PlusCircle className="text-white" size={24} />
                            </div>
                            <span className="text-xl font-[900] text-deep-blue tracking-tighter font-outfit">
                                Contractor<span className="text-turq-primary">IA</span>
                            </span>
                        </Link>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 space-y-10">
                        {menuItems.map((section, idx) => (
                            <div key={idx} className="space-y-4">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-4 font-inter">
                                    {section.group}
                                </p>
                                <div className="space-y-1">
                                    {section.items.map((item) => (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            className={`
                        flex items-center justify-between px-4 py-3.5 rounded-2xl transition-all duration-300 group
                        ${isActive(item.href)
                                                    ? 'bg-turq-primary text-white shadow-xl shadow-turq-primary/20'
                                                    : 'text-slate-500 hover:bg-turq-primary/5 hover:text-turq-primary'}
                      `}
                                            onClick={() => setIsOpen(false)}
                                        >
                                            <div className="flex items-center gap-3 font-bold text-sm tracking-tight font-inter">
                                                <item.icon size={20} strokeWidth={isActive(item.href) ? 2.5 : 2} />
                                                {item.name}
                                            </div>
                                            <ChevronRight
                                                size={14}
                                                className={`transition-transform duration-300 ${isActive(item.href) ? 'translate-x-0 opacity-100' : '-translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100'}`}
                                            />
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </nav>

                    {/* Footer Branding */}
                    <div className="mt-auto pt-8 border-t border-turq-primary/5">
                        <div className="p-4 rounded-2xl bg-slate-50/50 border border-slate-100 font-inter">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Plan Actual</p>
                            <p className="text-sm font-black text-deep-blue">Enterprise v1.2</p>
                        </div>
                    </div>
                </div>
            </aside>
        </>
    );
}
