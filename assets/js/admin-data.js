/* =====================================================================
   SIMAG-JKB — Admin Data Layer (localStorage)
   ---------------------------------------------------------------------
   Lapisan data modul admin (Dashboard & Katalog). TIDAK menyentuh DOM.
   Penyimpanan sementara di localStorage (BUKAN server). Untuk migrasi ke
   backend, ganti isi fungsi di objek `Store` dengan pemanggilan API.

   Key localStorage:
     simagJkb.admin.jobs        : daftar lowongan
     simagJkb.admin.companies   : daftar perusahaan
     simagJkb.admin.activities  : log aktivitas admin

   Seed data hanya dibuat jika key belum ada (null). Data yang diubah/dihapus
   pengguna tidak akan ditimpa saat refresh. Seed bertanda isDemo:true dan
   BUKAN mitra resmi SIMAG-JKB.
   ===================================================================== */
(function () {
  'use strict';

  var PREFIX = 'simagJkb.admin.';
  var KEYS = { jobs: PREFIX + 'jobs', companies: PREFIX + 'companies', activities: PREFIX + 'activities' };

  var JOB_STATUS = ['Aktif', 'Draft', 'Ditutup'];
  var COMPANY_STATUS = ['Aktif', 'Menunggu', 'Nonaktif'];
  var CATEGORIES = ['Software Development', 'Data & Analitik', 'UI/UX Design', 'Jaringan & Infrastruktur', 'Bisnis Digital', 'Akuntansi & Keuangan'];

  /* Statistik yang belum terintegrasi dengan modul lain: DATA SIMULASI */
  var SIMULATED_STATS = {
    applicants: { total: 248, previous: 221, note: 'Data simulasi — belum terintegrasi modul pengguna' },
    pendingReviews: { total: 12, previous: 15, note: 'Data simulasi — belum terintegrasi modul moderasi' }
  };

  /* ---------- Util ---------- */
  var memoryFallback = {};
  function read(key) {
    try {
      var raw = window.localStorage.getItem(key);
      return raw === null ? null : JSON.parse(raw);
    } catch (e) {
      return Object.prototype.hasOwnProperty.call(memoryFallback, key) ? memoryFallback[key] : null;
    }
  }
  function write(key, value) {
    try { window.localStorage.setItem(key, JSON.stringify(value)); }
    catch (e) { memoryFallback[key] = value; }
  }
  function uid(prefix) { return prefix + '-' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6); }
  function todayISO() { return new Date().toISOString().slice(0, 10); }
  function offsetDate(days) { var d = new Date(); d.setDate(d.getDate() + days); return d.toISOString().slice(0, 10); }
  function clone(o) { return JSON.parse(JSON.stringify(o)); }
  function norm(s) { return String(s == null ? '' : s).trim(); }

  /* ---------- Seed (data demonstrasi) ---------- */
  function seedCompanies() {
    var rows = [
      ['Nusantara Digital Solusi', 'Teknologi Informasi', 'Cilacap', 'Jl. Gatot Subroto No. 10, Cilacap', 'Perusahaan pengembang perangkat lunak untuk UMKM dan instansi daerah.', 'hrd@nusantaradigital.example', 'https://nusantaradigital.example', 'Aktif'],
      ['Cilacap Data Insight', 'Analitik Data', 'Cilacap', 'Jl. Jend. Sudirman No. 45, Cilacap', 'Konsultan analitik dan visualisasi data bisnis.', 'karir@cilacapdata.example', 'https://cilacapdata.example', 'Aktif'],
      ['Samudra Net Provider', 'Telekomunikasi', 'Purwokerto', 'Jl. Overste Isdiman No. 7, Purwokerto', 'Penyedia layanan internet dan infrastruktur jaringan regional.', 'info@samudranet.example', 'https://samudranet.example', 'Aktif'],
      ['Kreasi Piksel Studio', 'Desain & Kreatif', 'Yogyakarta', 'Jl. Kaliurang Km 5, Yogyakarta', 'Studio desain antarmuka dan identitas visual.', 'halo@kreasipiksel.example', 'https://kreasipiksel.example', 'Aktif'],
      ['Mitra Niaga Online', 'E-Commerce', 'Semarang', 'Jl. Pemuda No. 21, Semarang', 'Platform pemasaran dan penjualan daring untuk pelaku usaha.', 'recruitment@mitraniaga.example', 'https://mitraniaga.example', 'Menunggu'],
      ['Akuntan Prima Konsultan', 'Jasa Keuangan', 'Cilacap', 'Jl. Kolonel Sugiono No. 3, Cilacap', 'Kantor jasa akuntansi dan perpajakan.', 'admin@akuntanprima.example', 'https://akuntanprima.example', 'Aktif'],
      ['Teknologi Pelabuhan Demo', 'Logistik', 'Cilacap', 'Kawasan Pelabuhan, Cilacap', 'Pengembang sistem informasi logistik (contoh data demonstrasi).', 'it@teknopelabuhan.example', 'https://teknopelabuhan.example', 'Nonaktif'],
      ['Banyumas Startup Hub', 'Teknologi Informasi', 'Purwokerto', 'Jl. Dr. Soeparno No. 12, Purwokerto', 'Inkubator startup digital dan pelatihan talenta muda.', 'hello@banyumashub.example', 'https://banyumashub.example', 'Aktif']
    ];
    return rows.map(function (r, i) {
      return { id: 'c-' + (i + 1), name: r[0], industry: r[1], location: r[2], address: r[3], description: r[4], contact: r[5], website: r[6], status: r[7], isDemo: true, createdAt: offsetDate(-120 + i * 7) };
    });
  }

  function seedJobs(companies) {
    function cid(name) { var c = companies.filter(function (x) { return x.name === name; })[0]; return c ? c.id : ''; }
    var rows = [
      ['Nusantara Digital Solusi', 'Frontend Developer Intern', 'Software Development', 'Cilacap', 8, 3, 'Aktif', -20, 'HTML, CSS, JavaScript, Git'],
      ['Nusantara Digital Solusi', 'Backend Developer Intern', 'Software Development', 'Cilacap', 14, 2, 'Aktif', -18, 'PHP, MySQL, REST API'],
      ['Cilacap Data Insight', 'Data Analyst Intern', 'Data & Analitik', 'Cilacap', 20, 2, 'Aktif', -15, 'Excel, SQL, Power BI'],
      ['Cilacap Data Insight', 'Data Entry & Cleaning Intern', 'Data & Analitik', 'Cilacap', -3, 4, 'Ditutup', -50, 'Excel, ketelitian'],
      ['Samudra Net Provider', 'Network Engineer Intern', 'Jaringan & Infrastruktur', 'Purwokerto', 25, 3, 'Aktif', -12, 'Routing, Mikrotik, Cisco dasar'],
      ['Samudra Net Provider', 'Technical Support Intern', 'Jaringan & Infrastruktur', 'Purwokerto', 30, 2, 'Draft', -2, 'Troubleshooting, komunikasi'],
      ['Kreasi Piksel Studio', 'UI/UX Designer Intern', 'UI/UX Design', 'Yogyakarta', 18, 2, 'Aktif', -10, 'Figma, riset pengguna'],
      ['Kreasi Piksel Studio', 'Graphic Designer Intern', 'UI/UX Design', 'Yogyakarta', -10, 1, 'Ditutup', -45, 'Illustrator, Photoshop'],
      ['Mitra Niaga Online', 'Digital Marketing Intern', 'Bisnis Digital', 'Semarang', 22, 3, 'Draft', -1, 'SEO, media sosial, copywriting'],
      ['Mitra Niaga Online', 'E-Commerce Operations Intern', 'Bisnis Digital', 'Semarang', 28, 2, 'Aktif', -6, 'Pengelolaan katalog, analitik toko'],
      ['Akuntan Prima Konsultan', 'Staf Akuntansi Magang', 'Akuntansi & Keuangan', 'Cilacap', 15, 2, 'Aktif', -9, 'Jurnal, laporan keuangan, Excel'],
      ['Akuntan Prima Konsultan', 'Asisten Perpajakan', 'Akuntansi & Keuangan', 'Cilacap', 35, 1, 'Draft', -3, 'Dasar perpajakan, e-Faktur'],
      ['Banyumas Startup Hub', 'Mobile Developer Intern', 'Software Development', 'Purwokerto', 21, 3, 'Aktif', -14, 'Flutter atau Kotlin, Git'],
      ['Banyumas Startup Hub', 'Business Analyst Intern', 'Bisnis Digital', 'Purwokerto', 12, 2, 'Aktif', -8, 'Analisis proses, dokumentasi, UML'],
      ['Teknologi Pelabuhan Demo', 'Web Developer Intern', 'Software Development', 'Cilacap', -20, 2, 'Ditutup', -60, 'JavaScript, SQL']
    ];
    return rows.map(function (r, i) {
      var email = companies.filter(function (c) { return c.name === r[0]; })[0];
      return {
        id: 'j-' + (i + 1), companyId: cid(r[0]), company: r[0], title: r[1], category: r[2], location: r[3],
        description: 'Membantu tim ' + r[0] + ' pada bidang ' + r[2] + ' selama periode magang (data demonstrasi).',
        requirements: 'Mahasiswa aktif Jurusan Komputer dan Bisnis, minimal semester 5, bersedia magang 3–6 bulan.',
        skills: r[8], quota: r[5], deadline: offsetDate(r[4]), status: r[6], publishedAt: offsetDate(r[7]),
        contact: email ? email.contact : '', isDemo: true
      };
    });
  }

  function seedActivities() {
    return [
      { id: uid('a'), type: 'job', icon: 'work', text: 'Lowongan "Frontend Developer Intern" dipublikasikan', at: Date.now() - 1000 * 60 * 90, isDemo: true },
      { id: uid('a'), type: 'company', icon: 'apartment', text: 'Perusahaan "Banyumas Startup Hub" ditambahkan', at: Date.now() - 1000 * 60 * 60 * 5, isDemo: true },
      { id: uid('a'), type: 'job', icon: 'lock', text: 'Lowongan "Data Entry & Cleaning Intern" ditutup', at: Date.now() - 1000 * 60 * 60 * 26, isDemo: true }
    ];
  }

  function ensureSeed() {
    var companies = read(KEYS.companies);
    if (companies === null) { companies = seedCompanies(); write(KEYS.companies, companies); }
    if (read(KEYS.jobs) === null) { write(KEYS.jobs, seedJobs(companies)); }
    if (read(KEYS.activities) === null) { write(KEYS.activities, seedActivities()); }
  }

  /* ---------- Aktivitas ---------- */
  function logActivity(type, icon, text) {
    var list = read(KEYS.activities) || [];
    list.unshift({ id: uid('a'), type: type, icon: icon, text: text, at: Date.now() });
    write(KEYS.activities, list.slice(0, 30));
  }

  /* ---------- Validasi ---------- */
  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  function isValidDate(s) { return /^\d{4}-\d{2}-\d{2}$/.test(s) && !isNaN(new Date(s + 'T00:00:00').getTime()); }
  function isUrl(s) { return /^https?:\/\/[^\s.]+\.[^\s]{2,}$/i.test(s); }

  function validateJob(d) {
    var e = {};
    if (!norm(d.company)) e.company = 'Perusahaan wajib dipilih.';
    if (!norm(d.title)) e.title = 'Nama posisi wajib diisi.';
    else if (norm(d.title).length < 3) e.title = 'Nama posisi minimal 3 karakter.';
    if (CATEGORIES.indexOf(d.category) < 0) e.category = 'Kategori wajib dipilih.';
    if (!norm(d.location)) e.location = 'Lokasi wajib diisi.';
    if (!norm(d.description)) e.description = 'Deskripsi pekerjaan wajib diisi.';
    if (!norm(d.requirements)) e.requirements = 'Persyaratan wajib diisi.';
    if (!norm(d.skills)) e.skills = 'Keahlian yang dibutuhkan wajib diisi.';
    var q = Number(d.quota);
    if (norm(d.quota) === '' ) e.quota = 'Kuota wajib diisi.';
    else if (!isFinite(q) || q < 1 || Math.floor(q) !== q) e.quota = 'Kuota harus berupa bilangan bulat positif.';
    if (!norm(d.deadline)) e.deadline = 'Batas pendaftaran wajib diisi.';
    else if (!isValidDate(d.deadline)) e.deadline = 'Format tanggal tidak valid.';
    if (JOB_STATUS.indexOf(d.status) < 0) e.status = 'Status wajib dipilih.';
    var c = norm(d.contact);
    if (!c) e.contact = 'Kontak atau tautan informasi wajib diisi.';
    else if (!EMAIL_RE.test(c) && !isUrl(c)) e.contact = 'Isi dengan email valid atau tautan berawalan http(s)://.';
    return e;
  }

  function validateCompany(d) {
    var e = {};
    if (!norm(d.name)) e.name = 'Nama perusahaan wajib diisi.';
    else if (norm(d.name).length < 3) e.name = 'Nama perusahaan minimal 3 karakter.';
    if (!norm(d.industry)) e.industry = 'Bidang industri wajib diisi.';
    if (!norm(d.location)) e.location = 'Kota/lokasi wajib diisi.';
    if (!norm(d.address)) e.address = 'Alamat wajib diisi.';
    if (!norm(d.description)) e.description = 'Deskripsi perusahaan wajib diisi.';
    if (!norm(d.contact)) e.contact = 'Email kontak wajib diisi.';
    else if (!EMAIL_RE.test(norm(d.contact))) e.contact = 'Format email tidak valid.';
    if (norm(d.website) && !isUrl(norm(d.website))) e.website = 'Website harus diawali http:// atau https://.';
    if (COMPANY_STATUS.indexOf(d.status) < 0) e.status = 'Status kemitraan wajib dipilih.';
    return e;
  }

  /* ---------- Query: search + filter + pagination ---------- */
  function paginate(list, page, perPage) {
    var total = list.length;
    var pages = Math.max(1, Math.ceil(total / perPage));
    var p = Math.min(Math.max(1, page || 1), pages);
    return { items: list.slice((p - 1) * perPage, p * perPage), page: p, pages: pages, total: total, perPage: perPage };
  }
  function has(hay, needle) { return String(hay).toLowerCase().indexOf(needle) >= 0; }

  /* ---------- Store (ganti dengan API bila ada backend) ---------- */
  var Store = {
    jobs: {
      all: function () { return clone(read(KEYS.jobs) || []); },
      get: function (id) { return this.all().filter(function (j) { return j.id === id; })[0] || null; },
      query: function (o) {
        o = o || {};
        var q = norm(o.search).toLowerCase();
        var list = this.all().filter(function (j) {
          return (!q || has(j.title, q) || has(j.company, q)) &&
            (!o.category || j.category === o.category) &&
            (!o.location || j.location === o.location) &&
            (!o.status || j.status === o.status);
        });
        list.sort(function (a, b) { return a.publishedAt < b.publishedAt ? 1 : -1; });
        return paginate(list, o.page, o.perPage || 8);
      },
      create: function (d) {
        var err = validateJob(d);
        if (Object.keys(err).length) return { ok: false, errors: err };
        var list = read(KEYS.jobs) || [];
        var c = Store.companies.all().filter(function (x) { return x.name === norm(d.company); })[0];
        var job = {
          id: uid('j'), companyId: c ? c.id : '', company: norm(d.company), title: norm(d.title), category: d.category,
          location: norm(d.location), description: norm(d.description), requirements: norm(d.requirements),
          skills: norm(d.skills), quota: Number(d.quota), deadline: d.deadline, status: d.status,
          publishedAt: todayISO(), contact: norm(d.contact), isDemo: false
        };
        list.push(job); write(KEYS.jobs, list);
        logActivity('job', 'work', 'Lowongan "' + job.title + '" ditambahkan');
        return { ok: true, item: job };
      },
      update: function (id, d) {
        var err = validateJob(d);
        if (Object.keys(err).length) return { ok: false, errors: err };
        var list = read(KEYS.jobs) || [];
        var i = list.findIndex(function (j) { return j.id === id; });
        if (i < 0) return { ok: false, errors: { _: 'Data tidak ditemukan.' } };
        var c = Store.companies.all().filter(function (x) { return x.name === norm(d.company); })[0];
        var j = list[i];
        j.company = norm(d.company); j.companyId = c ? c.id : j.companyId; j.title = norm(d.title); j.category = d.category;
        j.location = norm(d.location); j.description = norm(d.description); j.requirements = norm(d.requirements);
        j.skills = norm(d.skills); j.quota = Number(d.quota); j.deadline = d.deadline; j.status = d.status; j.contact = norm(d.contact);
        write(KEYS.jobs, list);
        logActivity('job', 'edit', 'Lowongan "' + j.title + '" diperbarui');
        return { ok: true, item: j };
      },
      setStatus: function (id, status) {
        if (JOB_STATUS.indexOf(status) < 0) return { ok: false };
        var list = read(KEYS.jobs) || [];
        var j = list.filter(function (x) { return x.id === id; })[0];
        if (!j) return { ok: false };
        j.status = status; write(KEYS.jobs, list);
        logActivity('job', 'sync_alt', 'Status lowongan "' + j.title + '" diubah menjadi ' + status);
        return { ok: true, item: j };
      },
      remove: function (id) {
        var list = read(KEYS.jobs) || [];
        var j = list.filter(function (x) { return x.id === id; })[0];
        if (!j) return { ok: false };
        write(KEYS.jobs, list.filter(function (x) { return x.id !== id; }));
        logActivity('job', 'delete', 'Lowongan "' + j.title + '" dihapus');
        return { ok: true };
      },
      locations: function () {
        var s = {}; this.all().forEach(function (j) { s[j.location] = 1; });
        return Object.keys(s).sort();
      }
    },

    companies: {
      all: function () { return clone(read(KEYS.companies) || []); },
      get: function (id) { return this.all().filter(function (c) { return c.id === id; })[0] || null; },
      query: function (o) {
        o = o || {};
        var q = norm(o.search).toLowerCase();
        var list = this.all().filter(function (c) {
          return (!q || has(c.name, q) || has(c.industry, q) || has(c.location, q)) &&
            (!o.status || c.status === o.status) &&
            (!o.industry || c.industry === o.industry);
        });
        list.sort(function (a, b) { return a.name.localeCompare(b.name); });
        return paginate(list, o.page, o.perPage || 8);
      },
      create: function (d) {
        var err = validateCompany(d);
        if (!err.name && Store.companies.all().some(function (c) { return c.name.toLowerCase() === norm(d.name).toLowerCase(); })) err.name = 'Nama perusahaan sudah terdaftar.';
        if (Object.keys(err).length) return { ok: false, errors: err };
        var list = read(KEYS.companies) || [];
        var c = { id: uid('c'), name: norm(d.name), industry: norm(d.industry), location: norm(d.location), address: norm(d.address), description: norm(d.description), contact: norm(d.contact), website: norm(d.website), status: d.status, isDemo: false, createdAt: todayISO() };
        list.push(c); write(KEYS.companies, list);
        logActivity('company', 'apartment', 'Perusahaan "' + c.name + '" ditambahkan');
        return { ok: true, item: c };
      },
      update: function (id, d) {
        var err = validateCompany(d);
        if (!err.name && Store.companies.all().some(function (c) { return c.id !== id && c.name.toLowerCase() === norm(d.name).toLowerCase(); })) err.name = 'Nama perusahaan sudah terdaftar.';
        if (Object.keys(err).length) return { ok: false, errors: err };
        var list = read(KEYS.companies) || [];
        var c = list.filter(function (x) { return x.id === id; })[0];
        if (!c) return { ok: false, errors: { _: 'Data tidak ditemukan.' } };
        var oldName = c.name;
        c.name = norm(d.name); c.industry = norm(d.industry); c.location = norm(d.location); c.address = norm(d.address);
        c.description = norm(d.description); c.contact = norm(d.contact); c.website = norm(d.website); c.status = d.status;
        write(KEYS.companies, list);
        if (oldName !== c.name) { /* sinkronkan nama pada lowongan terkait */
          var jobs = read(KEYS.jobs) || [];
          jobs.forEach(function (j) { if (j.companyId === id) j.company = c.name; });
          write(KEYS.jobs, jobs);
        }
        logActivity('company', 'edit', 'Perusahaan "' + c.name + '" diperbarui');
        return { ok: true, item: c };
      },
      setStatus: function (id, status) {
        if (COMPANY_STATUS.indexOf(status) < 0) return { ok: false };
        var list = read(KEYS.companies) || [];
        var c = list.filter(function (x) { return x.id === id; })[0];
        if (!c) return { ok: false };
        c.status = status; write(KEYS.companies, list);
        logActivity('company', 'sync_alt', 'Status kemitraan "' + c.name + '" diubah menjadi ' + status);
        return { ok: true, item: c };
      },
      /** Jumlah lowongan yang terkait perusahaan (untuk peringatan sebelum hapus). */
      jobCount: function (id) { return Store.jobs.all().filter(function (j) { return j.companyId === id; }).length; },
      remove: function (id) {
        var list = read(KEYS.companies) || [];
        var c = list.filter(function (x) { return x.id === id; })[0];
        if (!c) return { ok: false };
        write(KEYS.companies, list.filter(function (x) { return x.id !== id; }));
        var jobs = (read(KEYS.jobs) || []).filter(function (j) { return j.companyId !== id; });
        write(KEYS.jobs, jobs); /* lowongan milik perusahaan ikut dihapus agar tidak yatim */
        logActivity('company', 'delete', 'Perusahaan "' + c.name + '" dihapus');
        return { ok: true };
      },
      industries: function () {
        var s = {}; this.all().forEach(function (c) { s[c.industry] = 1; });
        return Object.keys(s).sort();
      }
    },

    activities: { all: function () { return clone(read(KEYS.activities) || []); } },

    /** Statistik dihitung dari data aktual localStorage; pelamar & ulasan = simulasi. */
    stats: function () {
      var jobs = this.jobs.all(), comps = this.companies.all();
      var byStatus = { Aktif: 0, Draft: 0, Ditutup: 0 };
      var byCategory = {};
      jobs.forEach(function (j) { byStatus[j.status] = (byStatus[j.status] || 0) + 1; byCategory[j.category] = (byCategory[j.category] || 0) + 1; });
      return {
        totalJobs: jobs.length, totalCompanies: comps.length,
        activeCompanies: comps.filter(function (c) { return c.status === 'Aktif'; }).length,
        pendingCompanies: comps.filter(function (c) { return c.status === 'Menunggu'; }).length,
        totalQuota: jobs.filter(function (j) { return j.status === 'Aktif'; }).reduce(function (n, j) { return n + Number(j.quota || 0); }, 0),
        byStatus: byStatus, byCategory: byCategory,
        applicants: SIMULATED_STATS.applicants, pendingReviews: SIMULATED_STATS.pendingReviews
      };
    },

    /** Hapus semua data admin lalu seed ulang (untuk demo/pengujian). */
    reset: function () {
      Object.keys(KEYS).forEach(function (k) { try { localStorage.removeItem(KEYS[k]); } catch (e) { delete memoryFallback[KEYS[k]]; } });
      ensureSeed();
    }
  };

  ensureSeed();

  /* Helper format/escape untuk lapisan UI (tanpa akses DOM) */
  var MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
  var util = {
    esc: function (s) {
      return String(s == null ? '' : s).replace(/[&<>"']/g, function (ch) {
        return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch];
      });
    },
    fmtDate: function (iso) {
      if (!iso) return '-';
      var p = String(iso).split('-');
      return p.length === 3 ? parseInt(p[2], 10) + ' ' + MONTHS[parseInt(p[1], 10) - 1] + ' ' + p[0] : iso;
    },
    timeAgo: function (ts) {
      var m = Math.max(0, Math.round((Date.now() - ts) / 60000));
      if (m < 1) return 'Baru saja';
      if (m < 60) return m + ' menit lalu';
      var h = Math.round(m / 60);
      if (h < 24) return h + ' jam lalu';
      return Math.round(h / 24) + ' hari lalu';
    }
  };

  window.AdminData = {
    util: util,
    Store: Store, JOB_STATUS: JOB_STATUS, COMPANY_STATUS: COMPANY_STATUS, CATEGORIES: CATEGORIES,
    validateJob: validateJob, validateCompany: validateCompany
  };
})();
