import type { NextApiRequest, NextApiResponse } from "next";
import { connectDB } from "lib/db";
import User from "models/User";
import bcrypt from "bcryptjs";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();

  await connectDB();
  const { token, password } = req.body;

  try {
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }, // Check if token is still valid
    });

    if (!user) {
      return res.status(400).json({ message: "Token is invalid or has expired." });
    }

    // Hash new password and clear reset fields
    user.password = await bcrypt.hash(password, 12);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    return res.status(200).json({ message: "Password updated successfully!" });
  } catch (error) {
    return res.status(500).json({ message: "Error resetting password." });
  }
}