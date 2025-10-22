// Admin dashboard logic (compat SDK)
(function(){
  const appReady = typeof firebase !== 'undefined' && firebase.apps && firebase.apps.length > 0;
  const db = appReady ? (window.db || firebase.firestore()) : null;
  const auth = appReady ? (window.auth || firebase.auth()) : null;

  const $ = (id) => document.getElementById(id);
  const show = (id) => $(id)?.classList.remove('hidden');
  const hide = (id) => $(id)?.classList.add('hidden');

  // Simple admin strategy:
  // 1) UID whitelist embedded for initial bootstrap
  // 2) Firestore collection "admins" where docs are UID -> { createdAt }
  // NOTE: For real security, enforce admin checks in Firestore Rules and/or Cloud Functions.
  const UID_WHITELIST = [
    // Add your admin UID(s) here. You gave an account id string in chat; if that's your Auth UID, put it here.
    // Example: 'c3qEzVVU52NddP2LmNQXAldCZ5C2'
    'c3qEzVVU52NddP2LmNQXAldCZ5C2'
  ];

  // Owners have the highest privileges in UI. In production use custom claims.
  const OWNER_UIDS = UID_WHITELIST.slice();
  let CURRENT_ADMIN_ROLE = null;

  async function getAdminRole(user){
    if (!user || !db) return null;
    if (OWNER_UIDS.includes(user.uid)) return 'owner';
    try {
      const doc = await db.collection('admins').doc(user.uid).get();
      if (!doc.exists) return null;
      const role = doc.data()?.role || 'admin';
      return role;
    } catch (e) {
      console.warn('getAdminRole failed:', e.message);
      return null;
    }
  }

  async function isAdmin(user) {
    const role = await getAdminRole(user);
    return !!role;
  }

  function formatDate(ts) {
    try {
      if (!ts) return '—';
      const d = ts.toDate ? ts.toDate() : new Date(ts);
      // Use Gregorian calendar with Arabic locale
      return new Intl.DateTimeFormat('ar-SA-u-ca-gregory', { dateStyle: 'short', timeStyle: 'short' }).format(d);
    } catch { return '—'; }
  }

  function courseRow(c) {
    const status = c.status || 'active';
    const badgeClass = status === 'active' ? 'badge-green' : status === 'hidden' ? 'badge-slate' : 'badge-yellow';
    return `
      <tr data-id="${c.__id}">
        <td><input type="checkbox" class="rowCheck"></td>
        <td class="font-semibold">${escapeHtml(c.title || '—')}</td>
        <td>${escapeHtml(c.major || '—')}</td>
        <td>${escapeHtml(String(c.level ?? '—'))}</td>
        <td><span class="badge ${badgeClass}">${escapeHtml(status)}</span></td>
        <td class="text-slate-300 text-sm">${escapeHtml(c.addedBy || '—')}</td>
        <td class="text-slate-300 text-sm">${formatDate(c.timestamp)}</td>
        <td class="space-x-2 space-x-reverse">
          <button class="btn-secondary" data-action="toggle">
            <i class="fas fa-eye-slash"></i>
          </button>
          <button class="btn-secondary" data-action="soft-delete"><i class="fas fa-trash"></i></button>
          <button class="btn-secondary" data-action="restore"><i class="fas fa-rotate-left"></i></button>
          <button class="btn-secondary hidden" data-action="hard-delete"><i class="fas fa-skull-crossbones"></i></button>
        </td>
      </tr>
    `;
  }

  function escapeHtml(text){
    const div = document.createElement('div');
    div.textContent = text ?? '';
    return div.innerHTML;
  }

  let CURRENT_FILTER = { college: null, major: null };
  const DEFAULT_COLLEGES = ['كلية الحوسبة', 'كلية الصحة', 'كلية العلوم الإدارية والمالية'];
  const DEFAULT_MAJORS = ['علوم الحاسب', 'تقنية المعلومات', 'علوم البيانات', 'المواد العامة'];

  function inferCollege(major) {
    if (!major) return null;
    const m = String(major).toLowerCase();
    // Computing
    const comp = ['علوم الحاسب','تقنية المعلومات','علوم البيانات','computer science','information technology','data science','المواد العامة'];
    if (comp.some(k => m.includes(k.toLowerCase()))) return 'كلية الحوسبة';
    // Health
    const health = ['صحة','معلوماتية صحية','health'];
    if (health.some(k => m.includes(k.toLowerCase()))) return 'كلية الصحة';
    // Business & Finance
    const business = ['إدارة','مالية','محاسبة','تجارة','business','finance','account'];
    if (business.some(k => m.includes(k.toLowerCase()))) return 'كلية العلوم الإدارية والمالية';
    return null;
  }

  async function loadStatsAndTable() {
    if (!db) return;
    const tbody = $('coursesTbody');
    tbody.innerHTML = '<tr><td colspan="7" class="py-6 text-center text-slate-300">جاري التحميل...</td></tr>';

    try {
      // Fetch broad set and filter client-side to avoid composite index requirements
      const snap = await db.collection('userCourses').orderBy('timestamp','desc').limit(500).get();
      const allRows = [];
      let total = 0;
      snap.forEach(doc => {
        const d = doc.data();
        d.__id = doc.id;
        // derive college if missing
        d.college = d.college || inferCollege(d.major) || null;
        allRows.push(d);
        total++;
      });
      // Apply filters in-memory
      let rows = allRows;
      if (CURRENT_FILTER.college) rows = rows.filter(r => (r.college || inferCollege(r.major)) === CURRENT_FILTER.college);
      if (CURRENT_FILTER.major) rows = rows.filter(r => (r.major || '').toString() === CURRENT_FILTER.major);

      // Stats based on filtered view
      const active = rows.filter(r => (r.status || 'active') === 'active').length;
      const hidden = rows.length - active;
      $('statTotalCourses').textContent = String(rows.length);
      $('statActive').textContent = String(active);
      $('statHidden').textContent = String(hidden);
  $('statUpdated').textContent = new Intl.DateTimeFormat('ar-SA-u-ca-gregory', { dateStyle: 'short', timeStyle: 'short' }).format(new Date());

      if (rows.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8" class="py-6 text-center text-slate-400">لا توجد بيانات</td></tr>';
      } else {
        tbody.innerHTML = rows.map(courseRow).join('');
      }

      // populate filter dropdowns based on ALL available rows (not just filtered)
      populateFilters(allRows);
    } catch (e) {
      console.error('load data failed:', e);
      tbody.innerHTML = '<tr><td colspan="7" class="py-6 text-center text-rose-300">فشل في تحميل البيانات</td></tr>';
    }
  }

  function populateFilters(rows) {
    const collegeSel = $('collegeSelect');
    const majorSel = $('majorSelect');
    if (!collegeSel || !majorSel) return;
    const colleges = new Set(DEFAULT_COLLEGES);
    const majors = new Set(DEFAULT_MAJORS);
    rows.forEach(r => {
      const col = r.college || inferCollege(r.major);
      if (col) colleges.add(col);
      if (r.major) majors.add(r.major);
    });
    const colArr = Array.from(colleges).sort();
    const majArr = Array.from(majors).sort();
    collegeSel.innerHTML = `<option value="">كل الكليات</option>` + colArr.map(c => `<option ${CURRENT_FILTER.college===c?'selected':''} value="${escapeHtml(c)}">${escapeHtml(c)}</option>`).join('');
    majorSel.innerHTML = `<option value="">كل التخصصات</option>` + majArr.map(m => `<option ${CURRENT_FILTER.major===m?'selected':''} value="${escapeHtml(m)}">${escapeHtml(m)}</option>`).join('');
  }

  function setupTableActions() {
    const tbody = $('coursesTbody');
    tbody.addEventListener('click', async (e) => {
      const btn = e.target.closest('button');
      if (!btn) return;
      const tr = e.target.closest('tr');
      const id = tr?.dataset?.id;
      if (!id || !db) return;
      const action = btn.dataset.action;
      if (action === 'toggle') {
        const ref = db.collection('userCourses').doc(id);
        const snap = await ref.get();
        if (snap.exists) {
          const status = (snap.data().status || 'active') === 'active' ? 'hidden' : 'active';
          await ref.update({ status });
          await loadStatsAndTable();
        }
      } else if (action === 'soft-delete') {
        if (!confirm('سيتم وضع المادة في سلة المحذوفات، متابعة؟')) return;
        const ref = db.collection('userCourses').doc(id);
        await ref.set({ status:'deleted', deletedAt: firebase.firestore.FieldValue.serverTimestamp(), deletedBy: auth.currentUser?.uid || 'unknown' }, { merge:true });
        await loadStatsAndTable();
      } else if (action === 'restore') {
        const ref = db.collection('userCourses').doc(id);
        await ref.update({ status: 'active', deletedAt: firebase.firestore.FieldValue.delete(), deletedBy: firebase.firestore.FieldValue.delete() });
        await loadStatsAndTable();
      } else if (action === 'hard-delete') {
        if (!confirm('حذف نهائي؟ لا يمكن التراجع.')) return;
        await db.collection('userCourses').doc(id).delete();
        await loadStatsAndTable();
      }
    });

    // Selection and bulk toolbar
    const bulkToolbar = $('bulkToolbar');
    const selectAll = $('selectAll');
    function refreshToolbar(){
      const anyChecked = tbody.querySelectorAll('input.rowCheck:checked').length > 0;
      if (anyChecked) bulkToolbar.classList.remove('hidden'); else bulkToolbar.classList.add('hidden');
    }
    tbody.addEventListener('change', (e)=>{
      if (e.target.classList.contains('rowCheck')) refreshToolbar();
    });
    if (selectAll) selectAll.addEventListener('change', ()=>{
      tbody.querySelectorAll('input.rowCheck').forEach(cb=> cb.checked = selectAll.checked);
      refreshToolbar();
    });

    const idsSelected = ()=> Array.from(tbody.querySelectorAll('input.rowCheck:checked')).map(cb=> cb.closest('tr').dataset.id);
    function bulkUpdateStatus(next){
      const ids = idsSelected();
      return Promise.all(ids.map(id=> db.collection('userCourses').doc(id).set(next, {merge:true})));
    }
    $('bulkHide').addEventListener('click', async ()=>{ await bulkUpdateStatus({status:'hidden'}); await loadStatsAndTable();});
    $('bulkShow').addEventListener('click', async ()=>{ await bulkUpdateStatus({status:'active'}); await loadStatsAndTable();});
    $('bulkRestore').addEventListener('click', async ()=>{ await bulkUpdateStatus({status:'active', deletedAt: firebase.firestore.FieldValue.delete(), deletedBy: firebase.firestore.FieldValue.delete()}); await loadStatsAndTable();});
    $('bulkSoftDelete').addEventListener('click', async ()=>{ if (confirm('سيتم حذفها (قابلة للاستعادة)')) { await bulkUpdateStatus({status:'deleted', deletedAt: firebase.firestore.FieldValue.serverTimestamp(), deletedBy: auth.currentUser?.uid || 'unknown'}); await loadStatsAndTable(); }});
    $('bulkHardDelete').addEventListener('click', async ()=>{
      if (!confirm('حذف نهائي للمواد المحددة؟')) return;
      const ids = idsSelected();
      await Promise.all(ids.map(id=> db.collection('userCourses').doc(id).delete()));
      await loadStatsAndTable();
    });
  }

  function setupSearch() {
    const input = $('searchInput');
    const tbody = $('coursesTbody');
    input.addEventListener('input', () => {
      const q = input.value.trim().toLowerCase();
      for (const tr of tbody.querySelectorAll('tr')) {
        const title = tr.children[0]?.textContent?.toLowerCase() || '';
        tr.style.display = title.includes(q) ? '' : 'none';
      }
    });
  }

  async function addAdmin(uid, role='admin') {
    if (!uid || !db) return false;
    try {
      await db.collection('admins').doc(uid).set({ role, createdAt: firebase.firestore.FieldValue.serverTimestamp() }, { merge: true });
      return true;
    } catch (e) {
      alert('فشل إضافة المشرف: ' + e.message);
      return false;
    }
  }

  function setupAdminForm() {
    const form = $('addAdminForm');
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const uid = $('adminUidInput').value.trim();
      const role = $('adminRoleInput')?.value || 'admin';
      if (!uid) return;
      const ok = await addAdmin(uid, role);
      if (ok) {
        $('adminUidInput').value = '';
        alert('تمت الإضافة');
        await listAdmins();
      }
    });
  }

  async function listAdmins(){
    const wrap = $('adminsList');
    if (!wrap || !db) return;
    const snap = await db.collection('admins').get();
    const rows = [];
    snap.forEach(doc=>{
      const d = doc.data();
      const r = d.role || 'admin';
      const canEdit = CURRENT_ADMIN_ROLE === 'owner';
      rows.push(`<div class="flex items-center justify-between border-b border-white/10 py-2">
        <div class="flex items-center gap-2">
          <span class="text-slate-300 text-xs">${doc.id}</span>
          <span class="role-badge role-${r}">${r}</span>
        </div>
        <div class="flex items-center gap-2 ${canEdit? '':'opacity-50 pointer-events-none'}">
          <select class="input roleSel" data-uid="${doc.id}">
            <option value="admin" ${r==='admin'?'selected':''}>مشرف</option>
            <option value="moderator" ${r==='moderator'?'selected':''}>مشرف محتوى</option>
            <option value="superadmin" ${r==='superadmin'?'selected':''}>مشرف أعلى</option>
          </select>
          <button class="btn-secondary saveRole" data-uid="${doc.id}"><i class="fas fa-save"></i></button>
          <button class="btn-secondary removeAdmin" data-uid="${doc.id}"><i class="fas fa-user-slash"></i></button>
        </div>
      </div>`);
    });
    wrap.innerHTML = rows.length? rows.join('') : '<div class="text-slate-400 text-sm">لا يوجد مشرفون بعد</div>';

    // wire actions (owner only toggled later)
    wrap.querySelectorAll('.saveRole').forEach(btn=> btn.addEventListener('click', async ()=>{
      const uid = btn.dataset.uid;
      const sel = wrap.querySelector(`select.roleSel[data-uid="${uid}"]`);
      await db.collection('admins').doc(uid).set({ role: sel.value }, { merge:true });
      await listAdmins();
    }));
    wrap.querySelectorAll('.removeAdmin').forEach(btn=> btn.addEventListener('click', async ()=>{
      const uid = btn.dataset.uid;
      if (!confirm('إزالة من المشرفين؟')) return;
      await db.collection('admins').doc(uid).delete();
      await listAdmins();
    }));
  }

  function init() {
    if (!appReady || !db || !auth) {
      show('state-not-initialized');
      return;
    }

    $('logoutBtn').addEventListener('click', () => auth.signOut().then(() => location.href = 'index.html'));
    $('refreshBtn').addEventListener('click', loadStatsAndTable);

    const collegeSel = $('collegeSelect');
    const majorSel = $('majorSelect');
    const applyBtn = $('applyFilterBtn');
    const clearBtn = $('clearFilterBtn');
    if (applyBtn) applyBtn.addEventListener('click', () => {
      CURRENT_FILTER.college = collegeSel?.value || null;
      CURRENT_FILTER.major = majorSel?.value || null;
      loadStatsAndTable();
    });
    if (clearBtn) clearBtn.addEventListener('click', () => {
      CURRENT_FILTER = { college: null, major: null };
      if (collegeSel) collegeSel.value = '';
      if (majorSel) majorSel.value = '';
      loadStatsAndTable();
    });

    setupTableActions();
    setupSearch();
    setupAdminForm();

    auth.onAuthStateChanged(async (user) => {
      hide('state-not-initialized');
      hide('state-unauthenticated');
      hide('state-forbidden');
      hide('dashboard');

      if (!user) {
        show('state-unauthenticated');
        return;
      }

      $('adminUserEmail').textContent = user.email || user.uid;
      $('adminUserEmail').classList.remove('hidden');
  const role = await getAdminRole(user);
  CURRENT_ADMIN_ROLE = role;
      const ok = !!role;
      if (!ok) {
        show('state-forbidden');
        return;
      }

      show('dashboard');
      // Owner-only controls visibility
      const isOwner = role === 'owner';
      if (!isOwner) {
        const hardBtn = document.getElementById('bulkHardDelete');
        if (hardBtn) hardBtn.classList.add('hidden');
        // disable role edits for non-owners
        const form = document.getElementById('addAdminForm');
        if (form) form.classList.add('opacity-60', 'pointer-events-none');
      } else {
        const hardBtn = document.getElementById('bulkHardDelete');
        if (hardBtn) hardBtn.classList.remove('hidden');
      }
  await listAdmins();
      await loadStatsAndTable();
    });
  }

  document.addEventListener('DOMContentLoaded', init);
})();
