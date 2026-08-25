(function () {
    "use strict";

    const config = {
        brand: "NextCodeLab",
        links: [
            { label: "Apps", href: "/#apps" },
            { label: "Services", href: "/services/" },
            { label: "Play", href: "/play/" },
            { label: "About", href: "/about/" }
        ]
    };

    function createNavbar() {
        const nav = document.createElement("nav");
        nav.className = "navbar";

        const container = document.createElement("div");
        container.className = "container nav-content";

        // BRAND
        const brand = document.createElement("a");
        brand.className = "brand";
        brand.href = "/";
        brand.textContent = config.brand;

        // MOBILE MENU BUTTON
        const menuButton = document.createElement("button");
        menuButton.className = "mobile-menu-button";
        menuButton.type = "button";
        menuButton.setAttribute("aria-label", "Open navigation menu");
        menuButton.setAttribute("aria-expanded", "false");
        menuButton.innerHTML = `<span></span><span></span><span></span>`;

        // NAV LINKS & ACTIONS CONTAINER
        const navLinks = document.createElement("div");
        navLinks.className = "nav-links";

        // SEARCH BAR (Injected to the left of the links)
        const searchWrapper = document.createElement("div");
        searchWrapper.className = "nav-search-container";
        searchWrapper.innerHTML = `
            <span class="nav-search-icon">⌕</span>
            <input 
                type="text" 
                id="navbarAppSearch" 
                placeholder="Search apps..." 
                autocomplete="off"
            >
        `;
        navLinks.appendChild(searchWrapper);

        // CONFIG LINKS
        config.links.forEach(item => {
            const link = document.createElement("a");
            link.href = item.href;
            link.textContent = item.label;

            if (isCurrentPage(item.href)) {
                link.classList.add("active");
                link.setAttribute("aria-current", "page");
            }

            link.addEventListener("click", () => {
                closeMobileMenu();
            });

            navLinks.appendChild(link);
        });

        // THEME BUTTON (Placed right at the end of the menu)
        const themeButton = document.createElement("button");
        themeButton.id = "theme-toggle";
        themeButton.className = "btn-secondary btn theme-toggle";
        themeButton.type = "button";
        themeButton.setAttribute("aria-label", "Toggle theme");
        navLinks.appendChild(themeButton);

        // BUILD
        container.appendChild(brand);
        container.appendChild(menuButton);
        container.appendChild(navLinks);
        nav.appendChild(container);

        document.body.prepend(nav);

        // EVENTS
        menuButton.addEventListener("click", () => {
            const isOpen = nav.classList.contains("menu-open");
            if (isOpen) {
                closeMobileMenu();
            } else {
                openMobileMenu();
            }
        });

        document.addEventListener("click", event => {
            if (!nav.contains(event.target)) {
                closeMobileMenu();
            }
        });

        window.addEventListener("resize", () => {
            if (window.innerWidth > 700) {
                closeMobileMenu();
            }
        });

        initAppSearchFilter();
        initializeTheme();
    }

    function initAppSearchFilter() {
        const searchInput = document.getElementById('navbarAppSearch');
        if (!searchInput) return;

        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase().trim();
            const sections = document.querySelectorAll('.category-section');
            if (sections.length === 0) return;

            sections.forEach(section => {
                const cards = section.querySelectorAll('.app-card');
                let hasVisibleCards = false;

                cards.forEach(card => {
                    const keywords = card.getAttribute('data-name') || "";
                    const title = card.querySelector('.app-title')?.textContent.toLowerCase() || "";
                    const desc = card.querySelector('.app-desc')?.textContent.toLowerCase() || "";

                    if (title.includes(query) || desc.includes(query) || keywords.includes(query)) {
                        card.classList.remove('hidden-card');
                        hasVisibleCards = true;
                    } else {
                        card.classList.add('hidden-card');
                    }
                });

                if (hasVisibleCards) {
                    section.classList.remove('hidden-section');
                } else {
                    section.classList.add('hidden-section');
                }
            });
        });
    }

    function openMobileMenu() {
        const nav = document.querySelector(".navbar");
        const button = document.querySelector(".mobile-menu-button");
        if (!nav || !button) return;

        nav.classList.add("menu-open");
        button.setAttribute("aria-expanded", "true");
        button.setAttribute("aria-label", "Close navigation menu");
    }

    function closeMobileMenu() {
        const nav = document.querySelector(".navbar");
        const button = document.querySelector(".mobile-menu-button");
        if (!nav || !button) return;

        nav.classList.remove("menu-open");
        button.setAttribute("aria-expanded", "false");
        button.setAttribute("aria-label", "Open navigation menu");
    }

    function isCurrentPage(href) {
        const current = normalizePath(window.location.pathname);
        const target = normalizePath(href);
        return current === target;
    }

    function normalizePath(path) {
        path = path.toLowerCase().replace(/\/index\.html$/, "/");
        if (!path.endsWith("/")) path += "/";
        return path;
    }

    function initializeTheme() {
        const saved = localStorage.getItem("nextcodelab-theme");
        if (saved === "dark") {
            document.documentElement.setAttribute("data-theme", "dark");
        } else if (saved === "light") {
            document.documentElement.removeAttribute("data-theme");
        } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            document.documentElement.setAttribute("data-theme", "dark");
        }
        updateThemeButton();
        const button = document.getElementById("theme-toggle");
        if (button) {
            button.addEventListener("click", toggleTheme);
        }
    }

    function toggleTheme() {
        const isDark = document.documentElement.getAttribute("data-theme") === "dark";
        if (isDark) {
            document.documentElement.removeAttribute("data-theme");
            localStorage.setItem("nextcodelab-theme", "light");
        } else {
            document.documentElement.setAttribute("data-theme", "dark");
            localStorage.setItem("nextcodelab-theme", "dark");
        }
        updateThemeButton();
    }

    function updateThemeButton() {
        const button = document.getElementById("theme-toggle");
        if (!button) return;
        const isDark = document.documentElement.getAttribute("data-theme") === "dark";
        button.textContent = isDark ? "☀️" : "🌙";
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", createNavbar);
    } else {
        createNavbar();
    }
})();