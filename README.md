# Ruang Belajar · Worksheet Interaktif SD

Draf pertama aplikasi belajar kelas 1 dalam bahasa Indonesia. Tepat **20 worksheet / 100 soal**: masing-masing 5 Matematika, Bahasa Indonesia, Bahasa Inggris, dan PPKn. Materi orisinal masih perlu tinjauan manusia/guru; belum diklaim sesuai kurikulum resmi.

## Menjalankan

Memerlukan Node.js 20.19+ atau 22.12+.

```sh
npm ci
npm run dev
```

Buka alamat yang dicetak Vite. Untuk produksi statis: `npm run build`, lalu sajikan direktori `dist`. `npm run preview` untuk memeriksa hasil build secara lokal.

## Fitur dan batas scope

- Katalog kelas 1 dengan filter mata pelajaran, pencarian, dan ringkasan progres.
- Pilihan ganda, jawaban angka/teks, penilaian, penjelasan, ubah jawaban, dan ulangi worksheet.
- Jawaban otomatis disimpan melalui localStorage di browser/perangkat yang sama. Kunci mencakup versi produk, ID worksheet, dan versi materi. Status selesai berarti semua soal telah diisi dan diperiksa; tidak harus semua benar. Mengubah jawaban membatalkan penilaian sampai diperiksa lagi.
- Data browser yang dihapus menghapus progres. Browser yang menolak penyimpanan tetap dapat dipakai, dengan pemberitahuan bahwa jawaban hanya bertahan selama halaman terbuka. Tidak ada akun, profil anak, pelacak, atau sinkronisasi server.
- Tombol **Download PDF** di setiap kartu dan worksheet membuat PDF langsung di browser. Tombol **Cetak** menyediakan lembar kosong hitam putih dengan judul, kelas, soal, pilihan, dan ruang jawaban. Keduanya tidak memuat jawaban anak/kunci, navigasi, atau kontrol aplikasi.
- Tidak ada pembayaran, harga, checkout, tautan pembelian, autentikasi, pesanan, atau layanan backend. Scope transaksi/akses pada [brief awal](docs/product-brief.md) sengaja tidak diterapkan sesuai instruksi tugas.

## Struktur

- `src/data.js`: seluruh materi, metadata draf, versi, dan kunci/penjelasan yang mudah ditinjau.
- `src/progress.js`: normalisasi jawaban, penilaian, status, penyimpanan lokal.
- `src/pdf.js`: penulis PDF A4 minimal dengan font Helvetica bawaan; tidak memakai layanan eksternal.
- `src/app.js`, `src/styles.css`, `index.html`: UI responsif, kontrol semantik, fokus keyboard, media cetak.
- `tests/core.test.js`: validasi materi, progres, dan struktur/konten PDF.
- `tests/browser/app.spec.js`, `playwright.config.js`: tes Chromium desktop dan ponsel.

Runtime memakai JavaScript/CSS native tanpa dependensi paket. Vite dan Playwright hanya alat pengembangan.

## Verifikasi

```sh
npm test
# Simpan browser pengujian di dalam repository, bukan cache global:
PLAYWRIGHT_BROWSERS_PATH="$PWD/.playwright-browsers" npx playwright install chromium
npm run test:e2e
npm run build
```

Tes browser memeriksa 20 worksheet, filter/pencarian, progres setelah reload, penilaian/penjelasan, perubahan jawaban, reset, download setiap PDF, media cetak, keyboard, kegagalan storage, dan lebar layar 390px. Pengujian Chromium bukan jaminan semua browser atau printer fisik. PDF memakai teks Latin dasar; karakter tanda baca seperti dash panjang dinormalisasi. Jika menambahkan aksara lain/aset gambar, perlu memperluas generator PDF.

Sebelum materi digunakan sebagai acuan, minta guru memeriksa setiap soal, pilihan, kunci, penjelasan, tingkat kesulitan, dan kesesuaian kurikulum. Setiap perubahan makna materi harus menaikkan `version` agar progres lama tidak dipakai untuk soal yang berubah.
