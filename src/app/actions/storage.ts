"use server";

import { createClient } from "@/lib/supabase/server";

export async function uploadDocumentAction(
    fileBase64: string,
    bucket: "estimates" | "invoices",
    filename: string,
    id: string // estimateId or invoiceId
) {
    const supabase = await createClient();

    try {
        // 1. Convert Base64 to Buffer
        const buffer = Buffer.from(fileBase64, "base64");

        // 2. Upload to Supabase Storage
        const filePath = `${filename}.pdf`;
        const { data, error } = await supabase.storage
            .from(bucket)
            .upload(filePath, buffer, {
                contentType: "application/pdf",
                upsert: true,
            });

        if (error) {
            console.error(`Storage Upload Error (${bucket}):`, error);
            return { success: false, error: error.message };
        }

        // 3. Get Public URL (or signed URL if private, but for now we'll use public URL for simplicity if configured)
        const { data: { publicUrl } } = supabase.storage
            .from(bucket)
            .getPublicUrl(filePath);

        // 4. Update Database
        const table = bucket === "estimates" ? "estimates" : "invoices";
        const { error: dbError } = await supabase
            .from(table)
            .update({ document_url: publicUrl })
            .eq("id", id);

        if (dbError) {
            console.error(`Database Update Error (${table}):`, dbError);
            return { success: false, error: dbError.message };
        }

        return { success: true, url: publicUrl };
    } catch (error: any) {
        console.error("Storage Action Error:", error);
        return { success: false, error: error.message || "Unknown error" };
    }
}
