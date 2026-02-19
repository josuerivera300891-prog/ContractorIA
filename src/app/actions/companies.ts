"use server";

import { createClient } from "@/lib/supabase/server";
import { Company } from "@/types/domain";

export async function getCompanyBySlug(slug: string): Promise<{ data: Company | null; error: string | null }> {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from('companies')
        .select('*')
        .eq('slug', slug)
        .single();

    if (error) {
        console.error("Error fetching company by slug:", error);
        return { data: null, error: error.message };
    }

    // Mapping DB result to domain type if necessary (DB has primary_color, role, etc)
    // Domain interface expects settings object which might not be in DB yet
    const company: Company = {
        id: data.id,
        name: data.name,
        slug: data.slug,
        created_at: data.created_at,
        logo_url: data.logo_url,
        settings: {
            currency: 'USD', // Defaulting for now
            tax_rate: 0,
            address: 'Dirección no configurada'
        }
    };

    return { data: company, error: null };
}
