# Product brief: Worksheet Interaktif SD

## Tujuan

Membuat produk digital berbayar berisi worksheet untuk anak SD yang dapat dikerjakan langsung di browser, menyimpan progres pada perangkat, dan tetap nyaman dicetak atau disimpan sebagai PDF.

## Asumsi produk

- Pasar awal: Indonesia, kelas 1–6 SD.
- Orang tua/wali adalah pembeli dan pemegang informasi transaksi; anak tidak perlu membuat akun.
- Pembayaran diverifikasi manual pada MVP, lalu penjual mengirim tautan akses secara manual.
- Satu pembelian memberikan akses ke kelas yang dipilih. Kebijakan perubahan kelas setelah pembelian belum diputuskan.
- MVP dapat dimulai dengan satu kelas dan satu paket pelajaran untuk menguji alur, tetapi desain katalog mendukung kelas 1–6.

## Alur utama

1. Pembeli memilih kelas anak dan paket worksheet.
2. Pembeli menyelesaikan pembayaran melalui kanal yang dipilih penjual.
3. Penjual memverifikasi pembayaran dan mencatat pesanan: ID pesanan, email/nomor kontak pembeli, kelas, paket, status, tanggal dibuat, masa berlaku opsional, dan status akses.
4. Penjual membuat tautan akses unik dan mengirimkannya secara manual.
5. Aplikasi memvalidasi tautan dan membuka materi sesuai kelas/paket yang terikat pada pesanan.
6. Anak memilih worksheet, menjawab soal, menerima umpan balik, dan melihat progres.
7. Progres otomatis disimpan di browser yang sama. Pengguna dapat mencetak worksheet atau menyimpannya melalui dialog Print/Save as PDF.

## Persyaratan fungsional

### Katalog dan kelas

- Tampilkan pilihan kelas 1–6 dan paket yang tersedia.
- Kelas/paket yang dibeli menjadi hak akses tautan tersebut; mengganti pilihan kelas pada UI tidak boleh membuka materi yang tidak dibeli.
- Tampilkan instruksi singkat untuk orang tua dan anak serta label kelas yang jelas.

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

- Tetapkan mata pelajaran, kelas pilot, jumlah worksheet awal, format paket/harga, kanal checkout, kebijakan refund, dan aturan perubahan kelas.
- Pilih apakah tanda tangan yang dimaksud hanya signature teknis tautan atau pembatasan akses berbasis verifikasi identitas; rekomendasi awal adalah token acak yang disimpan hash dan bisa dicabut.

### Tahap 1 — alur worksheet tanpa pembayaran otomatis

- Bangun katalog kelas/paket contoh.
- Buat satu paket pilot dengan konten yang sudah ditinjau.
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

- Pembeli dapat memilih kelas dan paket; entitlement yang diterbitkan cocok dengan pembelian.
- Tautan valid membuka konten yang benar; token salah, revoked, dan expired tidak membuka konten.
- Link tidak membocorkan email/nomor pembeli; token mentah tidak tersimpan dalam database/log aplikasi.
- Jawaban dan status worksheet bertahan setelah reload pada browser/perangkat yang sama.
- Menghapus data situs/browser menghapus progres lokal dan UI menjelaskan keterbatasan ini.
- Tampilan worksheet usable di ponsel dan desktop serta dapat dicetak/Save as PDF tanpa kontrol UI yang mengganggu.
- Satu worksheet pilot telah diperiksa manusia untuk akurasi, instruksi, tingkat kesulitan, dan kunci jawaban.
- Tidak diperlukan akun atau profil anak untuk mengerjakan.

## Risiko dan trade-off

- **Link dapat dibagikan:** bearer link memudahkan akses tanpa login, tetapi tidak membuktikan bahwa pengguna adalah pembeli. OTP/login menambah friksi dan pekerjaan dukungan.
- **Progres lokal tidak lintas perangkat:** ini sederhana dan lebih minim data, tetapi data dapat hilang saat cache dihapus atau saat pindah perangkat.
- **Konten anak membutuhkan QA:** salah kunci jawaban atau instruksi membingungkan dapat merusak kepercayaan; perlu review sebelum dipublikasikan.
- **Cetak browser bervariasi:** print stylesheet perlu diuji di browser umum; PDF pre-generated mungkin diperlukan jika hasil cetak tidak konsisten.
- **Materi digital mudah disalin:** MVP tidak perlu DRM agresif; fokus pada kualitas, pengalaman, dan aturan lisensi yang jelas.

## Pertanyaan terbuka sebelum implementasi

1. Mata pelajaran apa yang menjadi paket pertama, dan untuk kelas berapa?
2. Apakah kelas 1–6 langsung tersedia saat launch atau diluncurkan bertahap?
3. Checkout manual lewat transfer/QRIS atau menggunakan payment gateway?
4. Apakah tautan boleh diteruskan, atau harus diverifikasi melalui email/OTP?
5. Berapa lama akses berlaku dan apakah pembeli boleh pindah kelas?
6. Apakah diperlukan mode orang tua/kunci jawaban atau laporan progres?
7. Apakah ada gaya visual/brand atau contoh worksheet yang harus diikuti?
