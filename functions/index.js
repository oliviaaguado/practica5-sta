// functions/index.js
const functions = require("firebase-functions");

// Almacenamiento en memoria solo para la demo
let messages = {};

/**
 * Función HTTP serverless que:
 * - Recibe { text } por POST
 * - Genera una clave con fecha/hora
 * - Devuelve todas las entradas guardadas hasta el momento
 *
 * Ejemplo de respuesta:
 * {
 *   "ok": true,
 *   "saved": { "2025-11-25_21:15:30": "Hola" },
 *   "allMessages": {
 *     "2025-11-25_21:15:30": "Hola"
 *   }
 * }
 */
exports.saveMessage = functions.https.onRequest((req, res) => {
  // CORS para poder llamar desde el frontend en localhost
  res.set("Access-Control-Allow-Origin", "*");
  res.set("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.set("Access-Control-Allow-Headers", "Content-Type");

  // Preflight de CORS
  if (req.method === "OPTIONS") {
    return res.status(204).send("");
  }

  // Solo aceptamos POST
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  const { text } = req.body;
  if (!text) {
    return res.status(400).json({ error: "Falta el campo 'text'" });
  }

  const now = new Date();
  const key = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(
    2,
    "0"
  )}-${String(now.getDate()).padStart(2, "0")}_${String(
    now.getHours()
  ).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}:${String(
    now.getSeconds()
  ).padStart(2, "0")}`;

  messages[key] = text;

  return res.json({
    ok: true,
    saved: { [key]: text },
    allMessages: messages,
  });
});
