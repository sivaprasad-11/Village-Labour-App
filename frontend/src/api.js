// LOCAL docker: frontend container -> talk to backend running on Windows host
const API = "http://host.docker.internal:3000";

export async function getBatches() {
  const res = await fetch(`${API}/api/batches`);
  return res.json();
}

export async function bookBatch(data) {
  const res = await fetch(`${API}/api/book`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });

  let json = {};
  try { json = await res.json(); } catch {}

  if (!res.ok) return { error: json.error || "Booking failed" };
  return json;
}