import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ROOT = path.join(__dirname, '..');
const INDEX_HTML = path.join(ROOT, 'index.html');
const COURSE_DIR = path.join(ROOT, 'course');
const MANIFEST_PATH = path.join(COURSE_DIR, 'manifest.json');

function extractCoursesLiteral(html) {
  // Find exact `const courses =` to avoid matching `const coursesCollection`
  const marker = 'const courses';
  let startPos = html.indexOf('const courses =');
  if (startPos === -1) {
    // Fallback: find 'const courses' then ensure next non-space char is '='
    const pos = html.indexOf(marker);
    if (pos !== -1) {
      let j = pos + marker.length;
      while (j < html.length && /\s/.test(html[j])) j++;
      if (html[j] === '=') startPos = pos;
    }
  }
  if (startPos === -1) throw new Error('لم يتم العثور على const courses في index.html');

  // Find first '{' after marker
  let i = html.indexOf('{', startPos);
  if (i === -1) throw new Error('لم يتم العثور على بداية الكائن { بعد const courses');

  let depth = 0;
  let inString = false;
  let quote = '';
  let inLineComment = false;
  let inBlockComment = false;
  let startIndex = i;

  for (; i < html.length; i++) {
    const ch = html[i];
    const next = i + 1 < html.length ? html[i + 1] : '';

    if (inLineComment) {
      if (ch === '\n') inLineComment = false;
      continue;
    }
    if (inBlockComment) {
      if (ch === '*' && next === '/') { inBlockComment = false; i++; }
      continue;
    }

    if (!inString) {
      // comment starts
      if (ch === '/' && next === '/') { inLineComment = true; i++; continue; }
      if (ch === '/' && next === '*') { inBlockComment = true; i++; continue; }

      if (ch === '"' || ch === "'") { inString = true; quote = ch; continue; }
      if (ch === '{') { depth++; }
      else if (ch === '}') {
        depth--;
        if (depth === 0) {
          // reached end of object literal
          return html.slice(startIndex, i + 1);
        }
      }
      continue;
    } else {
      // inside string
      if (ch === '\\') { i++; continue; }
      if (ch === quote) { inString = false; quote = ''; continue; }
      continue;
    }
  }
  throw new Error('لم يتم العثور على نهاية كائن courses (})');
}

function parseCoursesObject(literal) {
  // Evaluate as a JS object literal safely (in a Function scope)
  // Allow comments and trailing commas by evaluating JS, not JSON.
  const fn = new Function(`return (${literal});`);
  const obj = fn();
  if (!obj || typeof obj !== 'object') throw new Error('فشل تحويل courses إلى كائن');
  return obj;
}

function ensureDir(p) {
  if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true });
}

function toMajorType(code) {
  const m = String(code).match(/^[A-Za-z]+/);
  return m ? m[0].toUpperCase() : 'GEN';
}

function majorTypeToName(t) {
  switch (t) {
    case 'CS': return 'علوم الحاسب';
    case 'IT': return 'تقنية المعلومات';
    case 'DS': return 'علوم البيانات';
    case 'MATH': return 'الرياضيات';
    case 'SCI': return 'العلوم';
    default: return 'عام';
  }
}

function escapeHtml(s) {
  return String(s)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function buildKeywords(name, code, majorName) {
  const base = [
    name,
    code,
    majorName,
    'الجامعة السعودية الإلكترونية',
    'كلية الحوسبة',
    'SEU',
    'Saudi Electronic University',
    'مواد جامعية',
    'تعليم إلكتروني',
    'منصة تعليمية'
  ];
  return base.concat(String(name).split(/\s+/)).join(', ');
}

function normalizeResources(course, courseName, code) {
  const list = Array.isArray(course.resources) ? [...course.resources] : [];
  // Default helpers
  list.push(
    { type: 'youtube', text: 'بحث في يوتيوب', link: `https://www.youtube.com/results?search_query=${encodeURIComponent(courseName + ' ' + code)}` },
    { type: 'google', text: 'بحث PDF', link: `https://www.google.com/search?q=${encodeURIComponent(courseName + ' ' + code + ' filetype:pdf')}` },
    { type: 'telegram', text: 'أرشيف الكلية', link: 'https://t.me/computingg' },
    { type: 'blackboard', text: 'منصة البلاك بورد', link: 'https://lms.seu.edu.sa' }
  );
  // Deduplicate by link text
  const seen = new Set();
  return list.filter(r => {
    const key = (r.type || 'x') + '|' + (r.link || '');
    if (seen.has(key)) return false;
    seen.add(key);
    return r.link;
  });
}

function resourceIcon(type) {
  switch (String(type).toLowerCase()) {
    case 'youtube': return 'fab fa-youtube';
    case 'telegram': return 'fab fa-telegram';
    case 'google': return 'fab fa-google';
    case 'blackboard': return 'fas fa-chalkboard-teacher';
    case 'drive': return 'fab fa-google-drive';
    case 'mega': return 'fas fa-cloud-download-alt';
    default: return 'fas fa-link';
  }
}

// Build resource card markup to mirror modal design
function buildResourceCard(r) {
  const type = String(r.type || '').toLowerCase();
  const text = escapeHtml(r.text || r.type || 'مورد تعليمي');
  const link = escapeHtml(r.link || '#');
  const wrap = (inner) => `<a href="${link}" target="_blank" rel="noopener" class="block">${inner}</a>`;

  if (type === 'youtube') {
    return wrap(`
      <div class="modern-card">
        <div class="modern-img">
          <div class="modern-save">
            <svg class="svg" width="683" height="683" viewBox="0 0 683 683" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g clip-path="url(#clip0_993_25)">
                <mask id="mask0_993_25" style="mask-type:luminance" maskUnits="userSpaceOnUse" x="0" y="0" width="683" height="683">
                  <path d="M0 -0.00012207H682.667V682.667H0V-0.00012207Z" fill="white"></path>
                </mask>
                <g mask="url(#mask0_993_25)">
                  <path d="M148.535 19.9999C137.179 19.9999 126.256 24.5092 118.223 32.5532C110.188 40.5866 105.689 51.4799 105.689 62.8439V633.382C105.689 649.556 118.757 662.667 134.931 662.667H135.039C143.715 662.667 151.961 659.218 158.067 653.09C186.451 624.728 270.212 540.966 304.809 506.434C314.449 496.741 327.623 491.289 341.335 491.289C355.045 491.289 368.22 496.741 377.859 506.434C412.563 541.074 496.752 625.242 524.816 653.348C530.813 659.314 538.845 662.667 547.308 662.667C563.697 662.667 576.979 649.395 576.979 633.019V62.8439C576.979 51.4799 572.48 40.5866 564.447 32.5532C556.412 24.5092 545.489 19.9999 534.133 19.9999H148.535Z" stroke="#CED8DE" stroke-width="40" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"></path>
                </g>
              </g>
              <defs>
                <clipPath id="clip0_993_25">
                  <rect width="682.667" height="682.667" fill="white"></rect>
                </clipPath>
              </defs>
            </svg>
          </div>
        </div>
        <div class="modern-text">
          <p class="h3">${text}</p>
          <p class="p">فيديو تعليمي - يوتيوب</p>
          <div class="modern-icon-box">
            <div class="text-red-500">
              <svg class="svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
            </div>
            <p class="span">مشاهدة الآن</p>
          </div>
        </div>
      </div>
    `);
  }
  if (type === 'telegram') {
    return wrap(`
      <div class="bg-gradient-to-r from-blue-400 to-blue-600 rounded-2xl p-4 hover:scale-105 transition-all duration-300 cursor-pointer shadow-lg resource-card telegram-card">
        <div class="flex items-center space-x-3 space-x-reverse">
          <div class="bg-white bg-opacity-20 rounded-full p-3">
            <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.568 8.16l-1.61 7.56c-.12.57-.44.7-.89.44l-2.46-1.82-1.19 1.14c-.13.13-.24.24-.49.24l.17-2.49L16.89 9.4c.19-.17-.04-.27-.3-.1l-5.78 3.64L8.29 12.5c-.51-.16-.52-.51.11-.76l10.68-4.12c.42-.16.79.1.65.76z"/>
            </svg>
          </div>
          <div class="flex-1">
            <h3 class="text-white font-bold text-lg">${text}</h3>
            <p class="text-blue-100 text-sm">محتوى تعليمي - تيليجرام</p>
            <div class="flex items-center mt-2 text-white text-sm">
              <span>فتح المحادثة</span>
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
              </svg>
            </div>
          </div>
        </div>
      </div>
    `);
  }
  if (type === 'blackboard') {
    return wrap(`
      <div class="bg-gradient-to-br from-gray-700 to-gray-900 border-2 border-gray-600 rounded-lg p-4 hover:border-gray-400 transition-all duration-300 cursor-pointer resource-card blackboard-card">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-3 space-x-reverse">
            <div class="bg-yellow-400 rounded p-2">
              <svg class="w-6 h-6 text-gray-800" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/>
              </svg>
            </div>
            <div>
              <h3 class="text-white font-semibold text-lg">${text}</h3>
              <p class="text-gray-300 text-sm">محاضرات مسجلة - بلاك بورد</p>
            </div>
          </div>
          <div class="bg-yellow-400 text-gray-800 px-3 py-1 rounded-full text-sm font-medium">دخول</div>
        </div>
      </div>
    `);
  }
  if (type === 'drive') {
    return wrap(`
      <div class="bg-gradient-to-r from-blue-500 to-blue-700 rounded-lg p-4 hover:shadow-xl transition-all duration-300 cursor-pointer relative overflow-hidden resource-card drive-card">
        <div class="absolute top-0 right-0 w-20 h-20 bg-white bg-opacity-10 rounded-full -translate-y-10 translate-x-10"></div>
        <div class="relative z-10">
          <div class="flex items-center justify-between mb-3">
            <div class="flex items-center space-x-2 space-x-reverse">
              <div class="bg-white bg-opacity-20 p-2 rounded">
                <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6.26 10.5l5.74-9.93 5.74 9.93H6.26zm6.62 10.5L7.14 13.5h11.72L13.12 21zm-7.66-7.5L1.4 17.5 7.14 21l5.74-3.5H5.22z"/>
                </svg>
              </div>
              <span class="text-white text-sm font-medium">Google Drive</span>
            </div>
          </div>
          <h3 class="text-white font-bold text-lg mb-1">${text}</h3>
          <p class="text-blue-100 text-sm mb-3">ملفات تعليمية</p>
          <div class="flex items-center text-white text-sm">
            <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"></path>
            </svg>
            فتح الملفات
          </div>
        </div>
      </div>
    `);
  }
  if (type === 'mega') {
    return wrap(`
      <div class="bg-gradient-to-br from-red-500 to-red-700 rounded-xl p-4 hover:from-red-600 hover:to-red-800 transition-all duration-300 cursor-pointer border border-red-400 resource-card mega-card">
        <div class="text-center text-white">
          <div class="text-3xl mb-2"><i class="fas fa-cloud-download-alt"></i></div>
          <h3 class="font-semibold text-lg mb-1">${text}</h3>
          <p class="text-red-100 text-sm">تحميل ملفات</p>
        </div>
      </div>
    `);
  }
  return wrap(`
    <div class="resource-card default-card">
      <div class="flex items-center space-x-3 space-x-reverse">
        <div class="bg-stardust rounded p-2">
          <svg class="w-5 h-5 text-nebula" fill="currentColor" viewBox="0 0 24 24">
            <path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H6.99C4.66 7 2.8 8.86 2.8 11.19c0 2.33 1.86 4.19 4.19 4.19H11v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm5-6h4v1.9h-4V7zm0 11h4c2.33 0 4.19-1.86 4.19-4.19C21.2 8.86 19.34 7 17.01 7H13v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V18z"/>
          </svg>
        </div>
        <div class="flex-1">
          <h3 class="text-white font-semibold text-lg">${text}</h3>
          <p class="text-gray-300 text-sm">مورد تعليمي</p>
        </div>
        <div class="text-stardust">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
          </svg>
        </div>
      </div>
    </div>
  `);
}

function generateHTML({ code, name, description, majorType, majorName, resources }) {
  const title = `${name} (${code}) | الجامعة السعودية الإلكترونية`;
  const canonical = `https://subjectsearch.tech/course/${code}.html`;
  const keywords = buildKeywords(name, code, majorName);
  const resourcesHtml = resources.map(r => buildResourceCard(r)).join('\n');
  const drive = resources.find(r => (r.type||'').toLowerCase()==='drive');
  const syllabusLink = escapeHtml(drive?.link || 'https://lms.seu.edu.sa');

  const courseJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name,
    description,
    provider: { '@type': 'EducationalOrganization', name: 'الجامعة السعودية الإلكترونية', sameAs: 'https://www.seu.edu.sa' },
    courseCode: code,
    educationalLevel: 'UndergraduateLevel',
    inLanguage: 'ar',
    about: { '@type': 'Thing', name: majorName },
    teaches: name,
    audience: { '@type': 'EducationalAudience', educationalRole: 'student' },
    hasCourseInstance: { '@type': 'CourseInstance', courseMode: 'blended', courseWorkload: 'PT3H' }
  };

  return `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(title)}</title>
  <meta name="description" content="${escapeHtml(description)}">
  <meta name="keywords" content="${escapeHtml(keywords)}">
  <meta name="author" content="كلية الحوسبة - الجامعة السعودية الإلكترونية">
  <meta name="robots" content="index, follow">
  <link rel="canonical" href="${canonical}">
  <meta property="og:type" content="website">
  <meta property="og:url" content="${canonical}">
  <meta property="og:title" content="${escapeHtml(name)} (${escapeHtml(code)})">
  <meta property="og:description" content="${escapeHtml(description)}">
  <meta property="og:site_name" content="الجامعة السعودية الإلكترونية">
  <meta property="og:locale" content="ar_SA">
  <meta property="og:image" content="https://subjectsearch.tech/assets/logo.JPG">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:url" content="${canonical}">
  <meta name="twitter:title" content="${escapeHtml(name)} (${escapeHtml(code)})">
  <meta name="twitter:description" content="${escapeHtml(description)}">
  <meta name="twitter:image" content="https://subjectsearch.tech/assets/logo.JPG">
  <script type="application/ld+json">${JSON.stringify(courseJsonLd)}</script>
  <script src="https://cdn.tailwindcss.com"></script>
  <script>tailwind.config={theme:{extend:{colors:{cosmic:'#0F0F1A',midnight:'#1A1A2E',nebula:'#2D2D4D',stardust:'#E0E0FF',plasma:'#6C63FF',quantum:'#4D44DB',photon:'#A5A6FF',aurora:'#00D1B2',supernova:'#FF8E3C'}}}};</script>
  <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  <style>
    body{font-family:'Cairo',sans-serif;background-color:#0F0F1A;color:#E0E0FF;min-height:100vh}
    .glass-card{background:rgba(26,26,46,.6);backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px);border:1px solid rgba(109,99,255,.2);box-shadow:0 4px 16px rgba(0,0,0,.1)}
    .gradient-text{background:linear-gradient(90deg,#6C63FF 0%,#A5A6FF 50%,#00D1B2 100%);-webkit-background-clip:text;background-clip:text;color:transparent;background-size:200% auto}
    .modern-card{width:252px;height:265px;background:white;border-radius:20px;box-shadow:0 4px 12px rgba(0,0,0,.1);transition:all .3s ease;margin:8px auto;overflow:hidden;position:relative;border:1px solid #e5e7eb}
    .modern-img{width:100%;height:50%;border-top-left-radius:20px;border-top-right-radius:20px;background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);display:flex;align-items:flex-start;justify-content:flex-end}
    .modern-save{transition:all .3s ease;border-radius:8px;margin:16px;width:28px;height:28px;background-color:rgba(255,255,255,.95);display:flex;align-items:center;justify-content:center;box-shadow:0 2px 6px rgba(0,0,0,.08)}
    .modern-text{margin:20px;display:flex;flex-direction:column;align-items:flex-start;height:calc(50% - 40px);justify-content:space-between}
    .modern-save .svg{transition:all .3s ease;width:14px;height:14px;fill:#6b7280}
    .modern-icon-box{margin-top:12px;width:85%;padding:8px 12px;background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;display:flex;align-items:center;justify-content:flex-start;transition:all .3s ease}
    .modern-icon-box svg{width:17px;height:17px}
    .modern-text .h3{font-family:'Inter','Lucida Sans',sans-serif;font-size:15px;font-weight:600;color:#1f2937;margin:0;line-height:1.3;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
    .modern-text .p{font-family:'Inter','Lucida Sans',sans-serif;color:#64748b;font-size:12px;margin:5px 0 0 0}
    .modern-icon-box .span{margin-left:8px;font-family:'Inter','Lucida Sans',sans-serif;font-size:12px;font-weight:500;color:#475569}
    .resource-card{background:rgba(45,45,77,.4);border-radius:12px;padding:16px;transition:all .3s ease;min-height:80px}
    .resource-card:hover{background:rgba(45,45,77,.7);transform:translateY(-3px)}
  </style>
</head>
<body class="p-4 md:p-8">
  <nav class="backdrop-blur-lg bg-cosmic/90 border border-nebula/20 rounded-xl px-4 py-2 mb-6 flex items-center justify-between sticky top-2 z-40">
    <div class="flex items-center gap-2">
      <i class="fas fa-graduation-cap text-photon"></i>
      <span class="font-bold gradient-text">الجامعة السعودية الإلكترونية</span>
    </div>
    <a href="/" class="flex items-center text-stardust hover:text-white transition duration-300">
      <span class="ml-2">الرئيسية</span>
      <i class="fas fa-home"></i>
    </a>
  </nav>
  <main class="max-w-5xl mx-auto">
    <div class="glass-card rounded-2xl p-8 mb-8">
      <div class="flex flex-col sm:flex-row justify-between items-start mb-6 gap-4">
        <div class="flex-1">
          <h2 class="text-3xl font-bold gradient-text mb-2">${escapeHtml(code)}</h2>
          <h3 class="text-xl font-bold text-white">${escapeHtml(name)}</h3>
          <p class="text-stardust/70">${escapeHtml(majorName)} • 3 ساعات</p>
        </div>
      </div>
      <div class="mb-6">
        <h3 class="text-xl font-bold text-white mb-3">وصف المادة</h3>
        <p class="text-stardust/70 mb-6">${escapeHtml(description)}</p>
        <div class="flex flex-wrap gap-3">
          <a href="${syllabusLink}" target="_blank" class="bg-gradient-to-r from-quantum to-aurora text-white py-2 px-6 rounded-full font-medium transition duration-300 inline-flex items-center hover:scale-105"><i class="fas fa-download mr-2"></i> تحميل المنهج</a>
          <button onclick="shareCourse()" class="bg-gradient-to-r from-aurora to-plasma text-white py-2 px-6 rounded-full font-medium transition duration-300 inline-flex items-center hover:scale-105"><i class="fas fa-share-alt mr-2"></i> مشاركة المادة</button>
        </div>
      </div>
    </div>
    <div class="glass-card rounded-2xl p-8 mb-8">
      <h2 class="text-xl font-bold text-white mb-4">الموارد التعليمية</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center">
        ${resourcesHtml}
      </div>
    </div>
    <div class="glass-card rounded-2xl p-8 mb-4">
      <h3 class="text-xl font-bold text-white mb-4">مواد إضافية</h3>
      <ul class="text-stardust/70 space-y-2">
        <li class="flex items-center"><i class="fas fa-book mr-2 text-photon"></i><a href="https://lms.seu.edu.sa" target="_blank" class="hover:text-white">منصة التعليم</a></li>
        <li class="flex items-center"><i class="fas fa-link mr-2 text-photon"></i><a href="https://t.me/Computing_and_Informatics" target="_blank" class="hover:text-white">قناة الكلية</a></li>
      </ul>
    </div>
  </main>
  <footer class="text-center mt-10">
    <p>© 2025 الجامعة السعودية الإلكترونية - كلية الحوسبة</p>
  </footer>
  <script>
    function shareCourse(){
      const url='${canonical}';
      if(navigator.share){navigator.share({title:'${escapeHtml(name)}',text:'${escapeHtml(name)} - ${escapeHtml(code)}',url});return}
      if(navigator.clipboard){navigator.clipboard.writeText(url).then(()=>alert('تم نسخ رابط المادة'));}
    }
  </script>
</body>
</html>`;
}

function main() {
  console.log('📄 قراءة index.html واستخراج جميع المواد...');
  const html = fs.readFileSync(INDEX_HTML, 'utf-8');
  const literal = extractCoursesLiteral(html);
  // Debug dump of extracted literal for verification
  try {
    fs.writeFileSync(path.join(COURSE_DIR, '_extracted_courses.js'), literal, 'utf-8');
  } catch {}
  const coursesObj = parseCoursesObject(literal);

  ensureDir(COURSE_DIR);

  let generated = 0;
  const entries = Object.entries(coursesObj);
  const manifestMap = new Map();

  // Merge existing manifest if any
  if (fs.existsSync(MANIFEST_PATH)) {
    try {
      const prev = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf-8'));
      prev.forEach(e => manifestMap.set(e.code, e));
    } catch {}
  }

  for (const [codeRaw, course] of entries) {
    const code = String(codeRaw).toUpperCase().trim();
    if (!/^[A-Z]+\d+$/.test(code)) continue; // skip invalid keys

    const majorType = toMajorType(code);
    const majorName = course.major ? String(course.major) : majorTypeToName(majorType);
    const name = course.title ? String(course.title) : `${code} - مقرر`;
    const description = course.desc ? String(course.desc) : `تعرف على مقرر ${name} في ${majorName}.`;
    const resources = normalizeResources(course, name, code);

    const htmlOut = generateHTML({ code, name, description, majorType, majorName, resources });
    const outPath = path.join(COURSE_DIR, `${code}.html`);
    fs.writeFileSync(outPath, htmlOut, 'utf-8');
    generated++;

    manifestMap.set(code, { code, name, path: `course/${code}.html` });
    console.log(`✅ تم إنشاء: ${code}.html — ${name}`);
  }

  const manifest = Array.from(manifestMap.values()).sort((a,b)=>a.code.localeCompare(b.code));
  fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2), 'utf-8');
  console.log(`\n💾 تم تحديث ${path.relative(ROOT, MANIFEST_PATH)} (${manifest.length} مادة)`);
  console.log(`\n🎉 اكتمل إنشاء الصفحات: ${generated} ملف HTML`);
}

main();
