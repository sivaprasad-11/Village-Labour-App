const API = "http://farmhelper.in:3000";

export async function getBatches() {
  const res = await fetch(`${API}/api/batches`);
  return res.json();
}

export async function getBookings(batchId, date) {
  const params = new URLSearchParams();

  if (batchId) params.append("batchId", batchId);
  if (date) params.append("date", date);

  const res = await fetch(`${API}/api/bookings?${params.toString()}`);
  return res.json();
}

export async function bookBatch(data) {
  const res = await fetch(`${API}/api/book`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });

  let json = {};
  try {
    json = await res.json();
  } catch (e) {
    json = {};
  }

  if (!res.ok) {
    return { error: json.error || "Booking failed" };
  }

  return json;
}
