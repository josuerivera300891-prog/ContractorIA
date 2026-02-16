'use client'

import { useState } from 'react'
import { User, Save, Loader2, Camera } from 'lucide-react'
import { updateUserProfile } from '@/app/actions/settings'
import { useTranslations } from 'next-intl'

interface ProfileSettingsProps {
    profile: any
}

export default function ProfileSettings({ profile }: ProfileSettingsProps) {
    const [isSaving, setIsSaving] = useState(false)
    const t = useTranslations("Settings");
    const tc = useTranslations("Common");

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setIsSaving(true)
        const formData = new FormData(e.currentTarget)
        const result = await updateUserProfile(formData)
        setIsSaving(false)
        if (result.success) {
            alert(t("profile.success"))
        } else {
            alert(tc("error") + ": " + result.error)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="animate-in fade-in duration-500">
            <h2 className="text-2xl font-[900] text-deep-blue mb-10 font-outfit flex items-center gap-4">
                <div className="p-3 bg-turq-primary/10 rounded-2xl text-turq-primary shadow-sm">
                    <User size={24} />
                </div>
                {t("profile.title")}
            </h2>

            <div className="space-y-8 max-w-2xl">
                {/* Avatar Placeholder */}
                <div className="flex items-center gap-6 mb-10">
                    <div className="relative group">
                        <div className="w-24 h-24 rounded-[2rem] bg-slate-100 flex items-center justify-center text-slate-300 border-2 border-dashed border-slate-200 overflow-hidden">
                            {profile.avatar_url ? (
                                <img src={profile.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                            ) : (
                                <User size={40} />
                            )}
                        </div>
                        <button type="button" className="absolute -bottom-2 -right-2 p-2 bg-white rounded-xl shadow-lg border border-slate-100 text-turq-primary hover:scale-110 transition-transform">
                            <Camera size={16} />
                        </button>
                    </div>
                    <div>
                        <h4 className="text-sm font-black text-deep-blue font-outfit">{t("profile.avatar_title")}</h4>
                        <p className="text-xs text-slate-400 font-medium font-inter">{t("profile.avatar_description")}</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">{t("profile.first_name")}</label>
                        <input
                            name="first_name"
                            type="text"
                            defaultValue={profile.first_name}
                            required
                            className="w-full px-6 py-4 rounded-2xl border border-turq-primary/10 bg-white/70 focus:outline-none focus:ring-2 focus:ring-turq-primary/20 text-slate-700 font-bold font-inter"
                        />
                    </div>
                    <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">{t("profile.last_name")}</label>
                        <input
                            name="last_name"
                            type="text"
                            defaultValue={profile.last_name}
                            required
                            className="w-full px-6 py-4 rounded-2xl border border-turq-primary/10 bg-white/70 focus:outline-none focus:ring-2 focus:ring-turq-primary/20 text-slate-700 font-bold font-inter"
                        />
                    </div>
                </div>

                <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">{t("profile.phone")}</label>
                    <input
                        name="phone"
                        type="tel"
                        defaultValue={profile.phone}
                        placeholder="+1 (555) 000-0000"
                        className="w-full px-6 py-4 rounded-2xl border border-turq-primary/10 bg-white/70 focus:outline-none focus:ring-2 focus:ring-turq-primary/20 text-slate-700 font-bold font-inter"
                    />
                </div>

                <div className="pt-10 flex justify-end">
                    <button
                        type="submit"
                        disabled={isSaving}
                        className="pro-button !px-10 !h-14 text-xs shadow-2xl shadow-turq-primary/20 disabled:opacity-50 flex items-center gap-2"
                    >
                        {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                        {isSaving ? tc("saving") : t("profile.save_button")}
                    </button>
                </div>
            </div>
        </form>
    )
}
