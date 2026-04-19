const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");

const app = express();
app.use(express.json());

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  passwordHash: String,
  bio: String
});

const commentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  body: String
}, { timestamps: true });

const postSchema = new mongoose.Schema({
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  title: String,
  body: String,
  comments: [commentSchema]
}, { timestamps: true });

const User = mongoose.model("User", userSchema);
const Post = mongoose.model("Post", postSchema);

function auth(req, res, next) {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ message: "Unauthorized" });
  }
}

app.post("/auth/signup", async (req, res) => {
  const passwordHash = await bcrypt.hash(req.body.password, 10);
  const user = await User.create({ ...req.body, passwordHash });
  res.status(201).json({ id: user._id, name: user.name });
});

app.post("/auth/login", async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  const valid = user && await bcrypt.compare(req.body.password, user.passwordHash);
  if (!valid) return res.status(401).json({ message: "Invalid credentials" });
  res.json({ token: jwt.sign({ id: user._id, name: user.name }, process.env.JWT_SECRET) });
});

app.post("/posts", auth, async (req, res) => {
  const post = await Post.create({ author: req.user.id, title: req.body.title, body: req.body.body });
  res.status(201).json(post);
});

app.get("/posts", async (req, res) => {
  const posts = await Post.find().populate("author", "name bio").populate("comments.user", "name");
  res.json(posts);
});

app.post("/posts/:id/comments", auth, async (req, res) => {
  const post = await Post.findById(req.params.id);
  post.comments.push({ user: req.user.id, body: req.body.body });
  await post.save();
  res.json(post);
});

mongoose.connect(process.env.MONGO_URI).then(() => app.listen(process.env.PORT || 5000));
