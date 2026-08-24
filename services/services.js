
/*
 * NextCodeLab Services
 *
 * Handles:
 * - Scroll reveal animations
 * - Service card expansion
 * - Smooth scrolling
 * - Subtle mouse interaction
 */

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       SCROLL REVEAL
       ===================================================== */

    const revealElements = document.querySelectorAll(".reveal");

    if ("IntersectionObserver" in window) {

        const revealObserver = new IntersectionObserver(
            (entries, observer) => {

                entries.forEach((entry) => {

                    if (!entry.isIntersecting) {
                        return;
                    }

                    entry.target.classList.add("visible");

                    observer.unobserve(entry.target);
                });

            },
            {
                threshold: 0.12,
                rootMargin: "0px 0px -40px 0px"
            }
        );

        revealElements.forEach((element) => {
            revealObserver.observe(element);
        });

    } else {

        revealElements.forEach((element) => {
            element.classList.add("visible");
        });

    }


    /* =====================================================
       SERVICE CARD EXPANSION
       ===================================================== */

    const serviceCards = document.querySelectorAll(".service-card");

    serviceCards.forEach((card) => {

        const button = card.querySelector(".service-expand");

        if (!button) {
            return;
        }

        button.addEventListener("click", () => {

            const isExpanded = card.classList.contains("expanded");

            /*
             * Close the other cards.
             * This keeps the page clean instead of allowing
             * every service to expand at the same time.
             */
            serviceCards.forEach((otherCard) => {

                if (otherCard !== card) {
                    otherCard.classList.remove("expanded");

                    const otherButton =
                        otherCard.querySelector(".service-expand");

                    if (otherButton) {
                        otherButton.setAttribute(
                            "aria-expanded",
                            "false"
                        );
                    }
                }

            });

            card.classList.toggle("expanded");

            button.setAttribute(
                "aria-expanded",
                String(!isExpanded)
            );

        });

    });


    /* =====================================================
       SMOOTH SCROLL
       ===================================================== */

    document.querySelectorAll('a[href^="#"]').forEach((link) => {

        link.addEventListener("click", (event) => {

            const targetId = link.getAttribute("href");

            if (!targetId || targetId === "#") {
                return;
            }

            const target = document.querySelector(targetId);

            if (!target) {
                return;
            }

            event.preventDefault();

            target.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

        });

    });


    /* =====================================================
       SUBTLE CARD MOUSE EFFECT
       ===================================================== */

    const supportsHover =
        window.matchMedia("(hover: hover)").matches;

    if (supportsHover) {

        serviceCards.forEach((card) => {

            card.addEventListener("mousemove", (event) => {

                /*
                 * Don't rotate the card heavily.
                 * A tiny movement makes the UI feel more premium.
                 */
                const rect = card.getBoundingClientRect();

                const x =
                    (event.clientX - rect.left) /
                    rect.width;

                const y =
                    (event.clientY - rect.top) /
                    rect.height;

                const rotateX = (0.5 - y) * 2;
                const rotateY = (x - 0.5) * 2;

                card.style.transform =
                    `translateY(-8px) perspective(900px) ` +
                    `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;

            });

            card.addEventListener("mouseleave", () => {

                card.style.transform = "";

            });

        });

    }


    /* =====================================================
       BUTTON RIPPLE
       ===================================================== */

    document
        .querySelectorAll(".primary-button, .secondary-button, .cta-button")
        .forEach((button) => {

            button.addEventListener("click", (event) => {

                const ripple = document.createElement("span");

                const rect = button.getBoundingClientRect();

                ripple.style.position = "absolute";
                ripple.style.width = "10px";
                ripple.style.height = "10px";
                ripple.style.borderRadius = "50%";
                ripple.style.background = "rgba(255,255,255,0.25)";
                ripple.style.pointerEvents = "none";

                ripple.style.left =
                    `${event.clientX - rect.left - 5}px`;

                ripple.style.top =
                    `${event.clientY - rect.top - 5}px`;

                ripple.style.transform = "scale(0)";
                ripple.style.transition =
                    "transform 0.55s ease, opacity 0.55s ease";

                button.style.position = "relative";
                button.style.overflow = "hidden";

                button.appendChild(ripple);

                requestAnimationFrame(() => {
                    ripple.style.transform = "scale(35)";
                    ripple.style.opacity = "0";
                });

                setTimeout(() => {
                    ripple.remove();
                }, 600);

            });

        });


    /* =====================================================
       KEYBOARD ACCESSIBILITY
       ===================================================== */

    serviceCards.forEach((card) => {

        const button = card.querySelector(".service-expand");

        if (!button) {
            return;
        }

        button.setAttribute("aria-expanded", "false");

        button.addEventListener("keydown", (event) => {

            if (event.key !== "Enter" && event.key !== " ") {
                return;
            }

            event.preventDefault();
            button.click();

        });

    });

});
