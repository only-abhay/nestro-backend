import "dotenv/config";

export async function SendOtpMail(normalizedEmail, otp) {
  try {
    if (!process.env.BREVO_API_KEY) {
      console.error("BREVO_API_KEY is missing");
      return false;
    }
    if (!normalizedEmail || !otp) {
      console.error("Email or OTP is missing");
      return false;
    }

    console.log("Sending OTP to:", normalizedEmail);

    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "api-key": process.env.BREVO_API_KEY,
      },
      body: JSON.stringify({
        sender: {
          name: "Nestro",
          email: process.env.EMAIL_KEY, // must be the email you verified/added as a sender in Brevo
        },
        to: [{ email: normalizedEmail }],
        subject: "Nestro - Verify Your Email",
        htmlContent: `
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
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Brevo Error:", data);
      return false;
    }

    console.log("OTP email sent successfully:", data.messageId);
    return true;
  } catch (error) {
    console.error("Email Error:", {
      message: error.message,
    });
    return false;
  }
}