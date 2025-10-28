// Super Admin Dashboard - Multi-College Support with Advanced Permissions
(function(){
  const appReady = typeof firebase !== 'undefined' && firebase.apps && firebase.apps.length > 0;
  const db = appReady ? (window.db || firebase.firestore()) : null;
  const auth = appReady ? (window.auth || firebase.auth()) : null;

  const $ = (id) => document.getElementById(id);
  const show = (id) => $(id)?.classList.remove('hidden');
  const hide = (id) => $(id)?.classList.add('hidden');

  // Super Admin UIDs - Have access to everything
  const SUPER_ADMIN_UIDS = [
    'c3qEzVVU52NddP2LmNQXAldCZ5C2' // Replace with your UID
  ];

  let currentUser = null;
  let currentAdminRole = null;
  let currentCollege = 'computing';
  let currentCollection = 'userCourses';
  let allCourses = [];

  // College Configuration
  const COLLEGE_CONFIG = {
    computing: {
      name: 'كلية الحوسبة',
      collection: 'userCourses',
      majors: ['علوم الحاسب', 'تقنية المعلومات', 'علوم البيانات', 'المواد العامة']
    },
    health: {
      name: 'كلية الصحة',
      collection: 'health_courses',
      majors: ['الصحة العامة', 'المعلوماتية الصحية']
    },
    business: {
      name: 'كلية العلوم الإدارية والمالية',
      collection: 'business_courses',
      majors: ['إدارة الأعمال', 'المحاسبة', 'التجارة الإلكترونية', 'التسويق']
    }
  };

  // Get admin role from Firestore
  async function getAdminRole(user) {
    if (!user || !db) return null;
    
    // Check if Super Admin
    if (SUPER_ADMIN_UIDS.includes(user.uid)) {
      return { role: 'superAdmin', colleges: ['all'] };
    }

    try {
      const doc = await db.collection('admins').doc(user.uid).get();
      if (!doc.exists) return null;
      
      const data = doc.data();
      return {
        role: data.role || 'collegeAdmin',
        colleges: data.colleges || [],
        college: data.college || null
      };
    } catch (e) {
      console.warn('getAdminRole failed:', e.message);
      return null;
    }
  }

  // Check if user is banned
  async function isUserBanned(uid) {
    if (!db) return false;
    try {
      const doc = await db.collection('bannedUsers').doc(uid).get();
      return doc.exists;
    } catch (e) {
      console.warn('isUserBanned check failed:', e);
      return false;
    }
  }

  // Ban user
  async function banUser(uid, email, name) {
    if (!db) return false;
    try {
      await db.collection('bannedUsers').doc(uid).set({
        uid: uid,
        email: email || '—',
        name: name || '—',
        bannedAt: firebase.firestore.FieldValue.serverTimestamp(),
        bannedBy: currentUser.uid
      });
      return true;
    } catch (e) {
      console.error('Ban user failed:', e);
      return false;
    }
  }

  // Unban user
  async function unbanUser(uid) {
    if (!db) return false;
    try {
      await db.collection('bannedUsers').doc(uid).delete();
      return true;
    } catch (e) {
      console.error('Unban user failed:', e);
      return false;
    }
  }

  // Load banned users list
  async function loadBannedUsers() {
    if (!db) return;
    try {
      const snapshot = await db.collection('bannedUsers').orderBy('bannedAt', 'desc').get();
      const container = $('bannedUsersList');
      if (!container) return;

      if (snapshot.empty) {
        container.innerHTML = '<div class="text-slate-400 text-sm text-center py-4">لا يوجد مستخدمون محظورون</div>';
        return;
      }

      container.innerHTML = snapshot.docs.map(doc => {
        const data = doc.data();
        return `
          <div class="bg-slate-800/50 rounded-lg p-3 border border-white/10 flex items-center justify-between">
            <div>
              <div class="text-white text-sm font-semibold">${escapeHtml(data.name || '—')}</div>
              <div class="text-slate-400 text-xs">${escapeHtml(data.email || '—')}</div>
              <div class="text-slate-500 text-xs">UID: ${escapeHtml(data.uid)}</div>
            </div>
            <button class="btn-secondary text-xs bg-green-600/20 text-green-300 border-green-500/30 hover:bg-green-600/30" onclick="window.unbanUserById('${doc.id}')">
              <i class="fas fa-check mr-1"></i> رفع الحظر
            </button>
          </div>
        `;
      }).join('');
    } catch (e) {
      console.error('Load banned users failed:', e);
    }
  }

  // Global unban function
  window.unbanUserById = async function(uid) {
    if (!confirm('هل أنت متأكد من رفع الحظر عن هذا المستخدم؟')) return;
    const success = await unbanUser(uid);
    if (success) {
      alert('تم رفع الحظر بنجاح');
      loadBannedUsers();
    } else {
      alert('فشل رفع الحظر');
    }
  };

  // Search for user (by email or UID)
  async function searchUser(query) {
    if (!db) return null;
    try {
      // Try to find by UID first
      const userDoc = await db.collection('users').doc(query).get();
      if (userDoc.exists) {
        return { uid: query, ...userDoc.data() };
      }

      // Try to find by email
      const emailQuery = await db.collection('users').where('email', '==', query).limit(1).get();
      if (!emailQuery.empty) {
        const doc = emailQuery.docs[0];
        return { uid: doc.id, ...doc.data() };
      }

      return null;
    } catch (e) {
      console.error('Search user failed:', e);
      return null;
    }
  }

  // Format date
  function formatDate(ts) {
    try {
      if (!ts) return '—';
      const d = ts.toDate ? ts.toDate() : new Date(ts);
      return new Intl.DateTimeFormat('ar-SA-u-ca-gregory', { dateStyle: 'short', timeStyle: 'short' }).format(d);
    } catch { return '—'; }
  }

  // Escape HTML
  function escapeHtml(text){
    const div = document.createElement('div');
    div.textContent = text ?? '';
    return div.innerHTML;
  }

  // Course row HTML
  function courseRow(c) {
    const status = c.status || 'active';
    const badgeClass = status === 'active' ? 'badge-green' : status === 'hidden' ? 'badge-slate' : 'badge-yellow';
    
    let addedByText = '—';
    if (c.addedBy) {
      if (typeof c.addedBy === 'string') {
        addedByText = c.addedBy;
      } else if (c.addedBy.name) {
        addedByText = c.addedBy.name;
      } else if (c.addedBy.email) {
        addedByText = c.addedBy.email;
      }
    }

    return `
      <tr data-id="${c.__id}">
        <td><input type="checkbox" class="rowCheck"></td>
        <td class="font-semibold">${escapeHtml(c.title || c.code || '—')}</td>
        <td>${escapeHtml(c.major || '—')}</td>
        <td>${escapeHtml(String(c.level ?? '—'))}</td>
        <td><span class="badge ${badgeClass}">${escapeHtml(status)}</span></td>
        <td class="text-slate-300 text-sm">${escapeHtml(addedByText)}</td>
        <td class="text-slate-300 text-sm">${formatDate(c.createdAt || c.timestamp)}</td>
        <td class="space-x-2 space-x-reverse">
          <button class="btn-secondary" data-action="toggle">
            <i class="fas ${status === 'active' ? 'fa-eye-slash' : 'fa-eye'}"></i>
          </button>
          <button class="btn-secondary" data-action="soft-delete"><i class="fas fa-trash"></i></button>
        </td>
      </tr>
    `;
  }

  // Load courses from current collection
  async function loadCourses() {
    if (!db) return;
    
    try {
      const snapshot = await db.collection(currentCollection).orderBy('createdAt', 'desc').limit(100).get();
      allCourses = snapshot.docs.map(doc => ({ __id: doc.id, ...doc.data() }));
      renderCourses(allCourses);
      updateStats();
    } catch (e) {
      console.error('Load courses failed:', e);
      allCourses = [];
      renderCourses([]);
    }
  }

  // Render courses table
  function renderCourses(courses) {
    const tbody = $('coursesTbody');
    if (!tbody) return;

    if (courses.length === 0) {
      tbody.innerHTML = '<tr><td colspan="8" class="text-center text-slate-400 py-8">لا توجد مواد</td></tr>';
      return;
    }

    tbody.innerHTML = courses.map(courseRow).join('');
    attachRowEventListeners();
  }

  // Update statistics
  function updateStats() {
    const total = allCourses.length;
    const active = allCourses.filter(c => (c.status || 'active') === 'active').length;
    const hidden = allCourses.filter(c => c.status === 'hidden').length;
    const latest = allCourses[0];

    $('statTotalCourses').textContent = total;
    $('statActive').textContent = active;
    $('statHidden').textContent = hidden;
    $('statUpdated').textContent = latest ? formatDate(latest.createdAt || latest.timestamp) : '—';
  }

  // Attach event listeners to table rows
  function attachRowEventListeners() {
    document.querySelectorAll('#coursesTbody tr').forEach(row => {
      const id = row.dataset.id;
      if (!id) return;

      row.querySelectorAll('button[data-action]').forEach(btn => {
        btn.addEventListener('click', async (e) => {
          e.stopPropagation();
          const action = btn.dataset.action;
          
          if (action === 'toggle') {
            await toggleCourseStatus(id);
          } else if (action === 'soft-delete') {
            await deleteCourse(id);
          }
        });
      });

      const checkbox = row.querySelector('.rowCheck');
      if (checkbox) {
        checkbox.addEventListener('change', updateBulkToolbar);
      }
    });
  }

  // Toggle course status
  async function toggleCourseStatus(id) {
    const course = allCourses.find(c => c.__id === id);
    if (!course) return;

    const newStatus = (course.status || 'active') === 'active' ? 'hidden' : 'active';
    
    try {
      await db.collection(currentCollection).doc(id).update({ status: newStatus });
      course.status = newStatus;
      renderCourses(allCourses);
      updateStats();
    } catch (e) {
      console.error('Toggle status failed:', e);
      alert('فشل تغيير الحالة');
    }
  }

  // Delete course
  async function deleteCourse(id) {
    if (!confirm('هل أنت متأكد من حذف هذه المادة؟')) return;

    try {
      await db.collection(currentCollection).doc(id).delete();
      allCourses = allCourses.filter(c => c.__id !== id);
      renderCourses(allCourses);
      updateStats();
    } catch (e) {
      console.error('Delete failed:', e);
      alert('فشل الحذف');
    }
  }

  // Update bulk toolbar visibility
  function updateBulkToolbar() {
    const checked = document.querySelectorAll('.rowCheck:checked').length;
    if (checked > 0) {
      show('bulkToolbar');
    } else {
      hide('bulkToolbar');
    }
  }

  // Bulk actions
  async function bulkAction(action) {
    const checked = Array.from(document.querySelectorAll('.rowCheck:checked'));
    const ids = checked.map(cb => cb.closest('tr').dataset.id).filter(Boolean);
    
    if (ids.length === 0) return;

    if (action === 'hide') {
      await Promise.all(ids.map(id => db.collection(currentCollection).doc(id).update({ status: 'hidden' })));
    } else if (action === 'show') {
      await Promise.all(ids.map(id => db.collection(currentCollection).doc(id).update({ status: 'active' })));
    } else if (action === 'delete') {
      if (!confirm(`هل أنت متأكد من حذف ${ids.length} مادة؟`)) return;
      await Promise.all(ids.map(id => db.collection(currentCollection).doc(id).delete()));
    }

    loadCourses();
  }

  // Switch college tab
  function switchCollege(college, collection) {
    currentCollege = college;
    currentCollection = collection;

    // Update active tab
    document.querySelectorAll('.college-tab').forEach(tab => {
      if (tab.dataset.college === college) {
        tab.classList.add('active');
      } else {
        tab.classList.remove('active');
      }
    });

    // Update major select
    const majorSelect = $('majorSelect');
    if (majorSelect) {
      majorSelect.innerHTML = '<option value="">جميع التخصصات</option>' +
        COLLEGE_CONFIG[college].majors.map(m => `<option value="${m}">${m}</option>`).join('');
    }

    loadCourses();
  }

  // Load admins list
  async function loadAdminsList() {
    if (!db) return;
    
    try {
      const snapshot = await db.collection('admins').get();
      const container = $('adminsList');
      if (!container) return;

      if (snapshot.empty) {
        container.innerHTML = '<div class="text-slate-400 text-sm">لا يوجد مشرفون</div>';
        return;
      }

      container.innerHTML = snapshot.docs.map(doc => {
        const data = doc.data();
        const isSuperAdmin = data.role === 'superAdmin';
        const badgeClass = isSuperAdmin ? 'badge-superadmin' : 'badge-college-admin';
        const badgeText = isSuperAdmin ? 'مشرف أعلى' : 'مشرف كلية';
        const collegeText = data.college ? ` - ${COLLEGE_CONFIG[data.college]?.name || data.college}` : '';

        return `
          <div class="bg-slate-800/50 rounded-lg p-3 border border-white/10 flex items-center justify-between">
            <div>
              <div class="flex items-center gap-2">
                <span class="${badgeClass}">${badgeText}</span>
                ${collegeText ? `<span class="text-slate-400 text-sm">${collegeText}</span>` : ''}
              </div>
              <div class="text-slate-400 text-xs mt-1">UID: ${escapeHtml(doc.id)}</div>
            </div>
            <button class="btn-secondary text-xs bg-red-600/20 text-red-300 border-red-500/30" onclick="window.removeAdmin('${doc.id}')">
              <i class="fas fa-trash mr-1"></i> إزالة
            </button>
          </div>
        `;
      }).join('');
    } catch (e) {
      console.error('Load admins failed:', e);
    }
  }

  // Add/Update admin
  async function addOrUpdateAdmin(uid, role, college) {
    if (!db) return false;
    
    try {
      const data = {
        role: role,
        updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
        updatedBy: currentUser.uid
      };

      if (role === 'collegeAdmin' && college) {
        data.college = college;
        data.colleges = [college];
      } else if (role === 'superAdmin') {
        data.colleges = ['all'];
      }

      await db.collection('admins').doc(uid).set(data, { merge: true });
      return true;
    } catch (e) {
      console.error('Add admin failed:', e);
      return false;
    }
  }

  // Remove admin
  window.removeAdmin = async function(uid) {
    if (!confirm('هل أنت متأكد من إزالة هذا المشرف؟')) return;
    
    try {
      await db.collection('admins').doc(uid).delete();
      alert('تم إزالة المشرف بنجاح');
      loadAdminsList();
    } catch (e) {
      console.error('Remove admin failed:', e);
      alert('فشل إزالة المشرف');
    }
  };

  // Initialize dashboard
  async function initDashboard() {
    if (!auth || !db) {
      show('state-not-initialized');
      return;
    }

    auth.onAuthStateChanged(async (user) => {
      if (!user) {
        show('state-unauthenticated');
        return;
      }

      currentUser = user;
      const adminRole = await getAdminRole(user);

      if (!adminRole) {
        show('state-forbidden');
        return;
      }

      currentAdminRole = adminRole;

      // Show dashboard
      show('dashboard');
      $('adminUserEmail').textContent = user.email;
      show('adminUserEmail');

      // Show admin badge
      const badge = $('adminBadge');
      if (adminRole.role === 'superAdmin') {
        badge.innerHTML = '<span class="badge-superadmin"><i class="fas fa-crown mr-1"></i> مشرف أعلى</span>';
        show('adminBadge');
        show('collegeTabs');
        show('usersManagement');
        show('adminsManagement');
        loadBannedUsers();
        loadAdminsList();
      } else if (adminRole.role === 'collegeAdmin') {
        const collegeName = COLLEGE_CONFIG[adminRole.college]?.name || adminRole.college;
        badge.innerHTML = `<span class="badge-college-admin"><i class="fas fa-user-shield mr-1"></i> مشرف ${collegeName}</span>`;
        show('adminBadge');
        
        // Set college
        currentCollege = adminRole.college;
        currentCollection = COLLEGE_CONFIG[adminRole.college].collection;
        hide('collegeTabs');
      }

      // Setup major select
      const majorSelect = $('majorSelect');
      majorSelect.innerHTML = '<option value="">جميع التخصصات</option>' +
        COLLEGE_CONFIG[currentCollege].majors.map(m => `<option value="${m}">${m}</option>`).join('');

      // Load courses
      loadCourses();

      // Event listeners
      setupEventListeners();
    });
  }

  // Setup event listeners
  function setupEventListeners() {
    // Logout
    $('logoutBtn')?.addEventListener('click', () => {
      auth.signOut();
      window.location.href = 'account.html';
    });

    // College tabs
    document.querySelectorAll('.college-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        switchCollege(tab.dataset.college, tab.dataset.collection);
      });
    });

    // Refresh
    $('refreshBtn')?.addEventListener('click', loadCourses);

    // Search
    $('searchInput')?.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase();
      const filtered = allCourses.filter(c => 
        (c.title || '').toLowerCase().includes(query) ||
        (c.code || '').toLowerCase().includes(query)
      );
      renderCourses(filtered);
    });

    // Filter
    $('applyFilterBtn')?.addEventListener('click', () => {
      const major = $('majorSelect').value;
      const filtered = major ? allCourses.filter(c => c.major === major) : allCourses;
      renderCourses(filtered);
    });

    $('clearFilterBtn')?.addEventListener('click', () => {
      $('majorSelect').value = '';
      renderCourses(allCourses);
    });

    // Select all
    $('selectAll')?.addEventListener('change', (e) => {
      document.querySelectorAll('.rowCheck').forEach(cb => cb.checked = e.target.checked);
      updateBulkToolbar();
    });

    // Bulk actions
    $('bulkHide')?.addEventListener('click', () => bulkAction('hide'));
    $('bulkShow')?.addEventListener('click', () => bulkAction('show'));
    $('bulkSoftDelete')?.addEventListener('click', () => bulkAction('delete'));

    // Admin form
    $('addAdminForm')?.addEventListener('submit', async (e) => {
      e.preventDefault();
      const uid = $('adminUidInput').value.trim();
      const role = $('adminRoleInput').value;
      const college = role === 'collegeAdmin' ? $('adminCollegeInput').value : null;

      if (!uid) {
        alert('الرجاء إدخال UID المستخدم');
        return;
      }

      const success = await addOrUpdateAdmin(uid, role, college);
      if (success) {
        alert('تم إضافة/تحديث المشرف بنجاح');
        $('adminUidInput').value = '';
        loadAdminsList();
      } else {
        alert('فشل إضافة/تحديث المشرف');
      }
    });

    // Show/hide college select based on role
    $('adminRoleInput')?.addEventListener('change', (e) => {
      if (e.target.value === 'collegeAdmin') {
        show('collegeSelectContainer');
      } else {
        hide('collegeSelectContainer');
      }
    });

    // User search
    $('searchUserBtn')?.addEventListener('click', async () => {
      const query = $('userSearchInput').value.trim();
      if (!query) {
        alert('الرجاء إدخال البريد الإلكتروني أو UID');
        return;
      }

      const user = await searchUser(query);
      if (!user) {
        alert('لم يتم العثور على المستخدم');
        return;
      }

      // Show user details
      $('foundUserName').textContent = user.displayName || user.name || '—';
      $('foundUserEmail').textContent = user.email || '—';
      $('foundUserUID').textContent = user.uid;
      show('userSearchResults');

      // Check if banned
      const isBanned = await isUserBanned(user.uid);
      if (isBanned) {
        show('userBanStatus');
        hide('banUserBtn');
        show('unbanUserBtn');
      } else {
        hide('userBanStatus');
        show('banUserBtn');
        hide('unbanUserBtn');
      }

      // Setup ban/unban buttons
      $('banUserBtn').onclick = async () => {
        if (!confirm('هل أنت متأكد من حظر هذا المستخدم؟')) return;
        const success = await banUser(user.uid, user.email, user.displayName || user.name);
        if (success) {
          alert('تم حظر المستخدم بنجاح');
          show('userBanStatus');
          hide('banUserBtn');
          show('unbanUserBtn');
          loadBannedUsers();
        } else {
          alert('فشل حظر المستخدم');
        }
      };

      $('unbanUserBtn').onclick = async () => {
        if (!confirm('هل أنت متأكد من رفع الحظر عن هذا المستخدم؟')) return;
        const success = await unbanUser(user.uid);
        if (success) {
          alert('تم رفع الحظر بنجاح');
          hide('userBanStatus');
          show('banUserBtn');
          hide('unbanUserBtn');
          loadBannedUsers();
        } else {
          alert('فشل رفع الحظر');
        }
      };
    });
  }

  // Initialize on load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initDashboard);
  } else {
    initDashboard();
  }
})();
