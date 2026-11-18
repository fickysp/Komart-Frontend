const STORE_LIST = [
  { id: "KedaiNasiMadura", name: "Kedai Nasi Madura", desc: "Gurih, bumbu khas Nusa Madura", rating: "4,9 (2,1RB)", queue: 10, serving: 15, open: "08.00", close: "17.00" },
  { id: "TahuLontong", name: "Tahu Lontong Lemongan", desc: "Tahu lontong khas Lamongan", rating: "4,9 (312)", queue: 7, serving: 6, open: "08.00", close: "17.00" },
  { id: "WarungJakarta", name: "Warung Jakarta", desc: "Soto Betawi dan es teh legendaris", rating: "5,0 (1,5RB)", queue: 9, serving: 8, open: "07.00", close: "16.00" },
  { id: "DapurNusantara", name: "Dapur Nusantara", desc: "Nasi goreng dan mie rumahan", rating: "4,9 (980)", queue: 4, serving: 3, open: "09.00", close: "21.00" }
];

const MENU_LIST = [
  { id: "EsTehManis", name: "Es Teh Manis", store: "Warung Jakarta", category: "Drink", price: 8000, rating: "5,0 (1,5RB)", sold: "300", time: "5 - 10 menit" },
  { id: "SotoBetawi", name: "Soto Betawi", store: "Warung Jakarta", category: "Food", price: 15000, rating: "5,0 (1,5RB)", sold: "140", time: "25 - 30 menit" },
  { id: "EsJeruk", name: "Es Jeruk", store: "Warung Jakarta", category: "Drink", price: 10000, rating: "4,9 (860)", sold: "220", time: "5 - 10 menit" },
  { id: "NasiGoreng", name: "Nasi Goreng Kampung", store: "Dapur Nusantara", category: "Food", price: 32000, rating: "4,9 (980)", sold: "260", time: "20 - 25 menit" },
  { id: "MieTekTek", name: "Mie Tek-Tek", store: "Dapur Nusantara", category: "Food", price: 28000, rating: "4,8 (720)", sold: "190", time: "20 - 25 menit" },
  { id: "TehTarik", name: "Teh Tarik", store: "Dapur Nusantara", category: "Drink", price: 12000, rating: "4,7 (310)", sold: "120", time: "5 - 10 menit" },
  { id: "AyamGeprek", name: "Ayam Geprek", store: "Kedai Nasi Madura", category: "Food", price: 22000, rating: "4,8 (2,1RB)", sold: "410", time: "15 - 20 menit" },
  { id: "NasiBebek", name: "Nasi Bebek Madura", store: "Kedai Nasi Madura", category: "Food", price: 25000, rating: "4,9 (1,1RB)", sold: "290", time: "20 - 25 menit" },
  { id: "KopiSusu", name: "Kopi Susu", store: "Kedai Nasi Madura", category: "Drink", price: 15000, rating: "4,8 (1,2RB)", sold: "350", time: "5 - 10 menit" },
  { id: "TahuLontong", name: "Tahu Lontong", store: "Tahu Lontong Lemongan", category: "Food", price: 13000, rating: "4,9 (210)", sold: "150", time: "10 - 15 menit" },
  { id: "TahuCampur", name: "Tahu Campur", store: "Tahu Lontong Lemongan", category: "Food", price: 15000, rating: "4,8 (96)", sold: "80", time: "10 - 15 menit" },
  { id: "EsKelapa", name: "Es Kelapa Muda", store: "Tahu Lontong Lemongan", category: "Drink", price: 10000, rating: "4,8 (64)", sold: "70", time: "5 - 10 menit" }
];

const MINUTES_EACH = 3;

let storeMenus = [];

function findStore() {
  const params = new URLSearchParams(window.location.search);
  const storeId = params.get("store");

  for (let i = 0; i < STORE_LIST.length; i++) {
    if (STORE_LIST[i].id === storeId) {
      return STORE_LIST[i];
    }
  }
  return null;
}

function getMenus(storeName) {
  const result = [];
  for (let i = 0; i < MENU_LIST.length; i++) {
    const menu = MENU_LIST[i];
    if (menu.store === storeName) {
      menu.image = "images/" + menu.id + ".jpg";
      result.push(menu);
    }
  }
  return result;
}

function showStore(store) {
  document.title = store.name + " | Komart";
  document.getElementById("storeTitle").textContent = store.name;
  document.getElementById("storeImage").src = "images/Toko" + store.id + ".jpg";
  document.getElementById("storeImage").alt = store.name;
  document.getElementById("storeDesc").textContent = store.desc;
  document.getElementById("storeRating").textContent = store.rating;
  document.getElementById("storeHours").textContent = store.open + "-" + store.close;

  const storeStatus = document.getElementById("storeStatus");
  if (isOpen(store.open, store.close)) {
    storeStatus.textContent = "Buka";
    storeStatus.classList.remove("closed");
  } else {
    storeStatus.textContent = "Tutup";
    storeStatus.classList.add("closed");
  }
}

function showQueue(store) {
  document.getElementById("statQueue").textContent = store.queue;
  document.getElementById("statServing").textContent = servingText(store.serving);
  document.getElementById("statTime").textContent = "±" + (store.queue * MINUTES_EACH);

  const order = getOrder();
  if (order === null) {
    return;
  }

  const sameStore = order.storeName.includes(store.name);
  const stillWaiting = order.status === "Menunggu" || order.status === "Diproses";

  if (sameStore && stillWaiting) {
    const myQueue = document.getElementById("myQueue");
    document.getElementById("myNumber").textContent = queueText(order.queueNumber);
    myQueue.href = "DetailPesanan.html?id=" + order.id;
    myQueue.classList.remove("d-none");
  }
}

function menuCard(menu, index) {
  return `
    <div class="col-6 col-md-4 col-lg-3">
      <article class="menu-card" data-index="${index}">
        <img src="${menu.image}" alt="${menu.name}" class="menu-img">
        <h3 class="menu-name">${menu.name}</h3>
        <p class="menu-store">${menu.category} | ${menu.time}</p>
        <div class="menu-foot">
          <span class="rating">
            <span class="icon star">star</span>
            ${menu.rating} | ${menu.sold} terjual
          </span>
          <span class="menu-price">${formatRupiah(menu.price)}</span>
        </div>
      </article>
    </div>`;
}

function showMenus() {
  let html = "";
  for (let i = 0; i < storeMenus.length; i++) {
    html = html + menuCard(storeMenus[i], i);
  }
  document.getElementById("menuList").innerHTML = html;
  document.getElementById("menuCount").textContent = storeMenus.length + " menu";

  const cards = document.getElementsByClassName("menu-card");
  for (let i = 0; i < cards.length; i++) {
    const card = cards[i];
    card.addEventListener("click", function () {
      openDialog(storeMenus[Number(card.dataset.index)]);
    });
  }
}

function updateBar() {
  const cart = getCart();
  const cartBar = document.getElementById("cartBar");

  if (cart.length === 0) {
    cartBar.classList.add("d-none");
    return;
  }

  document.getElementById("barCount").textContent = cart.length + " menu di keranjang";
  document.getElementById("barTotal").textContent = formatRupiah(getSubtotal(cart));
  cartBar.classList.remove("d-none");
}

function showPage() {
  const store = findStore();

  if (store === null) {
    window.location.href = "AntreanToko.html";
    return;
  }

  storeMenus = getMenus(store.name);

  showStore(store);
  showQueue(store);
  showMenus();
  updateBar();
}

modalBox.addEventListener("hidden.bs.modal", function () {
  updateBar();
});

showPage();
