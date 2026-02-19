"use server";

import { createClient } from "@/lib/supabase/server";

// ─── Helpers ────────────────────────────────────────────────────────────────

async function requireSuperAdmin() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Not authenticated");

    const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

    if (profile?.role !== "superadmin") throw new Error("Forbidden: SuperAdmin only");
    return supabase;
}

// ─── Types ──────────────────────────────────────────────────────────────────

export interface TenantWithMetrics {
    id: string;
    name: string;
    slug: string;
    logo_url: string | null;
    is_active: boolean;
    plan_tier: string;
    plan_expires_at: string | null;
    business_email: string | null;
    phone: string | null;
    created_at: string;
    member_count: number;
    client_count: number;
    estimate_count: number;
    invoice_count: number;
    project_count: number;
    expense_count: number;
}

export interface TenantDetail extends TenantWithMetrics {
    address: string | null;
    tax_id: string | null;
    tax_rate: number;
    primary_color: string | null;
    secondary_color: string | null;
    stripe_account_id: string | null;
    members: TenantMember[];
}

export interface TenantMember {
    id: string;
    first_name: string | null;
    last_name: string | null;
    role: string;
    avatar_url: string | null;
    created_at: string;
    email?: string;
}

export interface GlobalMetrics {
    total_companies: number;
    active_companies: number;
    paused_companies: number;
    total_users: number;
    total_clients: number;
    total_estimates: number;
    total_invoices: number;
    plan_distribution: { tier: string; count: number }[];
}

// ─── Actions ────────────────────────────────────────────────────────────────

/**
 * Fetches all tenants with aggregated metrics (counts per entity).
 */
export async function getAllTenantsWithMetrics(): Promise<TenantWithMetrics[]> {
    const supabase = await requireSuperAdmin();

    const { data: companies, error } = await supabase
        .from("companies")
        .select("id, name, slug, logo_url, is_active, plan_tier, plan_expires_at, business_email, phone, created_at")
        .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);
    if (!companies) return [];

    // Fetch aggregate counts per company
    const tenants: TenantWithMetrics[] = await Promise.all(
        companies.map(async (c) => {
            const [profiles, clients, estimates, invoices, projects, expenses] = await Promise.all([
                supabase.from("profiles").select("id", { count: "exact", head: true }).eq("company_id", c.id),
                supabase.from("clients").select("id", { count: "exact", head: true }).eq("company_id", c.id),
                supabase.from("estimates").select("id", { count: "exact", head: true }).eq("company_id", c.id),
                supabase.from("invoices").select("id", { count: "exact", head: true }).eq("company_id", c.id),
                supabase.from("projects").select("id", { count: "exact", head: true }).eq("company_id", c.id),
                supabase.from("expenses").select("id", { count: "exact", head: true }).eq("company_id", c.id),
            ]);

            return {
                ...c,
                member_count: profiles.count ?? 0,
                client_count: clients.count ?? 0,
                estimate_count: estimates.count ?? 0,
                invoice_count: invoices.count ?? 0,
                project_count: projects.count ?? 0,
                expense_count: expenses.count ?? 0,
            };
        })
    );

    return tenants;
}

/**
 * Fetches detail of a single tenant including members.
 */
export async function getTenantDetail(companyId: string): Promise<TenantDetail | null> {
    const supabase = await requireSuperAdmin();

    const { data: company, error } = await supabase
        .from("companies")
        .select("*")
        .eq("id", companyId)
        .single();

    if (error || !company) return null;

    // Fetch members
    const { data: profiles } = await supabase
        .from("profiles")
        .select("id, first_name, last_name, role, avatar_url, created_at")
        .eq("company_id", companyId)
        .order("created_at", { ascending: true });

    // Fetch counts
    const [clients, estimates, invoices, projects, expenses] = await Promise.all([
        supabase.from("clients").select("id", { count: "exact", head: true }).eq("company_id", companyId),
        supabase.from("estimates").select("id", { count: "exact", head: true }).eq("company_id", companyId),
        supabase.from("invoices").select("id", { count: "exact", head: true }).eq("company_id", companyId),
        supabase.from("projects").select("id", { count: "exact", head: true }).eq("company_id", companyId),
        supabase.from("expenses").select("id", { count: "exact", head: true }).eq("company_id", companyId),
    ]);

    return {
        id: company.id,
        name: company.name,
        slug: company.slug,
        logo_url: company.logo_url,
        is_active: company.is_active,
        plan_tier: company.plan_tier,
        plan_expires_at: company.plan_expires_at,
        business_email: company.business_email,
        phone: company.phone,
        address: company.address,
        tax_id: company.tax_id,
        tax_rate: company.tax_rate ?? 0,
        primary_color: company.primary_color,
        secondary_color: company.secondary_color,
        stripe_account_id: company.stripe_account_id,
        created_at: company.created_at,
        member_count: profiles?.length ?? 0,
        client_count: clients.count ?? 0,
        estimate_count: estimates.count ?? 0,
        invoice_count: invoices.count ?? 0,
        project_count: projects.count ?? 0,
        expense_count: expenses.count ?? 0,
        members: (profiles ?? []).map((p) => ({
            id: p.id,
            first_name: p.first_name,
            last_name: p.last_name,
            role: p.role,
            avatar_url: p.avatar_url,
            created_at: p.created_at,
        })),
    };
}

/**
 * Toggles a tenant's active status (pause / activate).
 */
export async function toggleTenantStatus(companyId: string, isActive: boolean) {
    const supabase = await requireSuperAdmin();

    const { error } = await supabase
        .from("companies")
        .update({ is_active: isActive, updated_at: new Date().toISOString() })
        .eq("id", companyId);

    if (error) throw new Error(error.message);

    return { success: true, is_active: isActive };
}

/**
 * Updates a tenant's subscription plan.
 */
export async function updateTenantPlan(companyId: string, planTier: string, expiresAt?: string) {
    const supabase = await requireSuperAdmin();

    const validPlans = ["free", "starter", "pro", "enterprise"];
    if (!validPlans.includes(planTier)) throw new Error(`Invalid plan: ${planTier}`);

    const { error } = await supabase
        .from("companies")
        .update({
            plan_tier: planTier,
            plan_expires_at: expiresAt || null,
            updated_at: new Date().toISOString(),
        })
        .eq("id", companyId);

    if (error) throw new Error(error.message);

    return { success: true };
}

/**
 * Fetches global metrics for the SuperAdmin dashboard.
 */
export async function getGlobalMetrics(): Promise<GlobalMetrics> {
    const supabase = await requireSuperAdmin();

    const { data: companies } = await supabase
        .from("companies")
        .select("is_active, plan_tier");

    const [users, clients, estimates, invoices] = await Promise.all([
        supabase.from("profiles").select("id", { count: "exact", head: true }),
        supabase.from("clients").select("id", { count: "exact", head: true }),
        supabase.from("estimates").select("id", { count: "exact", head: true }),
        supabase.from("invoices").select("id", { count: "exact", head: true }),
    ]);

    const allCompanies = companies ?? [];
    const active = allCompanies.filter((c) => c.is_active).length;

    // Plan distribution
    const planMap = new Map<string, number>();
    allCompanies.forEach((c) => {
        planMap.set(c.plan_tier, (planMap.get(c.plan_tier) ?? 0) + 1);
    });
    const plan_distribution = Array.from(planMap.entries()).map(([tier, count]) => ({ tier, count }));

    return {
        total_companies: allCompanies.length,
        active_companies: active,
        paused_companies: allCompanies.length - active,
        total_users: users.count ?? 0,
        total_clients: clients.count ?? 0,
        total_estimates: estimates.count ?? 0,
        total_invoices: invoices.count ?? 0,
        plan_distribution,
    };
}
