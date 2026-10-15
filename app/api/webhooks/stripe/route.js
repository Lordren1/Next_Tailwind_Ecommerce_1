import dbConnection from "@/config/mongodb";
import Order from "@/models/Order";
import User from "@/models/User";
import { inngest } from "@/config/inngest";
import { NextResponse } from "next/server";
import Stripe from "stripe";



const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(req) {
  try {
    // Get the raw body text and Stripe cryptographic signature header
    const body = await req.text();
    const signature = req.headers.get("stripe-signature");

    if (!signature) {
      return NextResponse.json({ error: "Missing stripe signature" }, { status: 400});
    }

    let event;

    // Verify that the event genuinely came from Stripe using your secret key
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      console.error(`❌ Webhook signature verification failed:`, err.message);
      return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
    }

    // Handle the specific successful checkout event
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;

      // Extract the metadata variables we passed during session creation
      const orderId = session.metadata?.orderId;
      const userId = session.metadata?.userId;

      await dbConnection();

      // Update Order Status in MongoDB
      if (orderId) {
        await Order.findByIdAndUpdate(orderId, {
          isPaid: true,
          status: "Paid", //
        });
        console.log(`✅ Order ${orderId} updated to PAID in Database.`);
      }

      // Clear User Cart in MongoDB
      if (userId) {
        const user = await User.findById(userId);
        if (user) {
          user.cartItems = {};
          await user.save();
          console.log(`🧹 Cart cleared for User ${userId}.`);
        }
      }

      // Trigger your inngest Backgroud Worker Pipeline
      // This sends confirmation emails, updates inventory  stocks, etc.
      if (orderId && userId) {
        await inngest.send({
          name: "order/created",
          data: {
            orderId,
            userId,
            paymentType: "Stripe",
            status: "paid"
          }
        });
        console.log(`🚀 Sent background notification event to Inngest pipeline.`);
      }
    }

    // Handle Expired / Abandoned checkout session configurations
    else if (event.type === "checkout.session.expired") {
      const session = event.data.object;
      const orderId = session.metadata?.orderId;

      if (orderId) {
        await dbConnection();

        // Remove the unpaid, abandoned order from your MongoDB database collection
        await Order.findByIdAndDelete(orderId);
        console.log(`🗑️ Abandoned Order ${orderId} successfully deleted from MongoDB due to checkout session expiration.`);
      }
    }

    // Return a 200 response to acknowledge receipt of the event promptly
    return NextResponse.json({ received: true}, { status: 200});

  } catch (error) {
    console.error("Stripe Webhook Handler Error:", error);
    return NextResponse.json({ error: "Internal Server Error"}, { status: 500 });
  }
}