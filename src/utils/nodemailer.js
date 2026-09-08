import "dotenv/config";
import nodemailer from "nodemailer";
import dns from "dns";
 
// Force IPv4 resolution - fixes ENETUNREACH error on Render
dns.setDefaultResultOrder("ipv4first");
 
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // true for port 465 (SSL)
  auth: {
    user: process.env.EMAIL_KEY,
    pass: process.env.APP_PASSKEY,
  },
  family: 4, // force IPv4 - Render's network can't reach Gmail's IPv6 address
});
 
export async function SendOtpMail(normalizedEmail, otp) {
  try {
    if (!process.env.EMAIL_KEY || !process.env.APP_PASSKEY) {
      console.error("EMAIL_KEY or APP_PASSKEY is missing");
      return false;
    }
    if (!normalizedEmail || !otp) {
      console.error("Email or OTP is missing");
      return false;
    }
    console.log("Sending OTP to:", normalizedEmail);
    const info = await transporter.sendMail({
      from: `"Nestro" <${process.env.EMAIL_KEY}>`,
      to: normalizedEmail,
      subject: "Nestro - Verify Your Email",
      html: `
        <div style="
          max-width: 500px;
          margin: auto;
          padding: 30px;
          font-family: Arial, sans-serif;
          border: 1px solid #ddd;
          border-radius: 10px;
        ">
          <h2 style="text-align:center;">Nestro</h2>
          <p>Hello,</p>
          <p>Your OTP for email verification is:</p>
          <h1 style="
            text-align:center;
            letter-spacing: 8px;
            margin: 25px 0;
          ">
            ${otp}
          </h1>
          <p>This OTP will expire in <strong>10 minutes</strong>.</p>
          <p>If you did not request this OTP, you can safely ignore this email.</p>
          <p>Regards,<br/>Nestro Team</p>
        </div>
      `,
    });
    console.log("OTP email sent successfully:", info.messageId);
    return true;
  } catch (error) {
    console.error("Email Error:", {
      message: error.message,
      code: error.code,
      responseCode: error.responseCode,
      command: error.command,
    });
    return false;
  }}