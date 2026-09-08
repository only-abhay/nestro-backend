import "dotenv/config";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function SendOtpMail(toemail, otp) {
  try {
    if (!process.env.RESEND_API_KEY) {
      throw new Error("RESEND_API_KEY is missing");
    }

    console.log("Sending OTP to:", toemail);

    const { data, error } = await resend.emails.send({
      from: "Nestro <onboarding@resend.dev>",
      to: [toemail],
      subject: "Nestro - Verify Your Email",

      html: `
        <div style="
          max-width:600px;
          margin:auto;
          font-family:Arial,sans-serif;
          padding:20px;
          border:1px solid #e5e5e5;
          border-radius:10px;
        ">

          <h2 style="color:#8B5E3C;text-align:center;">
            Welcome to Nestro
          </h2>

          <p>Hello,</p>

          <p>
            Your One Time Password (OTP) for verifying your account is:
          </p>

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

          <p>
            This OTP is valid for <strong>10 minutes</strong>.
          </p>

          <p>
            If you didn't request this verification, please ignore this email.
          </p>

          <hr>

          <p style="
            text-align:center;
            color:#777;
            font-size:12px;
          ">
            © ${new Date().getFullYear()} Nestro. All Rights Reserved.
          </p>

        </div>
      `,
    });

    if (error) {
      console.error("Resend Error:", error);
      return false;
    }

    console.log("OTP email sent successfully:", data);

    return "otp Email Sent Successfully";

  } catch (error) {
    console.error("Email Error:", error);
    return false;
  }
}