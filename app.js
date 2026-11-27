const dresses = [
  { id: "sienna", name: "The Sienna", category: "Wedding guest", color: "Rust · Satin", price: 68, image: "photo-1595777457583-95e059d581b8", alt: "Rust satin evening dress", available: true },
  { id: "celeste", name: "The Celeste", category: "Black tie", color: "Midnight · Floor length", price: 82, image: "photo-1566174053879-31528523f8ae", alt: "Elegant evening dress", available: true },
  { id: "margot", name: "The Margot", category: "Party", color: "Floral · Midi", price: 58, image: "photo-1591369822096-ffd140ec948f", alt: "Floral dress for a party", available: true },
  { id: "cleo", name: "The Cleo", category: "Wedding guest", color: "Soft pink · Pleated", price: 72, image: "photo-1566479179817-c0b65b4d5b9e", alt: "Soft pink occasion dress", available: true },
];

const storageKeys = {
  inquiries: "missche-inquiries",
  availability: "missche-availability",
};

const readStored = (key, fallback) => {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
};

const saveStored = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
};

const availability = readStored(storageKeys.availability, {});
const getAvailable = dress => availability[dress.id] ?? dress.available;
const dressGrid = document.querySelector("#dress-grid");
const dressSelect = document.querySelector("#dress-select");
const form = document.querySelector("#booking-form");
const formMessage = document.querySelector("#form-message");
const storeView = document.querySelector("#storefront");
const dashboardView = document.querySelector("#dashboard");

function renderDresses(filter = "all") {
  const visibleDresses = dresses.filter(dress => filter === "all" || dress.category === filter);
  dressGrid.replaceChildren();
  visibleDresses.forEach(dress => {
    const card = document.createElement("article");
    card.className = "dress-card";
    const image = document.createElement("div");
    image.className = "dress-image";
    const photo = document.createElement("img");
    photo.src = `https://images.unsplash.com/${dress.image}?auto=format&fit=crop&w=650&q=80`;
    photo.alt = dress.alt;
    photo.loading = "lazy";
    image.append(photo);
    const badge = document.createElement("span");
    badge.className = "dress-badge";
    badge.textContent = dress.category;
    image.append(badge);
    const info = document.createElement("div");
    info.className = "dress-info";
    const details = document.createElement("div");
    const name = document.createElement("h3");
    name.textContent = dress.name;
    const color = document.createElement("p");
    color.textContent = dress.color;
    details.append(name, color);
    const price = document.createElement("p");
    price.className = "dress-price";
    price.textContent = `$${dress.price} / rental`;
    info.append(details, price);
    const action = document.createElement("button");
    action.type = "button";
    action.className = "dress-action";
    action.textContent = getAvailable(dress) ? "Ask about this dress →" : "Currently unavailable";
    action.disabled = !getAvailable(dress);
    if (!getAvailable(dress)) action.classList.add("unavailable");
    action.addEventListener("click", () => {
      dressSelect.value = dress.id;
      document.querySelector("#booking").scrollIntoView({ behavior: "smooth" });
      dressSelect.focus({ preventScroll: true });
    });
    card.append(image, info, action);
    dressGrid.append(card);
  });
}

function renderDressOptions() {
  const current = dressSelect.value;
  dressSelect.replaceChildren(new Option("Choose a dress", ""));
  dresses.forEach(dress => {
    if (getAvailable(dress)) dressSelect.add(new Option(`${dress.name} — $${dress.price} / rental`, dress.id));
  });
  if ([...dressSelect.options].some(option => option.value === current)) dressSelect.value = current;
}

function renderDashboard() {
  const inquiries = readStored(storageKeys.inquiries, []);
  const availableCount = dresses.filter(getAvailable).length;
  document.querySelector("#stat-dresses").textContent = dresses.length;
  document.querySelector("#stat-available").textContent = availableCount;
  document.querySelector("#stat-pending").textContent = inquiries.filter(item => item.status === "New").length;
  document.querySelector("#stat-total").textContent = inquiries.length;
  document.querySelector("#inquiry-count").textContent = `${inquiries.length} ${inquiries.length === 1 ? "inquiry" : "inquiries"}`;

  const inquiryList = document.querySelector("#inquiry-list");
  inquiryList.replaceChildren();
  if (!inquiries.length) {
    const empty = document.createElement("p");
    empty.className = "empty-state";
    empty.textContent = "No inquiries just yet. New rental requests will show up here.";
    inquiryList.append(empty);
  } else {
    inquiries.forEach((inquiry, index) => {
      const item = document.createElement("article");
      item.className = "inquiry-item";
      const customer = document.createElement("div");
      const customerName = document.createElement("strong");
      customerName.textContent = inquiry.name;
      const email = document.createElement("small");
      email.textContent = inquiry.email;
      customer.append(customerName, email);
      const dress = document.createElement("div");
      const dressName = document.createElement("strong");
      dressName.textContent = dresses.find(entry => entry.id === inquiry.dress)?.name ?? "Dress no longer listed";
      const date = document.createElement("small");
      date.textContent = `Occasion date: ${inquiry.date}`;
      dress.append(dressName, date);
      const message = document.createElement("small");
      message.textContent = inquiry.message || "No additional details";
      const status = document.createElement("select");
      status.className = "status-select";
      status.setAttribute("aria-label", `Inquiry status for ${inquiry.name}`);
      ["New", "Contacted", "Confirmed", "Declined"].forEach(value => status.add(new Option(value, value)));
      status.value = inquiry.status;
      status.addEventListener("change", () => {
        const latest = readStored(storageKeys.inquiries, []);
        if (latest[index]) {
          latest[index].status = status.value;
          saveStored(storageKeys.inquiries, latest);
          renderDashboard();
        }
      });
      item.append(customer, dress, message, status);
      inquiryList.append(item);
    });
  }

  const inventory = document.querySelector("#inventory-list");
  inventory.replaceChildren();
  dresses.forEach(dress => {
    const row = document.createElement("div");
    row.className = "inventory-item";
    const image = document.createElement("img");
    image.src = `https://images.unsplash.com/${dress.image}?auto=format&fit=crop&w=100&q=60`;
    image.alt = "";
    image.loading = "lazy";
    const details = document.createElement("div");
    const name = document.createElement("strong");
    name.textContent = dress.name;
    const meta = document.createElement("small");
    meta.textContent = `${dress.category} · $${dress.price} / rental`;
    details.append(name, meta);
    const label = document.createElement("label");
    label.className = "availability-toggle";
    const toggle = document.createElement("input");
    toggle.type = "checkbox";
    toggle.checked = getAvailable(dress);
    toggle.setAttribute("aria-label", `Mark ${dress.name} available`);
    toggle.addEventListener("change", () => {
      availability[dress.id] = toggle.checked;
      saveStored(storageKeys.availability, availability);
      renderDashboard();
      renderDresses(document.querySelector(".category-chip.active")?.dataset.filter);
      renderDressOptions();
    });
    label.append(toggle, document.createTextNode(toggle.checked ? "Available" : "Unavailable"));
    row.append(image, details, label);
    inventory.append(row);
  });
}

document.querySelectorAll(".category-chip").forEach(button => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".category-chip").forEach(chip => {
      const active = chip === button;
      chip.classList.toggle("active", active);
      chip.setAttribute("aria-pressed", String(active));
    });
    renderDresses(button.dataset.filter);
  });
});

document.querySelector("#open-dashboard").addEventListener("click", () => {
  storeView.hidden = true;
  dashboardView.hidden = false;
  window.scrollTo(0, 0);
  renderDashboard();
});

document.querySelector("#back-to-store").addEventListener("click", () => {
  dashboardView.hidden = true;
  storeView.hidden = false;
  window.scrollTo(0, 0);
});

form.addEventListener("submit", event => {
  event.preventDefault();
  formMessage.classList.remove("error");
  const data = new FormData(form);
  const inquiries = readStored(storageKeys.inquiries, []);
  inquiries.unshift({
    name: String(data.get("name")).trim(),
    email: String(data.get("email")).trim(),
    dress: String(data.get("dress")),
    date: String(data.get("date")),
    message: String(data.get("message")).trim(),
    status: "New",
  });
  if (!saveStored(storageKeys.inquiries, inquiries)) {
    formMessage.textContent = "We couldn’t save this inquiry in your browser. Please try again.";
    formMessage.classList.add("error");
    return;
  }
  form.reset();
  formMessage.textContent = "Your inquiry is saved in this browser. This demo doesn’t send it to the shop.";
});

const today = new Date();
today.setMinutes(today.getMinutes() - today.getTimezoneOffset());
form.elements.date.min = today.toISOString().slice(0, 10);
document.querySelector("#year").textContent = new Date().getFullYear();
renderDresses();
renderDressOptions();
