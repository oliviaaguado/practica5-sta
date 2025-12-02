import { useState } from "react";
import { createPost } from "../api";

export default function PostForm({ onPostCreated }) {
  const [content, setContent] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return; // evita posts vacíos
    await createPost({ title: content, body: "" }); 
    onPostCreated();           // refresca la lista de posts
    setContent("");            // limpia el textarea
  };

  return (
    <form onSubmit={handleSubmit}>
      <textarea
        style={{ width: "100%", minHeight: "80px" }}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Escribe tu post..."
      />
      <button type="submit">Crear Post</button>
    </form>
  );
}
