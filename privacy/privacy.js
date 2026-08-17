// privacy.js

document.addEventListener("DOMContentLoaded", () => {

    /*
     * ==========================================
     * Site Information
     * ==========================================
     */

    const config = SITE_CONFIG;


    /*
     * ==========================================
     * Company Name
     * ==========================================
     */

    document.querySelectorAll("[data-site-name]")
        .forEach(element => {
            element.textContent = config.company.name;
        });


    const siteName = document.getElementById("site-name");

    if (siteName) {
        siteName.textContent = config.company.name;
    }


    /*
     * ==========================================
     * Contact Email
     * ==========================================
     */

    const emailElements =
        document.querySelectorAll("[data-contact-email]");

    emailElements.forEach(element => {
        element.textContent = config.company.email;
        element.href = `mailto:${config.company.email}`;
    });


    const contactEmail =
        document.getElementById("contact-email");

    if (contactEmail) {
        contactEmail.textContent =
            config.company.email;

        contactEmail.href =
            `mailto:${config.company.email}`;
    }


    /*
     * ==========================================
     * Website
     * ==========================================
     */

    document.querySelectorAll("[data-site-url]")
        .forEach(element => {
            element.textContent =
                config.company.website;

            element.href =
                config.company.website;
        });


    /*
     * ==========================================
     * Effective Date
     * ==========================================
     */

    document.querySelectorAll("[data-effective-date]")
        .forEach(element => {
            element.textContent =
                config.legal.effectiveDate;
        });


    const effectiveDate =
        document.getElementById("effective-date");

    if (effectiveDate) {
        effectiveDate.textContent =
            config.legal.effectiveDate;
    }


    /*
     * ==========================================
     * Copyright
     * ==========================================
     */

    const copyright =
        document.getElementById("copyright");

    if (copyright) {

        const currentYear =
            new Date().getFullYear();

        const startYear =
            config.copyright.startYear;

        const year =
            startYear === currentYear
                ? currentYear
                : `${startYear}-${currentYear}`;

        copyright.textContent =
            `© ${year} ${config.company.name}. All rights reserved.`;
    }


    /*
     * ==========================================
     * Theme
     * ==========================================
     */

    initTheme();


    /*
     * ==========================================
     * Scroll To Top
     * ==========================================
     */

    initScrollTop();

});


/*
 * ==========================================
 * Theme
 * ==========================================
 */

function initTheme() {

    const root =
        document.documentElement;

    const themeToggle =
        document.getElementById("theme-toggle");

    const storedTheme =
        localStorage.getItem("theme");

    const prefersDark =
        window.matchMedia &&
        window.matchMedia(
            "(prefers-color-scheme: dark)"
        ).matches;


    if (
        storedTheme === "dark" ||
        (!storedTheme && prefersDark)
    ) {

        root.setAttribute(
            "data-theme",
            "dark"
        );

        if (themeToggle) {
            themeToggle.textContent = "☀️";
        }

    }


    if (themeToggle) {

        themeToggle.addEventListener(
            "click",
            () => {

                const isDark =
                    root.getAttribute(
                        "data-theme"
                    ) === "dark";

                const newTheme =
                    isDark
                        ? "light"
                        : "dark";

                root.setAttribute(
                    "data-theme",
                    newTheme
                );

                localStorage.setItem(
                    "theme",
                    newTheme
                );

                themeToggle.textContent =
                    newTheme === "dark"
                        ? "☀️"
                        : "🌙";

            }
        );

    }

}


/*
 * ==========================================
 * Scroll To Top
 * ==========================================
 */

function initScrollTop() {

    const button =
        document.getElementById("scroll-top");

    if (!button) {
        return;
    }


    function update() {

        if (window.scrollY > 250) {
            button.classList.add("visible");
        } else {
            button.classList.remove("visible");
        }

    }


    window.addEventListener(
        "scroll",
        update,
        { passive: true }
    );


    button.addEventListener(
        "click",
        () => {

            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });

        }
    );


    update();
}