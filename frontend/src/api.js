const API_URL = "http://127.0.0.1:5001/p5-sta/us-central1/api"; 
// Sustituye <TU_PROJECT_ID> por el ID real de Firebase

export async function createPost({ title, body }) {
  const res = await fetch(`${API_URL}/createPost`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, body })
  });
  return res.json();
}

export async function getPosts() {
  const res = await fetch(`${API_URL}/posts`);
  return res.json();
}

export async function votePost(postId, delta) {
  const res = await fetch(`${API_URL}/posts/${postId}/vote`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ delta })
  });
  return res.json();
}
