// pages/api/test-db.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { connectDB } from "lib/db";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    await connectDB();
    res.status(200).json({ message: "MongoDB connected" });
  } catch (err) {
    res.status(500).json({ message: "MongoDB connection failed", error: err });
  }
}
