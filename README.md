<div align="center">

# 🎓 Subject Search 2.1 — جامعة الأمير مساعد بن عبدالرحمن
### Your Complete Academic Journey, One Intelligent Platform.
### رحلتك الجامعية الكاملة في منصة أكاديمية ذكية واحدة

[![Version](https://img.shields.io/badge/Version-2.1.0-0EA5E9?style=for-the-badge&logo=semantic-release&logoColor=white)](https://github.com/fxrg/subject-search-)
[![License: MIT](https://img.shields.io/badge/License-MIT-10B981?style=for-the-badge&logo=opensourceinitiative&logoColor=white)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-Welcome-F59E0B?style=for-the-badge&logo=github&logoColor=white)](CONTRIBUTING.md)
[![Live Demo](https://img.shields.io/badge/Live_Demo-GitHub_Pages-38BDF8?style=for-the-badge&logo=githubpages&logoColor=white)](https://fxrg.github.io/subject-search-/)
[![Firebase](https://img.shields.io/badge/Cloud-Firebase_Auth_%26_Firestore-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)](https://firebase.google.com/)

[**🌐 تصفح المنصة المباشرة (Live Demo)**](https://fxrg.github.io/subject-search-/) • [**📖 دليل المساهمة (Contributing)**](CONTRIBUTING.md) • [**🐛 الإبلاغ عن مشكلة (Report Bug)**](.github/ISSUE_TEMPLATE/bug_report.yml) • [**📚 تحديث خطة دراسية**](.github/ISSUE_TEMPLATE/study_plan_update.yml)

</div>

---

## 🌟 نبذة عن المنصة | Overview

**Subject Search 2.1** هي المنصة الأكاديمية المفتوحة المصدر لطلاب وطالبات **جامعة الأمير مساعد بن عبدالرحمن (PMARU)**. تطورت المنصة من محرك بحث عن المقررات إلى منظومة إدارة أكاديمية شاملة تجمع بين:
- مستودع موثق لأكثر من **108 مقررات دراسية** موزعة على **4 كليات و13 تخصصاً جامعياً معتمداً**.
- **شجرة متطلبات تفاعلية مزدوجة العرض (Dual-View Prerequisite DAG)** تدعم الرسم البياني بمنحنيات SVG التفاعلية وإضاءة المسارات (Path Highlighting) إلى جانب عرض المستويات (1 إلى 8).
- **المخطط الأكاديمي الذكي وحاسبة درجة الفاينل (Final Exam Target Calculator)** مع تصدير جدول المذاكرة ومواعيد الاختبارات بصيغة `.ics` لتقويم الجوال ومشاركة الخطة عبر رابط مباشر مشفر (`Base64 URL Params`).
- **نظام مساهمة طلابية حي عبر Firebase Auth & Firestore** يوثق اسم كل طالب مساهم على بطاقة المقرر (`أضيفت بواسطة`) وفي **لوحة شرف المتصدرين (`leaderboard.html`)**.

---

## 🚀 أبرز مميزات الإصدار 2.1 | Key Features in v2.1

| الميزة الأكاديمية (Feature) | الوصف التقني والطلابي (Description) | المسار (Page) |
| :--- | :--- | :--- |
| **🌳 شجرة متطلبات مزدوجة العرض (Dual-View DAG)** | تبديل فوري بين **عرض الشجرة التفاعلية (SVG Bezier Nodes & Edges)** مع سحب وتكبير وإضاءة ذكية للمتطلبات السابقة (بالأزرق) والمواد اللاحقة (بالذهبي)، و**عرض المستويات (1-8)**. | [`page/prereq-graph/prereq-graph.html`](page/prereq-graph/prereq-graph.html) |
| **🎯 حاسبة الدرجة المطلوبة في الفاينل** | أداة تفاعلية مدمجة في المخطط ونافذة كل مقرر تحسب الدرجة الدقيقة المطلوبة في الاختبار النهائي لتحقيق كل تقدير (`A+`, `A`, `B+`, `B`, `D`) مع تنبيه ذكي عند تجاوز سقف الفاينل. | [`page/planner/planner.html`](page/planner/planner.html) |
| **📅 تصدير جدول المذاكرة والاختبارات (`.ics`)** | توليد ملف تقويم قياسي (`.ics`) يتضمن جلسات المذاكرة الأسبوعية ومواعيد الاختبارات الرسمية لعام 1448هـ لإضافتها فوراً إلى **Apple Calendar** و**Google Calendar**. | [`page/planner/planner.html`](page/planner/planner.html) |
| **🔗 مشاركة الخطة كرابط مباشر (Shareable Plan URL)** | تشفير حالة مواد الطالب وتخصصه ودرجاته في رابط `Base64 URL Params` (`?plan=...`) لمشاركته مع الزملاء أو المرشد الأكاديمي بدون الحاجة لقاعدة بيانات. | [`prereq-graph.html`](page/prereq-graph/prereq-graph.html) & [`planner.html`](page/planner/planner.html) |
| **🏆 لوحة شرف المتصدرين وتوثيق المساهمين** | توثيق اسم الطالب على كل مقرر (`أضيفت بواسطة: ...`) وترتيب تنازلي لأبرز المساهمين مع أوسمة التميز في صفحة المتصدرين. | [`leaderboard.html`](leaderboard.html) |
| **👤 الملف الشخصي وصلاحيات الأدوار** | صفحة بروفايل متكاملة لتحديث الاسم وكلمة المرور عبر Firebase، مع إتاحة تعديل وإضافة الشروحات لجميع المسجلين، وحصر صلاحية الحذف النهائي بحساب الأدمن فقط. | [`profile.html`](profile.html) & [`admin.html`](admin.html) |
| **⚖️ مقارنة المقررات وحاسبة العبء الفصلي** | مقارنة تفصيلية بين المقررات من حيث مستوى الصعوبة، التقييمات، الساعات، وطبيعة المقرر (عملي/نظري). | [`page/compare/compare.html`](page/compare/compare.html) |

---

## 🏛️ الكليات والتخصصات المغطاة | Covered Colleges & Majors

1. **💻 كلية الحوسبة والمعلوماتية (`computing`):**
   - علوم الحاسب (CS) • تقنية المعلومات (IT) • علوم البيانات (DS) • المواد العامة والرياضيات.
2. **🩺 كلية العلوم الصحية (`health`):**
   - الصحة العامة (Public Health) • المعلوماتية الصحية (Health Informatics).
3. **📊 كلية العلوم الإدارية والمالية (`business`):**
   - المالية (FIN) • المحاسبة (ACCT) • إدارة الأعمال (MGT) • التجارة الإلكترونية (ECOM).
4. **⚖️ كلية الدراسات النظرية (`theoretical`):**
   - القانون (LAW) • الإعلام الرقمي (MED) • اللغات والترجمة (TRN) • الإحصاء التطبيقي وتحليل البيانات.

---

## 🛠️ التشغيل المحلي والاختبارات | Local Setup & Testing

```bash
# 1. استنساخ المستودع
git clone https://github.com/fxrg/subject-search-.git
cd subject-search-

# 2. تثبيت الاعتماديات
npm install

# 3. تشغيل حزمة الاختبارات الآلية (11/11 Tests)
npm test

# 4. تشغيل السيرفر المحلي
npx serve . -l 3000
```

---

## 🤝 المساهمة في المشروع | Contributing & Open Source Governance

نرحب بمساهمات جميع الطلاب والمطورين! يرجى الاطلاع على ملفات الحوكمة الخاصة بالمستودع:
- 📖 [**دليل المساهمة الشامل (`CONTRIBUTING.md`)**](CONTRIBUTING.md): شرح هيكل المشروع وطريقة إضافة تخصص أو خطة دراسية في `data/study-plans.json`.
- 🤝 [**ميثاق سلوك المساهمين (`CODE_OF_CONDUCT.md`)**](CODE_OF_CONDUCT.md): معايير التعاون الأكاديمي والبرمجي.
- 🔒 [**سياسة الأمان وحماية البيانات (`SECURITY.md`)**](SECURITY.md): قواعد أمان Firebase وكيفية الإبلاغ عن الثغرات.

### 🌟 أبرز المساهمين في إثراء المحتوى الأكاديمي | Top Contributors
- **تركي ناصر المطيري (Turki Nasser Almutairi)** — *مؤسس المنصة والمشرف العام (كلية الحوسبة والمعلوماتية)*
- **Fatemah rabea** — *مساهمة متميزة في مقررات وشروحات كلية الحوسبة والمعلوماتية*
- **عبدالله الشهري** — *مساهم متميز في مقررات وشروحات كلية العلوم الصحية*
- **مبادرة طلاب وطالبات الكليات الأربع** — *إثراء مستمر للتجميعات والشروحات والتقييمات*

---

## 📄 الرخصة | License

هذا المشروع مرخص بموجب رخصة [**MIT License**](LICENSE) — حقوق النشر © 2026 **Turki Nasser Almutairi (تركي ناصر المطيري)**.
