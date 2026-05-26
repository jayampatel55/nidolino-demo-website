const header = document.querySelector(".site-header");
const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");
const loader = document.querySelector(".page-loader");

if (loader) {
  window.setTimeout(() => {
    loader.classList.add("is-hidden");
  }, 1800);
}

const setHeaderState = () => {
  if (!header) return;
  header.classList.toggle("is-scrolled", window.scrollY > 24);
};

window.addEventListener("scroll", setHeaderState);
setHeaderState();

if (menuToggle && navLinks) {
  menuToggle.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("is-open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    document.body.classList.toggle("menu-open", isOpen);
  });
}

document.querySelectorAll(".accordion-button").forEach((button) => {
  button.addEventListener("click", () => {
    const item = button.closest(".accordion-item");
    item.classList.toggle("is-open");
  });
});

document.querySelectorAll(".thumb").forEach((thumb) => {
  thumb.addEventListener("click", () => {
    const image = document.querySelector(".gallery-main img");
    if (!image) return;
    document.querySelectorAll(".thumb").forEach((item) => item.classList.remove("is-active"));
    thumb.classList.add("is-active");
    image.src = thumb.querySelector("img").src;
  });
});

document.querySelectorAll("[data-qty]").forEach((control) => {
  const input = control.querySelector("input");
  control.querySelectorAll("button").forEach((button) => {
    button.addEventListener("click", () => {
      const step = button.dataset.action === "increase" ? 1 : -1;
      input.value = Math.max(1, Number(input.value || 1) + step);
    });
  });
});

document.querySelectorAll(".swatch").forEach((swatch) => {
  swatch.addEventListener("click", () => {
    swatch.parentElement.querySelectorAll(".swatch").forEach((item) => item.classList.remove("is-active"));
    swatch.classList.add("is-active");
  });
});

const revealItems = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealItems.forEach((item) => observer.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}
