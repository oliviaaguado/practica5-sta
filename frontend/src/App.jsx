import PostForm from "./components/PostForm";
import PostList from "./components/PostList";
import { useState } from "react";

function App() {
  const [refresh, setRefresh] = useState(false);
  const triggerRefresh = () => setRefresh(!refresh);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Mini Foro</h1>
      <PostForm onPostCreated={triggerRefresh} />
      <PostList key={refresh} />
    </div>
  );
}

export default App;
