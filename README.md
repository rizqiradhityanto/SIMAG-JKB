# 🎓 SIMAG-JKB — Sistem Informasi Magang
### Jurusan Komputer dan Bisnis · Politeknik Negeri Cilacap (PNC)

Selamat datang di repositori resmi pengembangan antarmuka web **SIMAG-JKB (Tahap 2)**. Dokumen ini disusun sebagai panduan kerja utama seluruh anggota tim pengembang agar proses kolaborasi kode berjalan tertib, rapi, dan bebas dari konflik (*merge conflict*).

---

## 📌 1. Informasi Proyek & Tech Stack

Aplikasi ini dibangun menggunakan teknologi web standar tanpa dependensi framework yang rumit:
- **HTML5**: Struktur semantik yang ramah aksesibilitas (*SEO & screen-reader friendly*).
- **CSS3 (Native/Vanilla)**: Menggunakan sistem token variabel terpusat (`assets/css/style.css`), sistem grid 8-pixel, dan tata letak responsif (*Flexbox & CSS Grid*).
- **JavaScript (Vanilla/ES6+)**: Logika interaktif DOM murni (`assets/js/main.js`) tanpa jQuery atau framework eksternal.
- **Ikon & Tipografi**: Google Fonts *Inter* dan *Material Symbols Outlined*.

---

## 🌳 2. Arsitektur Branch Git (Git Flow PNC)

Manajemen kode dikelola secara ketat dengan hierarki branch berikut:

```
[ main ]        <-- KHUSUS VERSI STABIL / SIAP DEMO DOSEN (Hanya di-merge oleh PM)
   ▲
   │ (Release / PR Final)
   │
[ develop ]     <-- BASE UTAMA PENGEMBANGAN HARIAN (Induk dari semua fitur)
   ▲
   ├─── feature/nama-fitur-anggota-1  (Cabang tugas mandiri)
   ├─── feature/nama-fitur-anggota-2  (Cabang tugas mandiri)
   └─── feature/nama-fitur-anggota-3  (Cabang tugas mandiri)
```

### ⚠️ Aturan Emas Pengerjaan:
1. **DILARANG KERAS** melakukan `git commit` atau `git push` langsung ke branch `main` maupun `develop`.
2. Seluruh pengerjaan tugas **WAJIB** berada di dalam branch fitur masing-masing (`feature/nama-fitur`).
3. Penggabungan kode ke `develop` hanya dilakukan melalui mekanisme **Pull Request (PR)** di GitHub dan harus disetujui (*review & approve*) oleh Project Manager (PM).

---

## 🚀 3. Panduan Alur Git Step-by-Step (Untuk Pemula)

Bagi anggota tim yang baru pertama kali menggunakan GitHub, ikuti langkah-langkah presisi di bawah ini:

### Langkah A: Persiapan Awal (Hanya Sekali di Awal Proyek)
1. Buka terminal (Git Bash atau Terminal VS Code).
2. Gandakan (*clone*) repositori ke komputer Anda:
   ```bash
   git clone https://github.com/USERNAME_ORGANISASI/simag-jkb.git
   cd simag-jkb
   ```
3. Pindah ke branch `develop`:
   ```bash
   git checkout develop
   ```

---

### Langkah B: Memulai Tugas Baru (Setiap Mulai Mengerjakan Fitur)
Sebelum menulis baris kode apa pun, pastikan Anda mengambil versi terbaru dari `develop` dan membuat branch fitur baru:

1. Ambil update terbaru dari server:
   ```bash
   git checkout develop
   git pull origin develop
   ```
2. Buat branch fitur baru yang diturunkan dari `develop`:
   ```bash
   # Format: git checkout -b feature/nama-fitur-anda
   # Contoh Anggota 2:
   git checkout -b feature/katalog-mahasiswa

   # Contoh Anggota 3:
   git checkout -b feature/formulir-ulasan
   ```
3. Sekarang Anda berada di branch fitur sendiri. Mulailah mengedit kode HTML/CSS/JS pada file tugas Anda!

---

### Langkah C: Menyimpan dan Mengirim Pekerjaan ke GitHub
Lakukan langkah ini secara berkala setelah Anda menyelesaikan satu bagian pekerjaan:

1. Periksa status file yang Anda ubah:
   ```bash
   git status
   ```
2. Tandai file yang akan disimpan:
   ```bash
   git add .
   ```
3. Berikan pesan komit yang jelas dan deskriptif:
   ```bash
   # Format: git commit -m "feat(modul): penjelasan apa yang dibuat"
   git commit -m "feat(katalog): membuat layout filter multi-parameter dan card lowongan"
   ```
4. Kirim (*push*) branch fitur Anda ke repositori GitHub:
   ```bash
   # Perintah push untuk branch fitur Anda
   git push -u origin feature/katalog-mahasiswa
   ```

---

### Langkah D: Mengajukan Pull Request (PR) ke `develop`
Setelah fitur selesai dibuat dan diuji di browser:

1. Buka halaman repositori proyek di browser (**GitHub**).
2. Anda akan melihat banner kuning bertuliskan **"Compare & pull request"**. Klik tombol tersebut.
3. **PENTING — Perhatikan Target Branch:**
   - **Base branch (Tujuan):** Pilih `develop` *(JANGAN pilih `main`!)*
   - **Compare branch (Sumber):** Pilih branch fitur Anda (misal: `feature/katalog-mahasiswa`).
4. Isi judul dan deskripsi PR secara ringkas:
   - *Apa saja yang ditambahkan?* (contoh: Menambahkan form filter prodi dan grid kartu lowongan).
   - *Bukti tampilan:* Sertakan screenshot jika diperlukan.
5. Klik **"Create Pull Request"**.
6. Beritahukan kepada PM / Ketua Kelompok di grup WhatsApp untuk meninjau (*review*) dan melakukan *merge* ke branch `develop`.

---

### Langkah E: Update Kode Setelah PR di-Merge
Setelah PR Anda digabungkan ke `develop`, kembali ke branch `develop` lokal Anda dan sinkronkan:
```bash
git checkout develop
git pull origin develop
```
Lalu Anda siap membuat branch baru untuk tugas berikutnya!

---

---

## 🎨 5. Standar Tampilan & Komponen (Design System)

Agar antarmuka seragam dan tidak terjadi tabrakan style:
1. **Buka file `style-guide.html`** di browser Anda sebagai contekan visual.
2. **Aturan Warna:**
   - Biru Utama (Trust Blue): `var(--primary)` (`#1E3A8A`) — untuk header & tombol utama.
   - Biru Interaktif: `var(--secondary)` (`#2563EB`) — untuk tautan & ikon.
   - Background Halaman: `var(--bg-canvas)` (`#F8FAFC`) — abu-abu sangat muda.
   - Background Kartu: `#FFFFFF` dengan garis tepi `1px solid var(--border)` (`#E2E8F0`).
3. **Status Badges:**
   - Pending / Menunggu: `<span class="badge badge-warning badge-dot">Pending</span>`
   - Approved / Disetujui / Aktif: `<span class="badge badge-success badge-dot">Disetujui</span>`
   - Rejected / Ditolak / Nonaktif: `<span class="badge badge-danger badge-dot">Ditolak</span>`
4. **Tombol:**
   - Aksi utama: `<button class="btn btn-primary">Simpan</button>`
   - Aksi sekunder: `<button class="btn btn-secondary">Batal</button>`
   - Aksi bahaya: `<button class="btn btn-danger">Hapus</button>`

---

## ❓ FAQ & Troubleshooting Kendala Git

**Q: Saya lupa membuat branch baru dan terlanjur mengetik kode di `develop`, bagaimana?**  
*Jawab:* Jangan panik dan **jangan lakukan commit**. Cukup ketik perintah ini untuk memindahkan perubahan Anda ke branch baru:
```bash
git checkout -b feature/nama-fitur-anda
git add .
git commit -m "feat: pesan commit Anda"
```

**Q: Muncul tulisan `CONFLICT (content): Merge conflict in ...`, apa yang harus saya lakukan?**  
*Jawab:* Konflik terjadi jika 2 orang mengedit baris kode yang sama pada file yang sama. Buka file yang berkonflik di VS Code, pilih versi kode yang benar (*Accept Current Change* atau *Accept Incoming Change*), simpan file, lalu jalankan:
```bash
git add .
git commit -m "fix: menyelesaikan konflik merge"
```

---
*Dikembangkan dengan penuh dedikasi untuk Jurusan Komputer dan Bisnis · Politeknik Negeri Cilacap.*
