const ADMIN_DB_KEY = "komart_db";

const DEFAULT_ADMIN_DB = {
  store: {
    name: "Dapur Nusantara",
    location: "Kantin FILKOM",
    isOpen: false,
    hours: "08:00–16:00",
    estMinutes: 15
  },
  completedTodayCount: 36,
  menus: [
    {
      id: 1,
      name: "Nasi Goreng Kampung",
      cat: "Makanan",
      price: 32000,
      desc: "Bumbu rumahan, telur mata sapi, ayam suwir, dan sambal pilihan.",
      available: true,
      img: "../assets/NasiGoreng.jpg"
    },
    {
      id: 2,
      name: "Soto Betawi",
      cat: "Makanan",
      price: 35000,
      desc: "Kuah santan gurih, potongan daging sapi empuk, kentang, dan emping.",
      available: true,
      img: "../assets/SotoBetawi.jpg"
    },
    {
      id: 3,
      name: "Mie Tek-Tek",
      cat: "Makanan",
      price: 28000,
      desc: "Mie goreng berbumbu khas Jawa, sayuran segar, dan telur orak-arik.",
      available: false,
      img: "../assets/MieTekTek.jpg"
    },
    {
      id: 4,
      name: "Es Teh Manis",
      cat: "Minuman",
      price: 8000,
      desc: "Seduhan teh melati pilihan dengan takaran gula pas dan es batu.",
      available: true,
      img: "../assets/EsTehManis.jpg"
    },
    {
      id: 5,
      name: "Es Jeruk Peras",
      cat: "Minuman",
      price: 12000,
      desc: "Perasan jeruk segar murni; tingkat gula dan es dapat disesuaikan.",
      available: true,
      img: "../assets/EsJeruk.jpg"
    },
    {
      id: 6,
      name: "Tahu Crispy Lada Garam",
      cat: "Camilan",
      price: 18000,
      desc: "Potongan tahu goreng renyah dengan taburan cabai rawit dan bawang putih.",
      available: true,
      img: "../assets/TahuCrispy.png"
    }
  ],
  orders: [
    {
      id: "ORD-010",
      no: "A-10",
      customer: "Siska Putri",
      phone: "0812-8899-1122 • Online",
      time: "12:32",
      readyTime: "12:50",
      status: "Siap diambil",
      payMethod: "QRIS",
      payStatus: "Lunas",
      trxId: "TRX-121026-010",
      note: "Sambal dipisah.",
      items: [
        { name: "Nasi Goreng Kampung", desc: "Bumbu rumahan, telur mata sapi", cat: "Makanan", qty: 2, price: 32000, img: "../assets/NasiGoreng.jpg" },
        { name: "Soto Betawi", desc: "Kuah santan gurih, daging sapi", cat: "Makanan", qty: 1, price: 35000, img: "../assets/SotoBetawi.jpg" },
        { name: "Es Teh Manis", desc: "Seduhan teh melati pilihan", cat: "Minuman", qty: 2, price: 8000, img: "../assets/EsTehManis.jpg" },
        { name: "Es Jeruk Peras", desc: "Perasan jeruk segar murni", cat: "Minuman", qty: 1, price: 12000, img: "../assets/EsJeruk.jpg" }
      ]
    },
    {
      id: "ORD-011",
      no: "A-11",
      customer: "Bima Kurnia",
      phone: "0857-1122-3344 • Online",
      time: "12:37",
      readyTime: "",
      status: "Menunggu",
      payMethod: "QRIS",
      payStatus: "Lunas",
      trxId: "TRX-121026-011",
      note: "Tidak pedas.",
      items: [
        { name: "Mie Tek-Tek", desc: "Mie goreng berbumbu khas Jawa", cat: "Makanan", qty: 1, price: 28000, img: "../assets/MieTekTek.jpg" }
      ]
    },
    {
      id: "ORD-012",
      no: "A-12",
      customer: "Raka Aditya",
      phone: "0813-4455-6677 • Walk-in",
      time: "12:41",
      readyTime: "",
      status: "Diproses",
      payMethod: "Tunai",
      payStatus: "Belum dibayar",
      trxId: "TRX-121026-012",
      note: "Emping dipisah.",
      items: [
        { name: "Soto Betawi", desc: "Kuah santan gurih, daging sapi", cat: "Makanan", qty: 2, price: 35000, img: "../assets/SotoBetawi.jpg" },
        { name: "Es Teh Manis", desc: "Seduhan teh melati pilihan", cat: "Minuman", qty: 2, price: 8000, img: "../assets/EsTehManis.jpg" }
      ]
    },
    {
      id: "ORD-013",
      no: "A-13",
      customer: "Nadia Laras",
      phone: "0821-7788-9900 • Online",
      time: "12:44",
      readyTime: "",
      status: "Menunggu",
      payMethod: "QRIS",
      payStatus: "Lunas",
      trxId: "TRX-121026-013",
      note: "Es jeruk sedikit es.",
      items: [
        { name: "Nasi Goreng Kampung", desc: "Bumbu rumahan, telur mata sapi", cat: "Makanan", qty: 1, price: 32000, img: "../assets/NasiGoreng.jpg" },
        { name: "Es Jeruk Peras", desc: "Perasan jeruk segar murni", cat: "Minuman", qty: 1, price: 12000, img: "../assets/EsJeruk.jpg" }
      ]
    }
  ],
  history: [
    {
      id: "ORD-009",
      no: "A-09",
      customer: "Dimas Pratama",
      phone: "0812-3456-7890 • Online",
      orderTime: "12:02",
      endTime: "12:18",
      status: "Selesai",
      payMethod: "QRIS",
      payStatus: "Lunas",
      trxId: "TRX-121026-009",
      customerNote: "Sambal dipisah satu porsi.",
      cancelReason: "",
      refundInfo: "",
      items: [
        { name: "Nasi Goreng Kampung", qty: 2, price: 32000 },
        { name: "Es Teh Manis", qty: 2, price: 8000 }
      ]
    },
    {
      id: "ORD-008",
      no: "A-08",
      customer: "Aulia Rahma",
      phone: "0857-9900-1122 • Walk-in",
      orderTime: "11:48",
      endTime: "12:05",
      status: "Selesai",
      payMethod: "Tunai",
      payStatus: "Lunas",
      trxId: "TRX-121026-008",
      customerNote: "Tanpa daun bawang.",
      cancelReason: "",
      refundInfo: "",
      items: [
        { name: "Soto Betawi", qty: 1, price: 35000 },
        { name: "Es Jeruk Peras", qty: 1, price: 12000 }
      ]
    },
    {
      id: "ORD-007",
      no: "A-07",
      customer: "Fajar Nugroho",
      phone: "0813-7788-9900 • Online",
      orderTime: "11:45",
      endTime: "11:52",
      status: "Dibatalkan",
      payMethod: "QRIS",
      payStatus: "Dikembalikan (Refund)",
      trxId: "TRX-121026-007",
      customerNote: "Tidak ada catatan khusus.",
      cancelReason: "Bahan baku Mie Tek-Tek habis di dapur.",
      refundInfo: "Dana sebesar Rp31.000 telah dikembalikan otomatis ke QRIS pelanggan.",
      items: [
        { name: "Mie Tek-Tek", qty: 1, price: 28000 }
      ]
    }
  ]
};

function getDB() {
  const raw = localStorage.getItem(ADMIN_DB_KEY);
  let db = raw ? JSON.parse(raw) : JSON.parse(JSON.stringify(DEFAULT_ADMIN_DB));
  let isUpdated = !raw;

  if (!db.store) {
    db.store = JSON.parse(JSON.stringify(DEFAULT_ADMIN_DB.store));
    isUpdated = true;
  }
  if (typeof db.completedTodayCount !== "number") {
    db.completedTodayCount = DEFAULT_ADMIN_DB.completedTodayCount;
    isUpdated = true;
  }
  if (!Array.isArray(db.menus)) {
    db.menus = JSON.parse(JSON.stringify(DEFAULT_ADMIN_DB.menus));
    isUpdated = true;
  }
  if (!Array.isArray(db.orders)) {
    db.orders = JSON.parse(JSON.stringify(DEFAULT_ADMIN_DB.orders));
    isUpdated = true;
  }
  if (!Array.isArray(db.history)) {
    db.history = JSON.parse(JSON.stringify(DEFAULT_ADMIN_DB.history));
    isUpdated = true;
  }

  const pendingRaw = localStorage.getItem("komart_pending_orders");
  if (pendingRaw) {
    const pending = JSON.parse(pendingRaw);
    pending.forEach(p => {
      if (!db.orders.some(o => o.id === p.id) && !db.history.some(h => h.id === p.id)) {
        db.orders.push(p);
      }
    });
    localStorage.removeItem("komart_pending_orders");
    isUpdated = true;
  }

  if (isUpdated) {
    localStorage.setItem(ADMIN_DB_KEY, JSON.stringify(db));
  }

  return db;
}

function saveDB(db) {
  localStorage.setItem(ADMIN_DB_KEY, JSON.stringify(db));
}

function syncOrderStatusToCustomer(orderId, newStatus, newPayStatus = null) {
  if (!orderId) return;
  const custOrderRaw = localStorage.getItem("komartOrder");
  if (custOrderRaw) {
    const custOrder = JSON.parse(custOrderRaw);
    if (custOrder.id === orderId) {
      custOrder.status = newStatus;
      if (newPayStatus) custOrder.payStatus = newPayStatus;
      localStorage.setItem("komartOrder", JSON.stringify(custOrder));
    }
  }

  const custHistoryRaw = localStorage.getItem("komartHistory");
  if (custHistoryRaw) {
    const custHistory = JSON.parse(custHistoryRaw);
    let changed = false;
    custHistory.forEach(item => {
      if (item.id === orderId) {
        item.status = newStatus;
        if (newPayStatus) item.payStatus = newPayStatus;
        changed = true;
      }
    });
    if (changed) {
      localStorage.setItem("komartHistory", JSON.stringify(custHistory));
    }
  }
}

function getCurrentTimeWIB() {
  const now = new Date();
  return `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
}

function getTimeGreeting() {
  const hour = new Date().getHours();
  if (hour >= 4 && hour < 11) return "Selamat pagi";
  if (hour >= 11 && hour < 15) return "Selamat siang";
  if (hour >= 15 && hour < 18) return "Selamat sore";
  return "Selamat malam";
}

(function initMasterLayout() {
  const pageTitle = document.title || "Komart - Admin";
  const pageContent = document.body.innerHTML;

  const fontPreconnect1 = document.createElement("link");
  fontPreconnect1.rel = "preconnect";
  fontPreconnect1.href = "https://fonts.googleapis.com";

  const fontPreconnect2 = document.createElement("link");
  fontPreconnect2.rel = "preconnect";
  fontPreconnect2.href = "https://fonts.gstatic.com";
  fontPreconnect2.crossOrigin = "anonymous";

  const iconLink = document.createElement("link");
  iconLink.rel = "icon";
  iconLink.href = "../assets/icon.png";

  const fontLink = document.createElement("link");
  fontLink.rel = "stylesheet";
  fontLink.href = "https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap";

  const themeStyle = document.createElement("style");
  themeStyle.setAttribute("type", "text/tailwindcss");
  themeStyle.textContent = `
    @theme {
      --font-sans: "Manrope", sans-serif;
      --color-primary: #2563eb;
      --color-surface: #f8fafc;
      --color-border: #e2e8f0;
    }
  `;

  document.head.append(fontPreconnect1, fontPreconnect2, iconLink, fontLink, themeStyle);
  document.title = pageTitle;

  const db = getDB();
  const storeName = db.store.name || "Dapur Nusantara";
  const storeLocation = db.store.location || "Kantin FILKOM";
  const storeInitials = storeName.split(" ").map(n => n[0]).slice(0, 2).join("").toUpperCase();

  document.body.className = "bg-surface text-slate-800 font-sans h-screen flex overflow-hidden";
  document.body.innerHTML = `
    <aside id="sidebar" class="hidden md:flex w-[232px] bg-white border-r border-slate-200 flex-col justify-between h-screen shrink-0">
      <div class="flex flex-col flex-1 min-h-0">
        <div class="h-20 flex items-center px-6 shrink-0">
          <a href="index.html" class="flex items-center space-x-3">
            <img src="../assets/icon.png" alt="Logo Komart" class="w-9 h-9 rounded-xl object-contain shrink-0" />
            <span class="font-bold text-xl text-slate-900 tracking-tight">Komart</span>
          </a>
        </div>

        <nav class="flex-1 px-4 py-2 space-y-1.5 overflow-y-auto">
          <p class="text-[11px] text-slate-400 font-bold mb-3 px-3 tracking-wider uppercase">RUANG PEMILIK</p>

          <a href="index.html" class="nav-item flex items-center px-3.5 py-2.5 text-slate-600 hover:bg-slate-50 hover:text-slate-900 rounded-xl font-medium text-sm transition-colors">
            <svg class="w-5 h-5 mr-3 shrink-0" viewBox="0 0 24 24" fill="currentColor"><path d="M6 19h3v-6h6v6h3v-9l-6-4.5L6 10v9zm-2 2V9l8-6 8 6v12h-7v-6h-2v6H4z"/></svg>
            <span>Beranda</span>
          </a>

          <a href="antrean.html" class="nav-item flex items-center px-3.5 py-2.5 text-slate-600 hover:bg-slate-50 hover:text-slate-900 rounded-xl font-medium text-sm transition-colors">
            <svg class="w-5 h-5 mr-3 shrink-0" viewBox="0 0 24 24" fill="currentColor"><path d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7z"/></svg>
            <span>Antrean</span>
          </a>

          <a href="menu_toko.html" class="nav-item flex items-center px-3.5 py-2.5 text-slate-600 hover:bg-slate-50 hover:text-slate-900 rounded-xl font-medium text-sm transition-colors">
            <svg class="w-5 h-5 mr-3 shrink-0" viewBox="0 0 24 24" fill="currentColor"><path d="M11 9H9V2H7v7H5V2H3v7c0 2.12 1.66 3.84 3.75 3.97V22h2.5v-9.03C11.34 12.84 13 11.12 13 9V2h-2v7zm5-3v8h2.5v8H21V2c-2.76 0-5 2.24-5 4z"/></svg>
            <span>Menu Toko</span>
          </a>

          <a href="laporan.html" class="nav-item flex items-center px-3.5 py-2.5 text-slate-600 hover:bg-slate-50 hover:text-slate-900 rounded-xl font-medium text-sm transition-colors">
            <svg class="w-5 h-5 mr-3 shrink-0" viewBox="0 0 24 24" fill="currentColor"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/></svg>
            <span>Laporan</span>
          </a>

          <a href="riwayat.html" class="nav-item flex items-center px-3.5 py-2.5 text-slate-600 hover:bg-slate-50 hover:text-slate-900 rounded-xl font-medium text-sm transition-colors">
            <svg class="w-5 h-5 mr-3 shrink-0" viewBox="0 0 24 24" fill="currentColor"><path d="M13 3a9 9 0 0 0-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42A8.954 8.954 0 0 0 13 21a9 9 0 0 0 0-18zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z"/></svg>
            <span>Riwayat</span>
          </a>
        </nav>
      </div>

      <div class="p-4 shrink-0">
        <div class="bg-blue-50/50 p-4 rounded-2xl border border-blue-100/80 flex flex-col items-start text-left">
          <svg class="w-6 h-6 text-primary mb-2" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path></svg>
          <h3 class="font-bold text-sm mb-1 text-slate-900">Ada pertanyaan?</h3>
          <p class="text-xs text-slate-500 mb-3 leading-relaxed">Kami siap bantu antreanmu.</p>
          <a href="#" class="text-xs font-semibold text-primary hover:underline">Pusat bantuan</a>
        </div>
      </div>
    </aside>

    <div class="flex-1 flex flex-col h-screen overflow-hidden min-w-0">
      <header class="h-16 md:h-20 bg-white/95 md:bg-surface/95 backdrop-blur-xs border-b border-slate-100 md:border-slate-200/60 flex items-center justify-between px-4 md:px-8 shrink-0 z-20">
        <a href="index.html" class="flex md:hidden items-center space-x-2.5">
          <img src="../assets/icon.png" alt="Logo Komart" class="w-9 h-9 rounded-xl object-contain shrink-0" />
          <span class="font-extrabold text-xl text-slate-900 tracking-tight">Komart</span>
        </a>

        <div class="hidden md:flex items-center space-x-3">
          <div class="p-2.5 bg-blue-50 text-primary rounded-xl flex items-center justify-center shrink-0">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M3 9l1-5h16l1 5M3 9v11a1 1 0 001 1h16a1 1 0 001-1V9M3 9h18M9 21V12h6v9" /></svg>
          </div>
          <div>
            <span class="text-xs text-slate-400 font-medium block leading-none mb-1.5">Toko aktif</span>
            <a href="profile.html" class="flex items-center space-x-1.5 cursor-pointer group">
              <span id="header-active-store" class="font-bold text-sm text-slate-900 group-hover:text-primary transition-colors">${storeName} • ${storeLocation}</span>
              <svg class="w-4 h-4 text-slate-500 group-hover:text-primary transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
            </a>
          </div>
        </div>

        <div class="flex items-center space-x-3 md:space-x-4">
          <button type="button" class="relative p-2 text-primary md:text-slate-500 hover:bg-slate-100 rounded-full transition-colors">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>
            <span class="hidden md:block absolute top-2 right-2 w-2 h-2 bg-primary rounded-full"></span>
          </button>

          <a href="profile.html" id="header-profile-link" title="Akun & pengaturan toko" class="flex items-center space-x-2.5 cursor-pointer p-1 pr-2 rounded-full hover:bg-blue-50/70 transition-colors">
            <div class="w-9 h-9 rounded-full bg-blue-100 text-primary font-bold text-xs flex items-center justify-center ring-2 ring-transparent" id="header-avatar-circle">${storeInitials}</div>
            <span id="header-owner-name" class="font-bold text-sm text-slate-800 hidden md:block">${storeName}</span>
          </a>
        </div>
      </header>

      <div id="yield-content" class="flex-1 overflow-y-auto pb-24 md:pb-8">
        ${pageContent}
      </div>
    </div>

    <nav class="md:hidden fixed bottom-0 inset-x-0 z-30 bg-white border-t border-slate-200 px-2 py-2 flex items-center justify-around shadow-[0_-4px_12px_rgba(0,0,0,0.03)]">
      <a href="index.html" class="mobile-nav-item flex flex-col items-center justify-center w-16 py-1 text-slate-500 transition-colors">
        <div class="mobile-nav-icon w-12 h-8 rounded-full flex items-center justify-center mb-1 transition-colors">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/></svg>
        </div>
        <span class="text-[11px] font-medium">Beranda</span>
      </a>

      <a href="antrean.html" class="mobile-nav-item flex flex-col items-center justify-center w-16 py-1 text-slate-500 transition-colors">
        <div class="mobile-nav-icon w-12 h-8 rounded-full flex items-center justify-center mb-1 transition-colors">
          <svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7z"/></svg>
        </div>
        <span class="text-[11px] font-medium">Antrean</span>
      </a>

      <a href="menu_toko.html" class="mobile-nav-item flex flex-col items-center justify-center w-16 py-1 text-slate-500 transition-colors">
        <div class="mobile-nav-icon w-12 h-8 rounded-full flex items-center justify-center mb-1 transition-colors">
          <svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M11 9H9V2H7v7H5V2H3v7c0 2.12 1.66 3.84 3.75 3.97V22h2.5v-9.03C11.34 12.84 13 11.12 13 9V2h-2v7zm5-3v8h2.5v8H21V2c-2.76 0-5 2.24-5 4z"/></svg>
        </div>
        <span class="text-[11px] font-medium">Menu Toko</span>
      </a>

      <a href="laporan.html" class="mobile-nav-item flex flex-col items-center justify-center w-16 py-1 text-slate-500 transition-colors">
        <div class="mobile-nav-icon w-12 h-8 rounded-full flex items-center justify-center mb-1 transition-colors">
          <svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/></svg>
        </div>
        <span class="text-[11px] font-medium">Laporan</span>
      </a>

      <a href="riwayat.html" class="mobile-nav-item flex flex-col items-center justify-center w-16 py-1 text-slate-500 transition-colors">
        <div class="mobile-nav-icon w-12 h-8 rounded-full flex items-center justify-center mb-1 transition-colors">
          <svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M13 3a9 9 0 0 0-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42A8.954 8.954 0 0 0 13 21a9 9 0 0 0 0-18zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z"/></svg>
        </div>
        <span class="text-[11px] font-medium">Riwayat</span>
      </a>
    </nav>

    <div id="demo-toast" class="fixed bottom-20 md:bottom-6 right-4 md:right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl text-xs font-semibold shadow-lg hidden"></div>
  `;

  setActiveMenu();
  syncStoreBannerUI();

  const revealPage = () => {
    document.documentElement.style.visibility = "visible";
    document.documentElement.style.opacity = "1";
  };

  const checkTailwindReady = setInterval(() => {
    const styles = document.querySelectorAll("head style");
    for (const s of styles) {
      if (s.textContent.includes("--color-primary") && s.textContent.includes(".flex")) {
        clearInterval(checkTailwindReady);
        requestAnimationFrame(revealPage);
        return;
      }
    }
  }, 15);

  setTimeout(() => {
    clearInterval(checkTailwindReady);
    revealPage();
  }, 600);
})();

function syncStoreBannerUI() {
  const db = getDB();
  const toggle = document.getElementById("store-toggle");
  const badge = document.getElementById("store-status-badge");
  const text = document.getElementById("store-status-text");

  if (toggle) {
    toggle.checked = !!db.store.isOpen;
  }
  if (badge && text) {
    if (db.store.isOpen) {
      badge.classList.remove("bg-rose-50", "border-rose-200");
      badge.classList.add("bg-emerald-50", "border-emerald-200");
      text.classList.remove("text-rose-700");
      text.classList.add("text-emerald-700");
      text.textContent = "Toko buka";
    } else {
      badge.classList.remove("bg-emerald-50", "border-emerald-200");
      badge.classList.add("bg-rose-50", "border-rose-200");
      text.classList.remove("text-emerald-700");
      text.classList.add("text-rose-700");
      text.textContent = "Toko tutup";
    }
  }

  if (badge && badge.nextElementSibling) {
    badge.nextElementSibling.textContent = `Senin, 12 Oktober • ${db.store.hours || "08:00–16:00"}`;
  }
}

function setActiveMenu() {
  const path = window.location.pathname;
  const currentPage = path.substring(path.lastIndexOf("/") + 1) || "index.html";

  if (currentPage === "profile.html") {
    const avatarCircle = document.getElementById("header-avatar-circle");
    if (avatarCircle) {
      avatarCircle.classList.remove("ring-transparent");
      avatarCircle.classList.add("ring-primary", "bg-primary", "text-white");
    }
  }

  document.querySelectorAll(".nav-item").forEach((item) => {
    if (item.getAttribute("href") === currentPage) {
      item.classList.remove("text-slate-600", "hover:bg-slate-50", "hover:text-slate-900", "font-medium");
      item.classList.add("bg-blue-50", "text-primary", "font-semibold");
    }
  });

  document.querySelectorAll(".mobile-nav-item").forEach((item) => {
    if (item.getAttribute("href") === currentPage) {
      item.classList.remove("text-slate-500");
      item.classList.add("text-primary");
      const iconPill = item.querySelector(".mobile-nav-icon");
      const label = item.querySelector("span");
      if (iconPill) iconPill.classList.add("bg-blue-100/80");
      if (label) {
        label.classList.remove("font-medium");
        label.classList.add("font-bold");
      }
    }
  });
}

function toggleStoreStatus() {
  const toggle = document.getElementById("store-toggle");
  if (!toggle) return;

  const db = getDB();
  db.store.isOpen = toggle.checked;
  saveDB(db);
  syncStoreBannerUI();
  openToast(db.store.isOpen ? "Status toko: Buka" : "Status toko: Tutup");
}

function formatRp(num) {
  return "Rp" + Number(num || 0).toLocaleString("id-ID");
}

function openToast(msg) {
  const toast = document.getElementById("demo-toast");
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.remove("hidden");
  clearTimeout(window._toastTimer);
  window._toastTimer = setTimeout(() => toast.classList.add("hidden"), 2800);
}