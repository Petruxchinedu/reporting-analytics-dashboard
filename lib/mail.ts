import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
  // Adding these settings helps prevent login rejection on some networks
  tls: {
    rejectUnauthorized: false 
  }
});

// Immediately check connection on server start
transporter.verify((error, success) => {
  if (error) {
    console.log("❌ SMTP Setup Error:", error);
  } else {
    console.log("✅ SMTP Server is ready for Port 465!");
  }
});

export const sendVerificationEmail = async (email: string, token: string) => {
  const verificationUrl = `${process.env.NEXTAUTH_URL}/verify-email?token=${token}`;

  return await transporter.sendMail({
    from: `"Your App" <${process.env.SMTP_USER}>`,
    to: email,
    subject: "Verify your email address",
    html: `
      <div style="font-family: sans-serif; padding: 20px;">
        <h2>Verify your account</h2>
        <a href="${verificationUrl}" style="background: teal; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
          Confirm Email
        </a>
      </div>
    `,
  });
};