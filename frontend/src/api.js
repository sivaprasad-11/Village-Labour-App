// Same domain API (works locally + on AWS behind reverse proxy)
const API = "";

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
  return res.json();
}