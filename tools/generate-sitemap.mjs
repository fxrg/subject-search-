// Tools: Node script to generate sitemap.xml from Firestore
// Usage (locally):
//   set FIREBASE_SERVICE_ACCOUNT_JSON={...} && node tools/generate-sitemap.mjs
// The env var must contain the JSON of a Firebase service account with read access to Firestore.

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import process from 'process';
import admin from 'firebase-admin';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ---- Config ----
const BASE_URL = 'https://subjectsearch.tech';
const OUTPUT = path.resolve(__dirname, '..', 'sitemap.xml');

// Static entries you always want in sitemap
const staticUrls = [
  { loc: `${BASE_URL}/`, changefreq: 'weekly', priority: '1.0' },
  { loc: `${BASE_URL}/page/all-colleges/all-colleges.html`, changefreq: 'monthly', priority: '0.8' },
  { loc: `${BASE_URL}/page/all-colleges/`, changefreq: 'monthly', priority: '0.8' },
  { loc: `${BASE_URL}/page/all-colleges/business/business.html`, changefreq: 'monthly', priority: '0.7' },
  { loc: `${BASE_URL}/page/business/`, changefreq: 'monthly', priority: '0.7' },
  { loc: `${BASE_URL}/page/all-colleges/health/health.html`, changefreq: 'monthly', priority: '0.7' },
  { loc: `${BASE_URL}/page/health/`, changefreq: 'monthly', priority: '0.7' },
  { loc: `${BASE_URL}/page/Blogs/blogs.html`, changefreq: 'weekly', priority: '0.7' },
  { loc: `${BASE_URL}/page/auth/auth.html`, changefreq: 'monthly', priority: '0.5' },
  { loc: `${BASE_URL}/page/auth/Account/profile.html`, changefreq: 'monthly', priority: '0.5' },
  { loc: `${BASE_URL}/page/auth/Account/contributions.html`, changefreq: 'monthly', priority: '0.5' },
];

function fmtDate(d) {
  const yyyy = d.getUTCFullYear();
  const mm = String(d.getUTCMonth() + 1).padStart(2, '0');
  const dd = String(d.getUTCDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

function ensureEnvJson() {
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  if (!raw) {
    throw new Error('FIREBASE_SERVICE_ACCOUNT_JSON is not set. Add your service account JSON to this env var.');
  }
  try {
    return JSON.parse(raw);
  } catch (e) {
    throw new Error('Invalid FIREBASE_SERVICE_ACCOUNT_JSON: failed to parse JSON.');
  }
}

async function initAdmin() {
  const cred = ensureEnvJson();
  if (admin.apps.length === 0) {
    admin.initializeApp({
      credential: admin.credential.cert(cred),
      projectId: cred.project_id,
    });
  }
  return admin.firestore();
}

async function fetchBlogs(db) {
  const res = [];
  const snap = await db.collection('blogs').get();
  snap.forEach((doc) => {
    const data = doc.data() || {};
    const ts = data.updatedAt || data.createdAt;
    let lastmod = new Date();
    if (ts && typeof ts.toDate === 'function') lastmod = ts.toDate();
    res.push({
      loc: `${BASE_URL}/page/Blogs/blog.html?id=${encodeURIComponent(doc.id)}`,
      changefreq: 'weekly',
      priority: '0.7',
      lastmod,
    });
  });
  return res;
}

async function fetchCourses(db) {
  // Primary user-managed courses live in userCourses with document id = course code (e.g. CS230).
  const res = [];
  const collections = ['userCourses'];

  // Optionally include curated health_courses if present (best-effort)
  try {
    const existsCheck = await db.listCollections();
    const names = new Set(existsCheck.map((c) => c.id));
    if (names.has('health_courses')) collections.push('health_courses');
  } catch {}

  for (const col of collections) {
    const snap = await db.collection(col).get();
    snap.forEach((doc) => {
      const data = doc.data() || {};
      const ts = data.updatedAt || data.createdAt || data.timestamp;
      let lastmod = new Date();
      if (ts && typeof ts.toDate === 'function') lastmod = ts.toDate();
      // Deep-link supported by index.html: ?course=CODE
      const code = doc.id.toUpperCase();
      res.push({
        loc: `${BASE_URL}/?course=${encodeURIComponent(code)}`,
        changefreq: 'weekly',
        priority: '0.8',
        lastmod,
      });
    });
  }
  return res;
}

function buildXml(urls) {
  const header = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  const open = `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n`;
  const close = `\n</urlset>\n`;

  const body = urls
    .map((u) => {
      const last = u.lastmod ? fmtDate(u.lastmod) : fmtDate(new Date());
      return [
        '  <url>',
        `    <loc>${u.loc}</loc>`,
        `    <lastmod>${last}</lastmod>`,
        u.changefreq ? `    <changefreq>${u.changefreq}</changefreq>` : null,
        u.priority ? `    <priority>${u.priority}</priority>` : null,
        '  </url>',
      ]
        .filter(Boolean)
        .join('\n');
    })
    .join('\n\n');

  return header + open + '\n' + body + close;
}

async function main() {
  try {
    const db = await initAdmin();
    const [blogs, courses] = await Promise.all([fetchBlogs(db), fetchCourses(db)]);

    // Merge all URLs
    const urls = [
      ...staticUrls.map((u) => ({ ...u, lastmod: new Date() })),
      ...blogs,
      ...courses,
    ];

    // Sort for determinism: homepage first, then path alpha
    urls.sort((a, b) => a.loc.localeCompare(b.loc));

    const xml = buildXml(urls);
    fs.writeFileSync(OUTPUT, xml, 'utf8');
    console.log(`✅ sitemap.xml generated with ${urls.length} URLs at ${OUTPUT}`);
  } catch (err) {
    console.error('❌ Failed to generate sitemap:', err.message);
    process.exitCode = 1;
  }
}

if (import.meta.url === `file://${__filename}`) {
  main();
}
