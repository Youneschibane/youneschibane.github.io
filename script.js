"use strict";

/* ============================================================
   SITE CONFIGURATION — edit only this block to update contacts.
   Leave a value as "" to hide that contact from the page.
   ============================================================ */
const CONFIG = {
  email: "oy_chibane@esi.dz",
  linkedin: ""   // full URL, e.g. "https://www.linkedin.com/in/your-handle"
};

/* ---------- Contact links ---------- */
(function renderContacts() {
  const show = (key, href, label) => {
    document.querySelectorAll('[data-contact="' + key + '"]').forEach((item) => {
      const a = item.querySelector("a");
      if (!a) return;
      a.href = href;
      const v = a.querySelector(".ct-val");
      if (v && label) v.textContent = label;
      else if (label) a.insertAdjacentText("afterbegin", label);
      item.hidden = false;
    });
  };
  if (CONFIG.email) show("email", "mailto:" + CONFIG.email, CONFIG.email);
  if (CONFIG.linkedin) {
    show("linkedin", CONFIG.linkedin);
    const c = document.querySelector('.contact-list [data-contact="linkedin"] .ct-val');
    if (c) c.textContent = CONFIG.linkedin.replace(/^https?:\/\/(www\.)?/, "");
  }
})();

/* ---------- Theme toggle ---------- */
const root = document.documentElement;
const themeBtn = document.getElementById("themeToggle");
const ICONS = {
  sun: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>',
  moon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>'
};

function applyTheme(theme) {
  root.setAttribute("data-theme", theme);
  if (!themeBtn) return;
  themeBtn.innerHTML = theme === "dark" ? ICONS.sun : ICONS.moon;
  themeBtn.setAttribute("aria-label", theme === "dark" ? "Switch to light theme" : "Switch to dark theme");
}
applyTheme(root.getAttribute("data-theme") === "light" ? "light" : "dark");

if (themeBtn) {
  themeBtn.addEventListener("click", () => {
    const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    applyTheme(next);
    try { localStorage.setItem("portfolio-theme", next); } catch (e) { /* storage unavailable */ }
  });
}

/* ---------- Mobile navigation ---------- */
const menuBtn = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");

function setMenu(open) {
  if (!menuBtn || !navLinks) return;
  navLinks.classList.toggle("open", open);
  menuBtn.setAttribute("aria-expanded", String(open));
  menuBtn.setAttribute("aria-label", open ? "Close navigation menu" : "Open navigation menu");
}
if (menuBtn && navLinks) {
  menuBtn.addEventListener("click", () => setMenu(!navLinks.classList.contains("open")));
  navLinks.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => setMenu(false)));
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && navLinks.classList.contains("open")) { setMenu(false); menuBtn.focus(); }
  });
  document.addEventListener("click", (e) => {
    if (navLinks.classList.contains("open") && !navLinks.contains(e.target) && !menuBtn.contains(e.target)) setMenu(false);
  });
  matchMedia("(min-width: 821px)").addEventListener("change", (m) => { if (m.matches) setMenu(false); });
}

/* ---------- Active section highlight ---------- */
const links = [...document.querySelectorAll(".nav-links a")];
if ("IntersectionObserver" in window && links.length) {
  const spy = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (!en.isIntersecting) return;
      links.forEach((a) => {
        const on = a.getAttribute("href") === "#" + en.target.id;
        a.classList.toggle("active", on);
        if (on) a.setAttribute("aria-current", "true"); else a.removeAttribute("aria-current");
      });
    });
  }, { rootMargin: "-45% 0px -50% 0px" });
  document.querySelectorAll("main section[id]").forEach((s) => spy.observe(s));
}

/* ---------- Scroll reveal (skipped for reduced motion) ---------- */
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
const items = document.querySelectorAll(".reveal");
if (reduce || !("IntersectionObserver" in window)) {
  items.forEach((el) => el.classList.add("visible"));
} else {
  const io = new IntersectionObserver((entries, obs) => {
    entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add("visible"); obs.unobserve(en.target); } });
  }, { threshold: 0.12 });
  items.forEach((el) => io.observe(el));
}

/* ---------- Footer year ---------- */
const y = document.getElementById("year");
if (y) y.textContent = new Date().getFullYear();


/* ---------- Terminal typing effect ---------- */
const lines = document.querySelectorAll(".terminal .line");
if (lines.length) {
  if (reduce) lines.forEach((l) => l.classList.add("show"));
  else lines.forEach((l, i) => setTimeout(() => l.classList.add("show"), 700 + i * 550));
}

/* ---------- Card spotlight (pointer devices only) ---------- */
if (!reduce && matchMedia("(hover: hover)").matches) {
  document.querySelectorAll(".card, .project, .contact-card").forEach((el) => {
    el.addEventListener("pointermove", (e) => {
      const r = el.getBoundingClientRect();
      el.style.setProperty("--mx", (e.clientX - r.left) + "px");
      el.style.setProperty("--my", (e.clientY - r.top) + "px");
    });
  });
}


/* ---------- Scroll progress + header state ---------- */
const bar = document.getElementById("progress");
const nav = document.querySelector(".navbar");
function onScroll() {
  const max = document.documentElement.scrollHeight - innerHeight;
  if (bar) bar.style.transform = "scaleX(" + (max > 0 ? scrollY / max : 0) + ")";
  if (nav) nav.classList.toggle("scrolled", scrollY > 20);
}
addEventListener("scroll", onScroll, { passive: true });
onScroll();

/* ---------- Staggered reveal for grids ---------- */
document.querySelectorAll(".skills-grid, .learning-grid").forEach((g) =>
  [...g.children].forEach((c, i) => { c.style.transitionDelay = i * 90 + "ms"; })
);

/* ---------- Rotating role text ---------- */
const roleEl = document.getElementById("role");
if (roleEl && !reduce) {
  const roles = ["REST APIs", "secure authentication", "MongoDB data models", "reliable backends"];
  let ri = 0, ci = roles[0].length, del = true;
  (function tick() {
    const word = roles[ri];
    ci += del ? -1 : 1;
    roleEl.textContent = word.slice(0, ci);
    let wait = del ? 40 : 85;
    if (!del && ci === word.length) { del = true; wait = 1800; }
    else if (del && ci === 0) { del = false; ri = (ri + 1) % roles.length; wait = 350; }
    setTimeout(tick, wait);
  })();
}

/* ---------- Hero: pointer glow ---------- */
const hero = document.getElementById("home");
if (hero && !reduce) {
  hero.addEventListener("pointermove", (e) => {
    const r = hero.getBoundingClientRect();
    hero.style.setProperty("--hx", e.clientX - r.left + "px");
    hero.style.setProperty("--hy", e.clientY - r.top + "px");
  });
}

/* ---------- 3D tilt on terminal ---------- */
const tilt = document.querySelector(".terminal");
if (tilt && !reduce && matchMedia("(hover: hover)").matches) {
  tilt.addEventListener("pointermove", (e) => {
    const r = tilt.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
    tilt.style.transform = "perspective(900px) rotateY(" + x * 9 + "deg) rotateX(" + -y * 9 + "deg)";
  });
  tilt.addEventListener("pointerleave", () => { tilt.style.transform = ""; });
}

/* ---------- Hero network canvas ---------- */
(function network() {
  const c = document.getElementById("net");
  if (!c || reduce || !c.getContext) return;
  const ctx = c.getContext("2d");
  const dpr = Math.min(devicePixelRatio || 1, 2);
  let w = 0, h = 0, pts = [], visible = true;
  const mouse = { x: -999, y: -999 };

  function size() {
    const r = c.parentElement.getBoundingClientRect();
    w = r.width; h = r.height;
    c.width = w * dpr; c.height = h * dpr;
    c.style.width = w + "px"; c.style.height = h + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const n = Math.min(Math.round(w * h / 16000), w < 600 ? 30 : 70);
    pts = Array.from({ length: n }, () => ({
      x: Math.random() * w, y: Math.random() * h,
      vx: (Math.random() - .5) * .4, vy: (Math.random() - .5) * .4
    }));
  }
  function frame() {
    requestAnimationFrame(frame);
    if (!visible || document.hidden) return;
    ctx.clearRect(0, 0, w, h);
    const col = getComputedStyle(root).getPropertyValue("--accent").trim() || "#2dd4bf";
    ctx.fillStyle = col; ctx.strokeStyle = col;
    for (let i = 0; i < pts.length; i++) {
      const p = pts[i];
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > w) p.vx *= -1;
      if (p.y < 0 || p.y > h) p.vy *= -1;
      ctx.globalAlpha = .55;
      ctx.beginPath(); ctx.arc(p.x, p.y, 1.8, 0, 6.283); ctx.fill();
      for (let j = i + 1; j < pts.length; j++) {
        const q = pts[j], d = Math.hypot(p.x - q.x, p.y - q.y);
        if (d < 125) { ctx.globalAlpha = (1 - d / 125) * .28; ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.stroke(); }
      }
      const dm = Math.hypot(p.x - mouse.x, p.y - mouse.y);
      if (dm < 170) { ctx.globalAlpha = (1 - dm / 170) * .6; ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(mouse.x, mouse.y); ctx.stroke(); }
    }
  }
  size(); frame();
  addEventListener("resize", size);
  c.parentElement.addEventListener("pointermove", (e) => {
    const r = c.getBoundingClientRect(); mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top;
  });
  c.parentElement.addEventListener("pointerleave", () => { mouse.x = mouse.y = -999; });
  new IntersectionObserver((e) => { visible = e[0].isIntersecting; }).observe(c);
})();
