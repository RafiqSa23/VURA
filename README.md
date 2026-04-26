<div align="center">
  <img src="https://raw.githubusercontent.com/RafiqSa23/VURA/main/frontend/public/LogoVura.jpeg" alt="KantongVura Logo" width="80" />
  <h1>KantongVura</h1>
  <p><strong>Smart Budgeting App | Kelola Keuangan Jadi Lebih Mudah</strong></p>
  
  ![React](https://img.shields.io/badge/React-18.2-61DAFB?logo=react)
  ![TypeScript](https://img.shields.io/badge/TypeScript-5.2-3178C6?logo=typescript)
  ![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-06B6D4?logo=tailwindcss)
  ![Node.js](https://img.shields.io/badge/Node.js-18-339933?logo=nodedotjs)
  ![MongoDB](https://img.shields.io/badge/MongoDB-6-47A248?logo=mongodb)
  ![License](https://img.shields.io/badge/License-MIT-green)
  
</div>

---

## 📱 Tentang KantongVura

**KantongVura** adalah aplikasi manajemen keuangan pribadi yang membantu Anda:

- 🎯 **Membagi gaji otomatis** ke berbagai kategori
- 📊 **Memantau pengeluaran** secara real-time
- 📈 **Menganalisis pola keuangan** dengan laporan bulanan
- 🔐 **Mengelola akun** dengan aman
  
---

## ✨ Fitur

### 🏠 Dashboard
| Fitur | Deskripsi |
|-------|-----------|
| Ringkasan Keuangan | Total gaji, pengeluaran, dan sisa bulan ini |
| Progress Bar | Visualisasi penggunaan budget |
| Saldo per Kategori | Detail saldo tiap kategori pengeluaran |

### 💰 Manajemen Transaksi
| Fitur | Deskripsi |
|-------|-----------|
| Tambah Transaksi | Input pengeluaran dengan kategori dan catatan |
| Edit Transaksi | Ubah data transaksi yang sudah masuk |
| Hapus Transaksi | Hapus dengan konfirmasi modal |
| Filter & Cari | Filter berdasarkan tanggal dan kategori |

### 📅 Multi-Bulan
| Fitur | Deskripsi |
|-------|-----------|
| Budget per Bulan | Buat budget berbeda tiap bulan |
| Pilih Bulan | Lihat data bulan sebelumnya |
| Alert Bulan Baru | Notifikasi saat bulan berganti |

### 📊 Laporan
| Fitur | Deskripsi |
|-------|-----------|
| Laporan Bulanan | Detail per kategori |
| Perbandingan | Anggaran vs realisasi |
| Export (Coming Soon) | Download PDF/Excel |

### 👤 Pengaturan
| Fitur | Deskripsi |
|-------|-----------|
| Ganti Nama | Update nama lengkap |
| Ganti Username | Update username unik |
| Ganti Password | Keamanan akun |
| Session Timeout | Auto-logout jika tidak aktif |

---

## 🛠 Teknologi

### Frontend
| Teknologi | Versi | Fungsi |
|-----------|-------|--------|
| React | 18.2 | UI Library |
| TypeScript | 5.2 | Type Safety |
| TailwindCSS | 3.4 | Styling |
| shadcn/ui | Latest | UI Components |
| React Router | 6.14 | Routing |
| Axios | 1.6 | HTTP Client |
| Recharts | 2.10 | Grafik |

### Backend
| Teknologi | Versi | Fungsi |
|-----------|-------|--------|
| Node.js | 18.x | Runtime |
| Express | 4.18 | Framework |
| MongoDB | 6.x | Database |
| Mongoose | 8.x | ODM |
| JWT | 9.x | Autentikasi |
| bcryptjs | 2.4 | Enkripsi |

---

## 🚀 Instalasi

### Prasyarat
- Node.js (v18+)
- MongoDB (local atau Atlas)
- npm atau yarn

### 1. Clone Repository
```bash
git clone https://github.com/username/kantongvura.git
cd kantongvura
```

## Setup Backend 

```bash
cd backend
npm install

# Buat file .env
cp .env.example .env

# Edit .env dengan konfigurasi Anda
# PORT=3000
# MONGODB_URI=mongodb://localhost:27017/kantongvura
# JWT_SECRET=your_secret_key

npm run dev
```

## Setup Frontend
```bash
cd frontend
npm install

# Buat file .env
cp .env.example .env

# Edit .env
# VITE_API_URL=http://localhost:3000/api

npm run dev
```

---

## 📁 Struktur Proyek
```
kantongvura/
├── backend/
│   ├── src/
│   │   ├── config/          # Konfigurasi DB
│   │   ├── controllers/     # Logic handler
│   │   ├── middleware/      # Auth middleware
│   │   ├── models/          # MongoDB models
│   │   ├── routes/          # API routes
│   │   ├── services/        # Business logic
│   │   └── utils/           # Utilities
│   ├── .env.example
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── constants/       # Constants
│   │   ├── contexts/        # React contexts
│   │   ├── hooks/           # Custom hooks
│   │   ├── lib/             # Utilities
│   │   ├── services/        # API services
│   │   └── types/           # TypeScript types
│   ├── .env.example
│   ├── package.json
│   └── vite.config.ts
├── screenshots/              # Screenshot images
├── .gitignore
└── README.md
```

--- 

## 📧 Kontak
Developer: Rafiq Setyo Aji

GitHub: github.com/RafiqSa23
