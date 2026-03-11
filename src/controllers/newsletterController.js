import Newsletter from "../models/Newsletter.js";
import sendEmail from "../utils/sendEmail.js";

export const subscribeNewsletter = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    // check if already subscribed
    const existing = await Newsletter.findOne({ email });

    if (existing) {
      return res.status(400).json({ message: "Email already subscribed" });
    }

    const subscriber = await Newsletter.create({ email });

    /* SEND WELCOME EMAIL */

await sendEmail({
  email: email,
  subject: " Welcome to HEAT ONLY",
  message: `
  <div style="font-family: Arial, sans-serif; background:#f4f6fb; padding:30px;">
    
    <div style="max-width:600px; margin:auto; background:white; border-radius:10px; overflow:hidden; box-shadow:0 5px 20px rgba(0,0,0,0.08);">

      <!-- HEADER -->
      <div style="background:linear-gradient(135deg,#7b2ff7,#f107a3); padding:25px; text-align:center;">
        <h1 style="color:white; margin:0; letter-spacing:2px;">HEAT ONLY</h1>
      </div>

      <!-- CONTENT -->
      <div style="padding:30px;">

        <h2 style="color:#333;">Welcome to Heat Only 🔥</h2>

        <p style="color:#555; font-size:15px; line-height:1.6;">
          Thanks for subscribing to our newsletter.  
          You’ll now receive updates about:
        </p>

        <!-- BENEFITS -->
        <div style="background:#f4f6fb; padding:18px; border-radius:8px; margin:20px 0;">
          <ul style="margin:0; padding-left:18px; color:#555; font-size:15px; line-height:1.8;">
            <li>🔥 New sneaker drops</li>
            <li>💎 Exclusive deals</li>
            <li>🚀 Limited collections</li>
          </ul>
        </div>

        <p style="color:#666; font-size:15px;">
          Here’s a featured drop you might like 👇
        </p>

        <!-- FEATURED PRODUCT -->
        <div style="margin:25px 0; text-align:center;">

          <img 
            src="https://images.unsplash.com/photo-1600185365483-26d7a4cc7519"
            alt="Sneaker"
            style="width:100%; max-width:420px; border-radius:10px; margin-bottom:15px;"
          />

          <h3 style="margin:5px 0; color:#333;">
            LV Trainer Sneaker
          </h3>

          <p style="font-size:18px; font-weight:bold; color:#7b2ff7;">
            R1,800
          </p>

          <a 
            href="https://h3atonly.com"
            style="display:inline-block; margin-top:10px; background:linear-gradient(135deg,#7b2ff7,#f107a3); color:white; padding:12px 28px; text-decoration:none; border-radius:6px; font-size:14px;">
            Shop Now
          </a>

        </div>

        <p style="color:#666; font-size:14px;">
          Stay tuned for more exclusive drops and deals.
        </p>

        <p style="margin-top:25px; color:#666; font-size:14px;">
          — Heat Only Team
        </p>

      </div>

      <!-- FOOTER -->
      <div style="background:#f4f6fb; padding:20px; text-align:center; font-size:13px; color:#777;">
        © ${new Date().getFullYear()} HEAT ONLY. All rights reserved.
      </div>

    </div>

  </div>
  `
});

    res.status(201).json({
      message: "Subscribed successfully",
      subscriber
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Subscription failed" });
  }
};

/* ADMIN SEND NEWSLETTER */

export const sendNewsletterBroadcast = async (req, res) => {

  try {

    const { subject, message } = req.body;

    if (!subject || !message) {
      return res.status(400).json({
        message: "Subject and message required"
      });
    }

    const subscribers = await Newsletter.find();

    for (const sub of subscribers) {

      await sendEmail({
        email: sub.email,
        subject,
        message
      });

    }

    res.json({
      message: `Newsletter sent to ${subscribers.length} subscribers`
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Newsletter broadcast failed"
    });

  }

};