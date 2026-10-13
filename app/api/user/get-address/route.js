  import dbConnection from "../../../../config/mongodb";
  import Address from "../../../../models/Address";
  import { getAuth } from "@clerk/nextjs/server";
  import { NextResponse } from "next/server";


  //Get all saved addresses for the authenticated user | GET /api/user/get-address | Privatte (Clerk authentication)
  export async function GET(req) {
    try {
      const {userId} = getAuth(req);
      if (!userId) {
        return NextResponse.json({ success: false, message: "Unauthorized request"}, {status: 401});
      }

      await dbConnection();

      const addresses = await Address.find({ userId });

      return NextResponse.json(
        { success: true, addresses },
        { status: 200 }
      );
    } catch (error) {
      console.error("POST /api/user/get-address", error);
      return NextResponse.json({success: false, message: error.message}, { status: 500 });
    }
  }