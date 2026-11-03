const menuToggle = document.querySelector(".menu-toggle");
const nav = document.querySelector(".main-nav");
const navLinks = [...document.querySelectorAll(".nav-link")];

if (menuToggle && nav) {
  menuToggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
  });
}
navLinks.forEach(link => {
  link.addEventListener("click", () => {
    nav.classList.remove("open");
    if (menuToggle) menuToggle.setAttribute("aria-expanded", "false");
  });
});

// Highlight the four main navigation destinations while scrolling.
const mainSections = ["home", "about", "portfolio", "music"]
  .map(id => document.getElementById(id))
  .filter(Boolean);

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      navLinks.forEach(link => {
        const target = link.getAttribute("href");
        link.classList.toggle("active", target === `#${entry.target.id}`);
      });
    });
  }, { rootMargin: "-30% 0px -60% 0px" });
  mainSections.forEach(section => observer.observe(section));
}

// The music tabs scroll to their related section without adding extra top-level navigation.
document.querySelectorAll(".music-tab").forEach(tab => {
  tab.addEventListener("click", () => {
    document.querySelectorAll(".music-tab").forEach(item => item.classList.remove("active"));
    tab.classList.add("active");
  });
});


// Gentle scroll-in animations for section content and cards.
// Content remains visible if IntersectionObserver is unavailable or motion is reduced.
const reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
if (!reduceMotion && "IntersectionObserver" in window) {
  document.documentElement.classList.add("js-motion");
  const revealTargets = document.querySelectorAll(
    ".section-heading, .section-title-row, .about-copy, .about-image-frame, .portfolio-subsection, .music-intro, .soundtrack-card, .artist-card, .radar-item, .contact-heading, .contact-details"
  );
  revealTargets.forEach((element, index) => {
    element.classList.add("reveal-on-scroll");
    if (element.matches(".artist-card, .radar-item")) {
      element.style.setProperty("--reveal-delay", `${(index % 4) * 75}ms`);
    }
  });
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -35px 0px" });
  revealTargets.forEach(element => revealObserver.observe(element));
}
