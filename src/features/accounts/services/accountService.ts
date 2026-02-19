import { createClient } from "@/lib/supabase/client";

export const accountService = {
    /**
     * Switches the active tenant/account in the current session.
     * This might involve a redirect to the new tenant's dashboard.
     */
    async switchAccount(tenantSlug: string, locale: string = 'en') {
        // In a multi-tenant setup, this usually just means redirecting to the new URL
        // since the session is often shared or the middleware handles the check.
        window.location.href = `/${locale}/${tenantSlug}/dashboard`;
    },

    /**
     * Service to handle batch imports with real-time progress callbacks.
     */
    async batchImportAccounts(data: any[], onProgress: (percent: number) => void) {
        const total = data.length;
        let completed = 0;

        for (const item of data) {
            // Simulate processing time
            await new Promise(resolve => setTimeout(resolve, 100));

            // Real implementation would call Supabase here:
            // const { error } = await supabase.from('accounts').insert(item);

            completed++;
            onProgress(Math.round((completed / total) * 100));
        }

        return { success: true, count: completed };
    }
};
