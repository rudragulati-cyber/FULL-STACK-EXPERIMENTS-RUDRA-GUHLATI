const express = require("express");
const app = express();

app.use(express.json());

function logger(req, res, next) {
  console.log(`${new Date().toISOString()} ${req.method} ${req.url}`);
  next();
}

function auth(req, res, next) {
  const token = req.headers.authorization?.replace("Bearer ", "");
  if (token !== "experiment-token") {
    return res.status(401).json({ message: "Unauthorized" });
  }
  next();
}

app.use(logger);

app.get("/public", (req, res) => {
  res.json({ message: "Public route accessed" });
});

app.get("/protected", auth, (req, res) => {
  res.json({ message: "Protected route accessed with valid token" });
});

app.get("/error", (req, res, next) => {
  next(new Error("Internal server issue"));
});

app.use((error, req, res, next) => {
  console.error(error.message);
  res.status(500).json({ message: "Internal server error" });
});

app.listen(process.env.PORT || 3000, () => console.log("Middleware API running"));
