import { use } from "react";
import { EstimateChatBuilder } from "@/components/estimates/EstimateChatBuilder";
import { LiveEstimatePreview } from "@/components/estimates/LiveEstimatePreview";
import { EstimateBuilderHeader } from "@/components/estimates/EstimateBuilderHeader";
import { EstimateProvider } from "@/components/estimates/EstimateContext";
import { getCompanyBySlug } from "@/app/actions/companies";

export default async function NewEstimatePage({ params }: { params: Promise<{ tenant: string; locale: string }> }) {
    const { tenant } = await params;
    const { data: company } = await getCompanyBySlug(tenant);

    return (
        <EstimateProvider initialCompany={company || undefined}>
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
