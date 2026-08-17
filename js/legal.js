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
       Contact Email
       ========================= */

  document.querySelectorAll("[data-contact-email]").forEach((element) => {
    element.textContent = config.company.email;

    if (element.tagName === "A") {
      element.href = `mailto:${config.company.email}`;
    }
  });

  /* =========================
       Website
       ========================= */

  document.querySelectorAll("[data-site-website]").forEach((element) => {
    element.textContent = config.company.website;

    if (element.tagName === "A") {
      element.href = config.company.website;
    }
  });

  /* =========================
       Privacy Links
       ========================= */

  document.querySelectorAll("[data-privacy-link]").forEach((element) => {
    element.href = config.legal.privacyUrl;
  });

  /* =========================
       Terms Links
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

  document.querySelectorAll("[data-copyright]").forEach((element) => {
    const startYear = config.copyright.startYear;

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
       Footer Text
       ========================= */

  document.querySelectorAll("[data-footer-about]").forEach((element) => {
    element.textContent = config.footer.about;
  });
});
