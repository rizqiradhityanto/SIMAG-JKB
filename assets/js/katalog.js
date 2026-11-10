/* =====================================================================
   SIMAG-JKB — Modul Katalog & Eksplorasi Lowongan (PIC: Nirvana A. Maharani)
   Dipakai oleh: katalog.html, mahasiswa/katalog.html,
                 mahasiswa/detail-lowongan.html, mahasiswa/favorit.html
   ---------------------------------------------------------------------
   Halaman dipilih lewat <body data-page="public|katalog|detail|favorit">.

   CATATAN INTEGRASI BACKEND
   - Data lowongan di bawah ini adalah DATA DUMMY LOKAL (bukan dari database).
     Untuk integrasi, ganti isi SimagKatalog.api.fetchJobs() dan
     SimagKatalog.api.fetchJobById() dengan fetch() ke endpoint admin.
     Bentuk objek lowongan (lihat JOBS) dapat dijadikan kontrak API.
   - Favorit disimpan di localStorage (key: simag_jkb_favorit_v1) sebagai
     [{ id, savedAt }]. Ganti SimagKatalog.favorites.* untuk memanggil API
     favorit per-user; seluruh UI hanya memakai fungsi tersebut.
   - Skrip ini TIDAK mengubah main.js. Tombol [data-fav-id] menggantikan
     perilaku .bookmark-btn bawaan main.js (yang tidak menyimpan data).
   ===================================================================== */
(function () {
  'use strict';

  /* ===================================================================
     1. DATA DUMMY LOWONGAN (tanggal acuan: 3 Nov 2026)
     =================================================================== */
  var PRODI = ['D4 Teknik Informatika', 'D4 Sistem Informasi Bisnis', 'D3 Manajemen Informatika', 'D4 Bisnis Digital'];
  var TI = PRODI[0], SIB = PRODI[1], MI = PRODI[2], BD = PRODI[3];
  var DOCS_STD = [
    { name: 'Curriculum Vitae (PDF, maks. 2 MB)', required: true },
    { name: 'Transkrip nilai terbaru', required: true },
    { name: 'Surat pengantar dari Jurusan', required: true },
    { name: 'Portofolio / tautan GitHub', required: false }
  ];

  var JOBS = [
    {
      id: 'LWG-001', company: 'PT Telkom Indonesia', initials: 'TL', color: 'c1',
      position: 'Backend Developer Intern', city: 'Bandung', area: 'Bandung', province: 'Jawa Barat',
      category: 'Software Development', industry: 'Telekomunikasi & Teknologi Digital',
      status: 'Dibuka', workMode: 'Hybrid (3 hari WFO)', skills: ['Laravel', 'MySQL', 'REST API', 'Git'],
      skillsBonus: ['Go', 'Docker'], prodi: [TI, SIB, MI], quota: 4, filled: 3, minIpk: 3.0,
      postedAt: '2026-10-20', deadline: '2026-11-28', period: '1 Feb – 30 Apr 2027', duration: '3 bulan',
      rating: 4.8, reviewCount: 24,
      companyDesc: 'Perusahaan telekomunikasi dan layanan digital terbesar di Indonesia dengan fokus pada konektivitas, platform digital, dan solusi enterprise.',
      description: 'Divisi Digital Business membuka kesempatan magang untuk terlibat langsung dalam pengembangan layanan backend produk digital internal. Peserta bergabung dalam tim agile dan dibimbing engineer senior selama periode magang.',
      responsibilities: ['Mengembangkan dan memelihara REST API menggunakan Laravel.', 'Merancang skema basis data MySQL serta menulis query yang efisien.', 'Menulis unit test dan integration test untuk fitur yang dibangun.', 'Berpartisipasi dalam sprint planning, daily stand-up, dan code review.', 'Menyusun dokumentasi API menggunakan Swagger/OpenAPI.'],
      academicReq: ['Mahasiswa aktif semester 5 atau 6.', 'IPK minimal 3.00 (skala 4.00).', 'Bersedia magang penuh selama 3 bulan.'],
      techReq: ['Memahami PHP dan framework Laravel.', 'Mampu merancang tabel relasional dasar.', 'Terbiasa memakai Git.'],
      docs: DOCS_STD,
      contact: { name: 'Hendra Saputra', role: 'PIC Rekrutmen · HR Digital Business', email: 'magang.dbs@telkom-demo.example', phone: '+62 22 4521 8890', address: 'Jl. Japati No. 1, Sadang Serang, Coblong, Bandung 40133', website: 'https://www.telkom.co.id' },
      registration: 'Pendaftaran dilakukan langsung ke HR perusahaan melalui email dengan subjek "Magang Backend – Nama – NIM". Seleksi berupa tes teknis dan wawancara.',
      reviewSummary: 'Mentor suportif dan rutin melakukan code review. Mahasiswa dilibatkan di proyek nyata sejak minggu kedua; perlu adaptasi cepat pada stack baru.',
      fit: 92,
      reviews: [
        { name: 'Nadia A.', info: 'D4 Teknik Informatika · Jul–Sep 2025', stars: 5, text: 'Mentor sangat suportif dan rutin melakukan code review. Saya langsung dilibatkan di proyek nyata sejak minggu kedua.' },
        { name: 'Fajar R.', info: 'D3 Manajemen Informatika · Feb–Apr 2025', stars: 4, text: 'Lingkungan kerja profesional dan jadwal hybrid fleksibel, hanya perlu adaptasi cepat dengan stack yang dipakai.' }
      ]
    },
    {
      id: 'LWG-002', company: 'Tokopedia', initials: 'TK', color: 'c3',
      position: 'Frontend Engineer Intern', city: 'Jakarta', area: 'Jakarta Selatan', province: 'DKI Jakarta',
      category: 'Software Development', industry: 'E-Commerce',
      status: 'Dibuka', workMode: 'Hybrid (2 hari WFO)', skills: ['React', 'TypeScript', 'Tailwind', 'Git'],
      skillsBonus: ['Testing Library'], prodi: [TI, SIB], quota: 3, filled: 1, minIpk: 3.25,
      postedAt: '2026-10-25', deadline: '2026-11-30', period: '4 Jan – 2 Apr 2027', duration: '3 bulan',
      rating: 4.6, reviewCount: 18,
      companyDesc: 'Marketplace teknologi dengan jutaan penjual dan pembeli di seluruh Indonesia, dengan tim produk dan engineering yang besar.',
      description: 'Bergabung dengan tim Web Platform untuk membangun antarmuka marketplace yang cepat, aksesibel, dan mudah dipelihara bersama frontend engineer berpengalaman.',
      responsibilities: ['Mengimplementasikan komponen UI berdasarkan desain Figma.', 'Mengintegrasikan antarmuka dengan REST/GraphQL API.', 'Menulis unit test komponen dan memperbaiki bug produksi ringan.', 'Meningkatkan performa dan aksesibilitas halaman.'],
      academicReq: ['Mahasiswa aktif semester 5 atau 6.', 'IPK minimal 3.25 (skala 4.00).', 'Bersedia magang minimal 3 bulan.'],
      techReq: ['Menguasai JavaScript modern dan dasar React.', 'Memahami HTML/CSS responsif.', 'Memiliki minimal satu proyek di GitHub.'],
      docs: DOCS_STD,
      contact: { name: 'Rani Wijaya', role: 'Campus Program · Talent Acquisition', email: 'campus@tokopedia-demo.example', phone: '+62 21 5091 0001', address: 'Tokopedia Tower, Jl. Prof. Dr. Satrio, Jakarta Selatan', website: 'https://www.tokopedia.com' },
      registration: 'Kirim CV dan tautan portofolio ke email Campus Program. Tahapan: seleksi berkas, live coding ringan, wawancara pengguna.',
      reviewSummary: 'Budaya kerja kolaboratif dan standar kode yang tinggi. Beban kerja cukup padat namun relevan dengan materi perkuliahan web.',
      fit: 88,
      reviews: [
        { name: 'Dimas P.', info: 'D4 Teknik Informatika · Jul–Sep 2025', stars: 5, text: 'Mendapat pengalaman memakai design system dan code review yang ketat. Sangat bermanfaat untuk portofolio.' },
        { name: 'Alya S.', info: 'D4 Sistem Informasi Bisnis · Jul–Sep 2025', stars: 4, text: 'Tim ramah dan terbuka. Jadwal hybrid cukup fleksibel.' }
      ]
    },
    {
      id: 'LWG-003', company: 'Bank Mandiri', initials: 'BM', color: 'c2',
      position: 'Fullstack Developer Intern', city: 'Jakarta', area: 'Jakarta Pusat', province: 'DKI Jakarta',
      category: 'Software Development', industry: 'Perbankan & Keuangan',
      status: 'Segera Ditutup', workMode: 'Onsite', skills: ['Laravel', 'Vue.js', 'MySQL', 'Git'],
      skillsBonus: ['Docker'], prodi: [TI, SIB, BD], quota: 2, filled: 1, minIpk: 3.0,
      postedAt: '2026-10-10', deadline: '2026-11-08', period: '11 Jan – 9 Apr 2027', duration: '3 bulan',
      rating: 4.3, reviewCount: 11,
      companyDesc: 'Bank terbesar di Indonesia berdasarkan aset dengan layanan perbankan ritel, korporasi, dan digital.',
      description: 'Divisi Teknologi Informasi membutuhkan mahasiswa untuk membantu pengembangan aplikasi internal operasional perbankan dari antarmuka hingga layanan backend.',
      responsibilities: ['Mengembangkan fitur aplikasi internal berbasis Laravel dan Vue.js.', 'Membantu migrasi dan validasi data antar-sistem.', 'Menulis dokumentasi teknis dan panduan pengguna.', 'Mengikuti prosedur keamanan informasi perusahaan.'],
      academicReq: ['Mahasiswa aktif semester 5 atau 6.', 'IPK minimal 3.00 (skala 4.00).', 'Bersedia mengikuti aturan kerja dan kerahasiaan data.'],
      techReq: ['Memahami PHP/Laravel dan JavaScript dasar.', 'Mampu bekerja dengan basis data relasional.'],
      docs: DOCS_STD,
      contact: { name: 'Budi Hartono', role: 'Human Capital · Program Magang', email: 'magang@bankmandiri-demo.example', phone: '+62 21 5299 7000', address: 'Plaza Mandiri, Jl. Jend. Gatot Subroto Kav. 36-38, Jakarta Pusat', website: 'https://bankmandiri.co.id' },
      registration: 'Pengajuan dilakukan melalui email Human Capital dengan lampiran lengkap dalam satu berkas PDF. Batas pengiriman mengikuti deadline pada halaman ini.',
      reviewSummary: 'Lingkungan profesional dengan prosedur yang jelas. Akses sistem terbatas sehingga porsi tugas cenderung pada modul tertentu.',
      fit: 80,
      reviews: [
        { name: 'Rizal H.', info: 'D4 Sistem Informasi Bisnis · Jul–Sep 2025', stars: 4, text: 'Prosedur kerja jelas dan mentor terbuka. Akses ke sistem produksi dibatasi demi keamanan.' }
      ]
    },
    {
      id: 'LWG-004', company: 'Bukalapak', initials: 'BL', color: 'c4',
      position: 'QA Automation Intern', city: 'Jakarta', area: 'Jakarta Selatan', province: 'DKI Jakarta',
      category: 'Software Development', industry: 'E-Commerce',
      status: 'Dibuka', workMode: 'Remote', skills: ['Selenium', 'Cypress', 'JavaScript', 'API Testing'],
      skillsBonus: ['Postman'], prodi: [TI, SIB, MI], quota: 3, filled: 1, minIpk: 3.0,
      postedAt: '2026-10-28', deadline: '2026-12-05', period: '11 Jan – 9 Apr 2027', duration: '3 bulan',
      rating: 4.4, reviewCount: 9,
      companyDesc: 'Perusahaan teknologi e-commerce yang berfokus pada pemberdayaan UMKM dan layanan digital.',
      description: 'Tim Quality Engineering mencari peserta magang untuk membangun dan memelihara skrip pengujian otomatis pada alur utama aplikasi web.',
      responsibilities: ['Menyusun test case dan skenario pengujian regresi.', 'Membuat skrip otomatisasi dengan Cypress/Selenium.', 'Melaporkan bug beserta langkah reproduksi yang jelas.', 'Mengelola hasil uji pada pipeline CI.'],
      academicReq: ['Mahasiswa aktif semester 5 atau 6.', 'IPK minimal 3.00 (skala 4.00).', 'Memiliki koneksi internet stabil untuk kerja jarak jauh.'],
      techReq: ['Memahami konsep pengujian perangkat lunak.', 'Dapat menulis skrip JavaScript dasar.'],
      docs: DOCS_STD,
      contact: { name: 'Sari Dewanti', role: 'Talent Acquisition', email: 'internship@bukalapak-demo.example', phone: '+62 21 2788 1100', address: 'Metropolitan Tower, Jakarta Selatan', website: 'https://www.bukalapak.com' },
      registration: 'Kirim CV dan contoh laporan bug (jika ada) ke email tim rekrutmen. Wawancara dilakukan secara daring.',
      reviewSummary: 'Kerja remote terstruktur dengan standup harian. Cocok bagi yang ingin mendalami otomatisasi pengujian.',
      fit: 85,
      reviews: [
        { name: 'Wulan K.', info: 'D4 Teknik Informatika · Jul–Sep 2025', stars: 4, text: 'Dapat tugas yang jelas dan mentor responsif walau bekerja remote.' }
      ]
    },
    {
      id: 'LWG-005', company: 'PT Astra Graphia IT', initials: 'AG', color: 'c5',
      position: 'Mobile Developer Intern (Flutter)', city: 'Jakarta', area: 'Jakarta Pusat', province: 'DKI Jakarta',
      category: 'Software Development', industry: 'Solusi Teknologi Informasi',
      status: 'Dibuka', workMode: 'Onsite', skills: ['Flutter', 'Dart', 'Firebase', 'Git'],
      skillsBonus: ['CI/CD'], prodi: [TI, MI], quota: 2, filled: 1, minIpk: 3.0,
      postedAt: '2026-11-01', deadline: '2026-12-12', period: '11 Jan – 9 Apr 2027', duration: '3 bulan',
      rating: 4.5, reviewCount: 7,
      companyDesc: 'Penyedia solusi dan layanan teknologi informasi untuk kebutuhan bisnis enterprise.',
      description: 'Magang pada tim pengembangan aplikasi mobile internal dan klien, mencakup pengembangan fitur, pengujian, dan perilisan.',
      responsibilities: ['Mengembangkan layar dan fitur aplikasi dengan Flutter.', 'Mengintegrasikan Firebase Auth dan Firestore.', 'Melakukan uji coba pada perangkat Android.', 'Berkolaborasi dengan desainer dan backend developer.'],
      academicReq: ['Mahasiswa aktif semester 5 atau 6.', 'IPK minimal 3.00 (skala 4.00).'],
      techReq: ['Memahami dasar pemrograman berorientasi objek (Dart/Java/Kotlin).', 'Pernah membangun aplikasi mobile sederhana.'],
      docs: DOCS_STD,
      contact: { name: 'Yuni Marlina', role: 'HR Business Partner', email: 'hr.intern@astragraphia-demo.example', phone: '+62 21 4585 3000', address: 'Jl. Kramat Raya No. 43, Jakarta Pusat', website: 'https://www.astragraphia.co.id' },
      registration: 'Daftar melalui email HR dan siapkan demo aplikasi yang pernah dibuat. Seleksi berupa wawancara teknis.',
      reviewSummary: 'Tugas langsung pada proyek klien dan mentor berpengalaman. Jam kerja onsite teratur.',
      fit: 90,
      reviews: [
        { name: 'Bagas T.', info: 'D4 Teknik Informatika · Jul–Sep 2025', stars: 5, text: 'Banyak belajar alur rilis aplikasi dari awal sampai Play Store.' }
      ]
    },
    {
      id: 'LWG-006', company: 'Diskominfo Kota Malang', initials: 'DS', color: 'c1',
      position: 'Web Developer (Pemerintahan)', city: 'Malang', area: 'Malang', province: 'Jawa Timur',
      category: 'Software Development', industry: 'Pemerintahan',
      status: 'Ditutup', workMode: 'Onsite', skills: ['PHP', 'CodeIgniter', 'PostgreSQL', 'HTML/CSS'],
      skillsBonus: [], prodi: [TI, SIB, MI], quota: 5, filled: 5, minIpk: 2.75,
      postedAt: '2026-09-15', deadline: '2026-10-20', period: '4 Jan – 2 Apr 2027', duration: '3 bulan',
      rating: 4.1, reviewCount: 15,
      companyDesc: 'Dinas yang mengelola layanan informatika, persandian, dan statistik pemerintah daerah Kota Malang.',
      description: 'Peserta magang membantu pengembangan dan pemeliharaan aplikasi layanan publik berbasis web milik pemerintah daerah.',
      responsibilities: ['Memelihara aplikasi layanan publik berbasis CodeIgniter.', 'Mengelola data pada basis data PostgreSQL.', 'Menyusun dokumentasi sistem dan manual pengguna.'],
      academicReq: ['Mahasiswa aktif semester 5 atau 6.', 'IPK minimal 2.75 (skala 4.00).', 'Berpakaian rapi sesuai ketentuan instansi.'],
      techReq: ['Memahami PHP dan SQL dasar.', 'Mampu membuat halaman web responsif.'],
      docs: DOCS_STD.slice(0, 3),
      contact: { name: 'Sekretariat Diskominfo', role: 'Bagian Umum & Kepegawaian', email: 'magang@diskominfo-malang-demo.example', phone: '+62 341 555 0123', address: 'Jl. Tugu No. 1, Kota Malang', website: '' },
      registration: 'Periode pendaftaran telah ditutup karena kuota terpenuhi. Pantau katalog untuk periode berikutnya.',
      reviewSummary: 'Suasana kerja santai dan mentor ramah. Teknologi yang dipakai relatif lama sehingga cocok untuk pemula.',
      fit: 72,
      reviews: [
        { name: 'Putri N.', info: 'D3 Manajemen Informatika · Jul–Sep 2025', stars: 4, text: 'Dapat pengalaman membangun aplikasi layanan publik. Fasilitas cukup memadai.' }
      ]
    },
    {
      id: 'LWG-007', company: 'Gojek', initials: 'GJ', color: 'c3',
      position: 'Data Analyst Intern', city: 'Jakarta', area: 'Jakarta Selatan', province: 'DKI Jakarta',
      category: 'Data & AI', industry: 'Teknologi On-Demand',
      status: 'Dibuka', workMode: 'Hybrid (2 hari WFO)', skills: ['SQL', 'Python', 'Tableau', 'Excel'],
      skillsBonus: ['BigQuery'], prodi: [TI, SIB, BD], quota: 4, filled: 2, minIpk: 3.25,
      postedAt: '2026-10-30', deadline: '2026-12-01', period: '4 Jan – 2 Apr 2027', duration: '3 bulan',
      rating: 4.7, reviewCount: 20,
      companyDesc: 'Ekosistem layanan on-demand yang mencakup transportasi, pengiriman, dan keuangan digital.',
      description: 'Bergabung dengan tim Data Analytics untuk menjawab pertanyaan bisnis melalui analisis data, dasbor, dan laporan berkala.',
      responsibilities: ['Menulis query SQL untuk ekstraksi dan agregasi data.', 'Membangun dasbor visualisasi di Tableau.', 'Menyajikan temuan analisis kepada tim produk.', 'Membersihkan dan memvalidasi dataset.'],
      academicReq: ['Mahasiswa aktif semester 5 atau 6.', 'IPK minimal 3.25 (skala 4.00).', 'Lulus mata kuliah basis data / statistika.'],
      techReq: ['Mahir SQL dasar-menengah.', 'Memahami Python (pandas) atau R.', 'Mampu menyusun visualisasi data yang informatif.'],
      docs: DOCS_STD,
      contact: { name: 'Mira Anindya', role: 'University Relations', email: 'university@gojek-demo.example', phone: '+62 21 5084 0900', address: 'Pasaraya Blok M Gedung B, Jakarta Selatan', website: 'https://www.gojek.com' },
      registration: 'Kirim CV dan tautan portofolio analisis (Kaggle/GitHub). Tahapan: tes SQL daring dan wawancara.',
      reviewSummary: 'Data nyata dalam skala besar dan mentor sangat berpengalaman. Tugas menantang namun terstruktur.',
      fit: 94,
      reviews: [
        { name: 'Intan C.', info: 'D4 Sistem Informasi Bisnis · Jul–Sep 2025', stars: 5, text: 'Dibimbing menulis query kompleks dan mempresentasikan insight ke tim produk.' },
        { name: 'Yoga M.', info: 'D4 Teknik Informatika · Jul–Sep 2025', stars: 5, text: 'Pengalaman bekerja dengan data skala besar, sangat sesuai dengan bidang saya.' }
      ]
    },
    {
      id: 'LWG-008', company: 'Traveloka', initials: 'TV', color: 'c4',
      position: 'UI/UX Designer Intern', city: 'Tangerang', area: 'Tangerang', province: 'Banten',
      category: 'UI/UX & Multimedia', industry: 'Perjalanan & Pariwisata Digital',
      status: 'Dibuka', workMode: 'Hybrid (3 hari WFO)', skills: ['Figma', 'User Research', 'Prototyping', 'Design System'],
      skillsBonus: ['Motion Design'], prodi: [SIB, BD, TI], quota: 2, filled: 0, minIpk: 3.0,
      postedAt: '2026-11-02', deadline: '2026-12-10', period: '11 Jan – 9 Apr 2027', duration: '3 bulan',
      rating: 4.5, reviewCount: 12,
      companyDesc: 'Platform perjalanan dan gaya hidup yang melayani pemesanan tiket, akomodasi, dan pengalaman wisata.',
      description: 'Tim Product Design membuka magang untuk membantu riset pengguna, perancangan alur, hingga prototipe interaktif fitur baru.',
      responsibilities: ['Membuat wireframe dan prototipe interaktif di Figma.', 'Membantu sesi riset dan pengujian kegunaan.', 'Menyelaraskan desain dengan design system.', 'Menyerahkan spesifikasi desain kepada engineer.'],
      academicReq: ['Mahasiswa aktif semester 5 atau 6.', 'IPK minimal 3.00 (skala 4.00).'],
      techReq: ['Menguasai Figma.', 'Memahami prinsip UX dan hierarki visual.', 'Memiliki portofolio studi kasus minimal 2 proyek.'],
      docs: [DOCS_STD[0], DOCS_STD[1], DOCS_STD[2], { name: 'Portofolio desain (Behance/Dribbble/PDF)', required: true }],
      contact: { name: 'Clara Santoso', role: 'Early Talent Program', email: 'early.talent@traveloka-demo.example', phone: '+62 21 2951 0000', address: 'Lippo Karawaci, Tangerang', website: 'https://www.traveloka.com' },
      registration: 'Portofolio wajib dilampirkan dalam email. Tahapan: review portofolio dan tantangan desain singkat.',
      reviewSummary: 'Budaya desain matang dan umpan balik rutin. Mentor mendorong berpikir berbasis data riset.',
      fit: 91,
      reviews: [
        { name: 'Salsa D.', info: 'D4 Bisnis Digital · Jul–Sep 2025', stars: 5, text: 'Dapat kesempatan ikut sesi usability test dan melihat langsung dampak desain.' }
      ]
    },
    {
      id: 'LWG-009', company: 'PT PLN (Persero) UID Jatim', initials: 'PL', color: 'c2',
      position: 'IT Support & Network Intern', city: 'Surabaya', area: 'Surabaya', province: 'Jawa Timur',
      category: 'Jaringan & Infrastruktur', industry: 'Energi & Kelistrikan',
      status: 'Dibuka', workMode: 'Onsite', skills: ['Mikrotik', 'Cisco', 'Troubleshooting', 'Linux'],
      skillsBonus: ['Zabbix'], prodi: [TI, MI], quota: 6, filled: 2, minIpk: 2.75,
      postedAt: '2026-10-18', deadline: '2026-11-25', period: '4 Jan – 2 Apr 2027', duration: '3 bulan',
      rating: 4.2, reviewCount: 6,
      companyDesc: 'BUMN penyedia tenaga listrik yang mengelola layanan distribusi dan pelanggan di wilayah Jawa Timur.',
      description: 'Peserta magang membantu tim TI dalam dukungan pengguna, pemeliharaan jaringan kantor, dan monitoring perangkat.',
      responsibilities: ['Menangani tiket dukungan pengguna (helpdesk).', 'Membantu konfigurasi router dan switch.', 'Memonitor ketersediaan jaringan kantor.', 'Mendokumentasikan topologi dan inventaris perangkat.'],
      academicReq: ['Mahasiswa aktif semester 5 atau 6.', 'IPK minimal 2.75 (skala 4.00).', 'Sehat jasmani dan bersedia bekerja di lapangan.'],
      techReq: ['Memahami dasar jaringan komputer (TCP/IP, VLAN).', 'Pernah mengonfigurasi Mikrotik atau Cisco pada tingkat dasar.'],
      docs: DOCS_STD.slice(0, 3),
      contact: { name: 'Agus Prasetyo', role: 'Bagian SDM & Umum', email: 'magang@pln-jatim-demo.example', phone: '+62 31 5340 0001', address: 'Jl. Embong Trengguli No. 19-21, Surabaya', website: '' },
      registration: 'Surat permohonan resmi dari Jurusan dikirim ke bagian SDM & Umum. Konfirmasi diberikan paling lambat 2 minggu setelah deadline.',
      reviewSummary: 'Banyak praktik langsung di lapangan dan kuota besar. Birokrasi administrasi agak panjang.',
      fit: 78,
      reviews: [
        { name: 'Andri L.', info: 'D3 Manajemen Informatika · Jul–Sep 2025', stars: 4, text: 'Banyak praktik langsung konfigurasi jaringan. Administrasi di awal cukup panjang.' }
      ]
    },
    {
      id: 'LWG-010', company: 'Pertamina RU IV Cilacap', initials: 'PC', color: 'c1',
      position: 'Business Intelligence Intern', city: 'Cilacap', area: 'Cilacap', province: 'Jawa Tengah',
      category: 'Data & AI', industry: 'Energi & Pengolahan Minyak',
      status: 'Dibuka', workMode: 'Onsite', skills: ['SQL', 'Power BI', 'Excel', 'ETL'],
      skillsBonus: ['Python'], prodi: [SIB, TI, BD], quota: 3, filled: 1, minIpk: 3.0,
      postedAt: '2026-10-22', deadline: '2026-12-15', period: '4 Jan – 2 Apr 2027', duration: '3 bulan',
      rating: 4.6, reviewCount: 14,
      companyDesc: 'Unit pengolahan minyak yang berlokasi di Cilacap dan menjadi salah satu kilang terbesar di Indonesia.',
      description: 'Magang pada tim Digital & Business Intelligence untuk mengolah data operasional dan membangun dasbor pemantauan kinerja kilang.',
      responsibilities: ['Menyusun dasbor Power BI untuk data operasional.', 'Membersihkan dan mentransformasi data (ETL).', 'Menyiapkan laporan berkala untuk manajemen.', 'Berdiskusi dengan unit operasi untuk kebutuhan data.'],
      academicReq: ['Mahasiswa aktif semester 5 atau 6.', 'IPK minimal 3.00 (skala 4.00).', 'Bersedia mengikuti induksi K3 sebelum mulai.'],
      techReq: ['Memahami SQL dan Excel tingkat menengah.', 'Pernah memakai alat visualisasi (Power BI/Tableau).'],
      docs: DOCS_STD,
      contact: { name: 'Dewi Kartika', role: 'Learning & Development', email: 'magang.ru4@pertamina-demo.example', phone: '+62 280 123 4567', address: 'Jl. MT Haryono No. 77, Cilacap', website: '' },
      registration: 'Berkas dikirim ke email L&D dengan subjek "Magang BI – Nama – NIM". Seleksi mencakup tes dasar K3 dan wawancara.',
      reviewSummary: 'Dekat dengan kampus dan mentor mengarahkan pada kasus bisnis nyata. Wajib mengikuti prosedur K3 ketat.',
      fit: 89,
      reviews: [
        { name: 'Ayu P.', info: 'D4 Sistem Informasi Bisnis · Jul–Sep 2025', stars: 5, text: 'Dapat membangun dasbor yang benar-benar dipakai manajemen. Lokasi dekat kampus.' }
      ]
    },
    {
      id: 'LWG-011', company: 'Kreasi Digital Nusantara', initials: 'KD', color: 'c5',
      position: 'Digital Marketing Intern', city: 'Yogyakarta', area: 'Sleman', province: 'DI Yogyakarta',
      category: 'Bisnis & Digital Marketing', industry: 'Agensi Pemasaran Digital',
      status: 'Dibuka', workMode: 'Remote', skills: ['SEO', 'Copywriting', 'Google Analytics', 'Social Media'],
      skillsBonus: ['Meta Ads'], prodi: [BD, SIB], quota: 5, filled: 2, minIpk: 2.75,
      postedAt: '2026-11-03', deadline: '2026-12-20', period: '11 Jan – 9 Apr 2027', duration: '3 bulan',
      rating: null, reviewCount: 0,
      companyDesc: 'Agensi pemasaran digital yang melayani UMKM dan brand lokal dengan strategi konten dan iklan berbasis data.',
      description: 'Peserta magang membantu perencanaan konten, optimasi SEO, serta pelaporan performa kampanye media sosial klien.',
      responsibilities: ['Membuat kalender dan materi konten media sosial.', 'Melakukan riset kata kunci dan optimasi SEO dasar.', 'Menyusun laporan performa kampanye di Google Analytics.', 'Membantu pengelolaan akun iklan berbayar.'],
      academicReq: ['Mahasiswa aktif semester 4 atau lebih.', 'IPK minimal 2.75 (skala 4.00).'],
      techReq: ['Mampu menulis konten yang komunikatif.', 'Memahami dasar SEO dan analitik web.'],
      docs: [DOCS_STD[0], DOCS_STD[2], { name: 'Contoh konten / portofolio (opsional)', required: false }],
      contact: { name: 'Lintang Ayu', role: 'Creative Manager', email: 'hello@kreasidigital-demo.example', phone: '+62 274 555 0188', address: 'Jl. Kaliurang Km 5, Sleman, Yogyakarta', website: 'https://kreasidigital.example' },
      registration: 'Kirim CV beserta contoh konten ke email. Wawancara daring dan tugas copywriting singkat.',
      reviewSummary: '',
      fit: null,
      reviews: []
    },
    {
      id: 'LWG-012', company: 'Bank Jateng', initials: 'BJ', color: 'c2',
      position: 'Cloud & Server Administrator Intern', city: 'Semarang', area: 'Semarang', province: 'Jawa Tengah',
      category: 'Jaringan & Infrastruktur', industry: 'Perbankan Daerah',
      status: 'Segera Ditutup', workMode: 'Onsite', skills: ['Linux', 'Docker', 'Virtualisasi', 'Bash'],
      skillsBonus: ['AWS'], prodi: [TI, MI], quota: 2, filled: 1, minIpk: 3.0,
      postedAt: '2026-10-12', deadline: '2026-11-10', period: '4 Jan – 2 Apr 2027', duration: '3 bulan',
      rating: 4.0, reviewCount: 5,
      companyDesc: 'Bank pembangunan daerah dengan layanan perbankan ritel dan komersial di wilayah Jawa Tengah.',
      description: 'Membantu tim infrastruktur TI dalam administrasi server, virtualisasi, serta pemantauan layanan perbankan internal.',
      responsibilities: ['Mengelola server Linux dan layanan virtualisasi.', 'Menyusun skrip otomatisasi rutin dengan Bash.', 'Memantau kesehatan server dan melaporkan insiden.', 'Mendokumentasikan prosedur operasional.'],
      academicReq: ['Mahasiswa aktif semester 5 atau 6.', 'IPK minimal 3.00 (skala 4.00).', 'Bersedia menandatangani perjanjian kerahasiaan.'],
      techReq: ['Mahir perintah dasar Linux.', 'Memahami konsep virtualisasi dan container.'],
      docs: DOCS_STD.slice(0, 3),
      contact: { name: 'Eko Santosa', role: 'Divisi Sumber Daya Manusia', email: 'magang@bankjateng-demo.example', phone: '+62 24 354 4444', address: 'Jl. Pemuda No. 142, Semarang', website: '' },
      registration: 'Surat pengantar Jurusan dan CV dikirim ke email SDM. Wawancara dilakukan di kantor pusat.',
      reviewSummary: 'Lingkungan kerja formal dengan fokus pada keamanan. Kesempatan hands-on terbatas namun mentor perhatian.',
      fit: 82,
      reviews: [
        { name: 'Hana F.', info: 'D4 Teknik Informatika · Jul–Sep 2025', stars: 4, text: 'Mentor perhatian dan lingkungan tertib. Akses produksi terbatas.' }
      ]
    }
  ];

  /* ===================================================================
     2. UTILITAS
     =================================================================== */
  var MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
  var STATUS_BADGE = { 'Dibuka': 'badge-success', 'Segera Ditutup': 'badge-warning', 'Ditutup': 'badge-neutral' };

  function esc(v) {
    return String(v == null ? '' : v).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function norm(v) { return String(v == null ? '' : v).toLowerCase().trim(); }
  function $(sel, root) { return (root || document).querySelector(sel); }
  function $$(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }
  function fmtDate(iso) {
    var p = String(iso || '').split('-');
    if (p.length !== 3) return '-';
    return parseInt(p[2], 10) + ' ' + MONTHS[parseInt(p[1], 10) - 1] + ' ' + p[0];
  }
  function remaining(job) { return Math.max(0, (job.quota || 0) - (job.filled || 0)); }
  function isClosed(job) { return job.status === 'Ditutup' || remaining(job) === 0; }
  function ratingText(job) {
    return job.rating == null || !job.reviewCount ? 'Belum ada ulasan' : job.rating.toFixed(1) + ' (' + job.reviewCount + ' ulasan)';
  }
  function statusBadge(job) {
    return '<span class="badge ' + (STATUS_BADGE[job.status] || 'badge-neutral') + ' badge-dot">' + esc(job.status) + '</span>';
  }
  function icon(name) { return '<span class="material-symbols-outlined">' + name + '</span>'; }
  function stars(value) {
    var out = '', i, full = Math.floor(value || 0), half = (value || 0) - full >= 0.5;
    for (i = 1; i <= 5; i++) {
      if (i <= full) out += icon('star');
      else if (i === full + 1 && half) out += icon('star_half');
      else out += '<span class="material-symbols-outlined off">star</span>';
    }
    return '<span class="stars" aria-label="Rating ' + (value || 0) + ' dari 5">' + out + '</span>';
  }
  function debounce(fn, ms) {
    var t;
    return function () { var a = arguments, c = this; clearTimeout(t); t = setTimeout(function () { fn.apply(c, a); }, ms); };
  }
  function toast(msg, ic) { if (typeof window.showToast === 'function') window.showToast(esc(msg), ic); }
  function uniqueSorted(arr) {
    var seen = {}, out = [];
    arr.forEach(function (v) { if (v && !seen[norm(v)]) { seen[norm(v)] = 1; out.push(v); } });
    return out.sort(function (a, b) { return a.localeCompare(b, 'id'); });
  }

  /* ===================================================================
     3. LAPISAN DATA (ganti isi fungsi ini untuk integrasi backend)
     =================================================================== */
  var api = {
    /** Simulasi latensi jaringan. Parameter URL ?demo=loading|error|empty untuk menguji kondisi tampilan. */
    fetchJobs: function () {
      var demo = new URLSearchParams(location.search).get('demo');
      return new Promise(function (resolve, reject) {
        setTimeout(function () {
          if (demo === 'error' && !api._retried) return reject(new Error('Simulasi gagal memuat data'));
          resolve(demo === 'empty' ? [] : JOBS.slice());
        }, demo === 'loading' ? 4000 : 450);
      });
    },
    fetchJobById: function (id) {
      return api.fetchJobs().then(function (list) {
        return list.filter(function (j) { return j.id === id; })[0] || null;
      });
    },
    _retried: false
  };

  /** Hanya field dasar yang boleh tampil di katalog publik. */
  function toPublic(job) {
    return {
      id: job.id, company: job.company, initials: job.initials, color: job.color,
      position: job.position, city: job.city, area: job.area, category: job.category, status: job.status,
      postedAt: job.postedAt
    };
  }

  /* ===================================================================
     4. FAVORIT (localStorage, satu sumber data untuk semua halaman)
     =================================================================== */
  var FAV_KEY = 'simag_jkb_favorit_v1';
  var memoryFav = [];
  var favorites = {
    list: function () {
      try {
        var raw = JSON.parse(localStorage.getItem(FAV_KEY));
        var seen = {};
        return (Array.isArray(raw) ? raw : []).filter(function (x) {
          if (!x || typeof x.id !== 'string' || seen[x.id]) return false;
          seen[x.id] = true; return true;
        });
      } catch (e) { return memoryFav.slice(); }
    },
    _write: function (list) {
      memoryFav = list.slice();
      try { localStorage.setItem(FAV_KEY, JSON.stringify(list)); } catch (e) { /* mode privat: pakai memori */ }
    },
    ids: function () { return favorites.list().map(function (x) { return x.id; }); },
    has: function (id) { return favorites.ids().indexOf(id) !== -1; },
    count: function () { return favorites.list().length; },
    savedAt: function (id) {
      var f = favorites.list().filter(function (x) { return x.id === id; })[0];
      return f ? f.savedAt : 0;
    },
    add: function (id) {
      if (favorites.has(id)) return false; /* tidak boleh duplikat */
      var l = favorites.list(); l.push({ id: id, savedAt: Date.now() });
      favorites._write(l); favorites._emit(id, 'add'); return true;
    },
    remove: function (id) {
      if (!favorites.has(id)) return false;
      favorites._write(favorites.list().filter(function (x) { return x.id !== id; }));
      favorites._emit(id, 'remove'); return true;
    },
    toggle: function (id) { return favorites.has(id) ? (favorites.remove(id), false) : (favorites.add(id), true); },
    _emit: function (id, action) {
      window.dispatchEvent(new CustomEvent('simag:favorit-changed', { detail: { id: id, action: action } }));
    }
  };

  function jobTitleById(id) {
    var j = JOBS.filter(function (x) { return x.id === id; })[0];
    return j ? j.position + ' — ' + j.company : 'Lowongan';
  }

  /** Sinkronkan seluruh tombol & badge favorit di halaman. */
  function syncFavoriteUI() {
    var n = favorites.count();
    $$('[data-fav-id]').forEach(function (btn) {
      var on = favorites.has(btn.getAttribute('data-fav-id'));
      btn.classList.toggle('is-active', on);
      btn.setAttribute('aria-pressed', on ? 'true' : 'false');
      var label = btn.querySelector('[data-fav-label]');
      var txt = on ? 'Hapus dari Favorit' : 'Simpan ke Favorit';
      if (label) label.textContent = txt; else btn.title = txt;
      if (!label) btn.setAttribute('aria-label', txt);
    });
    $$('[data-fav-count]').forEach(function (el) { el.textContent = n; el.hidden = n === 0; });
  }

  /* Capture-phase agar handler .bookmark-btn bawaan main.js tidak ikut berjalan. */
  document.addEventListener('click', function (e) {
    var btn = e.target.closest ? e.target.closest('[data-fav-id]') : null;
    if (!btn) return;
    e.preventDefault(); e.stopPropagation();
    var id = btn.getAttribute('data-fav-id');
    var title = jobTitleById(id);
    if (favorites.toggle(id)) toast('"' + title + '" disimpan ke Favorit', 'bookmark_added');
    else toast('"' + title + '" dihapus dari Favorit', 'bookmark_remove');
  }, true);
  window.addEventListener('simag:favorit-changed', syncFavoriteUI);
  window.addEventListener('storage', function (e) {
    if (e.key === FAV_KEY) { syncFavoriteUI(); window.dispatchEvent(new CustomEvent('simag:favorit-changed', { detail: { action: 'external' } })); }
  });

  /* ===================================================================
     5. KOMPONEN RENDER BERSAMA
     =================================================================== */
  function bookmarkBtn(job) {
    return '<button type="button" class="bookmark-btn" data-fav-id="' + esc(job.id) + '" aria-pressed="false" title="Simpan ke Favorit" aria-label="Simpan ke Favorit">' + icon('bookmark') + '</button>';
  }
  function detailHref(id, from) {
    return 'detail-lowongan.html?id=' + encodeURIComponent(id) + (from ? '&from=' + from : '');
  }

  function publicCard(j) {
    return '<article class="card card-hover job-card"><div class="card-body">' +
      '<div class="job-card-head"><div class="logo-box ' + esc(j.color) + '">' + esc(j.initials) + '</div>' +
      '<div class="meta"><div class="job-card-company">' + esc(j.company) + '</div><div class="mt-xs">' + statusBadge(j) + '</div></div></div>' +
      '<h3 class="job-card-title">' + esc(j.position) + '</h3>' +
      '<div class="job-meta"><span>' + icon('location_on') + esc(j.area) + '</span><span>' + icon('category') + esc(j.category) + '</span></div>' +
      '</div><div class="card-footer"><a href="login.html" class="btn btn-secondary btn-sm btn-block">' + icon('lock') + 'Masuk untuk lihat detail</a></div></article>';
  }

  function studentCard(j, opts) {
    opts = opts || {};
    var closed = isClosed(j);
    var skills = j.skills.slice(0, 4).map(function (s) { return '<span class="tag">' + esc(s) + '</span>'; }).join('');
    if (j.skills.length > 4) skills += '<span class="tag tag-outline">+' + (j.skills.length - 4) + '</span>';
    return '<article class="card card-hover job-card' + (closed ? ' is-closed' : '') + '"><div class="card-body">' +
      '<div class="job-card-head"><div class="logo-box ' + esc(j.color) + '">' + esc(j.initials) + '</div>' +
      '<div class="meta"><div class="job-card-company">' + esc(j.company) + '</div><div class="mt-xs">' + statusBadge(j) + '</div></div>' +
      bookmarkBtn(j) + '</div>' +
      '<h3 class="job-card-title">' + esc(j.position) + '</h3>' +
      '<div class="job-meta">' +
      '<span>' + icon('location_on') + esc(j.area) + ' · ' + esc(j.workMode.split(' (')[0]) + '</span>' +
      '<span>' + icon('category') + esc(j.category) + '</span>' +
      '<span>' + icon('group') + (closed ? 'Kuota terpenuhi' : 'Sisa ' + remaining(j) + ' dari ' + j.quota + ' kuota') + '</span>' +
      '<span>' + icon('star') + esc(ratingText(j)) + '</span>' +
      (opts.showIpk ? '<span>' + icon('school') + 'Min. IPK: ' + j.minIpk.toFixed(2) + '</span>' : '') +
      '</div>' +
      '<div class="flex flex-wrap gap-xs">' + skills + '</div>' +
      '</div><div class="card-footer"><span class="caption' + (j.status === 'Segera Ditutup' ? ' text-warning' : '') + '">' +
      (closed && j.status === 'Ditutup' ? 'Ditutup ' : 'Deadline ') + fmtDate(j.deadline) + '</span>' +
      '<a href="' + detailHref(j.id, opts.from) + '" class="btn ' + (closed ? 'btn-ghost' : 'btn-secondary') + ' btn-sm">' + (opts.detailLabel || 'Detail Lowongan') + '</a></div></article>';
  }

  function skeletonCards(n) {
    var one = '<div class="card job-card skeleton-card" aria-hidden="true"><div class="card-body">' +
      '<div class="job-card-head"><div class="skeleton skeleton-logo"></div><div class="meta"><div class="skeleton skeleton-line w-70"></div><div class="skeleton skeleton-line w-40"></div></div></div>' +
      '<div class="skeleton skeleton-line w-90 tall"></div><div class="skeleton skeleton-line w-60"></div><div class="skeleton skeleton-line w-80"></div></div>' +
      '<div class="card-footer"><div class="skeleton skeleton-line w-40"></div><div class="skeleton skeleton-btn"></div></div></div>';
    return new Array(n + 1).join(one);
  }

  function stateBlock(kind, title, text, actions) {
    var icons = { empty: 'inventory_2', search: 'search_off', filter: 'filter_alt_off', error: 'error' };
    var wrapCls = kind === 'error' ? ' is-error' : '';
    return '<div class="card p-xl state-block' + wrapCls + '" role="status"><div class="empty-state"><div class="icon-wrap">' + icon(icons[kind] || 'info') + '</div>' +
      '<h2 class="h2 mb-xs">' + esc(title) + '</h2><p class="body text-muted mb-lg state-text">' + text + '</p>' +
      '<div class="flex gap-sm justify-center flex-wrap">' + (actions || '') + '</div></div></div>';
  }

  function paginationHtml(page, pages) {
    if (pages <= 1) return '';
    var items = [], i, out = '';
    for (i = 1; i <= pages; i++) {
      if (i === 1 || i === pages || Math.abs(i - page) <= 1) items.push(i);
      else if (items[items.length - 1] !== '…') items.push('…');
    }
    out += '<a href="#" data-page="' + (page - 1) + '" aria-label="Sebelumnya"' + (page === 1 ? ' aria-disabled="true"' : '') + '>' + icon('chevron_left') + '</a>';
    items.forEach(function (it) {
      out += it === '…' ? '<span>…</span>' : '<a href="#" data-page="' + it + '"' + (it === page ? ' class="active" aria-current="page"' : '') + '>' + it + '</a>';
    });
    out += '<a href="#" data-page="' + (page + 1) + '" aria-label="Berikutnya"' + (page === pages ? ' aria-disabled="true"' : '') + '>' + icon('chevron_right') + '</a>';
    return out;
  }

  function bindPagination(nav, onChange) {
    nav.addEventListener('click', function (e) {
      var a = e.target.closest('[data-page]');
      if (!a) return;
      e.preventDefault();
      if (a.getAttribute('aria-disabled') === 'true' || a.classList.contains('active')) return;
      onChange(parseInt(a.getAttribute('data-page'), 10));
    });
  }

  function sortJobs(list, key) {
    var arr = list.slice();
    var byName = function (a, b) { return a.company.localeCompare(b.company, 'id'); };
    arr.sort(function (a, b) {
      switch (key) {
        case 'nama': return byName(a, b);
        case 'lokasi': return a.city.localeCompare(b.city, 'id') || a.area.localeCompare(b.area, 'id') || byName(a, b);
        case 'rating': return (b.rating == null ? -1 : b.rating) - (a.rating == null ? -1 : a.rating) || (b.reviewCount - a.reviewCount) || byName(a, b);
        default: return b.postedAt.localeCompare(a.postedAt) || byName(a, b); /* terbaru */
      }
    });
    return arr;
  }

  function pushUrl(params) {
    var qs = params.toString();
    try { history.replaceState(null, '', location.pathname + (qs ? '?' + qs : '')); } catch (e) { /* file:// tertentu */ }
  }
  function scrollToEl(el) { if (el && el.scrollIntoView) el.scrollIntoView({ behavior: 'smooth', block: 'start' }); }

  /** Memuat data dengan penanganan loading/error generik. */
  function loadWithStates(gridEl, skeletonN, onOk, onRetry) {
    gridEl.innerHTML = skeletonCards(skeletonN);
    gridEl.setAttribute('aria-busy', 'true');
    api.fetchJobs().then(function (list) {
      gridEl.removeAttribute('aria-busy');
      onOk(list);
    }).catch(function () {
      gridEl.removeAttribute('aria-busy');
      gridEl.classList.remove('is-list');
      gridEl.innerHTML = '<div class="grid-span">' + stateBlock('error', 'Data lowongan gagal dimuat',
        'Terjadi kesalahan saat memuat data. Periksa koneksi Anda lalu coba lagi.',
        '<button type="button" class="btn btn-primary" data-retry>' + icon('refresh') + 'Coba Lagi</button>') + '</div>';
      var r = gridEl.querySelector('[data-retry]');
      if (r) r.addEventListener('click', function () { api._retried = true; onRetry(); });
    });
  }

  /* ===================================================================
     6. HALAMAN: KATALOG PUBLIK
     =================================================================== */
  function initPublic() {
    var PAGE = 6;
    var el = {
      q: $('#pubQ'), kota: $('#pubKota'), kat: $('#pubKategori'), grid: $('#catalogGrid'),
      count: $('#resultCount'), nav: $('#pagination'), info: $('#pageInfo'), reset: $('#pubReset'), form: $('#pubForm')
    };
    var all = [];
    var p = new URLSearchParams(location.search);
    var state = { q: p.get('q') || '', kota: p.get('kota') || '', kat: p.get('kategori') || '', page: parseInt(p.get('page'), 10) || 1 };

    function fillOptions(sel, values, first) {
      sel.innerHTML = '<option value="">' + first + '</option>' + values.map(function (v) { return '<option>' + esc(v) + '</option>'; }).join('');
    }
    function filtered() {
      var q = norm(state.q);
      return all.filter(function (j) {
        return (!q || norm(j.position).indexOf(q) !== -1) &&
          (!state.kota || norm(j.city) === norm(state.kota)) &&
          (!state.kat || j.category === state.kat);
      });
    }
    function render() {
      var list = sortJobs(filtered(), 'terbaru');
      var pages = Math.max(1, Math.ceil(list.length / PAGE));
      state.page = Math.min(Math.max(1, state.page), pages);
      var slice = list.slice((state.page - 1) * PAGE, state.page * PAGE);
      var hasFilter = !!(state.q || state.kota || state.kat);

      el.count.innerHTML = 'Menampilkan <strong class="text-primary">' + list.length + '</strong> dari ' + all.length + ' lowongan';
      el.reset.classList.toggle('hidden', !hasFilter);
      el.grid.classList.remove('is-list');

      if (!all.length) {
        el.grid.innerHTML = '<div class="grid-span">' + stateBlock('empty', 'Belum ada lowongan', 'Saat ini belum ada lowongan yang dipublikasikan. Silakan kembali lagi nanti.') + '</div>';
      } else if (!list.length) {
        el.grid.innerHTML = '<div class="grid-span">' + stateBlock(state.q && !state.kota && !state.kat ? 'search' : 'filter',
          state.q && !state.kota && !state.kat ? 'Posisi tidak ditemukan' : 'Tidak ada lowongan yang cocok',
          'Tidak ada lowongan yang sesuai dengan pencarian Anda. Coba kata kunci lain atau ubah filter.',
          '<button type="button" class="btn btn-secondary" data-reset>' + icon('restart_alt') + 'Reset Pencarian</button>') + '</div>';
      } else {
        el.grid.innerHTML = slice.map(publicCard).join('');
      }
      el.nav.innerHTML = paginationHtml(state.page, pages);
      el.info.textContent = list.length ? 'Halaman ' + state.page + ' dari ' + pages : '';

      var u = new URLSearchParams();
      if (state.q) u.set('q', state.q);
      if (state.kota) u.set('kota', state.kota);
      if (state.kat) u.set('kategori', state.kat);
      if (state.page > 1) u.set('page', state.page);
      pushUrl(u);
    }
    function resetAll() { state.q = ''; state.kota = ''; state.kat = ''; state.page = 1; el.q.value = ''; el.kota.value = ''; el.kat.value = ''; render(); }

    function start() {
      loadWithStates(el.grid, PAGE, function (list) {
        all = list.map(toPublic); /* hanya data dasar */
        fillOptions(el.kota, uniqueSorted(all.map(function (j) { return j.city; })), 'Semua Kota');
        fillOptions(el.kat, uniqueSorted(all.map(function (j) { return j.category; })), 'Semua Kategori');
        el.q.value = state.q; el.kota.value = state.kota; el.kat.value = state.kat;
        render();
      }, start);
    }

    el.q.addEventListener('input', debounce(function () { state.q = el.q.value; state.page = 1; render(); }, 200));
    el.kota.addEventListener('change', function () { state.kota = el.kota.value; state.page = 1; render(); });
    el.kat.addEventListener('change', function () { state.kat = el.kat.value; state.page = 1; render(); });
    el.form.addEventListener('submit', function (e) { e.preventDefault(); state.q = el.q.value; state.page = 1; render(); scrollToEl(el.grid); });
    el.reset.addEventListener('click', resetAll);
    el.grid.addEventListener('click', function (e) { if (e.target.closest('[data-reset]')) resetAll(); });
    bindPagination(el.nav, function (n) { state.page = n; render(); scrollToEl($('#catalogTop')); });
    start();
  }

  /* ===================================================================
     7. HALAMAN: KATALOG MAHASISWA
     =================================================================== */
  function initStudentCatalog() {
    var PAGE = 6;
    var el = {
      grid: $('#catalogGrid'), count: $('#resultCount'), nav: $('#pagination'), info: $('#pageInfo'),
      searches: $$('[data-search-input]'), prodi: $('#fProdi'), kota: $('#fKota'), kat: $('#fKategori'),
      status: $('#fStatus'), mode: $('#fMode'), skillInput: $('#fSkillInput'), skillAdd: $('#fSkillAdd'),
      skillChips: $('#fSkillChips'), skillList: $('#skillOptions'), sort: $('#sortSelect'),
      chips: $('#activeChips'), reset: $$('[data-reset-filter]'), view: $('#viewToggle'),
      filterPanel: $('#filterPanel'), filterToggle: $('#filterToggle')
    };
    var all = [];
    var DEFAULT = function () { return { q: '', prodi: '', kota: '', kat: [], skill: [], status: '', mode: [], sort: 'terbaru', page: 1 }; };
    var state = DEFAULT();
    var p = new URLSearchParams(location.search);
    var csv = function (k) { return (p.get(k) || '').split(',').filter(Boolean); };
    state.q = p.get('q') || ''; state.prodi = p.get('prodi') || ''; state.kota = p.get('kota') || '';
    state.kat = csv('kategori'); state.skill = csv('skill'); state.status = p.get('status') || '';
    state.mode = csv('mode'); state.sort = p.get('sort') || 'terbaru'; state.page = parseInt(p.get('page'), 10) || 1;

    function modeOf(j) { return j.workMode.split(' (')[0]; }
    function matches(j) {
      var q = norm(state.q);
      if (q && norm(j.company).indexOf(q) === -1 && norm(j.position).indexOf(q) === -1) return false;
      if (state.prodi && j.prodi.indexOf(state.prodi) === -1) return false;
      if (state.kota && j.city !== state.kota) return false;
      if (state.kat.length && state.kat.indexOf(j.category) === -1) return false;
      if (state.skill.length) {
        var mine = j.skills.concat(j.skillsBonus || []).map(norm);
        var ok = state.skill.some(function (s) { return mine.indexOf(norm(s)) !== -1; });
        if (!ok) return false;
      }
      if (state.status && j.status !== state.status) return false;
      if (state.mode.length && state.mode.indexOf(modeOf(j)) === -1) return false;
      return true;
    }
    function activeFilterCount() {
      return (state.prodi ? 1 : 0) + (state.kota ? 1 : 0) + state.kat.length + state.skill.length + (state.status ? 1 : 0) + state.mode.length;
    }

    function syncControls() {
      el.searches.forEach(function (s) { if (s.value !== state.q) s.value = state.q; });
      el.prodi.value = state.prodi; el.kota.value = state.kota; el.status.value = state.status; el.sort.value = state.sort;
      $$('input[type=checkbox]', el.kat).forEach(function (c) { c.checked = state.kat.indexOf(c.value) !== -1; });
      $$('input[type=checkbox]', el.mode).forEach(function (c) { c.checked = state.mode.indexOf(c.value) !== -1; });
      el.skillChips.innerHTML = state.skill.map(function (s) {
        return '<span class="filter-chip">' + esc(s) + '<button type="button" data-remove="skill" data-value="' + esc(s) + '" aria-label="Hapus keahlian ' + esc(s) + '">' + icon('close') + '</button></span>';
      }).join('');
    }

    function renderChips() {
      var chips = [];
      var add = function (type, value, label) {
        chips.push('<span class="filter-chip">' + esc(label) + '<button type="button" data-remove="' + type + '" data-value="' + esc(value) + '" aria-label="Hapus filter ' + esc(label) + '">' + icon('close') + '</button></span>');
      };
      if (state.q) add('q', '', 'Cari: "' + state.q + '"');
      if (state.prodi) add('prodi', '', state.prodi);
      if (state.kota) add('kota', '', state.kota);
      state.kat.forEach(function (k) { add('kat', k, k); });
      state.skill.forEach(function (k) { add('skill', k, k); });
      if (state.status) add('status', '', state.status);
      state.mode.forEach(function (k) { add('mode', k, k); });
      el.chips.innerHTML = chips.join('');
      el.chips.classList.toggle('hidden', !chips.length);
      el.reset.forEach(function (b) { b.disabled = !chips.length; });
      var badge = $('#filterBadge');
      if (badge) { badge.textContent = activeFilterCount(); badge.hidden = activeFilterCount() === 0; }
    }

    function render() {
      var list = sortJobs(all.filter(matches), state.sort);
      var pages = Math.max(1, Math.ceil(list.length / PAGE));
      state.page = Math.min(Math.max(1, state.page), pages);
      var start = (state.page - 1) * PAGE;
      var slice = list.slice(start, start + PAGE);
      var hasQuery = !!state.q, hasFilter = activeFilterCount() > 0;

      syncControls(); renderChips();
      el.count.innerHTML = list.length ?
        'Menampilkan <strong class="text-primary">' + (start + 1) + '–' + (start + slice.length) + '</strong> dari <strong class="text-primary">' + list.length + '</strong> lowongan' :
        'Menampilkan <strong class="text-primary">0</strong> lowongan';

      if (!all.length) {
        el.grid.classList.remove('is-list');
        el.grid.innerHTML = '<div class="grid-span">' + stateBlock('empty', 'Belum ada data lowongan', 'Admin belum menambahkan lowongan. Silakan cek kembali nanti.') + '</div>';
      } else if (!list.length) {
        el.grid.classList.remove('is-list');
        var onlySearch = hasQuery && !hasFilter;
        el.grid.innerHTML = '<div class="grid-span">' + (onlySearch
          ? stateBlock('search', 'Hasil pencarian kosong', 'Tidak ada lowongan dengan kata kunci <strong>"' + esc(state.q) + '"</strong>. Periksa ejaan atau coba nama perusahaan/posisi lain.',
            '<button type="button" class="btn btn-secondary" data-clear-search>' + icon('close') + 'Hapus Pencarian</button>')
          : stateBlock('filter', 'Filter tidak menemukan hasil', 'Tidak ada lowongan yang cocok dengan kombinasi filter yang dipilih' + (hasQuery ? ' dan kata kunci pencarian' : '') + '. Longgarkan atau reset filter.',
            '<button type="button" class="btn btn-primary" data-reset-filter-inline>' + icon('restart_alt') + 'Reset Semua Filter</button>')) + '</div>';
      } else {
        el.grid.innerHTML = slice.map(function (j) { return studentCard(j); }).join('');
        el.grid.classList.toggle('is-list', el.view.getAttribute('data-view') === 'list');
      }
      el.nav.innerHTML = paginationHtml(state.page, pages);
      el.info.textContent = list.length ? 'Halaman ' + state.page + ' dari ' + pages : '';
      syncFavoriteUI();

      var u = new URLSearchParams();
      if (state.q) u.set('q', state.q);
      if (state.prodi) u.set('prodi', state.prodi);
      if (state.kota) u.set('kota', state.kota);
      if (state.kat.length) u.set('kategori', state.kat.join(','));
      if (state.skill.length) u.set('skill', state.skill.join(','));
      if (state.status) u.set('status', state.status);
      if (state.mode.length) u.set('mode', state.mode.join(','));
      if (state.sort !== 'terbaru') u.set('sort', state.sort);
      if (state.page > 1) u.set('page', state.page);
      pushUrl(u);
    }

    function setState(patch, keepPage) {
      Object.keys(patch).forEach(function (k) { state[k] = patch[k]; });
      if (!keepPage) state.page = 1;
      render();
    }
    function resetFilters() { var d = DEFAULT(); d.sort = state.sort; state = d; render(); }

    function addSkill(raw) {
      var v = norm(raw);
      if (!v) return;
      var known = uniqueSorted(allSkills()).filter(function (s) { return norm(s) === v; })[0];
      if (!known) { toast('Keahlian "' + raw + '" belum ada pada data lowongan', 'info'); return; }
      if (state.skill.indexOf(known) !== -1) { el.skillInput.value = ''; return; }
      el.skillInput.value = '';
      setState({ skill: state.skill.concat(known) });
    }
    function allSkills() {
      var out = [];
      all.forEach(function (j) { out = out.concat(j.skills, j.skillsBonus || []); });
      return out;
    }

    function buildFilterOptions() {
      var cats = uniqueSorted(all.map(function (j) { return j.category; }));
      el.kat.innerHTML = cats.map(function (c) {
        var n = all.filter(function (j) { return j.category === c; }).length;
        return '<label class="check"><input type="checkbox" value="' + esc(c) + '"> ' + esc(c) + ' <span class="count">' + n + '</span></label>';
      }).join('');
      el.kota.innerHTML = '<option value="">Semua Kota</option>' + uniqueSorted(all.map(function (j) { return j.city; })).map(function (c) { return '<option>' + esc(c) + '</option>'; }).join('');
      el.prodi.innerHTML = '<option value="">Semua Program Studi</option>' + PRODI.map(function (c) { return '<option>' + esc(c) + '</option>'; }).join('');
      el.skillList.innerHTML = uniqueSorted(allSkills()).map(function (s) { return '<option value="' + esc(s) + '"></option>'; }).join('');
      var modes = uniqueSorted(all.map(modeOf));
      el.mode.innerHTML = modes.map(function (m) { return '<label class="check"><input type="checkbox" value="' + esc(m) + '"> ' + esc(m) + '</label>'; }).join('');
    }

    function start() {
      loadWithStates(el.grid, PAGE, function (list) {
        all = list;
        buildFilterOptions();
        render();
      }, start);
    }

    /* ---- Event ---- */
    var onSearch = debounce(function (v) { setState({ q: v }); }, 200);
    el.searches.forEach(function (s) { s.addEventListener('input', function () { onSearch(s.value); }); });
    el.prodi.addEventListener('change', function () { setState({ prodi: el.prodi.value }); });
    el.kota.addEventListener('change', function () { setState({ kota: el.kota.value }); });
    el.status.addEventListener('change', function () { setState({ status: el.status.value }); });
    el.sort.addEventListener('change', function () { setState({ sort: el.sort.value }); });
    el.kat.addEventListener('change', function () { setState({ kat: $$('input:checked', el.kat).map(function (c) { return c.value; }) }); });
    el.mode.addEventListener('change', function () { setState({ mode: $$('input:checked', el.mode).map(function (c) { return c.value; }) }); });
    el.skillInput.addEventListener('keydown', function (e) { if (e.key === 'Enter') { e.preventDefault(); addSkill(el.skillInput.value); } });
    el.skillInput.addEventListener('change', function () { addSkill(el.skillInput.value); });
    el.skillAdd.addEventListener('click', function () { addSkill(el.skillInput.value); });
    el.reset.forEach(function (b) { b.addEventListener('click', resetFilters); });
    el.filterToggle.addEventListener('click', function () {
      var open = el.filterPanel.classList.toggle('is-open');
      el.filterToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    el.view.addEventListener('click', function (e) {
      var b = e.target.closest('button[data-view]');
      if (!b) return;
      el.view.setAttribute('data-view', b.getAttribute('data-view'));
      $$('button', el.view).forEach(function (x) { x.classList.toggle('active', x === b); x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); });
      el.grid.classList.toggle('is-list', b.getAttribute('data-view') === 'list' && !!el.grid.querySelector('.job-card'));
    });
    el.chips.addEventListener('click', function (e) {
      var b = e.target.closest('[data-remove]');
      if (!b) return;
      var t = b.getAttribute('data-remove'), v = b.getAttribute('data-value');
      if (t === 'q') setState({ q: '' });
      else if (t === 'prodi') setState({ prodi: '' });
      else if (t === 'kota') setState({ kota: '' });
      else if (t === 'status') setState({ status: '' });
      else setState((function () { var o = {}; o[t] = state[t].filter(function (x) { return x !== v; }); return o; })());
    });
    el.skillChips.addEventListener('click', function (e) {
      var b = e.target.closest('[data-remove]');
      if (b) setState({ skill: state.skill.filter(function (x) { return x !== b.getAttribute('data-value'); }) });
    });
    el.grid.addEventListener('click', function (e) {
      if (e.target.closest('[data-clear-search]')) setState({ q: '' });
      if (e.target.closest('[data-reset-filter-inline]')) resetFilters();
    });
    bindPagination(el.nav, function (n) { setState({ page: n }, true); scrollToEl($('#catalogTop')); });
    window.addEventListener('simag:favorit-changed', syncFavoriteUI);
    start();
  }

  /* ===================================================================
     8. HALAMAN: DETAIL LOWONGAN
     =================================================================== */
  function initDetail() {
    var root = $('#detailRoot');
    var params = new URLSearchParams(location.search);
    var id = params.get('id');
    var from = params.get('from') === 'favorit' ? 'favorit' : 'katalog';
    var backHref = from === 'favorit' ? 'favorit.html' : 'katalog.html';
    var backLabel = from === 'favorit' ? 'Kembali ke Favorit' : 'Kembali ke Katalog';

    function list(items, cls) {
      return '<ul class="' + (cls || 'detail-list') + '">' + items.map(function (t) { return '<li>' + esc(t) + '</li>'; }).join('') + '</ul>';
    }
    function notFound(msg) {
      root.innerHTML = stateBlock('empty', 'Lowongan tidak ditemukan', msg,
        '<a href="katalog.html" class="btn btn-primary">' + icon('travel_explore') + 'Kembali ke Katalog</a>');
      document.title = 'Lowongan tidak ditemukan — SIMAG-JKB Mahasiswa';
    }

    function render(job, all) {
      var closed = isClosed(job), rem = remaining(job);
      var filledPct = job.quota ? Math.round(job.filled / job.quota * 100) : 0;
      var c = job.contact || {};
      document.title = job.position + ' · ' + job.company + ' — SIMAG-JKB Mahasiswa';

      var skillTags = job.skills.map(function (s) { return '<span class="tag">' + esc(s) + '</span>'; }).join('') +
        (job.skillsBonus || []).map(function (s) { return '<span class="tag tag-outline">' + esc(s) + ' (nilai tambah)</span>'; }).join('');
      var prodiBadges = job.prodi.map(function (p) { return '<span class="badge badge-success">' + icon('check') + esc(p) + '</span>'; }).join('');
      var docs = (job.docs || []).map(function (d) {
        return '<div class="info-row">' + icon('description').replace('class="', 'class="text-secondary ') + '<span class="flex-1">' + esc(d.name) + '</span>' +
          '<span class="badge ' + (d.required ? 'badge-danger' : 'badge-neutral') + '">' + (d.required ? 'Wajib' : 'Opsional') + '</span></div>';
      }).join('');

      var hasReviews = job.rating != null && job.reviewCount > 0;
      var reviewsTab = hasReviews
        ? '<div class="flex gap-xl flex-wrap items-center mb-lg"><div class="text-center"><div class="score-big">' + job.rating.toFixed(1) + '</div><div class="mt-sm">' + stars(job.rating) +
          '</div><div class="caption mt-xs">' + job.reviewCount + ' ulasan terverifikasi</div></div>' +
          '<div class="flex-1 review-meta"><div class="label mb-xs">Kesesuaian job description dengan bidang keahlian</div>' +
          '<div class="progress" role="progressbar" aria-valuenow="' + job.fit + '" aria-valuemin="0" aria-valuemax="100"><span style="width:' + job.fit + '%"></span></div>' +
          '<div class="caption mt-xs">' + job.fit + '% ulasan menyatakan pekerjaan sesuai dengan bidang keahlian</div></div></div>' +
          '<div class="alert alert-info mb-lg">' + icon('format_quote') + '<div><div class="alert-title">Ringkasan pengalaman kakak tingkat</div>' + esc(job.reviewSummary) + '</div></div>' +
          job.reviews.map(function (r) {
            return '<article class="review-item"><div class="flex items-start gap-md"><span class="avatar soft">' + esc(r.name.split(' ').map(function (w) { return w[0]; }).join('').slice(0, 2)) + '</span>' +
              '<div class="flex-1"><div class="flex justify-between flex-wrap gap-sm"><div><div class="label">' + esc(r.name) + '</div><div class="caption">' + esc(r.info) + '</div></div>' + stars(r.stars) + '</div>' +
              '<p class="body mt-sm">' + esc(r.text) + '</p></div></div></article>';
          }).join('')
        : '<div class="empty-state">' + '<div class="icon-wrap">' + icon('rate_review') + '</div><h3 class="title mb-xs">Belum ada ulasan</h3><p class="body text-muted">Belum ada kakak tingkat yang mengulas lowongan ini.</p></div>';
      reviewsTab += '<div class="text-center mt-lg"><a href="pusat-ulasan.html" class="btn btn-secondary">' + icon('reviews') + 'Lihat Semua Ulasan di Pusat Ulasan</a></div>';

      var similar = all.filter(function (j) { return j.id !== job.id && j.category === job.category; }).slice(0, 3);
      if (similar.length < 3) {
        all.filter(function (j) { return j.id !== job.id && j.category !== job.category; }).slice(0, 3 - similar.length).forEach(function (j) { similar.push(j); });
      }

      root.innerHTML =
        '<section class="card mb-lg"><div class="card-body"><div class="flex gap-lg items-start flex-wrap">' +
        '<div class="logo-box lg ' + esc(job.color) + '">' + esc(job.initials) + '</div>' +
        '<div class="flex-1 detail-head">' +
        '<span class="exclusive-label mb-sm">' + icon('lock_open') + 'Data eksklusif mahasiswa</span>' +
        '<h1 class="h2 mt-xs">' + esc(job.position) + '</h1>' +
        '<div class="flex items-center gap-md flex-wrap mt-xs body text-muted">' +
        '<span class="flex items-center gap-xs">' + icon('apartment') + esc(job.company) + '</span>' +
        '<span class="flex items-center gap-xs">' + icon('location_on') + esc(job.area + ', ' + job.province) + '</span>' +
        '<span class="flex items-center gap-xs">' + icon('schedule') + 'Diposting ' + fmtDate(job.postedAt) + '</span></div>' +
        '<div class="flex flex-wrap gap-xs mt-md">' + statusBadge(job) +
        '<span class="badge badge-info">' + icon('home_work') + esc(job.workMode) + '</span>' +
        '<span class="badge badge-neutral">' + icon('code') + esc(job.category) + '</span></div></div>' +
        '<div class="detail-actions">' +
        '<a href="' + backHref + '" class="btn btn-ghost" data-back>' + icon('arrow_back') + backLabel + '</a>' +
        '<button type="button" class="btn btn-secondary fav-toggle" data-fav-id="' + esc(job.id) + '" aria-pressed="false">' + icon('bookmark') + '<span data-fav-label>Simpan ke Favorit</span></button>' +
        '<a href="#kontak" class="btn btn-primary">' + icon('contact_mail') + 'Info Kontak</a></div>' +
        '</div></div></section>' +
        (closed ? '<div class="alert alert-warning mb-lg">' + icon('event_busy') + '<div><div class="alert-title">Lowongan sudah ditutup</div>Kuota terpenuhi atau masa pendaftaran berakhir. Informasi ditampilkan sebagai referensi.</div></div>' : '') +

        '<div class="layout-aside"><section class="card" id="detailTabs">' +
        '<div class="tabs tabs-pad" data-tabs="#detailTabs" role="tablist">' +
        '<button type="button" class="tab active" data-tab="tab-deskripsi">' + icon('description') + 'Deskripsi</button>' +
        '<button type="button" class="tab" data-tab="tab-persyaratan">' + icon('checklist') + 'Persyaratan</button>' +
        '<button type="button" class="tab" data-tab="tab-ulasan">' + icon('reviews') + 'Ulasan <span class="badge badge-info">' + job.reviewCount + '</span></button></div>' +

        '<div class="tab-panel active card-body" id="tab-deskripsi">' +
        '<h2 class="title mb-sm">Tentang Perusahaan</h2>' +
        '<p class="body text-muted">' + esc(job.companyDesc) + '</p>' +
        '<div class="flex flex-wrap gap-md mt-sm body"><span class="flex items-center gap-xs">' + icon('factory') + esc(job.industry) + '</span>' +
        '<span class="flex items-center gap-xs">' + icon('location_on') + esc(job.area + ', ' + job.province) + '</span></div>' +
        '<h2 class="title mt-lg mb-sm">Deskripsi Pekerjaan</h2><p class="body text-muted">' + esc(job.description) + '</p>' +
        '<h3 class="title mt-lg mb-sm">Tanggung Jawab</h3>' + list(job.responsibilities) +
        '<h3 class="title mt-lg mb-sm">Keahlian yang Dibutuhkan</h3><div class="flex flex-wrap gap-xs">' + skillTags + '</div>' +
        '<h3 class="title mt-lg mb-sm">Program Studi yang Dapat Mendaftar</h3><div class="flex flex-wrap gap-xs">' + prodiBadges + '</div></div>' +

        '<div class="tab-panel card-body" id="tab-persyaratan">' +
        '<h2 class="title mb-sm">Persyaratan Akademik</h2>' + list(job.academicReq) +
        '<h3 class="title mt-lg mb-sm">Persyaratan Kemampuan Teknis</h3>' + list(job.techReq) +
        '<h3 class="title mt-lg mb-sm">Berkas yang Diperlukan</h3><div class="info-list">' + docs + '</div></div>' +

        '<div class="tab-panel card-body" id="tab-ulasan">' + reviewsTab + '</div></section>' +

        '<aside class="flex flex-col gap-lg">' +
        '<div class="card"><div class="card-header"><span class="label flex items-center gap-sm">' + icon('key').replace('class="', 'class="text-secondary ') + 'Informasi Kunci</span>' +
        icon('lock_open').replace('class="', 'class="text-success ') + '</div><div class="card-body card-body-tight"><dl class="info-list">' +
        '<div class="info-row info-row-stack"><div class="flex justify-between"><dt>Kuota</dt><dd>' + job.quota + ' mahasiswa</dd></div>' +
        '<div class="progress"><span style="width:' + filledPct + '%"></span></div>' +
        '<span class="caption">' + job.filled + ' terisi · <strong class="' + (rem <= 1 ? 'text-warning' : 'text-success') + '">' + rem + ' tersisa</strong></span></div>' +
        '<div class="info-row"><dt>Persyaratan IPK</dt><dd>≥ ' + job.minIpk.toFixed(2) + ' (skala 4.00)</dd></div>' +
        '<div class="info-row"><dt>Periode Magang</dt><dd>' + esc(job.period) + '</dd></div>' +
        '<div class="info-row"><dt>Durasi</dt><dd>' + esc(job.duration) + '</dd></div>' +
        '<div class="info-row"><dt>Deadline</dt><dd class="' + (closed ? 'text-danger' : '') + '">' + fmtDate(job.deadline) + '</dd></div>' +
        '<div class="info-row"><dt>Sistem Kerja</dt><dd>' + esc(job.workMode) + '</dd></div>' +
        '<div class="info-row"><dt>Rating</dt><dd>' + esc(ratingText(job)) + '</dd></div>' +
        '</dl></div></div>' +

        '<div class="card" id="kontak"><div class="card-header"><span class="label flex items-center gap-sm">' + icon('contact_mail').replace('class="', 'class="text-secondary ') + 'Kontak Perusahaan</span></div>' +
        '<div class="card-body flex flex-col gap-md body">' +
        '<div class="flex items-center gap-md"><span class="avatar soft">' + esc((c.name || '?').split(' ').map(function (w) { return w[0]; }).join('').slice(0, 2)) + '</span>' +
        '<div><div class="label">' + esc(c.name) + '</div><div class="caption">' + esc(c.role) + '</div></div></div>' +
        '<div class="flex gap-sm items-start">' + icon('mail').replace('class="', 'class="text-subtle ') + '<a href="mailto:' + esc(c.email) + '">' + esc(c.email) + '</a></div>' +
        (c.phone ? '<div class="flex gap-sm items-start">' + icon('call').replace('class="', 'class="text-subtle ') + '<span>' + esc(c.phone) + '</span></div>' : '') +
        (c.address ? '<div class="flex gap-sm items-start">' + icon('location_on').replace('class="', 'class="text-subtle ') + '<span>' + esc(c.address) + '</span></div>' : '') +
        (c.website ? '<div class="flex gap-sm items-start">' + icon('language').replace('class="', 'class="text-subtle ') + '<a href="' + esc(c.website) + '" target="_blank" rel="noopener noreferrer">' + esc(c.website.replace(/^https?:\/\//, '')) + '</a></div>' : '') +
        '<div class="alert alert-info alert-compact">' + icon('info') + '<div><div class="alert-title">Proses pendaftaran</div>' + esc(job.registration) + '</div></div>' +
        '<a href="mailto:' + esc(c.email) + '?subject=' + encodeURIComponent('Informasi Magang: ' + job.position) + '" class="btn btn-primary btn-block">' + icon('send') + 'Hubungi via Email</a>' +
        '<p class="caption">SIMAG-JKB adalah pusat informasi magang, bukan sistem pelamaran. Pendaftaran dilakukan langsung ke perusahaan.</p>' +
        '</div></div>' +

        (similar.length ? '<div class="card"><div class="card-header"><span class="label">Lowongan Serupa</span></div><div class="card-body">' +
          similar.map(function (s) {
            return '<a href="' + detailHref(s.id) + '" class="similar-item"><div class="logo-box sm ' + esc(s.color) + '">' + esc(s.initials) + '</div>' +
              '<div class="flex-1"><strong class="body fw-600 block">' + esc(s.position) + '</strong><span class="caption">' + esc(s.company + ' · ' + s.area) + '</span></div>' +
              icon('chevron_right').replace('class="', 'class="text-subtle ') + '</a>';
          }).join('') + '</div></div>' : '') +
        '</aside></div>';

      syncFavoriteUI();
    }

    if (!id) { notFound('ID lowongan tidak disertakan. Pilih lowongan dari katalog.'); return; }

    root.innerHTML = '<div class="card p-xl"><div class="skeleton skeleton-line w-40 tall"></div><div class="skeleton skeleton-line w-90"></div><div class="skeleton skeleton-line w-70"></div><div class="skeleton skeleton-line w-80"></div></div>';
    var load = function () {
      api.fetchJobs().then(function (all) {
        var job = all.filter(function (j) { return j.id === id; })[0];
        if (!job) { notFound('Lowongan dengan ID "' + id + '" tidak tersedia atau sudah dihapus.'); return; }
        render(job, all);
      }).catch(function () {
        root.innerHTML = stateBlock('error', 'Detail lowongan gagal dimuat', 'Terjadi kesalahan saat memuat data. Silakan coba lagi.',
          '<button type="button" class="btn btn-primary" data-retry>' + icon('refresh') + 'Coba Lagi</button>');
        root.querySelector('[data-retry]').addEventListener('click', function () { api._retried = true; load(); });
      });
    };
    load();

    /* Tombol kembali: pakai riwayat jika asalnya halaman yang sama agar filter katalog tetap terjaga. */
    root.addEventListener('click', function (e) {
      var b = e.target.closest('[data-back]');
      if (b && document.referrer && document.referrer.indexOf(backHref) !== -1 && history.length > 1) { e.preventDefault(); history.back(); }
    });

    /* Pencarian topbar: arahkan ke katalog dengan kata kunci. */
    var top = $('[data-search-input]');
    if (top) top.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' && top.value.trim()) location.href = 'katalog.html?q=' + encodeURIComponent(top.value.trim());
    });
  }

  /* ===================================================================
     9. HALAMAN: FAVORIT
     =================================================================== */
  function initFavorites() {
    var el = {
      grid: $('#favGrid'), info: $('#favInfo'), seg: $('#favStatus'), q: $$('[data-search-input]'), sort: $('#favSort'),
      segAll: $('[data-status="semua"]'), segOpen: $('[data-status="dibuka"]'), segClosed: $('[data-status="ditutup"]')
    };
    var state = { status: 'semua', q: '', sort: 'disimpan' };
    var all = [], loaded = false;

    function items() {
      return favorites.list().map(function (f) {
        var job = all.filter(function (j) { return j.id === f.id; })[0];
        return { fav: f, job: job || null };
      });
    }
    function missingCard(f) {
      return '<article class="card job-card is-closed"><div class="card-body"><div class="job-card-head"><div class="logo-box c5">?</div>' +
        '<div class="meta"><div class="job-card-company">Lowongan tidak tersedia</div><span class="badge badge-neutral mt-xs">Dihapus dari katalog</span></div>' +
        bookmarkBtn({ id: f.id }) + '</div><p class="body text-muted">Lowongan <code>' + esc(f.id) + '</code> sudah tidak ada di katalog. Anda dapat menghapusnya dari favorit.</p></div></article>';
    }

    function render() {
      if (!loaded) return;
      var rows = items();
      var q = norm(state.q);
      var open = rows.filter(function (r) { return r.job && !isClosed(r.job); }).length;
      var closed = rows.length - open;
      el.segAll.textContent = 'Semua (' + rows.length + ')';
      el.segOpen.textContent = 'Masih Dibuka (' + open + ')';
      el.segClosed.textContent = 'Sudah Ditutup (' + closed + ')';

      if (!rows.length) {
        el.grid.classList.remove('is-list');
        el.grid.innerHTML = '<div class="grid-span">' + stateBlock('empty', 'Belum Ada Lowongan Favorit',
          'Simpan lowongan magang yang menarik minat Anda dengan menekan ikon bookmark di katalog atau halaman detail agar mudah diakses kembali.',
          '<a href="katalog.html" class="btn btn-primary">' + icon('travel_explore') + 'Eksplorasi Katalog Sekarang</a>') + '</div>';
        el.info.textContent = '';
        return;
      }
      rows = rows.filter(function (r) {
        var isOpen = r.job && !isClosed(r.job);
        if (state.status === 'dibuka' && !isOpen) return false;
        if (state.status === 'ditutup' && isOpen) return false;
        if (q && !(r.job && (norm(r.job.company).indexOf(q) !== -1 || norm(r.job.position).indexOf(q) !== -1))) return false;
        return true;
      });
      rows.sort(function (a, b) {
        var ja = a.job, jb = b.job;
        if (!ja || !jb) return ja ? -1 : (jb ? 1 : 0);
        if (state.sort === 'deadline') return ja.deadline.localeCompare(jb.deadline);
        if (state.sort === 'rating') return (jb.rating == null ? -1 : jb.rating) - (ja.rating == null ? -1 : ja.rating);
        if (state.sort === 'nama') return ja.company.localeCompare(jb.company, 'id');
        return b.fav.savedAt - a.fav.savedAt;
      });
      el.info.innerHTML = 'Menampilkan <strong class="text-primary">' + rows.length + '</strong> favorit';
      if (!rows.length) {
        el.grid.innerHTML = '<div class="grid-span">' + stateBlock('filter', 'Tidak ada favorit yang cocok', 'Tidak ada lowongan favorit yang sesuai dengan filter atau kata kunci.',
          '<button type="button" class="btn btn-secondary" data-reset-fav>' + icon('restart_alt') + 'Reset Filter</button>') + '</div>';
        return;
      }
      el.grid.innerHTML = rows.map(function (r) {
        return r.job ? studentCard(r.job, { from: 'favorit', showIpk: true, detailLabel: isClosed(r.job) ? 'Lihat Arsip' : 'Detail Lowongan' }) : missingCard(r.fav);
      }).join('');
      syncFavoriteUI();
    }

    el.grid.innerHTML = skeletonCards(3); el.grid.setAttribute('aria-busy', 'true');
    var load = function () {
      api.fetchJobs().then(function (list) { all = list; loaded = true; el.grid.removeAttribute('aria-busy'); render(); })
        .catch(function () {
          el.grid.removeAttribute('aria-busy');
          el.grid.innerHTML = '<div class="grid-span">' + stateBlock('error', 'Data favorit gagal dimuat', 'Terjadi kesalahan saat memuat data lowongan.',
            '<button type="button" class="btn btn-primary" data-retry>' + icon('refresh') + 'Coba Lagi</button>') + '</div>';
          el.grid.querySelector('[data-retry]').addEventListener('click', function () { api._retried = true; el.grid.innerHTML = skeletonCards(3); load(); });
        });
    };
    load();

    el.seg.addEventListener('click', function (e) {
      var b = e.target.closest('button[data-status]');
      if (!b) return;
      state.status = b.getAttribute('data-status');
      $$('button', el.seg).forEach(function (x) { x.classList.toggle('active', x === b); });
      render();
    });
    var onQ = debounce(function (v) { state.q = v; render(); }, 150);
    el.q.forEach(function (s) {
      s.addEventListener('input', function () { el.q.forEach(function (o) { if (o !== s) o.value = s.value; }); onQ(s.value); });
    });
    el.sort.addEventListener('change', function () { state.sort = el.sort.value; render(); });
    el.grid.addEventListener('click', function (e) {
      if (e.target.closest('[data-reset-fav]')) {
        state = { status: 'semua', q: '', sort: state.sort }; el.q.forEach(function (s) { s.value = ''; });
        $$('button', el.seg).forEach(function (x) { x.classList.toggle('active', x.getAttribute('data-status') === 'semua'); });
        render();
      }
    });
    /* Perubahan favorit (di halaman ini / tab lain) → gambar ulang daftar. */
    window.addEventListener('simag:favorit-changed', render);
  }

  /* ===================================================================
     10. BOOTSTRAP
     =================================================================== */
  window.SimagKatalog = { api: api, favorites: favorites, toPublic: toPublic };

  document.addEventListener('DOMContentLoaded', function () {
    syncFavoriteUI();
    var page = document.body.getAttribute('data-page');
    if (page === 'public') initPublic();
    else if (page === 'katalog') initStudentCatalog();
    else if (page === 'detail') initDetail();
    else if (page === 'favorit') initFavorites();
  });
})();
