import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import { connectDB } from "../../../lib/db";
import Report from "../../../models/Report";
import User from "../../../models/User";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);

  if (!session?.user?.email) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  await connectDB();

  // 1. Fetch the user to get their role and _id
  const dbUser = await User.findOne({ email: session.user.email });
  
  if (!dbUser) {
    return res.status(404).json({ message: "User not found in database" });
  }

  const isAdminOrStaff = ["admin", "staff"].includes(dbUser.role || "");

  // --- GET METHOD ---
  if (req.method === "GET") {
    const filter = isAdminOrStaff ? {} : { userId: dbUser._id.toString() };
    const reports = await Report.find(filter).sort({ createdAt: -1 }).lean();
    return res.status(200).json(reports);
  }

  // --- POST METHOD ---
  if (req.method === "POST") {
    // 2. Critical Role Check
    if (!isAdminOrStaff) {
      return res.status(403).json({ 
        message: `Forbidden: Your role is '${dbUser.role}'. Only admin/staff can create.` 
      });
    }

    const { name } = req.body;
    if (!name) return res.status(400).json({ message: "Report name is required" });

    try {
      // 3. Create using the ID from the DATABASE user, not the session
      const newReport = await Report.create({
        userId: dbUser._id.toString(),
        name,
        status: "Pending",
        date: new Date(), // Required by your Report Schema
      });

      return res.status(201).json(newReport);
    } catch (error: any) {
      console.error("Creation Error:", error);
      return res.status(500).json({ message: error.message });
    }
  }

  res.setHeader("Allow", ["GET", "POST"]);
  return res.status(405).end();
}