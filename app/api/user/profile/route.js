import dbConnection from '@/config/mongodb';
import User from '@/models/User';
import { NextResponse } from 'next/server';
import {getAuth} from '@clerk/nextjs/server';
/* import dbConnection from '../../../../config/mongodb'; */


// fetch authenticated user's full profile information from the MongoDB database | GET/api/user/profile | Private
export async function GET(req) {
  try {
    const {userId} = getAuth(req);
    if(!userId) {
      return NextResponse.json({success: false, message: 'Unauthorized access'}, {status: 401});

    }
    await dbConnection();

    const user = await User.findById(userId)
    if(!user) {
      return NextResponse.json({success: false, message: 'User not found'}, {status: 404});
    }

    return NextResponse.json({success: true, user}, {status: 200});

  } catch (error) {
    console.error('GET /api/user/profile error:', error);
    return NextResponse.json({success: false, message: 'Something went wrong while fetching the user profile'}, {status: 500}); 
  }
}
