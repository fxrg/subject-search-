import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// قراءة قائمة الصفحات المولدة
const manifestPath = path.join(__dirname, '..', 'course', 'manifest.json');
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));

// قراءة sitemap الحالي
const sitemapPath = path.join(__dirname, '..', 'sitemap.xml');
let sitemap = fs.readFileSync(sitemapPath, 'utf-8');

// التاريخ الحالي بصيغة YYYY-MM-DD
const today = new Date().toISOString().split('T')[0];

// إنشاء قسم جديد لصفحات المواد الثابتة
let courseURLs = '\n  <!-- صفحات المواد الثابتة (Static Course Pages) -->\n';

manifest.forEach(course => {
  courseURLs += `  <url>
    <loc>https://subjectsearch.tech/course/${course.code}.html</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
  </url>\n`;
});

// البحث عن نهاية urlset واستبدالها بالروابط الجديدة
const closingTag = '</urlset>';
const insertPosition = sitemap.lastIndexOf(closingTag);

if (insertPosition !== -1) {
  sitemap = sitemap.substring(0, insertPosition) + courseURLs + '\n' + closingTag;
} else {
  console.error('❌ لم يتم العثور على علامة الإغلاق </urlset>');
  process.exit(1);
}

// حفظ sitemap المحدث
fs.writeFileSync(sitemapPath, sitemap, 'utf-8');

console.log(`✅ تم تحديث sitemap.xml بنجاح!`);
console.log(`📊 تم إضافة ${manifest.length} رابط جديد للمواد الثابتة`);
console.log(`📅 تاريخ التحديث: ${today}`);
console.log('\n📋 الروابط المضافة:');
manifest.forEach(course => {
  console.log(`   https://subjectsearch.tech/course/${course.code}.html`);
});
