// frontend/src/App.jsx
import { useState } from "react";
import { sendMessage } from "./api";
import "./App.css";

function App() {
  const [text, setText] = useState("");
  const [response, setResponse] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    setErrorMsg("");
    setResponse("");
    setLoading(true);
    try {
      const data = await sendMessage(text);
      setResponse(JSON.stringify(data, null, 2));
    } catch (err) {
      console.error(err);
      setErrorMsg(err.message || "Error llamando a la función");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "2rem", fontFamily: "system-ui" }}>
      <h1>Práctica 5 – Parte 1</h1>
      <p>
        Esta demo envía el texto a una función serverless (Firebase Cloud
        Functions) que lo guarda en memoria con la fecha y hora actual como
        clave.
      </p>

      <div style={{ marginTop: "1rem", marginBottom: "1rem" }}>
        <input
          type="text"
          value={text}
          placeholder="Escribe un mensaje"
          onChange={(e) => setText(e.target.value)}
          style={{ padding: "0.5rem", width: "60%", marginRight: "0.5rem" }}
        />
        <button
          onClick={handleSend}
          disabled={!text.trim() || loading}
          style={{ padding: "0.5rem 1rem" }}
        >
          {loading ? "Enviando..." : "Enviar"}
        </button>
      </div>

      {errorMsg && (
        <p style={{ color: "red" }}>
          <strong>Error:</strong> {errorMsg}
        </p>
      )}

      <h2>Respuesta de la función</h2>
      <pre
        style={{
          background: "#222",
          color: "#0f0",
          padding: "1rem",
          borderRadius: "8px",
          textAlign: "left",
          maxHeight: "250px",
          overflow: "auto",
        }}
      >
        {response}
      </pre>
    </div>
  );
}

export default App;
