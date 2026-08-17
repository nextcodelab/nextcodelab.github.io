document.addEventListener("DOMContentLoaded", () => {
  if (typeof SITE_CONFIG === "undefined") {
    console.error("SITE_CONFIG is not loaded.");
    return;
  }

  const config = SITE_CONFIG;

  /* =========================
     Company Name
     ========================= */

  document.querySelectorAll("[data-site-name]").forEach((element) => {
    element.textContent = config.company.name;
  });

  /* =========================
     Logo
     ========================= */

  document.querySelectorAll("[data-site-logo]").forEach((element) => {
    element.src = config.company.logo;
    element.alt = config.company.name;
  });

  /* =========================
     Contact
     =========================
     Keep the visible text short.
     The actual email comes from SITE_CONFIG.
     */

  document.querySelectorAll("[data-contact-email]").forEach((element) => {
    if (element.tagName.toLowerCase() === "a") {
      element.href = `mailto:${config.company.email}`;
      element.textContent = "Contact";
    }
  });

  /* =========================
     Website
     =========================
     Keep the visible text short.
     */

  document.querySelectorAll("[data-site-website]").forEach((element) => {
    if (element.tagName.toLowerCase() === "a") {
      element.href = config.company.website;
      element.textContent = "Website";
    }
  });

  /* =========================
     Privacy
     ========================= */

  document.querySelectorAll("[data-privacy-link]").forEach((element) => {
    element.href = config.legal.privacyUrl;
  });

  /* =========================
     Terms
     ========================= */

  document.querySelectorAll("[data-terms-link]").forEach((element) => {
    element.href = config.legal.termsUrl;
  });

  /* =========================
     Effective Date
     ========================= */

  document.querySelectorAll("[data-effective-date]").forEach((element) => {
    element.textContent = config.legal.effectiveDate;
  });

  /* =========================
     Copyright
     ========================= */

  const currentYear = new Date().getFullYear();
  const startYear = config.copyright.startYear;

  document.querySelectorAll("[data-copyright]").forEach((element) => {
    element.textContent =
      startYear === currentYear ? currentYear : `${startYear}-${currentYear}`;
  });

  /* =========================
     Company Tagline
     ========================= */

  document.querySelectorAll("[data-company-tagline]").forEach((element) => {
    element.textContent = config.company.tagline;
  });

  /* =========================
     Company Description
     ========================= */

  document.querySelectorAll("[data-company-description]").forEach((element) => {
    element.textContent = config.company.description;
  });

  /* =========================
     Footer About
     ========================= */

  document.querySelectorAll("[data-footer-about]").forEach((element) => {
    element.textContent = config.footer.about;
  });

  /* =========================
     Footer About Title
     ========================= */

  document.querySelectorAll("[data-footer-about-title]").forEach((element) => {
    element.textContent = `About ${config.company.name}`;
  });
});
