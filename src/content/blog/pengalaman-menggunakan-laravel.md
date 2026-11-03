---
title: "Pengalaman Pertama Membangun REST API dengan Laravel"
slug: pengalaman-menggunakan-laravel
description: "Membuat endpoint contact form lengkap dengan validasi dan rate limiting di Laravel."
date: 2026-10-20
updatedAt: 2026-10-24
cover: /images/blog/pengalaman-menggunakan-laravel.jpg
category: Catatan Belajar
tags: [laravel, php, api]
published: true
author: Roni Lesmana
---

Untuk website portofolio ini saya butuh satu endpoint sederhana: menerima pesan dari contact form. Ternyata Laravel membuat prosesnya cukup ringkas.

## Route dan controller

Semua route API saya letakkan di `routes/api.php` dengan prefix versi.

```php
Route::prefix('v1')->group(function () {
    Route::get('/health', HealthController::class);
    Route::post('/contact', [ContactController::class, 'store'])
        ->middleware('throttle:contact');
});
```

Middleware `throttle:contact` membatasi jumlah request per IP. Ini lapisan pertama melawan spam.

## Validasi dengan Form Request

Validasi saya pisahkan ke class `StoreContactMessageRequest` supaya controller tetap bersih.

```php
public function rules(): array
{
    return [
        'name'    => ['required', 'string', 'max:100'],
        'email'   => ['required', 'email', 'max:150'],
        'subject' => ['required', 'string', 'max:200'],
        'message' => ['required', 'string', 'min:10', 'max:2000'],
    ];
}
```

Kalau validasi gagal, API mengembalikan status **422** beserta pesan error per field.

## Status code yang saya pakai

| Kondisi | Status |
|---|---|
| Pesan tersimpan | 201 |
| Input tidak valid | 422 |
| Terlalu banyak request | 429 |
| Kesalahan server | 500 |

## Catatan

Respons error tidak boleh membocorkan detail internal seperti stack trace. Pastikan `APP_DEBUG=false` di produksi.
