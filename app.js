/*
  ==========================================================
  Campus Connect — Milestone 3 (Frontend Prototype Only)
  ----------------------------------------------------------
  This JavaScript file includes ONLY UI logic required for
  Milestone 3, with no backend or server communication.

  All features such as login, events, messaging, tutors,
  groups, notifications, and admin tools are implemented
  as static or simulated prototypes using:
    - localStorage
    - sample data arrays
    - DOM manipulation
    - alert() placeholders
    - NO real authentication
    - NO external API calls

  Author: Fidel Anyanwu, Pacifique Muramusta, Wilfred Robert Fajimi
  ==========================================================
*/

const $ = (s,ctx=document)=>ctx.querySelector(s);
const $$ = (s,ctx=document)=>Array.from(ctx.querySelectorAll(s));
$("#year") && ($("#year").textContent = new Date().getFullYear());

// Mobile nav
const navToggle = $("#navToggle");
const navLinks = $("#navLinks");
if (navToggle && navLinks){
  navToggle.addEventListener("click", ()=>{
    const open = navLinks.classList.toggle("open");
    navToggle.setAttribute("aria-expanded", String(open));
  });
}

// Simple sanitization (display layer)
function sanitize(s){ return String(s).replace(/[<>]/g, ch => ({'<':'&lt;','>':'&gt;'}[ch])); }

// Mock auth state
const AUTH_KEY = "cc_auth_user";
const setAuth = (obj) => localStorage.setItem(AUTH_KEY, JSON.stringify(obj));
const getAuth = () => JSON.parse(localStorage.getItem(AUTH_KEY) || "null");
function updateAuthLink(){
  const a = getAuth();
  const link = $("#authLink");
  if (!link) return;
  if (a){ link.textContent = "Logout"; link.href = "#"; link.onclick = (e)=>{ e.preventDefault(); localStorage.removeItem(AUTH_KEY); updateAuthLink(); alert("Logged out (prototype)."); }; }
  else { link.textContent = "Login"; link.href = "login.html"; link.onclick = null; }
}
updateAuthLink();

// Message badge (simulated)
function updateMsgBadge(n){
  const el = $("#msgBadge"); if (el) el.textContent = n;
}
updateMsgBadge(1);

// Home signup
(function(){
  const form = $("#homeSignup"); if (!form) return;
  form.addEventListener("submit", (e)=>{
    e.preventDefault();
    if (!form.checkValidity()) return alert("Complete all fields.");
    alert("Profile created (prototype).");
  });
})();

// Login
(function(){
  const form = $("#loginForm"); if (!form) return;
  form.addEventListener("submit", (e)=>{
    e.preventDefault();
    if (!form.checkValidity()) return alert("Check fields.");
    // "Password hashing" (frontend placeholder): show hashed preview (not real backend)
    const data = new FormData(form);
    const email = data.get("email");
    const pw = data.get("password");
    const fakeHash = btoa(pw).slice(0,16); // demo only
    setAuth({ email, hash: fakeHash, verified: false });
    updateAuthLink();
    alert("Logged in (prototype). For final, server-side hashing + sessions.");
    location.href = "discover.html";
  });
})();

// Register
(function(){
  const form = $("#registerForm"); if (!form) return;
  form.addEventListener("submit", (e)=>{
    e.preventDefault();
    if (!form.checkValidity()) return alert("Complete fields.");
    const data = new FormData(form);
    setAuth({ email: data.get("email"), hash: btoa(data.get("password")).slice(0,16), verified: false });
    updateAuthLink();
    alert("Account created (prototype). Next: server email verification.");
    location.href = "verify.html";
  });
})();

// Forgot / Verify
handleForm("#forgotForm","Reset link sent (prototype).");
handleForm("#verifyForm","Email verified (prototype).", ()=>{
  const a = getAuth(); if (a){ a.verified = true; setAuth(a); }
});

// Profile edit & preview
(function(){
  const form = $("#profileForm"); if (!form) return;
  const pv = $("#profilePreview");
  form.addEventListener("submit", (e)=>{
    e.preventDefault();
    if (!form.checkValidity()) return alert("Complete required fields.");
    const o = Object.fromEntries(new FormData(form).entries());
    const safe = Object.fromEntries(Object.entries(o).map(([k,v])=>[k,sanitize(v)]));
    localStorage.setItem("cc_profile", JSON.stringify(safe));
    render();
    alert("Saved (prototype).");
  });
  function render(){
    const p = JSON.parse(localStorage.getItem("cc_profile")||"{}");
    pv.innerHTML = `
      <h3>${sanitize(p.name||"Student User")}</h3>
      <p class="muted">${sanitize(p.major||"Major/Year")} • Minor: ${sanitize(p.minor||"—")}</p>
      <p>${sanitize(p.bio||"Bio...")}</p>
      <p><strong>Skills:</strong> ${sanitize(p.skills||"")}</p>
      <p><strong>Interests:</strong> ${sanitize(p.interests||"")}</p>
      <p><strong>Availability:</strong> ${sanitize(p.availability||"")}</p>
      <p><strong>Looking for:</strong> ${sanitize(p.looking||"")}</p>`;
  }
  render();
})();

// Tutors data + ratings
const TUTOR_OFFERS = [
  {id:"t1", name:"Ben Lee", subject:"Calculus I", rate:15, mode:"In-person", lang:"EN", rating:4.5, desc:"Library meetups M/W."},
  {id:"t2", name:"Sara Patel", subject:"Intro to Java", rate:18, mode:"Online", lang:"EN", rating:4.8, desc:"Zoom evenings; beginner friendly."},
  {id:"t3", name:"Luis Garcia", subject:"Chemistry 101", rate:12, mode:"In-person", lang:"ES", rating:4.2, desc:"Lab pods T/Th."},
  {id:"t4", name:"Mia Chen", subject:"Data Structures", rate:20, mode:"Online", lang:"EN", rating:4.9, desc:"Interview prep + DS/A."},
];

const REVIEWS_KEY = "cc_reviews"; // { t1: [{stars, text}], ... }
function getReviews(id){ const all = JSON.parse(localStorage.getItem(REVIEWS_KEY)||"{}"); return all[id]||[]; }
function addReview(id, stars, text){
  const all = JSON.parse(localStorage.getItem(REVIEWS_KEY)||"{}");
  all[id] = all[id] || [];
  all[id].push({stars, text: sanitize(text)});
  localStorage.setItem(REVIEWS_KEY, JSON.stringify(all));
}

// Tutors page render
(function(){
  const grid = $("#tutorGrid"); if (!grid) return;
  const matchGrid = $("#matchGrid");
  function stars(n){ return "★★★★★".split("").map((s,i)=>`<span class="star ${i<n? 'on':''}">★</span>`).join(""); }
  function tutorCard(t){
    const avg = getReviews(t.id).reduce((s,r)=>s+r.stars,0) / Math.max(1,getReviews(t.id).length);
    const avgDisp = (avg || t.rating || 0).toFixed(1);
    return `<article class="card">
      <h3>${sanitize(t.subject)} — ${sanitize(t.name)}</h3>
      <p class="muted">Rate: $${t.rate}/hr • ${t.mode} • ${t.lang}</p>
      <p>${sanitize(t.desc)}</p>
      <p>Avg Rating: ${avgDisp} ${stars(Math.round(avg || t.rating || 0))}</p>
      <div class="row">
        <button class="button outline" data-id="${t.id}" data-act="review">Review</button>
        <a class="button" href="messages.html">Message</a>
      </div>
    </article>`;
  }
  function render(arr){ grid.innerHTML = arr.map(tutorCard).join(""); }
  render(TUTOR_OFFERS);

  // Simple "recommended" block (same list for demo)
  if (matchGrid){ matchGrid.innerHTML = TUTOR_OFFERS.slice(0,2).map(tutorCard).join(""); }

  $("#applyTutors")?.addEventListener("click", ()=>{
    const subj = ($("#fSubject")?.value || "").toLowerCase();
    const mode = $("#fMode")?.value || "";
    const max = Number($("#fRate")?.value || 1e9);
    const lang = $("#fLang")?.value || "";
    const sort = $("#fSort")?.value || "rel";
    let res = TUTOR_OFFERS.filter(t =>
      t.subject.toLowerCase().includes(subj) &&
      (!mode || t.mode===mode) &&
      (!lang || t.lang===lang) &&
      t.rate <= max
    );
    if (sort==="new") res = res.reverse();
    if (sort==="rating") res = res.sort((a,b)=>(b.rating||0)-(a.rating||0));
    render(res);
  });

  grid.addEventListener("click", (e)=>{
    const btn = e.target.closest("button[data-act='review']");
    if (!btn) return;
    const id = btn.dataset.id;
    const stars = Number(prompt("Rate 1-5:","5")) || 5;
    const text = prompt("Optional review:","Great tutor!");
    addReview(id, Math.max(1,Math.min(5,stars)), text||"");
    alert("Review saved (prototype).");
  });
})();

// Requests page
const STUDENT_REQUESTS = [
  {id:"r1", name:"Ava Thompson", subject:"Python", level:"Intro", budget:15, times:"Tue/Thu 7-9", details:"Loops & lists help."},
  {id:"r2", name:"Noah Davis", subject:"Organic Chem", level:"Advanced", budget:20, times:"Weekends", details:"Reactions practice."},
  {id:"r3", name:"Liam Jones", subject:"Discrete Math", level:"Intermediate", budget:12, times:"M/W 6-8", details:"Proofs for exam."},
];
(function(){
  const grid = $("#requestGrid"); if (!grid) return;
  function card(r){ return `<article class="card">
    <h3>${sanitize(r.subject)} (${sanitize(r.level)}) — ${sanitize(r.name)}</h3>
    <p class="muted">Budget: $${r.budget} • Times: ${sanitize(r.times)}</p>
    <p>${sanitize(r.details)}</p>
    <a class="button" href="messages.html">Offer to Help</a>
  </article>`; }
  function render(arr){ grid.innerHTML = arr.map(card).join(""); }
  render(STUDENT_REQUESTS);
  $("#applyRequests")?.addEventListener("click", ()=>{
    const subj = ($("#rSubject")?.value || "").toLowerCase();
    const lvl = $("#rLevel")?.value || "";
    const max = Number($("#rBudget")?.value || 1e9);
    let res = STUDENT_REQUESTS.filter(r =>
      r.subject.toLowerCase().includes(subj) && (!lvl || r.level===lvl) && r.budget <= max
    );
    render(res);
  });
})();

// Search page (aggregate)
(function(){
  const grid = $("#searchResults"); if (!grid) return;
  function toCard(t){ return `<article class="card"><h3>${sanitize(t.subject)} — ${sanitize(t.name)}</h3><p class="muted">$${t.rate}/hr • ${t.mode} • ${t.lang}</p></article>`; }
  function render(list){ grid.innerHTML = list.map(toCard).join(""); }
  $("#applySearch")?.addEventListener("click", ()=>{
    const q = ($("#q")?.value || "").toLowerCase();
    const rating = Number($("#minRating")?.value || 0);
    const mode = $("#mode")?.value || "";
    const lang = $("#lang")?.value || "";
    let res = TUTOR_OFFERS.filter(t =>
      (t.name.toLowerCase().includes(q) || t.subject.toLowerCase().includes(q)) &&
      (t.rating || 0) >= rating && (!mode || t.mode.toLowerCase().includes(mode.toLowerCase())) &&
      (!lang || t.lang===lang)
    );
    render(res);
  });
})();

// Discover
(function(){
  const grid = $("#discoverGrid"); if (!grid) return;
  const items = [
    {title:"Recommended Tutor: Data Structures — Mia", body:"$20/hr • Online<br><a href='messages.html'>Message</a>"},
    {title:"Event: Career Talk — Tech Resumes", body:"Dec 2 @ Engineering Hall<br><a href='events.html'>Details</a>"},
    {title:"Group: Beginner Python Circle", body:"Members: 15<br><a href='groups.html'>Join</a>"},
  ];
  grid.innerHTML = items.map(i=>`<article class="card"><h3>${i.title}</h3><p class="muted">${i.body}</p></article>`).join("");
})();

// Events list
const EVENTS = [
  {id:"e1", title:"Hackathon Prep Night", date:"2025-11-18T18:00", campus:true, location:"CS Lab A", desc:"Bring laptop & ideas.", tags:["workshop","hack"], cap:30},
  {id:"e2", title:"Study Jam: Finals", date:"2025-11-25T17:00", campus:true, location:"Library 2F", desc:"Group study sessions.", tags:["study"], cap:50},
  {id:"e3", title:"Tech Resumes Talk", date:"2025-12-02T16:00", campus:true, location:"Engineering Hall", desc:"Resume tips & review.", tags:["career"], cap:80},
];
(function(){
  const grid = $("#eventGrid"); if (!grid) return;
  function card(e){ return `<article class="card">
    <h3><a href="event.html?id=${e.id}">${sanitize(e.title)}</a></h3>
    <p class="muted">${new Date(e.date).toLocaleString()} @ ${sanitize(e.location)} • ${e.campus?"On-campus":"Off-campus"}</p>
    <p>${sanitize(e.desc)}</p>
    <button class="button outline" data-id="${e.id}" data-act="rsvp">RSVP (UI)</button>
  </article>`; }
  function render(arr){ grid.innerHTML = arr.map(card).join(""); }
  render(EVENTS);
  $("#applyEvents")?.addEventListener("click", ()=>{
    const q = ($("#eSearch")?.value || "").toLowerCase();
    const d = $("#eDate")?.value || "";
    const campus = $("#eCampus")?.value || "";
    const res = EVENTS.filter(e =>
      e.title.toLowerCase().includes(q) &&
      (!d || e.date.startsWith(d)) &&
      (!campus || (campus==="Yes" ? e.campus : !e.campus))
    );
    render(res);
  });
  grid.addEventListener("click", (e)=>{
    const btn = e.target.closest("button[data-act='rsvp']");
    if (!btn) return;
    alert("RSVP recorded (prototype).");
  });
})();

// Create Event
handleForm("#eventForm","Event published (prototype).");

// Event Detail
(function(){
  const title = $("#evTitle"); if (!title) return;
  const url = new URL(location.href);
  const id = url.searchParams.get("id") || "e1";
  const ev = EVENTS.find(x=>x.id===id) || EVENTS[0];
  $("#evTitle").textContent = ev.title;
  $("#evDT").textContent = new Date(ev.date).toLocaleString();
  $("#evLoc").textContent = ev.location;
  $("#evTags").textContent = ev.tags.join(", ");
  $("#evDesc").textContent = ev.desc;
  $("#rsvpBtn")?.addEventListener("click", ()=> alert("RSVP recorded (prototype)."));
  $("#waitlistBtn")?.addEventListener("click", ()=> alert("Added to waitlist (prototype)."));
})();

// Groups
const GROUPS = [
  {id:"g1", name:"Data Structures Study Group", members:12, focus:"CS/Algorithms", posts:["Welcome! Meet Wed 6 pm.","Share resources here."]},
  {id:"g2", name:"Chemistry Lab Partners", members:8, focus:"Chemistry", posts:["Lab Safety notes pinned.","Looking for partner Fri."]},
  {id:"g3", name:"Beginner Python Circle", members:15, focus:"Programming", posts:["Week 1: Lists & Loops.","Practice problems attached."]},
];
(function(){
  const grid = $("#groupGrid"); if (!grid) return;
  grid.innerHTML = GROUPS.map(g=>`<article class="card">
    <h3><a href="group.html?id=${g.id}">${sanitize(g.name)}</a></h3>
    <p class="muted">Members: ${g.members} • Focus: ${sanitize(g.focus)}</p>
    <a class="button" href="messages.html">Join & Chat</a>
  </article>`).join("");
})();
(function(){
  const t = $("#gTitle"); if (!t) return;
  const url = new URL(location.href);
  const id = url.searchParams.get("id") || "g1";
  const g = GROUPS.find(x=>x.id===id) || GROUPS[0];
  $("#gTitle").textContent = g.name;
  $("#gMembers").textContent = g.members;
  $("#gFocus").textContent = g.focus;
  $("#gPosts").innerHTML = g.posts.map(p=>`<li>${sanitize(p)}</li>`).join("");
})();

// Messages
(function(){
  const list = $("#chatList"); if (!list) return;
  const convos = [
    {id:"c1", name:"Study Group (Discrete Math)", msgs:[{from:"them", text:"Meet Wed 6 pm?"}]},
    {id:"c2", name:"Events Team", msgs:[{from:"them", text:"Hackathon prep night is Tue."}]},
  ];
  list.innerHTML = convos.map(c=>`<button class="button outline" data-id="${c.id}">${c.name}</button>`).join("");
  const header = $(".chat-header"), body = $(".chat-body");
  let current = null;
  list.addEventListener("click", e=>{
    const id = e.target.dataset.id;
    current = convos.find(x=>x.id===id);
    header.textContent = current?.name || "Conversation";
    render();
    updateMsgBadge(0);
  });
  function render(){
    if (!current){ body.innerHTML = "<p class='muted'>Select a conversation</p>"; return; }
    body.innerHTML = current.msgs.map(m=>`<div class="chat-msg ${m.from}">${sanitize(m.text)}</div>`).join("");
  }
  $("#chatForm")?.addEventListener("submit", e=>{
    e.preventDefault();
    if (!current) return;
    const input = $("#chatInput");
    const text = input.value.trim();
    if (!text) return;
    current.msgs.push({from:"me", text: sanitize(text)});
    input.value = "";
    render();
    body.scrollTop = body.scrollHeight;
  });
})();

// Map
(function(){
  const map = $("#campusMap"); if (!map) return;
  function place(x,y,cls,title){
    const pin = document.createElement("div");
    pin.className = `pin ${cls}`;
    pin.style.left = x+"%";
    pin.style.top = y+"%";
    pin.title = title;
    map.appendChild(pin);
  }
  function render(layer){
    map.innerHTML = "";
    if (layer==="all" || layer==="study"){ place(30,60,"study","Quiet Study Area - Library 2F"); place(65,42,"study","Study Pods - Lab Wing"); }
    if (layer==="all" || layer==="events"){ place(55,25,"events","Tech Resumes Talk - Engineering Hall"); place(20,70,"events","Study Jam - Library"); }
    if (layer==="all" || layer==="meetups"){ place(44,55,"meetups","Calculus Tutor Meetup - Cafeteria"); }
  }
  render("all");
  $("#applyMap")?.addEventListener("click", ()=>{ const layer = $("#mapLayer").value; render(layer); });
})();

// Skill Exchange
const SKILLS = [
  {id:"s1", name:"Spanish Exchange", offer:"Spanish practice", want:"English conversation"},
  {id:"s2", name:"Guitar Buddy", offer:"Guitar basics", want:"Piano tips"},
  {id:"s3", name:"Gym Partner", offer:"Workout routine", want:"Meal prep advice"},
];
(function(){
  const grid = $("#skillGrid"); if (!grid) return;
  grid.innerHTML = SKILLS.map(s=>`<article class="card"><h3>${sanitize(s.name)}</h3><p class="muted">Offer: ${sanitize(s.offer)}<br>Want: ${sanitize(s.want)}</p><a class="button" href="messages.html">Connect</a></article>`).join("");
})();

// Guidelines report
handleForm("#reportForm","Report submitted (prototype).");

// Admin
const USERS = [
  {name:"Ava Thompson", role:"student", status:"active"},
  {name:"Ben Lee", role:"tutor", status:"active"},
  {name:"Dr. Kim", role:"admin", status:"active"},
  {name:"Chris Park", role:"tutor", status:"suspended"},
];
(function(){
  const u = $("#adminUsers"); if (!u) return;
  u.innerHTML = USERS.map(x=>`<tr><td>${sanitize(x.name)}</td><td>${x.role}</td><td>${x.status}</td><td><button class="button outline">Toggle</button></td></tr>`).join("");
  const f = $("#adminFlags");
  if (f){ f.innerHTML = `<tr><td>Post r2</td><td>Spam</td><td><button class="button outline">Resolve</button></td></tr>`; }
  // analytics chart (vanilla canvas)
  const canvas = $("#analyticsChart");
  const ctx = canvas?.getContext("2d");
  if (ctx){
    const data = [12, 18, 9, 24, 30, 26, 34];
    const W = canvas.width, H = canvas.height, pad = 30;
    const max = Math.max(...data)*1.2;
    ctx.clearRect(0,0,W,H);
    ctx.strokeStyle = "#c6d4f7"; ctx.beginPath();
    ctx.moveTo(pad, H-pad); ctx.lineTo(W-pad, H-pad); ctx.lineTo(W-pad, pad); ctx.stroke();
    ctx.strokeStyle = "#0b63f6"; ctx.lineWidth = 2; ctx.beginPath();
    data.forEach((v,i)=>{
      const x = pad + (i*(W-2*pad)/(data.length-1));
      const y = H-pad - (v/max)*(H-2*pad);
      if (i===0) ctx.moveTo(x,y); else ctx.lineTo(x,y);
      ctx.fillStyle="#0b63f6"; ctx.beginPath(); ctx.arc(x,y,3,0,Math.PI*2); ctx.fill();
    });
    ctx.stroke();
  }
})();

// Utility to handle simple forms
function handleForm(sel,msg,after){
  const form = $(sel); if (!form) return;
  form.addEventListener("submit", (e)=>{
    e.preventDefault();
    if (!form.checkValidity()){ alert("Please complete required fields."); return; }
    alert(msg);
    after && after();
  });
}




// Force default theme (edublock) without UI selector
(function(){
  if (document.body && !document.body.classList.contains("theme-edublock")){
    document.body.classList.add("theme-edublock");
  }
})();

// Highlight slider: auto-rotation + arrows
(function () {
  const track = $(".highlight-track");
  if (!track) return;

  const slides   = $$(".highlight-card", track);
  const dots     = $$(".highlight-dots button");
  const prevBtn  = $(".highlight-arrow.prev");
  const nextBtn  = $(".highlight-arrow.next");

  if (!slides.length || !dots.length) return;

  let index = 0;
  const INTERVAL = 5000;
  let timer = null;

  function goTo(i) {
    const total = slides.length;
    index = (i + total) % total; // wrap around
    track.style.transform = `translateX(-${index * 100}%)`;
    dots.forEach((d, k) => d.classList.toggle("active", k === index));
  }

  function next() { goTo(index + 1); }
  function prev() { goTo(index - 1); }

  function startAuto() {
    timer = setInterval(next, INTERVAL);
  }

  function resetAuto() {
    clearInterval(timer);
    startAuto();
  }

  // Dots click
  dots.forEach((dot, i) => {
    dot.addEventListener("click", () => {
      goTo(i);
      resetAuto();
    });
  });

  // Arrow clicks
  if (prevBtn) {
    prevBtn.addEventListener("click", () => {
      prev();
      resetAuto();
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      next();
      resetAuto();
    });
  }

  // Init
  goTo(0);
  startAuto();
})();
