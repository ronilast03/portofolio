// =====================================================================
// GANTI DATA DI FILE INI DENGAN DATA ASLI KAMU.
// Semua isi di bawah adalah contoh.
// =====================================================================

export const profile = {
  name: "Roni Lesmana",
  initials: "RL",
  role: "Web Developer & ITSM Enthusiast",
  // Teks singkat di hero (1–2 kalimat).
  intro:
    "Saya membangun website dan aplikasi web yang rapi dan mudah dipakai, sambil mendalami cara tim IT melayani penggunanya lewat praktik ITSM.",
  // Ringkasan di section "Tentang saya" pada Home.
  summary:
    "Saya terbiasa di dua sisi: menulis kode untuk website dan aplikasi web, lalu menangani tiket di service desk. Dari situ saya belajar bahwa software yang baik harus enak dipakai dan mudah didukung.",
  // Paragraf biografi di halaman About.
  bio: [
    "Halo, saya Roni Lesmana. Saya tertarik pada dunia digital sejak lama, berawal dari membuat halaman web sederhana sampai membangun aplikasi kasir untuk usaha kecil.",
    "Saat ini saya mengikuti program MagangHub di Pupuk Sriwidjaja Palembang, Departemen Teknologi Informasi, Bagian Layanan TI. Setiap hari saya bekerja dengan tiket incident dan service request, menulis dokumentasi, dan belajar bagaimana tim IT menjaga layanan tetap berjalan.",
    "Di luar itu saya terus mengasah kemampuan web development dengan React dan Laravel, serta berbagi materi pemrograman web lewat konten edukasi.",
  ],
  // Isi null jika belum punya foto. Contoh: '/images/profile.webp'
  photo: "/images/profile-bw.webp",
  location: "Indonesia",
  remote: true,
  availability: "Terbuka untuk bekerja",
  available: true,
  responseTime: "≤ 1 hari kerja",
  email: "ronilesmana95@gmail.com",
  // Ringkasan singkat di Home.
  facts: [
    { label: "Fokus", value: "Web development, ITSM" },
    { label: "Stack utama", value: "React · Laravel · MySQL", mono: true },
    { label: "Tool ITSM", value: "Fresh Servie, Service DeskPlus" },
    { label: "Sedang", value: "MagangHub ITSM" },
  ],
  focusAreas: ["Website", "Aplikasi web", "ITSM"],
  interests: [
    "Pengembangan web",
    "IT Service Management",
    "Konten edukasi teknologi",
    "Digitalisasi UMKM",
  ],
};

export const socials = [
 
  { label: 'LinkedIn', handle: 'linkedin.com/in/ronilesmana', url: 'https://www.linkedin.com/in/ronilesmana' },
  { label: 'TikTok', handle: '@kodesore', url: 'https://www.tiktok.com/@kodesore' },
]

export const experience = [
  {
    period: "Sep 2026 — sekarang",
    title: "ITSM",
    organization: "PT. Pupuk Sriwidjaja Palembang (Program Maganghub)",
    points: [
      "Menangani tiket incident dan service request di Pushme",
      "Menyusun dokumentasi dan artikel knowledge base",
      "Melaporkan aktivitas dan pembelajaran harian",
    ],
  },
  {
    period: "Jun 2025 — Feb 2026",
    title: "System Analyst & Developer",
    organization: "Universitas Bina Darma (Skripsi)",
    points: [
      "Menganalisis kebutuhan operasional dan merancang arsitektur Sistem Informasi berbasis web dari nol hingga tahap deployment.",
      "Mengembangkan dasbor manajemen data berskala besar dan mengintegrasikan fitur pemetaan wilayah secara realtime.",
      "Menyusun dokumentasi teknis sistem secara komprehensif (mencakup Use Case dan Activity Diagram) guna standarisasi pengembangan.",
    ],
  },
  {
    period: "Feb 2024 — Mar 2024",
    title: "Fullstack Developer",
    organization: "Dinas Perkebebunan Sumatera Selatan (Magang)",
    points: [
      "Membangun aplikasi web pengarsipan digital untuk digitalisasi pencatatan dokumen, sukses meminimalkan risiko kehilangan arsip instansi.",
      "Merancang modul pelacakan status dokumen, sistem disposisi digital, dan fitur generate laporan otomatis untuk efisiensi alur kerja.",
      "Mengamankan kerahasiaan data internal instansi melalui perancangan basis data relasional dan implementasi Role- Based Access Control (RBAC).",
    ],
  },
  {
    period: "Feb 2023 — sekarang",
    title: "Frontend Developer",
    organization: "PT. Putra Creative Contractors (Freelance)",
    points: [
      "Merancang dan mengembangkan website company profile yang responsif dan interaktif menggunakan ekosistem React.js",
      "Mengoptimalkan antarmuka pengguna (UI) untuk memastikan performa yang cepat dan aksesibilitas yang baik di berbagai perangkat.",
    ],
  },
];

export const education = [
  {
    period: "2022 — 2026",
    title: "S1 Sistem Informasi",
    organization: "Universitas Bina Darma",
    points: ["Fokus pada pengembangan web dan manajemen layanan TI"],
  },
  
];
