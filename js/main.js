const header = document.querySelector(".site-header");
const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");
const loader = document.querySelector(".page-loader");

const syncNavHeight = () => {
  if (!header) return;
  document.documentElement.style.removeProperty("--nav-height");
  document.documentElement.style.setProperty("--nav-height", `${header.offsetHeight}px`);
};

if (loader) {
  window.setTimeout(() => {
    loader.classList.add("is-hidden");
  }, 1800);
}

const setHeaderState = () => {
  if (!header) return;
  header.classList.toggle("is-scrolled", window.scrollY > 24);
  syncNavHeight();
};

window.addEventListener("scroll", setHeaderState);
window.addEventListener("resize", syncNavHeight);
window.addEventListener("load", syncNavHeight);
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

const CART_KEY = "nidolino_cart";
const getCart = () => JSON.parse(localStorage.getItem(CART_KEY) || "[]");
const saveCart = (cart) => {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  updateCartCount();
};
const rupees = (value) => `₹${value.toLocaleString("en-IN")}`;

const updateCartCount = () => {
  const count = getCart().reduce((sum, item) => sum + item.qty, 0);
  document.querySelectorAll('a[href="cart.html"]').forEach((link) => {
    let badge = link.querySelector(".cart-count");
    if (!badge) {
      badge = document.createElement("span");
      badge.className = "cart-count";
      link.appendChild(badge);
    }
    badge.textContent = count;
    badge.hidden = count === 0;
  });
};

const addCurrentProduct = () => {
  const panel = document.querySelector(".product-panel");
  if (!panel) return;
  const product = {
    id: "aurora-convertible-crib",
    name: panel.querySelector("h1").textContent.trim(),
    price: 68000,
    image: document.querySelector(".gallery-main img")?.getAttribute("src") || "images/products/aurora-crib.jpg",
    qty: Number(document.querySelector("[data-qty] input")?.value || 1)
  };
  const cart = getCart();
  const existing = cart.find((item) => item.id === product.id);
  if (existing) existing.qty += product.qty;
  else cart.push(product);
  saveCart(cart);
};

document.querySelector("[data-add-cart]")?.addEventListener("click", () => {
  addCurrentProduct();
  document.querySelector("[data-add-cart]").textContent = "Added";
  window.setTimeout(() => document.querySelector("[data-add-cart]").textContent = "Add to Cart", 900);
});

document.querySelector("[data-buy-now]")?.addEventListener("click", () => {
  addCurrentProduct();
  window.location.href = "cart.html";
});

const renderCart = () => {
  const target = document.querySelector("[data-cart-page]");
  if (!target) return;
  const cart = getCart();
  if (!cart.length) return;
  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  target.innerHTML = `
    <div class="cart-items">
      ${cart.map((item) => `
        <article class="cart-item" data-id="${item.id}">
          <img src="${item.image}" alt="${item.name}">
          <div><h3>${item.name}</h3><p>${rupees(item.price)}</p></div>
          <div class="cart-item-actions">
            <div class="qty-control" data-cart-qty><button data-action="decrease">−</button><input value="${item.qty}" aria-label="Quantity"><button data-action="increase">+</button></div>
            <button class="remove-cart">Remove</button>
          </div>
        </article>`).join("")}
    </div>
    <div class="cart-total"><h2>Total ${rupees(total)}</h2><a class="btn" href="contact.html">Checkout Inquiry</a></div>
  `;
};

document.addEventListener("click", (event) => {
  const item = event.target.closest(".cart-item");
  if (!item) return;
  const cart = getCart();
  const found = cart.find((entry) => entry.id === item.dataset.id);
  if (!found) return;
  if (event.target.matches(".remove-cart")) saveCart(cart.filter((entry) => entry.id !== found.id));
  if (event.target.dataset.action === "increase") { found.qty += 1; saveCart(cart); }
  if (event.target.dataset.action === "decrease") { found.qty = Math.max(1, found.qty - 1); saveCart(cart); }
  renderCart();
});

updateCartCount();
renderCart();

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
