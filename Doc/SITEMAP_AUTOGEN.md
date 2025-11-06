# Sitemap auto-generation from Firebase

This site now generates `sitemap.xml` automatically from Firestore:

- Blogs (`blogs` collection) → `/page/Blogs/blog.html?id={docId}`
- Courses (`userCourses` and, if present, `health_courses`) → `/?course={COURSE_CODE}`

Static pages (home, colleges, auth, blogs list) are also included.

## How it works

- Script: `tools/generate-sitemap.mjs` (Node + `firebase-admin`)
- Output: `sitemap.xml` at repo root
- Automation: `.github/workflows/update-sitemap.yml` runs daily and on push

## Required secret

Create a Firebase service account with read access to Firestore, then in GitHub repo settings add a repository secret:

- Name: `FIREBASE_SERVICE_ACCOUNT_JSON`
- Value: Paste the entire JSON of the service account.

The workflow reads this secret and connects to Firestore to pull documents.

## Run locally (optional)

On Windows PowerShell:

```powershell
$env:FIREBASE_SERVICE_ACCOUNT_JSON = Get-Content -Raw -Path path\to\service-account.json
npm install
npm run generate:sitemap
```

The script will write `sitemap.xml` in the project root.

## Notes

- For courses, the URL shape `/?course=CODE` is already supported by `index.html` to open the course modal.
- `lastmod` is taken from `updatedAt`/`createdAt`/`timestamp` if available; otherwise, it falls back to the current date.
- The workflow only commits if the generated `sitemap.xml` actually changes.
