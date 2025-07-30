# نظام المصادقة والحسابات - كلية الحوسبة

## 🔐 نظام المصادقة المكتمل

تم إضافة نظام مصادقة شامل يتطلب من المستخدمين تسجيل الدخول لإضافة وتعديل وحذف المواد.

### 📁 الملفات الجديدة

#### 1. `auth.html` - صفحة المصادقة
- **تسجيل الدخول**: باستخدام البريد الإلكتروني وكلمة المرور
- **إنشاء حساب جديد**: مع معلومات المستخدم الكاملة
- **استرداد كلمة المرور**: إرسال رابط إعادة تعيين كلمة المرور
- **التكامل مع Firebase Authentication**
- **حفظ بيانات المستخدم في Firestore**

#### 2. `profile.html` - صفحة الملف الشخصي
- **عرض معلومات المستخدم**: الاسم، البريد الإلكتروني، التخصص
- **إحصائيات المستخدم**: عدد المواد المضافة، تاريخ الانضمام
- **إدارة المواد**: عرض جميع المواد التي أضافها المستخدم
- **تعديل وحذف المواد**: إمكانية تعديل وحذف المواد المضافة
- **تسجيل الخروج**: إنهاء جلسة المستخدم

### 🔧 التحديثات على `index.html`

#### أزرار المصادقة
```html
<!-- أزرار تسجيل الدخول وإنشاء الحساب -->
<a href="auth.html" class="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-lg">
    تسجيل الدخول
</a>
<a href="auth.html" class="border border-blue-500 text-blue-400 hover:text-white px-4 py-2 rounded-lg">
    إنشاء حساب
</a>
```

#### قائمة المستخدم
```html
<!-- قائمة المستخدم المسجل دخول -->
<div class="user-profile">
    <button onclick="toggleUserMenu()">
        <span class="user-name">اسم المستخدم</span>
    </button>
    <!-- قائمة منسدلة -->
    <div id="userMenu">
        <a href="profile.html">لوحة التحكم</a>
        <a href="profile.html">الملف الشخصي</a>
        <a href="profile.html">موادي</a>
        <button onclick="logoutUser()">تسجيل الخروج</button>
    </div>
</div>
```

### 🔒 حماية العمليات

#### إضافة المواد
```javascript
// التحقق من تسجيل الدخول قبل إضافة مادة
function openAddCourseModal() {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const currentUser = auth?.currentUser;
    
    if (!isLoggedIn || !currentUser) {
        showNotification('يجب تسجيل الدخول أولاً لإضافة مادة جديدة', 'error');
        window.location.href = 'auth.html';
        return;
    }
    // ... فتح نموذج الإضافة
}
```

#### حفظ البيانات مع معرف المستخدم
```javascript
// ربط المادة بالمستخدم عند الحفظ
const firebaseCourse = {
    courseCode: courseCode,
    title: courseTitle,
    // ... باقي البيانات
    addedBy: currentUser.uid,
    addedByName: userData.fullName || userData.displayName,
    addedByEmail: currentUser.email,
    createdAt: firebase.firestore.FieldValue.serverTimestamp()
};
```

### 🔄 إدارة حالة المصادقة

#### التحقق من حالة المستخدم
```javascript
// مراقبة حالة المصادقة
auth.onAuthStateChanged(async (user) => {
    if (user) {
        // المستخدم مسجل دخول
        localStorage.setItem('isLoggedIn', 'true');
        updateAuthUI(true, userData);
    } else {
        // المستخدم غير مسجل دخول
        localStorage.setItem('isLoggedIn', 'false');
        updateAuthUI(false);
    }
});
```

#### تحديث واجهة المستخدم
```javascript
function updateAuthUI(isLoggedIn, userData = null) {
    const authButtons = document.querySelector('.auth-buttons');
    const userProfile = document.querySelector('.user-profile');
    const addCourseBtn = document.querySelector('.add-course-btn');
    
    if (isLoggedIn) {
        // إخفاء أزرار المصادقة، إظهار ملف المستخدم
        authButtons.style.display = 'none';
        userProfile.style.display = 'flex';
        addCourseBtn.style.display = 'inline-block';
    } else {
        // إظهار أزرار المصادقة، إخفاء ملف المستخدم
        authButtons.style.display = 'flex';
        userProfile.style.display = 'none';
        addCourseBtn.style.display = 'none';
    }
}
```

### 💾 قاعدة البيانات Firebase

#### مجموعة المستخدمين (`users`)
```javascript
{
    uid: "user_firebase_uid",
    email: "user@example.com",
    fullName: "اسم المستخدم الكامل",
    major: "علوم الحاسب",
    createdAt: firebase.firestore.Timestamp,
    coursesAdded: 0,
    lastLogin: firebase.firestore.Timestamp
}
```

#### مجموعة المواد (`userCourses`)
```javascript
{
    courseCode: "CS101",
    title: "مقدمة في البرمجة",
    description: "وصف المادة...",
    major: "علوم الحاسب",
    level: 1,
    credits: 3,
    resources: [...],
    addedBy: "user_firebase_uid",
    addedByName: "اسم المستخدم",
    addedByEmail: "user@example.com",
    createdAt: firebase.firestore.Timestamp
}
```

### 🚀 كيفية الاستخدام

#### للمستخدمين الجدد:
1. الذهاب إلى `auth.html`
2. النقر على "إنشاء حساب جديد"
3. ملء المعلومات المطلوبة
4. تأكيد البريد الإلكتروني
5. تسجيل الدخول والبدء في إضافة المواد

#### للمستخدمين المسجلين:
1. تسجيل الدخول من `auth.html`
2. إضافة المواد من الصفحة الرئيسية
3. إدارة المواد من صفحة `profile.html`
4. تسجيل الخروج عند الانتهاء

### 📱 التوافق مع الجوال

- جميع أزرار المصادقة متاحة في القائمة المتنقلة
- واجهة مستخدم متجاوبة لجميع الشاشات
- تجربة مستخدم محسنة للأجهزة المحمولة

### 🔔 الإشعارات

```javascript
// نظام إشعارات محدث
function showNotification(message, type = 'info') {
    // عرض إشعار جميل مع أيقونات ملونة
    // أنواع: success, error, info
    // اختفاء تلقائي بعد 4 ثوان
}
```

### 📊 الميزات الجديدة

1. **تسجيل الدخول الآمن** - باستخدام Firebase Authentication
2. **إدارة المستخدمين** - حفظ البيانات في Firestore
3. **ربط المواد بالمستخدمين** - كل مادة مربوطة بمن أضافها
4. **صفحة ملف شخصي** - إدارة شاملة للمواد المضافة
5. **حماية العمليات** - منع غير المصرح لهم من التعديل
6. **إشعارات تفاعلية** - تنبيهات جميلة للمستخدم
7. **واجهة محدثة** - أزرار وقوائم جديدة للمصادقة

### 🎯 المتطلبات المكتملة

✅ **ميزة الحسابات**: نظام تسجيل دخول كامل  
✅ **حماية الإضافة والحذف والتعديل**: يتطلب تسجيل الدخول  
✅ **صفحة الحساب**: عرض المواد التي أضافها المستخدم فقط  
✅ **ربط المواد بالمستخدمين**: كل مادة مربوطة بمن أضافها  
✅ **واجهة مستخدم محدثة**: أزرار وقوائم المصادقة  

النظام جاهز للاستخدام! 🎉
