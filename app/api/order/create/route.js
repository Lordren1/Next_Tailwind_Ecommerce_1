
import Product from "@/models/Product";
import User from "@/models/User";
import { getAuth } from "@clerk/nextjs/server";
import dbConnection from "@/config/mongodb";
import { NextResponse } from "next/server";
import { inngest } from "@/config/inngest";
import Order from "@/models/Order";


// Create new order of authenticated user | POST /api/order/create | Private (Clerk authentication required)
export async function POST(req) {
  try {
    const  {userId} = getAuth(req);
    if (!userId) {
      return NextResponse.json({ success: false, message: "Unathorized request"}, { status: 401 });
    }

    const { address, items} = await req.json();

    // Validate incoming payload
    if(!address || !items || items.length === 0) {
      return NextResponse.json({ success: false, message: "Invalid order data"}, { status: 400 });
    }

    await dbConnection();

    // Calculate total payable amount
    let amount = 0;

    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) continue

      amount += product.offerPrice * item.quantity;
    }

    // Add 2% Tax
    const finalAmount = amount + Math.floor(amount * 0.02);
    await inngest.send({
      name: "order/created",
      data: {
        userId,
        address,
        items,
        amount: finalAmount,
        date: Date.now(),
        paymentType: "COD",
      }
    })

    // Comment the event and test the order flow directly - save order directly
    /* await Order.create({
      userId,
      address,
      items,
      amount: finalAmount,
      date: Date.now(),
      paymentType: "COD",
    }) */

    //Clear user cart after order placement
    const user = await User.findById(userId);
    if (user) {
      user.cartItems = {};
      await user.save();
    }

    return NextResponse.json({ success: true, message: "Order placed successfully" }, { status: 201 });

  } catch (error) { // 👈 Make sure this catch block is properly paired with a closing '}' above it
    console.log("order creation error: ", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
