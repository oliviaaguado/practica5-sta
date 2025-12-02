// src/components/PostList.jsx
import { useEffect, useState } from "react";
import { getPosts, votePost } from "../api";

export default function PostList() {
  const [posts, setPosts] = useState([]);

  const fetchPosts = async () => {
    try {
      const data = await getPosts();
      setPosts(data);
    } catch (err) {
      console.error("Error al obtener posts:", err);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleVote = async (postId, delta) => {
    try {
      await votePost(postId, delta);
      fetchPosts();
    } catch (err) {
      console.error("Error al votar post:", err);
    }
  };

  return (
    <div>
      {posts.length === 0 && <p>No hay posts todavía</p>}
      {posts.map((post) => (
        <div
          key={post.id}
          style={{
            border: "1px solid #ccc",
            margin: "10px 0",
            padding: "10px",
            borderRadius: "5px"
          }}
        >
          <h3>{post.title}</h3>
          <p>{post.body}</p>
          <p>Votos: {post.votes}</p>
          <button onClick={() => handleVote(post.id, +1)}>👍</button>
          <button onClick={() => handleVote(post.id, -1)}>👎</button>
        </div>
      ))}
    </div>
  );
}
