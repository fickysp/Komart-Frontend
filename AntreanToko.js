const searchInput = document.getElementById("searchInput");
const chipAll = document.getElementById("chipAll");
const chipPopular = document.getElementById("chipPopular");
const emptySearch = document.getElementById("emptySearch");
const storeItems = document.getElementsByClassName("store-item");

let popularOnly = false;

function showOpen() {
  for (let i = 0; i < storeItems.length; i++) {
    const item = storeItems[i];
    const statusText = item.getElementsByClassName("open-status")[0];

    if (isOpen(item.dataset.open, item.dataset.close)) {
      statusText.textContent = "Buka";
      statusText.classList.remove("closed");
    } else {
      statusText.textContent = "Tutup";
      statusText.classList.add("closed");
    }
  }
}

function filterStores() {
  const keyword = searchInput.value.toLowerCase().trim();
  let visibleCount = 0;

  for (let i = 0; i < storeItems.length; i++) {
    const item = storeItems[i];
    const storeName = item.dataset.name.toLowerCase();
    const isPopular = item.dataset.popular === "yes";

    let isMatch = storeName.includes(keyword);
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
  filterStores();
}

chipAll.addEventListener("click", function () {
  selectChip(false);
});

chipPopular.addEventListener("click", function () {
  selectChip(true);
});

searchInput.addEventListener("input", function () {
  filterStores();
});

for (let i = 0; i < storeItems.length; i++) {
  const item = storeItems[i];
  item.addEventListener("click", function () {
    window.location.href = "DetailToko.html?store=" + item.dataset.id;
  });
}

showOpen();
