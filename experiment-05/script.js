const productJson = document.getElementById("productJson");
const stats = document.getElementById("stats");

let product = {
  name: "Premium Headphones",
  category: "Electronics",
  variants: [
    { sku: "HP-BL-001", color: "Black", price: 199.99, stock: 15 },
    { sku: "HP-WH-001", color: "White", price: 209.99, stock: 8 }
  ],
  reviews: [
    { userId: "65f4a8b7c1e6a8c1f4b8c7d1", rating: 5, comment: "Excellent sound quality" }
  ],
  avgRating: 5
};

function aggregate(productDoc) {
  const totalStock = productDoc.variants.reduce((sum, item) => sum + item.stock, 0);
  const totalValue = productDoc.variants.reduce((sum, item) => sum + item.price * item.stock, 0);
  const avgRating = productDoc.reviews.reduce((sum, item) => sum + item.rating, 0) / productDoc.reviews.length;
  productDoc.avgRating = Number(avgRating.toFixed(1));
  return { totalStock, totalValue: totalValue.toFixed(2), avgRating: productDoc.avgRating };
}

function render() {
  const result = aggregate(product);
  productJson.textContent = JSON.stringify(product, null, 2);
  stats.innerHTML = `
    <div class="stat"><strong>${result.totalStock}</strong>Total stock across variants</div>
    <div class="stat"><strong>$${result.totalValue}</strong>Inventory value</div>
    <div class="stat"><strong>${result.avgRating}</strong>Average rating</div>
  `;
}

document.getElementById("seedBtn").addEventListener("click", () => render());
document.getElementById("sellBtn").addEventListener("click", () => {
  const variant = product.variants.find((item) => item.sku === "HP-BL-001");
  if (variant.stock > 0) variant.stock -= 1;
  render();
});
document.getElementById("reviewBtn").addEventListener("click", () => {
  product.reviews.push({ userId: crypto.randomUUID(), rating: 4, comment: "Comfortable and reliable" });
  render();
});

render();
