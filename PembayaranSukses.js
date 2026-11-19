function showSuccess() {
  const order = getOrder();

  if (order === null) {
    window.location.href = "index.html";
    return;
  }

  document.getElementById("successDate").textContent = formatDate(order.date) + ", pukul " + formatTime(order.date);
  document.getElementById("successTotal").textContent = formatRupiah(order.total);
  document.getElementById("successMethod").textContent = order.method;
  document.getElementById("ticketNumber").textContent = order.queueNumber;
  document.getElementById("orderId").textContent = "#" + order.id;
  document.getElementById("custName").textContent = order.customerName;
  document.getElementById("custPhone").textContent = order.customerPhone;
  document.getElementById("custEmail").textContent = order.customerEmail;
  document.getElementById("detailLink").href = "DetailPesanan.html?id=" + order.id;

  if (order.method === "Bayar di kasir") {
    document.getElementById("successTitle").textContent = "Pesanan berhasil dibuat";
    document.getElementById("successInfo").textContent = "Tunjukkan nomor pesanan ini ke kasir untuk menyelesaikan pembayaran.";
  }
}

showSuccess();
