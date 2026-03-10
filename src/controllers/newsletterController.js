import { sendNewsletterWelcome } from "../utils/sendEmail.js";

export const subscribeNewsletter = async (req, res) => {
  try {
    const { email } = req.body;

    const subscriber = await Newsletter.create({ email });

    await sendNewsletterWelcome(email); // THIS MUST RUN

    res.status(201).json({
      message: "Subscribed successfully",
      subscriber
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};