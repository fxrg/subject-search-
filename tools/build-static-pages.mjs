import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🚀 بدء عملية توليد صفحات المواد الثابتة...\n');

// الخطوة 1: توليد صفحات HTML
console.log('📄 الخطوة 1: توليد صفحات HTML للمواد...');
try {
    execSync('node tools/generate-courses.mjs', { stdio: 'inherit' });
    console.log('✅ تم توليد صفحات HTML بنجاح!\n');
} catch (error) {
    console.error('❌ خطأ في توليد صفحات HTML:', error.message);
    process.exit(1);
}

// الخطوة 2: تحديث sitemap.xml
console.log('🗺️  الخطوة 2: تحديث sitemap.xml...');
try {
    execSync('node tools/update-sitemap.mjs', { stdio: 'inherit' });
    console.log('✅ تم تحديث sitemap.xml بنجاح!\n');
} catch (error) {
    console.error('❌ خطأ في تحديث sitemap:', error.message);
    process.exit(1);
}

// الخطوة 3: إنشاء تقرير
console.log('📊 الخطوة 3: إنشاء تقرير التوليد...');
const manifestPath = path.join(__dirname, '..', 'course', 'manifest.json');
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));

const report = {
    generatedAt: new Date().toISOString(),
    totalPages: manifest.length,
    pages: manifest.map(course => ({
        code: course.code,
        name: course.name,
        url: `https://subjectsearch.tech/course/${course.code}.html`
    }))
};

const reportPath = path.join(__dirname, '..', 'course', 'generation-report.json');
fs.writeFileSync(reportPath, JSON.stringify(report, null, 2), 'utf-8');
console.log('✅ تم إنشاء تقرير التوليد بنجاح!\n');

// الخطوة 4: إنشاء ملف robots.txt محدث (إذا لم يكن موجوداً)
console.log('🤖 الخطوة 4: فحص ملف robots.txt...');
const robotsPath = path.join(__dirname, '..', 'robots.txt');
if (fs.existsSync(robotsPath)) {
    console.log('✅ ملف robots.txt موجود بالفعل\n');
} else {
    const robotsContent = `User-agent: *
Allow: /
Allow: /course/*.html

Sitemap: https://subjectsearch.tech/sitemap.xml
`;
    fs.writeFileSync(robotsPath, robotsContent, 'utf-8');
    console.log('✅ تم إنشاء ملف robots.txt جديد\n');
}

// ملخص نهائي
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('🎉 اكتملت جميع العمليات بنجاح!');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log(`📄 عدد الصفحات المولدة: ${manifest.length}`);
console.log(`📅 التاريخ: ${new Date().toLocaleDateString('ar-SA')}`);
console.log(`⏰ الوقت: ${new Date().toLocaleTimeString('ar-SA')}`);
console.log('\n📂 الملفات المحدثة:');
console.log('   ✓ course/*.html (صفحات المواد)');
console.log('   ✓ sitemap.xml');
console.log('   ✓ course/manifest.json');
console.log('   ✓ course/generation-report.json');
console.log('\n🌐 الخطوات التالية:');
console.log('   1. راجع الصفحات المولدة في مجلد /course');
console.log('   2. تأكد من تحديث موقعك على الخادم');
console.log('   3. أرسل sitemap.xml إلى Google Search Console');
console.log('   4. تحقق من الروابط الداخلية في index.html');
console.log('\n✨ جاهز للنشر!');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
