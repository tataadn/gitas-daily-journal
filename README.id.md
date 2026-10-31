# 🌸 Gita's Daily Journal

*English version: see [README.md](README.md).*

Aplikasi buku harian pribadi berbasis web. Dibuat cuma pakai **HTML, CSS, dan JavaScript** (plus Bootstrap), tanpa database dan tanpa server. Tampilannya seperti buku terbuka dengan tema biru pastel, putih, dan sedikit floral, lengkap dengan sampul yang bisa dibuka dan lagu dari YouTube di tiap entri.

## Fitur

- **Sampul buku** dengan tombol "Buka Diary" dan animasi sampul terbuka. Tombol "Tutup buku" untuk kembali ke sampul.
- **Tulis entri**: tanggal, judul, isi, dan mood (pilih emoji).
- **Daftar isi** di halaman kiri, urut dari yang terbaru, plus kolom pencarian (judul dan isi).
- **Lagu hari ini**: tempel link YouTube, lagu diputar sebagai musik saja (tanpa tampilan video), dengan tombol putar/jeda, slider durasi, dan volume.
- **Simpan, edit, dan hapus** entri.
- **Backup dan Restore** lewat file JSON.
- **Mode terang dan gelap** (tombol 🌙/☀️), pilihannya diingat di browser.
- **Responsif**: di HP, buku jadi satu halaman dengan tab "Daftar Isi" dan "Tulis".

## Isi folder

```
diary-bootstrap/
├── index.html           # struktur halaman + sampul (SVG)
├── style.css            # tema, warna, dan tampilan buku
├── script.js            # semua logika aplikasi
├── favicon.svg          # ikon tab browser
├── favicon-32.png       # ikon cadangan
├── apple-touch-icon.png # ikon untuk layar utama iPhone/iPad
├── icon-192.png         # ikon cadangan (untuk keperluan PWA nanti)
└── README.md
```

## Cara menjalankan

Butuh **koneksi internet** karena Bootstrap, font, dan player YouTube dimuat dari CDN.

**Lokal (disarankan lewat live server)**
1. Buka folder ini di VS Code.
2. Pasang ekstensi **Live Server**, lalu klik kanan `index.html` dan pilih *Open with Live Server*.
3. Atau pakai terminal: `npx serve` atau `python -m http.server 8000`, lalu buka `http://localhost:8000`.

> Jangan buka `index.html` dengan klik dua kali (alamat `file://`). Player YouTube sering menolak jalan kalau dibuka seperti itu.

**Hosting (contoh Netlify)**
1. Buka <https://app.netlify.com/drop>.
2. Seret seluruh folder ini ke halamannya.
3. Selesai, kamu dapat alamat `https://nama-situs.netlify.app`.

Bisa juga dihosting di GitHub Pages, Vercel, atau hosting statis lainnya.

## Cara pakai

1. Klik **✨ Buka Diary** di sampul.
2. Klik **＋ Halaman baru**, isi tanggal, judul, tulisan, dan pilih mood.
3. (Opsional) Tempel link YouTube di kolom **Lagu hari ini**, lalu klik **▶ Putar**.
4. Klik **💾 Simpan**.
5. Untuk membuka entri lama, klik judulnya di **Daftar Isi**.

Format link YouTube yang dikenali: `youtube.com/watch?v=...`, `youtu.be/...`, dan `youtube.com/shorts/...`.

## Soal penyimpanan data (penting)

Entri disimpan di **localStorage** browser (kunci `buku-harianku-v1`). Artinya:

- Aman saat di-refresh, tab ditutup, atau komputer dimatikan.
- Data **menempel ke satu browser di satu perangkat dan satu alamat**. Diary yang diisi di HP tidak otomatis muncul di laptop, dan `localhost:5500` dianggap berbeda dengan `127.0.0.1:5500`.
- Data **bisa hilang** kalau kamu menghapus data situs/cookies, memakai mode incognito, atau browser membersihkan penyimpanan.
- Data **tidak dienkripsi**. Siapa pun yang membuka browser yang sama bisa membacanya.

**Karena itu, rajin klik ⬇ Backup.** File `diary-backup-TANGGAL.json` bisa disimpan di Google Drive, flashdisk, dan sebagainya. Untuk memasukkan kembali, klik **⬆ Restore** dan pilih file itu. Restore hanya menambahkan entri yang belum ada, jadi entri yang sudah ada tidak ditimpa. Cara ini juga yang dipakai untuk memindahkan diary antar perangkat.

## Catatan soal lagu YouTube

- Lagu **tidak bisa langsung otomatis diputar** saat halaman dibuka (aturan browser), jadi harus klik Putar dulu.
- Butuh internet untuk memutar lagu. Teks diary tetap bisa dibuka tanpa internet.
- Beberapa video tidak boleh diputar di luar YouTube (sering terjadi di video musik resmi dari label). Kalau muncul pesan itu, coba link versi lain (audio, lirik, atau cover).
- Video disembunyikan di luar layar dan hanya suaranya yang dipakai. Itu cukup untuk diary pribadi, tapi kalau aplikasi ini nanti dipublikasikan ke banyak orang, sebaiknya cek ketentuan YouTube soal penampilan player.

## Kustomisasi

- **Warna tema**: ubah variabel di bagian paling atas `style.css`. Blok `:root` untuk mode terang dan `[data-bs-theme="dark"]` untuk mode gelap.
- **Judul diary**: ganti di `<title>`, di teks pada SVG sampul (`Gita's` dan `Daily Journal`), dan di judul header dalam `index.html`.
- **Pilihan mood**: ubah daftar emoji di `const MOODS` pada `script.js`.
- **Sampul**: seluruh gambar sampul adalah SVG di dalam `index.html` (bagian `<!-- SAMPUL -->`), jadi warna dan ornamennya bisa diubah langsung.

## Teknologi

- HTML, CSS, JavaScript (tanpa framework dan tanpa build)
- [Bootstrap 5.3.3](https://getbootstrap.com/) lewat CDN
- Google Fonts: Dancing Script, Caveat, Lora
- [YouTube IFrame Player API](https://developers.google.com/youtube/iframe_api_reference) untuk lagu
- localStorage untuk penyimpanan

Disarankan memakai browser modern (Chrome, Edge, Firefox, atau Safari versi terbaru).

## Masalah umum

| Masalah | Penyebab dan solusi |
| --- | --- |
| Lagu tidak muncul atau tidak bunyi | Buka lewat `http://` (live server atau hosting), bukan `file://`. Pastikan internet nyala dan klik tombol Putar. |
| Muncul pesan video tidak boleh diputar | Pemilik video melarang pemutaran di luar YouTube. Coba link lain. |
| Entri hilang | Kemungkinan data browser terhapus atau alamat berubah. Pakai Restore dari file backup terakhir. |
| Tampilan berantakan atau font polos | Bootstrap dan Google Fonts belum termuat. Cek koneksi internet. |
| Ikon tab belum berubah | Browser menyimpan ikon lama. Coba hard refresh (`Ctrl + Shift + R`). |
