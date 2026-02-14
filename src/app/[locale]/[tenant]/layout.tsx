import Sidebar from "@/components/Sidebar";
import DashboardHeader from "@/components/DashboardHeader";
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

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
                slug
            )
        `)
        .eq('id', user.id)
        .single();

    const userCompanySlug = (profile?.companies as any)?.slug;

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
        <div className="flex min-h-screen turq-aura-bg selection:bg-turq-primary/30 selection:text-deep-blue">
            <Sidebar tenant={tenant} />
            <div className="flex-1 flex flex-col min-w-0">
                <DashboardHeader />
                <main className="flex-1 overflow-y-auto p-10">
                    {props.children}
                </main>
            </div>
        </div>
    );
}
