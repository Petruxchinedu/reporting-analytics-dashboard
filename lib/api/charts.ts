export interface ChartApiResponse {
  metric: string;
  range: string;
  labels: string[];
  data: number[];
}

export async function fetchChartOverview(
  metric: string,
  range: string,
  region: string
): Promise<ChartApiResponse> {
  const res = await fetch(
    `/api/charts/overview?metric=${metric}&range=${range}&region=${region}`
  );

  if (!res.ok) {
    throw new Error("Failed to fetch chart data");
  }

  return res.json();
}
