import fs from 'fs';
import path from 'path';

// Read HTML files and extract Firebase config
function extractFirebaseConfig(htmlFilePath) {
  console.log(`\n📄 قراءة الملف: ${htmlFilePath}`);
  
  try {
    const content = fs.readFileSync(htmlFilePath, 'utf-8');
    
    // Search for Firebase config
    const configMatch = content.match(/const\s+firebaseConfig\s*=\s*({[\s\S]*?});/);
    
    if (!configMatch) {
      console.log('❌ لم يتم العثور على Firebase Config');
      return null;
    }

    // Extract the config object
    const configString = configMatch[1];
    
    // Try to parse it (might need cleaning)
    try {
      // Replace single quotes with double quotes for JSON
      const jsonString = configString
        .replace(/(\w+):/g, '"$1":')  // Add quotes to keys
        .replace(/'/g, '"');           // Replace single quotes
      
      const config = JSON.parse(jsonString);
      
      console.log('✅ تم استخراج Firebase Config بنجاح!');
      return config;
      
    } catch (parseError) {
      console.log('⚠️  تعذر تحويل Config إلى JSON، عرض النص الأصلي:');
      console.log(configString);
      return configString;
    }
    
  } catch (error) {
    console.error('❌ خطأ في قراءة الملف:', error.message);
    return null;
  }
}

// Extract collection name
function extractCollectionName(htmlFilePath) {
  console.log(`\n🔍 البحث عن Collection Name في: ${htmlFilePath}`);
  
  try {
    const content = fs.readFileSync(htmlFilePath, 'utf-8');
    
    // Search for collection reference
    const collectionMatch = content.match(/db\.collection\(['"]([^'"]+)['"]\)/);
    
    if (collectionMatch) {
      const collectionName = collectionMatch[1];
      console.log(`✅ Collection Name: ${collectionName}`);
      return collectionName;
    } else {
      console.log('❌ لم يتم العثور على Collection Name');
      return null;
    }
    
  } catch (error) {
    console.error('❌ خطأ في قراءة الملف:', error.message);
    return null;
  }
}

// Main function
function main() {
  console.log('🔧 أداة استخراج إعدادات Firebase من ملفات HTML');
  console.log('=' .repeat(50));

  const files = [
    {
      name: 'كلية الصحة',
      path: 'page/all-colleges/health/health.html'
    },
    {
      name: 'كلية الأعمال',
      path: 'page/all-colleges/business/business.html'
    }
  ];

  const results = [];

  for (const file of files) {
    console.log(`\n${'='.repeat(50)}`);
    console.log(`📚 ${file.name}`);
    console.log('='.repeat(50));
    
    const fullPath = path.join(process.cwd(), file.path);
    
    if (!fs.existsSync(fullPath)) {
      console.log(`❌ الملف غير موجود: ${file.path}`);
      continue;
    }

    const config = extractFirebaseConfig(fullPath);
    const collectionName = extractCollectionName(fullPath);

    results.push({
      college: file.name,
      config: config,
      collectionName: collectionName
    });
  }

  // Save results
  console.log('\n' + '='.repeat(50));
  console.log('💾 حفظ النتائج...');
  
  const outputPath = path.join(process.cwd(), 'firebase-config-extracted.json');
  fs.writeFileSync(outputPath, JSON.stringify(results, null, 2), 'utf-8');
  
  console.log(`✅ تم الحفظ في: firebase-config-extracted.json`);

  // Display instructions
  console.log('\n' + '='.repeat(50));
  console.log('📖 التعليمات:');
  console.log('='.repeat(50));
  console.log('\n1. افتح الملف: firebase-config-extracted.json');
  console.log('2. انسخ القيم إلى: tools/extract-firebase-courses.mjs');
  console.log('3. قم بتثبيت Firebase SDK:');
  console.log('   npm install firebase');
  console.log('4. شغّل السكربت:');
  console.log('   node tools/extract-firebase-courses.mjs');
  console.log('\n' + '='.repeat(50));
}

// Run
main();
