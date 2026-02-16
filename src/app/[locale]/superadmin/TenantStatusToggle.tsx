"use client";

import { useState, useTransition } from "react";
import { toggleTenantStatus } from "@/app/actions/superadmin";
import { Play, PauseCircle } from "lucide-react";
import { useRouter } from "next/navigation";

interface TenantStatusToggleProps {
    companyId: string;
    isActive: boolean;
    companyName: string;
}

export function TenantStatusToggle({ companyId, isActive, companyName }: TenantStatusToggleProps) {
    const [confirming, setConfirming] = useState(false);
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    function handleToggle() {
        if (!confirming) {
            setConfirming(true);
            return;
        }

        startTransition(async () => {
            await toggleTenantStatus(companyId, !isActive);
            setConfirming(false);
            router.refresh();
        });
    }

    if (confirming) {
        return (
            <div className="flex items-center gap-1.5">
                <button
                    onClick={handleToggle}
                    disabled={isPending}
                    className={`px-2.5 py-1.5 rounded-lg text-[10px] font-black uppercase transition-colors ${isActive
                            ? "bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/30"
                            : "bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 border border-emerald-500/30"
                        }`}
                >
                    {isPending ? "..." : isActive ? "Confirmar Pausa" : "Confirmar Activar"}
                </button>
                <button
                    onClick={() => setConfirming(false)}
                    className="px-2 py-1.5 rounded-lg text-slate-500 text-[10px] font-bold hover:text-white transition-colors"
                >
                    ✕
                </button>
            </div>
        );
    }

    return (
        <button
            onClick={handleToggle}
            title={isActive ? `Pausar ${companyName}` : `Activar ${companyName}`}
            className={`p-1.5 rounded-lg transition-colors ${isActive
                    ? "text-amber-400 hover:bg-amber-500/10"
                    : "text-emerald-400 hover:bg-emerald-500/10"
                }`}
        >
            {isActive ? <PauseCircle className="w-4 h-4" /> : <Play className="w-4 h-4" />}
        </button>
    );
}
