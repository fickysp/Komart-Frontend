const emptyHistory = document.getElementById("emptyHistory");
const filledHistory = document.getElementById("filledHistory");
const historyList = document.getElementById("historyList");
const emptyFilter = document.getElementById("emptyFilter");
const filterButtons = document.getElementsByClassName("history-filter");

let activeFilter = "Semua";

function filterOrders(history) {
  if (activeFilter === "Semua") {
    return history;
  }

  const result = [];
  for (let i = 0; i < history.length; i++) {
    if (history[i].status === activeFilter) {
      result.push(history[i]);
    }
  }
  return result;
}

function groupMonth(orders) {
  const groups = [];
  for (let i = 0; i < orders.length; i++) {
    const label = monthYear(orders[i].date);
    const lastGroup = groups[groups.length - 1];

    if (groups.length === 0 || lastGroup.label !== label) {
      groups.push({ label: label, orders: [orders[i]] });
    } else {
      lastGroup.orders.push(orders[i]);
    }
  }
  return groups;
}

function orderCard(order) {
  let totalLabel = "Total pembayaran";
  if (order.status === "Dibatalkan") {
    totalLabel = "Tidak dibayar";
  }

  return `
    <div class="col-12 col-md-6 col-lg-4">
      <article class="history-card">
        <div class="history-top">
          <h3 class="history-store">${order.storeName}</h3>
          <span class="status ${statusClass(order.status)}">
            <span class="icon">${statusIcon(order.status)}</span>
            ${order.status}
          </span>
        </div>
        <p class="history-time">
          <span class="icon">schedule</span>
          ${shortDate(order.date)}, ${formatHour(order.date)}
        </p>
        <p class="history-id">#${order.id}</p>

        <div class="history-bottom">
          <div>
            <p class="history-label">${totalLabel}</p>
            <p class="history-total">${formatRupiah(order.total)}</p>
          </div>
          <a href="DetailPesanan.html?id=${order.id}" class="detail-link">Lihat detail</a>
        </div>
      </article>
    </div>`;
}

function showList() {
  const orders = filterOrders(getHistory());
  const groups = groupMonth(orders);

  let html = "";
  for (let i = 0; i < groups.length; i++) {
    let cardsHtml = "";
    for (let j = 0; j < groups[i].orders.length; j++) {
      cardsHtml = cardsHtml + orderCard(groups[i].orders[j]);
    }

    html = html + `
      <section class="mb-4">
        <h2 class="history-month">${groups[i].label}</h2>
        <div class="row g-3 g-lg-4">${cardsHtml}</div>
      </section>`;
  }

  historyList.innerHTML = html;

  if (orders.length === 0) {
    emptyFilter.classList.remove("d-none");
  } else {
    emptyFilter.classList.add("d-none");
  }
}

function selectFilter(status) {
  activeFilter = status;
  for (let i = 0; i < filterButtons.length; i++) {
    if (filterButtons[i].dataset.status === status) {
      filterButtons[i].classList.add("active");
    } else {
      filterButtons[i].classList.remove("active");
    }
  }
  showList();
}

function showHistory() {
  const history = getHistory();

  if (history.length === 0) {
    emptyHistory.classList.remove("d-none");
    filledHistory.classList.add("d-none");
    return;
  }

  emptyHistory.classList.add("d-none");
  filledHistory.classList.remove("d-none");
  showList();
}

for (let i = 0; i < filterButtons.length; i++) {
  const button = filterButtons[i];
  button.addEventListener("click", function () {
    selectFilter(button.dataset.status);
  });
}

showHistory();
