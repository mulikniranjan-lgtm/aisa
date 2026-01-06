(function () {
  const launcher = document.createElement("button");
  launcher.textContent = "💬";
  Object.assign(launcher.style, {
    position: "fixed",
    bottom: "18px",
    right: "18px",
    width: "60px",
    height: "60px",
    borderRadius: "50%",
    border: "none",
    fontSize: "1.4rem",
    cursor: "pointer",
    background: "linear-gradient(135deg,#06b6d4,#22d3ee)",
    zIndex: 9999
  });
  document.body.appendChild(launcher);

  const box = document.createElement("div");
  Object.assign(box.style, {
    position: "fixed",
    bottom: "90px",
    right: "18px",
    width: "360px",
    background: "#0b1220",
    color: "#fff",
    borderRadius: "12px",
    display: "none",
    padding: "10px",
    zIndex: 9999
  });

  box.innerHTML = `
    <div style="display:flex;justify-content:space-between">
      <strong>AISA Bot</strong>
      <button id="closeBot">✕</button>
    </div>
    <div id="msgs" style="height:220px;overflow:auto;margin:8px 0"></div>
    <div style="display:flex;gap:6px">
      <input id="input" placeholder="Ask about AISA..." style="flex:1">
      <button id="send">Send</button>
    </div>
  `;
  document.body.appendChild(box);

  const msgs = box.querySelector("#msgs");
  const input = box.querySelector("#input");
function add(text, user = false) {
  const d = document.createElement("div");

  // COMMON STYLES
  d.style.display = "block";
  d.style.margin = "10px 0";
  d.style.padding = "10px 12px";
  d.style.borderRadius = "12px";
  d.style.maxWidth = "80%";
  d.style.wordWrap = "break-word";
  d.style.fontSize = "0.95rem";
  d.style.lineHeight = "1.4";

  if (user) {
    // USER MESSAGE (RIGHT SIDE)
    d.style.marginLeft = "auto";
    d.style.background = "#2563eb";   // strong blue
    d.style.color = "#ffffff";        // white text
    d.style.textAlign = "left";
  } else {
    // BOT MESSAGE (LEFT SIDE)
    d.style.marginRight = "auto";
    d.style.background = "#22d3ee";   // cyan
    d.style.color = "#02121a";        // dark readable
  }

  d.textContent = text;
  msgs.appendChild(d);
  msgs.scrollTop = msgs.scrollHeight;
}


async function sendMessage() {
  const text = input.value.trim(); // ✅ capture first

  if (!text) {
    add("⚠️ Please type a message.", false);
    return;
  }

  // ✅ show user message FIRST
  add(text, true);

  // ✅ clear input AFTER displaying
  input.value = "";

  try {
    const res = await fetch("https://aisa-4.onrender.com/ask", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: text })
    });

    const data = await res.json();
    add(data.reply || "No reply from AI.", false);

  } catch (err) {
    add("❌ AI server not reachable.", false);
  }
}


  launcher.onclick = () => box.style.display = box.style.display === "block" ? "none" : "block";
  box.querySelector("#closeBot").onclick = () => box.style.display = "none";
  box.querySelector("#send").onclick = () => askAI(input.value);
  input.onkeydown = e => e.key === "Enter" && askAI(input.value);

  setTimeout(() => add("Hi 👋 I’m AISA AI assistant."), 300);
})();




