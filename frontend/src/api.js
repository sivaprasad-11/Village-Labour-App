const API = "http://localhost:3000";

export async function getBatches() {

  const res = await fetch(`${API}/api/batches`);

  return res.json();

}

export async function bookBatch(data) {

  const res = await fetch(`${API}/api/book`, {

    method: "POST",

    headers: {
      "Content-Type": "application/json"
    },

    body: JSON.stringify(data)

  });

  return res.json();

}