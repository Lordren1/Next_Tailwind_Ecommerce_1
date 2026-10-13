  import dbConnection from "../../../../config/mongodb";
  import Address from "../../../../models/Address";
  import { getAuth } from "@clerk/nextjs/server";
  import { NextResponse } from "next/server";


  //Create a new Address for the authenticated user | POST /api/user/add-address | Privatte (Clerk authentication)
  export async function POST(req) {
    try {
      const {userId} = getAuth(req);
      if (!userId) {
        return NextResponse.json({ success: false, message: "Unauthorized request"}, {status: 401});
      }

      const { address } = await req.json();

      await dbConnection();

      const newAddress = await Address.create({ ...address, userId });

      return NextResponse.json(
        { success: true, message: "Address added", newAddress },
        { status: 201 }
      );
    } catch (error) {
      console.error("POST /api/user/add-address", error);
      return NextResponse.json({success: false, message: error.message}, { status: 500 });
    }
  }