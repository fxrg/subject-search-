import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import fs from 'fs';
import path from 'path';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCen8J6HuLOj3d1tpEA8aF13XVmGxiG9BY",
  authDomain: "seu-subjects.firebaseapp.com",
  projectId: "seu-subjects",
  storageBucket: "seu-subjects.firebasestorage.app",
  messagingSenderId: "552315681734",
  appId: "1:552315681734:web:d7ae70e54e7e2bf7b290c7",
  measurementId: "G-Y2FL6V8X3L"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// College configurations
const collegeConfigs = [
  {
    name: 'health',
    collectionName: 'health_courses',
    outputDir: 'page/all-colleges/health',
    displayName: 'كلية العلوم الصحية',
    englishName: 'College of Health Sciences'
  },
  {
    name: 'business',
    collectionName: 'userCourses', // or 'business_courses' if different
    outputDir: 'page/all-colleges/business',
    displayName: 'كلية إدارة الأعمال',
    englishName: 'College of Business Administration'
  }
];

// Function to generate HTML for a course
function generateCourseHTML(course, collegeConfig) {
  const rawCode = course.code || course.id;
  const safeCode = String(rawCode || '').replace(/[^a-zA-Z0-9]/g, '');
  const courseCode = rawCode || safeCode;
  const courseTitle = course.title || course.subject_name || safeCode;
  const courseDesc = course.desc || course.description || 'لا يوجد وصف متاح لهذه المادة حالياً.';
  const courseMajor = course.major || '';
  const courseCredits = course.credits || 3;
  const canonicalUrl = `https://subjectsearch.tech/${collegeConfig.outputDir}/${safeCode}.html`;
  
  // Build default resources if none provided
  const baseQueries = {
    youtube: `https://www.youtube.com/results?search_query=${encodeURIComponent(courseCode + ' ' + courseTitle + ' شرح')}`,
    google: `https://www.google.com/search?q=${encodeURIComponent(courseCode + ' ' + courseTitle + ' ملف PDF')}`,
    telegram: `https://t.me/s/computingg?q=${encodeURIComponent('#' + (courseTitle || courseCode).replace(/\s+/g,'') )}`
  };
  const hasResources = Array.isArray(course.resources) && course.resources.length > 0;
  const fallbackResources = [
    { type: 'youtube', text: `بحث يوتيوب: ${courseCode} ${courseTitle}`, url: baseQueries.youtube },
    { type: 'link', text: `بحث Google عن ملفات PDF`, url: baseQueries.google },
    { type: 'telegram', text: `بحث قناة تيليجرام`, url: baseQueries.telegram }
  ];
  const resourcesList = hasResources ? course.resources : fallbackResources;
  
  return `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    
    <!-- SEO Meta Tags -->
    <title>${courseCode} - ${courseTitle} | ${collegeConfig.displayName}</title>
    <meta name="description" content="${courseDesc}">
    <meta name="keywords" content="${courseCode}, ${courseTitle}, ${collegeConfig.englishName}, الجامعة السعودية الإلكترونية, SEU, ${courseMajor}">
    <meta name="author" content="Saudi Electronic University">
    <meta name="robots" content="index, follow">
    <link rel="canonical" href="${canonicalUrl}">
    
    <!-- Open Graph Meta Tags -->
    <meta property="og:type" content="course">
    <meta property="og:title" content="${courseCode} - ${courseTitle}">
    <meta property="og:description" content="${courseDesc}">
    <meta property="og:url" content="${canonicalUrl}">
    <meta property="og:site_name" content="SEU Course Finder">
    <meta property="og:locale" content="ar_SA">
    
    <!-- Twitter Card Meta Tags -->
    <meta name="twitter:card" content="summary">
    <meta name="twitter:title" content="${courseCode} - ${courseTitle}">
    <meta name="twitter:description" content="${courseDesc}">
    
    <!-- Structured Data (Schema.org) -->
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "Course",
      "name": "${courseTitle}",
      "description": "${courseDesc}",
      "courseCode": "${courseCode}",
      "provider": {
        "@type": "Organization",
        "name": "Saudi Electronic University",
        "sameAs": "https://www.seu.edu.sa"
      },
      "hasCourseInstance": {
        "@type": "CourseInstance",
        "courseMode": "blended",
        "courseWorkload": "PT${courseCredits * 3}H"
      }
    }
    </script>
    
    <!-- Tailwind CSS -->
    <script src="https://cdn.tailwindcss.com"></script>
    
    <!-- Google Analytics -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-Y2FL6V8X3L"></script>
    <script>
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', 'G-Y2FL6V8X3L');
    </script>
    
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
        }
        .course-card {
            background: white;
            border-radius: 20px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
        }
        .badge {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 8px 16px;
            border-radius: 20px;
            font-size: 14px;
            font-weight: bold;
        }
    </style>
</head>
<body class="p-4 md:p-8">
    <div class="max-w-4xl mx-auto">
        <!-- Back Button -->
        <div class="mb-6">
          <a href="${collegeConfig.name}.html" class="inline-flex items-center text-white hover:underline">
                <svg class="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
                </svg>
            العودة إلى ${collegeConfig.displayName}
            </a>
        </div>

        <!-- Course Card -->
        <div class="course-card p-8">
            <!-- Course Header -->
            <div class="border-b pb-6 mb-6">
                <div class="flex items-start justify-between flex-wrap gap-4">
                    <div>
                        <span class="badge">${courseCode}</span>
                        <h1 class="text-3xl font-bold text-gray-800 mt-4">${courseTitle}</h1>
                        ${courseMajor ? `<p class="text-gray-600 mt-2">التخصص: ${courseMajor}</p>` : ''}
                    </div>
                    <div class="text-left">
                        <span class="text-2xl font-bold text-purple-600">${courseCredits}</span>
                        <p class="text-gray-600 text-sm">ساعات معتمدة</p>
                    </div>
                </div>
            </div>

            <!-- Course Description -->
            <div class="mb-8">
                <h2 class="text-2xl font-bold text-gray-800 mb-4">وصف المادة</h2>
                <p class="text-gray-700 leading-relaxed text-lg">${courseDesc}</p>
            </div>

            <!-- Course Resources -->
            <div class="mb-8">
              <h2 class="text-2xl font-bold text-gray-800 mb-4">المصادر التعليمية</h2>
              <div class="space-y-4">
                ${resourcesList.map(resource => `
                <a href="${resource.url || '#'}" rel="nofollow noopener" target="_blank" class="block p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div class="flex items-center justify-between">
                    <div>
                      <p class="font-semibold text-gray-800">${resource.text || resource.title}</p>
                      <p class="text-sm text-gray-600">${resource.type || 'مورد تعليمي'}</p>
                    </div>
                    <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
                    </svg>
                  </div>
                </a>
                `).join('')}
              </div>
            </div>

            <!-- Actions -->
            <div class="flex gap-4 flex-wrap">
                <a href="${collegeConfig.name}.html" class="flex-1 bg-purple-600 text-white py-3 px-6 rounded-lg text-center hover:bg-purple-700 transition-colors">
                    تصفح المزيد من المواد
                </a>
                <a href="/" class="flex-1 bg-gray-200 text-gray-800 py-3 px-6 rounded-lg text-center hover:bg-gray-300 transition-colors">
                    العودة للرئيسية
                </a>
            </div>
        </div>

        <!-- Related Courses (internal links) -->
        <div class="mt-10">
            <h2 class="text-2xl font-bold text-gray-800 mb-4">مواد ذات صلة</h2>
            <ul id="related-courses" class="grid grid-cols-1 md:grid-cols-2 gap-3"></ul>
        </div>

        <!-- Additional Info -->
        <div class="mt-6 text-center text-white text-sm">
            <p>الجامعة السعودية الإلكترونية | ${collegeConfig.displayName}</p>
            <p class="mt-2">تم إنشاء هذه الصفحة لتحسين محركات البحث (SEO)</p>
        </div>
    </div>
    <script>
      // Render related courses from manifest for internal linking
      (async function(){
        try{
          const res = await fetch('manifest.json');
          if(!res.ok) return;
          const list = await res.json();
          const others = list.filter(x => (x.code||'') !== '${courseCode}').slice(0,8);
          const ul = document.getElementById('related-courses');
          ul.innerHTML = others.map(function(c){
            return '<li>'+
                   '<a href="./'+(c.filename||'')+'" class="block p-3 rounded-lg bg-gray-50 hover:bg-gray-100 text-gray-800">'+
                   '<span class="font-semibold">'+(c.code||'')+'</span> — '+(c.title||'')+
                   '</a>'+
                   '</li>';
          }).join('');
        }catch(e){/* ignore */}
      })();
    </script>
</body>
</html>`;
}

// Main extraction function
async function extractAndGenerateCourses() {
  console.log('🚀 بدء استخراج المواد من Firebase...\n');

  const allCoursesData = [];

  for (const config of collegeConfigs) {
    console.log(`📚 معالجة كلية: ${config.displayName}`);
    
    try {
      // Fetch courses from Firebase
      const coursesRef = collection(db, config.collectionName);
      const snapshot = await getDocs(coursesRef);
      
      console.log(`✅ تم العثور على ${snapshot.size} مادة في ${config.collectionName}`);
      
      const courses = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        courses.push({
          id: doc.id,
          ...data,
          college: config.name
        });
      });

      // Generate HTML files
      const outputDir = path.join(process.cwd(), config.outputDir);
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }

      const manifest = [];

      for (const course of courses) {
        const safeCode = (course.code || course.id || '').replace(/[^a-zA-Z0-9]/g, '');
        const filename = `${safeCode}.html`;
        const filepath = path.join(outputDir, filename);
        
        const html = generateCourseHTML(course, config);
        fs.writeFileSync(filepath, html, 'utf-8');
        
        manifest.push({
          code: course.code || course.id,
          title: course.title || course.subject_name,
          filename: filename,
          url: `/${config.outputDir}/${filename}`
        });
        
        console.log(`  ✓ تم إنشاء: ${filename}`);
      }

      // Save manifest
      const manifestPath = path.join(outputDir, 'manifest.json');
      fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), 'utf-8');
      console.log(`  ✓ تم حفظ الدليل: manifest.json (${manifest.length} مادة)\n`);

      allCoursesData.push({
        college: config.name,
        displayName: config.displayName,
        count: courses.length,
        courses: manifest
      });

    } catch (error) {
      console.error(`❌ خطأ في معالجة ${config.displayName}:`, error.message);
    }
  }

  // Save consolidated manifest
  const consolidatedManifest = {
    generatedAt: new Date().toISOString(),
    totalCourses: allCoursesData.reduce((sum, college) => sum + college.count, 0),
    colleges: allCoursesData
  };

  const consolidatedPath = path.join(process.cwd(), 'page', 'all-colleges', 'colleges-manifest.json');
  fs.writeFileSync(consolidatedPath, JSON.stringify(consolidatedManifest, null, 2), 'utf-8');

  console.log('\n✅ اكتمل الاستخراج!');
  console.log(`📊 إجمالي المواد: ${consolidatedManifest.totalCourses}`);
  console.log(`📁 الملف الموحد: colleges-manifest.json`);
  
  return consolidatedManifest;
}

// Run the extraction
extractAndGenerateCourses()
  .then(() => {
    console.log('\n🎉 نجحت العملية!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ فشلت العملية:', error);
    process.exit(1);
  });
