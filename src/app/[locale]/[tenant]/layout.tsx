import { Sidebar } from "@/components/Sidebar";
import DashboardHeader from "@/components/DashboardHeader";
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { AIChat } from "@/components/AIChat";

export default async function TenantLayout(props: {
    children: React.ReactNode;
    params: Promise<{ locale: string; tenant: string }>;
}) {
    const params = await props.params;
    const { tenant, locale } = params;

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) redirect(`/${locale}/login`);

    // Fetch profile and check tenant access
    const { data: profile } = await supabase
        .from('profiles')
        .select(`
            role,
            companies (
                primary_color,
                secondary_color,
                accent_color,
                logo_url,
                slug
            )
        `)
        .eq('id', user.id)
        .single();

    const companyData = profile?.companies as any;
    const userCompanySlug = companyData?.slug;
    const { primary_color, secondary_color, accent_color } = companyData || {};

    // Superadmins can access any tenant for management
    // Owners/Staff can only access their own slug
    if (profile?.role !== 'superadmin' && userCompanySlug !== tenant) {
        // Redirect to their own dashboard if they have one, otherwise login
        if (userCompanySlug) {
            redirect(`/${locale}/${userCompanySlug}/dashboard`);
        } else {
            redirect(`/${locale}/login`);
        }
    }

    return (
        <div
            className="flex min-h-screen turq-aura-bg selection:bg-turq-primary/30 selection:text-deep-blue"
            style={{
                '--turq-primary': primary_color || '#06b6d4',
                '--deep-blue': secondary_color || '#1e3a8a',
                '--turq-light': accent_color || '#22d3ee',
            } as React.CSSProperties}
        >
            <Sidebar tenant={tenant} locale={locale} />
            <div className="flex-1 flex flex-col min-w-0">
                <DashboardHeader />
                <main className="flex-1 overflow-y-auto p-10">
                    {props.children}
                </main>
            </div>
            <AIChat tenant={tenant} />
        </div>
    );
}
