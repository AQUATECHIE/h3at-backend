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
    subject: "Welcome to HEAT ONLY – Verify Your Email",
    message: `
  <div style="font-family: Arial, sans-serif; background:#f4f6fb; padding:30px;">
    
    <div style="max-width:600px; margin:auto; background:white; border-radius:10px; overflow:hidden; box-shadow:0 5px 20px rgba(0,0,0,0.08);">
      
      <div style="background:linear-gradient(135deg,#7b2ff7,#f107a3); padding:25px; text-align:center;">
        <h1 style="color:white; margin:0; letter-spacing:2px;">HEAT ONLY</h1>
      </div>

      <div style="padding:30px;">
        <h2 style="color:#333;">Welcome, ${name}! 👋</h2>
        
        <p style="color:#555; font-size:15px; line-height:1.6;">
          Thank you for joining <strong>HEAT ONLY</strong>.  
          To complete your registration, please verify your email using the OTP code below.
        </p>

        <div style="margin:30px 0; text-align:center;">
          <div style="display:inline-block; background:#f4f6fb; padding:20px 30px; border-radius:8px;">
            <span style="font-size:32px; letter-spacing:6px; font-weight:bold; color:#7b2ff7;">
              ${rawOtp}
            </span>
          </div>
        </div>

        <p style="color:#666; font-size:14px;">
          This verification code will expire in <strong>10 minutes</strong>.
        </p>

        <p style="color:#666; font-size:14px;">
          If you did not create an account on <strong>HEAT ONLY</strong>, please ignore this email.
        </p>
      </div>

      <div style="background:#f4f6fb; padding:20px; text-align:center; font-size:13px; color:#777;">
        © ${new Date().getFullYear()} H3AT ONLY. All rights reserved.
      </div>

    </div>
  </div>
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

export const resendOtp = async (req, res) => {
  const { email } = req.body;

  try {

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: "Account already verified" });
    }

    // Generate new OTP
    const rawOtp = Math.floor(100000 + Math.random() * 900000).toString();

    // Hash OTP
    const hashedOtp = crypto
      .createHash("sha256")
      .update(rawOtp)
      .digest("hex");

    user.otp = hashedOtp;
    user.otpExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

    await user.save();

    await sendEmail({
      email: user.email,
      subject: "HEAT ONLY – Your New Verification Code",
      message: `
      <div style="font-family: Arial, sans-serif; background:#f4f6fb; padding:30px;">
        
        <div style="max-width:600px; margin:auto; background:white; border-radius:10px; overflow:hidden; box-shadow:0 5px 20px rgba(0,0,0,0.08);">
          
          <div style="background:linear-gradient(135deg,#7b2ff7,#f107a3); padding:25px; text-align:center;">
            <h1 style="color:white; margin:0;">HEAT ONLY</h1>
          </div>

          <div style="padding:30px; text-align:center;">
            
            <h2>Your New OTP Code</h2>

            <div style="margin:25px 0;">
              <span style="font-size:32px; letter-spacing:6px; font-weight:bold; color:#7b2ff7;">
                ${rawOtp}
              </span>
            </div>

            <p style="color:#666;">
              This code will expire in <strong>10 minutes</strong>.
            </p>

          </div>

          <div style="background:#f4f6fb; padding:20px; text-align:center; font-size:13px; color:#777;">
            © ${new Date().getFullYear()} HEAT ONLY
          </div>

        </div>

      </div>
      `
    });

    res.json({
      message: "A new OTP has been sent to your email"
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to resend OTP"
    });
  }
};

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d"
  });
};

export const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    user.phone = req.body.phone || user.phone;

    await user.save();

    res.json({
      message: "Profile updated",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone
      }
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};