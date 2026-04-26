PRODUCT REQUIREMENTS DOCUMENT
KantongVura Smart Budget App

1. Overview
   Nama Produk. KantongVura
   Jenis Produk. Website finance tracker
   Tujuan. Membantu Anda membagi gaji bulanan ke kategori finansial secara otomatis lalu memantau pengeluaran harian
   Target Pengguna. Pekerja dengan penghasilan bulanan tetap dan mahasiswa yang mengatur uang bulanan
   Tech Stack. MongoDB, Express.js, React, Node.js
   Skema Warna. Biru 2563EB. Putih FFFFFF. Biru muda 93C5FD

2. Problem Statement
   Banyak pengguna mencatat keuangan secara manual. Proses ini memakan waktu dan sering salah. Data Bank Indonesia 2023 menunjukkan 62 persen pekerja Indonesia tidak memiliki pencatatan keuangan rutin. Ini membuat alokasi dana tidak terkontrol.

3. Product Goals

Business Goals
Meningkatkan retensi pengguna lewat kebiasaan mencatat harian.
Menjadi platform dasar untuk layanan finansial lanjutan.

User Goals
Anda ingin gaji langsung terbagi otomatis.
Anda ingin melihat sisa uang secara real time.
Anda ingin tahu ke mana uang Anda pergi setiap bulan.

4. Target User Persona

Persona 1
Usia 22 sampai 35.
Pendapatan bulanan tetap.
Masalah utama. Uang habis sebelum akhir bulan.
Solusi yang dicari. Aplikasi yang otomatis membagi dan mencatat.

5. Core Value Proposition
   KantongVura membagi gaji Anda secara otomatis ke beberapa pos. Aplikasi ini langsung menunjukkan sisa dana tiap pos setiap hari. Anda tidak perlu hitung manual.

6. MVP Scope

Fitur yang wajib ada pada versi pertama.

6.1 Autentikasi
User bisa daftar dan login.
User punya satu akun dengan satu data keuangan.

6.2 Setup Gaji dan Kategori
User memasukkan gaji bulanan.
User menentukan persentase tiap kategori.
Contoh.
Kebutuhan 50 persen.
Tabungan 20 persen.
Hiburan 10 persen.
Investasi 20 persen.

Sistem otomatis menghitung nilai rupiah tiap kategori.

6.3 Dashboard Utama
Menampilkan total gaji.
Menampilkan saldo tiap kategori.
Menampilkan sisa uang bulan ini.

6.4 Input Pengeluaran
User memasukkan jumlah dan memilih kategori.
Saldo kategori langsung berkurang.
Contoh. Anda belanja 100 ribu dari kategori kebutuhan. Saldo kebutuhan berkurang 100 ribu.

6.5 Riwayat Transaksi
Daftar semua pengeluaran.
Filter berdasarkan tanggal dan kategori.

6.6 Laporan Bulanan
Grafik total pengeluaran per kategori.
Perbandingan antara anggaran dan realisasi.

7. Non MVP Feature
   Fitur ini tidak masuk tahap awal.
   Integrasi bank.
   AI rekomendasi.
   Multi currency.
   Ekspor PDF.

8. User Flow MVP

User daftar akun.
User login.
User input gaji dan persentase kategori.
Sistem membagi saldo otomatis.
User memasukkan pengeluaran harian.
Dashboard dan laporan terupdate otomatis.

9. Data Model Sederhana

User
id
email
password

Budget
userId
monthlyIncome
categories. nama dan persentase

Wallet
userId
categoryName
balance

Transaction
userId
amount
category
date
note

10. Success Metrics

User aktif harian.
Rata rata transaksi per user per bulan.
Persentase user yang mengisi setup gaji.
Retention 30 hari.

11. Tech Architecture MVP

Frontend. React.
Backend. Node.js dan Express.
Database. MongoDB.
Auth. JWT.
