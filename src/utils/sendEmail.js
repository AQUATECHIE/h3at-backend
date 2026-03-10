import nodemailer from "nodemailer";

/* SINGLE TRANSPORTER */

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});


/* GENERIC EMAIL SENDER */

export const sendEmail = async (options) => {

  const mailOptions = {
    from: `"HEAT ONLY" <${process.env.EMAIL_USER}>`,
    to: options.email,
    subject: options.subject,
    html: options.message
  };

  await transporter.sendMail(mailOptions);

};


/* NEWSLETTER WELCOME EMAIL */

export const sendNewsletterWelcome = async (email) => {

  const mailOptions = {
    from: `"Heat Only" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "🔥 Welcome to Heat Only",
    html: `
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

        <p>
        Stay tuned for our latest releases.
        </p>

        <p style="margin-top:20px">
        — Heat Only Team
        </p>

      </div>
    `
  };

   const info = await transporter.sendMail(mailOptions);

  console.log("Email sent:", info.response);

};