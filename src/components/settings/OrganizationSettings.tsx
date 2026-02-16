'use client'

import { useState } from 'react'
import { Building2, Save, Loader2, Palette, Link as LinkIcon, Shield, Mail, Phone, MapPin, Hash, Percent } from 'lucide-react'
import { updateCompanySettings } from '@/app/actions/settings'
import { useTranslations } from 'next-intl'

interface OrganizationSettingsProps {
    company: any
}

export default function OrganizationSettings({ company }: OrganizationSettingsProps) {
    const [isSaving, setIsSaving] = useState(false)
    const t = useTranslations("Settings");
    const tc = useTranslations("Common");

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setIsSaving(true)
        const formData = new FormData(e.currentTarget)
        const result = await updateCompanySettings(formData)
        setIsSaving(false)
        if (result.success) {
            alert(t("organization.success"))
        } else {
            alert(tc("error") + ": " + result.error)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="animate-in fade-in duration-500 pb-10">
            <h2 className="text-2xl font-[900] text-deep-blue mb-10 font-outfit flex items-center gap-4">
                <div className="p-3 bg-turq-primary/10 rounded-2xl text-turq-primary shadow-sm">
                    <Building2 size={24} />
                </div>
                {t("organization.title")}
            </h2>

            <div className="space-y-8 max-w-4xl">
                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">{t("organization.legal_name")}</label>
                        <input
                            name="name"
                            type="text"
                            defaultValue={company.name}
                            required
                            className="w-full px-6 py-4 rounded-2xl border border-turq-primary/10 bg-white/70 focus:outline-none focus:ring-2 focus:ring-turq-primary/20 text-slate-700 font-bold font-inter"
                        />
                    </div>
                    <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">{t("organization.business_email")}</label>
                        <div className="relative">
                            <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                            <input
                                name="business_email"
                                type="email"
                                defaultValue={company.business_email}
                                className="w-full pl-14 pr-6 py-4 rounded-2xl border border-turq-primary/10 bg-white/70 focus:outline-none focus:ring-2 focus:ring-turq-primary/20 text-slate-700 font-bold font-inter"
                            />
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">{t("organization.phone")}</label>
                        <div className="relative">
                            <Phone className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                            <input
                                name="phone"
                                type="tel"
                                defaultValue={company.phone}
                                className="w-full pl-14 pr-6 py-4 rounded-2xl border border-turq-primary/10 bg-white/70 focus:outline-none focus:ring-2 focus:ring-turq-primary/20 text-slate-700 font-bold font-inter"
                            />
                        </div>
                    </div>
                    <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">{t("organization.address")}</label>
                        <div className="relative">
                            <MapPin className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                            <input
                                name="address"
                                type="text"
                                defaultValue={company.address}
                                className="w-full pl-14 pr-6 py-4 rounded-2xl border border-turq-primary/10 bg-white/70 focus:outline-none focus:ring-2 focus:ring-turq-primary/20 text-slate-700 font-bold font-inter"
                            />
                        </div>
                    </div>
                </div>

                <div className="pt-6 border-t border-slate-100 flex items-center gap-3 mb-2">
                    <Hash size={16} className="text-turq-primary" />
                    <h3 className="text-xs font-black text-deep-blue uppercase tracking-[0.2em] font-outfit">{t("organization.tax_section")}</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">{t("organization.tax_id")}</label>
                        <input
                            name="tax_id"
                            type="text"
                            defaultValue={company.tax_id}
                            placeholder="Ej: ABC12345678"
                            className="w-full px-6 py-4 rounded-2xl border border-turq-primary/10 bg-white/70 focus:outline-none focus:ring-2 focus:ring-turq-primary/20 text-slate-700 font-bold font-inter"
                        />
                    </div>
                    <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">{t("organization.tax_rate")}</label>
                        <div className="relative">
                            <Percent className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                            <input
                                name="tax_rate"
                                type="number"
                                step="0.01"
                                defaultValue={company.tax_rate}
                                className="w-full px-6 py-4 rounded-2xl border border-turq-primary/10 bg-white/70 focus:outline-none focus:ring-2 focus:ring-turq-primary/20 text-slate-700 font-bold font-inter"
                            />
                        </div>
                    </div>
                </div>

                <div className="pt-6 border-t border-slate-100 flex items-center gap-3 mb-2">
                    <Palette size={16} className="text-turq-primary" />
                    <h3 className="text-xs font-black text-deep-blue uppercase tracking-[0.2em] font-outfit">{t("organization.branding_section")}</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1 flex items-center gap-2">
                            {t("organization.primary_color")}
                        </label>
                        <div className="flex gap-4">
                            <input type="color" name="primary_color" defaultValue={company.primary_color || "#06b6d4"} className="w-16 h-16 rounded-2xl border-none cursor-pointer outline-none shadow-sm" />
                            <input type="text" defaultValue={company.primary_color || "#06b6d4"} className="flex-1 px-6 py-4 rounded-2xl border border-turq-primary/10 text-sm font-bold bg-white/50 font-inter" />
                        </div>
                    </div>

                    <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">{t("organization.secondary_color")}</label>
                        <div className="flex gap-4">
                            <input type="color" name="secondary_color" defaultValue={company.secondary_color || "#1e3a8a"} className="w-16 h-16 rounded-2xl border-none cursor-pointer outline-none shadow-sm" />
                            <input type="text" defaultValue={company.secondary_color || "#1e3a8a"} className="flex-1 px-6 py-4 rounded-2xl border border-turq-primary/10 text-sm font-bold bg-white/50 font-inter" />
                        </div>
                    </div>
                </div>

                <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">{t("organization.logo_url")}</label>
                    <div className="relative">
                        <LinkIcon className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input
                            type="text"
                            name="logo_url"
                            defaultValue={company.logo_url}
                            placeholder="https://..."
                            className="w-full pl-14 pr-6 py-4 rounded-2xl border border-turq-primary/10 bg-white/70 focus:outline-none focus:ring-2 focus:ring-turq-primary/20 text-slate-700 font-bold font-inter"
                        />
                    </div>
                    <p className="text-[10px] text-slate-400 font-medium pl-1 italic flex items-center gap-1">
                        <Shield size={10} className="text-turq-primary" /> {t("organization.logo_hint")}
                    </p>
                </div>

                <div className="pt-10 flex justify-end">
                    <button
                        type="submit"
                        disabled={isSaving}
                        className="pro-button !px-12 !h-16 text-sm shadow-2xl shadow-turq-primary/20 disabled:opacity-50 flex items-center gap-3"
                    >
                        {isSaving ? <Loader2 size={20} className="animate-spin" /> : <Save size={20} />}
                        {isSaving ? tc("saving") : t("organization.save_button")}
                    </button>
                </div>
            </div>
        </form>
    )
}
