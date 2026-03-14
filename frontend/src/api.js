const API = "";

export async function getBatches() {
  const res = await fetch(`${API}/api/batches`);
  return res.json();
}

export async function getBookings(batchId, date, leaderPin) {
  const params = new URLSearchParams();

  if (batchId) params.append("batchId", batchId);
  if (date) params.append("date", date);

  const res = await fetch(`${API}/api/bookings?${params.toString()}`, {
    headers: {
      "x-leader-pin": leaderPin || ""
    }
  });

  let json = {};
  try {
    json = await res.json();
  } catch (e) {
    json = {};
  }

  if (!res.ok) {
    return { error: json.error || "Failed to fetch bookings" };
  }

  return json;
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

export async function markPaymentPaid(pk, leaderPin) {
  const res = await fetch(`${API}/api/payment-paid`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-leader-pin": leaderPin || ""
    },
    body: JSON.stringify({ pk })
  });

  let json = {};
  try {
    json = await res.json();
  } catch (e) {
    json = {};
  }

  if (!res.ok) {
    return { error: json.error || "Failed to update payment status" };
  }

  return json;
}
