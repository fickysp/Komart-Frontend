const nameInput = document.getElementById("nameInput");
const phoneInput = document.getElementById("phoneInput");
const emailInput = document.getElementById("emailInput");
const payRadios = document.getElementsByClassName("pay-radio");
const payInfo = document.getElementById("payInfo");
const payBtn = document.getElementById("payBtn");

let selectedMethod = "";

function fillCustomer() {
  const checkout = getCheckout();

  if (checkout === null) {
    nameInput.value = "Muhammad Ficky Al Wafi";
    phoneInput.value = "089021xxxxxxx";
    emailInput.value = "komart@email.com";
  } else {
    nameInput.value = checkout.name;
    phoneInput.value = checkout.phone;
    emailInput.value = checkout.email;
  }
}

function storeBox(storeName, cart) {
  let linesHtml = "";
  for (let i = 0; i < cart.length; i++) {
    const item = cart[i];
    if (item.store === storeName) {
      linesHtml = linesHtml + `
        <div class="order-line">
          <span>${item.quantity}x ${item.name}</span>
          <span class="line-price">${formatRupiah(item.price * item.quantity)}</span>
        </div>`;
    }
  }

  return `
    <div class="order-box mb-3">
      <h3 class="order-store">${storeName}</h3>
      ${linesHtml}
    </div>`;
}

function showSummary() {
  const cart = getCart();

  if (cart.length === 0) {
    window.location.href = "Keranjang.html";
    return;
  }

  const stores = getStores(cart);
  let html = "";
  for (let i = 0; i < stores.length; i++) {
    html = html + storeBox(stores[i], cart);
  }
  document.getElementById("orderList").innerHTML = html;

  const subtotal = getSubtotal(cart);
  document.getElementById("subtotalValue").textContent = formatRupiah(subtotal);
  document.getElementById("feeValue").textContent = formatRupiah(SERVICE_FEE);
  document.getElementById("totalValue").textContent = formatRupiah(subtotal + SERVICE_FEE);
}

function methodInfo(method) {
  if (method === "QRIS") {
    return "Kode QRIS akan ditampilkan setelah anda menekan Lanjutkan pembayaran";
  } else if (method === "Dompet digital") {
    return "Kode pembayaran untuk dompet digital akan ditampilkan setelah anda menekan Lanjutkan pembayaran";
  } else {
    return "Tunjukkan nomor pesanan ke kasir lalu selesaikan pembayaran di sana";
  }
}

function selectMethod(radio) {
  selectedMethod = radio.value;

  for (let i = 0; i < payRadios.length; i++) {
    const option = payRadios[i].parentElement;
    if (payRadios[i] === radio) {
      option.classList.add("selected");
    } else {
      option.classList.remove("selected");
    }
  }

  payInfo.textContent = methodInfo(selectedMethod);
  payBtn.disabled = false;
}

function checkInput(input, isValid) {
  if (isValid) {
    input.classList.remove("is-invalid");
  } else {
    input.classList.add("is-invalid");
  }
}

function isValid() {
  const nameFilled = nameInput.value.trim() !== "";
  const phoneFilled = phoneInput.value.trim() !== "";
  const emailCorrect = emailInput.value.includes("@") && emailInput.value.includes(".");

  checkInput(nameInput, nameFilled);
  checkInput(phoneInput, phoneFilled);
  checkInput(emailInput, emailCorrect);

  if (nameFilled && phoneFilled && emailCorrect) {
    return true;
  }
  return false;
}

function continuePay() {
  if (isValid() === false) {
    return;
  }

  saveCheckout({
    name: nameInput.value.trim(),
    phone: phoneInput.value.trim(),
    email: emailInput.value.trim(),
    method: selectedMethod
  });

  if (selectedMethod === "Bayar di kasir") {
    completeOrder();
    window.location.href = "PembayaranSukses.html";
  } else {
    window.location.href = "PembayaranQris.html";
  }
}

for (let i = 0; i < payRadios.length; i++) {
  const radio = payRadios[i];
  radio.addEventListener("change", function () {
    selectMethod(radio);
  });
}

nameInput.addEventListener("input", function () {
  nameInput.classList.remove("is-invalid");
});

phoneInput.addEventListener("input", function () {
  phoneInput.classList.remove("is-invalid");
});

emailInput.addEventListener("input", function () {
  emailInput.classList.remove("is-invalid");
});

payBtn.addEventListener("click", function () {
  continuePay();
});

fillCustomer();
showSummary();
