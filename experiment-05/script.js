const logs = document.getElementById("logs");
const token = document.getElementById("token");

function addLog(message, error = false) {
  const item = document.createElement("div");
  item.className = `log${error ? " error" : ""}`;
  item.textContent = `${new Date().toLocaleTimeString()} - ${message}`;
  logs.prepend(item);
}

function requestLogger(route) {
  addLog(`logger middleware: GET ${route}`);
}

function authMiddleware() {
  addLog("auth middleware: checking Authorization header");
  if (token.value.trim() !== "experiment-token") {
    addLog("401 Unauthorized: invalid or missing token", true);
    return false;
  }
  addLog("auth middleware: token accepted");
  return true;
}

document.getElementById("publicBtn").addEventListener("click", () => {
  requestLogger("/public");
  addLog("controller: public route response sent");
});

document.getElementById("protectedBtn").addEventListener("click", () => {
  requestLogger("/protected");
  if (!authMiddleware()) return;
  addLog("controller: protected data returned");
});

document.getElementById("errorBtn").addEventListener("click", () => {
  requestLogger("/error");
  addLog("error handler: internal server issue handled", true);
});
