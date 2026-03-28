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

    // NEW
    discount: {
      type: Number,
      default: 0
    },

    // NEW
    finalPrice: {
      type: Number
    },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
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


/* AUTO CALCULATE DISCOUNT PRICE */

productSchema.pre("save", function () {

  if (this.discount > 0) {

    this.finalPrice =
      this.price - (this.price * this.discount) / 100;

  } else {

    this.finalPrice = this.price;

  }

});


const Product = mongoose.model("Product", productSchema);

export default Product;