// script.js
// Theme configuration
const DARK_IS_PREFERRED = true;
document.addEventListener("DOMContentLoaded", () => {
  initTheme();

  // Determine which page we are on
  if (document.getElementById("app-grid")) {
    initHomePage();
    initScrollTop();
  } else if (document.getElementById("app-detail-container")) {
    initAppPage();
  }
});

/* --- Theme Management --- */
function initTheme() {
  const themeToggle = document.getElementById("theme-toggle");
  const root = document.documentElement;
  const storedTheme = localStorage.getItem("theme");

  // Use saved preference first, otherwise use configured default
  const theme = storedTheme || (DARK_IS_PREFERRED ? "dark" : "light");

  root.setAttribute("data-theme", theme);

  if (themeToggle) {
    themeToggle.textContent = theme === "dark" ? "☀️" : "🌙";

    themeToggle.addEventListener("click", () => {
      const isDark = root.getAttribute("data-theme") === "dark";
      const newTheme = isDark ? "light" : "dark";

      root.setAttribute("data-theme", newTheme);
      localStorage.setItem("theme", newTheme);

      themeToggle.textContent = newTheme === "dark" ? "☀️" : "🌙";
    });
  }
}
/* --- Home Page Rendering & Filtering --- */
function initHomePage() {
  const grid = document.getElementById("app-grid");

  // Render all apps from data.js
  function renderCards(apps) {
    grid.innerHTML = apps
      .map(
        (app) => `
            <a href="/details/?id=${app.id}" class="app-card" data-category="${app.category.toLowerCase()}">
                <div class="app-card-header">
                    <img src="${app.icon}" alt="${app.name} Icon" class="app-icon" loading="lazy">
                    <div>
                        <h3 class="app-title">${app.name}</h3>
                        <span class="app-platforms">${app.platforms.join(" · ")}</span>
                    </div>
                </div>
                <p class="app-desc">${app.tagline}</p>
                <div class="app-card-footer">
                    <span style="color: var(--text-muted); font-size: 0.875rem;">${app.category}</span>
                    <span class="btn-text" style="color: var(--accent); font-weight: 600;">View App &rarr;</span>
                </div>
            </a>
        `,
      )
      .join("");
  }

  renderCards(appsData);

  // Filtering logic
  const filterButtons = document.querySelectorAll(".filter-chip");
  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      filterButtons.forEach((btn) => btn.classList.remove("active"));
      button.classList.add("active");

      const filter = button.getAttribute("data-filter");
      const cards = document.querySelectorAll(".app-card");

      cards.forEach((card) => {
        if (filter === "all" || card.getAttribute("data-category") === filter) {
          card.style.display = "flex";
          card.style.animation = "fadeIn 0.3s ease forwards";
        } else {
          card.style.display = "none";
        }
      });
    });
  });
}

/* --- App Detail Page Rendering --- */
function initAppPage() {
  // Get the ?id= from the URL (e.g., app.html?id=codesnipper)
  const params = new URLSearchParams(window.location.search);
  const appId = params.get("id");
  const app = appsData.find((a) => a.id === appId);

  if (!app) {
    document.getElementById("app-detail-container").innerHTML =
      `<h1>App Not Found</h1><a href="/">Go back</a>`;
    return;
  }

  // Populate data
  document.title = `${app.name} - NextCodeLab`;
  document.getElementById("app-icon").src = app.icon;
  document.getElementById("app-title").textContent = app.name;
  document.getElementById("app-tagline").textContent = app.tagline;
  document.getElementById("app-desc").textContent = app.description;

  document.getElementById("app-category").textContent = app.category;
  document.getElementById("app-platforms").textContent =
    app.platforms.join(", ");

  // Render Store Buttons dynamically
  const storeContainer = document.getElementById("store-buttons");
  let buttonsHtml = "";
  if (app.microsoftStore)
    buttonsHtml += `<a href="${app.microsoftStore}" class="store-btn">🪟 Get it from Microsoft</a>`;
  if (app.googlePlay)
    buttonsHtml += `<a href="${app.googlePlay}" class="store-btn">▶️ Get it on Google Play</a>`;
  if (app.appStore)
    buttonsHtml += `<a href="${app.appStore}" class="store-btn">🍏 Download on App Store</a>`;
  if (app.website)
    buttonsHtml += `<a href="${app.website}" class="store-btn">🌐 Open Website</a>`;
  storeContainer.innerHTML = buttonsHtml;

  // Render Features
  document.getElementById("app-features").innerHTML = app.features
    .map((f) => `<li>${f}</li>`)
    .join("");

  // Render Screenshots
  document.getElementById("app-screenshots").innerHTML = app.screenshots
    .map((s) => `<img src="${s}" alt="Screenshot" class="screenshot">`)
    .join("");
}

/* --- Scroll To Top --- */
function initScrollTop() {
  const scrollTopButton = document.getElementById("scroll-top");

  if (!scrollTopButton) return;

  function updateScrollButton() {
    if (window.scrollY > 100) {
      scrollTopButton.classList.add("visible");
    } else {
      scrollTopButton.classList.remove("visible");
    }
  }

  window.addEventListener("scroll", updateScrollButton);

  scrollTopButton.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });

  updateScrollButton();
}
