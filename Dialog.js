const modalBox = document.getElementById("menuModal");
const menuModal = new bootstrap.Modal(modalBox);
const modalImage = document.getElementById("modalImage");
const qtyValue = document.getElementById("qtyValue");
const modalTotal = document.getElementById("modalTotal");
const minusBtn = document.getElementById("minusBtn");
const plusBtn = document.getElementById("plusBtn");
const noteInput = document.getElementById("noteInput");
const dineBtn = document.getElementById("dineBtn");
const takeBtn = document.getElementById("takeBtn");
const addBtn = document.getElementById("addBtn");

let selectedMenu = null;
let quantity = 1;
let serveType = "Di Tempat";

function updateQty() {
  qtyValue.textContent = quantity;
  modalTotal.textContent = formatRupiah(selectedMenu.price * quantity);
  if (quantity <= 1) {
    minusBtn.disabled = true;
  } else {
    minusBtn.disabled = false;
  }
}

function selectServe(type) {
  serveType = type;
  if (type === "Di Tempat") {
    dineBtn.classList.add("active");
    takeBtn.classList.remove("active");
  } else {
    takeBtn.classList.add("active");
    dineBtn.classList.remove("active");
  }
}

function openDialog(menu) {
  selectedMenu = menu;

  modalImage.src = menu.image;
  modalImage.alt = menu.name;
  document.getElementById("modalName").textContent = menu.name;
  document.getElementById("modalStore").textContent = menu.store + " | " + menu.category;
  document.getElementById("modalRating").textContent = menu.rating;
  document.getElementById("modalSold").textContent = menu.sold + " terjual";
  document.getElementById("modalTime").textContent = menu.time;

  quantity = 1;
  noteInput.value = "";
  selectServe("Di Tempat");
  updateQty();

  menuModal.show();
}

function addMenu() {
  const cart = getCart();
  const note = noteInput.value.trim();
  let found = false;

  for (let i = 0; i < cart.length; i++) {
    const sameMenu = cart[i].id === selectedMenu.id;
    const sameNote = cart[i].note === note;
    const sameServe = cart[i].serveType === serveType;
    if (sameMenu && sameNote && sameServe) {
      cart[i].quantity = cart[i].quantity + quantity;
      found = true;
    }
  }

  if (found === false) {
    cart.push({
      id: selectedMenu.id,
      name: selectedMenu.name,
      store: selectedMenu.store,
      price: selectedMenu.price,
      image: selectedMenu.image,
      quantity: quantity,
      note: note,
      serveType: serveType
    });
  }

  saveCart(cart);
  menuModal.hide();
}

minusBtn.addEventListener("click", function () {
  if (quantity > 1) {
    quantity = quantity - 1;
    updateQty();
  }
});

plusBtn.addEventListener("click", function () {
  quantity = quantity + 1;
  updateQty();
});

dineBtn.addEventListener("click", function () {
  selectServe("Di Tempat");
});

takeBtn.addEventListener("click", function () {
  selectServe("Bungkus");
});

addBtn.addEventListener("click", function () {
  addMenu();
});
