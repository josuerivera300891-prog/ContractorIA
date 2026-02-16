import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { LayoutDashboard, Building2, Shield, LogOut } from "lucide-react";

export default async function SuperAdminLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;
    const supabase = await createClient();

    // Security: Only superadmin
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect(`/${locale}/login`);

    const { data: profile } = await supabase
        .from("profiles")
        .select("role, first_name, last_name")
        .eq("id", user.id)
        .single();

    if (profile?.role !== "superadmin") {
        redirect(`/${locale}/login`);
    }

    const navItems = [
        { href: `/${locale}/superadmin`, icon: LayoutDashboard, label: "Dashboard" },
        { href: `/${locale}/superadmin/tenants`, icon: Building2, label: "Empresas" },
    ];

    return (
        <div className="flex h-screen bg-slate-950 font-inter overflow-hidden">
            {/* Sidebar */}
            <aside className="w-72 bg-slate-900 border-r border-slate-800 flex flex-col">
                {/* Brand */}
                <div className="p-6 border-b border-slate-800">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center">
                            <Shield className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h1 className="text-white font-black text-sm tracking-tight">ContractorIA</h1>
                            <p className="text-red-400 text-[10px] font-bold uppercase tracking-[0.2em]">SuperAdmin</p>
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-4 space-y-1">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/60 transition-all duration-200 group"
                        >
                            <item.icon className="w-5 h-5 group-hover:text-red-400 transition-colors" />
                            <span className="text-sm font-semibold">{item.label}</span>
                        </Link>
                    ))}
                </nav>

                {/* Footer */}
                <div className="p-4 border-t border-slate-800">
                    <div className="flex items-center gap-3 px-4 py-3">
                        <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-white text-xs font-bold">
                            {profile?.first_name?.charAt(0) || "S"}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-white text-sm font-semibold truncate">
                                {profile?.first_name} {profile?.last_name}
                            </p>
                            <p className="text-slate-500 text-[10px] uppercase tracking-widest font-bold">SuperAdmin</p>
                        </div>
                        <Link href={`/${locale}/login`} className="text-slate-500 hover:text-red-400 transition-colors">
                            <LogOut className="w-4 h-4" />
                        </Link>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto bg-slate-950">
                {children}
            </main>
        </div>
    );
}
