export async function fetchReports() {
  const res = await fetch("/api/reports");
  if (!res.ok) throw new Error("Failed to fetch reports data");
  return res.json();
}
