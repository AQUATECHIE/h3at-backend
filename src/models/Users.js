import mongoose from "mongoose";

const addressSchema = new mongoose.Schema({
    country: String,
    address: String,
    apartment: String,
    city: String,
    state: String,
    postalCode: String,
    phone: String
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

        phone: {
            type: String,
            default: ""
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

        address: addressSchema
    },

    { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;