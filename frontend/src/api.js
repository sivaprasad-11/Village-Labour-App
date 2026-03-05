// When frontend runs inside Docker, "localhost" points to the container itself.
// This hostname points to your Windows host machine where backend is exposed on 3000.
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
  return res.json();
}