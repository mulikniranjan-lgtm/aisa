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
    d.style.margin = "6px 0";
    d.style.padding = "6px";
    d.style.borderRadius = "6px";
    d.style.background = user ? "#1f2937" : "#22d3ee";
    d.style.color = user ? "#fff" : "#000";
    d.textContent = text;
    msgs.appendChild(d);
    msgs.scrollTop = msgs.scrollHeight;
  }

  async function askAI(text) {
    add(text, true);

    try {
      const res = await fetch("http://localhost:3001/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text })
      });
      const data = await res.json();
      add(data.reply);
    } catch {
      add("AI server not reachable.");
    }
  }

  launcher.onclick = () => box.style.display = box.style.display === "block" ? "none" : "block";
  box.querySelector("#closeBot").onclick = () => box.style.display = "none";
  box.querySelector("#send").onclick = () => askAI(input.value);
  input.onkeydown = e => e.key === "Enter" && askAI(input.value);

  setTimeout(() => add("Hi 👋 I’m AISA AI assistant."), 300);
})();
