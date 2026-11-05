const PRODUCTS = [
  { id: "tenda-dome", name: "Tenda Dome 2 Orang", category: "Tenda", description: "Tenda praktis untuk perjalanan berdua.", price: 45000, stock: 5, icon: "⛺", bg: "#e8eddf" },
  { id: "tenda-family", name: "Tenda Family 4 Orang", category: "Tenda", description: "Ruang lebih luas untuk camping bersama.", price: 75000, stock: 3, icon: "🏕️", bg: "#e9eee5" },
  { id: "sleeping-bag", name: "Sleeping Bag", category: "Tidur", description: "Menjaga tubuh tetap hangat saat malam.", price: 15000, stock: 12, icon: "🛌", bg: "#f0eade" },
  { id: "matras", name: "Matras Camping", category: "Tidur", description: "Alas tidur ringan dan mudah dibawa.", price: 10000, stock: 10, icon: "🧘", bg: "#e8edf0" },
  { id: "carrier", name: "Carrier Carrier 45L", category: "Aksesori", description: "Tas gunung untuk membawa perlengkapan.", price: 35000, stock: 6, icon: "🎒", bg: "#e9e9df" },
  { id: "kompor", name: "Kompor Portable", category: "Masak", description: "Kompor ringkas untuk memasak di alam.", price: 25000, stock: 8, icon: "🍳", bg: "#f2e9dc" },
  { id: "lampu", name: "Lampu Camping LED", category: "Aksesori", description: "Penerangan praktis untuk area tenda.", price: 12000, stock: 9, icon: "🔦", bg: "#f3efdc" },
  { id: "kursi", name: "Kursi Lipat Outdoor", category: "Aksesori", description: "Kursi santai yang ringan dan portabel.", price: 18000, stock: 7, icon: "🪑", bg: "#e8eee8" }
];

const STORAGE_KEY = "rimbacamp-bookings-v1";
const STATUS_OPTIONS = ["Menunggu", "Disetujui", "Selesai", "Dibatalkan"];
let selectedProduct = null;
let toastTimer = null;

const $ = (selector) => document.querySelector(selector);
const rupiah = (value) => new Intl.NumberFormat("id-ID", {
  style: "currency", currency: "IDR", maximumFractionDigits: 0
}).format(value);

function getBookings() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    return Array.isArray(saved) ? saved : [];
  } catch (error) {
    console.warn("Data pesanan tidak dapat dibaca:", error);
    return [];
  }
}

function saveBookings(bookings) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(bookings));
}

function formatDate(dateString) {
  if (!dateString) return "-";
  return new Date(`${dateString}T00:00:00`).toLocaleDateString("id-ID", {
    day: "2-digit", month: "short", year: "numeric"
  });
}

function countRentalDays(start, end) {
  const startDate = new Date(`${start}T00:00:00`);
  const endDate = new Date(`${end}T00:00:00`);
  return Math.max(1, Math.round((endDate - startDate) / 86400000));
}

function datesOverlap(startA, endA, startB, endB) {
  // Tanggal selesai dianggap sebagai hari pengembalian (tidak dihitung sebagai hari sewa).
  return new Date(`${startA}T00:00:00`) < new Date(`${endB}T00:00:00`) &&
    new Date(`${endA}T00:00:00`) > new Date(`${startB}T00:00:00`);
}

function availableStock(product, start, end) {
  if (!start || !end || new Date(`${end}T00:00:00`) <= new Date(`${start}T00:00:00`)) {
    return product.stock;
  }
  const used = getBookings()
    .filter((booking) => booking.productId === product.id && booking.status !== "Dibatalkan")
    .filter((booking) => datesOverlap(start, end, booking.startDate, booking.endDate))
    .reduce((sum, booking) => sum + Number(booking.quantity || 0), 0);
  return Math.max(0, product.stock - used);
}

function renderProducts() {
  const query = $("#searchInput").value.trim().toLowerCase();
  const category = $("#categoryFilter").value;
  const sort = $("#sortFilter").value;

  let filtered = PRODUCTS.filter((product) => {
    const matchesQuery = `${product.name} ${product.category} ${product.description}`.toLowerCase().includes(query);
    const matchesCategory = category === "Semua" || product.category === category;
    return matchesQuery && matchesCategory;
  });

  if (sort === "low") filtered.sort((a, b) => a.price - b.price);
  if (sort === "high") filtered.sort((a, b) => b.price - a.price);

  const grid = $("#productGrid");
  if (!filtered.length) {
    grid.innerHTML = `<div class="no-results">Perlengkapan tidak ditemukan. Coba kata kunci atau kategori lain.</div>`;
    return;
  }

  grid.innerHTML = filtered.map((product) => {
    const available = availableStock(product, "", "");
    return `
      <article class="product-card">
        <div class="product-visual" style="--product-bg:${product.bg}">
          <span class="product-category">${product.category}</span>
          <span class="product-emoji" aria-hidden="true">${product.icon}</span>
          <span class="stock-label">${available} unit tersedia (demo)</span>
        </div>
        <div class="product-content">
          <h3>${product.name}</h3>
          <p class="product-description">${product.description}</p>
          <div class="product-bottom">
            <div class="product-price">${rupiah(product.price)}<small>/ hari</small></div>
            <button type="button" data-book="${product.id}" ${available < 1 ? "disabled" : ""}>
              ${available < 1 ? "Stok habis" : "Sewa sekarang"}
            </button>
          </div>
        </div>
      </article>`;
  }).join("");
}

function showToast(message) {
  const toast = $("#toast");
  toast.textContent = message;
  toast.classList.add("show");
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => toast.classList.remove("show"), 3200);
}

function todayString() {
  const now = new Date();
  const local = new Date(now.getTime() - now.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 10);
}

function openBooking(productId) {
  selectedProduct = PRODUCTS.find((product) => product.id === productId);
  if (!selectedProduct) return;

  $("#bookingProductId").value = selectedProduct.id;
  $("#selectedProduct").innerHTML = `
    <span class="selected-product-icon" aria-hidden="true">${selectedProduct.icon}</span>
    <span><strong>${selectedProduct.name}</strong><small>${rupiah(selectedProduct.price)} / hari · Stok awal ${selectedProduct.stock} unit</small></span>
  `;

  const today = todayString();
  const tomorrow = new Date(`${today}T00:00:00`);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowString = `${tomorrow.getFullYear()}-${String(tomorrow.getMonth() + 1).padStart(2, "0")}-${String(tomorrow.getDate()).padStart(2, "0")}`;

  $("#startDate").min = today;
  $("#startDate").value = today;
  $("#endDate").min = tomorrowString;
  $("#endDate").value = tomorrowString;
  $("#bookingQuantity").max = selectedProduct.stock;
  $("#bookingQuantity").value = 1;
  $("#customerName").value = "";
  $("#customerPhone").value = "";
  updateBookingEstimate();

  $("#bookingDialog").showModal();
  document.body.classList.add("dialog-open");
}

function updateBookingEstimate() {
  if (!selectedProduct) return;
  const start = $("#startDate").value;
  const end = $("#endDate").value;
  const quantity = Math.max(1, Number($("#bookingQuantity").value) || 1);
  const message = $("#availabilityMessage");
  const total = $("#bookingTotal");

  if (!start || !end || new Date(`${end}T00:00:00`) <= new Date(`${start}T00:00:00`)) {
    message.textContent = "Tanggal selesai harus setelah tanggal mulai.";
    message.className = "availability-message is-error";
    total.textContent = rupiah(0);
    return;
  }

  const days = countRentalDays(start, end);
  const available = availableStock(selectedProduct, start, end);
  total.textContent = rupiah(selectedProduct.price * days * quantity);

  if (available < 1) {
    message.textContent = "Maaf, perlengkapan tidak tersedia pada rentang tanggal tersebut.";
    message.className = "availability-message is-error";
  } else if (quantity > available) {
    message.textContent = `Tersedia ${available} unit untuk tanggal yang dipilih. Kurangi jumlah alat.`;
    message.className = "availability-message is-error";
  } else {
    message.textContent = `Tersedia ${available} unit. Durasi sewa ${days} hari.`;
    message.className = "availability-message is-success";
  }
}

function closeBooking() {
  $("#bookingDialog").close();
  document.body.classList.remove("dialog-open");
  selectedProduct = null;
}

function createBooking(event) {
  event.preventDefault();
  if (!selectedProduct) return;

  const name = $("#customerName").value.trim();
  const phone = $("#customerPhone").value.trim();
  const startDate = $("#startDate").value;
  const endDate = $("#endDate").value;
  const quantity = Number($("#bookingQuantity").value);

  if (!name || !phone || !startDate || !endDate || !Number.isInteger(quantity) || quantity < 1) {
    showToast("Periksa kembali data pemesanan.");
    return;
  }
  if (new Date(`${endDate}T00:00:00`) <= new Date(`${startDate}T00:00:00`)) {
    showToast("Tanggal selesai harus setelah tanggal mulai.");
    return;
  }

  const available = availableStock(selectedProduct, startDate, endDate);
  if (quantity > available) {
    updateBookingEstimate();
    showToast("Stok tidak mencukupi untuk tanggal tersebut.");
    return;
  }

  const days = countRentalDays(startDate, endDate);
  const order = {
    id: `RC${Date.now().toString().slice(-8)}`,
    createdAt: new Date().toISOString(),
    productId: selectedProduct.id,
    productName: selectedProduct.name,
    customerName: name,
    phone,
    startDate,
    endDate,
    quantity,
    days,
    total: selectedProduct.price * days * quantity,
    status: "Menunggu"
  };

  const bookings = getBookings();
  bookings.unshift(order);
  saveBookings(bookings);
  closeBooking();
  renderAll();
  showToast(`Pesanan ${order.id} berhasil dibuat. Status: Menunggu.`);
  $("#pesanan").scrollIntoView({ behavior: "smooth" });
  $("#historySearch").value = phone;
  renderHistory(phone);
}

function statusClass(status) {
  if (status === "Disetujui") return "status-approved";
  if (status === "Selesai") return "status-completed";
  if (status === "Dibatalkan") return "status-cancelled";
  return "";
}

function renderHistory(phoneFilter = $("#historySearch").value.trim()) {
  const bookings = getBookings();
  const filtered = phoneFilter
    ? bookings.filter((booking) => booking.phone.includes(phoneFilter))
    : bookings;
  const body = $("#historyTableBody");

  if (!filtered.length) {
    body.innerHTML = `<tr><td colspan="6" class="empty-cell">${bookings.length ? "Pesanan dengan nomor tersebut tidak ditemukan." : "Belum ada pesanan. Silakan pilih perlengkapan terlebih dahulu."}</td></tr>`;
    return;
  }

  body.innerHTML = filtered.map((booking) => `
    <tr>
      <td><strong>${booking.id}</strong></td>
      <td>${escapeHTML(booking.customerName)}</td>
      <td>${escapeHTML(booking.productName)} × ${booking.quantity}</td>
      <td>${formatDate(booking.startDate)} – ${formatDate(booking.endDate)}</td>
      <td><strong>${rupiah(booking.total)}</strong></td>
      <td><span class="status-pill ${statusClass(booking.status)}">${booking.status}</span></td>
    </tr>`).join("");
}

function renderAdmin() {
  const bookings = getBookings();
  const notCancelled = bookings.filter((booking) => booking.status !== "Dibatalkan");
  $("#totalOrders").textContent = bookings.length;
  $("#pendingOrders").textContent = bookings.filter((booking) => booking.status === "Menunggu").length;
  $("#approvedOrders").textContent = bookings.filter((booking) => booking.status === "Disetujui").length;
  $("#totalRevenue").textContent = rupiah(notCancelled.reduce((sum, booking) => sum + Number(booking.total || 0), 0));

  const body = $("#adminTableBody");
  if (!bookings.length) {
    body.innerHTML = `<tr><td colspan="6" class="empty-cell">Belum ada data pesanan untuk ditampilkan.</td></tr>`;
    return;
  }

  body.innerHTML = bookings.map((booking) => `
    <tr>
      <td><strong>${booking.id}</strong></td>
      <td>${escapeHTML(booking.customerName)}</td>
      <td>${escapeHTML(booking.productName)} × ${booking.quantity}</td>
      <td>${escapeHTML(booking.phone)}</td>
      <td><strong>${rupiah(booking.total)}</strong></td>
      <td>
        <label class="sr-only" for="status-${booking.id}">Status pesanan ${booking.id}</label>
        <select class="status-select" id="status-${booking.id}" data-status="${booking.id}">
          ${STATUS_OPTIONS.map((status) => `<option value="${status}" ${booking.status === status ? "selected" : ""}>${status}</option>`).join("")}
        </select>
      </td>
    </tr>`).join("");
}

function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;"
  })[character]);
}

function renderAll() {
  renderProducts();
  renderHistory();
  renderAdmin();
}

function setupEvents() {
  $("#searchInput").addEventListener("input", renderProducts);
  $("#categoryFilter").addEventListener("change", renderProducts);
  $("#sortFilter").addEventListener("change", renderProducts);

  $("#productGrid").addEventListener("click", (event) => {
    const button = event.target.closest("[data-book]");
    if (button && !button.disabled) openBooking(button.dataset.book);
  });

  ["startDate", "endDate", "bookingQuantity"].forEach((id) => {
    $(`#${id}`).addEventListener("input", updateBookingEstimate);
    $(`#${id}`).addEventListener("change", updateBookingEstimate);
  });

  $("#bookingForm").addEventListener("submit", createBooking);
  $("#closeDialog").addEventListener("click", closeBooking);
  $("#bookingDialog").addEventListener("click", (event) => {
    if (event.target === $("#bookingDialog")) closeBooking();
  });

  $("#historySearch").addEventListener("input", () => renderHistory());
  $("#showAllOrders").addEventListener("click", () => {
    $("#historySearch").value = "";
    renderHistory("");
  });

  $("#adminTableBody").addEventListener("change", (event) => {
    const select = event.target.closest("[data-status]");
    if (!select) return;
    const bookings = getBookings();
    const order = bookings.find((booking) => booking.id === select.dataset.status);
    if (!order) return;
    order.status = select.value;
    saveBookings(bookings);
    renderAll();
    showToast(`Status pesanan ${order.id} diperbarui menjadi ${order.status}.`);
  });

  $("#menuToggle").addEventListener("click", () => {
    const nav = $("#mainNav");
    const isOpen = nav.classList.toggle("is-open");
    $("#menuToggle").setAttribute("aria-expanded", String(isOpen));
  });

  $("#mainNav").addEventListener("click", (event) => {
    if (event.target.closest("a")) {
      $("#mainNav").classList.remove("is-open");
      $("#menuToggle").setAttribute("aria-expanded", "false");
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  $("#currentYear").textContent = new Date().getFullYear();
  setupEvents();
  renderAll();
});
