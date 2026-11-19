const searchInput = document.getElementById("searchInput");
const chipAll = document.getElementById("chipAll");
const chipPopular = document.getElementById("chipPopular");
const seeAll = document.getElementById("seeAll");
const emptySearch = document.getElementById("emptySearch");
const menuItems = document.getElementsByClassName("menu-item");
const favButtons = document.getElementsByClassName("fav-btn");
const emptyBanner = document.getElementById("emptyBanner");
const queueCard = document.getElementById("queueCard");

let popularOnly = false;

function showQueue() {
  const order = getOrder();

  if (order === null) {
    emptyBanner.classList.remove("d-none");
    queueCard.classList.add("d-none");
    return;
  }

  emptyBanner.classList.add("d-none");
  queueCard.classList.remove("d-none");

  const peopleAhead = order.queueNumber - order.servingNumber;
  const progress = 100 / (peopleAhead + 1);

  document.getElementById("queueStore").textContent = order.storeName;
  document.getElementById("queueNumber").textContent = queueText(order.queueNumber);
  document.getElementById("queueServing").textContent = servingText(order.servingNumber);
  document.getElementById("queueRest").textContent = peopleAhead + " antrean lagi";
  document.getElementById("queueTime").textContent = "±" + order.waitMinutes + " menit";
  document.getElementById("queueFill").style.width = progress + "%";
  document.getElementById("queueLink").href = "DetailPesanan.html?id=" + order.id;

  const chip = document.getElementById("queueChip");
  const icon = document.getElementById("queueIcon");
  const text = document.getElementById("queueStatus");
  setStatus(chip, icon, text, order.status);
}

function filterMenu() {
  const keyword = searchInput.value.toLowerCase().trim();
  let visibleCount = 0;

  for (let i = 0; i < menuItems.length; i++) {
    const item = menuItems[i];
    const menuName = item.dataset.name.toLowerCase();
    const storeName = item.dataset.store.toLowerCase();
    const isPopular = item.dataset.popular === "yes";

    let isMatch = false;
    if (menuName.includes(keyword) || storeName.includes(keyword)) {
      isMatch = true;
    }
    if (popularOnly === true && isPopular === false) {
      isMatch = false;
    }

    if (isMatch) {
      item.classList.remove("d-none");
      visibleCount = visibleCount + 1;
    } else {
      item.classList.add("d-none");
    }
  }

  if (visibleCount === 0) {
    emptySearch.classList.remove("d-none");
  } else {
    emptySearch.classList.add("d-none");
  }
}

function selectChip(onlyPopular) {
  popularOnly = onlyPopular;
  if (onlyPopular) {
    chipPopular.classList.add("active");
    chipAll.classList.remove("active");
  } else {
    chipAll.classList.add("active");
    chipPopular.classList.remove("active");
  }
  filterMenu();
}

function getMenu(item) {
  return {
    id: item.dataset.id,
    name: item.dataset.name,
    store: item.dataset.store,
    category: item.dataset.category,
    price: Number(item.dataset.price),
    image: "./assets/" + item.dataset.id + ".jpg",
    rating: item.dataset.rating,
    sold: item.dataset.sold,
    time: item.dataset.time
  };
}

chipAll.addEventListener("click", function () {
  selectChip(false);
});

chipPopular.addEventListener("click", function () {
  selectChip(true);
});

seeAll.addEventListener("click", function (event) {
  event.preventDefault();
  searchInput.value = "";
  selectChip(false);
});

searchInput.addEventListener("input", function () {
  filterMenu();
});

for (let i = 0; i < menuItems.length; i++) {
  const item = menuItems[i];
  item.addEventListener("click", function () {
    openDialog(getMenu(item));
  });
}

for (let i = 0; i < favButtons.length; i++) {
  const button = favButtons[i];
  button.addEventListener("click", function (event) {
    event.stopPropagation();
    button.classList.toggle("active");
  });
}

showQueue();
