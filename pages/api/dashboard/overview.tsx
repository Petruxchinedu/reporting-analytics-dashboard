import type { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { metric, region, range } = req.query;

  // Normally this would query MongoDB or a data warehouse
  const labels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];

  const dataMap: Record<string, number[]> = {
    revenue: [1200, 1900, 3000, 2500, 2200, 3200],
    users: [200, 400, 650, 800, 900, 1200],
    sessions: [800, 1100, 1500, 1700, 2100, 2600],
  };

  res.status(200).json({
    metric,
    region,
    range,
    labels,
    data: dataMap[metric as string] ?? [],
  });
}
