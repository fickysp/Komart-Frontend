const WAIT_SECONDS = 5;
const SCAN_LIMIT = 15;

function showDeadline() {
  const deadline = new Date();
  deadline.setMinutes(deadline.getMinutes() + SCAN_LIMIT);
  document.getElementById("deadline").textContent = "Pindai sebelum " + formatHour(deadline) + " WIB";
}

function showPayment() {
  const cart = getCart();
  const checkout = getCheckout();

  if (cart.length === 0 || checkout === null) {
    window.location.href = "Keranjang.html";
    return false;
  }

  const total = getSubtotal(cart) + SERVICE_FEE;

  document.getElementById("qrisStore").textContent = getStores(cart).join(", ");
  document.getElementById("qrisMethod").textContent = checkout.method;
  document.getElementById("qrisTotal").textContent = formatRupiah(total);
  showDeadline();

  return true;
}

function finishPayment() {
  completeOrder();
  window.location.href = "PembayaranSukses.html";
}

const isReady = showPayment();

if (isReady) {
  setTimeout(function () {
    finishPayment();
  }, WAIT_SECONDS * 1000);
}
