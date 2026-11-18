let currentOrder = null;

function findOrder() {
  const params = new URLSearchParams(window.location.search);
  const orderId = params.get("id");
  const history = getHistory();

  for (let i = 0; i < history.length; i++) {
    if (history[i].id === orderId) {
      return history[i];
    }
  }

  return getOrder();
}

function pickupText(status) {
  if (status === "Diproses") {
    return "Pesananmu sedang disiapkan";
  } else if (status === "Selesai") {
    return "Pesananmu sudah selesai, selamat menikmati";
  } else if (status === "Dibatalkan") {
    return "Pesanan ini sudah dibatalkan";
  } else {
    return "Pesananmu sedang menunggu giliran";
  }
}

function itemHtml(item) {
  let noteHtml = "";
  if (item.note !== "") {
    noteHtml = `
      <p class="item-note">
        <span class="icon">sticky_note_2</span>
        ${item.note}
      </p>`;
  }

  return `
    <div class="detail-item">
      <img src="${item.image}" alt="${item.name}" class="detail-img">
      <div class="detail-info">
        <h4 class="detail-name">${item.quantity}x ${item.name}</h4>
        <p class="detail-price">${formatRupiah(item.price)} / porsi, total ${formatRupiah(item.price * item.quantity)}</p>
        ${noteHtml}
      </div>
      <span class="serve-chip">${serveLabel(item.serveType)}</span>
    </div>`;
}

function showLeft(order) {
  let code = order.id;
  if (order.code) {
    code = order.code;
  }

  document.getElementById("orderCode").textContent = "#" + code;
  document.getElementById("orderDate").textContent = shortDate(order.date) + ", " + formatHour(order.date);

  const chip = document.getElementById("orderChip");
  const icon = document.getElementById("orderIcon");
  const text = document.getElementById("orderStatus");
  setStatus(chip, icon, text, order.status);

  document.getElementById("pickupStore").textContent = order.storeName;
  document.getElementById("pickupMsg").textContent = pickupText(order.status);
  document.getElementById("pickupNumber").textContent = order.queueNumber;

  const pickupServing = document.getElementById("pickupServing");
  if (order.status === "Selesai" || order.status === "Dibatalkan") {
    pickupServing.classList.add("d-none");
  } else {
    pickupServing.textContent = "Sedang dilayani " + servingText(order.servingNumber) + ", sekitar " + order.waitMinutes + " menit lagi";
  }
}

function showRight(order) {
  document.getElementById("detailMeta").textContent = order.storeName + " | Ambil di restoran";

  let itemsHtml = "";
  for (let i = 0; i < order.items.length; i++) {
    itemsHtml = itemsHtml + itemHtml(order.items[i]);
  }
  document.getElementById("itemList").innerHTML = itemsHtml;

  document.getElementById("detailSubtotal").textContent = formatRupiah(order.subtotal);
  document.getElementById("detailFee").textContent = formatRupiah(order.serviceFee);
  document.getElementById("detailTotal").textContent = formatRupiah(order.total);
  document.getElementById("detailName").textContent = order.customerName;
  document.getElementById("detailPhone").textContent = order.customerPhone;
  document.getElementById("detailEmail").textContent = order.customerEmail;

  const chip = document.getElementById("payChip");
  const icon = document.getElementById("payIcon");
  const text = document.getElementById("payText");
  setStatus(chip, icon, text, order.payStatus);
  text.textContent = order.method + " (" + order.payStatus + ")";
}

function orderAgain() {
  const cart = getCart();

  for (let i = 0; i < currentOrder.items.length; i++) {
    const item = currentOrder.items[i];
    cart.push({
      id: item.id,
      name: item.name,
      store: item.store,
      price: item.price,
      image: item.image,
      quantity: item.quantity,
      note: item.note,
      serveType: item.serveType
    });
  }

  saveCart(cart);
  window.location.href = "Keranjang.html";
}

function showDetail() {
  currentOrder = findOrder();

  if (currentOrder === null) {
    window.location.href = "Riwayat.html";
    return;
  }

  showLeft(currentOrder);
  showRight(currentOrder);
}

document.getElementById("reorderBtn").addEventListener("click", function () {
  orderAgain();
});

showDetail();
