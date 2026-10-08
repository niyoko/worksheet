# Product brief: Worksheet Interaktif SD

## Tujuan

Membuat produk digital berbayar berisi worksheet untuk anak SD yang dapat dikerjakan langsung di browser, menyimpan progres pada perangkat, dan tetap nyaman dicetak atau disimpan sebagai PDF.

## Asumsi dan ruang lingkup produk

- Pasar awal: Indonesia, khusus anak SD kelas 1.
- Ruang lingkup konten launch: Matematika, Bahasa Indonesia, Bahasa Inggris, dan PPKn; masing-masing 5 worksheet, total 20 worksheet.
- Kelas 2–6 dan penambahan materi setelah paket awal berada di luar scope launch dan akan direncanakan pada tahap berikutnya.
- Orang tua/wali adalah pembeli dan pemegang informasi transaksi; anak tidak perlu membuat akun.
- Pembayaran diverifikasi manual pada MVP, lalu penjual mengirim tautan akses secara manual.
- Pembeli memilih kelas saat membeli; pada launch hanya kelas 1 yang tersedia. Bentuk paket penjualan (gabungan semua mapel atau per mapel) belum diputuskan.
- Satu pembelian memberikan akses sesuai paket yang dibeli. Karena launch hanya mencakup kelas 1, perubahan kelas bukan kebutuhan MVP; kebijakan perubahan paket tetap perlu ditentukan.

## Alur utama

1. Pembeli memilih kelas anak (launch: kelas 1 saja) dan paket worksheet yang tersedia.
2. Pembeli menyelesaikan pembayaran melalui kanal yang dipilih penjual.
3. Penjual memverifikasi pembayaran dan mencatat pesanan: ID pesanan, email/nomor kontak pembeli, kelas, paket, status, tanggal dibuat, masa berlaku opsional, dan status akses.
4. Penjual membuat tautan akses unik dan mengirimkannya secara manual.
5. Aplikasi memvalidasi tautan dan membuka materi sesuai kelas/paket yang terikat pada pesanan.
6. Anak memilih worksheet, menjawab soal, menerima umpan balik, dan melihat progres.
7. Progres otomatis disimpan di browser yang sama. Pengguna dapat mencetak worksheet atau menyimpannya melalui dialog Print/Save as PDF.

## Persyaratan fungsional

### Katalog, kelas, dan cakupan konten

- Tampilkan kelas 1 dan paket worksheet yang tersedia. Kelas 2–6 tidak ditawarkan pada launch dan dapat ditambahkan pada fase berikutnya.
- Konten launch mencakup 20 worksheet: 5 Matematika, 5 Bahasa Indonesia, 5 Bahasa Inggris, dan 5 PPKn.
- Setiap worksheet ditandai kelas, mata pelajaran, topik, urutan, status publikasi, dan versi konten agar penambahan materi berikutnya tidak mengubah progres lama secara tak terduga.
- Kelas/paket yang dibeli menjadi hak akses tautan tersebut; mengganti pilihan kelas pada UI tidak boleh membuka materi yang tidak dibeli.
- Tampilkan instruksi singkat untuk orang tua dan anak serta label kelas dan mata pelajaran yang jelas.

### Akses pembeli

- Admin dapat mencatat pesanan dan membuat, mengirim ulang, mencabut, atau memberi tanggal kedaluwarsa pada akses.
- Tautan akses tidak memuat email atau nomor telepon dalam bentuk terbaca.
- Gunakan token acak berentropi tinggi sebagai kredensial bearer; simpan hash token di server, bukan token mentah. Cocokkan token ke pesanan, kelas, paket, status, dan masa berlaku.
- Tautan yang dicabut, kedaluwarsa, atau tidak dikenal harus ditolak dengan pesan yang ramah.
- Siapa pun yang memegang tautan bearer dapat membukanya. Jika akses perlu benar-benar terikat ke pembeli, tambahkan verifikasi email/OTP pada fase lanjutan; jangan menganggap signature URL saja mengikat identitas pembeli.
- Hindari menaruh data pribadi di query string, log analitik, atau URL yang dapat dibagikan/referrer.

### Worksheet interaktif

- Setiap worksheet terdiri atas metadata kelas, mata pelajaran/topik, instruksi, urutan soal, dan aset yang diperlukan.
- MVP mendukung pilihan ganda dan jawaban angka/teks sederhana; tipe soal lain seperti mencocokkan atau drag-and-drop dapat ditambahkan setelah pilot.
- Anak dapat menjawab, mengubah jawaban, melihat umpan balik, mengulang worksheet, dan melihat status belum mulai/sedang dikerjakan/selesai.
- Simpan jawaban/progres otomatis tanpa perlu membuat akun. Beri penanda bahwa progres lokal hanya tersedia pada browser/perangkat yang sama dan dapat hilang jika data browser dihapus.
- Jangan mengklaim progress tersimpan di cloud pada MVP.

### Cetak dan PDF

- Sediakan tampilan cetak yang menyembunyikan navigasi, tombol, dan elemen interaktif yang tidak perlu.
- Pastikan layout hitam-putih tetap terbaca, tidak terpotong, memiliki ruang jawaban, dan menunjukkan kelas/judul worksheet.
- MVP memakai Print browser agar pengguna dapat mencetak atau memilih Save as PDF. Unduhan PDF langsung yang konsisten lintas perangkat dapat menjadi fase lanjutan.
- Jangan menyertakan jawaban/kunci guru pada PDF anak kecuali produk memang secara eksplisit menyediakan lembar jawaban terpisah untuk orang tua.

## Rekomendasi arsitektur MVP

- **Frontend web responsif:** katalog, layar worksheet, status progres, serta stylesheet khusus cetak.
- **Backend tipis:** pencatatan pesanan/akses dan validasi tautan. Materi boleh disajikan sebagai konten terstruktur, tetapi endpoint akses tetap memeriksa entitlement sebelum membuka paket berbayar.
- **Database:** pesanan, entitlement, token hash, kelas/paket, status, waktu kedaluwarsa/pencabutan. Hindari menyimpan nama anak, tanggal lahir, sekolah, foto, atau data anak lain yang tidak diperlukan.
- **Penyimpanan progres MVP:** IndexedDB atau localStorage dengan kunci yang mencakup versi produk + paket/worksheet. Tidak ada sinkronisasi lintas perangkat pada tahap ini.
- **Sinkronisasi opsional nanti:** hanya setelah kebutuhan terbukti; autentikasi orang tua, kontrol akses server, ekspor/hapus data, dan kebijakan retensi harus dirancang sebelum menyimpan progres server.
- **Admin MVP:** formulir internal sederhana untuk mencatat pembayaran yang telah dicek, memilih kelas/paket, mengatur expiry opsional, serta menerbitkan atau mencabut tautan. Jangan membuat halaman admin publik tanpa autentikasi.

> Pilihan framework, hosting, database, payment gateway, dan kanal pengiriman tautan belum dikunci. Tentukan setelah memeriksa repo dan memilih cara checkout yang benar-benar akan digunakan.

## Privasi dan keamanan

- Perlakukan tautan sebagai kunci akses privat; jangan masukkan PII ke dalamnya.
- Token harus unik, sulit ditebak, dapat dicabut, dan opsional kedaluwarsa. Batasi percobaan validasi dan jangan mencatat token mentah di log.
- Akses berbasis tautan dapat diteruskan oleh pembeli kepada orang lain; jelaskan trade-off ini. Verifikasi email/OTP adalah opsi jika perlu pembatasan lebih kuat.
- Minimalkan data anak: worksheet tidak meminta nama lengkap, kontak, sekolah, lokasi, foto, atau akun anak.
- Hindari iklan bertarget dan pelacak pihak ketiga di area anak. Kumpulkan hanya telemetri yang diperlukan untuk operasi produk dan sampaikan secara transparan.
- Sebelum peluncuran komersial, tinjau kewajiban privasi, perlindungan data anak, syarat transaksi/refund, pajak, dan kebijakan platform pembayaran untuk yurisdiksi yang relevan. Dokumen ini bukan penilaian hukum.
- Materi pelajaran harus ditinjau manusia yang memahami tingkat kelas, kurikulum yang dipakai, bahasa, aksesibilitas, dan ketepatan kunci jawaban.

## Rencana MVP bertahap

### Tahap 0 — keputusan produk

- **Sudah diputuskan:** kelas 1; Matematika, Bahasa Indonesia, Bahasa Inggris, dan PPKn; masing-masing 5 worksheet (20 total). Kelas lain dan konten tambahan direncanakan kemudian.
- **Masih perlu diputuskan:** apakah 20 worksheet dijual sebagai satu paket kelas atau paket per mata pelajaran, harga, kanal checkout, kebijakan refund, serta aturan perubahan paket.
- Pilih apakah tanda tangan yang dimaksud hanya signature teknis tautan atau pembatasan akses berbasis verifikasi identitas; rekomendasi awal adalah token acak yang disimpan hash dan bisa dicabut.

### Tahap 1 — alur worksheet tanpa pembayaran otomatis

- Bangun katalog launch untuk kelas 1 dan empat mata pelajaran yang telah dipilih.
- Siapkan 20 worksheet (5 per mata pelajaran) dan pastikan seluruh konten yang masuk katalog sudah ditinjau sebelum tersedia bagi pembeli.
- Implementasikan layar mengerjakan, validasi jawaban, autosave lokal, dan cetak/Save as PDF.
- Uji pada layar ponsel dan desktop serta uji hapus/muat ulang browser.

### Tahap 2 — penerbitan tautan manual

- Buat skema pesanan dan entitlement.
- Buat tool admin terbatas untuk membuat/mencabut tautan dan mengatur expiry.
- Implementasikan validasi token di server dan proteksi agar tautan tidak membuka kelas/paket lain.
- Uji token salah, dicabut, kedaluwarsa, dipakai ulang, dan perubahan kelas.

### Tahap 3 — pilot penjualan

- Jalankan sejumlah kecil transaksi manual.
- Catat pertanyaan pembeli, keberhasilan akses, perangkat/browser, penyelesaian worksheet, permintaan bantuan, dan refund tanpa mengumpulkan data anak yang tidak perlu.
- Putuskan berdasarkan data apakah perlu PDF langsung, sinkronisasi progres server, login orang tua, atau pembayaran otomatis.

## Kriteria penerimaan MVP

- Katalog launch hanya menampilkan kelas 1 dan memiliki 20 worksheet: 5 Matematika, 5 Bahasa Indonesia, 5 Bahasa Inggris, dan 5 PPKn.
- Pembeli dapat memilih kelas/paket yang tersedia; entitlement yang diterbitkan cocok dengan pembelian.
- Tautan valid membuka konten yang benar; token salah, revoked, dan expired tidak membuka konten.
- Link tidak membocorkan email/nomor pembeli; token mentah tidak tersimpan dalam database/log aplikasi.
- Jawaban dan status worksheet bertahan setelah reload pada browser/perangkat yang sama.
- Menghapus data situs/browser menghapus progres lokal dan UI menjelaskan keterbatasan ini.
- Tampilan worksheet usable di ponsel dan desktop serta dapat dicetak/Save as PDF tanpa kontrol UI yang mengganggu.
- Seluruh 20 worksheet launch telah diperiksa manusia untuk akurasi, instruksi, kesesuaian tingkat kelas, dan kunci jawaban.
- Tidak diperlukan akun atau profil anak untuk mengerjakan.

## Risiko dan trade-off

- **Link dapat dibagikan:** bearer link memudahkan akses tanpa login, tetapi tidak membuktikan bahwa pengguna adalah pembeli. OTP/login menambah friksi dan pekerjaan dukungan.
- **Progres lokal tidak lintas perangkat:** ini sederhana dan lebih minim data, tetapi data dapat hilang saat cache dihapus atau saat pindah perangkat.
- **Konten anak membutuhkan QA:** salah kunci jawaban atau instruksi membingungkan dapat merusak kepercayaan; perlu review sebelum dipublikasikan.
- **Cetak browser bervariasi:** print stylesheet perlu diuji di browser umum; PDF pre-generated mungkin diperlukan jika hasil cetak tidak konsisten.
- **Materi digital mudah disalin:** MVP tidak perlu DRM agresif; fokus pada kualitas, pengalaman, dan aturan lisensi yang jelas.

## Pertanyaan terbuka sebelum implementasi

1. Apakah 20 worksheet dijual sebagai satu bundel kelas 1 atau paket terpisah per mata pelajaran?
2. Checkout manual lewat transfer/QRIS atau menggunakan payment gateway?
3. Apakah tautan boleh diteruskan, atau harus diverifikasi melalui email/OTP?
4. Berapa lama akses berlaku dan apakah pembeli boleh berpindah paket?
5. Apakah diperlukan mode orang tua/kunci jawaban atau laporan progres?
6. Apakah ada gaya visual/brand atau contoh worksheet yang harus diikuti?
