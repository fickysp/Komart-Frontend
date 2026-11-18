let currentDetailOrderNo = null;
let activeCancelOrderNoBeranda = null;

function ensureBerandaCancelModal() {
  if (document.getElementById("beranda-cancel-modal")) return;

  const modalHtml = `
    <div id="beranda-cancel-modal" class="fixed inset-0 z-50 hidden items-center justify-center bg-slate-900/45 backdrop-blur-xs p-4">
      <div class="bg-white w-full max-w-lg rounded-3xl border border-border shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div class="px-6 py-4 border-b border-border flex items-center justify-between">
          <div>
            <span class="text-[11px] font-bold text-rose-700 uppercase tracking-wider">Konfirmasi Pembatalan</span>
            <h3 id="bcn-title" class="font-extrabold text-base text-slate-900 mt-0.5">Batalkan Pesanan</h3>
          </div>
          <button type="button" onclick="closeBerandaCancelModal()" class="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>

        <div class="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          <div class="bg-slate-50 border border-border rounded-2xl p-4 space-y-2">
            <div class="flex items-center justify-between gap-2">
              <span id="bcn-customer" class="font-extrabold text-sm text-slate-900">-</span>
              <span id="bcn-status" class="px-2.5 py-0.5 rounded-lg text-[11px] font-bold bg-amber-100 text-amber-800">-</span>
            </div>
            <p id="bcn-items" class="text-xs text-slate-600">-</p>
            <div class="pt-2 border-t border-border/80 flex items-center justify-between text-xs">
              <span id="bcn-pay" class="text-slate-500">-</span>
              <span id="bcn-total" class="font-extrabold text-slate-900">-</span>
            </div>
          </div>

          <div class="bg-rose-50/70 border border-rose-200 rounded-2xl p-3.5 space-y-1">
            <div class="text-xs font-bold text-rose-800">Status Pengembalian Dana</div>
            <p id="bcn-refund-status" class="text-xs text-rose-700 leading-relaxed">-</p>
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-800 mb-2">Pilih alasan cepat</label>
            <div class="flex flex-wrap gap-2">
              <button type="button" onclick="setQuickBerandaCancelReason('Bahan baku habis di dapur')" class="px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-blue-50 hover:text-primary text-slate-700 transition-colors cursor-pointer">Bahan baku habis</button>
              <button type="button" onclick="setQuickBerandaCancelReason('Antrean dapur sedang terlalu penuh')" class="px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-blue-50 hover:text-primary text-slate-700 transition-colors cursor-pointer">Antrean terlalu penuh</button>
              <button type="button" onclick="setQuickBerandaCancelReason('Pesanan ganda dari pelanggan')" class="px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-blue-50 hover:text-primary text-slate-700 transition-colors cursor-pointer">Pesanan ganda</button>
              <button type="button" onclick="setQuickBerandaCancelReason('Permintaan pembatalan dari pelanggan')" class="px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-blue-50 hover:text-primary text-slate-700 transition-colors cursor-pointer">Permintaan pelanggan</button>
            </div>
          </div>

          <div>
            <label for="bcn-reason-input" class="block text-xs font-bold text-slate-800 mb-1.5">Alasan pembatalan <span class="text-rose-600">*</span></label>
            <textarea id="bcn-reason-input" rows="3" oninput="checkBerandaCancelReason()" placeholder="Tulis alasan pembatalan untuk diberitahukan ke pelanggan..." class="w-full px-4 py-3 bg-white border border-slate-300 rounded-2xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"></textarea>
            <p id="bcn-warning-text" class="text-[11px] text-slate-400 mt-1.5">Alasan pembatalan wajib diisi minimal 3 karakter.</p>
          </div>
        </div>

        <div class="px-6 py-4 bg-slate-50 border-t border-border flex items-center gap-3">
          <button type="button" onclick="closeBerandaCancelModal()" class="flex-1 py-3 bg-white hover:bg-slate-100 text-slate-700 border border-border rounded-2xl text-xs font-bold transition-colors cursor-pointer">
            Kembali
          </button>
          <button type="button" id="bcn-confirm-btn" disabled onclick="executeBerandaCancelOrder()" class="flex-1 py-3 bg-slate-300 text-slate-500 rounded-2xl text-xs font-bold transition-colors cursor-not-allowed">
            Konfirmasi batalkan
          </button>
        </div>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML("beforeend", modalHtml);
}

function syncBerandaStaticTexts() {
  const db = getDB();
  const storeName = db.store.name || "Dapur Nusantara";
  const storeLoc = db.store.location || "Kantin FILKOM";

  const h1 = document.querySelector("#yield-content h1");
  if (h1) h1.textContent = `${getTimeGreeting()}, ${storeName}!`;
  const sub = h1 ? h1.nextElementSibling : null;
  if (sub && sub.tagName === "P") {
    sub.textContent = `${storeName} • ${storeLoc}`;
  }

  const doneCount = db.completedTodayCount ?? 36;
  const totalQueue = 44 + (db.orders || []).length;
  const avgWait = 14;
  const extraRev = (db.history || [])
    .filter(h => h.status === "Selesai" && !["ORD-009", "ORD-008", "ORD-006", "ORD-005"].includes(h.id))
    .reduce((sum, h) => sum + (h.items || []).reduce((s, i) => s + i.qty * i.price, 0) + 3000, 0);
  const totalRevMillion = ((1840000 + extraRev) / 1000000)
    .toFixed(1)
    .replace(".", ",");

  const statDoneEl = document.getElementById("stat-done-count");
  if (statDoneEl) {
    statDoneEl.textContent = doneCount;
    const cardsGrid = statDoneEl.closest(".grid");
    if (cardsGrid && cardsGrid.children.length >= 4) {
      const totalQueueVal = cardsGrid.children[0].querySelector(".text-2xl");
      const avgWaitVal = cardsGrid.children[2].querySelector(".text-2xl");
      const revVal = cardsGrid.children[3].querySelector(".text-2xl");
      if (totalQueueVal) totalQueueVal.textContent = totalQueue;
      if (avgWaitVal) avgWaitVal.textContent = `${avgWait} menit`;
      if (revVal) revVal.textContent = `Rp${totalRevMillion} juta`;
    }
  }
}

function getBerandaStatusBadge(status) {
  if (status === "Siap diambil") {
    return `<span class="px-2.5 py-1 rounded-lg text-xs font-bold bg-blue-100 text-primary whitespace-nowrap">Siap diambil</span>`;
  }
  if (status === "Diproses") {
    return `<span class="px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-100 text-emerald-700 whitespace-nowrap">Diproses</span>`;
  }
  return `<span class="px-2.5 py-1 rounded-lg text-xs font-bold bg-amber-100 text-amber-800 whitespace-nowrap">Menunggu</span>`;
}

function renderBeranda() {
  ensureBerandaCancelModal();
  syncBerandaStaticTexts();
  const db = getDB();
  const orders = db.orders || [];

  const processing = orders.filter(o => o.status === "Diproses");
  const waiting = orders.filter(o => o.status === "Menunggu");

  const procCountEl = document.getElementById("processing-count");
  if (procCountEl) procCountEl.textContent = processing.length;

  const nextLabelEl = document.getElementById("next-in-line-label");
  if (nextLabelEl) {
    nextLabelEl.innerHTML = waiting.length > 0
      ? `Berikutnya: <strong class="text-slate-800">${waiting[0].no} • ${waiting[0].customer}</strong>`
      : `Berikutnya: <strong class="text-slate-500">Tidak ada antrean menunggu</strong>`;
  }

  const procCardsEl = document.getElementById("active-processing-cards");
  if (procCardsEl) {
    if (processing.length === 0) {
      procCardsEl.innerHTML = `
        <div class="col-span-full bg-white rounded-2xl border border-border/80 p-4 text-xs text-slate-400">
          Belum ada pesanan yang sedang dimasak di dapur. Klik <strong>Panggil berikutnya</strong> untuk memproses antrean.
        </div>
      `;
    } else {
      procCardsEl.innerHTML = processing.map(ord => {
        const itemsSummary = (ord.items || []).map(i => `${i.qty}× ${i.name}`).join(", ");
        return `
          <div onclick="openOrderModal('${ord.no}')" class="bg-blue-100/75 border border-blue-200/80 rounded-2xl p-4 sm:p-5 flex items-center justify-between gap-4 shadow-2xs cursor-pointer hover:bg-blue-100 transition-colors">
            <div class="min-w-0">
              <span class="text-[11px] font-extrabold text-primary block">Sedang dimasak • Masuk ${ord.time}</span>
              <div class="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight truncate my-0.5">${ord.no} • ${ord.customer}</div>
              <div class="text-xs text-slate-600 truncate">${itemsSummary}</div>
            </div>
            <button type="button" onclick="event.stopPropagation(); advanceBerandaStatus('${ord.no}', 'Siap diambil')" class="px-4 py-2.5 bg-primary hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-sm transition-colors cursor-pointer shrink-0">
              Tandai siap
            </button>
          </div>
        `;
      }).join("");
    }
  }

  const activeBadge = document.getElementById("active-queue-badge");
  if (activeBadge) activeBadge.textContent = `${orders.length} aktif`;

  const mobileList = document.getElementById("home-queue-mobile");
  const desktopBody = document.getElementById("home-queue-body");

  if (orders.length === 0) {
    if (mobileList) mobileList.innerHTML = `<div class="p-6 text-center text-xs text-slate-400">Semua antrean hari ini telah selesai.</div>`;
    if (desktopBody) desktopBody.innerHTML = `<tr><td colspan="6" class="py-8 text-center text-xs text-slate-400">Semua antrean hari ini telah selesai.</td></tr>`;
    return;
  }

  if (mobileList) {
    mobileList.innerHTML = orders.map(ord => {
      const itemsSummary = (ord.items || []).map(i => `${i.qty}× ${i.name}`).join(", ");
      const actionBtn = ord.status === "Menunggu"
        ? `<button type="button" onclick="event.stopPropagation(); advanceBerandaStatus('${ord.no}', 'Diproses')" class="flex-1 py-2 bg-primary hover:bg-blue-700 text-white rounded-xl text-xs font-bold cursor-pointer">Proses</button>`
        : ord.status === "Diproses"
        ? `<button type="button" onclick="event.stopPropagation(); advanceBerandaStatus('${ord.no}', 'Siap diambil')" class="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold cursor-pointer">Tandai siap</button>`
        : `<a href="antrean.html" onclick="event.stopPropagation()" class="flex-1 py-2 bg-primary hover:bg-blue-700 text-white rounded-xl text-xs font-bold text-center">Serah terima</a>`;

      return `
        <div onclick="openOrderModal('${ord.no}')" class="p-4 space-y-2.5 active:bg-slate-50 cursor-pointer">
          <div class="flex items-center justify-between gap-2">
            <div class="font-extrabold text-sm text-slate-900">
              <span class="text-primary">${ord.no}</span> • ${ord.customer}
            </div>
            ${getBerandaStatusBadge(ord.status)}
          </div>
          <div class="text-xs text-slate-500">${itemsSummary}</div>
          <div class="flex items-center gap-2 pt-1">
            ${actionBtn}
            <button type="button" onclick="event.stopPropagation(); openOrderModal('${ord.no}')" class="px-3.5 py-2 bg-white border border-border text-primary rounded-xl text-xs font-bold cursor-pointer">Detail</button>
          </div>
        </div>
      `;
    }).join("");
  }

  if (desktopBody) {
    desktopBody.innerHTML = orders.map(ord => {
      const itemsSummary = (ord.items || []).map(i => `${i.qty}× ${i.name}`).join(", ");
      const primaryBtn = ord.status === "Menunggu"
        ? `<button type="button" onclick="event.stopPropagation(); advanceBerandaStatus('${ord.no}', 'Diproses')" class="px-3.5 py-1.5 bg-primary hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer">Proses</button>`
        : ord.status === "Diproses"
        ? `<button type="button" onclick="event.stopPropagation(); advanceBerandaStatus('${ord.no}', 'Siap diambil')" class="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer">Tandai siap</button>`
        : `<a href="antrean.html" onclick="event.stopPropagation()" class="px-3.5 py-1.5 bg-primary hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors inline-block">Serah terima</a>`;

      return `
        <tr onclick="openOrderModal('${ord.no}')" class="hover:bg-slate-50/70 transition-colors cursor-pointer">
          <td class="py-4 px-6 font-extrabold text-primary whitespace-nowrap">${ord.no}</td>
          <td class="py-4 px-6 font-bold text-slate-900 whitespace-nowrap">${ord.customer}</td>
          <td class="py-4 px-6 text-xs text-slate-600 max-w-xs truncate">${itemsSummary}</td>
          <td class="py-4 px-6 text-xs text-slate-500 whitespace-nowrap">${ord.time} WIB</td>
          <td class="py-4 px-6 whitespace-nowrap">${getBerandaStatusBadge(ord.status)}</td>
          <td class="py-4 px-6 text-right whitespace-nowrap">
            <div class="inline-flex items-center justify-end gap-2">
              ${primaryBtn}
              <button type="button" onclick="event.stopPropagation(); openOrderModal('${ord.no}')" class="p-2 text-primary hover:bg-blue-50 rounded-xl transition-colors cursor-pointer" title="Detail Pesanan">
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><circle cx="5" cy="12" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="19" cy="12" r="2"/></svg>
              </button>
            </div>
          </td>
        </tr>
      `;
    }).join("");
  }
}

function advanceBerandaStatus(orderNo, newStatus) {
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
  renderBeranda();
}

function callNextInQueue() {
  const db = getDB();
  const next = db.orders.find(o => o.status === "Menunggu");
  if (!next) {
    openToast("Tidak ada antrean menunggu saat ini.");
    return;
  }
  advanceBerandaStatus(next.no, "Diproses");
}

function openOrderModal(orderNo) {
  const db = getDB();
  const ord = db.orders.find(o => o.no === orderNo);
  if (!ord) return;
  currentDetailOrderNo = orderNo;

  const items = ord.items || [];
  const totalQty = items.reduce((s, i) => s + i.qty, 0);
  const subtotal = items.reduce((s, i) => s + i.qty * i.price, 0);
  const total = subtotal + 3000;

  document.getElementById("od-number").textContent = ord.no;
  document.getElementById("od-meta").textContent = `${items.length} menu, ${totalQty} item • Masuk ${ord.time} WIB`;
  document.getElementById("od-customer").textContent = ord.customer;
  document.getElementById("od-phone").textContent = ord.phone || "-";
  document.getElementById("od-service-note").textContent = `Bawa pulang • ${totalQty} item`;
  document.getElementById("od-cashier-note").textContent = `Meja kasir 1 • ${ord.time} WIB`;

  const cashierCard = document.getElementById("od-cashier-note").previousElementSibling;
  if (cashierCard) cashierCard.textContent = db.store.name || "Dapur Nusantara";

  const statusBadge = document.getElementById("od-status-badge");
  statusBadge.textContent = ord.status;
  statusBadge.className = ord.status === "Siap diambil"
    ? "inline-block px-3 py-1 rounded-lg text-xs font-bold bg-blue-100 text-primary"
    : ord.status === "Diproses"
    ? "inline-block px-3 py-1 rounded-lg text-xs font-bold bg-emerald-100 text-emerald-700"
    : "inline-block px-3 py-1 rounded-lg text-xs font-bold bg-amber-100 text-amber-800";

  document.getElementById("od-payment-short").textContent = `${ord.payStatus} • ${ord.payMethod}`;

  document.getElementById("od-items-list").innerHTML = items.map(it => `
    <tr>
      <td class="py-3 px-5">
        <div class="font-bold text-slate-900">${it.name}</div>
        <div class="text-[11px] text-slate-400 sm:hidden">${it.cat || "Menu"} • ${formatRp(it.price)}</div>
      </td>
      <td class="py-3 px-4 text-xs text-slate-500 hidden sm:table-cell">${it.cat || "Menu"}</td>
      <td class="py-3 px-4 text-center font-bold text-slate-800">${it.qty}</td>
      <td class="py-3 px-4 text-right text-xs text-slate-500 hidden sm:table-cell">${formatRp(it.price)}</td>
      <td class="py-3 px-5 text-right font-extrabold text-slate-900">${formatRp(it.qty * it.price)}</td>
    </tr>
  `).join("");

  document.getElementById("od-note").textContent = ord.note || "Tidak ada catatan khusus.";
  document.getElementById("od-subtotal-label").textContent = `Subtotal (${totalQty} item)`;
  document.getElementById("od-subtotal").textContent = formatRp(subtotal);
  document.getElementById("od-total").textContent = formatRp(total);
  document.getElementById("od-pay-method").textContent = ord.payMethod;

  const payBadge = document.getElementById("od-pay-badge");
  payBadge.textContent = ord.payStatus === "Lunas" ? "Sudah dibayar" : "Belum dibayar";
  payBadge.className = ord.payStatus === "Lunas"
    ? "px-2.5 py-1 rounded-lg text-[11px] font-bold bg-emerald-100 text-emerald-700"
    : "px-2.5 py-1 rounded-lg text-[11px] font-bold bg-amber-100 text-amber-800";

  document.getElementById("od-pay-time").textContent = `${ord.time} WIB`;
  document.getElementById("od-trx-id").textContent = ord.trxId || "-";

  const actionSlot = document.getElementById("od-primary-action-slot");
  if (ord.status === "Menunggu") {
    actionSlot.innerHTML = `<button type="button" onclick="advanceBerandaStatus('${ord.no}', 'Diproses'); closeOrderModal();" class="w-full py-2.5 px-4 bg-primary hover:bg-blue-700 text-white rounded-xl text-xs font-bold cursor-pointer">Proses pesanan</button>`;
  } else if (ord.status === "Diproses") {
    actionSlot.innerHTML = `<button type="button" onclick="advanceBerandaStatus('${ord.no}', 'Siap diambil'); closeOrderModal();" class="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold cursor-pointer">Tandai siap diambil</button>`;
  } else {
    actionSlot.innerHTML = `<a href="antrean.html" class="w-full py-2.5 px-4 bg-primary hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center justify-center">Serah terima di Antrean</a>`;
  }

  document.getElementById("od-cancel-btn").onclick = function () {
    openBerandaCancelModal(ord.no);
  };

  const modal = document.getElementById("order-detail-modal");
  modal.classList.remove("hidden");
  modal.classList.add("flex");
}

function closeOrderModal() {
  const modal = document.getElementById("order-detail-modal");
  modal.classList.add("hidden");
  modal.classList.remove("flex");
}

function openBerandaCancelModal(orderNo) {
  ensureBerandaCancelModal();
  const db = getDB();
  const ord = db.orders.find(o => o.no === orderNo);
  if (!ord) return;

  activeCancelOrderNoBeranda = orderNo;
  closeOrderModal();

  const items = ord.items || [];
  const itemsText = items.map(i => `${i.qty}× ${i.name}`).join(", ");
  const total = items.reduce((s, i) => s + i.qty * i.price, 0) + 3000;

  document.getElementById("bcn-title").textContent = `Batalkan Pesanan ${ord.no}`;
  document.getElementById("bcn-customer").textContent = `${ord.no} • ${ord.customer}`;
  document.getElementById("bcn-status").textContent = ord.status;
  document.getElementById("bcn-items").textContent = `${itemsText} • Masuk ${ord.time} WIB`;
  document.getElementById("bcn-pay").textContent = `Total dibayar • ${ord.payMethod} (${ord.payStatus})`;
  document.getElementById("bcn-total").textContent = formatRp(total);

  if (ord.payStatus === "Lunas") {
    document.getElementById("bcn-refund-status").textContent = `Dana sebesar ${formatRp(total)} akan dikembalikan otomatis ke ${ord.payMethod} pelanggan setelah pembatalan dikonfirmasi.`;
  } else {
    document.getElementById("bcn-refund-status").textContent = "Pesanan belum dibayar (Tunai di kasir), sehingga tidak ada pengembalian dana.";
  }

  document.getElementById("bcn-warning-text").textContent = `Setelah dikonfirmasi, ${ord.no} berstatus Dibatalkan dan pelanggan menerima pemberitahuan beserta alasan Anda.`;
  document.getElementById("bcn-reason-input").value = "";
  checkBerandaCancelReason();

  const modal = document.getElementById("beranda-cancel-modal");
  modal.classList.remove("hidden");
  modal.classList.add("flex");
}

function closeBerandaCancelModal() {
  const modal = document.getElementById("beranda-cancel-modal");
  if (!modal) return;
  modal.classList.add("hidden");
  modal.classList.remove("flex");
}

function setQuickBerandaCancelReason(text) {
  document.getElementById("bcn-reason-input").value = text;
  checkBerandaCancelReason();
}

function checkBerandaCancelReason() {
  const val = document.getElementById("bcn-reason-input").value.trim();
  const btn = document.getElementById("bcn-confirm-btn");
  if (val.length >= 3) {
    btn.disabled = false;
    btn.className = "flex-1 py-3 bg-rose-800 hover:bg-rose-900 text-white rounded-2xl text-xs font-bold shadow-sm transition-colors cursor-pointer";
  } else {
    btn.disabled = true;
    btn.className = "flex-1 py-3 bg-slate-300 text-slate-500 rounded-2xl text-xs font-bold transition-colors cursor-not-allowed";
  }
}

function executeBerandaCancelOrder() {
  const reason = document.getElementById("bcn-reason-input").value.trim();
  if (reason.length < 3) return;

  const db = getDB();
  const idx = db.orders.findIndex(o => o.no === activeCancelOrderNoBeranda);
  if (idx === -1) return;

  const [canceled] = db.orders.splice(idx, 1);
  const total = (canceled.items || []).reduce((s, i) => s + i.qty * i.price, 0) + 3000;
  const refundNote = canceled.payStatus === "Lunas"
    ? `Dana sebesar ${formatRp(total)} telah dikembalikan otomatis ke ${canceled.payMethod} pelanggan.`
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
    items: (canceled.items || []).map(i => ({ name: i.name, qty: i.qty, price: i.price }))
  });

  saveDB(db);
  syncOrderStatusToCustomer(canceled.id, "Dibatalkan", canceled.payStatus === "Lunas" ? "Refund" : "Batal");
  closeBerandaCancelModal();
  renderBeranda();
  openToast(`Pesanan ${canceled.no} dibatalkan (${reason})`);
}

window.addEventListener("storage", function (e) {
  if (e.key === ADMIN_DB_KEY || e.key === "komart_pending_orders") {
    syncStoreBannerUI();
    renderBeranda();
    openToast("Pesanan baru diterima dari pelanggan!");
  }
});

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", renderBeranda);
} else {
  renderBeranda();
}