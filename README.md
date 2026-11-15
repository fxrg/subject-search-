# 🎓 Subject Search 2.0
### Your Academic Journey, One Platform.

<div align="center">

![Subject Search 2.0](https://img.shields.io/badge/🎓_Subject_Search-2.0.0-4f46e5?style=for-the-badge&logoColor=white)
[![Live Demo](https://img.shields.io/badge/🌐_Live_Website-Visit_Now-success?style=for-the-badge)](https://fxrg.github.io/subject-search-/)
[![Automated CI](https://img.shields.io/badge/CI-Automated_Tests_Passing-brightgreen?style=for-the-badge&logo=githubactions)](https://github.com/fxrg/subject-search-)
[![PWA Ready](https://img.shields.io/badge/PWA-Offline_Enabled-blueviolet?style=for-the-badge)](https://fxrg.github.io/subject-search-/)

**المنصة الأكاديمية الرقمية المتكاملة لطلاب الجامعة السعودية الإلكترونية (SEU)**

*البحث الذكي • المخطط الأكاديمي وجدول المذاكرة • شجرة المتطلبات • التقويم الآلي • مقارنة المقررات*

</div>

---

## 🌟 نظرة عامة على المشروع (Overview)

تم ترقية **Subject Search 2.0** من مجرد محرك بحث بسيط للمقررات إلى **منصة أكاديمية شاملة** لإدارة المسار الجامعي للطلاب، مع الحفاظ الكامل على البيانات وحسابات المستخدمين والروابط الأكاديمية السابقة بدون انقطاع، وبنية تحتية معيارية حديثة خالية من التبعيات غير الضرورية وبدون أي تكاليف أو اشتراكات ذكاء اصطناعي مدفوعة.

---

## 🏛️ الكليات والتخصصات المعتمدة (Colleges & Majors)

تغطي المنصة **4 كليات معتمدة** تشمل جميع التخصصات الأكاديمية:

1. **كلية الحوسبة والمعلوماتية (CCI):**
   - علوم الحاسب (Computer Science - CS)
   - تقنية المعلومات (Information Technology - IT)
   - علوم البيانات (Data Science - DS)

2. **كلية العلوم الإدارية والمالية (CAFS):**
   - إدارة الأعمال (Business Administration - BA)
   - المحاسبة (Accounting - ACCT)
   - المالية (Finance - FIN)
   - التجارة الإلكترونية (E-Commerce - ECOM)

3. **كلية العلوم الصحية (CHS):**
   - المعلوماتية الصحية (Health Informatics - HCI)
   - الصحة العامة (Public Health - PH)

4. **كلية الدراسات النظرية (CTS - الكلية الرابعة الجديدة):**
   - القانون (Law - LAW)
   - الإعلام الرقمي (Digital Media - MED)
   - اللغات والترجمة (Languages and Translation - ENG/TRN)
   - الإحصاء التطبيقي وتحليل البيانات (Applied Statistics & Data Analytics - STAT)

---

## 🚀 المميزات الرئيسية في الإصدار 2.0 (Core Features)

### 1. 🔍 البحث الذكي 2.0 (Smart Search 2.0)
- **بحث متعدد اللغات**: باللغتين العربية والإنجليزية ورموز المقررات (مثل CS230, LAW101, STAT101).
- **البحث الضبابي وتسامح الأخطاء المطبعية (Fuzzy Search & Typo Tolerance)**: مبني على خوارزمية مسافة ليفنشتاين المخصصة والتطبيع اللغوي العربي.
- **معجم المرادفات الأكاديمي (Academic Synonyms)**: البحث عن مفاهيم مثل "ذكاء اصطناعي" يقترح تلقائياً مقررات التعلم الآلي والتعلم العميق وعلوم البيانات.
- **فلاتر متعددة الأبعاد (Faceted Filters)**: الفرز الفوري بحسب الكلية، المستوى الدراسي، معدل الصعوبة، والتقييم.
- **سجل البحث والمقررات الرائجة**: حفظ أحدث عمليات البحث محلياً مع احترام كامل لخصوصية الطالب.

### 2. 🗓️ المخطط الأكاديمي وجدول المذاكرة الذكي (Academic Planner & Study Scheduler)
- **الملف الأكاديمي ونسبة التخرج**: متابعة المقررات المنجزة والمسجلة والساعات المتبقية نحو التخرج.
- **محرك الجدولة التلقائي (Smart Study Scheduling Engine)**:
  - يستند إلى مواعيد الاختبارات النصفية والنهائية المعتمدة من التقويم الأكاديمي الرسمي.
  - يزن أوقات الاستذكار وفقاً لعدد الساعات المعتمدة ومعدل صعوبة كل مقرر.
  - يوزع جلسات المذاكرة بمرونة مع مراعاة السعة اليومية للطالب (3.5 ساعات/يوم افتراضياً) لمنع الإجهاد.
  - يخصص جلسات مراجعة شاملة ليلة الاختبارات، مع ميزة إعادة جدولة المهام المتأخرة دون فقدان المهام المنجزة.

### 3. 🌳 شجرة المتطلبات وسلاسل المقررات (Prerequisite Graph)
- تمثيل بصري تفاعلي للمقررات وسلاسل المتطلبات بحسب المستويات الدراسية.
- ترميز لوني ديناميكي حسب حالة الطالب:
  - 🟢 **مكتمل**: تم اجتيازه بنجاح.
  - 🔵 **مسجل**: يدرسه الطالب حالياً.
  - 🟡 **متاح**: استوفيت جميع متطلباته السابقة.
  - ⚪ **مقفل**: محجوب لعدم استيفاء المتطلب السابق.
- فحص آلي لمنع الاعتماديات الدائرية (Circular Dependency Prevention).
- أدوات تحكم بالتكبير والتصغير وتوافق كامل مع الشاشات اللمسية والأجهزة الذكية.

### 4. ⚖️ مصفوفة مقارنة المقررات (Course Comparison)
- مقارنة جنباً إلى جنب حتى 4 مقررات في جدول موحد.
- مقارنة الساعات، المتطلبات، الصعوبة، تقييم الاختبارات، وأعباء المشاريع والتكاليف.

### 5. 📅 التقويم الأكاديمي الآلي (Automated Academic Calendar)
- **تخزين آمن في JSON** (`data/academic-calendar.json`) دون استهلاك استدعاءات Firebase.
- مراقبة مواعيد الفاينل، الميدتيرم، الحذف والإضافة، والإجازات الرسمية.
- **عدادات تنازلية حية** في الواجهة الرئيسية للأيام المتبقية على الاختبارات والتسجيل.
- كاش IndexedDB مع استراتيجية Stale-While-Revalidate للعمل أوفلاين.

### 6. 🤖 المساعد الأكاديمي المحلي (AI-Free Academic Assistant)
- مساعد ذكي يعمل محلياً 100% بدون أي تكاليف أو اشتراكات خارجية.
- التعرف على النوايا (Intent Detection): الاستعلام عن المتطلبات، مقارنة المقررات، العد التنازلي للاختبارات، وجدولة المذاكرة.

### 7. 📱 تطبيق ويب تقدمي وتصفح دون اتصال (PWA & Offline Mode)
- Service Worker متقدم (`sw.js`) لتخزين ملفات الهيكل الأساسي (App Shell).
- دعم تثبيت التطبيق على الهواتف والحواسب عبر `manifest.json`.
- تنبيه ذكي عند انقطاع الاتصال مع استمرار التصفح من كاش IndexedDB.

---

## 📂 الهيكلية البرمجية للمشروع (Architecture)

```text
subject-search/
├── .github/
│   └── workflows/
│       ├── academic-calendar.yml    # تشغيل مجدول لسكرابر التقويم كل أسبوعين
│       └── ci.yml                   # اختبارات الجودة الآلية عند كل Push/PR
├── assets/
│   ├── js/
│   │   ├── core/                    # التهيئة والتكوين العام
│   │   │   ├── app.js               # المحرك الرئيسي وتشغيل الواجهة 2.0
│   │   │   └── config.js            # ثوابت النظام والكليات
│   │   ├── cache/                   # إدارة الكاش المحلي والتخزين
│   │   │   ├── indexeddb.js         # محرك IndexedDB متعدد المخازن
│   │   │   └── cache-manager.js     # نمط Stale-While-Revalidate ومنع التكرار
│   │   ├── services/                # خدمات البيانات والتقويم
│   │   │   ├── course-service.js    # مستودع المقررات الموحد لجميع الكليات
│   │   │   └── calendar-service.js  # التقويم الأكاديمي والعد التنازلي
│   │   ├── search/                  # محرك البحث الذكي
│   │   │   ├── search-engine.js     # البحث المتقدم والفلاتر
│   │   │   ├── fuzzy-search.js      # مسافة ليفنشتاين وتسامح الأخطاء
│   │   │   └── synonyms.js          # معجم المرادفات والتطبيع العربي
│   │   ├── planner/                 # المخطط الدراسي وجدول المذاكرة
│   │   │   ├── planner-engine.js    # إدارة ملف الطالب ونسبة التخرج
│   │   │   └── schedule-generator.js# خوارزمية التوزيع الذكي للاستذكار
│   │   ├── courses/                 # أدوات المقررات المتقدمة
│   │   │   ├── prerequisite-graph.js# شجرة المتطلبات البصرية
│   │   │   ├── course-comparison.js # مصفوفة مقارنة المقررات
│   │   │   └── course-analytics.js  # إحصائيات المقررات والصعوبة
│   │   ├── community/               # التقييمات والمكتبة الشخصية
│   │   │   ├── reviews.js           # المراجعات ومنع التكرار
│   │   │   ├── library.js           # المفضلة والملاحظات الشخصية
│   │   │   └── gamification.js      # نقاط المساهمة والشارات
│   │   └── assistant/               # المساعد الأكاديمي المحلي
│   │       └── academic-assistant.js# معالجة النوايا والاسترجاع الآلي
│   ├── Favicon.png
│   └── website_logo.png
├── data/
│   └── academic-calendar.json       # التقويم الأكاديمي المعتمد
├── page/
│   └── all-colleges/
│       ├── all-colleges.html        # صفحة استعراض الكليات
│       ├── colleges-manifest.json   # فهرس المقررات الشامل
│       ├── theoretical/             # دليل كلية الدراسات النظرية (جديد)
│       │   └── theoretical.html     # صفحة الكلية وتخصصاتها الأربعة
│       ├── business/
│       └── health/
├── tests/
│   └── academic-platform.test.mjs   # حزمة الاختبارات الشاملة (11 اختبار)
├── tools/
│   └── academic_calendar_scraper.py # سكرابر التقويم وكاشف التغييرات
├── firestore.rules                  # قواعد أمان قاعدة بيانات Firestore
├── index.html                       # الصفحة الرئيسية المحدثة بالواجهة 2.0
├── manifest.json                    # إعدادات تطبيق الويب التقدمي PWA
├── package.json
├── styles.css                       # أنماط الواجهة والأنيميشن الزجاجي 2.0
└── sw.js                            # سيرفس وركر العمل دون اتصال
```

---

## 🛠️ التثبيت والتشغيل المحلي (Local Development)

### المتطلبات الأساسية
- Node.js (الإصدار 18 أو أحدث)
- Python (الإصدار 3.10 أو أحدث - لتشغيل سكرابر التقويم)

### خطوات التشغيل
1. استنساخ المستودع:
   ```bash
   git clone https://github.com/fxrg/subject-search-.git
   cd subject-search-
   ```

2. تثبيت الحزم:
   ```bash
   npm install
   ```

3. تشغيل خادم محلي:
   يمكنك استخدام أي خادم ويب ثابت، مثل `serve` أو إضافة Live Server في VS Code:
   ```bash
   npx serve .
   ```
   افتح المتصفح على العنوان: `http://localhost:3000`

---

## 🧪 تشغيل الاختبارات الآلية (Testing)

تم بناء جناح اختبارات شامل يغطي محرك البحث، مسافة ليفنشتاين، سلاسل المتطلبات، خوارزمية الجدولة، وسلامة ملفات JSON:

```bash
npm test
```

المخرجات المتوقعة:
```text
====================================================
🧪 Starting Subject Search 2.0 Test Suite
====================================================
  ✅ [PASS] Normalizes Arabic letters (alef, yaa, ta marbuta, tashkeel)
  ✅ [PASS] Expands academic synonyms (e.g. ذكاء اصطناعي -> machine learning)
  ✅ [PASS] Levenshtein distance calculation
  ✅ [PASS] Matches with typos (e.g., برمجية vs برمجة)
  ✅ [PASS] Detects absence of circular dependencies in valid catalog
  ✅ [PASS] Detects circular dependencies if mistakenly introduced
  ✅ [PASS] Evaluates student prerequisite status (completed, enrolled, available, blocked)
  ✅ [PASS] Generates study plan weighted by course difficulty and credits
  ✅ [PASS] Preserves completed tasks when regenerating schedule
  ✅ [PASS] Verified calendar JSON exists and conforms to specification
  ✅ [PASS] Theoretical Studies page and manifest contains required 4 majors
====================================================
📊 Test Summary: 11/11 Tests Passed successfully.
====================================================
```

---

## 🔒 الأمان وقواعد Firestore (Security Rules)

تخضع عمليات قاعدة البيانات لقواعد أمان صارمة ومحددة في [firestore.rules](firestore.rules):
- **حماية المراجعات**: منع كتابة أكثر من تقييم واحد للمقرر لنفس المستخدم، واشتراط المصادقة للمراجعات والتصويت.
- **بيانات المستخدمين**: لا يمكن لأي مستخدم تعديل ملف شخص آخر.
- **المقررات والتقويم**: صلاحية القراءة متاحة للجميع، وصلاحية التعديل للمشرفين المعتمدين فقط.
- **سرية المفاتيح**: خلو شفرة الواجهة من أي مفاتيح سرية خاصة أو صلاحيات إدارية غير محمية.

---

## 🚀 النشر على GitHub Pages (Deployment)

المشروع مصمم ليعمل كـ Single Page Application / Static Multi-Page Site متوافق 100% مع **GitHub Pages**:
1. يتم رفع الكود على فرع `main`.
2. من إعدادات المستودع في GitHub، اختر **Settings > Pages**.
3. حدد المصدر: **Deploy from a branch** واختر الفرع `main` والمجلد `/ (root)`.
4. الموقع يعمل مباشرة مع دعم الـ Service Worker والتخزين الدائم.

---

## 📄 الترخيص
تم تطوير المنصة بإشراف وتطوير طلاب الجامعة السعودية الإلكترونية لدعم زملائهم الطلاب ومساعدتهم في مسيرتهم الجامعية.
جميع الحقوق محفوظة © 2026 Subject Search 2.0.
