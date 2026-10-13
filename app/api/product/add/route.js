
import Product from "@/models/Product";
import { getAuth } from "@clerk/nextjs/server";
import { v2 as cloudinary } from "cloudinary";
import { NextResponse } from "next/server";
import authSeller from "../../../../lib/authSeller";
/* import dbConnection from "../../../../config/mongodb"; */
import dbConnection from "@/config/mongodb";

// configure Cloudinary with your credentials
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Create a new product and upload the image to Cloudinary | POST /api/product/add | private(seller only)
export async function POST(req) {
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

    const formData = await req.formData();

    // Extract product fields
    const name = formData.get("name");
    const description = formData.get("description");
    const category = formData.get("category");
    const subCategory = formData.get("subCategory");
    const price = formData.get("price");
    const offerPrice = formData.get("offerPrice");
    const popular = formData.get("popular");

    // Extract image files
    const files = formData.getAll("images");
    if (!files || files.length === 0) {
      return NextResponse.json({ success: false, message: "No image files uploaded." }, { status: 400 });
    }

    // Upload images to Cloudinary
    const uploadResults = await Promise.all(
      files.map(async (file) => {
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        return new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { resource_type: "auto" },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          );
          stream.end(buffer);
        });
      })
    );

    const images = uploadResults.map((item) => item.secure_url);
    const isPopular = popular === "true" || popular === true;

    await dbConnection();

    // Create product entry in the database
    const newProduct = await Product.create({
      userId,
      name,
      description,
      category,
      subCategory,
      price: Number(price),
      offerPrice: Number(offerPrice),
      popular: isPopular,
      images,
      date: Date.now(),
    });

    return NextResponse.json(
      { success: true, message: "Product added successfully.", product: newProduct },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/product/add error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}