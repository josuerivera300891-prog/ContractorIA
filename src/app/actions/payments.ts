'use server'

import { stripe } from "@/lib/stripe";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { PaymentMethod } from "@/types/domain";

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

/**
 * Crea una sesión de pago parcial en Stripe
 */
export async function createPartialPaymentCheckout(
    invoiceId: string,
    amount: number,
    locale: string,
    tenant: string
) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("No autorizado");

    // 1. Get invoice data
    const { data: invoice, error: invError } = await supabase
        .from("invoices")
        .select("*, companies(*)")
        .eq("id", invoiceId)
        .single();

    if (invError || !invoice) {
        throw new Error("Factura no encontrada");
    }

    // Validar que el monto no exceda el balance
    if (amount > invoice.balance_due) {
        throw new Error("El monto excede el balance pendiente");
    }

    if (amount <= 0) {
        throw new Error("El monto debe ser mayor a 0");
    }

    // 2. Crear registro de pago pendiente
    const { data: payment, error: paymentError } = await supabase
        .from("invoice_payments")
        .insert({
            invoice_id: invoiceId,
            company_id: invoice.company_id,
            amount: amount,
            payment_method: 'STRIPE',
            status: 'PENDING',
            created_by: user.id
        })
        .select()
        .single();

    if (paymentError) {
        throw new Error("Error creando registro de pago");
    }

    // 3. Create Stripe Checkout Session
    const origin = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
            {
                price_data: {
                    currency: "usd",
                    product_data: {
                        name: `Pago parcial - Factura ${invoice.invoice_number || 'IA-000'}`,
                        description: `Abono de $${amount.toFixed(2)} USD`,
                    },
                    unit_amount: Math.round(amount * 100),
                },
                quantity: 1,
            },
        ],
        mode: "payment",
        success_url: `${origin}/${locale}/${tenant}/invoices/${invoiceId}?payment=success`,
        cancel_url: `${origin}/${locale}/${tenant}/invoices/${invoiceId}?payment=canceled`,
        metadata: {
            invoiceId: invoiceId,
            paymentId: payment.id,
            companyId: invoice.company_id,
            isPartial: "true"
        },
    });

    // Guardar session_id en el pago
    await supabase
        .from("invoice_payments")
        .update({ stripe_session_id: session.id })
        .eq("id", payment.id);

    if (!session.url) {
        throw new Error("Error creando sesión de pago");
    }

    return session.url;
}

/**
 * Registra un pago manual (efectivo, cheque, transferencia)
 */
export async function recordManualPayment(
    invoiceId: string,
    amount: number,
    method: PaymentMethod,
    notes?: string
) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, error: "No autorizado" };

    // 1. Get invoice and validate
    const { data: invoice, error: invError } = await supabase
        .from("invoices")
        .select("*")
        .eq("id", invoiceId)
        .single();

    if (invError || !invoice) {
        return { success: false, error: "Factura no encontrada" };
    }

    if (amount > invoice.balance_due) {
        return { success: false, error: "El monto excede el balance pendiente" };
    }

    if (amount <= 0) {
        return { success: false, error: "El monto debe ser mayor a 0" };
    }

    // 2. Crear registro de pago completado
    const { error: paymentError } = await supabase
        .from("invoice_payments")
        .insert({
            invoice_id: invoiceId,
            company_id: invoice.company_id,
            amount: amount,
            payment_method: method,
            status: 'COMPLETED',
            notes: notes,
            paid_at: new Date().toISOString(),
            created_by: user.id
        });

    if (paymentError) {
        return { success: false, error: paymentError.message };
    }

    // El trigger de la BD actualizará automáticamente el balance de la factura

    // 3. Audit Log
    await supabase.from('audit_logs').insert({
        company_id: invoice.company_id,
        actor_id: user.id,
        action: 'PAYMENT_RECORDED',
        metadata: {
            invoice_id: invoiceId,
            amount: amount,
            method: method
        }
    });

    revalidatePath('/[locale]/[tenant]/invoices/[id]', 'page');
    return { success: true };
}

/**
 * Obtiene el historial de pagos de una factura
 */
export async function getInvoicePayments(invoiceId: string) {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("invoice_payments")
        .select("*")
        .eq("invoice_id", invoiceId)
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Error fetching payments:", error);
        return [];
    }

    return data;
}

/**
 * Obtiene una factura con sus pagos
 */
export async function getInvoiceWithPayments(invoiceId: string, companyId: string) {
    const supabase = await createClient();

    const { data: invoice, error: invError } = await supabase
        .from("invoices")
        .select(`
            *,
            clients:client_id(*)
        `)
        .eq("id", invoiceId)
        .eq("company_id", companyId)
        .single();

    if (invError || !invoice) {
        return null;
    }

    const payments = await getInvoicePayments(invoiceId);

    return {
        ...invoice,
        payments
    };
}
