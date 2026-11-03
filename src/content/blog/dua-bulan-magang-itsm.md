---
title: "Dua Bulan Magang di Layanan TI: Apa yang Saya Pelajari dari Menangani Tiket"
slug: dua-bulan-magang-itsm
description: "Catatan jujur seorang web developer yang magang di service desk: rutinitas harian, kesalahan pertama, dan pelajaran yang mengubah cara saya membuat aplikasi."
date: 2026-11-03
updatedAt:
cover: /images/blog/dua-bulan-magang-itsm.jpg
category: Pengalaman
tags: [magang, itsm, service-desk, karier]
published: true
author: Roni Lesmana
---

<!--
=====================================================================
DRAF LENGKAP — belum tampil di website karena published: false.

Sebagian besar isi diambil dari data yang sudah ada di website kamu
(bio, pengalaman, ringkasan). Bagian yang berupa CERITA (tiket pertama,
kesalahan, dll.) adalah perkiraan saya yang umum terjadi di service desk.
Setiap bagian seperti itu diberi komentar "CEK" di dekatnya: ganti
dengan kejadian yang benar-benar kamu alami, atau hapus.
Cari "CEK" di VS Code (Ctrl+F) untuk menemukan semuanya.
=====================================================================
-->

Dua bulan lalu, hari-hari saya lebih banyak dihabiskan di depan kode: membangun halaman web, merapikan tampilan, dan memperbaiki bug. Sekarang setiap pagi saya membuka antrean tiket. Ternyata menangani masalah orang lain mengajarkan banyak hal yang tidak pernah saya dapat dari menulis kode saja.

Tulisan ini adalah catatan dua bulan pertama saya magang di bidang IT Service Management (ITSM): apa yang saya kerjakan, kesalahan yang saya buat, dan bagaimana pengalaman ini mengubah cara saya melihat aplikasi yang saya bangun.

## Kenapa saya memilih magang di bidang ITSM

Latar belakang saya adalah web development. Saya terbiasa membuat aplikasi seperti sistem kasir laundry, sistem informasi surat, dan website company profile. Selama ini saya hampir selalu berada di sisi *pembuat*.

Lewat program MagangHub, saya mendapat kesempatan bergabung di Departemen Teknologi Informasi, tepatnya di Bagian Layanan TI. Saya tertarik karena ingin tahu apa yang terjadi *setelah* sebuah aplikasi dipakai banyak orang: siapa yang membantu ketika pengguna kesulitan, dan bagaimana masalah itu dicatat serta diselesaikan.

Awalnya saya membayangkan pekerjaan ini sebatas "memperbaiki komputer yang rusak". Ternyata jauh lebih terstruktur. Ada proses, ada prioritas, dan setiap permintaan punya jejak yang bisa ditelusuri. <!-- CEK: sesuaikan dengan ekspektasi awalmu yang sebenarnya -->

## Seperti apa satu hari di service desk

Rutinitas saya kurang lebih seperti ini:

- **Membuka antrean tiket.** Hal pertama yang saya lakukan adalah melihat tiket baru dan tiket yang masih berjalan, lalu memastikan tidak ada yang terlewat.
- **Menangani incident dan service request.** Sebagian besar waktu habis untuk dua jenis tiket ini, mulai dari kendala akses dan akun sampai permintaan perangkat atau aplikasi. <!-- CEK: sebutkan jenis permintaan yang paling sering kamu temui, tanpa data internal -->
- **Menulis dokumentasi.** Masalah yang sering berulang saya catat menjadi artikel knowledge base, supaya penyelesaiannya bisa dipakai lagi oleh siapa pun di tim.
- **Mengisi laporan harian.** Setiap hari saya menuliskan aktivitas, pembelajaran yang diperoleh, dan kendala yang dialami. Kebiasaan kecil ini ternyata membantu saya melihat perkembangan diri dari minggu ke minggu.

## Tiket pertama yang saya tangani

Tiket pertama saya terlihat sederhana: seorang pengguna tidak bisa masuk ke salah satu aplikasi kantor. Saya langsung berasumsi masalahnya ada di password, lalu menyarankan reset. <!-- CEK: ganti dengan tiket pertamamu yang sebenarnya (samarkan detailnya) -->

Setelah ditelusuri bersama pembimbing, ternyata masalahnya bukan di password, melainkan di hak akses akunnya. Dari situ saya belajar satu hal penting: **jangan menebak sebelum mengumpulkan informasi.** Sekarang saya selalu bertanya dulu: apa pesan error yang muncul, sejak kapan terjadi, dan apakah pengguna lain mengalami hal yang sama.

## Incident dan service request itu berbeda, dan itu penting

Sebelum magang, bagi saya semua tiket sama saja: ada masalah, selesaikan. Di ITSM, tiket dibedakan setidaknya menjadi dua:

- **Incident**: ada layanan yang terganggu atau rusak. Contohnya aplikasi tidak bisa dibuka atau jaringan terputus.
- **Service request**: pengguna meminta sesuatu yang standar, tanpa ada yang rusak. Contohnya membuat akun baru, meminta akses folder, atau meminta instalasi software.

Pembedaan ini menentukan cara penanganan dan prioritasnya. Incident yang mengganggu banyak orang harus segera ditangani, sedangkan service request bisa mengikuti alur persetujuan dan jadwal yang sudah ditentukan.

## Tiga pelajaran terbesar

### 1. Catatan tiket harus bisa dilanjutkan orang lain

Awalnya catatan saya terlalu singkat, misalnya hanya "sudah dicek". Sekarang saya selalu menulis tiga hal: **gejalanya apa**, **apa yang sudah dicoba**, dan **apa hasilnya**. Dengan begitu, siapa pun yang melanjutkan tiket tidak perlu bertanya ulang ke pengguna.

### 2. Prioritas ditentukan dampak dan urgensi, bukan urutan masuk

Satu perangkat bermasalah di satu meja tidak sama bobotnya dengan sistem yang tidak bisa diakses oleh satu unit kerja. Belajar menilai dampak dan urgensi membuat saya lebih tenang ketika tiket menumpuk, karena saya tahu mana yang harus didahulukan.

### 3. Pengguna butuh kabar, bukan istilah teknis

Pengguna jarang peduli penyebab teknis sebuah masalah. Yang mereka butuhkan adalah kepastian: masalahnya sedang ditangani dan kira-kira kapan selesai. Memberi kabar berkala, walaupun solusinya belum ketemu, membuat pengguna jauh lebih tenang.

## Kesalahan yang pernah saya buat

Di minggu-minggu awal, saya pernah menutup tiket karena menurut saya masalahnya sudah beres, tanpa memastikan dulu ke pengguna. Beberapa jam kemudian tiket itu dibuka kembali karena masalahnya ternyata masih terjadi. <!-- CEK: ganti dengan kesalahan yang benar-benar kamu alami, atau hapus bagian ini -->

Sejak itu saya selalu melakukan konfirmasi sebelum menutup tiket. "Selesai" menurut saya belum tentu selesai menurut pengguna.

## Dari sisi developer: apa yang berubah dalam cara saya membuat aplikasi

Bagian ini yang paling berharga buat saya. Setelah dua bulan berada di sisi yang menerima keluhan, saya mulai melihat aplikasi dengan cara berbeda:

- **Pesan error harus jelas.** Pesan seperti "Terjadi kesalahan" tidak membantu siapa pun. Pesan yang menyebutkan apa yang salah dan apa yang harus dilakukan bisa mencegah satu tiket masuk.
- **Fitur mandiri mengurangi beban tim layanan.** Hal seperti reset password sendiri atau halaman status sederhana bisa menghemat banyak waktu tim support.
- **Log dan jejak aktivitas itu penting.** Saat menelusuri masalah, catatan tentang apa yang terjadi sangat membantu. Sekarang saya lebih memperhatikan pencatatan log di aplikasi yang saya buat.
- **Dokumentasi bukan pekerjaan tambahan.** Panduan singkat untuk pengguna sering kali lebih bermanfaat daripada fitur baru.

> Software yang baik bukan hanya yang berjalan lancar, tapi juga yang mudah dipakai dan mudah didukung ketika ada masalah.

## Tips untuk yang ingin magang di bidang ITSM

- **Pelajari dasar-dasar ITSM sebelum mulai.** Cukup pahami konsep incident, service request, dan change agar cepat menyesuaikan diri.
- **Biasakan menulis dengan rapi.** Catatan tiket, laporan, dan knowledge base adalah bagian besar dari pekerjaan ini.
- **Jangan ragu bertanya.** Lebih baik bertanya ke pembimbing daripada menebak dan membuat tiket dibuka kembali.

## Penutup

Dua bulan ini membuat saya sadar bahwa membangun aplikasi hanyalah setengah cerita. Setengahnya lagi adalah memastikan aplikasi itu bisa terus dipakai dan didukung dengan baik. Di sisa masa magang, saya ingin menulis lebih banyak artikel knowledge base dan mendalami proses ITSM lainnya. <!-- CEK: sesuaikan dengan rencanamu -->

Kalau kamu juga sedang atau akan magang di bidang IT, saya senang mendengar ceritamu lewat [halaman kontak](/contact).

<!--
=====================================================================
CEK SEBELUM TERBIT
[ ] Semua tanda CEK sudah dicek, diganti, atau dihapus
[ ] Tidak ada nama pengguna, nomor tiket, nama sistem internal,
    alamat IP, atau screenshot yang memperlihatkan data perusahaan
[ ] Kalau menambahkan nama perusahaan, pastikan tidak melanggar aturan
    program magang (kalau ragu, tanyakan ke pembimbing)
[ ] Baca ulang dengan suara keras untuk menangkap kalimat yang janggal
[ ] Ubah published: false menjadi true, perbarui date
[ ] Hapus artikel contoh catatan-magang-service-desk.md (topiknya sama)
=====================================================================
-->
