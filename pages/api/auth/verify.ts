import type { NextApiRequest, NextApiResponse } from "next";
import { connectDB } from "lib/db";
import User from "models/User";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") return res.status(405).end();

  await connectDB();
  const { token } = req.query;

  const user = await User.findOne({ verificationToken: token });

  if (!user) {
    return res.status(400).json({ message: "Invalid or expired token" });
  }

  user.isVerified = true;
  user.verificationToken = undefined; // Remove token once used
  await user.save();

  return res.status(200).json({ message: "Email verified successfully" });
}