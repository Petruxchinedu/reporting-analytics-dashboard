import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import Report from "../../../models/Report";
import { connectDB } from "../../../lib/db";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) return res.status(401).json({ message: "Unauthorized" });

  await connectDB();
  const { id } = req.query;
  const userId = session.user.id;

  // Verify ownership
  const report = await Report.findOne({ _id: id, userId });
  if (!report) return res.status(404).json({ message: "Report not found" });

  if (req.method === "PATCH") {
    const { name, status } = req.body;
    
    // Update only the fields provided
    const updatedReport = await Report.findByIdAndUpdate(
      id,
      { $set: { ...(name && { name }), ...(status && { status }) } },
      { new: true } // Returns the document AFTER the update
    );
    
    return res.status(200).json(updatedReport);
  }

  if (req.method === "DELETE") {
    await Report.findByIdAndDelete(id);
    return res.status(200).json({ message: "Deleted" });
  }

  res.status(405).end();
}