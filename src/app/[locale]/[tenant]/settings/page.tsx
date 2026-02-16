"use client";

import { use, useState, useEffect } from "react";
import { User, Building2, Bell, Shield, CreditCard, ChevronRight, Settings, Loader2, Users, Receipt } from "lucide-react";
import { getUserSettings } from "@/app/actions/settings";
import ProfileSettings from "@/components/settings/ProfileSettings";
import OrganizationSettings from "@/components/settings/OrganizationSettings";
import { useTranslations } from "next-intl";

type Tab = 'profile' | 'organization' | 'team' | 'billing' | 'security';

export default function SettingsPage({ params }: { params: Promise<{ tenant: string }> }) {
    const { tenant } = use(params);
    const [activeTab, setActiveTab] = useState<Tab>('profile');
    const [isLoading, setIsLoading] = useState(true);
    const [data, setData] = useState<any>(null);
    const t = useTranslations("Settings");
    const tc = useTranslations("Common");

    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true);
            const settings = await getUserSettings();
            setData(settings);
            setIsLoading(false);
        };
        loadData();
    }, []);

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
                <Loader2 className="w-10 h-10 text-turq-primary animate-spin" />
                <p className="text-slate-400 font-bold font-outfit uppercase tracking-widest animate-pulse">{t("loading")}</p>
            </div>
        );
    }

    const menuItems = [
        { id: 'profile', label: t("tabs.profile"), icon: User },
        { id: 'organization', label: t("tabs.organization"), icon: Building2 },
        { id: 'team', label: t("tabs.team"), icon: Users },
        { id: 'billing', label: t("tabs.billing"), icon: Receipt },
        { id: 'security', label: t("tabs.security"), icon: Shield },
    ];

    return (
        <div className="space-y-10 pb-20">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-4xl font-[900] text-deep-blue tracking-tight mb-2 font-outfit uppercase">
                        {t.rich("title", {
                            span: (chunks) => <span className="text-turq-primary italic">{chunks}</span>
                        })}
                    </h1>
                    <p className="text-slate-500 font-medium font-inter">
                        {t("description", { tenant: data?.companies?.name || tenant })}
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
                {/* Lateral Settings Menu */}
                <div className="lg:col-span-1 space-y-4">
                    {menuItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id as Tab)}
                            className={`w-full flex items-center justify-between px-6 py-4 rounded-2xl transition-all duration-300 font-bold text-sm ${activeTab === item.id
                                ? "bg-turq-primary shadow-xl shadow-turq-primary/30 text-white translate-x-2"
                                : "bg-white/50 text-slate-500 hover:bg-white hover:text-deep-blue"
                                }`}
                        >
                            <div className="flex items-center gap-4">
                                <item.icon size={18} />
                                <span className="font-outfit uppercase tracking-widest text-[10px] font-black">{item.label}</span>
                            </div>
                            <ChevronRight size={14} className={activeTab === item.id ? "text-white/70" : "text-slate-300"} />
                        </button>
                    ))}
                </div>

                {/* Settings Display Card */}
                <div className="lg:col-span-3">
                    <div className="pro-card bg-white/60 p-10 min-h-[700px] relative overflow-hidden group border-turq-primary/5">
                        <div className="absolute top-0 right-0 w-80 h-80 bg-turq-primary/5 rounded-full blur-[120px]"></div>

                        <div className="relative z-10 font-inter">
                            {activeTab === 'profile' && <ProfileSettings profile={data} />}

                            {activeTab === 'organization' && <OrganizationSettings company={data?.companies} />}

                            {(activeTab === 'team' || activeTab === 'billing' || activeTab === 'security') && (
                                <div className="flex flex-col items-center justify-center py-20 text-center space-y-4 animate-in zoom-in duration-300">
                                    <div className="w-24 h-24 rounded-[3rem] bg-slate-50 flex items-center justify-center text-slate-200 shadow-inner">
                                        <Settings size={40} className="animate-spin-slow" />
                                    </div>
                                    <h3 className="text-lg font-[900] text-slate-400 uppercase tracking-widest font-outfit">{t("development.title")}</h3>
                                    <p className="text-sm text-slate-500 max-w-xs font-medium font-inter">{t("development.description")}</p>

                                    {activeTab === 'billing' && (
                                        <div className="mt-8 p-6 bg-turq-primary/5 rounded-3xl border border-turq-primary/10 max-w-md">
                                            <div className="flex items-center gap-3 text-turq-primary mb-3">
                                                <CreditCard size={20} />
                                                <span className="font-black text-xs uppercase tracking-widest">{t("billing.plan_current", { plan: "Professional" })}</span>
                                            </div>
                                            <p className="text-xs text-slate-500 text-left font-medium">{t("billing.stripe_description")}</p>
                                            <button disabled className="w-full mt-4 py-3 bg-slate-200 text-slate-400 rounded-xl text-[10px] font-black uppercase tracking-widest cursor-not-allowed">
                                                {tc("coming_soon")}
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
