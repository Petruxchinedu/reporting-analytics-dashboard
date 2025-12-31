// pages/api/reports.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";
import { connectDB } from "lib/db";
import Report from "../../models/Report";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);

  if (!session) return res.status(401).json({ message: "Unauthorized" });

  await connectDB();
  const userId = session.user.id;

  if (req.method === "GET") {
    const reports = await Report.find({ userId }).sort({ date: -1 }).lean();
    return res.status(200).json(reports);
  }

  if (req.method === "POST") {
    const { name, date } = req.body;
    const newReport = await Report.create({
      userId,
      name,
      date: new Date(date),
      status: "Pending",
    });
    return res.status(201).json(newReport);
  }

  res.status(405).json({ message: "Method Not Allowed" });
}
