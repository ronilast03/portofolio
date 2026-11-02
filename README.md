# Portfolio Frontend — React + Vite + Tailwind CSS

Frontend website portofolio & blog Roni Lesmana (PRD v1.0).

- **React 19 + Vite** dengan **React Router**
- **Tailwind CSS v4** dengan design token dari PRD §9 (dark/light mode)
- **Motion** untuk animasi halus (mengikuti setelan "kurangi gerakan" di OS)
- **Blog Markdown** di `src/content/blog`, diubah menjadi HTML saat build
- **Prerender** semua halaman publik menjadi HTML statis, plus `sitemap.xml` dan `robots.txt`
- Contact form terhubung ke **Laravel API** (`POST /api/v1/contact`)

## Menjalankan

```bash
npm install
cp .env.example .env      # atur VITE_API_URL dan VITE_SITE_URL
npm run dev               # http://localhost:5173
```

Jalankan juga backend (`php artisan serve` di folder `portfolio-backend`) supaya contact form bisa mengirim pesan.

| Perintah | Fungsi |
|---|---|
| `npm run dev` | Server development dengan hot reload |
| `npm run build` | Build produksi + prerender semua halaman ke `dist/` |
| `npm run build:spa` | Build tanpa prerender (SPA biasa) |
| `npm run preview` | Lihat hasil build. Untuk URL bersih seperti `/about`, pakai `npx sirv dist` |

## Mengisi data kamu

Semua isi bawaan adalah **contoh**. Ganti file-file berikut:

| File | Isi |
|---|---|
| `src/data/profile.js` | Nama, headline, bio, foto, email, sosial media, pengalaman, pendidikan, minat |
| `src/data/skills.js` | Kelompok skill dan levelnya |
| `src/data/projects.js` | Daftar proyek (slug, deskripsi, masalah/solusi, fitur, stack, link) |
| `src/data/site.js` | Judul & deskripsi default SEO, path file CV |
| `src/content/blog/*.md` | Artikel blog |
| `src/pages/Legal/PrivacyPolicyPage.jsx` | Teks kebijakan privasi |

Aset di folder `public/`:

| Path | Keterangan |
|---|---|
| `public/cv/cv-roni-lesmana.pdf` | **Ganti** dengan CV asli (nama file harus sama dengan `site.cvPath`) |
| `public/images/projects/` | Screenshot proyek. Placeholder `.svg` bisa diganti `.webp` 1280×800 |
| `public/images/blog/` | Gambar sampul artikel (opsional) |
| `public/images/og-default.png` | Gambar saat link dibagikan di media sosial (1200×630) |
| `public/icons/favicon.svg` | Favicon |
| `public/images/profile.webp` | Foto profil, lalu isi `photo: '/images/profile.webp'` di `profile.js` |

## Menulis artikel baru

1. Salin `src/content/blog/_template-artikel.md` lalu beri nama sesuai slug, misalnya `belajar-tailwind.md`.
2. Isi frontmatter:

```yaml
---
title: "Belajar Tailwind CSS"
slug: belajar-tailwind          # URL: /blog/belajar-tailwind
description: "Ringkasan untuk SEO dan kartu artikel."
date: 2026-11-10
updatedAt:                      # isi jika artikel diperbarui
cover: /images/blog/belajar-tailwind.webp   # opsional
category: Tutorial
tags: [tailwind, css]
published: true                 # false = tidak ditampilkan
author: Roni Lesmana
---
```

3. Tulis isi dengan Markdown biasa. Heading `##` otomatis masuk daftar isi. Tabel, blok kode (dengan syntax highlight), dan link didukung.
4. Jalankan `npm run build`. Artikel otomatis masuk halaman blog, sitemap, dan prerender.

File yang namanya diawali `_` tidak pernah ditampilkan.

## Struktur folder

```
portfolio-frontend/
├── plugins/vite-plugin-markdown.js   Markdown -> HTML saat build
├── scripts/prerender.mjs             Prerender halaman, sitemap.xml, robots.txt
├── public/                           cv/, images/, icons/
└── src/
    ├── components/
    │   ├── common/     Seo, Breadcrumb, PageHeader, Icon, Image, Skeleton, EmptyState, CvButton, PageTransition
    │   ├── layout/     Layout, Navbar (+ mobile menu), Footer, ThemeToggle
    │   └── sections/   Hero, AvailabilityTicket, ProjectCard, ArticleCard, ArticleBody, ContactForm, Timeline, SkillGroups, ShareButtons, ...
    ├── content/blog/   Artikel Markdown
    ├── data/           profile.js, skills.js, projects.js, site.js
    ├── hooks/          useTheme, useHydrated
    ├── pages/          Home, About, Projects, Blog, Contact, Legal, NotFound
    ├── routes/         AppRoutes.jsx (sitemap PRD §5)
    ├── services/       api.js, contactService.js
    ├── utils/          blog.js, date.js, validation.js, cn.js
    ├── App.jsx
    ├── main.jsx        Entry browser (hydrate)
    └── entry-server.jsx Entry prerender
```

## Rute

| URL | Halaman |
|---|---|
| `/` | Home |
| `/about` | About |
| `/projects` | Daftar proyek (filter `?kategori=`) |
| `/projects/:slug` | Detail proyek |
| `/blog` | Daftar artikel (filter `?q=`, `?kategori=`, `?tag=`) |
| `/blog/:slug` | Detail artikel |
| `/contact` | Kontak |
| `/privacy-policy` | Kebijakan privasi |
| lainnya | 404 |

## SEO

Setiap halaman memasang title, meta description, canonical, Open Graph, Twitter card, dan JSON-LD (Person, WebSite, BreadcrumbList, BlogPosting, CreativeWork).
Saat `npm run build`, semua tag ini dan isi halaman ditulis langsung ke HTML, sehingga mesin pencari tidak perlu menjalankan JavaScript.

**Penting:** atur `VITE_SITE_URL` ke domain asli sebelum build produksi, karena dipakai untuk canonical, Open Graph, dan sitemap.

## Deploy

**Vercel**: import repo, framework "Vite". `vercel.json` sudah mengatur build command, output `dist`, clean URL, dan header keamanan.
**Netlify**: `netlify.toml` sudah disiapkan. URL yang tidak ada diarahkan ke `404.html` hasil prerender.

Atur environment variable `VITE_API_URL` (misalnya `https://api.ronilesmana.com`) dan `VITE_SITE_URL` di dashboard hosting.
Di backend, isi `FRONTEND_URL` dengan domain frontend supaya CORS mengizinkan request dari website.
