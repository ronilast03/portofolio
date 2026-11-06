// =====================================================================
// KATALOG LAYANAN (halaman /layanan), bergaya service catalog ITSM.
//
// - id        : kode layanan (SVC-01, SVC-02, ...), juga dipakai di ringkasan tiket
// - slug      : dipakai di URL /contact?layanan=<slug>
// - category  : HARUS sama dengan salah satu TICKET_CATEGORIES di ContactForm.jsx,
//               supaya kategori form tiket terisi otomatis
// - filter    : label tombol filter di halaman Layanan
// - icon      : nama ikon di src/components/common/Icon.jsx
// - includes  : yang didapat klien (3 teratas tampil di kartu, semua tampil di detail)
// - prepare   : yang perlu disiapkan klien
// - estimate  : perkiraan waktu pengerjaan
// - proof     : slug proyek di src/data/projects.js sebagai bukti pengerjaan
// - tools     : (opsional) tool yang dipakai
// =====================================================================

// CEK: daftar layanan, isi, dan terutama ESTIMASI WAKTU masih DRAF dari Claude.
// Sesuaikan dengan layanan dan waktu pengerjaan yang benar-benar kamu sanggupi sebelum dipublikasikan.
export const services = [
  {
    id: "SVC-01",
    slug: "website-company-profile",
    name: "Website company profile",
    category: "Website",
    filter: "Website",
    icon: "globe",
    summary: "Layanan, portofolio, dan kontak usaha atau instansimu dalam satu website yang rapi.",
    description:
      "Website profesional untuk usaha, kontraktor, atau instansi yang ingin mudah ditemukan dan dihubungi calon klien.",
    includes: [
      "Hingga 5 halaman, tampil rapi di HP",
      "Tombol WhatsApp dan form kontak",
      "SEO dasar, domain, dan hosting",
      "Panduan mengubah isi website",
    ],
    prepare: ["Logo dan foto usaha", "Daftar layanan atau produk", "Kontak yang ingin ditampilkan"],
    estimate: "2–3 minggu",
    changeType: "Standard",
    proof: ["company-profile-putra-creative-contractors"],
  },
  {
    id: "SVC-02",
    slug: "aplikasi-web-kustom",
    name: "Aplikasi web kustom",
    category: "Aplikasi web",
    filter: "Aplikasi web",
    icon: "appWindow",
    summary: "Digitalisasi proses kerja: pencatatan, persetujuan, dan laporan, dengan hak akses per peran.",
    description:
      "Cocok untuk instansi atau usaha yang masih mengandalkan buku dan Excel untuk mencatat, menyetujui, dan melaporkan pekerjaan.",
    includes: [
      "Analisis kebutuhan dan alur kerja",
      "Database, login, dan hak akses per peran",
      "Dashboard dan laporan PDF",
      "Dokumentasi dan panduan pemakaian",
    ],
    prepare: [
      "Contoh formulir, buku, atau file Excel yang dipakai sekarang",
      "Daftar peran pengguna (misalnya admin, staf, pimpinan)",
      "Target waktu dan tempat aplikasi akan dipasang",
    ],
    estimate: "4–8 minggu",
    changeType: "Normal",
    proof: ["sistem-informasi-surat", "sipakarla"],
  },
  {
    id: "SVC-03",
    slug: "aplikasi-kasir-umkm",
    name: "Aplikasi kasir untuk UMKM",
    category: "Aplikasi web",
    filter: "Aplikasi web",
    icon: "receipt",
    summary: "Kasir sederhana untuk usaha kecil: order, status pesanan, dan laporan harian.",
    description: "Pengganti buku nota untuk laundry, toko, atau jasa kecil, supaya order dan pendapatan tercatat otomatis.",
    includes: [
      "Input order dengan harga otomatis",
      "Status pesanan dan cetak nota",
      "Laporan pendapatan harian dan bulanan",
      "Pelatihan singkat untuk kasir",
    ],
    prepare: ["Daftar layanan atau produk beserta harga", "Contoh nota yang dipakai sekarang", "Perangkat kasir (HP, tablet, atau laptop)"],
    estimate: "2–4 minggu",
    changeType: "Standard",
    proof: ["aplikasi-kasir-laundry"],
  },
  {
    id: "SVC-04",
    slug: "setup-service-desk",
    name: "Setup service desk sederhana",
    category: "ITSM / Service desk",
    filter: "ITSM",
    icon: "headset",
    summary: "Membantu tim kecil mulai mengelola permintaan IT dengan rapi dan terukur.",
    description:
      "Untuk tim IT kecil yang menerima permintaan lewat chat dan telepon, dan ingin mulai memakai tiket, prioritas, dan SLA.",
    includes: [
      "Kategori, prioritas, dan target SLA",
      "Template balasan dan alur eskalasi",
      "Artikel knowledge base awal",
      "Panduan singkat untuk tim",
    ],
    prepare: ["Jenis permintaan yang paling sering masuk", "Jumlah anggota tim IT", "Tool yang sudah dipakai (jika ada)"],
    estimate: "1–2 minggu",
    changeType: "Standard",
    tools: ["Freshservice", "ServiceDesk Plus"],
    proof: [],
  },
]

// Alur layanan, dari permintaan sampai serah terima
export const serviceFlow = [
  { code: "REQUEST", title: "Ajukan permintaan", text: "Isi form tiket, nomor REQ langsung terbit." },
  { code: "ANALISIS", title: "Diskusi kebutuhan", text: "Saya pelajari kebutuhan dan alur kerjamu." },
  { code: "PERSETUJUAN", title: "Ruang lingkup disepakati", text: "Fitur, estimasi, dan jadwal tertulis jelas." },
  { code: "PENGERJAAN", title: "Dibangun bertahap", text: "Update progres berkala dan sesi uji coba." },
  { code: "SELESAI", title: "Serah terima", text: "Rilis, dokumentasi, dan panduan pemakaian." },
]

export const getServiceBySlug = (slug) => services.find((s) => s.slug === slug)

/** Isi awal form tiket untuk sebuah layanan. */
export const ticketPrefill = (service) =>
  service ? { category: service.category, subject: `[${service.id}] ${service.name}` } : undefined
