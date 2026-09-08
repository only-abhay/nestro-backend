import "dotenv/config";
import nodemailer from "nodemailer";
import dns from "dns";

dns.setDefaultResultOrder("ipv4first");

export async function SendOtpMail(toemail, otp) {
  try {
    const { EMAIL_KEY, APP_PASSKEY } = process.env;

    if (!EMAIL_KEY || !APP_PASSKEY) {
      throw new Error("EMAIL_KEY or APP_PASSKEY missing");
    }

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: EMAIL_KEY,
        pass: APP_PASSKEY,
      },
      connectionTimeout: 40000,
      greetingTimeout: 40000,
      socketTimeout: 40000,
    });

    await transporter.verify();

    console.log("SMTP connection successful");

    await transporter.sendMail({
      from: `"Nestro" <${EMAIL_KEY}>`,
      to: toemail,
      subject: "Nestro - Verify Your Email",
      html: `
        <div style="max-width:600px;margin:auto;font-family:Arial,sans-serif;padding:20px;border:1px solid #e5e5e5;border-radius:10px;">
          <h2 style="color:#8B5E3C;text-align:center;">
            Welcome to Nestro
          </h2>

          <p>Hello,</p>
          <p>Your One Time Password (OTP) is:</p>

          <div style="text-align:center;margin:30px 0;">
            <span style="
              display:inline-block;
              background:#8B5E3C;
              color:#fff;
              padding:15px 30px;
              font-size:28px;
              font-weight:bold;
              letter-spacing:8px;
              border-radius:8px;
            ">
              ${otp}
            </span>
          </div>

          <p>This OTP is valid for <strong>10 minutes</strong>.</p>

          <hr>

          <p style="text-align:center;color:#777;font-size:12px;">
            © ${new Date().getFullYear()} Nestro. All Rights Reserved.
          </p>
        </div>
      `,
    });

    return "otp Email Sent Successfully";

  } catch (error) {
    console.error("Email Error:", {
      message: error.message,
      code: error.code,
      responseCode: error.responseCode,
      command: error.command,
    });

    return false;
  }
}