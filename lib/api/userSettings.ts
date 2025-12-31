export async function fetchUserSettings() {
  const res = await fetch("/api/user/settings");

  if (!res.ok) {
    throw new Error("Failed to load user settings");
  }

  return res.json();
}

export async function updateUserSettings(payload: any) {
  const res = await fetch("/api/user/settings", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error("Failed to update user settings");
  }

  return res.json();
}
