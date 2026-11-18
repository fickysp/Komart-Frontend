let historyStatusFilter = "all";

function setHistoryFilter(status) {
  historyStatusFilter = status;
  document.querySelectorAll(".h-tab-btn").forEach(btn => {
    btn.className = btn.dataset.hstatus === status
      ? "h-tab-btn px-3.5 py-2 rounded-xl text-xs font-bold bg-blue-100 text-primary transition-colors cursor-pointer"
      : "h-tab-btn px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-100 text-slate-600 hover:bg-slate-200/70 transition-colors cursor-pointer";
  });
  renderHistory();
}

function getOrderTotal(item) {
  const sub = item.items.reduce((acc, i) => acc + i.qty * i.price, 0);
  return sub + 3000;
}

function renderHistory() {
  const db = getDB();
  const query = (document.getElementById("history-search")?.value || "").toLowerCase().trim();
  const filtered = db.history.filter(item => {
    const summary = item.items.map(i => `${i.qty}× ${i.name}`).join(", ");
    const matchStatus = historyStatusFilter === "all" || item.status === historyStatusFilter;
    const matchText = item.no.toLowerCase().includes(query) || item.customer.toLowerCase().includes(query) || summary.toLowerCase().includes(query);
    return matchStatus && matchText;
  });

  document.getElementById("history-mobile-list").innerHTML = filtered.map(item => {
    const total = getOrderTotal(item);
    const summary = item.items.map(i => `${i.qty}× ${i.name}`).join(", ");
    const badge = item.status === "Selesai"
      ? `<span class="px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-emerald-100 text-emerald-700">Selesai</span>`
      : `<span class="px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-rose-100 text-rose-700">Dibatalkan</span>`;

    return `
      <div onclick="openHistoryModal('${item.no}')" class="p-4 space-y-2 active:bg-slate-50 cursor-pointer transition-colors">
        <div class="flex items-center justify-between gap-2">
          <div class="font-extrabold text-sm text-slate-900">
            <span class="text-primary">${item.no}</span> • ${item.customer}
          </div>
          ${badge}
        </div>
        <div class="text-xs text-slate-600">${summary}</div>
        <div class="flex items-center justify-between pt-1">
          <span class="text-[11px] text-slate-400">${item.endTime} WIB • ${formatRp(total)}</span>
          <span class="text-xs font-bold text-primary">Lihat detail ›</span>
        </div>
      </div>
    `;
  }).join("");

  document.getElementById("history-desktop-table").innerHTML = filtered.map(item => {
    const total = getOrderTotal(item);
    const summary = item.items.map(i => `${i.qty}× ${i.name}`).join(", ");
    const badge = item.status === "Selesai"
      ? `<span class="px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-100 text-emerald-700">Selesai</span>`
      : `<span class="px-2.5 py-1 rounded-lg text-xs font-bold bg-rose-100 text-rose-700">Dibatalkan</span>`;

    return `
      <tr onclick="openHistoryModal('${item.no}')" class="hover:bg-slate-50/70 transition-colors cursor-pointer">
        <td class="py-4 px-6 font-extrabold text-primary">${item.no}</td>
        <td class="py-4 px-6 font-bold text-slate-900">${item.customer}</td>
        <td class="py-4 px-6 text-xs text-slate-600">${summary}</td>
        <td class="py-4 px-6 text-xs text-slate-500">${item.endTime} WIB</td>
        <td class="py-4 px-6 font-extrabold text-slate-900">${formatRp(total)}</td>
        <td class="py-4 px-6">${badge}</td>
        <td class="py-4 px-6 text-right">
          <button type="button" onclick="event.stopPropagation(); openHistoryModal('${item.no}')" class="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-primary rounded-xl text-xs font-bold transition-colors cursor-pointer">
            Detail
          </button>
        </td>
      </tr>
    `;
  }).join("");
}

function openHistoryModal(orderNo) {
  const db = getDB();
  const item = db.history.find(o => o.no === orderNo);
  if (!item) return;

  const subtotal = item.items.reduce((acc, i) => acc + i.qty * i.price, 0);
  const total = subtotal + 3000;

  document.getElementById("hd-number").textContent = item.no;
  document.getElementById("hd-meta").textContent = `Senin, 12 Oktober 2026 • ${item.status} ${item.endTime} WIB`;
  document.getElementById("hd-customer").textContent = item.customer;
  document.getElementById("hd-phone").textContent = item.phone;
  document.getElementById("hd-time-detail").textContent = `Masuk ${item.orderTime} • ${item.status} ${item.endTime}`;
  document.getElementById("hd-trx-id").textContent = item.trxId;
  document.getElementById("hd-customer-note").textContent = item.customerNote || "-";

  const stBadge = document.getElementById("hd-status-badge");
  stBadge.textContent = item.status;
  stBadge.className = item.status === "Selesai"
    ? "inline-block px-3 py-1 rounded-lg text-xs font-bold bg-emerald-100 text-emerald-700"
    : "inline-block px-3 py-1 rounded-lg text-xs font-bold bg-rose-100 text-rose-700";

  const cancelBanner = document.getElementById("hd-cancel-banner");
  if (item.status === "Dibatalkan") {
    cancelBanner.classList.remove("hidden");
    document.getElementById("hd-cancel-reason").textContent = `Alasan: ${item.cancelReason}`;
    document.getElementById("hd-refund-info").textContent = item.refundInfo;
  } else {
    cancelBanner.classList.add("hidden");
  }

  document.getElementById("hd-items-list").innerHTML = item.items.map(it => `
    <div class="px-5 py-3.5 flex items-center justify-between text-xs sm:text-sm">
      <div>
        <span class="font-bold text-slate-900">${it.name}</span>
        <span class="text-slate-400 block text-[11px]">${it.qty} × ${formatRp(it.price)}</span>
      </div>
      <span class="font-extrabold text-slate-900">${formatRp(it.qty * it.price)}</span>
    </div>
  `).join("");

  document.getElementById("hd-subtotal").textContent = formatRp(subtotal);
  document.getElementById("hd-total").textContent = formatRp(total);
  document.getElementById("hd-pay-method").textContent = `Metode: ${item.payMethod}`;

  const payBadge = document.getElementById("hd-pay-status");
  payBadge.textContent = item.payStatus;
  payBadge.className = item.payStatus === "Lunas"
    ? "px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-emerald-100 text-emerald-700"
    : "px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-amber-100 text-amber-800";

  const modal = document.getElementById("history-detail-modal");
  modal.classList.remove("hidden");
  modal.classList.add("flex");
}

function closeHistoryModal() {
  const modal = document.getElementById("history-detail-modal");
  modal.classList.add("hidden");
  modal.classList.remove("flex");
}

renderHistory();