(function () {
    "use strict";

    const config = {
        brand: "NextCodeLab",

        links: [
            {
                label: "Apps",
                href: "#apps"
            },
            {
                label: "Services",
                href: "/services/"
            },
            {
                label: "Play",
                href: "/play/"
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


        const container =
            document.createElement("div");

        container.className =
            "container nav-content";


        /* =================================================
           BRAND
           ================================================= */

        const brand =
            document.createElement("a");

        brand.className = "brand";
        brand.href = "/";
        brand.textContent = config.brand;


        /* =================================================
           MOBILE MENU BUTTON
           ================================================= */

        const menuButton =
            document.createElement("button");

        menuButton.className =
            "mobile-menu-button";

        menuButton.type = "button";

        menuButton.setAttribute(
            "aria-label",
            "Open navigation menu"
        );

        menuButton.setAttribute(
            "aria-expanded",
            "false"
        );

        menuButton.innerHTML = `
            <span></span>
            <span></span>
            <span></span>
        `;


        /* =================================================
           NAV LINKS
           ================================================= */

        const navLinks =
            document.createElement("div");

        navLinks.className = "nav-links";


        config.links.forEach(item => {

            const link =
                document.createElement("a");

            link.href = item.href;

            link.textContent =
                item.label;


            if (isCurrentPage(item.href)) {

                link.classList.add("active");

                link.setAttribute(
                    "aria-current",
                    "page"
                );

            }


            /*
             * Close mobile menu after selecting
             * a navigation item.
             */

            link.addEventListener(
                "click",
                () => {

                    closeMobileMenu();

                }
            );


            navLinks.appendChild(link);

        });


        /* =================================================
           THEME BUTTON
           ================================================= */

        const themeButton =
            document.createElement("button");

        themeButton.id =
            "theme-toggle";

        themeButton.className =
            "btn-secondary btn theme-toggle";

        themeButton.type =
            "button";

        themeButton.setAttribute(
            "aria-label",
            "Toggle theme"
        );


        navLinks.appendChild(
            themeButton
        );


        /* =================================================
           BUILD
           ================================================= */

        container.appendChild(
            brand
        );

        container.appendChild(
            menuButton
        );

        container.appendChild(
            navLinks
        );

        nav.appendChild(
            container
        );


        /*
         * Insert navbar as the first
         * element inside body.
         */

        document.body.prepend(nav);


        /* =================================================
           EVENTS
           ================================================= */

        menuButton.addEventListener(
            "click",
            () => {

                const isOpen =
                    nav.classList.contains(
                        "menu-open"
                    );


                if (isOpen) {

                    closeMobileMenu();

                } else {

                    openMobileMenu();

                }

            }
        );


        /*
         * Close menu when clicking outside.
         */

        document.addEventListener(
            "click",
            event => {

                if (
                    !nav.contains(
                        event.target
                    )
                ) {

                    closeMobileMenu();

                }

            }
        );


        /*
         * Close menu when resizing
         * back to desktop.
         */

        window.addEventListener(
            "resize",
            () => {

                if (
                    window.innerWidth > 700
                ) {

                    closeMobileMenu();

                }

            }
        );


        initializeTheme();
    }


    /* =====================================================
       MOBILE MENU
       ===================================================== */

    function openMobileMenu() {

        const nav =
            document.querySelector(
                ".navbar"
            );

        const button =
            document.querySelector(
                ".mobile-menu-button"
            );


        if (!nav || !button) {
            return;
        }


        nav.classList.add(
            "menu-open"
        );


        button.setAttribute(
            "aria-expanded",
            "true"
        );

        button.setAttribute(
            "aria-label",
            "Close navigation menu"
        );

    }


    function closeMobileMenu() {

        const nav =
            document.querySelector(
                ".navbar"
            );

        const button =
            document.querySelector(
                ".mobile-menu-button"
            );


        if (!nav || !button) {
            return;
        }


        nav.classList.remove(
            "menu-open"
        );


        button.setAttribute(
            "aria-expanded",
            "false"
        );

        button.setAttribute(
            "aria-label",
            "Open navigation menu"
        );

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
            .replace(
                /\/index\.html$/,
                "/"
            );


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

    if (
        document.readyState ===
        "loading"
    ) {

        document.addEventListener(
            "DOMContentLoaded",
            createNavbar
        );

    } else {

        createNavbar();

    }

})();