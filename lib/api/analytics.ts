export async function fetchAnalytics() {
  const res = await fetch("/api/analytics");
  if (!res.ok) throw new Error("Failed to fetch analytics data");
  return res.json();
}
