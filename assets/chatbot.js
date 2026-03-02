/* ========================================
   Chatbot JavaScript - SEU Subject Search
   شات روبوت شامل يدعم جميع الكليات والموقع بالكامل
======================================== */

(function() {
    'use strict';

    // بيانات المواد
    let coursesData = [];
    
    // ==================== قاعدة المعرفة الشاملة ====================
    const knowledgeBase = {
        // معلومات الموقع
        site: {
            name: 'Subject Search',
            nameAr: 'بحث المواد',
            description: 'منصة طلابية شاملة للبحث عن مواد الجامعة السعودية الإلكترونية',
            url: 'https://subjectsearch.tech',
            telegram: '@computingg'
        },
        
        // ==================== الكليات ====================
        colleges: {
            computing: {
                name: 'كلية الحوسبة والمعلوماتية',
                nameEn: 'College of Computing',
                url: '/page/all-colleges/computing/',
                telegram: '@computingg',
                majors: [
                    { code: 'CS', name: 'علوم الحاسب', nameEn: 'Computer Science' },
                    { code: 'IT', name: 'تقنية المعلومات', nameEn: 'Information Technology' },
                    { code: 'DS', name: 'علوم البيانات', nameEn: 'Data Science' }
                ],
                description: 'تضم تخصصات البرمجة والشبكات والذكاء الاصطناعي وتحليل البيانات'
            },
            business: {
                name: 'كلية العلوم الإدارية والمالية',
                nameEn: 'College of Business Administration',
                url: '/page/all-colleges/business/business.html',
                telegram: null,
                majors: [
                    { code: 'BA', name: 'إدارة الأعمال', nameEn: 'Business Administration' },
                    { code: 'ACC', name: 'المحاسبة', nameEn: 'Accounting' },
                    { code: 'FIN', name: 'المالية', nameEn: 'Finance' },
                    { code: 'MKT', name: 'التسويق', nameEn: 'Marketing' },
                    { code: 'ECOM', name: 'التجارة الإلكترونية', nameEn: 'E-Commerce' }
                ],
                description: 'تضم تخصصات إدارة الأعمال والمحاسبة والمالية والتسويق'
            },
            health: {
                name: 'كلية العلوم الصحية',
                nameEn: 'College of Health Sciences',
                url: '/page/all-colleges/health/health.html',
                telegram: null,
                majors: [
                    { code: 'PH', name: 'الصحة العامة', nameEn: 'Public Health' },
                    { code: 'HI', name: 'المعلوماتية الصحية', nameEn: 'Health Informatics' }
                ],
                description: 'تضم تخصصات الصحة العامة والمعلوماتية الصحية'
            }
        },
        
        // ==================== الشروحات والمدونات ====================
        tutorials: {
            programming: {
                title: 'خارطة طريق البرمجة',
                url: '/page/Blogs/static/programming-roadmap.html',
                description: 'دليل شامل لتعلم البرمجة من الصفر'
            },
            oop: {
                title: 'مشروع OOP',
                url: '/page/Blogs/static/OOP_project.html',
                description: 'شرح مشروع البرمجة كائنية التوجه'
            },
            portfolio: {
                title: 'مشاريع البورتفوليو',
                url: '/page/Blogs/static/portfolio-projects.html',
                description: 'أفكار مشاريع لبناء معرض أعمالك'
            },
            studyMethods: {
                title: 'طرق الدراسة الفعالة',
                url: '/page/Blogs/static/study-methods.html',
                description: 'استراتيجيات للدراسة بفاعلية'
            },
            timeManagement: {
                title: 'إدارة الوقت',
                url: '/page/Blogs/static/time-management.html',
                description: 'نصائح لإدارة وقتك بين الدراسة والحياة'
            },
            examStrategy: {
                title: 'استراتيجيات الاختبارات',
                url: '/page/Blogs/static/exam-strategy.html',
                description: 'كيف تستعد للاختبارات وتتفوق'
            },
            onlineLearning: {
                title: 'التعلم عن بعد',
                url: '/page/Blogs/static/online-learning.html',
                description: 'نصائح للتعلم الإلكتروني الفعال'
            },
            noteTaking: {
                title: 'تدوين الملاحظات',
                url: '/page/Blogs/static/note-taking.html',
                description: 'طرق فعالة لتدوين الملاحظات'
            },
            csReadingList: {
                title: 'قائمة قراءات علوم الحاسب',
                url: '/page/Blogs/static/cs-reading-list.html',
                description: 'كتب ومصادر مهمة لطلاب الحوسبة'
            },
            internships: {
                title: 'نصائح التدريب',
                url: '/page/Blogs/static/internships-tips.html',
                description: 'كيف تحصل على تدريب وتستفيد منه'
            },
            chooseMajor: {
                title: 'اختيار التخصص',
                url: '/page/Blogs/static/choose-major.html',
                description: 'دليل اختيار التخصص المناسب'
            },
            studyGroup: {
                title: 'مجموعات الدراسة',
                url: '/page/Blogs/static/study-group.html',
                description: 'فوائد الدراسة الجماعية وكيفية تنظيمها'
            },
            balanceLife: {
                title: 'التوازن بين الدراسة والحياة',
                url: '/page/Blogs/static/balance-life-study.html',
                description: 'كيف توازن بين دراستك وحياتك الشخصية'
            }
        },
        
        // ==================== صفحات الموقع ====================
        pages: {
            home: { name: 'الصفحة الرئيسية', url: '/', description: 'البحث عن المواد' },
            about: { name: 'من نحن', url: '/page/about.html', description: 'معلومات عن الموقع' },
            privacy: { name: 'سياسة الخصوصية', url: '/page/privacy.html', description: 'سياسة الخصوصية' },
            colleges: { name: 'جميع الكليات', url: '/page/all-colleges/all-colleges.html', description: 'تصفح الكليات' },
            blogs: { name: 'المدونة', url: '/page/Blogs/blogs.html', description: 'مقالات ونصائح' }
        },

        // ==================== الأسئلة والإجابات ====================
        responses: [
            // ===== الأسئلة الشائعة من الموقع =====
            {
                patterns: ['كيف أضيف مادة', 'اضيف مادة', 'مادة غير موجودة', 'مادة لم أجدها', 'اضافة مادة جديدة'],
                answer: 'لإضافة مادة غير موجودة في النظام:\n\n1️⃣ سجل دخول إلى حسابك\n2️⃣ اضغط على "إضافة مادة" في الصفحة الرئيسية\n3️⃣ أدخل معلومات المادة (الاسم، الكود، الوصف)\n4️⃣ سيتم مراجعتها وإضافتها\n\n📝 شكراً لمساهمتك في إثراء المحتوى!'
            },
            {
                patterns: ['كيف أحذف حسابي', 'احذف حسابي', 'حذف الحساب', 'الغاء الحساب', 'حذف بياناتي'],
                answer: 'لحذف حسابك:\n\n1️⃣ سجل دخول إلى حسابك\n2️⃣ اذهب إلى الإعدادات\n3️⃣ اختر "حذف الحساب"\n4️⃣ أكد عملية الحذف\n\n⚠️ تنبيه: سيتم حذف جميع بياناتك نهائياً ولا يمكن استرجاعها'
            },
            {
                patterns: ['أبلغ عن خطأ', 'ابلاغ عن خطأ', 'خطأ في المحتوى', 'معلومة خاطئة', 'تصحيح معلومة'],
                answer: 'للإبلاغ عن خطأ في المحتوى:\n\n📱 تواصل معنا عبر التيليجرام: @computingg\n📧 أو أرسل لنا تفاصيل الخطأ\n\n✅ سنقوم بمراجعته وتصحيحه في أقرب وقت!\n\nشكراً لمساعدتك في تحسين المحتوى 💙'
            },
            {
                patterns: ['هل المنصة رسمية', 'تابعة للجامعة', 'موقع رسمي', 'منصة رسمية', 'هل الموقع رسمي'],
                answer: '⚠️ لا، المنصة ليست تابعة رسمياً للجامعة السعودية الإلكترونية.\n\n📌 هي منصة طلابية تطوعية هدفها:\n• مساعدة الطلاب في الوصول للمعلومات\n• مشاركة المصادر والخبرات\n• تسهيل البحث عن المواد\n\n💙 تم تطويرها بجهود طلابية بحتة'
            },
            
            // ===== الكليات =====
            {
                patterns: ['الكليات', 'كليات الجامعة', 'كم كلية', 'ما هي الكليات', 'جميع الكليات'],
                answer: 'كليات الجامعة المدعومة في الموقع:\n\n💻 كلية الحوسبة والمعلوماتية\n   • علوم الحاسب (CS)\n   • تقنية المعلومات (IT)\n   • علوم البيانات (DS)\n\n💼 كلية العلوم الإدارية والمالية\n   • إدارة الأعمال\n   • المحاسبة\n   • المالية\n\n🏥 كلية العلوم الصحية\n   • الصحة العامة\n   • المعلوماتية الصحية\n\n📌 اختر الكلية للمزيد من التفاصيل!'
            },
            {
                patterns: ['كلية الحوسبة', 'الحوسبة والمعلوماتية', 'computing', 'كلية الكمبيوتر'],
                answer: '💻 كلية الحوسبة والمعلوماتية:\n\n📚 التخصصات:\n• علوم الحاسب (CS) - البرمجة والخوارزميات\n• تقنية المعلومات (IT) - الشبكات والأمن\n• علوم البيانات (DS) - تحليل البيانات والذكاء الاصطناعي\n\n📱 قناة التيليجرام: @computingg\n🔗 الصفحة: /page/all-colleges/computing/\n\n💡 أكثر كلية مدعومة في الموقع!'
            },
            {
                patterns: ['كلية الإدارة', 'كلية الادارة', 'العلوم الإدارية', 'business', 'كلية الأعمال', 'ادارة الاعمال'],
                answer: '💼 كلية العلوم الإدارية والمالية:\n\n📚 التخصصات:\n• إدارة الأعمال\n• المحاسبة\n• المالية\n• التسويق\n• التجارة الإلكترونية\n\n🔗 الصفحة: /page/all-colleges/business/business.html\n\n📌 تصفح المواد من صفحة الكلية!'
            },
            {
                patterns: ['كلية الصحة', 'العلوم الصحية', 'health', 'الصحة العامة', 'المعلوماتية الصحية'],
                answer: '🏥 كلية العلوم الصحية:\n\n📚 التخصصات:\n• الصحة العامة\n• المعلوماتية الصحية\n\n🔗 الصفحة: /page/all-colleges/health/health.html\n\n📌 تصفح المواد من صفحة الكلية!'
            },
            
            // ===== التخصصات =====
            {
                patterns: ['التخصصات', 'تخصصات', 'ما هي التخصصات', 'كم تخصص', 'تخصصات الحوسبة'],
                answer: 'تخصصات كلية الحوسبة:\n\n🖥️ علوم الحاسب (CS) - البرمجة والخوارزميات\n🌐 تقنية المعلومات (IT) - الشبكات والأمن\n📊 علوم البيانات (DS) - تحليل البيانات والذكاء الاصطناعي\n\n💡 كل تخصص له مواده الخاصة!'
            },
            
            // ===== البحث =====
            {
                patterns: ['كيف ابحث', 'كيف أبحث', 'طريقة البحث', 'البحث عن مادة', 'أين أجد', 'كيف اجد'],
                answer: 'للبحث عن مادة:\n\n🔍 اكتب اسم المادة في شريط البحث (بالعربي أو الإنجليزي)\n🔢 أو اكتب كود المادة مثل CS230 أو IT351\n📚 أو تصفح المواد حسب التخصص والكلية\n\n💡 جرب البحث الآن في الصفحة الرئيسية!'
            },
            
            // ===== الشروحات والمدونة =====
            {
                patterns: ['شروحات', 'شرح', 'كود', 'برمجة', 'تعلم برمجة', 'كيف اتعلم', 'مصادر تعلم'],
                answer: '📚 شروحات ومصادر التعلم:\n\n💻 خارطة طريق البرمجة:\n/page/Blogs/static/programming-roadmap.html\n\n📖 مشروع OOP:\n/page/Blogs/static/OOP_project.html\n\n🎯 مشاريع البورتفوليو:\n/page/Blogs/static/portfolio-projects.html\n\n📚 قائمة قراءات CS:\n/page/Blogs/static/cs-reading-list.html\n\n🔗 المزيد في صفحة المدونة!'
            },
            {
                patterns: ['مدونة', 'مقالات', 'نصائح', 'blogs', 'blog'],
                answer: '📝 مدونة الموقع:\n\n تجد فيها مقالات مفيدة عن:\n\n📖 طرق الدراسة الفعالة\n⏰ إدارة الوقت\n📝 تدوين الملاحظات\n🎯 استراتيجيات الاختبارات\n💻 خارطة طريق البرمجة\n🎓 اختيار التخصص\n\n🔗 تصفح المدونة:\n/page/Blogs/blogs.html'
            },
            {
                patterns: ['طرق الدراسة', 'كيف ادرس', 'الدراسة الفعالة', 'study methods'],
                answer: '📖 طرق الدراسة الفعالة:\n\nلدينا مقال شامل عن استراتيجيات الدراسة:\n🔗 /page/Blogs/static/study-methods.html\n\nيتضمن:\n• تقنية بومودورو\n• التعلم النشط\n• المراجعة المتباعدة\n• الخرائط الذهنية'
            },
            {
                patterns: ['إدارة الوقت', 'ادارة الوقت', 'تنظيم الوقت', 'time management'],
                answer: '⏰ إدارة الوقت:\n\nمقال مفصل عن إدارة الوقت للطلاب:\n🔗 /page/Blogs/static/time-management.html\n\nيتضمن:\n• جدولة المهام\n• تحديد الأولويات\n• التوازن بين الدراسة والحياة'
            },
            {
                patterns: ['الاختبارات', 'كيف أذاكر', 'استعداد للاختبار', 'exam', 'امتحان'],
                answer: '📝 استراتيجيات الاختبارات:\n\nمقال شامل للاستعداد للاختبارات:\n🔗 /page/Blogs/static/exam-strategy.html\n\nيتضمن:\n• خطة المراجعة\n• تقنيات الحفظ\n• إدارة القلق\n• نصائح يوم الاختبار'
            },
            {
                patterns: ['تدريب', 'internship', 'تدريب تعاوني', 'وظيفة'],
                answer: '💼 نصائح التدريب والتوظيف:\n\nمقال عن التدريب التعاوني:\n🔗 /page/Blogs/static/internships-tips.html\n\nيتضمن:\n• كيف تبحث عن تدريب\n• تجهيز السيرة الذاتية\n• المقابلات الشخصية\n• الاستفادة من التدريب'
            },
            {
                patterns: ['اختيار التخصص', 'اي تخصص', 'أي تخصص أختار', 'محتار في التخصص'],
                answer: '🎓 اختيار التخصص:\n\nدليل شامل لاختيار التخصص المناسب:\n🔗 /page/Blogs/static/choose-major.html\n\nيساعدك في:\n• معرفة ميولك\n• مقارنة التخصصات\n• فرص العمل\n• نصائح من طلاب سابقين'
            },
            
            // ===== التيليجرام =====
            {
                patterns: ['تيليجرام', 'تلجرام', 'telegram', 'قناة', 'القناة', 'مجموعة'],
                answer: '📱 قنوات التيليجرام:\n\n💻 كلية الحوسبة: @computingg\n🔍 ابحث عن المادة بالهاشتاق\n\nمثال: #ObjectOrientedProgramming\n\n💡 القناة تحتوي على ملخصات ومصادر مفيدة!'
            },
            
            // ===== المستويات =====
            {
                patterns: ['المستوى', 'مستويات', 'ترتيب المواد', 'السنة', 'الفصل'],
                answer: 'ترتيب المواد حسب المستوى:\n\n📗 المستوى الثاني (200) - مواد تأسيسية\n📘 المستوى الثالث (300) - مواد متوسطة\n📙 المستوى الرابع (400) - مواد متقدمة\n\n💡 الرقم الأول في كود المادة يدل على المستوى!'
            },
            
            // ===== الموقع =====
            {
                patterns: ['ما هو الموقع', 'عن الموقع', 'ميزات الموقع', 'ايش الموقع', 'وش الموقع'],
                answer: 'مرحباً بك في Subject Search! 🎓\n\nمنصة طلابية لطلاب الجامعة السعودية الإلكترونية:\n\n🔍 بحث سريع عن المواد\n📚 معلومات تفصيلية عن كل مادة\n🏫 دعم جميع الكليات\n📝 مدونة بمقالات مفيدة\n🔗 روابط قنوات التيليجرام\n⭐ تقييم المواد\n\n💙 الموقع مجاني ومن تطوير طلابي!'
            },
            
            // ===== من نحن =====
            {
                patterns: ['من أنتم', 'من انتم', 'من طور', 'مين سوى', 'المطور', 'من نحن'],
                answer: 'Subject Search 💙\n\nموقع طلابي تطوعي لمساعدة طلاب الجامعة السعودية الإلكترونية.\n\n🎯 هدفنا: تسهيل الوصول لمعلومات المواد\n👥 الفريق: طلاب متطوعون\n⚠️ غير تابع رسمياً للجامعة\n\n📄 للمزيد: /page/about.html'
            },
            
            // ===== التسجيل =====
            {
                patterns: ['تسجيل', 'حساب', 'تسجيل الدخول', 'إنشاء حساب'],
                answer: 'نظام الحسابات:\n\n👤 يمكنك تسجيل الدخول أو إنشاء حساب جديد\n⭐ الحساب يتيح لك: تقييم المواد، حفظ المفضلة، إضافة مواد\n🔒 بياناتك آمنة ومحمية\n\n💡 اضغط على أيقونة الحساب في الأعلى!'
            },
            
            // ===== التقييم =====
            {
                patterns: ['التقييم', 'تقييم', 'أقيم', 'كيف اقيم'],
                answer: 'نظام تقييم المواد:\n\n⭐ يمكنك تقييم أي مادة من 1 إلى 5 نجوم\n📝 شارك رأيك لمساعدة زملائك\n👥 التقييمات من طلاب حقيقيين\n\n💡 ادخل صفحة المادة واضغط على النجوم!'
            },
            
            // ===== مواد محددة =====
            {
                patterns: ['oop', 'object oriented', 'برمجة كائنية'],
                answer: 'مادة البرمجة كائنية التوجه (OOP):\n\n📚 الأكواد: CS230 | DS230 | IT232\n📖 المحتوى: الكلاسات، الوراثة، التغليف، التعدد الشكلي\n💻 اللغة: Java\n\n📝 شرح مشروع OOP:\n/page/Blogs/static/OOP_project.html'
            },
            {
                patterns: ['database', 'قواعد البيانات', 'sql'],
                answer: 'مادة قواعد البيانات:\n\n📚 الأكواد: CS350 | DS350 | IT244\n📖 المحتوى: SQL، تصميم قواعد البيانات، ER Model\n💾 الأدوات: MySQL, Oracle'
            },
            {
                patterns: ['ai', 'الذكاء الاصطناعي', 'ذكاء اصطناعي', 'machine learning'],
                answer: 'مادة الذكاء الاصطناعي:\n\n📚 الأكواد: CS362 | DS363\n📖 المحتوى: الشبكات العصبية، التعلم الآلي، الخوارزميات الذكية\n🤖 مادة متقدمة ومطلوبة!'
            },
            {
                patterns: ['networks', 'شبكات', 'الشبكات'],
                answer: 'مادة شبكات الحاسب:\n\n📚 الأكواد: CS360 | DS360 | IT351\n📖 المحتوى: OSI, TCP/IP, البروتوكولات، التوجيه\n🌐 أساسية لتخصص IT!'
            },
            {
                patterns: ['data structure', 'هياكل البيانات'],
                answer: 'مادة هياكل البيانات:\n\n📚 الأكواد: CS240 | DS240 | IT245\n📖 المحتوى: Lists, Stacks, Queues, Trees, Graphs\n⚡ تحليل الكفاءة باستخدام Big-O'
            },
            
            // ===== التحيات =====
            {
                patterns: ['مرحبا', 'هلا', 'السلام', 'أهلا', 'اهلا', 'هاي', 'hi', 'hello', 'سلام', 'هلو', 'هالو', 'كيفك', 'كيف حالك', 'صباح الخير', 'مساء الخير'],
                answer: 'أهلاً وسهلاً! 👋\n\nكيف يمكنني مساعدتك؟\n\nيمكنني مساعدتك في:\n• البحث عن المواد والتخصصات\n• معلومات الكليات\n• الشروحات والمدونة\n• الأسئلة الشائعة'
            },
            {
                patterns: ['شكرا', 'شكراً', 'thanks', 'مشكور', 'تسلم', 'يعطيك العافية', 'الله يعطيك العافية', 'جزاك الله'],
                answer: 'العفو! 😊\n\nسعيد بمساعدتك. إذا كان لديك أي سؤال آخر، لا تتردد!'
            },
            
            // ===== المساعدة =====
            {
                patterns: ['مساعدة', 'ساعدني', 'help', 'أحتاج مساعدة', 'احتاج مساعدة', 'ممكن مساعدة', 'ابغى مساعدة', 'ابي مساعدة', 'عندي سؤال', 'سؤال', 'استفسار'],
                answer: 'كيف يمكنني مساعدتك؟ 🤝\n\nيمكنني الإجابة عن:\n\n🔍 البحث عن المواد\n🏫 معلومات الكليات والتخصصات\n📱 قنوات التيليجرام\n📝 الشروحات والمدونة\n⭐ نظام التقييم\n👤 الحسابات والتسجيل\n❓ الأسئلة الشائعة\n\n💬 اكتب سؤالك وسأساعدك!'
            },
            
            // ===== أسئلة شائعة =====
            {
                patterns: ['أسئلة شائعة', 'اسئلة شائعة', 'faq'],
                answer: '❓ الأسئلة الشائعة:\n\n1️⃣ كيف أضيف مادة لم أجدها؟\n2️⃣ كيف أحذف حسابي؟\n3️⃣ كيف أبلّغ عن خطأ؟\n4️⃣ هل المنصة تابعة للجامعة؟\n5️⃣ كيف أبحث عن مادة؟\n6️⃣ ما هي الكليات المدعومة؟\n\n💬 اختر سؤالك أو اكتبه!'
            },
            
            // ===== المشاكل =====
            {
                patterns: ['مشكلة', 'خطأ', 'لا يعمل', 'ما يشتغل', 'bug'],
                answer: 'إذا واجهت مشكلة:\n\n🔄 جرب تحديث الصفحة\n🌐 تأكد من اتصال الإنترنت\n🗑️ امسح الكاش (Ctrl+Shift+R)\n\n📞 للإبلاغ: @computingg'
            },
            
            // ===== الخصوصية =====
            {
                patterns: ['الخصوصية', 'سياسة الخصوصية', 'بياناتي'],
                answer: 'سياسة الخصوصية:\n\n🔒 نحترم خصوصيتك\n📄 لا نشارك معلوماتك مع أطراف خارجية\n\n📄 التفاصيل: /page/privacy.html'
            }
        ],
        
        // الأزرار السريعة
        quickActions: [
            { text: '📚 بحث عن مادة', query: 'كيف أبحث عن مادة' },
            { text: '🏫 الكليات', query: 'ما هي الكليات' },
            { text: '❓ أسئلة شائعة', query: 'أسئلة شائعة' },
            { text: '📱 التيليجرام', query: 'قناة التيليجرام' }
        ],
        
        // اقتراحات الكتابة
        writingSuggestions: [
            'شروحات CS230',
            'مادة OOP',
            'كلية الحوسبة',
            'كلية الأعمال',
            'كلية الصحة',
            'كيف أضيف مادة',
            'هل المنصة رسمية',
            'قناة التيليجرام',
            'شبكات الحاسب',
            'قواعد البيانات',
            'الذكاء الاصطناعي',
            'مدونة الموقع'
        ]
    };

    // ==================== كلاس الشات بوت ====================
    class SEUChatbot {
        constructor() {
            this.isOpen = false;
            this.isTyping = false;
            this.init();
        }

        init() {
            this.loadCoursesData();
            this.createChatbotHTML();
            this.attachEventListeners();
        }

        async loadCoursesData() {
            try {
                const paths = ['course_data.json', '/course_data.json', '../course_data.json', '../../course_data.json'];
                for (const path of paths) {
                    try {
                        const response = await fetch(path);
                        if (response.ok) {
                            coursesData = await response.json();
                            console.log('✅ تم تحميل بيانات المواد:', coursesData.length);
                            break;
                        }
                    } catch (e) { continue; }
                }
            } catch (error) {
                console.log('⚠️ لم يتم تحميل بيانات المواد');
            }
        }

        createChatbotHTML() {
            const toggleBtn = document.createElement('button');
            toggleBtn.className = 'chatbot-toggle';
            toggleBtn.id = 'chatbot-toggle';
            toggleBtn.innerHTML = `
                <svg class="chat-bubble-svg" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2C6.48 2 2 6.48 2 12C2 14.85 3.2 17.4 5.14 19.17L4 22L7.83 20.42C9.1 20.81 10.52 21 12 21C17.52 21 22 16.52 22 11C22 6.48 17.52 2 12 2Z"/>
                </svg>
                <i class="fas fa-times"></i>
            `;
            toggleBtn.setAttribute('aria-label', 'فتح المساعد');
            
            const container = document.createElement('div');
            container.className = 'chatbot-container';
            container.id = 'chatbot-container';
            container.innerHTML = `
                <div class="chatbot-header">
                    <button class="chatbot-close" id="chatbot-close" aria-label="إغلاق">
                        <i class="fas fa-times"></i>
                    </button>
                    <div class="chatbot-header-info">
                        <div class="chatbot-avatar">
                            <i class="fas fa-headset"></i>
                        </div>
                        <div class="chatbot-title-area">
                            <div class="chatbot-title">مساعد بحث المواد</div>
                            <div class="chatbot-status"><span class="status-dot"></span> متصل للمساعدة</div>
                        </div>
                    </div>
                </div>
                <div class="chatbot-messages" id="chatbot-messages"></div>
                <div class="chatbot-input-area">
                    <div class="chatbot-suggestions" id="chatbot-suggestions"></div>
                    <button class="chatbot-send" id="chatbot-send" aria-label="إرسال">
                        <i class="fas fa-paper-plane"></i>
                    </button>
                    <input type="text" class="chatbot-input" id="chatbot-input" 
                           placeholder="اكتب سؤالك هنا..." autocomplete="off">
                </div>
            `;
            
            document.body.appendChild(toggleBtn);
            document.body.appendChild(container);
            
            this.showWelcomeMessage();
        }

        attachEventListeners() {
            const toggleBtn = document.getElementById('chatbot-toggle');
            const closeBtn = document.getElementById('chatbot-close');
            const sendBtn = document.getElementById('chatbot-send');
            const input = document.getElementById('chatbot-input');
            const container = document.getElementById('chatbot-container');

            if (toggleBtn) toggleBtn.addEventListener('click', () => this.toggle());
            if (closeBtn) closeBtn.addEventListener('click', () => this.close());
            if (sendBtn) sendBtn.addEventListener('click', () => this.sendMessage());
            
            if (input) {
                input.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter') {
                        this.hideSuggestions();
                        this.sendMessage();
                    }
                });
                
                // اقتراحات الكتابة
                input.addEventListener('input', (e) => {
                    this.showSuggestions(e.target.value);
                });
                
                input.addEventListener('focus', () => {
                    if (input.value.length > 0) {
                        this.showSuggestions(input.value);
                    }
                });
                
                input.addEventListener('blur', () => {
                    setTimeout(() => this.hideSuggestions(), 200);
                });
            }

            document.addEventListener('click', (e) => {
                if (this.isOpen && container && toggleBtn && 
                    !container.contains(e.target) && !toggleBtn.contains(e.target)) {
                    this.close();
                }
            });
        }
        
        showSuggestions(text) {
            const suggestionsContainer = document.getElementById('chatbot-suggestions');
            if (!suggestionsContainer || !text || text.length < 1) {
                this.hideSuggestions();
                return;
            }
            
            const normalizedText = this.normalizeText(text);
            const suggestions = knowledgeBase.writingSuggestions.filter(s => 
                this.normalizeText(s).includes(normalizedText) && s !== text
            ).slice(0, 5);
            
            if (suggestions.length === 0) {
                this.hideSuggestions();
                return;
            }
            
            suggestionsContainer.innerHTML = suggestions.map(s => 
                `<div class="suggestion-item" data-suggestion="${s}"><i class="fas fa-search"></i>${s}</div>`
            ).join('');
            
            suggestionsContainer.classList.add('show');
            
            // إضافة أحداث النقر
            suggestionsContainer.querySelectorAll('.suggestion-item').forEach(item => {
                item.addEventListener('click', () => {
                    const input = document.getElementById('chatbot-input');
                    if (input) {
                        input.value = item.dataset.suggestion;
                        this.hideSuggestions();
                        this.sendMessage();
                    }
                });
            });
        }
        
        hideSuggestions() {
            const suggestionsContainer = document.getElementById('chatbot-suggestions');
            if (suggestionsContainer) {
                suggestionsContainer.classList.remove('show');
            }
        }

        toggle() {
            this.isOpen ? this.close() : this.open();
        }

        open() {
            const container = document.getElementById('chatbot-container');
            const toggleBtn = document.getElementById('chatbot-toggle');
            
            if (container) container.classList.add('show');
            if (toggleBtn) toggleBtn.classList.add('active');
            this.isOpen = true;
            
            setTimeout(() => {
                const input = document.getElementById('chatbot-input');
                if (input) input.focus();
            }, 300);
        }

        close() {
            const container = document.getElementById('chatbot-container');
            const toggleBtn = document.getElementById('chatbot-toggle');
            
            if (container) container.classList.remove('show');
            if (toggleBtn) toggleBtn.classList.remove('active');
            this.isOpen = false;
        }

        showWelcomeMessage() {
            const messagesContainer = document.getElementById('chatbot-messages');
            if (!messagesContainer) return;
            
            const time = this.getCurrentTime();
            
            messagesContainer.innerHTML = `
                <div class="chat-message bot">
                    <div class="message-avatar"><i class="fas fa-headset"></i></div>
                    <div class="message-wrapper">
                        <div class="message-content">
                            مرحباً بك! 👋
                            <br><br>
                            <strong>كيف يمكنني مساعدتك؟</strong>
                            <br><br>
                            أنا هنا لمساعدتك في البحث عن المواد، الكليات، والإجابة على أسئلتك حول الموقع.
                        </div>
                        <div class="message-time">${time}</div>
                        <div class="quick-actions">
                            ${knowledgeBase.quickActions.map(qa => 
                                `<button class="quick-action-btn" data-query="${qa.query}">${qa.text}</button>`
                            ).join('')}
                        </div>
                    </div>
                </div>
            `;
            
            this.attachQuickActionEvents();
        }

        attachQuickActionEvents() {
            document.querySelectorAll('.quick-action-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    const query = btn.dataset.query;
                    const input = document.getElementById('chatbot-input');
                    if (input && query) {
                        input.value = query;
                        this.sendMessage();
                    }
                });
            });
        }

        getCurrentTime() {
            const now = new Date();
            let hours = now.getHours();
            const minutes = now.getMinutes().toString().padStart(2, '0');
            const ampm = hours >= 12 ? 'م' : 'ص';
            hours = hours % 12 || 12;
            return `${hours}:${minutes} ${ampm}`;
        }

        async sendMessage() {
            const input = document.getElementById('chatbot-input');
            if (!input) return;
            
            const message = input.value.trim();
            if (!message || this.isTyping) return;
            
            this.addMessage(message, 'user');
            input.value = '';
            
            this.showTypingIndicator();
            
            setTimeout(() => {
                this.hideTypingIndicator();
                const response = this.processMessage(message);
                this.addMessage(response, 'bot');
            }, 500 + Math.random() * 500);
        }

        addMessage(content, type) {
            const messagesContainer = document.getElementById('chatbot-messages');
            if (!messagesContainer) return;
            
            const time = this.getCurrentTime();
            const formattedContent = this.formatMessage(content);
            const icon = type === 'bot' ? 'fa-headset' : 'fa-user';
            
            const messageDiv = document.createElement('div');
            messageDiv.className = `chat-message ${type}`;
            messageDiv.innerHTML = `
                <div class="message-avatar"><i class="fas ${icon}"></i></div>
                <div class="message-wrapper">
                    <div class="message-content">${formattedContent}</div>
                    <div class="message-time">${time}</div>
                </div>
            `;
            
            messagesContainer.appendChild(messageDiv);
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }

        formatMessage(text) {
            return text
                .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                .replace(/\n/g, '<br>');
        }

        showTypingIndicator() {
            this.isTyping = true;
            const messagesContainer = document.getElementById('chatbot-messages');
            if (!messagesContainer) return;
            
            const typingDiv = document.createElement('div');
            typingDiv.className = 'chat-message bot';
            typingDiv.id = 'typing-indicator';
            typingDiv.innerHTML = `
                <div class="message-avatar"><i class="fas fa-headset"></i></div>
                <div class="message-wrapper">
                    <div class="typing-indicator">
                        <span></span><span></span><span></span>
                    </div>
                </div>
            `;
            
            messagesContainer.appendChild(typingDiv);
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }

        hideTypingIndicator() {
            this.isTyping = false;
            const indicator = document.getElementById('typing-indicator');
            if (indicator) indicator.remove();
        }

        // ==================== معالجة الرسائل ====================
        processMessage(message) {
            const normalizedMsg = this.normalizeText(message);
            
            // 1. البحث في قاعدة المعرفة
            for (const item of knowledgeBase.responses) {
                for (const pattern of item.patterns) {
                    const normalizedPattern = this.normalizeText(pattern);
                    if (normalizedMsg.includes(normalizedPattern) || 
                        this.fuzzyMatch(normalizedMsg, normalizedPattern)) {
                        return item.answer;
                    }
                }
            }
            
            // 2. البحث عن مادة بالكود
            const codeResult = this.searchByCode(message);
            if (codeResult) return codeResult;
            
            // 3. البحث عن مادة بالاسم
            const courseResult = this.searchCourse(message);
            if (courseResult) return courseResult;
            
            // 4. البحث عن كلية
            const collegeResult = this.searchCollege(message);
            if (collegeResult) return collegeResult;
            
            // 5. البحث عن شرح/مدونة
            const tutorialResult = this.searchTutorial(message);
            if (tutorialResult) return tutorialResult;
            
            // 6. إجابة افتراضية ذكية
            return this.getSmartDefaultResponse(message);
        }

        normalizeText(text) {
            return text
                .toLowerCase()
                .replace(/[أإآا]/g, 'ا')
                .replace(/[ؤئ]/g, 'ء')
                .replace(/ة/g, 'ه')
                .replace(/ى/g, 'ي')
                .replace(/[^\w\s\u0600-\u06FF]/g, '')
                .trim();
        }

        fuzzyMatch(text, pattern) {
            const words = pattern.split(/\s+/);
            return words.every(word => text.includes(word));
        }

        searchByCode(query) {
            const codePattern = /([A-Z]{2,4})\s*(\d{3})/i;
            const match = query.match(codePattern);
            
            if (match) {
                const prefix = match[1].toUpperCase();
                const number = match[2];
                
                for (const course of coursesData) {
                    if ((course.CS === number && prefix === 'CS') ||
                        (course.DS === number && prefix === 'DS') ||
                        (course.IT === number && prefix === 'IT') ||
                        (course.MATH === number && prefix === 'MATH') ||
                        (course.SCI === number && prefix === 'SCI')) {
                        return this.formatCourseResponse(course);
                    }
                }
                return `عذراً، لم أجد مادة بالكود ${prefix}${number} 😕\n\nجرب البحث باسم المادة!`;
            }
            
            const numberMatch = query.match(/\d{3}/);
            if (numberMatch) {
                const number = numberMatch[0];
                const matched = coursesData.filter(c => 
                    c.CS === number || c.DS === number || c.IT === number || 
                    c.MATH === number || c.SCI === number
                );
                
                if (matched.length === 1) {
                    return this.formatCourseResponse(matched[0]);
                } else if (matched.length > 1) {
                    return `وجدت ${matched.length} مواد بالرقم ${number}:\n\n` +
                        matched.map(c => `📚 ${c.subject_name}`).join('\n') +
                        `\n\n💡 حدد التخصص (مثل: CS${number})`;
                }
            }
            return null;
        }

        searchCourse(query) {
            const normalizedQuery = this.normalizeText(query);
            
            for (const course of coursesData) {
                const nameLower = course.subject_name ? this.normalizeText(course.subject_name) : '';
                const descLower = course.description ? this.normalizeText(course.description) : '';
                
                if (nameLower.includes(normalizedQuery) || 
                    normalizedQuery.includes(nameLower) ||
                    descLower.includes(normalizedQuery)) {
                    return this.formatCourseResponse(course);
                }
            }
            return null;
        }

        searchCollege(query) {
            const normalizedQuery = this.normalizeText(query);
            
            for (const [key, college] of Object.entries(knowledgeBase.colleges)) {
                const collegeName = this.normalizeText(college.name);
                const collegeNameEn = college.nameEn.toLowerCase();
                
                if (normalizedQuery.includes(collegeName) || 
                    normalizedQuery.includes(collegeNameEn) ||
                    normalizedQuery.includes(key)) {
                    
                    let response = `🏫 ${college.name}:\n\n📚 التخصصات:\n`;
                    response += college.majors.map(m => `• ${m.name} (${m.code})`).join('\n');
                    response += `\n\n🔗 الصفحة: ${college.url}`;
                    if (college.telegram) {
                        response += `\n📱 تيليجرام: ${college.telegram}`;
                    }
                    return response;
                }
            }
            return null;
        }

        searchTutorial(query) {
            const normalizedQuery = this.normalizeText(query);
            const keywords = ['شرح', 'تعلم', 'كيف', 'دليل', 'مقال', 'نصائح', 'كتب', 'كود', 'برمجة', 'مشروع'];
            
            if (!keywords.some(k => normalizedQuery.includes(k))) return null;
            
            for (const [key, tutorial] of Object.entries(knowledgeBase.tutorials)) {
                const title = this.normalizeText(tutorial.title);
                const desc = this.normalizeText(tutorial.description);
                
                if (normalizedQuery.includes(title) || normalizedQuery.includes(desc) ||
                    title.includes(normalizedQuery) || desc.includes(normalizedQuery)) {
                    return `📝 ${tutorial.title}:\n\n${tutorial.description}\n\n🔗 الرابط: ${tutorial.url}`;
                }
            }
            
            // إذا سأل عن شروحات عامة
            if (normalizedQuery.includes('شرح') || normalizedQuery.includes('شروحات') || 
                normalizedQuery.includes('كود') || normalizedQuery.includes('برمج')) {
                return '📚 شروحات ومصادر التعلم:\n\n' +
                    '💻 خارطة طريق البرمجة:\n/page/Blogs/static/programming-roadmap.html\n\n' +
                    '📖 مشروع OOP:\n/page/Blogs/static/OOP_project.html\n\n' +
                    '🎯 مشاريع البورتفوليو:\n/page/Blogs/static/portfolio-projects.html\n\n' +
                    '📚 قائمة قراءات CS:\n/page/Blogs/static/cs-reading-list.html\n\n' +
                    '🔗 المزيد في المدونة: /page/Blogs/blogs.html';
            }
            
            return null;
        }

        formatCourseResponse(course, showResources = true) {
            let response = `📚 ${course.subject_name}\n\n`;
            
            const codes = [];
            if (course.CS) codes.push(`CS${course.CS}`);
            if (course.DS) codes.push(`DS${course.DS}`);
            if (course.IT) codes.push(`IT${course.IT}`);
            if (course.MATH) codes.push(`MATH${course.MATH}`);
            if (course.SCI) codes.push(`SCI${course.SCI}`);
            
            if (codes.length > 0) {
                response += `🏷️ الأكواد: ${codes.join(' | ')}\n\n`;
            }
            
            if (course.description) {
                const shortDesc = course.description.length > 100 
                    ? course.description.substring(0, 100) + '...'
                    : course.description;
                response += `📖 ${shortDesc}\n\n`;
            }
            
            // إضافة مصادر المادة التعليمية
            if (showResources) {
                response += `━━━━━━━━━━━━━━━━━━━━\n`;
                response += `📺 الموارد التعليمية:\n\n`;
                
                // فيديوهات يوتيوب
                response += `🎬 فيديوهات تعليمية:\n`;
                response += `   • عادل نسيم - يوتيوب\n`;
                response += `   • محمد الدسوقي - يوتيوب\n\n`;
                
                // ملفات وكتب
                response += `📁 ملفات ومصادر:\n`;
                response += `   • Google Drive - كتب وملفات PDF\n\n`;
                
                // المحاضرات المسجلة
                response += `🎓 المحاضرات المسجلة:\n`;
                response += `   • Blackboard - محاضرات مسجلة\n\n`;
                
                // التيليجرام
                if (course.telegram_search_instruction) {
                    const hashtag = course.telegram_search_instruction.match(/#\w+/);
                    response += `📱 تيليجرام: @computingg\n`;
                    if (hashtag) {
                        response += `   🔍 ابحث بـ: ${hashtag[0]}\n`;
                    }
                }
            }
            
            return response;
        }

        getSmartDefaultResponse(message) {
            const normalizedMsg = this.normalizeText(message);
            
            // الأسئلة العامة عن الكيفية
            if (normalizedMsg.includes('كيف') || normalizedMsg.includes('طريق')) {
                return 'يبدو أنك تسأل عن طريقة عمل شيء ما 🤔\n\nجرب:\n• "كيف أبحث عن مادة"\n• "كيف أضيف مادة"\n• "كيف أصل للتيليجرام"';
            }
            
            // الأسئلة عن المكان
            if (normalizedMsg.includes('اين') || normalizedMsg.includes('وين') || normalizedMsg.includes('فين') || normalizedMsg.includes('مكان')) {
                return 'يبدو أنك تبحث عن شيء 🔍\n\nجرب:\n• البحث في الصفحة الرئيسية\n• تصفح الكليات\n• تصفح المدونة';
            }
            
            // الأسئلة الاستفهامية
            if (normalizedMsg.includes('ما هو') || normalizedMsg.includes('ما هي') || normalizedMsg.includes('ايش') || normalizedMsg.includes('وش')) {
                return 'يبدو أنك تريد معرفة معلومات 📚\n\nجرب السؤال عن:\n• التخصصات والكليات\n• مادة معينة\n• الموقع وميزاته';
            }
            
            // الأسئلة عن الإمكانية
            if (normalizedMsg.includes('ممكن') || normalizedMsg.includes('يمكن') || normalizedMsg.includes('اقدر')) {
                return 'بالتأكيد! 😊\n\nكيف يمكنني مساعدتك؟\nاكتب سؤالك بالتفصيل...';
            }
            
            // إجابة افتراضية أكثر ودية
            return 'عذراً، لم أتمكن من فهم سؤالك تماماً 🤔\n\nلكن يمكنني مساعدتك في:\n• 🔍 البحث عن مادة (اكتب اسمها أو كودها)\n• 🏫 معلومات الكليات والتخصصات\n• 📝 الشروحات والمدونة\n• ❓ الأسئلة الشائعة\n\n💡 جرب صياغة السؤال بطريقة أخرى!';
        }
    }

    // ==================== تشغيل الشات بوت ====================
    function initChatbot() {
        if (window.seuChatbot) return;
        window.seuChatbot = new SEUChatbot();
        console.log('✅ تم تشغيل الشات بوت');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initChatbot);
    } else {
        initChatbot();
    }

})();
