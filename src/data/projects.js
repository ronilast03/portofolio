// =====================================================================
// GANTI dengan proyek asli kamu.
// - slug     : dipakai di URL /projects/:slug (huruf kecil, pakai tanda -)
// - thumbnail: taruh gambar di public/images/projects/ (disarankan .webp, rasio 16:10)
// - gallery  : daftar gambar tambahan untuk halaman detail (boleh kosong)
// - github / demo: isi null jika tidak ada
//
// Studi kasus bergaya change request (ITSM). Semua opsional: bagian yang kosong tidak ditampilkan.
// - changeId   : nomor change, urut dari proyek paling lama (CHG-PRJ-0001, CHG-PRJ-0002, ...)
// - changeType : "Standard" (rutin, risiko kecil) | "Normal" (perlu perencanaan)
// - risk       : "Rendah" | "Sedang" | "Tinggi" (risiko keseluruhan)
// - status     : "Implemented" (default) | "In progress"
// - stage      : untuk "In progress": jumlah tahap yang sudah selesai (0-7)
// - outOfScope : hal yang sengaja TIDAK dikerjakan
// - risks      : [{ risk, level: "Rendah" | "Sedang" | "Tinggi", mitigation }]
// - plan       : [{ step, detail }] langkah implementasi
// - rollback   : rencana jika rilis bermasalah
// - review     : { worked: "yang berhasil", learned: "yang dipelajari" }
// =====================================================================

export const projects = [
  {
    slug: "aplikasi-kasir-laundry",
    title: "Aplikasi Kasir Laundry",
    category: "App",
    year: "2026",
    featured: true,
    changeId: "CHG-PRJ-0003",
    changeType: "Standard",
    risk: "Rendah",
    thumbnail: "/images/projects/kasir-laundry-cover.webp",
    summary:
      "Aplikasi kasir untuk usaha laundry: pencatatan order, status cucian, dan laporan harian.",
    stack: ["React Native", "Tailwind CSS", "Expo"],
    problem:
      "Pencatatan order laundry masih di buku tulis. Pemilik sulit melacak cucian yang belum diambil dan menghitung pendapatan harian.",
    solution:
      "Aplikasi kasir berbasis web yang berjalan di browser kasir. Setiap order mendapat nomor nota, status proses, dan tercatat otomatis di laporan.",
    features: [
      "Input order per kilo atau per item dengan harga otomatis",
      "Status cucian: diterima, dicuci, siap diambil, selesai",
      "Cetak nota dan pengingat cucian yang belum diambil",
      "Laporan pendapatan harian dan bulanan",
    ],
    gallery: [
      {
        src: "/images/projects/kasir-laundry-beranda.webp",
        caption: "Halaman kasir",
      },
      {
        src: "/images/projects/kasir-laundry-statistik.webp",
        caption: "Halaman menu",
      },
    ],
    github: null,
    demo: null,
  },
  {
    slug: "sipakarla",
    title: "Sipakarla - Sistem Pemantauan Kebakaran Hutan & Lahan",
    category: "Website",
    year: "2026",
    featured: true,
    changeId: "CHG-PRJ-0004",
    changeType: "Normal",
    risk: "Sedang",
    thumbnail: "/images/projects/sipakarla-cover.webp",
    summary:
      "Sistem informasi pelaporan dan pemantauan titik api kebakaran hutan dan lahan secara real-time.",
    stack: ["React", "Vite", "Tailwind CSS", "Laravel 12", "MySQL", "Leaflet"],
    problem:
      "Laporan kebakaran dari masyarakat sering terlambat sampai ke petugas, dan lokasi titik api sulit dipantau dalam satu tempat.",
    solution:
      "Platform web tempat masyarakat melaporkan kejadian beserta foto dan koordinat. Admin memverifikasi laporan, petugas lapangan menindaklanjuti, dan pimpinan memantau lewat peta serta laporan eksekutif.",
    features: [
      "Pelaporan kejadian dengan bukti foto dan titik koordinat",
      "Peta sebaran hotspot real-time (titik api aktif dan sudah padam)",
      "Verifikasi laporan dan pemantauan penanganan oleh petugas",
      "Dashboard statistik dan grafik tren kebakaran mingguan",
      "Laporan eksekutif PDF berdasarkan periode dan kategori",
      "Hak akses per peran: Masyarakat, Admin, Petugas Lapangan, Pimpinan",
    ],
    // CEK: isi di bawah ini masih DRAF dari Claude. Ganti dengan pengalaman aslimu sebelum dipublikasikan.
    outOfScope: [
      "Aplikasi mobile native (Android/iOS)",
      "Data hotspot otomatis dari satelit",
      "Notifikasi SMS ke petugas",
    ],
    risks: [
      {
        risk: "Koordinat dari HP tidak akurat",
        level: "Tinggi",
        mitigation: "Pelapor bisa menggeser titik di peta, dan foto wajib dilampirkan",
      },
      {
        risk: "Laporan palsu atau ganda",
        level: "Sedang",
        mitigation: "Laporan baru tampil di peta setelah diverifikasi admin",
      },
      {
        risk: "Data antarperan tercampur",
        level: "Rendah",
        mitigation: "Middleware hak akses di setiap endpoint Laravel",
      },
    ],
    plan: [
      { step: "Analisis kebutuhan", detail: "alur kerja 4 peran dan data laporan" },
      { step: "Database dan REST API", detail: "Laravel 12, MySQL" },
      { step: "Antarmuka dan peta", detail: "React, Vite, Tailwind CSS, Leaflet" },
      { step: "Pengujian per peran", detail: "skenario lapor, verifikasi, tindak lanjut" },
      { step: "Go-live", detail: "rilis dan serah terima" },
    ],
    rollback:
      "Database dicadangkan sebelum setiap migrasi. Jika rilis bermasalah, aplikasi dikembalikan ke versi sebelumnya dan cadangan dipulihkan, sehingga laporan yang sudah masuk tidak hilang.",
    review: {
      worked: "Satu alur dari laporan masyarakat sampai tindak lanjut petugas, terlihat di satu peta.",
      learned: "Hak akses per peran lebih mudah dirancang sejak awal daripada ditambahkan belakangan.",
    },
    gallery: [
      {
        src: "/images/projects/sipakarla-login.webp",
        caption: "Halaman login",
      },
      {
        src: "/images/projects/sipakarla-dashboard-masyarakat.webp",
        caption: "Dashboard masyarakat",
      },
      {
        src: "/images/projects/sipakarla-riwayat-laporan.webp",
        caption: "Arsip laporan masyarakat",
      },
      {
        src: "/images/projects/sipakarla-dashboard-admin.webp",
        caption: "Dashboard admin",
      },
      {
        src: "/images/projects/sipakarla-peta-hotspot.webp",
        caption: "Peta sebaran hotspot",
      },
      {
        src: "/images/projects/sipakarla-laporan-eksekutif.webp",
        caption: "Laporan eksekutif (pimpinan)",
      },
    ],
    github: null,
    demo: null,
  },

  {
    slug: "sistem-informasi-surat",
    title: "Sistem Informasi Surat Masuk & Keluar",
    category: "Web App",
    year: "2024",
    featured: false,
    changeId: "CHG-PRJ-0002",
    changeType: "Normal",
    risk: "Sedang",
    thumbnail: "/images/projects/surat-cover.webp",
    summary:
      "Aplikasi pengelolaan surat masuk, surat keluar, disposisi, dan buku agenda untuk Subbag Perencanaan Dinas Perkebunan.",
    stack: ["Laravel", "MySQL"],
    problem:
      "Pencatatan surat masuk dan keluar masih manual sehingga surat sulit dilacak, disposisi lambat, dan rekap buku agenda memakan waktu.",
    solution:
      "Aplikasi web yang mencatat setiap surat beserta nomor agenda, klasifikasi, dan lampiran PDF, lengkap dengan disposisi dan buku agenda yang bisa disaring lalu dicetak.",
    features: [
      "Pencatatan surat masuk dan surat keluar beserta lampiran file",
      "Disposisi surat ke bagian terkait",
      "Buku agenda dengan filter rentang tanggal dan cetak laporan",
      "Dashboard ringkasan harian dan grafik transaksi surat",
      "Kode klasifikasi surat dan data referensi",
      "Galeri surat dan pencarian cepat",
    ],
    gallery: [
      { src: "/images/projects/surat-login.webp", caption: "Halaman login" },
      { src: "/images/projects/surat-dashboard.webp", caption: "Dashboard" },
      {
        src: "/images/projects/surat-surat-masuk.webp",
        caption: "Daftar surat masuk",
      },
      {
        src: "/images/projects/surat-tambah-surat.webp",
        caption: "Form tambah surat masuk",
      },
      {
        src: "/images/projects/surat-buku-agenda.webp",
        caption: "Buku agenda surat masuk",
      },
      {
        src: "/images/projects/surat-cetak-agenda.webp",
        caption: "Cetak buku agenda",
      },
    ],
    github: null,
    demo: null,
  },

  {
    slug: "company-profile-putra-creative-contractors",
    title: "Company Profile PT. Putra Creative Contractors",
    category: "Website",
    year: "2023",
    featured: true,
    changeId: "CHG-PRJ-0001",
    changeType: "Standard",
    risk: "Rendah",
    thumbnail: "/images/projects/compro-cover.webp",
    summary:
      "Website company profile untuk kontraktor desain dan konstruksi di Palembang: menara, kubah, interior, GRC, dan kaligrafi.",
    stack: ["React", "Tailwind CSS", "JavaScript"],
    problem:
      "Perusahaan belum punya media online yang menampilkan layanan, pengalaman, dan hasil kerja, sehingga calon klien sulit menilai kredibilitas dan menghubungi perusahaan.",
    solution:
      "Website company profile dengan tampilan elegan hitam-emas yang menonjolkan layanan, profil perusahaan, tim, dan portofolio proyek, dilengkapi jalur kontak cepat lewat WhatsApp dan form email.",
    features: [
      "Hero dengan CTA katalog harga dan WhatsApp",
      "Profil perusahaan dan ringkasan pengalaman proyek",
      "Halaman tim: office, pengawas, dan lapangan",
      "Halaman project dan blog",
      "Form kontak serta tombol WhatsApp melayang di setiap halaman",
      "Tampilan responsif untuk desktop dan mobile",
    ],
    gallery: [
      { src: "/images/projects/compro-home.webp", caption: "Halaman utama" },
      {
        src: "/images/projects/compro-about.webp",
        caption: "Tentang perusahaan",
      },
      { src: "/images/projects/compro-tim.webp", caption: "Tim perusahaan" },
      { src: "/images/projects/compro-kontak.webp", caption: "Halaman kontak" },
    ],
    github: null,
    demo: null,
  },
];

export const getProjectBySlug = (slug) => projects.find((p) => p.slug === slug)

/** Proyek sebelum & sesudahnya menurut nomor change (untuk navigasi di halaman detail). */
export function adjacentProjects(slug) {
  const ordered = [...projects].sort((a, b) => String(a.changeId ?? a.year).localeCompare(String(b.changeId ?? b.year)))
  const i = ordered.findIndex((p) => p.slug === slug)
  return { prev: ordered[i - 1] ?? null, next: ordered[i + 1] ?? null }
}
export const featuredProjects = (limit = 3) => projects.filter((p) => p.featured).slice(0, limit)
export const projectCategories = () => [...new Set(projects.map((p) => p.category))]
