import dbConnection from "@/config/mongodb";
import Product from "@/models/Product";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import authSeller from "../../../../lib/authSeller";



// Fetch Seller products | GET /api/product/seller-list | private(seller only)
export async function GET(req) {
  try {
    const { userId } = getAuth(req);

    // Validate seller authorization
    const isSeller = await authSeller(userId);
    if (!isSeller) {
      return NextResponse.json(
        { success: false, message: "Unauthorized access. Only sellers can add products." },
        { status: 403 },
      );
    }

    await dbConnection()

    const products = await Product.find({})

    return NextResponse.json(
      { success: true, products },
      { status: 200 }
    );

    
  } catch (error) {
    console.error("GET /api/product/seller-list error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}