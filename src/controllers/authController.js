import User from "../models/Users.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import sendEmail from "../utils/sendEmail.js";


// REGISTER
export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(400).json({ message: "User already exists" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  // Generate 6 digit OTP
  const rawOtp = Math.floor(100000 + Math.random() * 900000).toString();

  // Hash OTP before saving
  const hashedOtp = crypto.createHash("sha256").update(rawOtp).digest("hex");

  const otpExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    otp: hashedOtp,
    otpExpires
  });

  await sendEmail({
    email: user.email,
    subject: "Your OTP Code",
    message: `
      <h2>Email Verification OTP</h2>
      <p>Your verification code is:</p>
      <h1>${rawOtp}</h1>
      <p>This code expires in 10 minutes.</p>
    `
  });

  res.status(201).json({
    message: "Registration successful. Please check your email for OTP."
  });
};

// LOGIN
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  // FIRST check if user exists
  if (!user) {
    return res.status(400).json({ message: "Invalid email or password" });
  }

  // THEN check verification
  if (!user.isVerified) {
    return res.status(401).json({ message: "Please verify your account first" });
  }

  // THEN check password
  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return res.status(400).json({ message: "Invalid email or password" });
  }

  res.json({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    token: generateToken(user._id)
  });
};

export const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(400).json({ message: "User not found" });
  }

  if (user.isVerified) {
    return res.status(400).json({ message: "Account already verified" });
  }

  // Hash incoming OTP
  const hashedOtp = crypto.createHash("sha256").update(otp).digest("hex");

  if (
    user.otp !== hashedOtp ||
    user.otpExpires < Date.now()
  ) {
    return res.status(400).json({ message: "Invalid or expired OTP" });
  }

  user.isVerified = true;
  user.otp = undefined;
  user.otpExpires = undefined;

  await user.save();

  res.json({ message: "Account verified successfully" });
};

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: "30d"
    });
};