const mongoose = require("mongoose");

const variantSchema = new mongoose.Schema({
  sku: { type: String, required: true, unique: true, index: true },
  color: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  stock: { type: Number, required: true, min: 0 }
});

const reviewSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
  rating: { type: Number, min: 1, max: 5, required: true },
  comment: { type: String, trim: true }
});

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  category: { type: String, required: true, index: true },
  variants: [variantSchema],
  reviews: [reviewSchema],
  avgRating: { type: Number, default: 0 }
}, { timestamps: true });

productSchema.index({ name: "text", category: 1 });

productSchema.methods.updateStock = function updateStock(sku, quantity) {
  const variant = this.variants.find((item) => item.sku === sku);
  if (!variant) throw new Error("Variant not found");
  if (variant.stock + quantity < 0) throw new Error("Insufficient stock");
  variant.stock += quantity;
  return this.save();
};

productSchema.methods.recalculateRating = function recalculateRating() {
  if (!this.reviews.length) this.avgRating = 0;
  else this.avgRating = this.reviews.reduce((sum, review) => sum + review.rating, 0) / this.reviews.length;
  return this.save();
};

module.exports = mongoose.model("Product", productSchema);
