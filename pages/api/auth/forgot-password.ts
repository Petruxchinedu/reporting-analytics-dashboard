import type { NextApiRequest, NextApiResponse } from "next";
import { connectDB } from "lib/db";
import User from "models/User";
import crypto from "crypto";
import { sendResetPasswordEmail } from "lib/mail";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();

  await connectDB();
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      // For security, don't tell the user if the email doesn't exist
      return res.status(200).json({ message: "If an account exists, a reset link has been sent." });
    }

    // Generate token valid for 1 hour
    const resetToken = crypto.randomBytes(32).toString("hex");
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = new Date(Date.now() + 3600000); 
    await user.save();

    await sendResetPasswordEmail(email, resetToken);

    return res.status(200).json({ message: "Reset email sent!" });
  } catch (error) {
    return res.status(500).json({ message: "Error sending reset email" });
  }
}