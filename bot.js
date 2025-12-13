// bot.js — updated: ensures visible launcher + admin editor inside chat (local-only)
(function(){
  const ID_LAUNCHER = 'chatLauncher';
  const ID_BOX = 'chatBox';
  const ID_MSGS = 'chatMessages';
  const ID_INPUT = 'chatInput';
  const ID_SEND = 'chatSend';
  const ID_QUICK = 'chatQuickActions';
  const ID_ADMIN = 'chatAdminPanel';

  // helper
  const $ = id => document.getElementById(id);
  const create = (tag, props = {}) => {
    const el = document.createElement(tag);
    Object.entries(props).forEach(([k,v])=>{
      if(k === 'css') Object.assign(el.style, v);
      else if(k === 'html') el.innerHTML = v;
      else el[k] = v;
    });
    return el;
  };

  // create UI if not present
  function ensureUI(){
    if(!$(ID_LAUNCHER)){
      const launch = create('button', {
        id: ID_LAUNCHER,
        html: '💬'
      });
      Object.assign(launch.style, {
        position:'fixed', right:'18px', bottom:'18px', zIndex:99999,
        width:'62px', height:'62px', borderRadius:'50%', border:'none',
        background:'linear-gradient(135deg,#06b6d4,#22d3ee)', color:'#02121a',
        fontSize:'1.4rem', cursor:'pointer', boxShadow:'0 12px 30px rgba(6,182,212,0.18)'
      });
      document.body.appendChild(launch);
    }

    if(!$(ID_BOX)){
      const box = create('div', { id: ID_BOX });
      Object.assign(box.style, {
        position:'fixed', right:'18px', bottom:'92px', zIndex:99999,
        display:'none', width:'360px', maxWidth:'92vw', borderRadius:'12px',
        boxShadow:'0 18px 40px rgba(0,0,0,0.6)',background: 'rgba(0, 0, 0, 0.78)',
backdropFilter: 'blur(8px)',

        color:'#e6eef6', padding:'10px', border:'1px solid rgba(255,255,255,0.03)'
      });

      box.innerHTML = `
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px">
          <div style="font-weight:700">AISA Bot</div>
          <div style="display:flex;gap:6px;align-items:center">
            <button id="chatMin" title="minimize" style="background:transparent;border:none;color:inherit;cursor:pointer">━</button>
            <button id="chatClose" title="close" style="background:transparent;border:none;color:inherit;cursor:pointer">×</button>
          </div>
        </div>
        <div id="${ID_MSGS}" style="height:220px;overflow:auto;padding:8px;border-radius:8px;background:rgba(255,255,255,0.02);margin-bottom:8px"></div>
        <div id="${ID_QUICK}" style="display:flex;gap:6px;margin-bottom:8px;flex-wrap:wrap"></div>
        <div style="display:flex;gap:8px">
          <input id="${ID_INPUT}" placeholder="Ask about syllabus, events, joining AISA..." style="flex:1;padding:.5rem;border-radius:8px;border:1px solid rgba(255,255,255,0.04);background:transparent;color:inherit" />
          <button id="${ID_SEND}" style="padding:.45rem .6rem;border-radius:8px;border:none;background:linear-gradient(90deg,#06b6d4,#22d3ee);color:#02121a;font-weight:700;cursor:pointer">Send</button>
        </div>
        <div id="${ID_ADMIN}" style="margin-top:10px;padding:8px;border-radius:8px;background:rgba(255,255,255,0.01);border:1px dashed rgba(255,255,255,0.02)">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px">
            <div style="font-size:0.95rem;color:var(--muted)">Admin editor (local)</div>
            <button id="adminToggleSmall" style="background:transparent;border:none;color:inherit;cursor:pointer">hide</button>
          </div>
          <textarea id="qaEditor" style="width:100%;height:120px;padding:8px;border-radius:8px;background:transparent;border:1px solid rgba(255,255,255,0.04);color:inherit;resize:vertical">[
  {"q":"how do i join aisa","a":"To join AISA: attend a meeting or email aisa@dacoe.edu. We meet on Fridays."},
  {"q":"view syllabus","a":"Open syllabus: <a href='sy-syllabus.pdf.pdf' target='_blank' style='color:inherit;text-decoration:underline'>Download SY</a>"},
  {"q":"when is the next workshop","a":"Check the Events section on the homepage or Academics page for workshop details."}
]</textarea>
          <div style="display:flex;gap:8px;margin-top:8px">
            <button id="btnLoadQA" style="padding:8px;border-radius:8px;border:none;background:#06b6d4;color:#02121a;font-weight:700;cursor:pointer">Load</button>
            <button id="btnClear" style="padding:8px;border-radius:8px;border:none;background:rgba(255,255,255,0.03);color:inherit;cursor:pointer">Clear Chat</button>
            <button id="btnReset" style="padding:8px;border-radius:8px;border:none;background:crimson;color:white;cursor:pointer">Reset</button>
          </div>
        </div>
      `;
      document.body.appendChild(box);
    }
  }

  ensureUI();

  // refs
  const launcher = $(ID_LAUNCHER);
  const box = $(ID_BOX);
  const msgs = $(ID_MSGS);
  const input = $(ID_INPUT);
  const send = $(ID_SEND);
  const quick = $(ID_QUICK);
  const adminPanel = $(ID_ADMIN);
  const editor = document.getElementById('qaEditor');

  // append message helper
  function appendMessage(text, who='bot', allowHtml=false){
    if(!msgs) return;
    const d = document.createElement('div');
    d.className = 'chat-message ' + (who==='user' ? 'user' : 'bot');
    Object.assign(d.style, {maxWidth:'86%',padding:'8px 10px',margin:'6px 0',borderRadius:'10px',wordBreak:'break-word'});
    if(who==='user'){ d.style.background='rgba(255,255,255,0.03)'; d.style.marginLeft='auto'; d.textContent = text; }
    else {
      d.style.background='rgba(34, 211, 238, 0.22)';
      d.style.color = '#02121a';
      if(allowHtml) d.innerHTML = text;
      else d.textContent = text;
    }
    msgs.appendChild(d);
    msgs.scrollTop = msgs.scrollHeight;
  }

  // typing indicator
  function setTyping(on){
    const id = '__typing';
    const existing = document.getElementById(id);
    if(on && !existing){
      const t = document.createElement('div'); t.id = id; t.textContent = 'Thinking…'; t.style.padding='8px'; t.style.margin='6px 0'; t.style.borderRadius='8px';
      msgs.appendChild(t); msgs.scrollTop = msgs.scrollHeight;
    } else if(!on && existing) existing.remove();
  }

  // default QA array (will be replaced when admin loads)
 let QA = []; // will load from Firestore

  // simple matcher
  function normalize(s){ return String(s||'').toLowerCase().trim(); }
  function findAnswer(text){
    const t = normalize(text);
    if(['help','info','information'].some(k=>t.includes(k))) return "I can help with: 'how do i join aisa', 'view syllabus', 'next workshop' or open the Academics page.";
    if(['thanks','thank you','thx'].some(k=>t.includes(k))) return "You're welcome!";

    let best=null, bestScore=-1;
    for(const item of QA){
      const qn = normalize(item.q);
      if(qn === t){ best = item; bestScore = 100; break; }
      const qWords = t.split(/\s+/).filter(Boolean), tWords = qn.split(/\s+/).filter(Boolean);
      let matches = 0; qWords.forEach(w=>{ if(tWords.includes(w)) matches++; });
      let score = Math.round((matches / Math.max(qWords.length,1)) * 100);
      if(t.startsWith(qn) || qn.startsWith(t)) score += 8;
      if(score > bestScore){ bestScore = score; best = item; }
    }
    if(best && bestScore >= 35) return best.a;
    if(t.match(/^(hi|hello|hey)\b/)) return "Hi — ask about events, joining AISA, or the syllabus.";
    if(t.match(/(where|location|lab|room)/)) return "Most events and workshops are in Lab 204 (Computer Dept building).";
    if(t.match(/(events|workshop|workshops)/)) return "Events are posted on the homepage and Academics page.";
    return "I don't have that info yet. Try: 'view syllabus', 'how do i join aisa', or 'next workshop'.";
  }

  function botReply(text){
    if(!text) return;
    appendMessage(text, 'user');
    input.value = '';
    setTyping(true);
    setTimeout(()=>{
      setTyping(false);
      const reply = findAnswer(text);
      // allow HTML if answer contains link tags
      const allowHtml = /<a /i.test(reply);
      appendMessage(reply, 'bot', allowHtml);
    }, 420);
  }

  // quick actions
  function renderQuick(){
    if(!quick) return;
    quick.innerHTML = '';
    const actions = [
      {label:'View Syllabus', run: ()=> window.open('sy-syllabus.pdf.pdf','_blank')},
      {label:'Open Academics', run: ()=> location.href = 'academics.html'},
      {label:'How to join', run: ()=> botReply('how do i join aisa')},
      {label:'Next workshop', run: ()=> botReply('when is the next workshop')}
    ];
    actions.forEach(a=>{
      const b = create('button',{html:a.label});
      Object.assign(b.style,{padding:'.3rem .6rem',borderRadius:'999px',border:'none',background:'rgba(255,255,255,0.03)',color:'inherit',cursor:'pointer'});
      b.addEventListener('click', a.run);
      quick.appendChild(b);
    });
  }

  // wire events
  launcher && launcher.addEventListener('click', ()=> box.style.display = (box.style.display==='block' ? 'none' : 'block'));
  const minBtn = document.getElementById('chatMin'); minBtn && minBtn.addEventListener('click', ()=> box.style.display='none');
  const closeBtn = document.getElementById('chatClose'); closeBtn && closeBtn.addEventListener('click', ()=> box.style.display='none');
  send && send.addEventListener('click', ()=> botReply(input.value.trim()));
  input && input.addEventListener('keydown', (e)=>{ if(e.key === 'Enter' && !e.shiftKey){ e.preventDefault(); send.click(); } });

  // admin controls
  document.getElementById('adminToggleSmall')?.addEventListener('click', ()=>{
    const ap = adminPanel;
    if(!ap) return;
    ap.style.display = ap.style.display === 'none' ? 'block' : 'none';
    document.getElementById('adminToggleSmall').textContent = ap.style.display === 'none' ? 'show' : 'hide';
  });

  document.getElementById('btnLoadQA')?.addEventListener('click', ()=>{
    try{
      const parsed = JSON.parse(editor.value);
      if(!Array.isArray(parsed)) throw new Error('JSON must be an array of {q,a}');
      QA = parsed.map(it=>({ q: String(it.q||'').toLowerCase().trim(), a: String(it.a||'') }));
      appendMessage('Q&A loaded (local only).', 'bot');
      renderQuick();
    }catch(err){
      appendMessage('Error loading Q&A: ' + err.message, 'bot');
    }
  });

  document.getElementById('btnClear')?.addEventListener('click', ()=> { msgs.innerHTML=''; appendMessage('Chat cleared.', 'bot'); });
  document.getElementById('btnReset')?.addEventListener('click', ()=>{
    QA = [
      {q:'how do i join aisa', a:'To join AISA: attend a meeting or email aisa@dacoe.edu. We meet on Fridays.'},
      {q:'view syllabus', a:"Open syllabus: <a href='sy-syllabus.pdf.pdf' target='_blank' style='color:inherit;text-decoration:underline'>Download SY</a>"},
      {q:'when is the next workshop', a:'Check the Events section on homepage or the Academics page.'}
    ];
    editor.value = JSON.stringify(QA, null, 2);
    appendMessage('Reset Q&A to defaults.', 'bot');
    renderQuick();
  });
  async function loadFAQFromFirestore() {
  try {
    const docRef = firebase.firestore().doc("config/faq");
    const snap = await docRef.get();

    if (snap.exists) {
      QA = snap.data().list || [];
      console.log("Loaded FAQ:", QA);
      appendMessage("FAQ updated from server ✔️", "bot");
    } else {
      console.warn("FAQ document not found");
    }
  } catch (err) {
    console.error("Error loading FAQ:", err);
  }
}


  // initial greeting + render quick
  setTimeout(()=> {
    appendMessage("Hi — I'm the local AISA Bot. Click buttons or ask questions like 'view syllabus' or 'how do i join aisa'.", 'bot');
    renderQuick();
    loadFAQFromFirestore();
  }, 220);

  // expose to console
  window.AISA_LOCAL_BOT = { QA, setQA: (arr)=>{ QA = arr; editor.value = JSON.stringify(QA, null, 2); } };
})();
