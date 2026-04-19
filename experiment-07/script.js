const products = document.getElementById("products");
const spinner = document.getElementById("spinner");
const alertBox = document.getElementById("alert");

const api = {
  getProducts() {
    return new Promise((resolve) => {
      setTimeout(() => resolve({
        data: [
          { id: 1, name: "Premium Headphones", category: "Electronics", price: 199.99 },
          { id: 2, name: "Smart Watch", category: "Wearables", price: 149.99 },
          { id: 3, name: "USB-C Dock", category: "Accessories", price: 89.99 }
        ]
      }), 800);
    });
  }
};

async function fetchProducts(shouldFail = false) {
  products.innerHTML = "";
  alertBox.innerHTML = "";
  spinner.classList.remove("d-none");
  try {
    if (shouldFail) throw new Error("Failed to fetch products from Express API.");
    const response = await api.getProducts();
    products.innerHTML = response.data.map((product) => `
      <div class="col-md-4">
        <article class="card product-card p-3">
          <h2 class="h5">${product.name}</h2>
          <p class="text-muted">${product.category}</p>
          <p class="price">$${product.price}</p>
        </article>
      </div>
    `).join("");
  } catch (error) {
    alertBox.innerHTML = `<div class="alert alert-danger">${error.message}</div>`;
  } finally {
    spinner.classList.add("d-none");
  }
}

document.getElementById("loadBtn").addEventListener("click", () => fetchProducts(false));
document.getElementById("errorBtn").addEventListener("click", () => fetchProducts(true));
fetchProducts(false);
