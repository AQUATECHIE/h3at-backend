import mongoose from "mongoose";

const promoSchema = mongoose.Schema(
{
  title: {
    type: String,
    required: true
  },

  image: {
    url: String,
    public_id: String
  },

  link: {
    type: String,
    default: "/products"
  },

  active: {
    type: Boolean,
    default: true
  }

},
{ timestamps: true }
);

const Promo = mongoose.model("Promo", promoSchema);

export default Promo;