import mongoose from "mongoose";

const addressSchema = new mongoose.Schema({
  country: {
    type: String
  },
  address: {
    type: String
  },
  apartment: {
    type: String
  },
  city: {
    type: String
  },
  state: {
    type: String
  },
  postalCode: {
    type: String
  },
  phone: {
    type: String
  }
});

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },

    email: {
      type: String,
      required: true,
      unique: true
    },

    password: {
      type: String,
      required: true
    },

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user"
    },

    otp: String,
    otpExpires: Date,

    isVerified: {
      type: Boolean,
      default: false
    },

    // 🔹 NEW ADDRESS FIELD
    address: addressSchema
  },

  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;