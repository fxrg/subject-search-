import fs from 'fs';
import path from 'path';

// Paths
const ROOT = process.cwd();
const DATA_PATH = path.join(ROOT, 'course_data.json');
const OUT_DIR = path.join(ROOT, 'course');
const MANIFEST_PATH = path.join(OUT_DIR, 'manifest.json');

const PREFIX_MAJOR = {
  CS: 'علوم الحاسب',
  DS: 'علوم البيانات',
  IT: 'تقنية المعلومات',
  MATH: 'المواد العامة',
  SCI: 'المواد العامة'
};

function toCode(prefix, num) {
  if (!prefix || !num) return null;
  const trimmed = String(num).trim();
  if (!trimmed) return null;
  return `${prefix}${trimmed}`.toUpperCase();
}

function buildResources(code, title) {
  const query = `${code} ${title}`.trim();
  return [
    { type: 'youtube', text: `بحث يوتيوب: ${code} ${title}`, url: `https://www.youtube.com/results?search_query=${encodeURIComponent(query + ' شرح')}` },
    { type: 'link', text: 'بحث Google عن ملفات PDF', url: `https://www.google.com/search?q=${encodeURIComponent(query + ' ملف PDF')}` },
    { type: 'telegram', text: 'بحث قناة تيليجرام', url: `https://t.me/s/computingg?q=${encodeURIComponent('#' + code)}` }
  ];
}

function generateHTML({ code, title, desc, major, credits = 3 }) {
  const canonicalUrl = `https://subjectsearch.tech/course/${code}.html`;
  const resources = buildResources(code, title);
  return `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${code} - ${title} | ${major}</title>
  <meta name="description" content="${desc}">
  <meta name="keywords" content="${code}, ${title}, ${major}, الجامعة السعودية الإلكترونية, SEU">
  <meta name="author" content="Saudi Electronic University">
  <meta name="robots" content="index, follow">
  <link rel="canonical" href="${canonicalUrl}">
  <meta property="og:type" content="course">
  <meta property="og:title" content="${code} - ${title}">
  <meta property="og:description" content="${desc}">
  <meta property="og:url" content="${canonicalUrl}">
  <meta property="og:site_name" content="SEU Course Finder">
  <meta property="og:locale" content="ar_SA">
  <meta name="twitter:card" content="summary">
  <meta name="twitter:title" content="${code} - ${title}">
  <meta name="twitter:description" content="${desc}">
  <script type="application/ld+json">
  {"@context":"https://schema.org","@type":"Course","name":"${title}","description":"${desc}","courseCode":"${code}","provider":{"@type":"Organization","name":"Saudi Electronic University","sameAs":"https://www.seu.edu.sa"},"hasCourseInstance":{"@type":"CourseInstance","courseMode":"blended","courseWorkload":"PT${Number(credits) * 3}H"}}
  </script>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="p-4 md:p-8" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); min-height: 100vh; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
  <div class="max-w-4xl mx-auto">
    <div class="mb-6">
      <a href="/" class="inline-flex items-center text-white hover:underline">
        <svg class="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path></svg>
        العودة إلى الرئيسية
      </a>
    </div>
    <div class="bg-white rounded-2xl shadow-2xl p-8">
      <div class="border-b pb-6 mb-6 flex items-start justify-between flex-wrap gap-4">
        <div>
          <span class="inline-block bg-indigo-600 text-white px-3 py-1 rounded-full text-sm font-bold">${code}</span>
          <h1 class="text-3xl font-bold text-gray-800 mt-4">${title}</h1>
          <p class="text-gray-600 mt-2">التخصص: ${major}</p>
        </div>
        <div class="text-left">
          <span class="text-2xl font-bold text-purple-600">${credits}</span>
          <p class="text-gray-600 text-sm">ساعات معتمدة</p>
        </div>
      </div>
      <div class="mb-8">
        <h2 class="text-2xl font-bold text-gray-800 mb-4">وصف المادة</h2>
        <p class="text-gray-700 leading-relaxed text-lg">${desc}</p>
      </div>
      <div class="mb-8">
        <h2 class="text-2xl font-bold text-gray-800 mb-4">المصادر التعليمية</h2>
        <div class="space-y-4">
          ${resources.map(r => `
            <a href="${r.url}" rel="nofollow noopener" target="_blank" class="block p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div class="flex items-center justify-between">
                <div>
                  <p class="font-semibold text-gray-800">${r.text}</p>
                  <p class="text-sm text-gray-600">${r.type}</p>
                </div>
                <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
                </svg>
              </div>
            </a>`).join('')}
        </div>
      </div>
    </div>
    <div class="mt-10">
      <h2 class="text-2xl font-bold text-gray-800 mb-4">مواد ذات صلة</h2>
      <ul id="related-courses" class="grid grid-cols-1 md:grid-cols-2 gap-3"></ul>
    </div>
    <div class="mt-6 text-center text-white text-sm">
      <p>الجامعة السعودية الإلكترونية</p>
      <p class="mt-2">تم إنشاء هذه الصفحة لتحسين محركات البحث (SEO)</p>
    </div>
  </div>
  <script>
    (async function(){
      try{
        const res = await fetch('/course/manifest.json');
        if(!res.ok) return;
        const list = await res.json();
        const others = (Array.isArray(list)?list:[]).filter(x => (x.code||'') !== '${code}').slice(0,8);
        const ul = document.getElementById('related-courses');
        ul.innerHTML = others.map(function(c){
          const href = '/' + (c.path || ('course/' + c.code + '.html')).replace(/^\/?/, '');
          return '<li>'+
                 '<a href="'+href+'" class="block p-3 rounded-lg bg-gray-50 hover:bg-gray-100 text-gray-800">'+
                 '<span class="font-semibold">'+(c.code||'')+'</span> — '+(c.name||'')+
                 '</a>'+
                 '</li>';
        }).join('');
      }catch(e){}
    })();
  </script>
</body>
</html>`;
}

function loadExistingManifest() {
  try {
    if (fs.existsSync(MANIFEST_PATH)) {
      const raw = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf8'));
      if (Array.isArray(raw)) return raw;
    }
  } catch {}
  return [];
}

async function main() {
  console.log('🚀 إنشاء صفحات من course_data.json ...');
  if (!fs.existsSync(DATA_PATH)) {
    console.error('❌ لم يتم العثور على course_data.json');
    process.exit(1);
  }
  const raw = JSON.parse(fs.readFileSync(DATA_PATH, 'utf8'));
  const entries = Array.isArray(raw) ? raw : [];

  if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

  // Start from existing manifest, merge on code
  const manifestMap = new Map(loadExistingManifest().map(x => [String(x.code).toUpperCase(), x]));

  let created = 0;
  for (const it of entries) {
    const title = it.subject_name || it.title;
    const desc = it.description || it.desc || 'لا يوجد وصف متاح لهذه المادة حالياً.';
    const pairs = [
      ['CS', it.CS],
      ['DS', it.DS],
      ['IT', it.IT],
      ['MATH', it.MATH],
      ['SCI', it.SCI]
    ];
    for (const [prefix, num] of pairs) {
      const code = toCode(prefix, num);
      if (!code) continue;
      const major = PREFIX_MAJOR[prefix] || 'كلية الحوسبة';
      const html = generateHTML({ code, title, desc, major });
      const file = path.join(OUT_DIR, `${code}.html`);
      fs.writeFileSync(file, html, 'utf8');
      manifestMap.set(code, { code, name: title, path: `course/${code}.html` });
      created++;
      console.log(`  ✓ تم إنشاء: ${code}.html`);
    }
  }

  // Save manifest
  const merged = Array.from(manifestMap.values()).sort((a,b)=>String(a.code).localeCompare(String(b.code)));
  fs.writeFileSync(MANIFEST_PATH, JSON.stringify(merged, null, 2), 'utf8');
  console.log(`📄 manifest.json محدث (${merged.length} مادة)`);
  console.log(`✅ اكتمال الإنشاء: ${created} صفحة جديدة`);
}

main().catch(err => { console.error('❌ خطأ:', err); process.exit(1); });
