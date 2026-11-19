const emptyCart = document.getElementById("emptyCart");
const filledCart = document.getElementById("filledCart");
const cartList = document.getElementById("cartList");

function storePlace(storeName) {
  if (storeName === "Warung Jakarta") {
    return "Kemang";
  } else if (storeName === "Dapur Nusantara") {
    return "Tebet";
  } else if (storeName === "Kedai Nasi Madura") {
    return "Cikini";
  } else {
    return "Menteng";
  }
}

function itemHtml(item, index) {
  let noteHtml = "";
  if (item.note !== "") {
    noteHtml = `
      <p class="item-note">
        <span class="icon">sticky_note_2</span>
        ${item.note}
      </p>`;
  }

  return `
    <div class="cart-item">
      <img src="${item.image}" alt="${item.name}" class="item-img">
      <div class="item-info">
        <h3 class="item-name">${item.name}</h3>
        <p class="item-unit">${formatRupiah(item.price)} / porsi</p>
        <span class="serve-chip">${serveLabel(item.serveType)}</span>
      </div>
      <p class="item-total">${formatRupiah(item.price * item.quantity)}</p>
      <div class="item-bottom">${noteHtml}</div>
      <div class="qty-control item-qty">
        <button type="button" class="qty-btn cart-minus" data-index="${index}" aria-label="Kurangi">
          <span class="icon">remove</span>
        </button>
        <span class="qty-value">${item.quantity}</span>
        <button type="button" class="qty-btn qty-plus cart-plus" data-index="${index}" aria-label="Tambah">
          <span class="icon">add</span>
        </button>
      </div>
    </div>`;
}

function storeHtml(storeName, cart) {
  let itemsHtml = "";
  for (let i = 0; i < cart.length; i++) {
    if (cart[i].store === storeName) {
      itemsHtml = itemsHtml + itemHtml(cart[i], i);
    }
  }

  return `
    <section class="cart-card mb-3">
      <div class="store-head">
        <div class="store-icon">
          <span class="icon">storefront</span>
        </div>
        <div class="store-info">
          <h2 class="store-title">${storeName}</h2>
          <p class="store-meta">${storePlace(storeName)} | Ambil di restoran</p>
        </div>
        <a href="index.html" class="add-link">Tambah menu lain</a>
      </div>
      ${itemsHtml}
    </section>`;
}

function showSummary(cart) {
  let itemCount = 0;
  for (let i = 0; i < cart.length; i++) {
    itemCount = itemCount + cart[i].quantity;
  }

  const subtotal = getSubtotal(cart);

  document.getElementById("subtotalLabel").textContent = "Subtotal (" + itemCount + " item)";
  document.getElementById("subtotalValue").textContent = formatRupiah(subtotal);
  document.getElementById("feeValue").textContent = formatRupiah(SERVICE_FEE);
  document.getElementById("totalValue").textContent = formatRupiah(subtotal + SERVICE_FEE);
}

function changeQty(index, change) {
  const cart = getCart();
  cart[index].quantity = cart[index].quantity + change;

  if (cart[index].quantity <= 0) {
    cart.splice(index, 1);
  }

  saveCart(cart);
  showCart();
}

function addListeners() {
  const minusButtons = document.getElementsByClassName("cart-minus");
  const plusButtons = document.getElementsByClassName("cart-plus");

  for (let i = 0; i < minusButtons.length; i++) {
    const button = minusButtons[i];
    button.addEventListener("click", function () {
      changeQty(Number(button.dataset.index), -1);
    });
  }

  for (let i = 0; i < plusButtons.length; i++) {
    const button = plusButtons[i];
    button.addEventListener("click", function () {
      changeQty(Number(button.dataset.index), 1);
    });
  }
}

function showCart() {
  const cart = getCart();

  if (cart.length === 0) {
    emptyCart.classList.remove("d-none");
    filledCart.classList.add("d-none");
    return;
  }

  emptyCart.classList.add("d-none");
  filledCart.classList.remove("d-none");

  const stores = getStores(cart);
  let html = "";
  for (let i = 0; i < stores.length; i++) {
    html = html + storeHtml(stores[i], cart);
  }

  cartList.innerHTML = html;
  showSummary(cart);
  addListeners();
}

showCart();
