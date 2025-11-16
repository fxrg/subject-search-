import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// قراءة ملفات HTML الخاصة بالكليات لاستخراج البيانات
const healthHTMLPath = path.join(__dirname, '..', 'page', 'all-colleges', 'health', 'health.html');
const businessHTMLPath = path.join(__dirname, '..', 'page', 'all-colleges', 'business', 'business.html');

// بيانات الكليات (يمكن توسيعها مستقبلاً)
const colleges = [
  {
    id: 'health',
    name: 'كلية الصحة',
    nameEn: 'College of Health Sciences',
    path: 'page/all-colleges/health',
    color: '#10b981', // green
    icon: 'fa-heartbeat',
    courses: [
      {
        code: 'HCI111',
        name: 'مقدمة في المعلوماتية الصحية',
        description: 'مقدمة شاملة لمفاهيم المعلوماتية الصحية وتطبيقاتها في النظام الصحي',
        credits: 3,
        level: 1
      },
      {
        code: 'HCI112',
        name: 'أنظمة المعلومات الصحية',
        description: 'دراسة أنظمة المعلومات الصحية وإدارة البيانات الطبية',
        credits: 3,
        level: 1
      },
      {
        code: 'PHC101',
        name: 'الصحة العامة',
        description: 'أساسيات الصحة العامة والوقاية من الأمراض',
        credits: 3,
        level: 1
      },
      {
        code: 'BIOL101',
        name: 'علم الأحياء',
        description: 'مبادئ علم الأحياء والخلايا والأنسجة',
        credits: 3,
        level: 1
      }
    ]
  },
  {
    id: 'business',
    name: 'كلية العلوم الإدارية والمالية',
    nameEn: 'College of Administrative and Financial Sciences',
    path: 'page/all-colleges/business',
    color: '#f59e0b', // amber
    icon: 'fa-briefcase',
    courses: [
      {
        code: 'MGT101',
        name: 'مبادئ الإدارة',
        description: 'أساسيات علم الإدارة والتنظيم ووظائف المدير',
        credits: 3,
        level: 1
      },
      {
        code: 'ECOM101',
        name: 'التجارة الإلكترونية',
        description: 'مفاهيم التجارة الإلكترونية ونماذج الأعمال الرقمية',
        credits: 3,
        level: 1
      },
      {
        code: 'ACCT101',
        name: 'مبادئ المحاسبة',
        description: 'أساسيات المحاسبة المالية والقوائم المالية',
        credits: 3,
        level: 1
      },
      {
        code: 'ECON101',
        name: 'مبادئ الاقتصاد',
        description: 'مقدمة في علم الاقتصاد والعرض والطلب',
        credits: 3,
        level: 1
      }
    ]
  }
];

// Template HTML لصفحة مادة في كلية
const generateCollegeCourseHTML = (college, course) => {
  return `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  
  <!-- SEO Meta Tags -->
  <title>${course.name} (${course.code}) | ${college.name}</title>
  <meta name="description" content="${course.description} - مادة من ${college.name} في الجامعة السعودية الإلكترونية">
  <meta name="keywords" content="${course.name}, ${course.code}, ${college.name}, الجامعة السعودية الإلكترونية, SEU, مواد جامعية">
  <meta name="author" content="${college.name} - الجامعة السعودية الإلكترونية">
  <meta name="robots" content="index, follow">
  <meta name="language" content="Arabic">
  
  <!-- Open Graph / Facebook -->
  <meta property="og:type" content="website">
  <meta property="og:url" content="https://subjectsearch.tech/${college.path}/${course.code}.html">
  <meta property="og:title" content="${course.name} (${course.code})">
  <meta property="og:description" content="${course.description}">
  <meta property="og:site_name" content="الجامعة السعودية الإلكترونية">
  <meta property="og:locale" content="ar_SA">
  <meta property="og:image" content="https://subjectsearch.tech/assets/logo.JPG">
  
  <!-- Twitter -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:url" content="https://subjectsearch.tech/${college.path}/${course.code}.html">
  <meta name="twitter:title" content="${course.name} (${course.code})">
  <meta name="twitter:description" content="${course.description}">
  <meta name="twitter:image" content="https://subjectsearch.tech/assets/logo.JPG">
  
  <!-- Canonical URL -->
  <link rel="canonical" href="https://subjectsearch.tech/${college.path}/${course.code}.html">
  
  <!-- Structured Data (Schema.org) -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "Course",
    "name": "${course.name}",
    "description": "${course.description}",
    "provider": {
      "@type": "EducationalOrganization",
      "name": "الجامعة السعودية الإلكترونية - ${college.name}",
      "sameAs": "https://www.seu.edu.sa"
    },
    "courseCode": "${course.code}",
    "educationalLevel": "UndergraduateLevel",
    "inLanguage": "ar",
    "about": {
      "@type": "Thing",
      "name": "${college.nameEn}"
    },
    "teaches": "${course.name}",
    "audience": {
      "@type": "EducationalAudience",
      "educationalRole": "student"
    },
    "hasCourseInstance": {
      "@type": "CourseInstance",
      "courseMode": "blended",
      "courseWorkload": "PT${course.credits}H"
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
      --accent: ${college.color};
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
    
    .btn-primary {
      background: linear-gradient(135deg, var(--accent) 0%, #00D1B2 100%);
      color: white;
      padding: 12px 32px;
      border-radius: 8px;
      font-weight: 600;
      transition: all 0.3s ease;
      border: none;
      cursor: pointer;
      text-decoration: none;
      display: inline-block;
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
      <a href="/${college.path}/${college.id}.html" class="btn-primary">
        <i class="fas fa-arrow-right ml-2"></i>
        ${college.name}
      </a>
    </div>
  </nav>

  <!-- Main Content -->
  <main class="max-w-6xl mx-auto">
    <!-- Breadcrumb -->
    <div class="breadcrumb">
      <a href="/"><i class="fas fa-home"></i> الرئيسية</a>
      <span>/</span>
      <a href="/page/all-colleges/all-colleges.html">جميع الكليات</a>
      <span>/</span>
      <a href="/${college.path}/${college.id}.html">${college.name}</a>
      <span>/</span>
      <span>${course.name}</span>
    </div>

    <!-- Course Header -->
    <div class="glass-card rounded-3xl p-8 md:p-12 mb-8">
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-6">
        <div class="flex-1">
          <div class="flex items-center gap-3 mb-4">
            <span class="bg-gradient-to-r from-purple-500 to-cyan-500 text-white px-4 py-2 rounded-full text-sm font-bold">
              ${course.code}
            </span>
            <span class="bg-gradient-to-r from-cyan-500 to-teal-500 text-white px-4 py-2 rounded-full text-sm font-bold">
              ${course.credits} ساعات
            </span>
            <span class="bg-gradient-to-r from-pink-500 to-orange-500 text-white px-4 py-2 rounded-full text-sm font-bold">
              المستوى ${course.level}
            </span>
          </div>
          <h1 class="text-4xl md:text-5xl font-bold gradient-text mb-4">
            ${course.name}
          </h1>
          <p class="text-lg md:text-xl text-stardust/80 leading-relaxed">
            ${course.description}
          </p>
        </div>
        <div class="text-6xl" style="color: ${college.color};">
          <i class="${college.icon}"></i>
        </div>
      </div>
      
      <div class="mt-8 p-6 bg-gradient-to-r from-purple-500/10 to-cyan-500/10 rounded-2xl border border-purple-500/20">
        <h3 class="text-xl font-bold mb-3 flex items-center gap-2">
          <i class="fas fa-info-circle" style="color: ${college.color};"></i>
          معلومات المادة
        </h3>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-stardust/80">
          <div>
            <span class="font-bold">الكود:</span> ${course.code}
          </div>
          <div>
            <span class="font-bold">الساعات:</span> ${course.credits} ساعات معتمدة
          </div>
          <div>
            <span class="font-bold">المستوى:</span> ${course.level}
          </div>
        </div>
      </div>
    </div>

    <!-- Resources Section -->
    <div class="glass-card rounded-3xl p-8 md:p-12 mb-8">
      <h2 class="text-3xl font-bold gradient-text mb-6">
        <i class="fas fa-folder-open ml-2"></i>
        المصادر التعليمية
      </h2>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Blackboard -->
        <a href="https://lms.seu.edu.sa" target="_blank" class="glass-card p-6 rounded-2xl hover:scale-105 transition group">
          <div class="flex items-center gap-4">
            <div class="text-4xl text-green-400">
              <i class="fas fa-chalkboard-teacher"></i>
            </div>
            <div class="flex-1">
              <h3 class="text-xl font-bold mb-2 group-hover:text-green-400 transition">بلاك بورد</h3>
              <p class="text-stardust/70">منصة التعليم الإلكتروني الرسمية</p>
            </div>
            <i class="fas fa-external-link-alt text-2xl text-purple-400"></i>
          </div>
        </a>

        <!-- Telegram -->
        <a href="https://t.me/computingg" target="_blank" class="glass-card p-6 rounded-2xl hover:scale-105 transition group">
          <div class="flex items-center gap-4">
            <div class="text-4xl text-cyan-400">
              <i class="fab fa-telegram"></i>
            </div>
            <div class="flex-1">
              <h3 class="text-xl font-bold mb-2 group-hover:text-cyan-400 transition">قناة تليجرام</h3>
              <p class="text-stardust/70">مصادر ومراجعات وتجميعات</p>
            </div>
            <i class="fas fa-external-link-alt text-2xl text-purple-400"></i>
          </div>
        </a>

        <!-- YouTube -->
        <a href="https://www.youtube.com/results?search_query=${encodeURIComponent(course.name)}" target="_blank" class="glass-card p-6 rounded-2xl hover:scale-105 transition group">
          <div class="flex items-center gap-4">
            <div class="text-4xl text-red-400">
              <i class="fab fa-youtube"></i>
            </div>
            <div class="flex-1">
              <h3 class="text-xl font-bold mb-2 group-hover:text-red-400 transition">فيديوهات تعليمية</h3>
              <p class="text-stardust/70">شروحات ومحاضرات على يوتيوب</p>
            </div>
            <i class="fas fa-external-link-alt text-2xl text-purple-400"></i>
          </div>
        </a>

        <!-- College Page -->
        <a href="/${college.path}/${college.id}.html" class="glass-card p-6 rounded-2xl hover:scale-105 transition group">
          <div class="flex items-center gap-4">
            <div class="text-4xl" style="color: ${college.color};">
              <i class="${college.icon}"></i>
            </div>
            <div class="flex-1">
              <h3 class="text-xl font-bold mb-2 group-hover:gradient-text transition">${college.name}</h3>
              <p class="text-stardust/70">جميع مواد الكلية</p>
            </div>
            <i class="fas fa-arrow-left text-2xl text-purple-400"></i>
          </div>
        </a>
      </div>
    </div>

    <!-- Back to Home -->
    <div class="text-center">
      <a href="/" class="btn-primary text-lg">
        <i class="fas fa-home ml-2"></i>
        العودة للصفحة الرئيسية
      </a>
    </div>
  </main>

  <!-- Footer -->
  <footer class="mt-16 text-center text-stardust/70 pb-8">
    <p class="mb-2">© 2024 الجامعة السعودية الإلكترونية - ${college.name}</p>
    <p class="text-sm">جميع الحقوق محفوظة</p>
  </footer>
</body>
</html>`;
};

// توليد الصفحات
console.log('🚀 بدء توليد صفحات مواد الكليات...\n');

let totalGenerated = 0;
const generatedFiles = [];

colleges.forEach(college => {
  console.log(`📚 معالجة ${college.name}...`);
  
  const collegeDir = path.join(__dirname, '..', college.path);
  
  // التأكد من وجود المجلد
  if (!fs.existsSync(collegeDir)) {
    fs.mkdirSync(collegeDir, { recursive: true });
  }
  
  college.courses.forEach(course => {
    const fileName = `${course.code}.html`;
    const filePath = path.join(collegeDir, fileName);
    const htmlContent = generateCollegeCourseHTML(college, course);
    
    fs.writeFileSync(filePath, htmlContent, 'utf-8');
    
    generatedFiles.push({
      college: college.name,
      code: course.code,
      name: course.name,
      path: `${college.path}/${fileName}`,
      url: `https://subjectsearch.tech/${college.path}/${fileName}`
    });
    
    totalGenerated++;
    console.log(`   ✅ ${fileName} - ${course.name}`);
  });
  
  console.log('');
});

// حفظ manifest
const manifestPath = path.join(__dirname, '..', 'page', 'all-colleges', 'colleges-manifest.json');
fs.writeFileSync(manifestPath, JSON.stringify(generatedFiles, null, 2), 'utf-8');

console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log(`🎉 تم توليد ${totalGenerated} صفحة بنجاح!`);
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('\n📋 الصفحات المولدة:');
colleges.forEach(college => {
  const collegeCourses = generatedFiles.filter(f => f.college === college.name);
  console.log(`\n   ${college.name}: ${collegeCourses.length} مواد`);
  collegeCourses.forEach(file => {
    console.log(`      • ${file.code}: ${file.name}`);
  });
});

console.log('\n💾 تم حفظ القائمة في: page/all-colleges/colleges-manifest.json');
console.log('\n✨ جاهز!');
