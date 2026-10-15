import dbConnection from "@/config/mongodb";
import Address from "@/models/Address";
import Product from "@/models/Product";
import { NextResponse } from "next/server";
import Order from "@/models/Order";
import { getAuth } from "@clerk/nextjs/server";
import mongoose from "mongoose";



// Fetch all orders | GET /api/order/list | Private ( Clerk Authentication required) 
export async function GET(req) {
  try {

    const {userId} = getAuth(req);
    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized request" },
        { status: 401 }
      );
    }

    await dbConnection();

    // 💡 FORCE REGISTER MODELS INTO MONGOOSE MEMORY FOR POPULATION TO WORK SAFELY
    if (!mongoose.models.Order) {
      mongoose.model("Order", Order.schema || Order);
    }
    if (!mongoose.models.Address) {
      mongoose.model("Address", Address.schema || Address);
    }
    if (!mongoose.models.Product) {
      mongoose.model("Product", Product.schema || Product);
    }

    // Avoid Next.js hot-reloading population bugs by referencing schemas explicitly
    const _registerAddress = Address;
    const _registerProduct = Product;
    

    // Fetch Orders and explicitly populate the linked models
    const orders = await Order.find({userId, $or: [{paymentType: "COD"}, {paymentType: "Stripe", isPaid: true}]})
      .populate({ path: "address", model: "Address" })
      .populate({ path: "items.product", model: "Product" });

      

    return NextResponse.json(
      { success: true, orders },
      { status: 200 }
    );

    
  } catch (error) {
    console.error("GET /api/order/list error:", error);
    return NextResponse.json(
      { success: false, message: error.message }, 
      { status: 500 }
    );
  }
}