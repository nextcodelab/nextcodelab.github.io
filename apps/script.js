document.addEventListener("DOMContentLoaded", () => {
    const searchInput = document.getElementById("appSearch");
    const appCards = document.querySelectorAll(".app-card");
    const categorySections = document.querySelectorAll(".category-section");

    searchInput.addEventListener("input", (e) => {
        const query = e.target.value.toLowerCase().trim();

        // Filter individual cards
        appCards.forEach(card => {
            const title = card.querySelector(".app-title").textContent.toLowerCase();
            const desc = card.querySelector(".app-desc").textContent.toLowerCase();
            
            if (title.includes(query) || desc.includes(query)) {
                card.classList.remove("hidden");
            } else {
                card.classList.add("hidden");
            }
        });

        // Hide whole category sections if they are empty
        categorySections.forEach(section => {
            const visibleCards = section.querySelectorAll(".app-card:not(.hidden)");
            if (visibleCards.length === 0) {
                section.classList.add("hidden");
            } else {
                section.classList.remove("hidden");
            }
        });
    });
});