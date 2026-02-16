'use server'
// Actually, server actions don't need "use client".

import { stripe } from "@/lib/stripe";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export async function createInvoiceCheckoutSession(invoiceId: string, locale: string, tenant: string) {
    const supabase = await createClient();

    // 1. Get invoice data
    const { data: invoice, error: invError } = await supabase
        .from("invoices")
        .select(`
            *,
            estimates!inner(
                *,
                clients!inner(*)
            )
        `)
        .eq("id", invoiceId)
        .single();

    if (invError || !invoice) {
        throw new Error("Invoice not found");
    }

    // 2. Create Stripe Checkout Session
    const origin = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
            {
                price_data: {
                    currency: "usd",
                    product_data: {
                        name: `Factura ${invoice.invoice_number || 'IA-000'}`,
                        description: `Pago por servicios - ContractorIA`,
                    },
                    unit_amount: Math.round(Number(invoice.total) * 100), // Cents
                },
                quantity: 1,
            },
        ],
        mode: "payment",
        success_url: `${origin}/${locale}/${tenant}/invoices?success=true`,
        cancel_url: `${origin}/${locale}/${tenant}/invoices?canceled=true`,
        metadata: {
            invoiceId: invoiceId,
            companyId: invoice.company_id,
        },
    });

    if (!session.url) {
        throw new Error("Failed to create checkout session");
    }

    // Redirect to Stripe
    return session.url;
}
