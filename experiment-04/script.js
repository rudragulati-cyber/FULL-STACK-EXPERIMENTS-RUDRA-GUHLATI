const form = document.getElementById("loginForm");
const email = document.getElementById("email");
const password = document.getElementById("password");
const feedback = document.getElementById("feedback");
const submitBtn = document.getElementById("submitBtn");

function setFeedback(text, type) {
  feedback.textContent = text;
  feedback.className = `feedback ${type}`;
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const errors = [];
  if (!email.value.includes("@")) errors.push("Enter a valid email.");
  if (password.value.length < 6) errors.push("Password must be at least 6 characters.");
  if (errors.length) {
    setFeedback(errors.join(" "), "error");
    return;
  }
  submitBtn.textContent = "Checking...";
  submitBtn.disabled = true;
  setTimeout(() => {
    submitBtn.textContent = "Login";
    submitBtn.disabled = false;
    setFeedback("Login successful. User state saved.", "success");
  }, 900);
});
