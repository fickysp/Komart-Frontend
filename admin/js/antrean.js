let activeFilter = "all";
let activeHandoverOrderNo = null;
let activeCancelOrderNo = null;

function mapOrderForQueue(o) {
  const itemsText = o.items.map(i => `${i.qty}× ${i.name}`).join(", ");
  const totalQty = o.items.reduce((s, i) => s + i.qty, 0);
  const sub = o.items.reduce((s, i) => s + i.qty * i.price, 0);
  return {
    ...o,
    itemsText,
    summaryMenu: `${o.items.length} menu / ${totalQty} item`,
    total: sub + 3000
  };
}

function setQueueFilter(status) {
  activeFilter = status;
  document.querySelectorAll(".q-tab").forEach(btn => {
    btn.className = btn.dataset.filter === status
      ? "q-tab px-3.5 py-2 rounded-xl text-xs font-bold bg-blue-100 text-primary transition-colors shrink-0 cursor-pointer"
      : "q-tab px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-100 text-slate-600 hover:bg-slate-200/70 transition-colors shrink-0 cursor-pointer";
  });
  renderQueuePage();
}

function renderQueuePage() {
  const db = getDB();
  const queueOrders = db.orders.map(mapOrderForQueue);
  const completedToday = db.completedTodayCount || 36;

  const readyOrders = queueOrders.filter(o => o.status === "Siap diambil");
  const processingOrders = queueOrders.filter(o => o.status === "Diproses");
  const waitingOrders = queueOrders.filter(o => o.status === "Menunggu");

  document.getElementById("queue-stats-grid").innerHTML = `
    <div class="bg-white p-5 rounded-2xl border border-border/80 shadow-2xs">
      <span class="text-xs font-medium text-slate-500">Siap diambil</span>
      <div class="text-3xl font-extrabold text-primary mt-2 mb-1">${readyOrders.length}</div>
      <div class="text-xs text-slate-400">Menunggu pengambilan pelanggan</div>
    </div>
    <div class="bg-white p-5 rounded-2xl border border-border/80 shadow-2xs">
      <span class="text-xs font-medium text-slate-500">Sedang diproses</span>
      <div class="text-3xl font-extrabold text-slate-900 mt-2 mb-1">${processingOrders.length}</div>
      <div class="text-xs font-medium text-emerald-600">Sedang dimasak dapur</div>
    </div>
    <div class="bg-white p-5 rounded-2xl border border-border/80 shadow-2xs">
      <span class="text-xs font-medium text-slate-500">Menunggu antrean</span>
      <div class="text-3xl font-extrabold text-slate-900 mt-2 mb-1">${waitingOrders.length}</div>
      <div class="text-xs font-medium text-amber-600">Belum masuk dapur</div>
    </div>
    <div class="bg-white p-5 rounded-2xl border border-border/80 shadow-2xs">
      <span class="text-xs font-medium text-slate-500">Selesai hari ini</span>
      <div class="text-3xl font-extrabold text-slate-900 mt-2 mb-1">${completedToday}</div>
      <div class="text-xs text-slate-400">Sudah diserahterimakan</div>
    </div>
  `;

  const readySection = document.getElementById("ready-pickup-section");
  if (readyOrders.length > 0) {
    readySection.innerHTML = `
      <div class="flex items-center justify-between">
        <span class="text-xs font-extrabold text-primary uppercase tracking-wider">Siap Diambil (${readyOrders.length}) • Wajib Verifikasi Nomor</span>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        ${readyOrders.map(ord => `
          <div class="bg-blue-100/75 border border-blue-200/80 rounded-2xl p-4 sm:p-5 flex items-center justify-between gap-4 shadow-2xs">
            <div>
              <span class="text-[11px] font-extrabold text-primary block">Siap diambil • ${ord.readyTime || "Baru saja"}</span>
              <div class="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight my-0.5">${ord.no} • ${ord.customer}</div>
              <div class="text-xs text-slate-600">${ord.summaryMenu} • ${ord.payMethod} (${ord.payStatus})</div>
            </div>
            <button onclick="openHandoverModal('${ord.no}')" class="px-4 py-2.5 bg-primary hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-sm transition-colors cursor-pointer shrink-0">
              Serah terima
            </button>
          </div>
        `).join("")}
      </div>
    `;
  } else {
    readySection.innerHTML = "";
  }

  const filtered = activeFilter === "all"
    ? queueOrders
    : queueOrders.filter(o => o.status === activeFilter);

  document.getElementById("mobile-queue-list").innerHTML = filtered.map(ord => {
    const badge = getStatusBadge(ord.status);
    const primaryBtn = getActionButtonHtml(ord, true);

    return `
      <div class="p-4 space-y-3">
        <div class="flex items-start justify-between gap-2">
          <div>
            <div class="flex items-center gap-2">
              <span class="font-extrabold text-base text-primary">${ord.no}</span>
              <span class="font-bold text-sm text-slate-900">• ${ord.customer}</span>
            </div>
            <p class="text-xs text-slate-500 mt-1">${ord.itemsText}</p>
            <div class="text-[11px] text-slate-400 mt-1">Masuk ${ord.time} • ${ord.payMethod} (${ord.payStatus})</div>
          </div>
          ${badge}
        </div>

        <div class="flex items-center gap-2 pt-1">
          ${primaryBtn}
          <button onclick="openCancelModal('${ord.no}')" class="px-3.5 py-2.5 bg-white hover:bg-rose-50 text-rose-700 border border-border rounded-xl text-xs font-bold transition-colors cursor-pointer">
            Batalkan
          </button>
        </div>
      </div>
    `;
  }).join("");

  document.getElementById("desktop-queue-table").innerHTML = filtered.map(ord => {
    const badge = getStatusBadge(ord.status);
    const primaryBtn = getActionButtonHtml(ord, false);

    return `
      <tr class="hover:bg-slate-50/50 transition-colors">
        <td class="py-4 px-6 font-extrabold text-primary">${ord.no}</td>
        <td class="py-4 px-6">
          <div class="font-bold text-slate-900">${ord.customer}</div>
          <div class="text-xs text-slate-400">Masuk ${ord.time} WIB</div>
        </td>
        <td class="py-4 px-6 text-xs text-slate-600 max-w-xs">${ord.itemsText}</td>
        <td class="py-4 px-6">
          <div class="font-bold text-slate-900">${formatRp(ord.total)}</div>
          <div class="text-[11px] text-slate-400">${ord.payMethod} • ${ord.payStatus}</div>
        </td>
        <td class="py-4 px-6">${badge}</td>
        <td class="py-4 px-6 text-right">
          <div class="inline-flex items-center gap-2">
            ${primaryBtn}
            <button onclick="openCancelModal('${ord.no}')" class="px-3 py-1.5 bg-white hover:bg-rose-50 text-rose-700 border border-border rounded-xl text-xs font-bold transition-colors cursor-pointer">
              Batalkan
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join("");
}

function getStatusBadge(status) {
  if (status === "Siap diambil") {
    return `<span class="px-2.5 py-1 rounded-lg text-xs font-bold bg-blue-100 text-primary shrink-0">Siap diambil</span>`;
  }
  if (status === "Diproses") {
    return `<span class="px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-100 text-emerald-700 shrink-0">Diproses</span>`;
  }
  return `<span class="px-2.5 py-1 rounded-lg text-xs font-bold bg-amber-100 text-amber-800 shrink-0">Menunggu</span>`;
}

function getActionButtonHtml(ord, isMobile) {
  const baseCls = isMobile
    ? "flex-1 py-2.5 px-3 rounded-xl text-xs font-bold cursor-pointer transition-colors"
    : "px-3.5 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition-colors";
  if (ord.status === "Menunggu") {
    return `<button onclick="advanceOrderStatus('${ord.no}', 'Diproses')" class="${baseCls} bg-primary hover:bg-blue-700 text-white">Proses pesanan</button>`;
  }
  if (ord.status === "Diproses") {
    return `<button onclick="advanceOrderStatus('${ord.no}', 'Siap diambil')" class="${baseCls} bg-emerald-600 hover:bg-emerald-700 text-white">Tandai siap diambil</button>`;
  }
  return `<button onclick="openHandoverModal('${ord.no}')" class="${baseCls} bg-primary hover:bg-blue-700 text-white">Serah terima</button>`;
}

function advanceOrderStatus(orderNo, newStatus) {
  const db = getDB();
  const ord = db.orders.find(o => o.no === orderNo);
  if (!ord) return;

  ord.status = newStatus;
  if (newStatus === "Siap diambil") {
    ord.readyTime = getCurrentTimeWIB();
    openToast(`Pesanan ${ord.no} siap diambil! Notifikasi dikirim ke ${ord.customer}.`);
  } else {
    openToast(`Pesanan ${ord.no} (${ord.customer}) mulai diproses dapur.`);
  }

  saveDB(db);
  syncOrderStatusToCustomer(ord.id, newStatus);
  renderQueuePage();
}

function callNextWaiting() {
  const db = getDB();
  const next = db.orders.find(o => o.status === "Menunggu");
  if (!next) {
    openToast("Tidak ada antrean menunggu saat ini.");
    return;
  }
  advanceOrderStatus(next.no, "Diproses");
}

function openHandoverModal(orderNo) {
  const db = getDB();
  const rawOrd = db.orders.find(o => o.no === orderNo);
  if (!rawOrd) return;
  const ord = mapOrderForQueue(rawOrd);
  activeHandoverOrderNo = orderNo;

  document.getElementById("ho-target-no").textContent = ord.no;
  document.getElementById("ho-customer").textContent = ord.customer;
  document.getElementById("ho-items-summary").textContent = `${ord.summaryMenu} • Siap ${ord.readyTime || getCurrentTimeWIB()}`;
  document.getElementById("ho-pay-status").textContent = `${ord.payMethod} • ${ord.payStatus}`;
  document.getElementById("ho-total").textContent = formatRp(ord.total);

  if (ord.payStatus === "Lunas") {
    document.getElementById("ho-remaining").textContent = "Rp0";
    document.getElementById("ho-pay-note").textContent = "Tidak perlu menerima pembayaran lagi.";
  } else {
    document.getElementById("ho-remaining").textContent = formatRp(ord.total);
    document.getElementById("ho-pay-note").textContent = "Tagih pembayaran tunai sebelum menyerahkan pesanan.";
  }

  resetHandoverInput();
  const modal = document.getElementById("handover-modal");
  modal.classList.remove("hidden");
  modal.classList.add("flex");
}

function closeHandoverModal() {
  const modal = document.getElementById("handover-modal");
  modal.classList.add("hidden");
  modal.classList.remove("flex");
}

function resetHandoverInput() {
  const input = document.getElementById("ho-verify-input");
  input.value = "";
  input.className = "w-full px-4 py-3 bg-white border border-slate-300 rounded-2xl text-sm font-bold text-slate-900 uppercase focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all";
  document.getElementById("ho-confirm-check").checked = false;
  document.getElementById("ho-mismatch-alert").classList.add("hidden");
  document.getElementById("ho-match-alert").classList.add("hidden");
  validateHandoverInput();
}

function validateHandoverInput() {
  const db = getDB();
  const ord = db.orders.find(o => o.no === activeHandoverOrderNo);
  if (!ord) return;

  const input = document.getElementById("ho-verify-input");
  const typed = input.value.trim().toUpperCase();
  const isChecked = document.getElementById("ho-confirm-check").checked;

  const mismatchBox = document.getElementById("ho-mismatch-alert");
  const matchBox = document.getElementById("ho-match-alert");
  const submitBtn = document.getElementById("ho-submit-btn");

  if (typed === "") {
    mismatchBox.classList.add("hidden");
    matchBox.classList.add("hidden");
    input.classList.remove("border-rose-700", "border-emerald-600");
    input.classList.add("border-slate-300");
  } else if (typed !== ord.no.toUpperCase()) {
    mismatchBox.classList.remove("hidden");
    matchBox.classList.add("hidden");
    document.getElementById("ho-mismatch-text").textContent = `${typed} tidak cocok dengan pesanan ${ord.no}. Jangan serahkan kantong ini. Periksa kembali nomor pelanggan.`;
    input.classList.remove("border-slate-300", "border-emerald-600");
    input.classList.add("border-rose-700");
  } else {
    mismatchBox.classList.add("hidden");
    matchBox.classList.remove("hidden");
    input.classList.remove("border-slate-300", "border-rose-700");
    input.classList.add("border-emerald-600");
  }

  const isValid = typed === ord.no.toUpperCase() && isChecked;
  if (isValid) {
    submitBtn.disabled = false;
    submitBtn.className = "w-full py-3.5 bg-primary hover:bg-blue-700 text-white rounded-2xl text-xs font-bold shadow-sm transition-colors cursor-pointer";
  } else {
    submitBtn.disabled = true;
    submitBtn.className = "w-full py-3.5 bg-slate-300 text-slate-500 rounded-2xl text-xs font-bold transition-colors cursor-not-allowed";
  }
}

function confirmHandover() {
  const db = getDB();
  const idx = db.orders.findIndex(o => o.no === activeHandoverOrderNo);
  if (idx === -1) return;

  const [doneOrd] = db.orders.splice(idx, 1);
  db.completedTodayCount = (db.completedTodayCount || 36) + 1;

  db.history.unshift({
    id: doneOrd.id,
    no: doneOrd.no,
    customer: doneOrd.customer,
    phone: doneOrd.phone,
    orderTime: doneOrd.time,
    endTime: getCurrentTimeWIB(),
    status: "Selesai",
    payMethod: doneOrd.payMethod,
    payStatus: "Lunas",
    trxId: doneOrd.trxId,
    customerNote: doneOrd.note,
    cancelReason: "",
    refundInfo: "",
    items: doneOrd.items.map(i => ({ name: i.name, qty: i.qty, price: i.price }))
  });

  saveDB(db);
  syncOrderStatusToCustomer(doneOrd.id, "Selesai", "Lunas");
  closeHandoverModal();
  renderQueuePage();
  openToast(`Serah terima ${doneOrd.no} (${doneOrd.customer}) berhasil! Pesanan selesai.`);
}

function openCancelModal(orderNo) {
  const db = getDB();
  const rawOrd = db.orders.find(o => o.no === orderNo);
  if (!rawOrd) return;
  const ord = mapOrderForQueue(rawOrd);
  activeCancelOrderNo = orderNo;

  document.getElementById("cn-desk-no").textContent = ord.no;
  document.getElementById("cn-desk-customer").textContent = ord.customer;
  document.getElementById("cn-desk-sub").textContent = `Masuk ${ord.time} • ${ord.summaryMenu}`;
  document.getElementById("cn-desk-status").textContent = ord.status === "Menunggu" ? "Menunggu antrean" : ord.status;
  document.getElementById("cn-desk-items").textContent = `${ord.itemsText} • Masuk ${ord.time}`;
  document.getElementById("cn-desk-pay").textContent = `Total dibayar • ${ord.payMethod}`;
  document.getElementById("cn-desk-total").textContent = formatRp(ord.total);
  document.getElementById("cn-desk-paybadge").textContent = ord.payStatus;

  document.getElementById("cn-mob-status").textContent = ord.status === "Menunggu" ? "Menunggu antrean" : ord.status;
  document.getElementById("cn-mob-title").textContent = `${ord.no} • ${ord.customer}`;
  document.getElementById("cn-mob-items").textContent = `${ord.itemsText} • Masuk ${ord.time}`;
  document.getElementById("cn-mob-pay").textContent = `Total dibayar • ${ord.payMethod}`;
  document.getElementById("cn-mob-total").textContent = formatRp(ord.total);
  document.getElementById("cn-mob-paybadge").textContent = ord.payStatus;

  document.getElementById("cn-warning-text").textContent = `Setelah dikonfirmasi, ${ord.no} berstatus Dibatalkan dan pelanggan menerima pemberitahuan beserta alasan Anda.`;
  if (ord.payStatus === "Lunas") {
    document.getElementById("cn-refund-amount").textContent = formatRp(ord.total);
    document.getElementById("cn-refund-status").textContent = "Belum dibatalkan • refund belum diproses. Periksa status pengembalian dana setelah pembatalan dikonfirmasi.";
  } else {
    document.getElementById("cn-refund-amount").textContent = "Rp0";
    document.getElementById("cn-refund-status").textContent = "Pesanan belum dibayar (Tunai di kasir), sehingga tidak ada pengembalian dana.";
  }

  document.getElementById("cn-reason-input").value = "";
  checkCancelReason();

  const modal = document.getElementById("cancel-modal");
  modal.classList.remove("hidden");
  modal.classList.add("flex");
}

function closeCancelModal() {
  const modal = document.getElementById("cancel-modal");
  modal.classList.add("hidden");
  modal.classList.remove("flex");
}

function setQuickCancelReason(text) {
  document.getElementById("cn-reason-input").value = text;
  checkCancelReason();
}

function checkCancelReason() {
  const val = document.getElementById("cn-reason-input").value.trim();
  const btn = document.getElementById("cn-confirm-btn");
  if (val.length >= 3) {
    btn.disabled = false;
    btn.className = "w-full py-3.5 bg-rose-800 hover:bg-rose-900 text-white rounded-2xl text-xs font-bold shadow-sm transition-colors cursor-pointer";
  } else {
    btn.disabled = true;
    btn.className = "w-full py-3.5 bg-slate-300 text-slate-500 rounded-2xl text-xs font-bold transition-colors cursor-not-allowed";
  }
}

function executeCancelOrder() {
  const reason = document.getElementById("cn-reason-input").value.trim();
  if (!reason) return;

  const db = getDB();
  const idx = db.orders.findIndex(o => o.no === activeCancelOrderNo);
  if (idx === -1) return;

  const [canceled] = db.orders.splice(idx, 1);
  const mapped = mapOrderForQueue(canceled);
  const refundNote = canceled.payStatus === "Lunas"
    ? `Dana sebesar ${formatRp(mapped.total)} telah dikembalikan otomatis ke ${canceled.payMethod} pelanggan.`
    : "Tidak ada pengembalian dana karena metode pembayaran Tunai belum dibayar.";

  db.history.unshift({
    id: canceled.id,
    no: canceled.no,
    customer: canceled.customer,
    phone: canceled.phone,
    orderTime: canceled.time,
    endTime: getCurrentTimeWIB(),
    status: "Dibatalkan",
    payMethod: canceled.payMethod,
    payStatus: canceled.payStatus === "Lunas" ? "Dikembalikan (Refund)" : "Belum dibayar",
    trxId: canceled.trxId,
    customerNote: canceled.note,
    cancelReason: reason,
    refundInfo: refundNote,
    items: canceled.items.map(i => ({ name: i.name, qty: i.qty, price: i.price }))
  });

  saveDB(db);
  syncOrderStatusToCustomer(canceled.id, "Dibatalkan", canceled.payStatus === "Lunas" ? "Refund" : "Batal");
  closeCancelModal();
  renderQueuePage();
  openToast(`Pesanan ${canceled.no} dibatalkan (${reason})`);
}

window.addEventListener("storage", function (e) {
  if (e.key === ADMIN_DB_KEY || e.key === "komart_pending_orders") {
    renderQueuePage();
    openToast("Pesanan baru diterima dari pelanggan!");
  }
});

renderQueuePage();