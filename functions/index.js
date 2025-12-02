// functions/index.js
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const { FieldValue } = require("firebase-admin/firestore"); 
const express = require("express");
const cors = require("cors");

admin.initializeApp();
const db = admin.firestore();

const app = express();
app.use(cors({ origin: true }));
app.use(express.json());

// Crear post
app.post("/createPost", async (req, res) => {
  try {
    const { title = "", body = "" } = req.body;
    const newDoc = db.collection("posts").doc();
    const data = {
      title,
      body,
      createdAt: FieldValue.serverTimestamp(),
      votes: 0,
      commentsCount: 0
    };
    await newDoc.set(data);
    const snap = await newDoc.get();
    res.status(201).json({ id: snap.id, ...snap.data() });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Listar posts con sort=new|votes
app.get("/posts", async (req, res) => {
  try {
    const sort = req.query.sort || "new";
    let q;
    if (sort === "votes") q = db.collection("posts").orderBy("votes", "desc");
    else q = db.collection("posts").orderBy("createdAt", "desc");
    const snap = await q.get();
    const posts = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    res.json(posts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Votar post { delta: 1 | -1 }
app.post("/posts/:postId/vote", async (req, res) => {
  try {
    const { delta } = req.body;
    const { postId } = req.params;
    const postRef = db.collection("posts").doc(postId);
    await postRef.update({ votes: FieldValue.increment(delta || 1) });
    const snap = await postRef.get();
    res.json({ id: snap.id, ...snap.data() });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Añadir comentario
app.post("/posts/:postId/comments", async (req, res) => {
  try {
    const { postId } = req.params;
    const { body = "" } = req.body;
    const postRef = db.collection("posts").doc(postId);
    const commentRef = postRef.collection("comments").doc();
    const commentData = {
      body,
      createdAt: FieldValue.serverTimestamp(),
      votes: 0
    };
    await commentRef.set(commentData);
    await postRef.update({ commentsCount: FieldValue.increment(1) });
    const snap = await commentRef.get();
    res.status(201).json({ id: snap.id, ...snap.data() });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Listar comentarios de un post
app.get("/posts/:postId/comments", async (req, res) => {
  try {
    const { postId } = req.params;
    const coll = db.collection("posts").doc(postId).collection("comments").orderBy("createdAt", "desc");
    const snap = await coll.get();
    const comments = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    res.json(comments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Votar comentario
app.post("/posts/:postId/comments/:commentId/vote", async (req, res) => {
  try {
    const { postId, commentId } = req.params;
    const { delta } = req.body;
    const commentRef = db.collection("posts").doc(postId).collection("comments").doc(commentId);
    await commentRef.update({ votes: FieldValue.increment(delta || 1) });
    const snap = await commentRef.get();
    res.json({ id: snap.id, ...snap.data() });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Exportar la app como función HTTPS
exports.api = functions.https.onRequest(app);
