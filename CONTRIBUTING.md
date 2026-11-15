# دليل المساهمة في المنصة | Contributing to Subject Search 2.1

نرحب بمساهمات كافة طلاب وطالبات **جامعة الأمير مساعد بن عبدالرحمن (PMARU)** والمطورين في تطوير منصة **Subject Search 2.1**! سواء كنت ترغب في إضافة مقرر دراسي، تحديث خطة دراسية لتخصص جديد، إصلاح خطأ برمجي، أو تطوير ميزة جديدة، فإن هذا الدليل يوضح لك الخطوات بالتفصيل.

Welcome to **Subject Search 2.1**! We warmly welcome contributions from students, academic contributors, and open-source developers. This guide explains the project structure, local development workflow, how to add or update study plans, and Pull Request standards in both Arabic and English.

---

## 🏛️ 1. هيكل المشروع | Project Structure

```text
subject-search/
├── index.html                        # الصفحة الرئيسية (Landing Page) + العداد التنازلي للاختبارات
├── styles.css                        # نظام التصميم الموحد (Modern SaaS Dark/Light UI)
├── profile.html                      # صفحة الملف الشخصي وسجل مساهمات الطالب
├── leaderboard.html                  # لوحة شرف المتصدرين والمساهمين
├── admin.html                        # لوحة تحكم الإدارة العليا (Super Admin Dashboard)
├── firestore.rules                   # قواعد حماية قاعدة بيانات Firebase Firestore
├── assets/
│   ├── pmaru-core.js                 # المحرك الأساسي، حاسبة الفاينل، الصلاحيات، ومزامنة Firestore
│   ├── course-rating.js              # نظام تقييم المقررات ومراجعات الطلاب
│   └── js/                           # وحدات البحث الذكي (Fuzzy Search)، شجرة المتطلبات، والمخطط
├── data/
│   ├── study-plans.json              # الخطط الدراسية المعتمدة للكليات الأربع (المستويات 1-8)
│   ├── study-plans.js                # النسخة الفورية المجمعة للخطط الدراسية (0ms Latency)
│   ├── academic-calendar.json        # التقويم الأكاديمي الرسمي 1448هـ (2026-2027م)
│   ├── academic-calendar.js          # النسخة الفورية للتقويم الأكاديمي
│   └── real-courses-bundle.js        # حزمة المقررات الحقيقية والشروحات والمساهمين والتقييمات
├── page/
│   ├── all-colleges/                 # صفحات الكليات الأربع (الحوسبة، الصحية، الإدارية، النظرية)
│   ├── prereq-graph/prereq-graph.html# شجرة المتطلبات مزدوجة العرض (SVG Bezier Tree + Levels Grid)
│   ├── planner/planner.html          # المخطط الأكاديمي + حاسبة الفاينل + تصدير التقويم (.ics)
│   ├── compare/compare.html          # أداة مقارنة المقررات وحساب عبء الفصل الدراسي
│   ├── GPA/GPA.html                  # حاسبة المعدل التراكمي والفصلي
│   └── auth/auth.html                # بوابة المصادقة السحابية (Firebase Authentication)
├── tools/
│   ├── build_real_bundle.py          # سكربت بناء وتحديث حزمة المقررات والمساهمين
│   └── academic_calendar_scraper.py  # سكربت تحديث التقويم الأكاديمي الرسمي
└── tests/
    └── academic-platform.test.mjs    # اختبارات الوحدات والتكامل الآلية (Node Test Runner)
```

---

## 💻 2. تشغيل المشروع محلياً | Local Development Setup

### المتطلبات | Prerequisites
- **Node.js** `v18+` (لتشغيل الاختبارات الآلية وأدوات البناء)
- **Python** `3.9+` (اختياري — لتحديث حزم البيانات الساكنة `tools/*.py`)
- متصفح حديث (Chrome / Edge / Firefox / Safari)

### خطوات التشغيل | Quick Start Steps

```bash
# 1. استنساخ المستودع (Clone the repository)
git clone https://github.com/fxrg/subject-search-.git
cd subject-search-

# 2. تثبيت الحزم (Install dependencies)
npm install

# 3. تشغيل الاختبارات الآلية للتأكد من سلامة البنية (Run automated test suite)
npm test

# 4. تشغيل سيرفر محلي لمعاينة الموقع (Start a local static server)
npx serve . -l 3000
# أو باستخدام Python:
python -m http.server 3000
```
> **ملاحظة:** تم هندسة المنصة لتعمل أيضاً بشكل فوري عبر بروتوكول `file://` مباشرة دون الحاجة لإجبار المستخدم على تشغيل سيرفر محلي بفضل ملفات البيانات المجمعة في `data/*.js`.

---

## 📚 3. كيفية إضافة أو تحديث خطة دراسية لتخصص في `data/study-plans.json`
## How to Add or Update a Major Study Plan

إذا رغبت في إضافة تخصص جديد أو تحديث متطلبات تخصص حالي في إحدى الكليات الأربع:

1. افتح ملف `data/study-plans.json`.
2. ابحث عن الكلية المستهدفة داخل مصفوفة `colleges` (`computing`, `health`, `business`, `theoretical`).
3. أضف أو عدّل كائن التخصص داخل مصفوفة `majors` وفق الهيكل القياسي التالي:

```json
{
  "id": "cyber",
  "nameAr": "الأمن السيبراني",
  "nameEn": "Cybersecurity",
  "totalCredits": 130,
  "levels": {
    "1": [
      {
        "code": "ENG001",
        "nameAr": "مهارات اللغة الإنجليزية 1",
        "nameEn": "English Language Skills 1",
        "credits": 8,
        "prerequisites": []
      }
    ],
    "3": [
      {
        "code": "CS230",
        "nameAr": "البرمجة الشيئية",
        "nameEn": "Object-Oriented Programming",
        "credits": 3,
        "prerequisites": ["CS001"]
      }
    ]
  }
}
```

4. **تأكد من عدم وجود حلقات مغلقة (Circular Dependencies):** لا يجوز أن يعتمد مقرر `A` على `B` بينما يعتمد `B` على `A`.
5. حدّث ملف `data/study-plans.js` ليطابق `data/study-plans.json`، ثم شغّل `npm test` للتحقق الآلي من خلو الشجرة من أي أخطاء.

---

## ✅ 4. شروط فتح طلبات الدمج | Pull Request Guidelines

قبل فتح أي **Pull Request (PR)**، يرجى الالتزام بالقواعد التالية:
1. **فرع مستقل (Feature Branch):** أنشئ فرعاً جديداً باسم واضح مثل `feat/add-law-courses` أو `fix/prereq-graph-zoom`.
2. **اجتياز الاختبارات (`npm test`):** يجب أن تنجح جميع الاختبارات في `tests/academic-platform.test.mjs` بنسبة 100%.
3. **الحفاظ على الهوية البصرية:** التزم بمتغيرات الألوان والخطوط المعرفة في `styles.css` وتأكد من توافق التعديل مع الوضع الليلي (Dark Mode) والنهاري (Light Mode) واللغتين العربية والإنجليزية.
4. **عدم كسر الروابط أو البيانات السحابية:** لا تحذف أي مقررات أو شروحات أو تقييمات طلابية مسجلة، ولا تغير أسماء مجموعات Firestore المعتمدة (`userCourses`, `health_courses`, `course_ratings`, `contributions`).
5. **تعبئة قالب الـ PR:** املأ قائمة التحقق في `.github/PULL_REQUEST_TEMPLATE.md` وأرفق لقطة شاشة (Screenshot) إذا كان التعديل يشمل واجهة المستخدم.
