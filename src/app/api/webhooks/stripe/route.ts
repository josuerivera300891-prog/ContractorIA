import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { createClient } from "@/utils/supabase/server";

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

        if (invoiceId) {
            const supabase = await createClient();

            // Update invoice status to PAID
            const { error } = await supabase
                .from("invoices")
                .update({
                    status: "PAID",
                    balance_due: 0,
                    metadata: {
                        stripe_session_id: session.id,
                        payment_intent: session.payment_intent
                    }
                })
                .eq("id", invoiceId);

            if (error) {
                console.error("Error updating invoice status:", error);
                return new NextResponse("Error updating database", { status: 500 });
            }

            console.log(`Invoice ${invoiceId} marked as PAID`);
        }
    }

    return new NextResponse("Webhook received", { status: 200 });
}
