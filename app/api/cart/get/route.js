import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import dbConnection from "../../../../config/mongodb";
import User from "../../../../models/User";


// Get logged-in user's cartItems | GET /api/cart/update | Private (requires clert authentictation)
export async function GET(req) {
  try {
    const {userId} = getAuth(req)
    if (!userId) {
      return NextResponse.json({success: false, message: "Unauthorized request"})
    }

    await dbConnection()

    const user = await User.findById(userId)
    if (!user) {
      return NextResponse.json({success:false, message: "User not found"})
    }

    const {cartItems} = user
    return NextResponse.json( { success: true, cartItems},{ status: 200 })

  } catch (error) {
    console.error("GET /api/cart/get error: ", error)
    return NextResponse.json({success: false, message: error.message})
  }
} 