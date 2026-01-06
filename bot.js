// bot.js — stable local AISA bot (NO Firebase)
(function () {
  const ID_LAUNCHER = 'chatLauncher';
  const ID_BOX = 'chatBox';
  const ID_MSGS = 'chatMessages';
  const ID_INPUT = 'chatInput';
  const ID_SEND = 'chatSend';
  const ID_QUICK = 'chatQuickActions';
  const ID_ADMIN = 'chatAdminPanel';

  const $ = id => document.getElementById(id);
  const create = (tag, props = {}) => {
    const el = document.createElement(tag);
    Object.entries(props).forEach(([k, v]) => {
      if (k === 'html') el.innerHTML = v;
      else el[k] = v;
    });
    return el;
  };

  function ensureUI() {
    if (!$(ID_LAUNCHER)) {
      const btn = create('button', { id: ID_LAUNCHER, html: '💬' });
      Object.assign(btn.style, {
        position: 'fixed', bottom: '18px', right: '18px',
        width: '60px', height: '60px', borderRadius: '50%',
        border: 'none', cursor: 'pointer',
        background: 'linear-gradient(135deg,#06b6d4,#22d3ee)',
        fontSize: '1.4rem', zIndex: 99999
      });
      document.body.appendChild(btn);
    }

    if (!$(ID_BOX)) {
      const box = create('div', { id: ID_BOX });
      Object.assign(box.style, {
        position: 'fixed', bottom: '90px', right: '18px',
        width: '360px', maxWidth: '92vw',
        background: 'rgba(0,0,0,0.85)',
        color: '#fff', borderRadius: '12px',
        display: 'none', zIndex: 99999,
        padding: '10px'
      });

      box.innerHTML = `
        <div style="display:flex;justify-content:space-between">
          <strong>AISA Bot</strong>
          <button id="chatClose">✕</button>
        </div>
        <div id="${ID_MSGS}" style="height:220px;overflow:auto;margin:8px 0"></div>
        <div id="${ID_QUICK}" style="margin-bottom:6px"></div>
        <div style="display:flex;gap:6px">
          <input id="${ID_INPUT}" placeholder="Ask something..." style="flex:1">
          <button id="${ID_SEND}">Send</button>
        </div>
      `;
      document.body.appendChild(box);
    }
  }

  ensureUI();

  const launcher = $(ID_LAUNCHER);
  const box = $(ID_BOX);
  const msgs = $(ID_MSGS);
  const input = $(ID_INPUT);
  const send = $(ID_SEND);

  let QA = [
    { q: 'how do i join aisa', a: 'Attend meetings or contact AISA faculty coordinator.' },
    { q: 'view syllabus', a: "Download syllabus: <a href='sy-syllabus.pdf' target='_blank'>Click here</a>" },
    { q: 'next workshop', a: 'Check Academics page for updates.' }
  ];

  function append(text, who = 'bot', html = false) {
    const d = document.createElement('div');
    d.style.margin = '6px 0';
    d.style.padding = '6px';
    d.style.borderRadius = '6px';
    d.style.background = who === 'bot' ? '#22d3ee' : '#333';
    if (html) d.innerHTML = text; else d.textContent = text;
    msgs.appendChild(d);
    msgs.scrollTop = msgs.scrollHeight;
  }

  function reply(text) {
    if (!text) return;
    append(text, 'user');
    input.value = '';
    setTimeout(() => {
      const t = text.toLowerCase();
      const found = QA.find(q => t.includes(q.q));
      append(found ? found.a : "Sorry, I don't know that yet.", 'bot', true);
    }, 300);
  }

  launcher.onclick = () => box.style.display = box.style.display === 'block' ? 'none' : 'block';
  document.getElementById('chatClose').onclick = () => box.style.display = 'none';
  send.onclick = () => reply(input.value);
  input.onkeydown = e => e.key === 'Enter' && reply(input.value);

  setTimeout(() => append("Hi! I'm AISA Bot 👋", 'bot'), 300);
})();
