import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// قراءة بيانات المواد
const coursesData = JSON.parse(
  fs.readFileSync(path.join(__dirname, '..', 'course_data.json'), 'utf-8')
);

// Template HTML لكل مادة مع SEO و Structured Data
const generateCourseHTML = (course) => {
  // تحديد كود المادة (CS أو IT أو DS أو MATH أو SCI)
  const courseCode = course.CS || course.IT || course.DS || course.MATH || course.SCI || 'UNKNOWN';
  const majorType = course.CS ? 'CS' : course.IT ? 'IT' : course.DS ? 'DS' : course.MATH ? 'MATH' : course.SCI ? 'SCI' : 'General';
  const majorName = majorType === 'CS' ? 'علوم الحاسب' : 
                    majorType === 'IT' ? 'تقنية المعلومات' : 
                    majorType === 'DS' ? 'علوم البيانات' :
                    majorType === 'MATH' ? 'الرياضيات' :
                    majorType === 'SCI' ? 'العلوم' : 'عام';
  
  const courseName = course.subject_name;
  const courseDescription = course.description || `تعرف على مقرر ${courseName} في تخصص ${majorName}`;
  const telegramInstruction = course.telegram_search_instruction || '';
  
  // توليد keywords ذكية
  const keywords = [
    courseName,
    `${majorType}${courseCode}`,
    majorName,
    'الجامعة السعودية الإلكترونية',
    'كلية الحوسبة',
    'SEU',
    'Saudi Electronic University',
    'مواد جامعية',
    'تعليم إلكتروني',
    'منصة تعليمية',
    ...courseName.split(' ')
  ].join(', ');

  return `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  
  <!-- SEO Meta Tags -->
  <title>${courseName} (${majorType}${courseCode}) | الجامعة السعودية الإلكترونية</title>
  <meta name="description" content="${courseDescription}">
  <meta name="keywords" content="${keywords}">
  <meta name="author" content="كلية الحوسبة - الجامعة السعودية الإلكترونية">
  <meta name="robots" content="index, follow">
  <meta name="language" content="Arabic">
  
  <!-- Open Graph / Facebook -->
  <meta property="og:type" content="website">
  <meta property="og:url" content="https://subjectsearch.tech/course/${courseCode}.html">
  <meta property="og:title" content="${courseName} (${majorType}${courseCode})">
  <meta property="og:description" content="${courseDescription}">
  <meta property="og:site_name" content="الجامعة السعودية الإلكترونية">
  <meta property="og:locale" content="ar_SA">
  <meta property="og:image" content="https://subjectsearch.tech/assets/logo.JPG">
  
  <!-- Twitter -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:url" content="https://subjectsearch.tech/course/${courseCode}.html">
  <meta name="twitter:title" content="${courseName} (${majorType}${courseCode})">
  <meta name="twitter:description" content="${courseDescription}">
  <meta name="twitter:image" content="https://subjectsearch.tech/assets/logo.JPG">
  
  <!-- Canonical URL -->
  <link rel="canonical" href="https://subjectsearch.tech/course/${courseCode}.html">
  
  <!-- Structured Data (Schema.org) -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "Course",
    "name": "${courseName}",
    "description": "${courseDescription}",
    "provider": {
      "@type": "EducationalOrganization",
      "name": "الجامعة السعودية الإلكترونية",
      "sameAs": "https://www.seu.edu.sa"
    },
    "courseCode": "${majorType}${courseCode}",
    "educationalLevel": "UndergraduateLevel",
    "inLanguage": "ar",
    "about": {
      "@type": "Thing",
      "name": "${majorName}"
    },
    "teaches": "${courseName}",
    "audience": {
      "@type": "EducationalAudience",
      "educationalRole": "student"
    },
    "hasCourseInstance": {
      "@type": "CourseInstance",
      "courseMode": "blended",
      "courseWorkload": "PT3H"
    }
  }
  </script>
  
  <!-- Google Analytics -->
  <script async src="https://www.googletagmanager.com/gtag/js?id=G-Y2FL6V8X3L"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-Y2FL6V8X3L');
  </script>
  
  <!-- Styles -->
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700&family=Tajawal:wght@400;500;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    :root {
      --primary: #0F0F1A;
      --secondary: #1A1A2E;
      --accent: #6C63FF;
      --text: #E0E0FF;
    }

    body {
      font-family: 'Cairo', 'Tajawal', sans-serif;
      background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 50%, #2D2D4D 100%);
      color: var(--text);
      min-height: 100vh;
      scroll-behavior: smooth;
    }
    
    .gradient-text {
      background: linear-gradient(90deg, var(--accent) 0%, #A5A6FF 50%, #00D1B2 100%);
      -webkit-background-clip: text;
      background-clip: text;
      color: transparent;
      background-size: 200% auto;
      animation: gradient 8s ease infinite;
    }
    
    @keyframes gradient {
      0%, 100% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
    }
    
    .glass-card {
      background: rgba(26, 26, 46, 0.6);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      border: 1px solid rgba(109, 99, 255, 0.2);
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
      transition: all 0.3s ease;
    }
    
    .glass-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 24px rgba(109, 99, 255, 0.2);
    }
    
    .resource-card {
      background: linear-gradient(135deg, rgba(108, 99, 255, 0.1) 0%, rgba(0, 209, 178, 0.1) 100%);
      border: 1px solid rgba(109, 99, 255, 0.3);
      border-radius: 12px;
      padding: 20px;
      margin: 16px 0;
      transition: all 0.3s ease;
    }
    
    .resource-card:hover {
      transform: translateX(5px);
      border-color: rgba(109, 99, 255, 0.5);
      box-shadow: 0 8px 24px rgba(108, 99, 255, 0.2);
    }
    
    .btn-primary {
      background: linear-gradient(135deg, var(--accent) 0%, #00D1B2 100%);
      color: white;
      padding: 12px 32px;
      border-radius: 8px;
      font-weight: 600;
      transition: all 0.3s ease;
      border: none;
      cursor: pointer;
    }
    
    .btn-primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 20px rgba(108, 99, 255, 0.3);
    }
    
    .breadcrumb {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 24px;
      color: rgba(224, 224, 255, 0.7);
    }
    
    .breadcrumb a {
      color: var(--accent);
      text-decoration: none;
      transition: color 0.3s;
    }
    
    .breadcrumb a:hover {
      color: #00D1B2;
    }
  </style>
</head>
<body class="p-4 md:p-8">
  <!-- Navigation -->
  <nav class="glass-card rounded-2xl p-6 mb-8">
    <div class="flex items-center justify-between">
      <a href="/" class="text-2xl font-bold gradient-text">
        <i class="fas fa-graduation-cap ml-2"></i>
        الجامعة السعودية الإلكترونية
      </a>
      <a href="/" class="btn-primary">
        <i class="fas fa-home ml-2"></i>
        الصفحة الرئيسية
      </a>
    </div>
  </nav>

  <!-- Main Content -->
  <main class="max-w-6xl mx-auto">
    <!-- Breadcrumb -->
    <div class="breadcrumb">
      <a href="/"><i class="fas fa-home"></i> الرئيسية</a>
      <span>/</span>
      <a href="/#courses">المواد</a>
      <span>/</span>
      <span>${courseName}</span>
    </div>

    <!-- Course Header -->
    <div class="glass-card rounded-3xl p-8 md:p-12 mb-8">
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-6">
        <div class="flex-1">
          <div class="flex items-center gap-3 mb-4">
            <span class="bg-gradient-to-r from-purple-500 to-cyan-500 text-white px-4 py-2 rounded-full text-sm font-bold">
              ${majorType}${courseCode}
            </span>
            <span class="bg-gradient-to-r from-cyan-500 to-teal-500 text-white px-4 py-2 rounded-full text-sm font-bold">
              ${majorName}
            </span>
          </div>
          <h1 class="text-4xl md:text-5xl font-bold gradient-text mb-4">
            ${courseName}
          </h1>
          <p class="text-lg md:text-xl text-stardust/80 leading-relaxed">
            ${courseDescription}
          </p>
        </div>
        <div class="text-6xl text-purple-400">
          <i class="fas fa-book-open"></i>
        </div>
      </div>
    </div>

    <!-- Resources Section -->
    <div class="glass-card rounded-3xl p-8 md:p-12 mb-8">
      <h2 class="text-3xl font-bold gradient-text mb-6">
        <i class="fas fa-folder-open ml-2"></i>
        المصادر التعليمية
      </h2>
      
      ${telegramInstruction ? `
      <div class="resource-card">
        <div class="flex items-center gap-4">
          <div class="text-4xl text-cyan-400">
            <i class="fab fa-telegram"></i>
          </div>
          <div class="flex-1">
            <h3 class="text-xl font-bold mb-2">قناة تليجرام</h3>
            <p class="text-stardust/70 mb-3">${telegramInstruction}</p>
            <a href="https://t.me/computingg" target="_blank" class="btn-primary inline-block">
              <i class="fab fa-telegram ml-2"></i>
              انتقل إلى القناة
            </a>
          </div>
        </div>
      </div>
      ` : ''}
      
      <div class="resource-card">
        <div class="flex items-center gap-4">
          <div class="text-4xl text-green-400">
            <i class="fas fa-chalkboard-teacher"></i>
          </div>
          <div class="flex-1">
            <h3 class="text-xl font-bold mb-2">بلاك بورد</h3>
            <p class="text-stardust/70 mb-3">منصة التعليم الإلكتروني الرسمية للجامعة</p>
            <a href="https://lms.seu.edu.sa" target="_blank" class="btn-primary inline-block">
              <i class="fas fa-external-link-alt ml-2"></i>
              فتح البلاك بورد
            </a>
          </div>
        </div>
      </div>
      
      <div class="resource-card">
        <div class="flex items-center gap-4">
          <div class="text-4xl text-yellow-400">
            <i class="fab fa-youtube"></i>
          </div>
          <div class="flex-1">
            <h3 class="text-xl font-bold mb-2">فيديوهات تعليمية</h3>
            <p class="text-stardust/70 mb-3">شروحات ومحاضرات على يوتيوب</p>
            <a href="https://www.youtube.com/results?search_query=${encodeURIComponent(courseName + ' ' + majorType + courseCode)}" target="_blank" class="btn-primary inline-block">
              <i class="fab fa-youtube ml-2"></i>
              بحث في يوتيوب
            </a>
          </div>
        </div>
      </div>
    </div>

    <!-- Related Courses -->
    <div class="glass-card rounded-3xl p-8 md:p-12">
      <h2 class="text-3xl font-bold gradient-text mb-6">
        <i class="fas fa-link ml-2"></i>
        مواد ذات صلة
      </h2>
      <div class="text-center text-stardust/70">
        <p class="mb-4">ارجع إلى الصفحة الرئيسية لاستكشاف المزيد من المواد</p>
        <a href="/" class="btn-primary">
          <i class="fas fa-arrow-right ml-2"></i>
          تصفح جميع المواد
        </a>
      </div>
    </div>
  </main>

  <!-- Footer -->
  <footer class="mt-16 text-center text-stardust/70 pb-8">
    <p class="mb-2">© 2024 الجامعة السعودية الإلكترونية - كلية الحوسبة</p>
    <p class="text-sm">جميع الحقوق محفوظة</p>
  </footer>
</body>
</html>`;
};

// إنشاء مجلد course إذا لم يكن موجوداً
const courseDir = path.join(__dirname, '..', 'course');
if (!fs.existsSync(courseDir)) {
  fs.mkdirSync(courseDir, { recursive: true });
}

// توليد صفحة HTML لكل مادة
let generatedCount = 0;
const generatedFiles = [];

coursesData.forEach(course => {
  const courseCode = course.CS || course.IT || course.DS || course.MATH || course.SCI;
  
  if (courseCode) {
    const fileName = `${courseCode}.html`;
    const filePath = path.join(courseDir, fileName);
    const htmlContent = generateCourseHTML(course);
    
    fs.writeFileSync(filePath, htmlContent, 'utf-8');
    generatedFiles.push({
      code: courseCode,
      name: course.subject_name,
      path: `course/${fileName}`
    });
    generatedCount++;
    console.log(`✅ تم إنشاء: ${fileName} - ${course.subject_name}`);
  }
});

console.log(`\n🎉 تم إنشاء ${generatedCount} صفحة بنجاح!`);
console.log('\n📋 قائمة الصفحات المولدة:');
generatedFiles.forEach(file => {
  console.log(`   ${file.code}: ${file.name}`);
});

// حفظ قائمة الصفحات المولدة لاستخدامها في sitemap
const manifestPath = path.join(courseDir, 'manifest.json');
fs.writeFileSync(manifestPath, JSON.stringify(generatedFiles, null, 2), 'utf-8');
console.log('\n💾 تم حفظ قائمة الصفحات في course/manifest.json');
