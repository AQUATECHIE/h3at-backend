import mongoose from "mongoose";

const orderItemSchema = mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },

  name: String,
  price: Number,
  image: String,
  quantity: Number,
  selectedSize: String,
});

const orderSchema = mongoose.Schema(
{
  /* USER ORDER (optional now) */
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: false
  },

  /* GUEST ORDER */
  guestEmail: {
    type: String
  },

  orderItems: [orderItemSchema],

  shippingAddress: {
    firstName: String,
    lastName: String,
    email: String,
    phone: String,
    address: String,
    city: String,
  },

  subtotal: Number,
  shipping: Number,
  totalAmount: Number,

  status: {
    type: String,
    enum: ["pending", "paid", "shipped", "delivered"],
    default: "pending",
  },

  /* optional useful field */
  paymentMethod: {
    type: String,
    default: "whatsapp"
  }

},
{ timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);

export default Order;