// pages/api/dashboard/metrics.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import { connectDB } from "@/lib/db";
import UserSettings from "@/models/UserSettings";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) return res.status(401).json({ message: "Unauthorized" });

  await connectDB();
  const userId = session.user.id;

  // Example: Fetch metrics based on user settings
  const settings = await UserSettings.findOne({ userId }).lean();
  const metric = settings?.filters?.metric || "revenue";

  // Mocked analytics data for now (can connect real DB later)
  const data = {
    labels: ["Jan", "Feb", "Mar", "Apr"],
    data: [100, 200, 150, 250],
    metric,
  };

  res.status(200).json(data);
}
