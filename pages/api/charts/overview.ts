import type { NextApiRequest, NextApiResponse } from "next";

type Metric = "users" | "revenue" | "sessions";
type Range = "weekly" | "monthly" | "yearly";
type Region = "global" | "africa" | "europe";

interface ChartResponse {
  metric: Metric;
  range: Range;
  labels: string[];
  data: number[];
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<ChartResponse | { error: string }>
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { metric, range, region } = req.query;

  if (!metric || !range || !region) {
    return res.status(400).json({ error: "Missing query parameters" });
  }

  // Mock data generator (replace with DB later)
  const labels =
    range === "monthly"
      ? ["Jan", "Feb", "Mar", "Apr"]
      : range === "weekly"
      ? ["Week 1", "Week 2", "Week 3"]
      : ["2022", "2023", "2024"];

  const data = labels.map(() => Math.floor(Math.random() * 3000) + 500);

  const response: ChartResponse = {
    metric: metric as Metric,
    range: range as Range,
    labels,
    data,
  };

  return res.status(200).json(response);
}
