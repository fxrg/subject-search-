/*
 * Language Toggle Script (Enhanced)
 *
 * Site-wide Arabic/English translation with automatic element scanning.
 * - Defaults to English (LTR) unless user previously chose Arabic
 * - Applies dir/language attributes and body class
 * - Translates textContent, placeholders, titles, aria-labels via data-i18n
 *   and best-effort heuristics for elements without data-i18n
 * - Works on all pages that include this script
 */

(() => {
  // Inject dir-aware CSS to ensure layout direction matches selected language
  try {
    const style = document.createElement('style');
    style.setAttribute('data-i18n-dir-style', '');
    style.textContent = `
      html[dir="ltr"] body { direction: ltr !important; text-align: left !important; }
      html[dir="ltr"] input, html[dir="ltr"] textarea { direction: ltr !important; text-align: left !important; }
      html[dir="ltr"] select { direction: ltr !important; text-align: left !important; }
      html[dir="ltr"] .hero-search { padding-left: 3rem !important; padding-right: 1rem !important; }
      html[dir="ltr"] .hero-search + .fa-search, html[dir="ltr"] .hero-section .fa-search { left: 1.5rem !important; right: auto !important; }
      html[dir="ltr"] .search-icon { left: 1rem !important; right: auto !important; margin-left: 0 !important; margin-right: 1rem !important; }
      html[dir="ltr"] .fa-arrow-left { transform: rotate(180deg) !important; }
      html[dir="ltr"] .fa-angles-left { transform: rotate(180deg) !important; }
      html[dir="ltr"] .fa-chevron-left { transform: rotate(180deg) !important; }
      html[dir="ltr"] .ml-1, html[dir="ltr"] .ml-2, html[dir="ltr"] .ml-3, html[dir="ltr"] .ml-4 { margin-left: 0 !important; margin-right: 0.25rem !important; }
      html[dir="ltr"] .mr-1, html[dir="ltr"] .mr-2, html[dir="ltr"] .mr-3, html[dir="ltr"] .mr-4 { margin-right: 0 !important; margin-left: 0.25rem !important; }
      html[dir="ltr"] .space-x-reverse > :not([hidden]) ~ :not([hidden]) { --tw-space-x-reverse: 0 !important; }
      html[dir="ltr"] .text-right { text-align: left !important; }
      html[dir="ltr"] .justify-end { justify-content: flex-start !important; }
      html[dir="ltr"] nav a, html[dir="ltr"] .nav-link { text-align: left !important; }
      html[dir="ltr"] .flex-row-reverse { flex-direction: row !important; }
      html[dir="ltr"] header .flex.justify-between { flex-direction: row !important; }
      html[dir="ltr"] .pr-4, html[dir="ltr"] .pr-6, html[dir="ltr"] .pr-12 { padding-right: 0 !important; padding-left: inherit !important; }
      html[dir="ltr"] .pl-4, html[dir="ltr"] .pl-6, html[dir="ltr"] .pl-12 { padding-left: 0 !important; padding-right: inherit !important; }
      html[dir="ltr"] .right-6 { right: auto !important; left: 1.5rem !important; }
      html[dir="ltr"] .left-0 { left: auto !important; right: 0 !important; }
      html[dir="ltr"] .-right-10 { right: auto !important; left: -2.5rem !important; }
      html[dir="ltr"] .-left-20 { left: auto !important; right: -5rem !important; }
      html[dir="ltr"] footer, html[dir="ltr"] .footer { text-align: left !important; }
      html[dir="ltr"] ul, html[dir="ltr"] ol { padding-left: 1.5rem !important; padding-right: 0 !important; }
      
      html[dir="rtl"] body { direction: rtl !important; text-align: right !important; }
      html[dir="rtl"] input, html[dir="rtl"] textarea { direction: rtl !important; text-align: right !important; }
      html[dir="rtl"] select { direction: rtl !important; text-align: right !important; }
    `;
    document.head.appendChild(style);
  } catch(_) {}
  const translations = {
    ar: {
      siteTitle: 'جامعة الأمير مساعد بن عبدالرحمن - بحث المواد والمقررات الدراسية | Subject Search 2.0',
      searchPlaceholder: 'ابحث عن مادة أو رقم مقرر...',
      heroSearchPlaceholder: 'ابحث عن المواد الدراسية...',
      // Common placeholders/labels used across pages (Arabic originals)
      searchCourseCodeExample: 'ابحث عن المقررات بالكود (مثل CS 230)...',
      searchByCodeOrName: 'ابحث عن المقررات بالكود أو الاسم...',
      exampleCodes: 'مثال: CS123, DS456, IT789',
      exampleCodesHealth: 'مثال: PH101, HI240, MED350',
      exampleCodesBusiness: 'مثال: BUS101, ACC240, MKT350',
      exampleCourseName: 'مثال: البرمجة الشيئية',
      exampleCourseNameBusiness: 'مثال: مبادئ الإدارة',
      courseDescriptionLongPlaceholder: 'وصف مختصر عن محتوى المادة وأهدافها ومواضيعها الأساسية...',
      courseDescriptionPlaceholder: 'وصف مختصر عن محتوى المادة وأهدافها',
      courseDescriptionShort: 'وصف مختصر للمادة',
      exampleCourseCodeSimple: 'CS101',
      resourceTitle: 'عنوان المصدر',
      urlPlaceholder: 'https://...',
      backAllColleges: 'العودة لجميع الكليات',
      addNewCourse: 'إضافة مادة جديدة',
      searchResults: 'نتائج البحث:',
      clearSearch: 'مسح البحث',
      darkLightMode: 'الوضع المظلم/الفاتح',
      businessAdmin: 'إدارة الأعمال',
      accounting: 'المحاسبة',
      financialManagement: 'الإدارة المالية',
      eCommerce: 'التجارة الإلكترونية',
      businessTagline: 'استكشف مواد تخصصات إدارة الأعمال، المحاسبة، الإدارة المالية، والتجارة الإلكترونية',
      itDescription: 'تركز على إدارة واستخدام تكنولوجيا المعلومات في الشركات والمؤسسات. تشمل مجالات مثل الشبكات، إدارة الأنظمة، أمن المعلومات، ودعم تكنولوجيا المعلومات.',
      enterEmail: 'أدخل بريدك الإلكتروني',
      enterPassword: 'أدخل كلمة المرور',
      enterPasswordMin: 'أدخل كلمة المرور (6 أحرف على الأقل)',
      enterName: 'أدخل اسمك',
      enterFullName: 'أدخل اسمك الكامل',
      enterFullName3: 'أدخل اسمك الثلاثي كاملاً',
      courseNamePlaceholder: 'اسم المادة',
      emailLabel: 'البريد الإلكتروني',
      passwordLabel: 'كلمة المرور',
      usernameLabel: 'اسم المستخدم',
      enterEmailOrUsername: 'أدخل بريدك الإلكتروني أو اسم المستخدم',
      chooseUniqueUsername: 'اختر اسم مستخدم مميز وفريد',
      chooseStrongPassword: 'اختر كلمة مرور قوية وآمنة',
      retypePassword: 'أعد كتابة كلمة المرور',
      mobileToggleToEnglish: 'التبديل للإنجليزية',
      toggleShortAr: 'ع',
      toggleShortEn: 'EN',
      myAccount: 'حسابي',
      login: 'تسجيل الدخول',
      register: 'إنشاء حساب',
      backToMain: 'العودة للرئيسية',
      mainPage: 'الرئيسية',
      home: 'الرئيسية',
      allColleges: 'جميع الكليات',
      computerScience: 'علوم الحاسب',
      informationTechnology: 'تقنية المعلومات',
      dataScience: 'علوم البيانات',
      addCourse: 'إضافة مادة',
      courses: 'المواد',
      resources: 'الموارد',
      description: 'الوصف',
      major: 'التخصص',
      level: 'المستوى',
      credits: 'الساعات',
      seeAll: 'عرض الكل',
      localCourses: 'المواد المحلية',
      firebaseCourses: 'مواد قاعدة البيانات',
      blogs: 'المدونة',
      totalContributions: 'إجمالي المساهمات',
      academicMaterials: 'نظام المواد الأكاديمية',
      collegeComputing: 'كلية الحوسبة',
      universityPlatform: 'منصة شاملة لجميع كليات الجامعة',
      businessCollege: 'كلية العلوم الإدارية والمالية',
      healthCollege: 'كلية الصحة',
      computing: 'الحوسبة',
      business: 'الأعمال',
      health: 'الصحة',
      searchCourses: 'البحث عن المواد',
      noResourcesAvailable: 'لا تتوفر موارد لهذه المادة حالياً',
      courseNotFound: 'المادة غير موجودة في النظام',
      languageText: 'العربية',
      mobileLanguageText: 'العربية / English',
      shareCourse: 'مشاركة المادة',
      courseDetails: 'تفاصيل المادة',
      courseMaterials: 'مواد المقرر',
      downloadCurriculum: 'تحميل المنهج',
      educationalResources: 'الموارد التعليمية',
      additionalMaterials: 'مواد إضافية',
      recommendedBook: 'كتاب مقرر موصى به',
      interactiveLearning: 'منصة التعلم التفاعلية',
      shareWith: 'مشاركة المادة',
      qrCodeAccess: 'كود QR للوصول السريع',
      scanCode: 'امسح الكود للوصول المباشر للمادة',
      directLink: 'الرابط المباشر للمادة',
      websiteLink: 'رابط الموقع مع تحديد المادة',
      copy: 'نسخ',
      copied: 'تم النسخ!',
      shareSocial: 'مشاركة عبر وسائل التواصل',
      whatsapp: 'واتساب',
      telegram: 'تيليجرام',
      twitter: 'تويتر',
      facebook: 'فيسبوك',
      watchOnYouTube: 'مشاهدة على يوتيوب',
      openChat: 'فتح المحادثة',
      enterCourse: 'دخول المقرر',
      openFiles: 'فتح الملفات',
      download: 'تحميل',
      educationalContent: 'محتوى تعليمي',
      recordedLectures: 'محاضرات مسجلة',
      educationalFiles: 'ملفات تعليمية',
      compressedFiles: 'ملفات مضغوطة',
      educationalResource: 'مورد تعليمي',
      blackBoard: 'بلاك بورد',
      googleDrive: 'جوجل درايف',
      mega: 'ميجا',
      viewAllCourses: 'عرض جميع المواد',
      exploreCourse: 'استكشاف المادة',
      bachelor: 'بكالوريوس',
      bestCollege: 'أفضل كلية',
      bestCollegeDesc: 'كلية الحوسبة توفر مزيجًا من التعليم الأكاديمي المتخصص والخبرة العملية التي تؤهل الطلاب لمواكبة التطورات السريعة في صناعة التكنولوجيا.',
      whyUs: 'لماذا تختارنا',
      learnMore: 'تعرف أكثر',
      dsDescription: 'مجال يركز على تحليل البيانات واستخلاص الأنماط والمعلومات المفيدة منها باستخدام تقنيات مثل التعلم الآلي والإحصاء، بهدف دعم اتخاذ القرارات وتحقيق رؤى استراتيجية.',
      // Hero Section
      seuBadge: 'جامعة الأمير مساعد بن عبدالرحمن',
      heroTitle: 'نظام المواد الأكاديمية الشامل',
      heroDesc: 'منصة متكاملة للوصول إلى جميع المواد والمقررات الدراسية لكليات الجامعة مع موارد تعليمية شاملة',
      searchBtn: 'بحث',
      searchFilters: 'فلاتر البحث',
      browseColleges: 'تصفح الكليات',
      learnMoreBtn: 'تعرف أكثر',
      // Filter Section
      allMajors: 'جميع التخصصات',
      generalCourses: 'مواد عامة',
      allLevels: 'جميع المستويات',
      levelNum: 'المستوى',
      allHours: 'جميع الساعات',
      twoHours: 'ساعتان',
      threeHours: '3 ساعات',
      fourHours: '4 ساعات',
      applyFilters: 'تطبيق الفلاتر',
      clearFilters: 'مسح الفلاتر',
      // Stats Section
      statCourses: 'مادة دراسية',
      statStudents: 'طالب وطالبة',
      statColleges: 'كليات',
      statSuccess: 'معدل النجاح',
      coursesCount: 'مادة دراسية',
      studentsCount: 'طالب وطالبة',
      collegesCount: 'كليات',
      successRate: 'معدل النجاح',
      // Colleges Section
      collegesBadge: 'الكليات',
      collegesTitle: 'اكتشف كليات الجامعة',
      collegesDesc: 'اختر الكلية المناسبة لك واستكشف جميع المواد والتخصصات المتاحة',
      collegeBusiness: 'كلية العلوم الإدارية والمالية',
      collegeHealth: 'كلية العلوم الصحية',
      majorCS: 'علوم الحاسب',
      majorDS: 'علوم البيانات',
      majorIT: 'تقنية المعلومات',
      majorBusiness: 'إدارة الأعمال',
      majorAccounting: 'المحاسبة',
      majorFinance: 'المالية',
      majorEcommerce: 'التجارة الإلكترونية',
      majorPublicHealth: 'الصحة العامة',
      majorHealthInfo: 'المعلوماتية الصحية',
      collegesSectionTitle: 'الكليات',
      discoverColleges: 'اكتشف كليات الجامعة',
      chooseCollegeDesc: 'اختر الكلية المناسبة لك واستكشف جميع المواد والتخصصات المتاحة',
      computingInformatics: 'كلية الحوسبة والمعلوماتية',
      businessFinance: 'كلية العلوم الإدارية والمالية',
      healthSciences: 'كلية العلوم الصحية',
      exploreCollege: 'استكشف الكلية',
      publicHealth: 'الصحة العامة',
      healthInformatics: 'المعلوماتية الصحية',
      // Features Section
      featuresBadge: 'المميزات',
      featuresTitle: 'لماذا تختار منصتنا؟',
      featureAdvanced: 'بحث متقدم',
      featureAdvancedDesc: 'ابحث عن المواد بسهولة حسب الكلية، التخصص، أو المستوى الدراسي',
      featureResources: 'موارد تعليمية',
      featureResourcesDesc: 'احصل على جميع الموارد والمراجع الخاصة بكل مادة دراسية',
      featureUpdates: 'تحديثات مستمرة',
      featureUpdatesDesc: 'نحدث المحتوى بشكل دوري لضمان دقة المعلومات',
      whyChoosePlatform: 'لماذا تختار منصتنا؟',
      advancedSearch: 'بحث متقدم',
      advancedSearchDesc: 'ابحث عن المواد بسهولة حسب الكلية، التخصص، أو المستوى الدراسي',
      educationalResourcesTitle: 'موارد تعليمية',
      educationalResourcesDesc: 'احصل على جميع الموارد والمراجع الخاصة بكل مادة دراسية',
      continuousUpdates: 'تحديثات مستمرة',
      continuousUpdatesDesc: 'نحدث المحتوى بشكل دوري لضمان دقة المعلومات',
      // CTA Section
      ctaTitle: 'ابدأ رحلتك الأكاديمية اليوم',
      ctaDesc: 'انضم إلى آلاف الطلاب واستفد من منصتنا الشاملة للمواد الأكاديمية',
      ctaButton: 'ابدأ الآن',
      startJourney: 'ابدأ رحلتك الأكاديمية اليوم',
      startJourneyDesc: 'انضم إلى آلاف الطلاب واستفد من منصتنا الشاملة للمواد الأكاديمية',
      startNow: 'ابدأ الآن',
      // Course Sections
      csDescription: 'مجال عام يتضمن العديد من التخصصات مثل الخوارزميات، الذكاء الاصطناعي، نظم التشغيل، هندسة البرمجيات، والشبكات. يتميز بتوسعه الواسع الذي يشمل تطبيقات متنوعة في مختلف المجالات.',
      oop: 'البرمجة الشيئية',
      oopDesc: 'مفاهيم البرمجة الشيئية باستخدام الجافا بما في ذلك الفئات، الكائنات، الوراثة، وتعدد الأشكال.',
      digitalLogic: 'تصميم المنطق الرقمي',
      digitalLogicDesc: 'مقدمة في تصميم الدوائر الرقمية والبوابات المنطقية وتصميم المعالجات.',
      dataStructures: 'هياكل البيانات',
      dataStructuresDesc: 'دراسة هياكل البيانات الأساسية والخوارزميات لتنظيم ومعالجة البيانات بكفاءة.',
      dsProgramming: 'برمجة علوم البيانات',
      dsProgrammingDesc: 'مقدمة في برمجة علوم البيانات باستخدام بايثون ومكتباتها الأساسية.',
      dsDataStructures: 'هياكل البيانات المتقدمة والخوارزميات اللازمة لمعالجة البيانات الضخمة.',
      itIntro: 'مقدمة في تقنية المعلومات',
      itIntroDesc: 'مقدمة في مفاهيم تقنية المعلومات وأنظمة المعلومات الأساسية.',
      itOop: 'البرمجة الشيئية',
      itOopDesc: 'مفاهيم البرمجة الشيئية باستخدام الجافا في سياق تقنية المعلومات.',
      computerOrg: 'تنظيم الحاسب',
      computerOrgDesc: 'مقدمة في تنظيم الحاسب وهندسة المعمارية وأنظمة التشغيل.',
      // FAQ Section
      faqTitle: 'الأسئلة الشائعة',
      faqSubtitle: 'إجابات للأسئلة الأكثر شيوعاً',
      faq1Title: 'كيف أضيف مادة لم أجدها في النظام؟',
      faq1Answer: 'لإضافة مادة جديدة للمنصة:',
      faq2Title: 'كيف أحذف حسابي؟',
      faq2Answer: 'لحذف حسابك نهائياً:',
      faq3Title: 'كيف أبلّغ عن خطأ في المحتوى؟',
      faq3Answer: 'إذا وجدت خطأ في معلومات مادة أو محتوى غير صحيح:',
      faq4Title: 'هل المنصة تابعة رسمياً للجامعة السعودية الإلكترونية؟',
      faq4Answer: 'لا، هذه المنصة غير رسمية.',
      addCourseDesc: 'أضف مادة لم تجدها في النظام',
      haveQuestion: 'لديك سؤال آخر؟',
      contactUsDesc: 'تواصل معنا وسنكون سعداء بمساعدتك',
      emailUs: 'راسلنا',
      // Footer
      programs: 'البرامج',
      resourcesFooter: 'الموارد',
      bestCollegeStudents: 'طلاب افضل كلية',
      aboutUs: 'من نحن',
      privacyPolicy: 'سياسة الخصوصية',
      collegeGroup: 'قروب الكلية',
      telegramGroup: 'قروب الكلية على تلجرام',
      footerDesc: 'تمكين الجيل القادم من مبتكري التكنولوجيا من خلال التميز في التعليم والبحث.',
      allRightsReserved: '© 2025 subject search. جميع الحقوق محفوظة.',
      // User Auth
      loggedIn: 'مسجل الدخول',
      logout: 'تسجيل الخروج',
      adminPanel: 'لوحة الإدارة',
      colleges: 'الكليات',
      // Course Modal
      courseDescription: 'وصف المادة',
      // National Day
      nationalDay: 'اليوم الوطني السعودي',
      nationalDaySubtitle: 'عزّنا بطبعنا — كل عام ووطنا بخير 🇸🇦',
      exploreCollegeMaterials: 'استكشف مواد الكلية',
      september23: '23 سبتمبر'
    },
    en: {
      siteTitle: 'Prince Musaid bin Abdulrahman University – Course & Subject Search 2.0',
      searchPlaceholder: 'Search for a course or subject code…',
      heroSearchPlaceholder: 'Search for courses...',
      // Common placeholders/labels used across pages (English equivalents)
      searchCourseCodeExample: 'Search courses by code (e.g., CS 230)…',
      searchByCodeOrName: 'Search courses by code or name…',
      exampleCodes: 'Example: CS123, DS456, IT789',
      exampleCodesHealth: 'Example: PH101, HI240, MED350',
      exampleCodesBusiness: 'Example: BUS101, ACC240, MKT350',
      exampleCourseName: 'Example: Object-Oriented Programming',
      exampleCourseNameBusiness: 'Example: Principles of Management',
      courseDescriptionLongPlaceholder: 'A short description of the course content, objectives, and main topics…',
      courseDescriptionPlaceholder: 'Brief description of course content and objectives',
      courseDescriptionShort: 'Short course description',
      exampleCourseCodeSimple: 'CS101',
      resourceTitle: 'Resource Title',
      urlPlaceholder: 'https://...',
      backAllColleges: 'Back to All Colleges',
      addNewCourse: 'Add New Course',
      searchResults: 'Search Results:',
      clearSearch: 'Clear Search',
      darkLightMode: 'Dark/Light Mode',
      businessAdmin: 'Business Administration',
      accounting: 'Accounting',
      financialManagement: 'Financial Management',
      eCommerce: 'E-Commerce',
      businessTagline: 'Explore courses in Business Administration, Accounting, Financial Management, and E-Commerce',
      itDescription: 'Focuses on managing and using information technology in companies and organizations. Includes areas such as networking, systems administration, information security, and IT support.',
      enterEmail: 'Enter your email',
      enterPassword: 'Enter your password',
      enterPasswordMin: 'Enter password (at least 6 characters)',
      enterName: 'Enter your name',
      enterFullName: 'Enter your full name',
      enterFullName3: 'Enter your full name (3 parts)',
      courseNamePlaceholder: 'Course name',
      emailLabel: 'Email',
      passwordLabel: 'Password',
      usernameLabel: 'Username',
      enterEmailOrUsername: 'Enter your email or username',
      chooseUniqueUsername: 'Choose a unique username',
      chooseStrongPassword: 'Choose a strong and secure password',
      retypePassword: 'Re-type your password',
      mobileToggleToEnglish: 'Switch to English',
      toggleShortAr: 'AR',
      toggleShortEn: 'EN',
      myAccount: 'My Account',
      login: 'Login',
      register: 'Register',
      backToMain: 'Back to Main',
      mainPage: 'Home',
      home: 'Home',
      allColleges: 'All Colleges',
      computerScience: 'Computer Science',
      informationTechnology: 'Information Technology',
      dataScience: 'Data Science',
      addCourse: 'Add Course',
      courses: 'Courses',
      resources: 'Resources',
      description: 'Description',
      major: 'Major',
      level: 'Level',
      credits: 'Credits',
      seeAll: 'See All',
      localCourses: 'Local Courses',
      firebaseCourses: 'Database Courses',
      blogs: 'Blogs',
      totalContributions: 'Total Contributions',
      academicMaterials: 'Academic Materials System',
      collegeComputing: 'Computing College',
      universityPlatform: 'Comprehensive platform for all university colleges',
      businessCollege: 'Business & Finance College',
      healthCollege: 'Health College',
      computing: 'Computing',
      business: 'Business',
      health: 'Health',
      searchCourses: 'Search Courses',
      noResourcesAvailable: 'No resources available for this course currently',
      courseNotFound: 'Course not found in the system',
      languageText: 'English',
      mobileLanguageText: 'English / العربية',
      shareCourse: 'Share Course',
      courseDetails: 'Course Details',
      courseMaterials: 'Course Materials',
      downloadCurriculum: 'Download Curriculum',
      educationalResources: 'Educational Resources',
      additionalMaterials: 'Additional Materials',
      recommendedBook: 'Recommended Course Book',
      interactiveLearning: 'Interactive Learning Platform',
      shareWith: 'Share Course',
      qrCodeAccess: 'QR Code for Quick Access',
      scanCode: 'Scan code for direct access to course',
      directLink: 'Direct Course Link',
      websiteLink: 'Website Link with Course Selection',
      copy: 'Copy',
      copied: 'Copied!',
      shareSocial: 'Share via Social Media',
      whatsapp: 'WhatsApp',
      telegram: 'Telegram',
      twitter: 'Twitter',
      facebook: 'Facebook',
      watchOnYouTube: 'Watch on YouTube',
      openChat: 'Open Chat',
      enterCourse: 'Enter Course',
      openFiles: 'Open Files',
      download: 'Download',
      educationalContent: 'Educational Content',
      recordedLectures: 'Recorded Lectures',
      educationalFiles: 'Educational Files',
      compressedFiles: 'Compressed Files',
      educationalResource: 'Educational Resource',
      blackBoard: 'BlackBoard',
      googleDrive: 'Google Drive',
      mega: 'Mega',
      viewAllCourses: 'View All Courses',
      exploreCourse: 'Explore Course',
      bachelor: 'Bachelor',
      bestCollege: 'Best College',
      bestCollegeDesc: 'The Computing College offers a blend of specialized academic education and practical experience that prepares students to keep pace with rapid developments in the tech industry.',
      whyUs: 'Why choose us',
      learnMore: 'Learn more',
      dsDescription: 'A field focused on analyzing data and extracting useful patterns and insights using techniques like machine learning and statistics, aiming to support decision-making and achieve strategic insights.',
      // Hero Section
      seuBadge: 'Prince Musaid bin Abdulrahman University',
      heroTitle: 'Comprehensive Academic Materials System',
      heroDesc: 'An integrated platform to access all courses and academic materials for university colleges with comprehensive educational resources',
      searchBtn: 'Search',
      searchFilters: 'Search Filters',
      browseColleges: 'Browse Colleges',
      learnMoreBtn: 'Learn More',
      // Filter Section
      allMajors: 'All Majors',
      generalCourses: 'General Courses',
      allLevels: 'All Levels',
      levelNum: 'Level',
      allHours: 'All Hours',
      twoHours: '2 hours',
      threeHours: '3 hours',
      fourHours: '4 hours',
      applyFilters: 'Apply Filters',
      clearFilters: 'Clear Filters',
      // Stats Section
      statCourses: 'Courses',
      statStudents: 'Students',
      statColleges: 'Colleges',
      statSuccess: 'Success Rate',
      coursesCount: 'Courses',
      studentsCount: 'Students',
      collegesCount: 'Colleges',
      successRate: 'Success Rate',
      // Colleges Section
      collegesBadge: 'Colleges',
      collegesTitle: 'Discover University Colleges',
      collegesDesc: 'Choose the right college for you and explore all available courses and majors',
      collegeBusiness: 'College of Business and Finance',
      collegeHealth: 'College of Health Sciences',
      majorCS: 'Computer Science',
      majorDS: 'Data Science',
      majorIT: 'Information Technology',
      majorBusiness: 'Business Administration',
      majorAccounting: 'Accounting',
      majorFinance: 'Finance',
      majorEcommerce: 'E-Commerce',
      majorPublicHealth: 'Public Health',
      majorHealthInfo: 'Health Informatics',
      collegesSectionTitle: 'Colleges',
      discoverColleges: 'Discover University Colleges',
      chooseCollegeDesc: 'Choose the right college for you and explore all available courses and majors',
      computingInformatics: 'College of Computing and Informatics',
      businessFinance: 'College of Business and Finance',
      healthSciences: 'College of Health Sciences',
      exploreCollege: 'Explore College',
      publicHealth: 'Public Health',
      healthInformatics: 'Health Informatics',
      // Features Section
      featuresBadge: 'Features',
      featuresTitle: 'Why Choose Our Platform?',
      featureAdvanced: 'Advanced Search',
      featureAdvancedDesc: 'Easily search for courses by college, major, or academic level',
      featureResources: 'Educational Resources',
      featureResourcesDesc: 'Get all resources and references for each course',
      featureUpdates: 'Continuous Updates',
      featureUpdatesDesc: 'We regularly update content to ensure accuracy',
      whyChoosePlatform: 'Why Choose Our Platform?',
      advancedSearch: 'Advanced Search',
      advancedSearchDesc: 'Easily search for courses by college, major, or academic level',
      educationalResourcesTitle: 'Educational Resources',
      educationalResourcesDesc: 'Get all resources and references for each course',
      continuousUpdates: 'Continuous Updates',
      continuousUpdatesDesc: 'We regularly update content to ensure accuracy',
      // CTA Section
      ctaTitle: 'Start Your Academic Journey Today',
      ctaDesc: 'Join thousands of students and benefit from our comprehensive academic platform',
      ctaButton: 'Start Now',
      startJourney: 'Start Your Academic Journey Today',
      startJourneyDesc: 'Join thousands of students and benefit from our comprehensive academic platform',
      startNow: 'Start Now',
      // Course Sections
      csDescription: 'A broad field that includes many specializations such as algorithms, artificial intelligence, operating systems, software engineering, and networks. It is characterized by its wide scope that includes various applications in different fields.',
      oop: 'Object-Oriented Programming',
      oopDesc: 'Object-oriented programming concepts using Java including classes, objects, inheritance, and polymorphism.',
      digitalLogic: 'Digital Logic Design',
      digitalLogicDesc: 'Introduction to digital circuit design, logic gates, and processor design.',
      dataStructures: 'Data Structures',
      dataStructuresDesc: 'Study of fundamental data structures and algorithms for organizing and processing data efficiently.',
      dsProgramming: 'Data Science Programming',
      dsProgrammingDesc: 'Introduction to data science programming using Python and its core libraries.',
      dsDataStructures: 'Advanced data structures and algorithms for processing big data.',
      itIntro: 'Introduction to Information Technology',
      itIntroDesc: 'Introduction to information technology concepts and fundamental information systems.',
      itOop: 'Object-Oriented Programming',
      itOopDesc: 'Object-oriented programming concepts using Java in IT context.',
      computerOrg: 'Computer Organization',
      computerOrgDesc: 'Introduction to computer organization, architecture, and operating systems.',
      // FAQ Section
      faqTitle: 'Frequently Asked Questions',
      faqSubtitle: 'Answers to the most common questions',
      faq1Title: 'How do I add a course not in the system?',
      faq1Answer: 'To add a new course to the platform:',
      faq2Title: 'How do I delete my account?',
      faq2Answer: 'To permanently delete your account:',
      faq3Title: 'How do I report an error in content?',
      faq3Answer: 'If you find an error in course information or incorrect content:',
      faq4Title: 'Is this platform officially affiliated with Saudi Electronic University?',
      faq4Answer: 'No, this platform is unofficial.',
      addCourseDesc: 'Add a course not found in the system',
      haveQuestion: 'Have another question?',
      contactUsDesc: 'Contact us and we will be happy to help',
      emailUs: 'Email Us',
      // Footer
      programs: 'Programs',
      resourcesFooter: 'Resources',
      bestCollegeStudents: 'Best College Students',
      aboutUs: 'About Us',
      privacyPolicy: 'Privacy Policy',
      collegeGroup: 'College Group',
      telegramGroup: 'College Telegram Group',
      footerDesc: 'Empowering the next generation of tech innovators through excellence in education and research.',
      allRightsReserved: '© 2025 subject search. All rights reserved.',
      // User Auth
      loggedIn: 'Logged In',
      logout: 'Logout',
      adminPanel: 'Admin Panel',
      colleges: 'Colleges',
      // Course Modal
      courseDescription: 'Course Description',
      // National Day
      nationalDay: 'Saudi National Day',
      nationalDaySubtitle: 'Our Pride is in Our Nature — Happy National Day 🇸🇦',
      exploreCollegeMaterials: 'Explore College Materials',
      september23: 'September 23'
    }
  };

  // Build reverse index for best-effort auto-translation
  const reverseIndex = {
    ar: {},
    en: {}
  };
  for (const [lang, dict] of Object.entries(translations)) {
    for (const [key, val] of Object.entries(dict)) {
      reverseIndex[lang][val] = key;
    }
  }

  function setDirAndLang(lang) {
    document.documentElement.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
    document.documentElement.setAttribute('lang', lang);
    document.body.className = document.body.className.replace(/\b(lang-ar|lang-en)\b/g, '');
    document.body.classList.add(`lang-${lang}`);
  }

  // Helper: apply replacements only to text nodes (preserve icons/markup)
  function replaceTextNodes(root, replacer) {
    let changed = false;
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null);
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    for (const tn of nodes) {
      const before = tn.nodeValue;
      const after = replacer(before);
      if (after !== before) {
        tn.nodeValue = after;
        changed = true;
      }
    }
    return changed;
  }

  function mapCommonTokens(str, targetLang) {
    let out = str;
    if (targetLang === 'en') {
      out = out
        .replace(/\bالمستوى\s*(\d+)\b/g, (m, n) => `Level ${n}`)
        .replace(/(\d+)\s*(?:ساعة|ساعات)\b/g, (m, n) => `${n} ${Number(n) === 1 ? 'hour' : 'hours'}`)
        .replace(/\bمبتدئ\b/g, 'Beginner')
        .replace(/\bمتوسط\b/g, 'Intermediate')
        .replace(/\bمتقدم\b/g, 'Advanced')
        .replace(/\b(استكشاف|اكتشف|اكتشاف|استكشافات)\s*المادة\b/g, 'Explore Course')
        .replace(/\bعرض\s*جميع\s*المواد\b/g, 'View All Courses')
        .replace(/\bبكالوريوس\b/g, 'Bachelor')
        .replace(/\bالجامعة\s*السعودية\s*الإلكترونية\b/g, 'Saudi Electronic University')
        .replace(/\bنظام\s*المواد\s*الأكاديمية\s*الشامل\b/g, 'Comprehensive Academic Materials System')
        .replace(/\bمنصة\s*متكاملة\s*للوصول\s*إلى\s*جميع\s*المواد\s*والمقررات\s*الدراسية\s*لكليات\s*الجامعة\s*مع\s*موارد\s*تعليمية\s*شاملة\b/g, 'An integrated platform to access all courses and academic materials for university colleges with comprehensive educational resources')
        .replace(/\bابحث\s*عن\s*المواد\s*الدراسية\.\.\.\b/g, 'Search for courses...')
        .replace(/\bبحث\b/g, 'Search')
        .replace(/\bفلاتر\s*البحث\b/g, 'Search Filters')
        .replace(/\bتصفح\s*الكليات\b/g, 'Browse Colleges')
        .replace(/\bتعرف\s*أكثر\b/g, 'Learn More')
        .replace(/\bجميع\s*التخصصات\b/g, 'All Majors')
        .replace(/\bعلوم\s*الحاسب\b/g, 'Computer Science')
        .replace(/\bعلوم\s*البيانات\b/g, 'Data Science')
        .replace(/\bتقنية\s*المعلومات\b/g, 'Information Technology')
        .replace(/\bمواد\s*عامة\b/g, 'General Courses')
        .replace(/\bالتخصص\b/g, 'Major')
        .replace(/\bجميع\s*المستويات\b/g, 'All Levels')
        .replace(/\bالمستوى\s*الأول\b/g, 'Level 1')
        .replace(/\bالمستوى\s*الثاني\b/g, 'Level 2')
        .replace(/\bالمستوى\s*الثالث\b/g, 'Level 3')
        .replace(/\bالمستوى\s*الرابع\b/g, 'Level 4')
        .replace(/\bالمستوى\s*الخامس\b/g, 'Level 5')
        .replace(/\bالمستوى\s*السادس\b/g, 'Level 6')
        .replace(/\bالمستوى\s*السابع\b/g, 'Level 7')
        .replace(/\bالمستوى\s*الثامن\b/g, 'Level 8')
        .replace(/\bالساعات\b/g, 'Hours')
        .replace(/\bجميع\s*الساعات\b/g, 'All Hours')
        .replace(/\bساعتان\b/g, '2 hours')
        .replace(/\bتطبيق\s*الفلاتر\b/g, 'Apply Filters')
        .replace(/\bمسح\s*الفلاتر\b/g, 'Clear Filters')
        .replace(/\bمادة\s*دراسية\b/g, 'Courses')
        .replace(/\bطالب\s*وطالبة\b/g, 'Students')
        .replace(/\bكليات\b/g, 'Colleges')
        .replace(/\bمعدل\s*النجاح\b/g, 'Success Rate')
        .replace(/\bاكتشف\s*كليات\s*الجامعة\b/g, 'Discover University Colleges')
        .replace(/\bاختر\s*الكلية\s*المناسبة\s*لك\s*واستكشف\s*جميع\s*المواد\s*والتخصصات\s*المتاحة\b/g, 'Choose the right college for you and explore all available courses and majors')
        .replace(/\bكلية\s*الحوسبة\s*والمعلوماتية\b/g, 'College of Computing and Informatics')
        .replace(/\bكلية\s*العلوم\s*الإدارية\s*والمالية\b/g, 'College of Business and Finance')
        .replace(/\bكلية\s*العلوم\s*الصحية\b/g, 'College of Health Sciences')
        .replace(/\bاستكشف\s*الكلية\b/g, 'Explore College')
        .replace(/\bإدارة\s*الأعمال\b/g, 'Business Administration')
        .replace(/\bالمحاسبة\b/g, 'Accounting')
        .replace(/\bالمالية\b/g, 'Finance')
        .replace(/\bالتجارة\s*الإلكترونية\b/g, 'E-Commerce')
        .replace(/\bالصحة\s*العامة\b/g, 'Public Health')
        .replace(/\bالمعلوماتية\s*الصحية\b/g, 'Health Informatics')
        .replace(/\bالمميزات\b/g, 'Features')
        .replace(/\bلماذا\s*تختار\s*منصتنا\?\b/g, 'Why Choose Our Platform?')
        .replace(/\bبحث\s*متقدم\b/g, 'Advanced Search')
        .replace(/\bابحث\s*عن\s*المواد\s*بسهولة\s*حسب\s*الكلية،\s*التخصص،\s*أو\s*المستوى\s*الدراسي\b/g, 'Easily search for courses by college, major, or academic level')
        .replace(/\bموارد\s*تعليمية\b/g, 'Educational Resources')
        .replace(/\bاحصل\s*على\s*جميع\s*الموارد\s*والمراجع\s*الخاصة\s*بكل\s*مادة\s*دراسية\b/g, 'Get all resources and references for each course')
        .replace(/\bتحديثات\s*مستمرة\b/g, 'Continuous Updates')
        .replace(/\bنحدث\s*المحتوى\s*بشكل\s*دوري\s*لضمان\s*دقة\s*المعلومات\b/g, 'We regularly update content to ensure accuracy')
        .replace(/\bابدأ\s*رحلتك\s*الأكاديمية\s*اليوم\b/g, 'Start Your Academic Journey Today')
        .replace(/\bانضم\s*إلى\s*آلاف\s*الطلاب\s*واستفد\s*من\s*منصتنا\s*الشاملة\s*للمواد\s*الأكاديمية\b/g, 'Join thousands of students and benefit from our comprehensive academic platform')
        .replace(/\bابدأ\s*الآن\b/g, 'Start Now')
        .replace(/\bالبرمجة\s*الشيئية\b/g, 'Object-Oriented Programming')
        .replace(/\bتصميم\s*المنطق\s*الرقمي\b/g, 'Digital Logic Design')
        .replace(/\bهياكل\s*البيانات\b/g, 'Data Structures')
        .replace(/\bبرمجة\s*علوم\s*البيانات\b/g, 'Data Science Programming')
        .replace(/\bمقدمة\s*في\s*تقنية\s*المعلومات\b/g, 'Introduction to IT')
        .replace(/\bتنظيم\s*الحاسب\b/g, 'Computer Organization')
        .replace(/\bالأسئلة\s*الشائعة\b/g, 'FAQ')
        .replace(/\bإجابات\s*للأسئلة\s*الأكثر\s*شيوعاً\b/g, 'Answers to the most common questions')
        .replace(/\bكيف\s*أضيف\s*مادة\s*لم\s*أجدها\s*في\s*النظام\?\b/g, 'How do I add a course not in the system?')
        .replace(/\bكيف\s*أحذف\s*حسابي\?\b/g, 'How do I delete my account?')
        .replace(/\bكيف\s*أبلّغ\s*عن\s*خطأ\s*في\s*المحتوى\?\b/g, 'How do I report an error in content?')
        .replace(/\bهل\s*المنصة\s*تابعة\s*رسمياً\s*للجامعة\s*السعودية\s*الإلكترونية\?\b/g, 'Is this platform officially affiliated with SEU?')
        .replace(/\bلديك\s*سؤال\s*آخر\?\b/g, 'Have another question?')
        .replace(/\bتواصل\s*معنا\s*وسنكون\s*سعداء\s*بمساعدتك\b/g, 'Contact us and we will be happy to help')
        .replace(/\bراسلنا\b/g, 'Email Us')
        .replace(/\bالبرامج\b/g, 'Programs')
        .replace(/\bالموارد\b/g, 'Resources')
        .replace(/\bطلاب\s*افضل\s*كلية\b/g, 'Best College Students')
        .replace(/\bمن\s*نحن\b/g, 'About Us')
        .replace(/\bسياسة\s*الخصوصية\b/g, 'Privacy Policy')
        .replace(/\bقروب\s*الكلية\b/g, 'College Group')
        .replace(/\bقروب\s*الكلية\s*على\s*تلجرام\b/g, 'College Telegram Group')
        .replace(/\bتمكين\s*الجيل\s*القادم\s*من\s*مبتكري\s*التكنولوجيا\s*من\s*خلال\s*التميز\s*في\s*التعليم\s*والبحث\.\b/g, 'Empowering the next generation of tech innovators through excellence in education and research.')
        .replace(/\bجميع\s*الحقوق\s*محفوظة\b/g, 'All rights reserved')
        .replace(/\bمسجل\s*الدخول\b/g, 'Logged In')
        .replace(/\bتسجيل\s*الدخول\b/g, 'Login')
        .replace(/\bتسجيل\s*الخروج\b/g, 'Logout')
        .replace(/\bإنشاء\s*حساب\b/g, 'Register')
        .replace(/\bإضافة\s*مادة\b/g, 'Add Course')
        .replace(/\bلوحة\s*الإدارة\b/g, 'Admin Panel')
        .replace(/\bالكليات\b/g, 'Colleges')
        .replace(/\bالمدونة\b/g, 'Blogs')
        .replace(/\bالرئيسية\b/g, 'Home')
        .replace(/\bكلية\s*الحوسبة\b/g, 'Computing College')
        .replace(/\bكلية\s*الإدارة\s*والأعمال\b/g, 'Business College')
        .replace(/\bكلية\s*الصحة\b/g, 'Health College')
        .replace(/\bجامعة\s*SEU\b/g, 'SEU')
        .replace(/\bوصف\s*المادة\b/g, 'Course Description')
        .replace(/\bتحميل\s*المنهج\b/g, 'Download Curriculum')
        .replace(/\bمشاركة\s*المادة\b/g, 'Share Course')
        .replace(/\bالموارد\s*التعليمية\b/g, 'Educational Resources')
        .replace(/\bمواد\s*إضافية\b/g, 'Additional Materials')
        .replace(/\bكتاب\s*مقرر\s*موصى\s*به\b/g, 'Recommended Course Book')
        .replace(/\bمنصة\s*التعلم\s*التفاعلية\b/g, 'Interactive Learning Platform')
        .replace(/\bنتائج\s*البحث:\b/g, 'Search Results:')
        .replace(/\bمسح\s*البحث\b/g, 'Clear Search')
        .replace(/\bالوضع\s*المظلم\/الفاتح\b/g, 'Dark/Light Mode')
        .replace(/\bاليوم\s*الوطني\s*السعودي\b/g, 'Saudi National Day')
        .replace(/\bعزّنا\s*بطبعنا\b/g, 'Our Pride is in Our Nature')
        .replace(/\bاستكشف\s*مواد\s*الكلية\b/g, 'Explore College Materials')
        .replace(/\b23\s*سبتمبر\b/g, 'September 23')
        .replace(/\bأفضل\s*كلية\b/g, 'Best College')
        .replace(/\bلماذا\s*تختارنا\b/g, 'Why Choose Us');
    } else {
      out = out
        .replace(/\bLevel\s*(\d+)\b/g, (m, n) => `المستوى ${n}`)
        .replace(/(\d+)\s*hours?\b/gi, (m, n) => `${n} ساعات`)
        .replace(/\bBeginner\b/g, 'مبتدئ')
        .replace(/\bIntermediate\b/g, 'متوسط')
        .replace(/\bAdvanced\b/g, 'متقدم')
        .replace(/\bView\s*All\s*Courses\b/g, 'عرض جميع المواد')
        .replace(/\bExplore\s*Course\b/g, 'استكشاف المادة')
        .replace(/\bBachelor\b/g, 'بكالوريوس')
        .replace(/\bSaudi\s*Electronic\s*University\b/g, 'الجامعة السعودية الإلكترونية')
        .replace(/\bComprehensive\s*Academic\s*Materials\s*System\b/g, 'نظام المواد الأكاديمية الشامل')
        .replace(/\bSearch\s*for\s*courses\.\.\.\b/g, 'ابحث عن المواد الدراسية...')
        .replace(/\bSearch\b/g, 'بحث')
        .replace(/\bSearch\s*Filters\b/g, 'فلاتر البحث')
        .replace(/\bBrowse\s*Colleges\b/g, 'تصفح الكليات')
        .replace(/\bLearn\s*More\b/g, 'تعرف أكثر')
        .replace(/\bAll\s*Majors\b/g, 'جميع التخصصات')
        .replace(/\bComputer\s*Science\b/g, 'علوم الحاسب')
        .replace(/\bData\s*Science\b/g, 'علوم البيانات')
        .replace(/\bInformation\s*Technology\b/g, 'تقنية المعلومات')
        .replace(/\bGeneral\s*Courses\b/g, 'مواد عامة')
        .replace(/\bMajor\b/g, 'التخصص')
        .replace(/\bAll\s*Levels\b/g, 'جميع المستويات')
        .replace(/\bAll\s*Hours\b/g, 'جميع الساعات')
        .replace(/\bApply\s*Filters\b/g, 'تطبيق الفلاتر')
        .replace(/\bClear\s*Filters\b/g, 'مسح الفلاتر')
        .replace(/\bCourses\b/g, 'مادة دراسية')
        .replace(/\bStudents\b/g, 'طالب وطالبة')
        .replace(/\bColleges\b/g, 'كليات')
        .replace(/\bSuccess\s*Rate\b/g, 'معدل النجاح')
        .replace(/\bDiscover\s*University\s*Colleges\b/g, 'اكتشف كليات الجامعة')
        .replace(/\bCollege\s*of\s*Computing\s*and\s*Informatics\b/g, 'كلية الحوسبة والمعلوماتية')
        .replace(/\bCollege\s*of\s*Business\s*and\s*Finance\b/g, 'كلية العلوم الإدارية والمالية')
        .replace(/\bCollege\s*of\s*Health\s*Sciences\b/g, 'كلية العلوم الصحية')
        .replace(/\bExplore\s*College\b/g, 'استكشف الكلية')
        .replace(/\bBusiness\s*Administration\b/g, 'إدارة الأعمال')
        .replace(/\bAccounting\b/g, 'المحاسبة')
        .replace(/\bFinance\b/g, 'المالية')
        .replace(/\bE-Commerce\b/g, 'التجارة الإلكترونية')
        .replace(/\bPublic\s*Health\b/g, 'الصحة العامة')
        .replace(/\bHealth\s*Informatics\b/g, 'المعلوماتية الصحية')
        .replace(/\bFeatures\b/g, 'المميزات')
        .replace(/\bWhy\s*Choose\s*Our\s*Platform\?\b/g, 'لماذا تختار منصتنا؟')
        .replace(/\bAdvanced\s*Search\b/g, 'بحث متقدم')
        .replace(/\bEducational\s*Resources\b/g, 'موارد تعليمية')
        .replace(/\bContinuous\s*Updates\b/g, 'تحديثات مستمرة')
        .replace(/\bStart\s*Your\s*Academic\s*Journey\s*Today\b/g, 'ابدأ رحلتك الأكاديمية اليوم')
        .replace(/\bStart\s*Now\b/g, 'ابدأ الآن')
        .replace(/\bObject-Oriented\s*Programming\b/g, 'البرمجة الشيئية')
        .replace(/\bDigital\s*Logic\s*Design\b/g, 'تصميم المنطق الرقمي')
        .replace(/\bData\s*Structures\b/g, 'هياكل البيانات')
        .replace(/\bData\s*Science\s*Programming\b/g, 'برمجة علوم البيانات')
        .replace(/\bIntroduction\s*to\s*IT\b/g, 'مقدمة في تقنية المعلومات')
        .replace(/\bComputer\s*Organization\b/g, 'تنظيم الحاسب')
        .replace(/\bFAQ\b/g, 'الأسئلة الشائعة')
        .replace(/\bEmail\s*Us\b/g, 'راسلنا')
        .replace(/\bPrograms\b/g, 'البرامج')
        .replace(/\bResources\b/g, 'الموارد')
        .replace(/\bAbout\s*Us\b/g, 'من نحن')
        .replace(/\bPrivacy\s*Policy\b/g, 'سياسة الخصوصية')
        .replace(/\bCollege\s*Group\b/g, 'قروب الكلية')
        .replace(/\bAll\s*rights\s*reserved\b/g, 'جميع الحقوق محفوظة')
        .replace(/\bLogged\s*In\b/g, 'مسجل الدخول')
        .replace(/\bLogin\b/g, 'تسجيل الدخول')
        .replace(/\bLogout\b/g, 'تسجيل الخروج')
        .replace(/\bRegister\b/g, 'إنشاء حساب')
        .replace(/\bAdd\s*Course\b/g, 'إضافة مادة')
        .replace(/\bAdmin\s*Panel\b/g, 'لوحة الإدارة')
        .replace(/\bBlogs\b/g, 'المدونة')
        .replace(/\bHome\b/g, 'الرئيسية')
        .replace(/\bComputing\s*College\b/g, 'كلية الحوسبة')
        .replace(/\bBusiness\s*College\b/g, 'كلية الإدارة والأعمال')
        .replace(/\bHealth\s*College\b/g, 'كلية الصحة')
        .replace(/\bSEU\b/g, 'جامعة SEU')
        .replace(/\bCourse\s*Description\b/g, 'وصف المادة')
        .replace(/\bDownload\s*Curriculum\b/g, 'تحميل المنهج')
        .replace(/\bShare\s*Course\b/g, 'مشاركة المادة')
        .replace(/\bAdditional\s*Materials\b/g, 'مواد إضافية')
        .replace(/\bRecommended\s*Course\s*Book\b/g, 'كتاب مقرر موصى به')
        .replace(/\bInteractive\s*Learning\s*Platform\b/g, 'منصة التعلم التفاعلية')
        .replace(/\bSearch\s*Results:\b/g, 'نتائج البحث:')
        .replace(/\bClear\s*Search\b/g, 'مسح البحث')
        .replace(/\bDark\/Light\s*Mode\b/g, 'الوضع المظلم/الفاتح')
        .replace(/\bSaudi\s*National\s*Day\b/g, 'اليوم الوطني السعودي')
        .replace(/\bExplore\s*College\s*Materials\b/g, 'استكشف مواد الكلية')
        .replace(/\bSeptember\s*23\b/g, '23 سبتمبر')
        .replace(/\bBest\s*College\b/g, 'أفضل كلية')
        .replace(/\bWhy\s*Choose\s*Us\b/g, 'لماذا تختارنا');
    }
    return out;
  }

  function translateNodeText(node, dict) {
    // data-i18n handling
    const key = node.getAttribute && node.getAttribute('data-i18n');
    if (key && dict[key]) {
      if (node.tagName && node.tagName.toLowerCase() === 'input' && (node.type === 'text' || node.type === 'search')) {
        node.setAttribute('placeholder', dict[key]);
      } else {
        // Replace only text nodes to preserve child elements/icons
        replaceTextNodes(node, (txt) => {
          const t = txt.trim();
          if (t && (reverseIndex.ar[t] === key || reverseIndex.en[t] === key)) return dict[key];
          // If text node equals the original dictionary value, replace directly
          if (t === translations.ar[key] || t === translations.en[key]) return dict[key];
          return txt;
        });
      }
      return true;
    }

    // Best-effort: try matching whole text to reverse index of the opposite language
    const text = (node.textContent || '').trim();
    if (!text) return false;

    // Determine if text is one of known entries in either language
    const arKey = reverseIndex.ar[text];
    const enKey = reverseIndex.en[text];

    const replacementKey = arKey || enKey;
    if (replacementKey && dict[replacementKey]) {
      // Replace only text nodes equal to the matched phrase
      const replaced = replaceTextNodes(node, (txt) => {
        const t = txt.trim();
        return (t === text) ? dict[replacementKey] : txt;
      });
      if (replaced) return true;
    }

    // Phrase-level best-effort replacements for common UI tokens on text nodes
    const targetLang = document.documentElement.getAttribute('lang') === 'en' ? 'en' : 'ar';
    const didReplace = replaceTextNodes(node, (txt) => mapCommonTokens(txt, targetLang));
    if (didReplace) return true;
    return false;
  }

  function translateAttributes(el, dict) {
    const attrMap = [
      { attr: 'placeholder', dataKey: 'i18nPlaceholder' },
      { attr: 'title', dataKey: 'i18nTitle' },
      { attr: 'aria-label', dataKey: 'i18nAriaLabel' }
    ];

    for (const { attr, dataKey } of attrMap) {
      // Explicit data-i18n-<attr>
      const explicitKey = el.dataset && el.dataset[dataKey];
      if (explicitKey && dict[explicitKey]) {
        el.setAttribute(attr, dict[explicitKey]);
        continue;
      }

      // Best-effort via reverse index
      const val = el.getAttribute && el.getAttribute(attr);
      if (!val) continue;
      const key = reverseIndex.ar[val] || reverseIndex.en[val];
      if (key && dict[key]) {
        el.setAttribute(attr, dict[key]);
        continue;
      }
      // Fallback: apply phrase-level replacements on attributes too
      let replaced = val;
      if (document.documentElement.getAttribute('lang') === 'en') {
        replaced = replaced
          .replace(/\bالمستوى\s*(\d+)\b/g, (m, n) => `Level ${n}`)
          .replace(/(\d+)\s*(?:ساعة|ساعات)\b/g, (m, n) => `${n} ${Number(n) === 1 ? 'hour' : 'hours'}`)
          .replace(/\bمبتدئ\b/g, 'Beginner')
          .replace(/\bمتوسط\b/g, 'Intermediate')
          .replace(/\bمتقدم\b/g, 'Advanced')
          .replace(/\b(استكشاف|اكتشف|اكتشاف|استكشافات)\s*المادة\b/g, 'Explore Course')
          .replace(/\bعرض\s*جميع\s*المواد\b/g, 'View All Courses');
      } else {
        replaced = replaced
          .replace(/\bLevel\s*(\d+)\b/g, (m, n) => `المستوى ${n}`)
          .replace(/(\d+)\s*hours?\b/gi, (m, n) => `${n} ساعات`)
          .replace(/\bBeginner\b/g, 'مبتدئ')
          .replace(/\bIntermediate\b/g, 'متوسط')
          .replace(/\bAdvanced\b/g, 'متقدم')
          .replace(/\bView\s*All\s*Courses\b/g, 'عرض جميع المواد')
          .replace(/\bExplore\s*Course\b/g, 'استكشاف المادة');
      }
      if (replaced !== val) el.setAttribute(attr, replaced);
    }
  }

  function applyLanguage(lang) {
    const dict = translations[lang] || translations.en;
    setDirAndLang(lang);

    // Page title: preserve per-page titles; translate when possible
    const titleEl = document.querySelector('title');
    if (titleEl) {
      const titleKey = titleEl.getAttribute('data-i18n');
      if (titleKey && dict[titleKey]) {
        titleEl.textContent = dict[titleKey];
      } else {
        const cur = (titleEl.textContent || '').trim();
        const key = reverseIndex.ar[cur] || reverseIndex.en[cur];
        if (key && dict[key]) titleEl.textContent = dict[key];
      }
    }

    // Translate all elements with data-i18n first (authoritative)
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (!key) return;
      if (el.tagName.toLowerCase() === 'input' && (el.type === 'text' || el.type === 'search')) {
        el.setAttribute('placeholder', dict[key] || el.getAttribute('placeholder'));
      } else {
        // Only set textContent if element has no child elements (to preserve icons/spans)
        if (el.children.length === 0) {
          el.textContent = dict[key] || el.textContent;
        } else {
          // For elements with children, only translate direct text nodes
          el.childNodes.forEach(node => {
            if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
              node.textContent = dict[key];
            }
          });
        }
      }
      el.setAttribute('data-translated', lang);
    });

    // Skip best-effort translation to avoid breaking content
    // Elements should use data-i18n for proper translation

    // Update visible language indicator if present
    const languageText = document.getElementById('language-text');
    if (languageText && dict.languageText) languageText.textContent = dict.languageText;
    const mobileLanguageText = document.getElementById('mobile-language-text');
    if (mobileLanguageText && dict.mobileLanguageText) mobileLanguageText.textContent = dict.mobileLanguageText;

    // Update toggle buttons if they carry data-en / data-ar labels
    const btn = document.getElementById('language-toggle');
    if (btn) {
      const label = lang === 'ar' ? (btn.getAttribute('data-ar') || dict.toggleShortAr) : (btn.getAttribute('data-en') || dict.toggleShortEn);
      const span = btn.querySelector('span');
      if (span && label) span.textContent = label;
      else if (label) btn.textContent = label; // fallback if no span exists
      translateAttributes(btn, dict);
    }
    const mobileBtn = document.getElementById('mobile-language-toggle');
    if (mobileBtn) {
      const label = lang === 'ar' ? (mobileBtn.getAttribute('data-ar') || dict.mobileToggleToEnglish) : (mobileBtn.getAttribute('data-en') || dict.mobileToggleToEnglish);
      const span = mobileBtn.querySelector('span');
      if (span && label) span.textContent = label;
      else if (label) mobileBtn.textContent = label; // fallback
      translateAttributes(mobileBtn, dict);
    }

    // Custom known text spots
    const headerTitle = document.querySelector('.gradient-text');
    if (headerTitle) {
      const key = reverseIndex.ar[headerTitle.textContent.trim()] || reverseIndex.en[headerTitle.textContent.trim()];
      if (key && dict[key]) headerTitle.textContent = dict[key];
    }

    console.log(`Language switched to: ${lang}`);
  }

  function toggleLanguage() {
    const current = localStorage.getItem('siteLanguage') || 'en';
    const next = current === 'ar' ? 'en' : 'ar';
    localStorage.setItem('siteLanguage', next);
    applyLanguage(next);
  }

  document.addEventListener('DOMContentLoaded', () => {
    // Default to Arabic site-wide if nothing saved (site primary language)
    const savedLang = localStorage.getItem('siteLanguage') || 'ar';
    applyLanguage(savedLang);

    const btn = document.getElementById('language-toggle');
    if (btn) btn.addEventListener('click', toggleLanguage);

    const mobileBtn = document.getElementById('mobile-language-toggle');
    if (mobileBtn) mobileBtn.addEventListener('click', toggleLanguage);

    // Note: Removed MutationObserver to prevent infinite translation loops
    // Translation now only happens on page load and toggle click
  });
})();
