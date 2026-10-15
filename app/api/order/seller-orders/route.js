import dbConnection from "@/config/mongodb";
import { NextResponse } from "next/server";
import Order from "@/models/Order";
import Address from "@/models/Address";
import Product from "@/models/Product";
import { getAuth } from "@clerk/nextjs/server";
import authSeller from "@/lib/authSeller";
import mongoose from "mongoose";



// Fetch all orders | GET /api/seller-orders | Private ( Seller only ) 
export async function GET(req) {
  try {

    const {userId} = getAuth(req);

    // Ensure database connection is active BEFORE checking vendor privileges
    //(In case authSeller needs to perform a DB check on the user role)
    await dbConnection();

    const isSeller = await authSeller(userId);
    if(!isSeller) {
      return NextResponse.json(
      { success: false, message: "Not Authorized" },
      { status: 403 } // Forbidden for unauthorized roles
    );
    }

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

    // Force register the models explicitly to prevent Next.js hot-reload population crashes
    const _registerAddress = Address;
    const _registerProduct = Product;

    // Fetch Orders and populate address & nested product fields
    const orders = await Order.find({
      $or: [
        {paymentType: "COD"}, 
        {paymentType: "Stripe", isPaid: true}
      ]
    })
    .populate({ path: "address", model: "Address" })
    .populate({ path: "items.product", model: "Product" });

    return NextResponse.json(
      { success: true, orders },
      { status: 200 }
    );

    
  } catch (error) {
    console.error("GET /api/order/seller-list error:", error);
    return NextResponse.json(
      { success: false, message: error.message }, 
      { status: 500 }
    );
  } 
}