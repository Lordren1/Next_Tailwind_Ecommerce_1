import Product from "@/models/Product";
import { getAuth } from "@clerk/nextjs/server";
import dbConnection from "@/config/mongodb";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import Order from "@/models/Order";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Create new stripe order of authenticated user | POST /api/order/stripe | Private
export async function POST(req) {
  try {
    const { userId } = getAuth(req);
    if (!userId) {
      return NextResponse.json({ success: false, message: "Unauthorized request" }, { status: 401 });
    }

    const { address, items } = await req.json();
    const origin = req.headers.get("origin") || "http://localhost:3000";

    if (!address || !items || items.length === 0) {
      return NextResponse.json({ success: false, message: "Invalid order data" }, { status: 400 });
    }

    await dbConnection();

    // 1. Create a true 2% Tax Rate via the correct parameters array mapping
    const stripeTaxRate = await stripe.taxRates.create({
      display_name: "Tax",
      description: "Estimated Order Tax",
      inclusive: false, //  FIX: Replaced 'direction: "exclusive"' with 'inclusive: false'
      percentage: 2.0, 
    });

    const line_items = [];
    let subtotalAmount = 0;

    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) continue;

      subtotalAmount += product.offerPrice * item.quantity;

      let imageUrl = "";
      if (product.images) {
        if (typeof product.images === "string") {
          imageUrl = product.images;
        } else if (Array.isArray(product.images) && typeof product.images === "string") {
          imageUrl = product.images;
        } else if (product.images["0"]) {
          imageUrl = product.images["0"];
        }
      }

      // 2. Build the standard line item mapping configurations safely
      line_items.push({
        price_data: {
          currency: "usd",
          product_data: {
            name: product.name,
            images: imageUrl ? [imageUrl] : [],
          },
          unit_amount: Math.round(product.offerPrice * 100), 
        },
        quantity: Number(item.quantity), 
        tax_rates: [stripeTaxRate.id], // Binds the tax token to this line item
      });
    }

    // 3. Compute final totals calculations for your database tracking metrics
    const taxAmount = Math.floor(subtotalAmount * 0.02);
    const finalAmount = subtotalAmount + taxAmount;

    // Create the temporary order tracking instance inside MongoDB
    const newOrder = await Order.create({
      userId,
      address,
      items,
      amount: finalAmount,
      paymentType: "Stripe",
      isPaid: false,
      date: Date.now(),
    });

    // 4. Build the final Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      line_items,
      mode: "payment",
      success_url: `${origin}/order-confirmation?session_id={CHECKOUT_SESSION_ID}&orderId=${newOrder._id}`,
      cancel_url: `${origin}/cart`,
      metadata: {
        orderId: newOrder._id.toString(),
        userId,
      },
    });

    return NextResponse.json({ success: true, url: session.url }, { status: 200 });

  } catch (error) {
    console.error("Stripe order registration crash:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
