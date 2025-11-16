import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🗺️  تحديث sitemap.xml بصفحات الكليات...\n');

// قراءة manifests
const computingManifestPath = path.join(__dirname, '..', 'course', 'manifest.json');
const collegesManifestPath = path.join(__dirname, '..', 'page', 'all-colleges', 'colleges-manifest.json');

let computingCourses = [];
let collegeCourses = [];

// قراءة مواد كلية الحوسبة
if (fs.existsSync(computingManifestPath)) {
  computingCourses = JSON.parse(fs.readFileSync(computingManifestPath, 'utf-8'));
  console.log(`📊 تم تحميل ${computingCourses.length} مادة من كلية الحوسبة`);
}

// قراءة مواد الكليات الأخرى
let collegesData = { totalCourses: 0, colleges: [] };
if (fs.existsSync(collegesManifestPath)) {
  collegesData = JSON.parse(fs.readFileSync(collegesManifestPath, 'utf-8'));
  console.log(`📊 تم تحميل ${collegesData.totalCourses} مادة من الكليات الأخرى`);
}

// قراءة sitemap الحالي
const sitemapPath = path.join(__dirname, '..', 'sitemap.xml');
let sitemap = fs.readFileSync(sitemapPath, 'utf-8');

// التاريخ الحالي
const today = new Date().toISOString().split('T')[0];

// إزالة قسم صفحات الكليات القديم إن وجد
const collegeCoursesStart = sitemap.indexOf('<!-- صفحات مواد الكليات الأخرى -->');
if (collegeCoursesStart !== -1) {
  const collegeCoursesEnd = sitemap.indexOf('</urlset>', collegeCoursesStart);
  sitemap = sitemap.substring(0, collegeCoursesStart) + '</urlset>';
}

// إنشاء قسم جديد لصفحات مواد الكليات
let collegeURLs = '\n  <!-- صفحات مواد الكليات الأخرى (Other Colleges Course Pages) -->\n';

// إحصائيات
const stats = {
  health: 0,
  business: 0,
  total: 0
};

// معالجة كل كلية
collegesData.colleges.forEach(collegeData => {
  collegeURLs += `\n  <!-- ${collegeData.displayName} (${collegeData.count} مواد) -->\n`;
  
  collegeData.courses.forEach(course => {
    const url = course.url.startsWith('/') ? course.url.substring(1) : course.url;
    collegeURLs += `  <url>
    <loc>https://subjectsearch.tech/${url}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.85</priority>
  </url>\n`;
    
    stats.total++;
    if (collegeData.college === 'health') {
      stats.health++;
    } else if (collegeData.college === 'business') {
      stats.business++;
    }
  });
});

// إضافة الروابط الجديدة
const closingTag = '</urlset>';
const insertPosition = sitemap.lastIndexOf(closingTag);

if (insertPosition !== -1) {
  sitemap = sitemap.substring(0, insertPosition) + collegeURLs + '\n' + closingTag;
} else {
  console.error('❌ لم يتم العثور على علامة الإغلاق </urlset>');
  process.exit(1);
}

// حفظ sitemap المحدث
fs.writeFileSync(sitemapPath, sitemap, 'utf-8');

console.log('\n✅ تم تحديث sitemap.xml بنجاح!');
console.log(`📊 تم إضافة ${stats.total} رابط جديد للكليات`);
console.log(`   • كلية الصحة: ${stats.health} مواد`);
console.log(`   • كلية العلوم الإدارية: ${stats.business} مواد`);
console.log(`📅 تاريخ التحديث: ${today}`);

// إحصائيات إجمالية
console.log('\n📈 إحصائيات Sitemap الكاملة:');
console.log(`   • كلية الحوسبة: ${computingCourses.length} مواد`);
console.log(`   • كلية الصحة: ${stats.health} مواد`);
console.log(`   • كلية العلوم الإدارية: ${stats.business} مواد`);
console.log(`   • الإجمالي: ${computingCourses.length + stats.total} صفحة مادة`);

console.log('\n✨ جاهز!');
