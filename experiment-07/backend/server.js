const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();
app.use(cors());
app.use(express.json());

const productSchema = new mongoose.Schema({
  name: String,
  category: String,
  price: Number
});

const Product = mongoose.model("Product", productSchema);

app.get("/api/products", async (req, res) => {
  const products = await Product.find().sort({ name: 1 });
  res.json(products);
});

app.post("/api/products", async (req, res) => {
  const product = await Product.create(req.body);
  res.status(201).json(product);
});

mongoose.connect(process.env.MONGO_URI).then(() => app.listen(process.env.PORT || 5000));
