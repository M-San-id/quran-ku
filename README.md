# QuranKu 📖

Aplikasi mobile Al-Qur'an digital yang memudahkan Anda untuk membaca, mencari, dan mempelajari Al-Qur'an beserta terjemahan, tafsir, dan kumpulan doa-doa.

## ✨ Fitur Utama

- **Daftar Surat Al-Qur'an** - Akses lengkap 114 surat dengan informasi detail
- **Baca Al-Qur'an** - Teks Arab, Latin, dan terjemahan Indonesia
- **Tafsir Al-Qur'an** - Tafsir ringkas untuk setiap ayat
- **Pencarian Cerdas** - Cari ayat, tafsir, dan doa menggunakan vector search
- **Kumpulan Doa** - Doa-doa pilihan dengan teks Arab, Latin, dan terjemahan
- **UI Modern** - Antarmuka yang clean dan mudah digunakan

## 🛠️ Tech Stack

- **Framework**: [Expo](https://expo.dev/) / React Native
- **Language**: TypeScript
- **Navigation**: Expo Router
- **HTTP Client**: Axios
- **Icons**: Expo Vector Icons (Feather, FontAwesome, Ionicons)
- **API**: [Equran.id API](https://equran.id/apidev)

## 📱 Preview

### Halaman Utama
- **Beranda**: Daftar surat Al-Qur'an dengan nomor urut, nama Arab & Latin, tempat turun, dan jumlah ayat
- **Pencarian**: Fitur pencarian semantik untuk menemukan ayat, tafsir, atau doa berdasarkan kata kunci
- **Doa**: Koleksi doa-doa pilihan dengan teks lengkap

### Detail Surat
- Informasi surat (nama, arti, jumlah ayat)
- Teks Arab dengan ukuran yang nyaman dibaca
- Transliterasi Latin
- Terjemahan Indonesia (expandable)
- Tafsir ringkas (expandable)

### Detail Doa
- Teks Arab
- Transliterasi
- Terjemahan Indonesia
- Keterangan dan tag kategori

### Pencarian
- Pencarian berbasis AI/vector search
- Hasil mencakup ayat, tafsir, dan doa
- Interface accordion untuk hasil pencarian

## 🚀 Instalasi

1. Clone repository ini
```bash
git clone https://github.com/M-San-id/quran-ku.git
cd quranku
```

2. Install dependencies
```bash
npm install
# atau
yarn install
```

3. Jalankan aplikasi
```bash
npx expo start
```

4. Scan QR code dengan Expo Go (Android/iOS) atau jalankan di emulator

## 📂 Struktur Folder

```
app/
├── (tabs)/
│   ├── index.tsx          # Halaman daftar surat
│   ├── search.tsx         # Halaman pencarian
│   ├── doa.tsx           # Halaman daftar doa
│   └── _layout.tsx       # Layout tab navigation
├── surat/
│   └── [id].tsx          # Detail surat & ayat
├── doa/
│   └── [id].tsx          # Detail doa
└── _layout.tsx           # Root layout
```

## 🎨 Skema Warna

- **Primary**: `#00a88c` (Teal)
- **Background**: `#f8fafa` (Light Gray)
- **Text**: `#333` (Dark Gray)
- **Accent**: `#e0f2f1` (Light Teal)

## 🔌 API Endpoints

Aplikasi ini menggunakan API dari [Equran.id](https://equran.id/apidev):

- `GET /api/v2/surat` - Daftar surat
- `GET /api/v2/surat/{id}` - Detail surat & ayat
- `GET /api/v2/tafsir/{id}` - Tafsir surat
- `GET /api/doa` - Daftar doa
- `GET /api/doa/{id}` - Detail doa
- `POST /api/vector` - Pencarian semantik


---

**Dibuat dengan 💕 oleh M-San-id
