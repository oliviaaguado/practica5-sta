// frontend/src/api.js
// Cliente para la función serverless saveMessage (Parte 1)

const FUNCTION_URL = "http://127.0.0.1:5001/p5-sta/us-central1/saveMessage";
// Cambia TU_PROJECT_ID por el projectId que te muestra el emulador

export async function sendMessage(text) {
  const res = await fetch(FUNCTION_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Error ${res.status}: ${errorText}`);
  }

  return res.json();
}
