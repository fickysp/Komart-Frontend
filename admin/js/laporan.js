const reportDataByPeriod = {
  today: {
    subtitle: "Distribusi omzet per jam operasional (Hari ini)",
    kpis: [
      { label: "Total pendapatan", value: "Rp1.840.000", delta: "+12% dari kemarin", positive: true },
      { label: "Total transaksi", value: "48 pesanan", delta: "+8 dari kemarin", positive: true },
      { label: "Rata-rata keranjang", value: "Rp38.300", delta: "+Rp2.100", positive: true },
      { label: "Pesanan dibatalkan", value: "2 pesanan", delta: "4.1% rasio batal", positive: false }
    ],
    bars: [
      { label: "09:00", amount: 180000, pct: 35 },
      { label: "10:00", amount: 260000, pct: 50 },
      { label: "11:00", amount: 340000, pct: 68 },
      { label: "12:00", amount: 520000, pct: 100 },
      { label: "13:00", amount: 390000, pct: 76 },
      { label: "14:00", amount: 150000, pct: 30 }
    ],
    topMenus: [
      { name: "Nasi Goreng Kampung", sold: 24, revenue: 768000 },
      { name: "Es Teh Manis", sold: 32, revenue: 256000 },
      { name: "Soto Betawi", sold: 16, revenue: 560000 },
      { name: "Es Jeruk Peras", sold: 14, revenue: 168000 }
    ]
  },
  week: {
    subtitle: "Tren pendapatan 7 hari terakhir",
    kpis: [
      { label: "Total pendapatan", value: "Rp12.450.000", delta: "+9.4% vs minggu lalu", positive: true },
      { label: "Total transaksi", value: "318 pesanan", delta: "+24 pesanan", positive: true },
      { label: "Rata-rata keranjang", value: "Rp39.150", delta: "+Rp1.400", positive: true },
      { label: "Pesanan dibatalkan", value: "9 pesanan", delta: "2.8% rasio batal", positive: true }
    ],
    bars: [
      { label: "Sen", amount: 1650000, pct: 72 },
      { label: "Sel", amount: 1520000, pct: 65 },
      { label: "Rab", amount: 1890000, pct: 82 },
      { label: "Kam", amount: 1740000, pct: 75 },
      { label: "Jum", amount: 2300000, pct: 100 },
      { label: "Sab", amount: 1950000, pct: 85 }
    ],
    topMenus: [
      { name: "Nasi Goreng Kampung", sold: 158, revenue: 5056000 },
      { name: "Soto Betawi", sold: 112, revenue: 3920000 },
      { name: "Es Teh Manis", sold: 210, revenue: 1680000 },
      { name: "Mie Tek-Tek", sold: 64, revenue: 1792000 }
    ]
  },
  month: {
    subtitle: "Rekapitulasi penjualan bulan berjalan",
    kpis: [
      { label: "Total pendapatan", value: "Rp48.920.000", delta: "+15.2% vs bulan lalu", positive: true },
      { label: "Total transaksi", value: "1.264 pesanan", delta: "+142 pesanan", positive: true },
      { label: "Rata-rata keranjang", value: "Rp38.700", delta: "+Rp900", positive: true },
      { label: "Pesanan dibatalkan", value: "31 pesanan", delta: "2.4% rasio batal", positive: true }
    ],
    bars: [
      { label: "Mgg 1", amount: 11200000, pct: 78 },
      { label: "Mgg 2", amount: 12450000, pct: 86 },
      { label: "Mgg 3", amount: 14350000, pct: 100 },
      { label: "Mgg 4", amount: 10920000, pct: 76 }
    ],
    topMenus: [
      { name: "Nasi Goreng Kampung", sold: 612, revenue: 19584000 },
      { name: "Soto Betawi", sold: 445, revenue: 15575000 },
      { name: "Es Teh Manis", sold: 840, revenue: 6720000 },
      { name: "Es Jeruk Peras", sold: 390, revenue: 4680000 }
    ]
  }
};

let currentReportPeriod = "today";

function setReportPeriod(period) {
  currentReportPeriod = period;
  document.querySelectorAll(".rep-period-btn").forEach(btn => {
    btn.className = btn.dataset.period === period
      ? "rep-period-btn px-3.5 py-2 rounded-xl text-xs font-bold bg-blue-100 text-primary transition-colors cursor-pointer"
      : "rep-period-btn px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer";
  });
  renderReport();
}

function renderReport() {
  const data = reportDataByPeriod[currentReportPeriod];
  document.getElementById("report-chart-sub").textContent = data.subtitle;

  document.getElementById("report-kpi-grid").innerHTML = data.kpis.map(k => `
    <div class="bg-white p-4 md:p-5 rounded-2xl border border-border/80 shadow-2xs">
      <span class="text-xs font-medium text-slate-500">${k.label}</span>
      <div class="text-xl md:text-2xl font-extrabold text-slate-900 mt-2 mb-1">${k.value}</div>
      <div class="text-[11px] font-semibold ${k.positive ? 'text-emerald-600' : 'text-rose-600'}">${k.delta}</div>
    </div>
  `).join("");

  document.getElementById("report-bar-chart").innerHTML = data.bars.map(b => `
    <div class="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
      <span class="text-[10px] font-bold text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity">${formatRp(b.amount)}</span>
      <div class="w-full max-w-[44px] bg-blue-100 group-hover:bg-primary rounded-t-xl transition-all" style="height: ${b.pct}%"></div>
      <span class="text-[11px] font-semibold text-slate-500 pb-2">${b.label}</span>
    </div>
  `).join("");

  document.getElementById("report-top-menus").innerHTML = data.topMenus.map((m, idx) => `
    <div class="flex items-center justify-between gap-3 p-3 rounded-xl bg-slate-50/80 border border-border/60">
      <div class="flex items-center gap-3 min-w-0">
        <span class="w-7 h-7 rounded-lg bg-blue-100 text-primary font-extrabold text-xs flex items-center justify-center shrink-0">#${idx + 1}</span>
        <div class="min-w-0">
          <div class="font-bold text-xs sm:text-sm text-slate-900 truncate">${m.name}</div>
          <div class="text-[11px] text-slate-500">${m.sold} porsi terjual</div>
        </div>
      </div>
      <span class="font-extrabold text-xs sm:text-sm text-slate-900 shrink-0">${formatRp(m.revenue)}</span>
    </div>
  `).join("");
}

renderReport();