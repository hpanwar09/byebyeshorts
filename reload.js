const WS_URL = "ws://localhost:8234";
let ws = null;

function connect() {
  ws = new WebSocket(WS_URL);

  ws.addEventListener("message", (event) => {
    if (event.data === "reload") {
      chrome.runtime.reload();
    }
  });

  ws.addEventListener("close", () => {
    ws = null;
    setTimeout(connect, 2000);
  });

  ws.addEventListener("error", () => {
    ws.close();
  });
}

connect();
