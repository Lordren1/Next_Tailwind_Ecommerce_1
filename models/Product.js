import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, ref: "user" },

    name: { type: String, required: true, unique: true },

    description: { type: String, required: true },

    price: { type: Number, required: true },

    offerPrice: { type: Number, required: true },

    images: { type: Array, required: true },

    category: { type: String, required: true },

    subCategory: { type: String, required: true },

    popular: { type: Boolean, default: false },

    inStock: { type: Boolean, default: true },

    date: { type: Number, default: Date.now },
  },
  { minimize: false }
);

const Product =
  mongoose.models.Product || mongoose.model("Product", productSchema);

export default Product;