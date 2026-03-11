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
      subject: "🔥 Welcome to Heat Only",
      message: `
        <div style="font-family:sans-serif;padding:20px">

          <h2>Welcome to Heat Only 🔥</h2>

          <p>
          Thanks for subscribing to our newsletter.
          You'll now receive updates about:
          </p>

          <ul>
            <li>New sneaker drops</li>
            <li>Exclusive deals</li>
            <li>Limited collections</li>
          </ul>

          <p>Stay tuned for our latest releases.</p>

          <p style="margin-top:20px">— Heat Only Team</p>

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