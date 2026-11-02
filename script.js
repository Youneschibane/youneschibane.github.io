"use strict";

/* ============================================================
   SITE CONFIGURATION — edit only this block to update contacts.
   Leave a value as "" to hide that contact from the page.
   (Never put passwords, tokens or API keys in this file.)
   ============================================================ */
const CONFIG = {
  email: "oy_chibane@esi.dz",
  linkedin: "",  // full URL, e.g. "https://www.linkedin.com/in/your-handle"
  links: {
    swaggerLive: "",  // public URL of hosted Swagger UI (only if you deploy it), else ""
    postman: ""       // public URL of your published Postman collection, else ""
  }
};

const root = document.documentElement;
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
const hoverCapable = matchMedia("(hover: hover)").matches;

/* ---------- Contacts ---------- */
(function contacts() {
  const reveal = (key, href, label) => {
    document.querySelectorAll('[data-contact="' + key + '"]').forEach((li) => {
      const a = li.querySelector("a");
      if (!a) return;
      a.href = href;
      const v = a.querySelector(".ct-val");
      if (v) v.textContent = label;
      if (a.classList.contains("contact-card")) {
        a.setAttribute("aria-label", key === "email" ? "Email Younes at " + label : "Younes on LinkedIn (opens in a new tab)");
      }
      li.hidden = false;
    });
  };
  if (CONFIG.email) reveal("email", "mailto:" + CONFIG.email, CONFIG.email);
  if (CONFIG.linkedin) reveal("linkedin", CONFIG.linkedin, CONFIG.linkedin.replace(/^https?:\/\/(www\.)?/, ""));

  Object.keys(CONFIG.links).forEach((k) => {
    if (!CONFIG.links[k]) return;
    document.querySelectorAll('[data-link="' + k + '"]').forEach((a) => { a.href = CONFIG.links[k]; a.hidden = false; });
  });

  const btn = document.getElementById("copyEmail");
  const status = document.getElementById("copyStatus");
  if (btn && CONFIG.email) {
    btn.addEventListener("click", () => {
      copyText(CONFIG.email).then(() => {
        btn.classList.add("done");
        if (status) status.textContent = "Email address copied";
        setTimeout(() => btn.classList.remove("done"), 1800);
      }).catch(() => {});
    });
  } else if (btn) btn.hidden = true;
})();

/* ---------- Theme ---------- */
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
if (themeBtn) themeBtn.addEventListener("click", () => {
  const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
  applyTheme(next);
  try { localStorage.setItem("portfolio-theme", next); } catch (e) { /* storage unavailable */ }
});

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
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && navLinks.classList.contains("open")) { setMenu(false); menuBtn.focus(); } });
  document.addEventListener("click", (e) => { if (navLinks.classList.contains("open") && !navLinks.contains(e.target) && !menuBtn.contains(e.target)) setMenu(false); });
  matchMedia("(min-width: 821px)").addEventListener("change", (m) => { if (m.matches) setMenu(false); });
}

/* ---------- Active section highlight ---------- */
const navAnchors = [...document.querySelectorAll(".nav-links a")];
if ("IntersectionObserver" in window && navAnchors.length) {
  const spy = new IntersectionObserver((entries) => entries.forEach((en) => {
    if (!en.isIntersecting) return;
    navAnchors.forEach((a) => {
      const on = a.getAttribute("href") === "#" + en.target.id;
      a.classList.toggle("active", on);
      if (on) a.setAttribute("aria-current", "true"); else a.removeAttribute("aria-current");
    });
  }), { rootMargin: "-45% 0px -50% 0px" });
  document.querySelectorAll("main section[id]").forEach((s) => spy.observe(s));
}

/* ---------- Scroll reveal with stagger ---------- */
document.querySelectorAll(".tech-grid, .func-grid, .learn-grid, .stagger").forEach((g) =>
  [...g.children].forEach((c, i) => { c.classList.add("reveal"); c.style.setProperty("--d", i * 80 + "ms"); })
);
const items = document.querySelectorAll(".reveal");
if (reduce || !("IntersectionObserver" in window)) {
  items.forEach((el) => el.classList.add("visible"));
} else {
  const io = new IntersectionObserver((entries, obs) => entries.forEach((en) => {
    if (en.isIntersecting) { en.target.classList.add("visible"); obs.unobserve(en.target); }
  }), { threshold: 0.12 });
  items.forEach((el) => io.observe(el));
}

/* ---------- Scroll progress + header shadow ---------- */
const bar = document.getElementById("progress");
const nav = document.querySelector(".navbar");
function onScroll() {
  const max = document.documentElement.scrollHeight - innerHeight;
  if (bar) bar.style.transform = "scaleX(" + (max > 0 ? scrollY / max : 0) + ")";
  if (nav) nav.classList.toggle("scrolled", scrollY > 20);
}
addEventListener("scroll", onScroll, { passive: true });
onScroll();

/* ---------- Hero: terminal typing, pointer glow, tilt ---------- */
const lines = document.querySelectorAll(".terminal .line");
lines.forEach((l, i) => reduce ? l.classList.add("show") : setTimeout(() => l.classList.add("show"), 700 + i * 520));

const hero = document.getElementById("home");
if (hero && !reduce && hoverCapable) {
  hero.addEventListener("pointermove", (e) => {
    const r = hero.getBoundingClientRect();
    hero.style.setProperty("--hx", e.clientX - r.left + "px");
    hero.style.setProperty("--hy", e.clientY - r.top + "px");
  });
}
const tilt = document.querySelector("[data-tilt]");
if (tilt && !reduce && hoverCapable) {
  tilt.addEventListener("pointermove", (e) => {
    const r = tilt.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
    tilt.style.transform = "rotateY(" + x * 9 + "deg) rotateX(" + -y * 9 + "deg)";
  });
  tilt.addEventListener("pointerleave", () => { tilt.style.transform = ""; });
}

/* ---------- Copy helper (terminal + email) ---------- */
function copyText(text) {
  if (navigator.clipboard && window.isSecureContext) return navigator.clipboard.writeText(text);
  return new Promise((resolve, reject) => {           // fallback for non-secure contexts
    const t = document.createElement("textarea");
    t.value = text; t.setAttribute("readonly", ""); t.style.cssText = "position:fixed;opacity:0";
    document.body.appendChild(t); t.select();
    try { document.execCommand("copy") ? resolve() : reject(); } catch (e) { reject(e); }
    t.remove();
  });
}
const copyTerm = document.getElementById("copyTerm");
if (copyTerm) {
  const label = copyTerm.querySelector("span");
  copyTerm.addEventListener("click", () => {
    const text = [...document.querySelectorAll(".terminal .cmd")].map((c) => c.textContent).join("\n");
    copyText(text).then(() => {
      label.textContent = "Copied!"; copyTerm.classList.add("done");
      const s = document.getElementById("copyStatus"); if (s) s.textContent = "Example commands copied";
    }).catch(() => { label.textContent = "Press Ctrl+C"; }).finally(() => setTimeout(() => { label.textContent = "Copy"; copyTerm.classList.remove("done"); }, 1800));
  });
}

/* ---------- Hero network canvas (paused off-screen / hidden tab) ---------- */
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
    c.width = w * dpr; c.height = h * dpr; c.style.width = w + "px"; c.style.height = h + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const n = Math.min(Math.round(w * h / 18000), w < 600 ? 24 : 60);
    pts = Array.from({ length: n }, () => ({ x: Math.random() * w, y: Math.random() * h, vx: (Math.random() - .5) * .35, vy: (Math.random() - .5) * .35 }));
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
      ctx.globalAlpha = .5; ctx.beginPath(); ctx.arc(p.x, p.y, 1.7, 0, 6.283); ctx.fill();
      for (let j = i + 1; j < pts.length; j++) {
        const q = pts[j], d = Math.hypot(p.x - q.x, p.y - q.y);
        if (d < 120) { ctx.globalAlpha = (1 - d / 120) * .25; ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.stroke(); }
      }
      const dm = Math.hypot(p.x - mouse.x, p.y - mouse.y);
      if (dm < 160) { ctx.globalAlpha = (1 - dm / 160) * .55; ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(mouse.x, mouse.y); ctx.stroke(); }
    }
  }
  size(); frame();
  addEventListener("resize", size);
  c.parentElement.addEventListener("pointermove", (e) => { const r = c.getBoundingClientRect(); mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top; });
  c.parentElement.addEventListener("pointerleave", () => { mouse.x = mouse.y = -999; });
  new IntersectionObserver((e) => { visible = e[0].isIntersecting; }).observe(c);
})();

/* ---------- Footer year ---------- */
const y = document.getElementById("year");
if (y) y.textContent = new Date().getFullYear();
