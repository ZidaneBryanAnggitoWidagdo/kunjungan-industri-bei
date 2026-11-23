# Digital Documentation of Industrial Visit — Bursa Efek Indonesia

Website dokumentasi digital kunjungan industri ke **Bursa Efek Indonesia (IDX Tower)** dan **Museum Bank Indonesia**.

- **Nama:** Zidane Bryan Anggito Widagdo
- **Kelas:** XI RPL 1
- **Tanggal kunjungan:** Kamis, 19 November 2026
- **Tema proyek:** *Digital Documentation of Industrial Visit – Bursa Efek Indonesia*

## Isi Website

1. **Landing page** — hero animasi candlestick, ticker fakta bursa, dan identitas pembuat.
2. **Profil BEI** — peran bursa, produk yang diperdagangkan, dan garis waktu sejarah 1912–2008.
3. **Rangkaian kegiatan** — 7 tahap kunjungan dari keberangkatan sampai penutupan.
4. **Galeri foto** — 13 foto dokumentasi pribadi dengan filter kategori dan lightbox.
5. **Video vlog** — vlog kunjungan terintegrasi (2 menit 56 detik) + tautan unduh.
6. **Kesimpulan & refleksi** — tiga simpulan utama dan refleksi pribadi.

## Teknologi

- HTML5, CSS3, dan JavaScript murni (tanpa framework).
- Font self-hosted (Space Grotesk, Inter, IBM Plex Mono) sehingga bisa dibuka **offline**.
- Animasi canvas candlestick, reveal-on-scroll, count-up statistik, filter galeri, dan lightbox.

## Cara Menjalankan

Buka `index.html` langsung di browser, atau jalankan server lokal:

```bash
python3 -m http.server 8000
# lalu buka http://localhost:8000
```

## Struktur Folder

```
kunjungan-bei/
├── index.html
├── css/
│   ├── fonts.css        # @font-face self-hosted
│   └── style.css        # seluruh gaya website
├── js/
│   └── main.js          # interaksi: nav, galeri, lightbox, canvas, dsb.
└── assets/
    ├── fonts/           # file woff2 (subset latin)
    ├── img/             # hero, profil, poster, favicon, galeri (13 foto)
    └── video/           # vlog-kunjungan-bei.mp4
```

## Catatan

- Seluruh foto dan video merupakan dokumentasi pribadi yang diambil langsung selama kunjungan.
- Angka statistik bursa (emiten & kapitalisasi) merujuk data publik IDX per pertengahan 2026.
