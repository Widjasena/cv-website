# CV Website / Personal Portfolio

Website CV modern, interaktif, responsive, dan data-driven menggunakan HTML, CSS, vanilla JavaScript, dan JSON.

## Fitur

- Multi bahasa ID/EN dari `data/id.json` dan `data/en.json`
- Dark mode dan light mode dengan `localStorage`
- Project portfolio dari `data/projects.json`
- Filter project dan modal detail
- Scroll reveal animation, active navigation, scroll progress, typing animation, dan particle background ringan
- Contact form dengan validasi JavaScript dan fake submit
- SEO meta tags, Open Graph tags, lazy-loaded images, dan struktur HTML semantik

## Struktur

```text
cv-website/
├── index.html
├── css/
│   ├── style.css
│   ├── themes.css
│   └── responsive.css
├── js/
│   ├── main.js
│   ├── animations.js
│   ├── theme-toggle.js
│   └── language.js
├── data/
│   ├── en.json
│   ├── id.json
│   └── projects.json
└── assets/
    ├── images/
    ├── icons/
    └── cv.pdf
```

## Cara Menjalankan

Karena project memakai `fetch()` untuk membaca JSON, jalankan lewat local server.

```bash
cd cv-website
python -m http.server 5500
```

Buka `http://localhost:5500`.

## Kustomisasi

- Ubah profil, teks UI, skill, timeline, testimoni, dan kontak di `data/id.json` dan `data/en.json`.
- Ubah daftar project di `data/projects.json`.
- Ganti file `assets/cv.pdf` dengan CV asli.
- Ganti gambar SVG di `assets/images/` dengan foto dan screenshot project asli.
