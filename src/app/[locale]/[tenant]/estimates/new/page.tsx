"use client";

import { useState } from "react";
import { EstimateChatBuilder } from "@/components/estimates/EstimateChatBuilder";
import { LiveEstimatePreview } from "@/components/estimates/LiveEstimatePreview";
import { EstimateBuilderHeader } from "@/components/estimates/EstimateBuilderHeader";
import { EstimateProvider } from "@/components/estimates/EstimateContext";

export default function NewEstimatePage() {
    return (
        <EstimateProvider>
            <div className="flex flex-col h-[calc(100vh-theme(spacing.20))] -m-10 bg-slate-50 overflow-hidden font-inter">
                <EstimateBuilderHeader />
                <main className="flex-1 flex overflow-hidden">
                    <EstimateChatBuilder />
                    <LiveEstimatePreview />
                </main>
            </div>
        </EstimateProvider>
    );
}
