let selectedMenuCat = "all";

function setMenuCategory(cat) {
  selectedMenuCat = cat;
  document.querySelectorAll(".m-cat-btn").forEach(btn => {
    btn.className = btn.dataset.cat === cat
      ? "m-cat-btn px-3.5 py-2 rounded-xl text-xs font-bold bg-blue-100 text-primary transition-colors shrink-0 cursor-pointer"
      : "m-cat-btn px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-100 text-slate-600 hover:bg-slate-200/70 transition-colors shrink-0 cursor-pointer";
  });
  renderMenuList();
}

function renderMenuList() {
  const db = getDB();
  const keyword = (document.getElementById("menu-search-input")?.value || "").toLowerCase().trim();
  const filtered = db.menus.filter(item => {
    const matchCat = selectedMenuCat === "all" || item.cat === selectedMenuCat;
    const matchKey = item.name.toLowerCase().includes(keyword) || item.desc.toLowerCase().includes(keyword);
    return matchCat && matchKey;
  });

  const grid = document.getElementById("menu-cards-grid");
  if (filtered.length === 0) {
    grid.innerHTML = `
      <div class="col-span-full bg-white rounded-2xl border border-border/80 p-8 text-center text-xs text-slate-500">
        Tidak ada menu yang cocok dengan pencarian atau kategori tersebut.
      </div>
    `;
    return;
  }

  grid.innerHTML = filtered.map(item => `
    <div class="bg-white rounded-2xl border border-border/80 overflow-hidden shadow-2xs flex flex-col justify-between transition-all ${item.available ? '' : 'opacity-75'}">
      <div class="p-4 flex gap-3.5">
        <img src="${item.img}" alt="${item.name}" class="w-20 h-20 rounded-xl object-cover bg-slate-100 shrink-0">
        <div class="min-w-0 flex-1">
          <div class="flex items-center justify-between gap-2">
            <span class="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-600">${item.cat}</span>
            <span class="px-2 py-0.5 rounded-md text-[10px] font-bold ${item.available ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}">
              ${item.available ? 'Tersedia' : 'Habis'}
            </span>
          </div>
          <h3 class="font-extrabold text-sm text-slate-900 mt-1.5 truncate">${item.name}</h3>
          <p class="text-[11px] text-slate-500 line-clamp-2 mt-0.5 leading-relaxed">${item.desc}</p>
          <div class="font-extrabold text-sm text-primary mt-2">${formatRp(item.price)}</div>
        </div>
      </div>

      <div class="px-4 py-3 bg-slate-50/70 border-t border-border flex items-center justify-between gap-2">
        <label class="inline-flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700">
          <input type="checkbox" ${item.available ? 'checked' : ''} onchange="toggleMenuAvailability(${item.id})" class="w-4 h-4 rounded border-slate-300 text-primary focus:ring-primary/20 cursor-pointer">
          <span>${item.available ? 'Stok aktif' : 'Stok habis'}</span>
        </label>

        <div class="flex items-center gap-1.5">
          <button onclick="openMenuModal(${item.id})" class="px-3 py-1.5 bg-white hover:bg-blue-50 text-primary border border-border rounded-lg text-xs font-bold cursor-pointer transition-colors">
            Edit
          </button>
          <button onclick="deleteMenuItem(${item.id})" class="px-2.5 py-1.5 bg-white hover:bg-rose-50 text-rose-700 border border-border rounded-lg text-xs font-bold cursor-pointer transition-colors">
            Hapus
          </button>
        </div>
      </div>
    </div>
  `).join("");
}

function toggleMenuAvailability(id) {
  const db = getDB();
  const item = db.menus.find(m => m.id === id);
  if (!item) return;
  item.available = !item.available;
  saveDB(db);
  renderMenuList();
  openToast(`Status "${item.name}" diubah menjadi ${item.available ? "Tersedia" : "Habis"}`);
}

function openMenuModal(id = null) {
  const db = getDB();
  const modal = document.getElementById("menu-form-modal");
  if (id) {
    const item = db.menus.find(m => m.id === id);
    if (!item) return;
    document.getElementById("menu-modal-title").textContent = "Edit menu";
    document.getElementById("mf-id").value = item.id;
    document.getElementById("mf-name").value = item.name;
    document.getElementById("mf-cat").value = item.cat;
    document.getElementById("mf-price").value = item.price;
    document.getElementById("mf-desc").value = item.desc;
    document.getElementById("mf-img").value = item.img;
  } else {
    document.getElementById("menu-modal-title").textContent = "Tambah menu baru";
    document.getElementById("mf-id").value = "";
    document.getElementById("mf-name").value = "";
    document.getElementById("mf-cat").value = "Makanan";
    document.getElementById("mf-price").value = "";
    document.getElementById("mf-desc").value = "";
    document.getElementById("mf-img").value = "";
  }
  modal.classList.remove("hidden");
  modal.classList.add("flex");
}

function closeMenuModal() {
  const modal = document.getElementById("menu-form-modal");
  modal.classList.add("hidden");
  modal.classList.remove("flex");
}

function saveMenuItem(e) {
  e.preventDefault();
  const db = getDB();
  const idVal = document.getElementById("mf-id").value;
  const name = document.getElementById("mf-name").value.trim();
  const cat = document.getElementById("mf-cat").value;
  const price = Number(document.getElementById("mf-price").value);
  const desc = document.getElementById("mf-desc").value.trim() || "Menu pilihan Dapur Nusantara.";
  const img = document.getElementById("mf-img").value.trim() || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=300&q=80";

  if (idVal) {
    const item = db.menus.find(m => m.id === Number(idVal));
    if (item) {
      item.name = name;
      item.cat = cat;
      item.price = price;
      item.desc = desc;
      item.img = img;
    }
    openToast(`Menu "${name}" berhasil diperbarui`);
  } else {
    db.menus.unshift({
      id: Date.now(),
      name,
      cat,
      price,
      desc,
      available: true,
      img
    });
    openToast(`Menu "${name}" berhasil ditambahkan`);
  }

  saveDB(db);
  closeMenuModal();
  renderMenuList();
}

function deleteMenuItem(id) {
  const db = getDB();
  const idx = db.menus.findIndex(m => m.id === id);
  if (idx === -1) return;
  const removed = db.menus[idx];
  db.menus.splice(idx, 1);
  saveDB(db);
  renderMenuList();
  openToast(`Menu "${removed.name}" telah dihapus`);
}

renderMenuList();