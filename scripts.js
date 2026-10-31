
// ================================
// Theme toggle
// ================================

const themeToggle = document.getElementById("themeToggle");
const html = document.documentElement;

// Restore the saved theme, or use dark mode by default.
let savedTheme = null;

try {
  savedTheme = localStorage.getItem("portfolio-theme");
} catch (error) {
  console.warn("Could not access local storage.");
}

const initialTheme = savedTheme === "light" ? "light" : "dark";
html.setAttribute("data-theme", initialTheme);

function updateThemeButton(theme) {
  if (!themeToggle) return;

  themeToggle.textContent = theme === "dark" ? "☀" : "☾";
  themeToggle.setAttribute(
    "aria-label",
    theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
  );
}

updateThemeButton(initialTheme);

if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    const currentTheme = html.getAttribute("data-theme");
    const newTheme = currentTheme === "dark" ? "light" : "dark";

    html.setAttribute("data-theme", newTheme);
    updateThemeButton(newTheme);

    try {
      localStorage.setItem("portfolio-theme", newTheme);
    } catch (error) {
      console.warn("Could not save theme preference.");
    }
  });
}

// ================================
// Mobile navigation
// ================================

const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");

if (menuToggle && navLinks) {
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-controls", "navLinks");

  menuToggle.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("active");

    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.textContent = isOpen ? "✕" : "☰";
  });

  // Close the menu after selecting a navigation link.
  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("active");
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.textContent = "☰";
    });
  });
}
