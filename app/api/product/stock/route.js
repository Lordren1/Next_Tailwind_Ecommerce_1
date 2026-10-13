import { NextResponse } from "next/server";
import dbConnection from "../../../../config/mongodb";
import Product from "../../../../models/Product";
import { getAuth } from "@clerk/nextjs/server";
import authSeller from "../../../../lib/authSeller";


// Toggle a product's stock status | POST /api/product/stock | private(seller only)
export async function POST(req) {
  try {
    const { userId } = getAuth(req);

    const isSeller = await authSeller(userId);
    if (!isSeller) {
      return NextResponse.json(
        { success: false, message: "Unauthorized access. Only sellers can update products." },
        { status: 403 }
      );
    }

    const { productId, inStock } = await req.json();

    await dbConnection();

    await Product.findByIdAndUpdate(productId, { inStock });

    return NextResponse.json(
      { success: true, message: "Stock status updated." },
      { status: 200 }
    );
  } catch (error) {
    console.error("POST /api/product/stock error:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}