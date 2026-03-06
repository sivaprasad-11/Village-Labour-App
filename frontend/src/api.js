const API = "http://13.126.222.51:3000";

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
