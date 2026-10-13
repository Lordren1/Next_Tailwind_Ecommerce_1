import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import dbConnection from "../../../../config/mongodb";
import User from "../../../../models/User";

// Update authenticated user's cartItems in the database | POST /api/cart/update | Private (requires clert authentictation)
export async function POST(req) {
  try {
    const {userId} = getAuth(req)
    if (!userId) {
      return NextResponse.json({success: false, message: "Unauthorized request"})
    }

    const {cartData} = await req.json()
    await dbConnection()

    const user = await User.findById(userId)
    if (!user) {
      return NextResponse.json({success:false, message: "User not found"})
    }

    user.cartItems = cartData
    await user.save()
    return NextResponse.json( { success: true},{ status: 200 })

  } catch (error) {
    console.error("GET /api/cart/update error: ", error)
    return NextResponse.json({success: false, message: error.message})
  }
} 