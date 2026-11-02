---
title: "Belajar React JS dari Nol: Catatan Minggu Pertama"
slug: belajar-react-js
description: "Komponen, props, dan state dijelaskan dengan contoh kecil yang bisa langsung dicoba."
date: 2026-10-28
updatedAt:
cover:
category: Tutorial
tags: [react, javascript]
published: true
author: Roni Lesmana
---

Minggu ini saya mulai serius belajar React. Tulisan ini merangkum tiga konsep yang paling sering muncul: **komponen**, **props**, dan **state**.

## Komponen adalah fungsi

Di React, komponen hanyalah fungsi JavaScript yang mengembalikan tampilan. Nama fungsinya diawali huruf kapital.

```jsx
function Salam() {
  return <h1>Halo, dunia!</h1>;
}
```

Komponen bisa dipakai berulang seperti tag HTML: `<Salam />`.

## Props untuk mengirim data

Props adalah data yang dikirim dari komponen induk ke komponen anak. Props bersifat **read-only**, jadi komponen anak tidak boleh mengubahnya.

```jsx
function Salam({ nama }) {
  return <h1>Halo, {nama}!</h1>;
}

<Salam nama="Roni" />
```

## State untuk data yang berubah

Kalau data perlu berubah karena interaksi pengguna, gunakan `useState`.

```jsx
import { useState } from "react";

function Counter() {
  const [jumlah, setJumlah] = useState(0);
  return (
    <button onClick={() => setJumlah(jumlah + 1)}>
      Diklik {jumlah} kali
    </button>
  );
}
```

## Yang saya pelajari

- Pecah tampilan menjadi komponen kecil sejak awal.
- Props mengalir ke bawah, event mengalir ke atas.
- Jangan simpan di state sesuatu yang bisa dihitung dari data lain.

Minggu depan saya akan lanjut ke `useEffect` dan mengambil data dari API.
