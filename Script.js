const CART_KEY = "komartCart";
const ORDER_KEY = "komartOrder";
const CHECKOUT_KEY = "komartCheckout";
const HISTORY_KEY = "komartHistory";
const ADMIN_DB_KEY = "komart_db";
const SERVICE_FEE = 3000;
const MONTHS = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
const MONTHS_SHORT = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];

function getCart() {
  const saved = localStorage.getItem(CART_KEY);
  if (saved === null) {
    return [];
  }
  return JSON.parse(saved);
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  updateBadge();
}

function updateBadge() {
  const badges = document.getElementsByClassName("cart-badge");
  const count = getCart().length;
  for (let i = 0; i < badges.length; i++) {
    badges[i].textContent = count;
    if (count > 0) {
      badges[i].classList.remove("d-none");
    } else {
      badges[i].classList.add("d-none");
    }
  }
}

function getStores(cart) {
  const stores = [];
  for (let i = 0; i < cart.length; i++) {
    if (stores.includes(cart[i].store) === false) {
      stores.push(cart[i].store);
    }
  }
  return stores;
}

function getSubtotal(cart) {
  let subtotal = 0;
  for (let i = 0; i < cart.length; i++) {
    subtotal = subtotal + cart[i].price * cart[i].quantity;
  }
  return subtotal;
}

function formatRupiah(number) {
  return "Rp" + number.toLocaleString("id-ID");
}

function getCheckout() {
  const saved = localStorage.getItem(CHECKOUT_KEY);
  if (saved === null) {
    return null;
  }
  return JSON.parse(saved);
}

function saveCheckout(checkout) {
  localStorage.setItem(CHECKOUT_KEY, JSON.stringify(checkout));
}

function getOrder() {
  const saved = localStorage.getItem(ORDER_KEY);
  if (saved === null) {
    return null;
  }
  return JSON.parse(saved);
}

function saveOrder(order) {
  localStorage.setItem(ORDER_KEY, JSON.stringify(order));
}

function getHistory() {
  const saved = localStorage.getItem(HISTORY_KEY);
  if (saved === null) {
    return [];
  }
  return JSON.parse(saved);
}

function padNumber(number) {
  if (number < 10) {
    return "0" + number;
  }
  return "" + number;
}

function formatDate(isoText) {
  const date = new Date(isoText);
  return date.getDate() + " " + MONTHS[date.getMonth()] + " " + date.getFullYear();
}

function shortDate(isoText) {
  const date = new Date(isoText);
  return date.getDate() + " " + MONTHS_SHORT[date.getMonth()] + " " + date.getFullYear();
}

function monthYear(isoText) {
  const date = new Date(isoText);
  return MONTHS[date.getMonth()] + " " + date.getFullYear();
}

function formatHour(isoText) {
  const date = new Date(isoText);
  return padNumber(date.getHours()) + "." + padNumber(date.getMinutes());
}

function formatTime(isoText) {
  const date = new Date(isoText);
  return formatHour(isoText) + "." + padNumber(date.getSeconds());
}

function makeId(date) {
  const year = date.getFullYear();
  const month = padNumber(date.getMonth() + 1);
  const day = padNumber(date.getDate());
  const hour = padNumber(date.getHours());
  const minute = padNumber(date.getMinutes());
  const second = padNumber(date.getSeconds());
  return "wj1590" + year + month + day + hour + minute + second;
}

function pushOrderToAdminDB(order) {
  const rawDb = localStorage.getItem(ADMIN_DB_KEY);
  const db = rawDb ? JSON.parse(rawDb) : null;

  const d = new Date(order.date);
  const timeStr = padNumber(d.getHours()) + ":" + padNumber(d.getMinutes());
  const notes = order.items.map(i => i.note).filter(n => n && n.trim() !== "").join("; ");

  const adminOrder = {
    id: order.id,
    no: queueText(order.queueNumber),
    customer: order.customerName,
    phone: order.customerPhone + " • Online",
    time: timeStr,
    readyTime: "",
    status: "Menunggu",
    payMethod: order.method === "Bayar di kasir" ? "Tunai" : order.method,
    payStatus: order.method === "Bayar di kasir" ? "Belum dibayar" : "Lunas",
    trxId: "TRX-" + order.id,
    note: notes || "Tidak ada catatan khusus.",
    items: order.items.map(i => ({
      name: i.name,
      desc: i.note ? ("Catatan: " + i.note + " (" + serveLabel(i.serveType) + ")") : serveLabel(i.serveType),
      cat: "Menu",
      qty: i.quantity,
      price: i.price,
      img: i.image
    }))
  };

  if (db) {
    const alreadyExists = db.orders.some(o => o.id === order.id);
    if (!alreadyExists) {
      db.orders.push(adminOrder);
      localStorage.setItem(ADMIN_DB_KEY, JSON.stringify(db));
    }
  } else {
    const pendingRaw = localStorage.getItem("komart_pending_orders");
    const pending = pendingRaw ? JSON.parse(pendingRaw) : [];
    pending.push(adminOrder);
    localStorage.setItem("komart_pending_orders", JSON.stringify(pending));
  }
}

function completeOrder() {
  const cart = getCart();
  const checkout = getCheckout();
  const history = getHistory();
  const now = new Date();
  const subtotal = getSubtotal(cart);
  const queueNumber = 14 + history.length;

  let payStatus = "Lunas";
  if (checkout.method === "Bayar di kasir") {
    payStatus = "Menunggu";
  }

  const order = {
    id: makeId(now),
    code: "Ordr" + (101 + history.length),
    date: now.toISOString(),
    storeName: getStores(cart).join(", "),
    items: cart,
    subtotal: subtotal,
    serviceFee: SERVICE_FEE,
    total: subtotal + SERVICE_FEE,
    customerName: checkout.name,
    customerPhone: checkout.phone,
    customerEmail: checkout.email,
    method: checkout.method,
    payStatus: payStatus,
    queueNumber: queueNumber,
    servingNumber: queueNumber - 1,
    waitMinutes: 10,
    status: "Menunggu"
  };

  history.unshift(order);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  saveOrder(order);
  pushOrderToAdminDB(order);
  saveCart([]);

  return order;
}

function queueText(number) {
  if (number < 10) {
    return "A-0" + number;
  }
  return "A-" + number;
}

function servingText(number) {
  if (number < 10) {
    return "A-0" + number;
  }
  return "A-" + number;
}

function serveLabel(serveType) {
  if (serveType === "Di Tempat") {
    return "Di tempat";
  }
  return "Bungkus";
}

function statusClass(status) {
  if (status === "Diproses" || status === "Siap diambil") {
    return "process";
  } else if (status === "Selesai") {
    return "done";
  } else if (status === "Lunas") {
    return "paid";
  } else if (status === "Dibatalkan") {
    return "cancel";
  } else {
    return "waiting";
  }
}

function statusIcon(status) {
  if (status === "Diproses" || status === "Siap diambil") {
    return "skillet";
  } else if (status === "Selesai" || status === "Lunas") {
    return "check_circle";
  } else if (status === "Dibatalkan") {
    return "cancel";
  } else {
    return "schedule";
  }
}

function setStatus(chip, icon, text, status) {
  chip.className = "status " + statusClass(status);
  icon.textContent = statusIcon(status);
  text.textContent = status;
}

function toMinutes(timeText) {
  const parts = timeText.split(".");
  return Number(parts[0]) * 60 + Number(parts[1]);
}

function isOpen(openTime, closeTime) {
  const now = new Date();
  const nowMinutes = now.getHours() * 60 + now.getMinutes();
  if (nowMinutes >= toMinutes(openTime) && nowMinutes < toMinutes(closeTime)) {
    return true;
  }
  return false;
}

function goBack() {
  if (document.referrer !== "" && window.history.length > 1) {
    window.history.back();
  } else {
    window.location.href = "index.html";
  }
}

document.addEventListener("DOMContentLoaded", function () {
  updateBadge();

  const backBtn = document.getElementById("backBtn");
  if (backBtn !== null) {
    backBtn.addEventListener("click", function () {
      goBack();
    });
  }
});