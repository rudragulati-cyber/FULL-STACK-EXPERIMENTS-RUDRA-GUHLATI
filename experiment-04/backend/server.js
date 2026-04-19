const express = require("express");
const mongoose = require("mongoose");
const Product = require("./product.model");

const app = express();
app.use(express.json());

app.post("/products", async (req, res) => {
  const product = await Product.create(req.body);
  res.status(201).json(product);
});

app.get("/products/analytics", async (req, res) => {
  const data = await Product.aggregate([
    { $unwind: "$variants" },
    { $group: {
      _id: "$category",
      totalStock: { $sum: "$variants.stock" },
      averagePrice: { $avg: "$variants.price" },
      products: { $addToSet: "$name" }
    }}
  ]);
  res.json(data);
});

app.patch("/products/:id/stock", async (req, res) => {
  const product = await Product.findById(req.params.id);
  await product.updateStock(req.body.sku, req.body.quantity);
  res.json(product);
});

mongoose.connect(process.env.MONGO_URI).then(() => app.listen(process.env.PORT || 3000));
