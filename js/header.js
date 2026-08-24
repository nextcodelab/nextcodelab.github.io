(function () {
    "use strict";

    const config = {
        brand: "NextCodeLab",

        links: [
            {
                label: "Apps",
                href: "/apps/"
            },
            {
                label: "Services",
                href: "/services/"
            },
            {
                label: "About",
                href: "/about/"
            }
        ]
    };


    /* =====================================================
       CREATE NAVBAR
       ===================================================== */

    function createNavbar() {

        const nav = document.createElement("nav");

        nav.className = "navbar";


        const container = document.createElement("div");

        container.className = "container nav-content";


        /* Brand */

        const brand = document.createElement("a");

        brand.className = "brand";
        brand.href = "/";

        brand.textContent = config.brand;


        /* Links */

        const navLinks = document.createElement("div");

        navLinks.className = "nav-links";


        config.links.forEach(item => {

            const link = document.createElement("a");

            link.href = item.href;
            link.textContent = item.label;

            if (isCurrentPage(item.href)) {

                link.classList.add("active");

                link.setAttribute(
                    "aria-current",
                    "page"
                );
            }

            navLinks.appendChild(link);

        });


        /* Theme button */

        const themeButton =
            document.createElement("button");

        themeButton.id = "theme-toggle";

        themeButton.className =
            "btn-secondary btn theme-toggle";

        themeButton.type = "button";

        themeButton.setAttribute(
            "aria-label",
            "Toggle theme"
        );


        navLinks.appendChild(themeButton);


        /* Build */

        container.appendChild(brand);
        container.appendChild(navLinks);

        nav.appendChild(container);


        /*
         * INSERT AS FIRST ELEMENT
         * INSIDE BODY
         */

        document.body.prepend(nav);


        initializeTheme();
    }


    /* =====================================================
       ACTIVE PAGE
       ===================================================== */

    function isCurrentPage(href) {

        const current =
            normalizePath(
                window.location.pathname
            );

        const target =
            normalizePath(href);

        return current === target;
    }


    function normalizePath(path) {

        path = path
            .toLowerCase()
            .replace(/\/index\.html$/, "/");


        if (!path.endsWith("/")) {
            path += "/";
        }


        return path;
    }


    /* =====================================================
       THEME
       ===================================================== */

    function initializeTheme() {

        const saved =
            localStorage.getItem(
                "nextcodelab-theme"
            );


        if (saved === "dark") {

            document.documentElement
                .setAttribute(
                    "data-theme",
                    "dark"
                );

        }


        updateThemeButton();


        const button =
            document.getElementById(
                "theme-toggle"
            );


        if (!button) {
            return;
        }


        button.addEventListener(
            "click",
            toggleTheme
        );
    }


    function toggleTheme() {

        const isDark =
            document.documentElement
                .getAttribute(
                    "data-theme"
                ) === "dark";


        if (isDark) {

            document.documentElement
                .removeAttribute(
                    "data-theme"
                );

            localStorage.setItem(
                "nextcodelab-theme",
                "light"
            );

        } else {

            document.documentElement
                .setAttribute(
                    "data-theme",
                    "dark"
                );

            localStorage.setItem(
                "nextcodelab-theme",
                "dark"
            );
        }


        updateThemeButton();
    }


    function updateThemeButton() {

        const button =
            document.getElementById(
                "theme-toggle"
            );


        if (!button) {
            return;
        }


        const isDark =
            document.documentElement
                .getAttribute(
                    "data-theme"
                ) === "dark";


        button.textContent =
            isDark ? "☀️" : "🌙";

    }


    /* =====================================================
       START
       ===================================================== */

    if (document.readyState === "loading") {

        document.addEventListener(
            "DOMContentLoaded",
            createNavbar
        );

    } else {

        createNavbar();

    }

})();