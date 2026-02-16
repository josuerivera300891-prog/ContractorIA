"use client";

import { useState, useTransition } from "react";
import { updateTenantPlan } from "@/app/actions/superadmin";
import { useRouter } from "next/navigation";

interface PlanChangerProps {
    companyId: string;
    currentPlan: string;
}

const PLANS = [
    { id: "free", label: "Free", color: "border-slate-600 hover:border-slate-500" },
    { id: "starter", label: "Starter", color: "border-blue-600 hover:border-blue-500" },
    { id: "pro", label: "Pro", color: "border-emerald-600 hover:border-emerald-500" },
    { id: "enterprise", label: "Enterprise", color: "border-purple-600 hover:border-purple-500" },
];

const PLAN_ACTIVE_COLORS: Record<string, string> = {
    free: "border-slate-400 bg-slate-800/60 text-white",
    starter: "border-blue-400 bg-blue-900/40 text-blue-300",
    pro: "border-emerald-400 bg-emerald-900/40 text-emerald-300",
    enterprise: "border-purple-400 bg-purple-900/40 text-purple-300",
};

export function PlanChanger({ companyId, currentPlan }: PlanChangerProps) {
    const [selected, setSelected] = useState(currentPlan);
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    function handleSave() {
        if (selected === currentPlan) return;
        startTransition(async () => {
            await updateTenantPlan(companyId, selected);
            router.refresh();
        });
    }

    return (
        <div className="space-y-4">
            <div className="flex gap-2 flex-wrap">
                {PLANS.map((plan) => {
                    const isActive = selected === plan.id;
                    return (
                        <button
                            key={plan.id}
                            onClick={() => setSelected(plan.id)}
                            className={`px-4 py-2 rounded-xl border-2 text-xs font-black uppercase tracking-widest transition-all duration-200 ${isActive
                                    ? PLAN_ACTIVE_COLORS[plan.id]
                                    : `${plan.color} bg-transparent text-slate-500`
                                }`}
                        >
                            {plan.label}
                            {plan.id === currentPlan && !isActive && (
                                <span className="ml-1 text-[8px] opacity-60">(actual)</span>
                            )}
                        </button>
                    );
                })}
            </div>

            {selected !== currentPlan && (
                <button
                    onClick={handleSave}
                    disabled={isPending}
                    className="px-4 py-2 rounded-xl bg-red-500/20 text-red-400 text-xs font-black uppercase tracking-widest border border-red-500/30 hover:bg-red-500/30 transition-colors disabled:opacity-50"
                >
                    {isPending ? "Guardando..." : `Cambiar a ${selected}`}
                </button>
            )}
        </div>
    );
}
