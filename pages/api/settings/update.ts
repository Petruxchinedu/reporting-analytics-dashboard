// pages/api/settings/update.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import { connectDB } from "@/lib/db";
import User from "@/models/User";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "PUT") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const session = await getSession({ req });
  if (!session?.user?.email) return res.status(401).json({ message: "Unauthorized" });

  await connectDB();

  const { darkMode, notifications } = req.body;

  const user = await User.findOneAndUpdate(
    { email: session.user.email },
    { settings: { darkMode, notifications } },
    { new: true }
  );

  if (!user) return res.status(404).json({ message: "User not found" });

  res.status(200).json({ settings: user.settings });
}
