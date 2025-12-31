import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import { connectDB } from "../../../lib/db";
import Report from "../../../models/Report";
import User from "../../../models/User"; // Imported User model

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  
  if (!session?.user?.email) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  await connectDB();

  // 1. Fetch user to determine role
  const dbUser = await User.findOne({ email: session.user.email });
  if (!dbUser) return res.status(404).json({ message: "User not found" });

  const userId = dbUser._id.toString();
  const isAdminOrStaff = ["admin", "staff"].includes(dbUser.role);

  // 2. Define the filter based on role
  // If Admin/Staff: Count everything {}. If User: Count only their { userId }
  const filter = isAdminOrStaff ? {} : { userId };

  // 3. Fetch stats using the dynamic filter
  const [total, pending, generated] = await Promise.all([
    Report.countDocuments(filter),
    Report.countDocuments({ ...filter, status: "Pending" }),
    Report.countDocuments({ ...filter, status: "Generated" }),
  ]);

  return res.status(200).json({
    stats: [
      {
        type: "reports",
        label: isAdminOrStaff ? "Total System Reports" : "My Reports",
        value: total,
        change: "+",
      },
      {
        type: "pending",
        label: "Pending Reports",
        value: pending,
        change: "Pending",
      },
      {
        type: "generated",
        label: "Generated Reports",
        value: generated,
        change: "Success",
      },
    ],
  });
}