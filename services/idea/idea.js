
(function () {

    "use strict";


    /* =====================================================
       ELEMENTS
       ===================================================== */

    const form =
        document.getElementById("project-form");

    const projectName =
        document.getElementById("project-name");

    const description =
        document.getElementById("description");

    const email =
        document.getElementById("email");

    const customFeatures =
        document.getElementById("custom-features");

    const targetUsers =
        document.getElementById("target-users");

    const budget =
        document.getElementById("budget");

    const timeline =
        document.getElementById("timeline");

    const notes =
        document.getElementById("notes");

    const previewName =
        document.getElementById("preview-name");

    const previewDescription =
        document.getElementById("preview-description");

    const previewPlatforms =
        document.getElementById("preview-platforms");

    const previewFeatures =
        document.getElementById("preview-features");

    const aiButton =
        document.getElementById("ai-generate");


    /* =====================================================
       FEATURES
       ===================================================== */

    const selectedFeatures =
        new Set();


    document
        .querySelectorAll(".feature-chip")
        .forEach((chip) => {

            chip.addEventListener(
                "click",
                () => {

                    const feature =
                        chip.dataset.feature;


                    if (
                        selectedFeatures.has(feature)
                    ) {

                        selectedFeatures.delete(
                            feature
                        );

                        chip.classList.remove(
                            "selected"
                        );

                    } else {

                        selectedFeatures.add(
                            feature
                        );

                        chip.classList.add(
                            "selected"
                        );

                    }


                    updatePreview();

                }
            );

        });


    /* =====================================================
       LIVE PREVIEW
       ===================================================== */

    function updatePreview() {

        const name =
            projectName.value.trim();


        previewName.textContent =
            name || "Your project name";


        const text =
            description.value.trim();


        previewDescription.textContent =
            text ||
            "Your project description will appear here.";


        updatePlatforms();
        updateFeatures();

    }


    function updatePlatforms() {

        const platforms =
            [...document.querySelectorAll(
                'input[name="platform"]:checked'
            )]
            .map(input => input.value);


        previewPlatforms.innerHTML = "";


        if (!platforms.length) {

            previewPlatforms.innerHTML =
                "<span>Not selected</span>";

            return;
        }


        platforms.forEach(platform => {

            const tag =
                document.createElement("span");

            tag.textContent = platform;

            previewPlatforms.appendChild(tag);

        });

    }


    function updateFeatures() {

        previewFeatures.innerHTML = "";


        const features =
            [...selectedFeatures];


        const custom =
            customFeatures.value.trim();


        if (custom) {

            custom
                .split("\n")
                .map(item => item.trim())
                .filter(Boolean)
                .forEach(item => {
                    features.push(item);
                });

        }


        if (!features.length) {

            previewFeatures.innerHTML =
                "<span>No features selected</span>";

            return;
        }


        features
            .slice(0, 8)
            .forEach(feature => {

                const tag =
                    document.createElement("span");

                tag.textContent = feature;

                previewFeatures.appendChild(tag);

            });

    }


    [
        projectName,
        description,
        customFeatures,
        targetUsers,
        budget,
        timeline,
        notes
    ]
    .forEach((element) => {

        element.addEventListener(
            "input",
            updatePreview
        );

        element.addEventListener(
            "change",
            updatePreview
        );

    });


    document
        .querySelectorAll(
            'input[name="platform"]'
        )
        .forEach((input) => {

            input.addEventListener(
                "change",
                updatePreview
            );

        });


    /* =====================================================
       AI IDEA HELPER
       ===================================================== */

    aiButton.addEventListener(
        "click",
        () => {

            const current =
                description.value.trim();


            /*
             * This is intentionally a local helper.
             *
             * You can later replace this function with
             * your own AI/backend API.
             */

            if (!current) {

                description.focus();

                description.placeholder =
                    "First tell me the problem you want to solve...";

                return;
            }


            aiButton.classList.add("loading");

            aiButton.textContent =
                "✨ Thinking...";


            setTimeout(() => {

                const generated =
                    generateProjectDescription(
                        current
                    );


                description.value =
                    generated;


                updatePreview();


                aiButton.classList.remove(
                    "loading"
                );

                aiButton.textContent =
                    "✨ Improve description";

            }, 650);

        }
    );


    function generateProjectDescription(
        idea
    ) {

        return (
            "A custom software solution designed to " +
            idea.charAt(0).toLowerCase() +
            idea.slice(1) +
            ". The application can be designed " +
            "around the user's workflow with a " +
            "clean interface, appropriate platform " +
            "support, and room for future features."
        );

    }


    /* =====================================================
       VALIDATION
       ===================================================== */

    function validateForm() {

        let valid = true;


        if (!projectName.value.trim()) {

            markInvalid(projectName);

            valid = false;

        } else {

            clearInvalid(projectName);

        }


        if (!description.value.trim()) {

            markInvalid(description);

            valid = false;

        } else {

            clearInvalid(description);

        }


        if (!email.value.trim()) {

            markInvalid(email);

            valid = false;

        } else if (!email.validity.valid) {

            markInvalid(email);

            valid = false;

        } else {

            clearInvalid(email);

        }


        return valid;

    }


    function markInvalid(element) {

        element.classList.add(
            "field-invalid"
        );

        element.focus();

    }


    function clearInvalid(element) {

        element.classList.remove(
            "field-invalid"
        );

    }


    /* =====================================================
       BUILD EMAIL
       ===================================================== */

    function buildEmail() {

        const name =
            projectName.value.trim();

        const desc =
            description.value.trim();

        const clientEmail =
            email.value.trim();


        const platforms =
            [...document.querySelectorAll(
                'input[name="platform"]:checked'
            )]
            .map(input => input.value);


        const features =
            [...selectedFeatures];


        const custom =
            customFeatures.value.trim();


        if (custom) {

            custom
                .split("\n")
                .map(item => item.trim())
                .filter(Boolean)
                .forEach(item => {
                    features.push(item);
                });

        }


        const subject =
            `New Software Project — ${name}`;


        const lines = [

            "NEXTCODELAB — SOFTWARE PROJECT REQUEST",

            "",

            `Project: ${name}`,

            "",

            "DESCRIPTION",
            desc,

            "",

            "PLATFORM",
            platforms.length
                ? platforms.join(", ")
                : "Not specified",

            "",

            "FEATURES",

            features.length
                ? features.map(
                    feature => `• ${feature}`
                ).join("\n")
                : "No specific features listed",

            "",

            "TARGET USERS",
            targetUsers.value.trim()
                || "Not specified",

            "",

            "BUDGET",
            budget.value
                || "Not specified",

            "",

            "TIMELINE",
            timeline.value
                || "Not specified",

            "",

            "ADDITIONAL NOTES",
            notes.value.trim()
                || "None",

            "",

            "CLIENT EMAIL",
            clientEmail,

            "",

            "—",

            "Sent from the NextCodeLab project builder.",
            window.location.href

        ];


        return {
            subject,
            body: lines.join("\n")
        };

    }


    /* =====================================================
       SUBMIT
       ===================================================== */

    form.addEventListener(
        "submit",
        (event) => {

            event.preventDefault();


            if (!validateForm()) {

                const firstInvalid =
                    form.querySelector(
                        ".field-invalid"
                    );

                if (firstInvalid) {

                    firstInvalid.scrollIntoView({
                        behavior: "smooth",
                        block: "center"
                    });

                }

                return;
            }


            const emailData =
                buildEmail();


            /*
             * IMPORTANT:
             *
             * Replace this with YOUR email.
             */

            const destination =
                "studioapp.feedback@gmail.com";


            const mailto =
                "mailto:" +
                destination +
                "?subject=" +
                encodeURIComponent(
                    emailData.subject
                ) +
                "&body=" +
                encodeURIComponent(
                    emailData.body
                );


            /*
             * Open the user's default email application.
             */

            window.location.href =
                mailto;

        }
    );


    /* =====================================================
       INITIAL PREVIEW
       ===================================================== */

    updatePreview();

})();

