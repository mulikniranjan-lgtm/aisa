(function () {
  // ===== Launcher =====
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

  // ===== Chat Box =====
 Object.assign(box.style, {
  position: "fixed",
  bottom: "90px",
  right: "18px",

  width: "420px",        // ⬅ increased width
  maxWidth: "95vw",      // responsive on small screens
  height: "520px",       // ⬅ added height

  background: "#0b1220",
  color: "#ffffff",
  borderRadius: "14px",
  display: "none",
  padding: "14px",

  boxShadow: "0 20px 60px rgba(0,0,0,0.6)",
  zIndex: 100000
});


  box.innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:center">
      <strong>AISA Bot</strong>
      <button id="closeBot" style="background:none;border:none;color:white;font-size:1.2rem;cursor:pointer">✕</button>
    </div>

    <div id="msgs" style="height:220px;overflow:auto;margin:8px 0;padding-right:4px"></div>

    <div style="display:flex;gap:6px">
      <input
        id="input"
        type="text"
        placeholder="Ask about AISA..."
        style="
          flex:1;
          padding:8px;
          border-radius:6px;
          border:1px solid rgba(255,255,255,0.2);
          background:#000000;
          color:#ffffff;
          outline:none;
        "
      />
      <button
        id="send"
        style="
          padding:8px 12px;
          border-radius:6px;
          border:none;
          background:#22d3ee;
          color:#02121a;
          cursor:pointer;
          font-weight:600;
        "
      >
        Send
      </button>
    </div>
  `;
  document.body.appendChild(box);

  const msgs = box.querySelector("#msgs");
  const input = box.querySelector("#input");
  const sendBtn = box.querySelector("#send");
  const closeBtn = box.querySelector("#closeBot");

  // ===== Add Message =====
  function add(text, user = false) {
    const d = document.createElement("div");

    d.style.display = "block";
    d.style.margin = "10px 0";
    d.style.padding = "10px 12px";
    d.style.borderRadius = "12px";
    d.style.maxWidth = "80%";
    d.style.wordBreak = "break-word";
    d.style.fontSize = "0.95rem";
    d.style.lineHeight = "1.4";

    if (user) {
      d.style.marginLeft = "auto";
      d.style.background = "#2563eb"; // blue
      d.style.color = "#ffffff";      // WHITE text ✅
    } else {
      d.style.marginRight = "auto";
      d.style.background = "#22d3ee"; // cyan
      d.style.color = "#02121a";      // dark text
    }

    d.textContent = text;
    msgs.appendChild(d);
    msgs.scrollTop = msgs.scrollHeight;
  }

  // ===== Send Message (FIXED LOGIC) =====
  async function sendMessage() {
    const text = input.value.trim();

    if (!text) return;

    // show user message
    add(text, true);

    // clear input AFTER showing
    input.value = "";
    input.focus();

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

  // ===== Events =====
  launcher.onclick = () => {
    box.style.display = box.style.display === "block" ? "none" : "block";
    setTimeout(() => input.focus(), 100);
  };

  closeBtn.onclick = () => box.style.display = "none";
  sendBtn.onclick = sendMessage;

  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      sendMessage();
    }
  });

  // ===== Greeting =====
  setTimeout(() => {
    add("Hi 👋 I’m AISA AI assistant. How can I help you?", false);
  }, 300);
})();

