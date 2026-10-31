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
      if (label) a.insertAdjacentText("afterbegin", label);
      item.hidden = false;
    });
  };
  if (CONFIG.email) show("email", "mailto:" + CONFIG.email, CONFIG.email);
  if (CONFIG.linkedin) {
    show("linkedin", CONFIG.linkedin);
    const c = document.querySelector('.contact-list [data-contact="linkedin"] a');
    if (c) c.insertAdjacentText("afterbegin", CONFIG.linkedin.replace(/^https?:\/\/(www\.)?/, ""));
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
