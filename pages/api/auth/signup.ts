import type { NextApiRequest, NextApiResponse } from "next";
import { connectDB } from "lib/db";
import User from "models/User";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { sendVerificationEmail } from "lib/mail"; // Import the utility

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();

  await connectDB();
  const { name, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "Email already exists" });

    const hashedPassword = await bcrypt.hash(password, 12);
    const verificationToken = crypto.randomBytes(32).toString("hex");

    await User.create({
      name,
      email,
      password: hashedPassword,
      verificationToken,
      isVerified: false,
      role: "user",
    });

    // --- REAL EMAIL SENDING ---
    try {
      await sendVerificationEmail(email, verificationToken);
    } catch (mailError) {
      console.error("Mail Delivery Failed:", mailError);
      // We still created the user, but told them the email failed
      return res.status(201).json({ message: "User created, but failed to send verification email." });
    }

    return res.status(201).json({ message: "Verification email sent!" });
  } catch (error) {
    return res.status(500).json({ message: "Error during signup" });
  }
}