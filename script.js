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


// Very subtle pointer parallax on the homepage for a little dimensional depth.
// It is disabled for touch-first and reduced-motion users.
const heroSection = document.querySelector(".hero");
const canUseFinePointer = window.matchMedia && window.matchMedia("(hover: hover) and (pointer: fine)").matches;
const prefersLessMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
if (heroSection && canUseFinePointer && !prefersLessMotion) {
  heroSection.addEventListener("pointermove", event => {
    const bounds = heroSection.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - 0.5;
    const y = (event.clientY - bounds.top) / bounds.height - 0.5;
    heroSection.style.setProperty("--pointer-x", `${x * 3}deg`);
    heroSection.style.setProperty("--pointer-y", `${y * -3}deg`);
    heroSection.style.setProperty("--pointer-glow-x", `${50 + x * 12}%`);
    heroSection.style.setProperty("--pointer-glow-y", `${50 + y * 12}%`);
  });
  heroSection.addEventListener("pointerleave", () => {
    heroSection.style.setProperty("--pointer-x", "0deg");
    heroSection.style.setProperty("--pointer-y", "0deg");
  });
}
