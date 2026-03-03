import mongoose from "mongoose";

const productSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true
    },
    category: {
      type: String,
      enum: ["shoes", "bags", "clothes"],
      required: true
    },
    brand: String,
    stock: {
      type: Number,
      default: 0
    },
    images: [
  {
    url: String,
    public_id: String
  }
],

    specifications: {
      type: Object
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);

export default Product;