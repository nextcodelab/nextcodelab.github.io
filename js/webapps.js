const webApps = [
  {
    title: "A4 to A5 PDF Converter",
    description: "Convert 2 A4 pages into 1 A5 page",
    icon: "/assets/apps/a4-a5.svg",
    path: "/apps/pdf/",
  },

  {
    title: "Web Notes",
    description: "Taking notes quickly",
    icon: "/assets/apps/notes.svg",
    path: "/apps/notes/",
  },
  {
    title: "Markdown Editor",
    description:
      "Fast, real-time Markdown editing and previewing right in your browser.",
    icon: "/assets/apps/md.svg",
    path: "/apps/md/",
  },
  //     {
  //         title: "Word Counter",
  //         description: "Count words and characters",
  //         icon: "/assets/apps/word-counter.svg",
  //         path: "/word-counter/"
  //     },

  //     {
  //         title: "JSON Formatter",
  //         description: "Format and validate JSON",
  //         icon: "/assets/apps/json-formatter.svg",
  //         path: "/json-formatter/"
  //     },

  //     {
  //         title: "QR Generator",
  //         description: "Create QR codes instantly",
  //         icon: "/assets/apps/qr-generator.svg",
  //         path: "/qr-generator/"
  //     },

  //     {
  //         title: "Text Case Converter",
  //         description: "Change text capitalization",
  //         icon: "/assets/apps/text-case.svg",
  //         path: "/text-case-converter/"
  //     }
];

/* =========================================================
   DYNAMIC WEB APPS
========================================================= */

function renderWebApps() {
  const container = document.getElementById("web-app-grid");

  if (!container) {
    return;
  }

  container.innerHTML = "";

  if (!Array.isArray(webApps) || webApps.length === 0) {
    container.innerHTML = `
            <div class="web-apps-empty">
                No web apps available.
            </div>
        `;

    return;
  }

  webApps.forEach((app) => {
    const card = document.createElement("a");

    card.className = "web-app-card";

    card.href = app.path || "#";

    /* Prevent malformed paths */
    if (!app.path) {
      card.removeAttribute("href");
    }

    /* Icon */
    const icon = document.createElement("img");

    icon.className = "web-app-icon";

    icon.src = app.icon || "/assets/icon.svg";

    icon.alt = app.title || "Web App";

    icon.loading = "lazy";

    /* Information */
    const info = document.createElement("div");

    info.className = "web-app-info";

    /* Title */
    const title = document.createElement("span");

    title.className = "web-app-name";

    title.textContent = app.title || "Untitled App";

    /* Description */
    const description = document.createElement("span");

    description.className = "web-app-description";

    description.textContent = app.description || "";

    /* Build */
    info.appendChild(title);
    info.appendChild(description);

    card.appendChild(icon);
    card.appendChild(info);

    container.appendChild(card);
  });
}
document.addEventListener("DOMContentLoaded", () => {
  renderWebApps();
});
