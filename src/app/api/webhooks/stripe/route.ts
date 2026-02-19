import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
    const body = await req.text();
    const signature = req.headers.get("stripe-signature") as string;

    let event;

    try {
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET!
        );
    } catch (err: any) {
        console.error(`Webhook Error: ${err.message}`);
        return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
    }

    // Handle the event
    if (event.type === "checkout.session.completed") {
        const session = event.data.object as any;
        const invoiceId = session.metadata?.invoiceId;
        const paymentId = session.metadata?.paymentId;
        const isPartial = session.metadata?.isPartial === "true";

        if (invoiceId) {
            const supabase = await createClient();

            if (isPartial && paymentId) {
                // PAGO PARCIAL: Actualizar el registro de pago
                // El trigger de la BD actualizará automáticamente el balance de la factura
                const { error } = await supabase
                    .from("invoice_payments")
                    .update({
                        status: "COMPLETED",
                        stripe_payment_intent: session.payment_intent,
                        paid_at: new Date().toISOString()
                    })
                    .eq("id", paymentId);

                if (error) {
                    console.error("Error updating payment record:", error);
                    return new NextResponse("Error updating payment", { status: 500 });
                }

                console.log(`Partial payment ${paymentId} for invoice ${invoiceId} completed`);
            } else {
                // PAGO COMPLETO (legacy): Crear registro en invoice_payments y marcar como pagado
                const { data: invoice } = await supabase
                    .from("invoices")
                    .select("company_id, total")
                    .eq("id", invoiceId)
                    .single();

                if (invoice) {
                    // Crear registro de pago completo
                    await supabase
                        .from("invoice_payments")
                        .insert({
                            invoice_id: invoiceId,
                            company_id: invoice.company_id,
                            amount: invoice.total,
                            payment_method: 'STRIPE',
                            status: 'COMPLETED',
                            stripe_session_id: session.id,
                            stripe_payment_intent: session.payment_intent,
                            paid_at: new Date().toISOString()
                        });
                    // El trigger actualizará el balance automáticamente
                }

                console.log(`Invoice ${invoiceId} paid in full`);
            }
        }
    }

    return new NextResponse("Webhook received", { status: 200 });
}
