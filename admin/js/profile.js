let isStoreOpen = true;

(function loadSavedStoreInfo() {
  const db = getDB();
  isStoreOpen = db.store.isOpen;

  const nameInput = document.getElementById("input-store-name");
  const locInput = document.getElementById("input-store-location");
  const cardName = document.getElementById("card-store-name");
  const cardLoc = document.getElementById("card-store-location");
  const jamInput = document.getElementById("jam-operasional");
  const estInput = document.getElementById("estimasi-menit");

  if (nameInput) nameInput.value = db.store.name;
  if (locInput) locInput.value = db.store.location;
  if (cardName) cardName.textContent = db.store.name;
  if (cardLoc) cardLoc.textContent = db.store.location;
  if (jamInput) jamInput.value = db.store.hours;
  if (estInput) estInput.value = db.store.estMinutes;

  setOperasionalStatus(isStoreOpen);
})();

function setOperasionalStatus(open) {
  isStoreOpen = open;
  const btnBuka = document.getElementById("btn-toko-buka");
  const btnTutup = document.getElementById("btn-toko-tutup");
  if (!btnBuka || !btnTutup) return;

  if (open) {
    btnBuka.className = "px-4 py-2.5 rounded-xl text-xs font-bold bg-blue-100 text-primary transition-colors cursor-pointer";
    btnTutup.className = "px-4 py-2.5 rounded-xl text-xs font-semibold bg-slate-100 text-slate-600 hover:bg-slate-200/70 transition-colors cursor-pointer";
  } else {
    btnTutup.className = "px-4 py-2.5 rounded-xl text-xs font-bold bg-rose-100 text-rose-700 transition-colors cursor-pointer";
    btnBuka.className = "px-4 py-2.5 rounded-xl text-xs font-semibold bg-slate-100 text-slate-600 hover:bg-slate-200/70 transition-colors cursor-pointer";
  }
}

function toggleNotifItem(btn) {
  const active = btn.dataset.active === "true";
  if (active) {
    btn.dataset.active = "false";
    btn.textContent = "Nonaktif";
    btn.className = "text-xs font-semibold text-slate-400 hover:underline cursor-pointer shrink-0";
  } else {
    btn.dataset.active = "true";
    btn.textContent = "✓ Aktif";
    btn.className = "text-xs font-bold text-primary hover:underline cursor-pointer shrink-0";
  }
}

function saveStoreSettings() {
  const db = getDB();
  const nameInput = document.getElementById("input-store-name");
  const locInput = document.getElementById("input-store-location");

  const newName = nameInput ? nameInput.value.trim() : db.store.name;
  const newLoc = locInput ? locInput.value.trim() : db.store.location;
  const jam = document.getElementById("jam-operasional").value;
  const est = Number(document.getElementById("estimasi-menit").value) || 15;

  if (!newName) {
    openToast("Nama toko tidak boleh kosong!");
    if (nameInput) nameInput.focus();
    return;
  }

  db.store.name = newName;
  db.store.location = newLoc;
  db.store.isOpen = isStoreOpen;
  db.store.hours = jam;
  db.store.estMinutes = est;
  saveDB(db);

  const cardName = document.getElementById("card-store-name");
  const cardLoc = document.getElementById("card-store-location");
  const headerStoreLabel = document.getElementById("header-active-store");

  if (cardName) cardName.textContent = newName;
  if (cardLoc) cardLoc.textContent = newLoc;
  if (headerStoreLabel) headerStoreLabel.textContent = `${newName} • ${newLoc}`;

  const statusTxt = isStoreOpen ? "Toko Buka" : "Toko Tutup";
  openToast(`Pengaturan disimpan (${statusTxt} • ${jam} • Est. ${est} mnt)`);
}

function openPasswordModal() {
  const modal = document.getElementById("password-modal");
  modal.classList.remove("hidden");
  modal.classList.add("flex");
}

function closePasswordModal() {
  const modal = document.getElementById("password-modal");
  modal.classList.add("hidden");
  modal.classList.remove("flex");
}

function submitPasswordChange(e) {
  e.preventDefault();
  closePasswordModal();
  openToast("Password akun berhasil diperbarui");
}

function handleLogout() {
  window.location.href = "login.html";
}