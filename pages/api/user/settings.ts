// pages/api/user/settings.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import { connectDB } from "../../../lib/db";
import UserSettings from "../../../models/UserSettings";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);

  // 1. Better Security: Check for the actual user ID
  if (!session?.user?.id) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  await connectDB();
  const userId = session.user.id;

  // GET: Load or Initialize settings
  if (req.method === "GET") {
    // findOneAndUpdate with upsert: true and new: true is a great way 
    // to "get or create" in a single database hit.
    const settings = await UserSettings.findOneAndUpdate(
      { userId },
      { $setOnInsert: { userId } }, // Only set userId if creating new
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    return res.status(200).json(settings);
  }

  // PUT: Update settings (Idempotent)
  if (req.method === "PUT" || req.method === "POST") { 
    const updated = await UserSettings.findOneAndUpdate(
      { userId },
      { $set: req.body },
      { new: true, upsert: true }
    );
    return res.status(200).json(updated);
  }

  res.setHeader("Allow", ["GET", "PUT", "POST"]);
  res.status(405).json({ message: `Method ${req.method} Not Allowed` });
}