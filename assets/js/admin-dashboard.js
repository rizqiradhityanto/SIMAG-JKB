/* =====================================================================
   SIMAG-JKB — Admin Dashboard (lapisan tampilan)
   Bergantung pada: admin-data.js (AdminData). Tidak menulis data.
   ===================================================================== */
(function () {
  'use strict';
  var D = window.AdminData, S = D.Store, U = D.util;

  function $(id) { return document.getElementById(id); }

  function trend(now, prev, invertGood) {
    var diff = now - prev;
    if (!diff) return '<span class="stat-trend">Tidak berubah</span>';
    var up = diff > 0, good = invertGood ? !up : up;
    return '<span class="stat-trend ' + (good ? 'up' : 'down') + '"><span class="material-symbols-outlined" style="font-size:16px">' +
      (up ? 'trending_up' : 'trending_down') + '</span>' + (up ? '+' : '') + diff + ' dari periode lalu</span>';
  }

  function renderCards(st) {
    $('cardApplicants').innerHTML =
      '<div class="stat-value-row"><span class="stat-value">' + st.applicants.total + '</span>' + trend(st.applicants.total, st.applicants.previous) + '</div>' +
      '<div class="stat-note"><span class="badge badge-neutral">Simulasi</span>' + U.esc(st.applicants.note) + '</div>';
    $('cardCompanies').innerHTML =
      '<div class="stat-value-row"><span class="stat-value">' + st.activeCompanies + '</span><span class="caption">dari ' + st.totalCompanies + ' perusahaan</span></div>' +
      '<div class="stat-note">' + (st.pendingCompanies ? st.pendingCompanies + ' menunggu verifikasi kemitraan' : 'Tidak ada kemitraan menunggu') + '</div>';
    $('cardReviews').innerHTML =
      '<div class="stat-value-row"><span class="stat-value">' + st.pendingReviews.total + '</span>' + trend(st.pendingReviews.total, st.pendingReviews.previous, true) + '</div>' +
      '<div class="stat-note"><span class="badge badge-neutral">Simulasi</span>' + U.esc(st.pendingReviews.note) + '</div>';
  }

  function renderSummary(st) {
    $('sumJobs').textContent = st.totalJobs;
    $('sumQuota').textContent = st.totalQuota;
    $('sumCompanies').textContent = st.totalCompanies;
    $('sumPending').textContent = st.pendingCompanies;
  }

  /* Donut SVG: lingkaran r=15.9155 → keliling ≈ 100, sehingga dasharray = persen */
  function renderDonut(st) {
    var items = [
      { k: 'Aktif', c: 'var(--success)', cls: 's-aktif' },
      { k: 'Draft', c: 'var(--warning)', cls: 's-draft' },
      { k: 'Ditutup', c: 'var(--border-strong)', cls: 's-ditutup' }
    ];
    var total = st.totalJobs, offset = 25, circles = '';
    if (total) {
      items.forEach(function (it) {
        var pct = st.byStatus[it.k] / total * 100;
        if (pct > 0) {
          circles += '<circle cx="21" cy="21" r="15.9155" fill="none" stroke="' + it.c + '" stroke-width="5" stroke-dasharray="' +
            pct + ' ' + (100 - pct) + '" stroke-dashoffset="' + offset + '"></circle>';
          offset -= pct;
        }
      });
    }
    $('donutWrap').innerHTML =
      '<svg class="donut" viewBox="0 0 42 42" role="img" aria-label="Lowongan berdasarkan status">' +
      '<circle cx="21" cy="21" r="15.9155" fill="none" stroke="var(--bg-muted)" stroke-width="5"></circle>' + circles +
      '<text x="21" y="21.5" text-anchor="middle" font-size="8" font-weight="700" fill="var(--text)">' + total + '</text>' +
      '<text x="21" y="27" text-anchor="middle" font-size="3.2" fill="var(--text-muted)">lowongan</text></svg>' +
      '<ul class="legend">' + items.map(function (it) {
        return '<li><span class="swatch ' + it.cls + '"></span>' + it.k + '<span class="val">' + st.byStatus[it.k] + '</span></li>';
      }).join('') + '</ul>';
  }

  function renderCategories(st) {
    var cats = D.CATEGORIES.map(function (c) { return { name: c, n: st.byCategory[c] || 0 }; })
      .sort(function (a, b) { return b.n - a.n; });
    var max = Math.max.apply(null, cats.map(function (c) { return c.n; }).concat([1]));
    $('categoryBars').innerHTML = cats.map(function (c) {
      return '<div class="bar-row"><div class="bar-head"><span>' + U.esc(c.name) + '</span><span>' + c.n + '</span></div>' +
        '<div class="bar-track"><div class="bar-fill" style="width:' + (c.n / max * 100) + '%"></div></div></div>';
    }).join('');
  }

  var STATUS_BADGE = { Aktif: 'badge-success', Draft: 'badge-warning', Ditutup: 'badge-neutral' };
  function renderLatest() {
    var res = S.jobs.query({ perPage: 5 });
    if (!res.total) {
      $('latestJobs').innerHTML = '<tr><td colspan="4"><div class="empty-state"><p>Belum ada lowongan. <a href="katalog.html?action=add-job">Tambah lowongan</a></p></div></td></tr>';
      return;
    }
    $('latestJobs').innerHTML = res.items.map(function (j) {
      return '<tr><td><div class="fw-600">' + U.esc(j.title) + '</div><div class="caption">' + U.esc(j.company) + '</div></td>' +
        '<td>' + U.esc(j.location) + '</td><td><span class="badge ' + STATUS_BADGE[j.status] + '">' + j.status + '</span></td>' +
        '<td>' + U.fmtDate(j.publishedAt) + '</td></tr>';
    }).join('');
  }

  function renderActivities() {
    var list = S.activities.all().slice(0, 6);
    $('activityList').innerHTML = list.length ? list.map(function (a) {
      return '<li><span class="a-icon"><span class="material-symbols-outlined">' + U.esc(a.icon) + '</span></span><div><div class="a-text">' +
        U.esc(a.text) + '</div><div class="a-time">' + U.timeAgo(a.at) + (a.isDemo ? ' · contoh' : '') + '</div></div></li>';
    }).join('') : '<li class="text-muted body">Belum ada aktivitas.</li>';
  }

  function render() {
    var st = S.stats();
    renderCards(st); renderSummary(st); renderDonut(st); renderCategories(st); renderLatest(); renderActivities();
  }

  render();
  window.addEventListener('storage', render);          // sinkron bila katalog diubah di tab lain
  window.addEventListener('pageshow', function (e) { if (e.persisted) render(); });
})();
