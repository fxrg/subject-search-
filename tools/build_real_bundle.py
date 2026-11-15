# -*- coding: utf-8 -*-
"""
Build unified static + global JS data files for Subject Search 2.0:
1. data/real-courses-bundle.js ->
   - window.REAL_COMPUTING_COURSES (Strictly CS, IT, DS, and shared Math/Physics)
   - window.REAL_HEALTH_COURSES
   - window.REAL_BUSINESS_COURSES (MGT101, ACCT101, ECOM101, ECON101 + business userCourses)
   - window.REAL_THEORETICAL_COURSES (Empty by default; populated only by real student contributions in Firestore)
   - window.REAL_COURSE_RATINGS
   - window.REAL_CONTRIBUTORS (Aggregated real student contributors from Firestore)
   - window.ALL_REAL_COURSES
"""
import json
import os
import re

SCRATCH = r"C:\Users\HUAWEI\.gemini\antigravity-cli\brain\04efc6aa-9621-4270-883a-d9958ce34bbf\scratch"
REPO = r"C:\Users\HUAWEI\subject-search"

with open(os.path.join(SCRATCH, "real_courses.json"), "r", encoding="utf-8") as f:
    raw_computing_courses = json.load(f)

with open(os.path.join(SCRATCH, "firestore_dump.json"), "r", encoding="utf-8") as f:
    fs_dump = json.load(f)

user_courses = fs_dump.get("userCourses", {})
health_courses = fs_dump.get("health_courses", {})
course_ratings = fs_dump.get("course_ratings", {})

# Known real Firestore contributors from userCourses & health_courses
FATEMAH_COURSES = {"ENG103", "ISLM101", "CS352", "CS353", "CS351", "CS350", "MATH251"}
TURKI_COURSES = {"DS485", "DS364", "DS470", "DS483", "CS230", "CS231", "CS240", "CS241", "CS242", "CS243", "CS360", "CS361", "CS362", "CS363", "CS364", "CS470", "CS480", "CS481"}
ABDULLAH_COURSES = {"PHC271", "PHC101", "PHC121", "PHC212", "PHC215", "PHC216"}

def resolve_author_info(code: str, raw_added_by):
    clean = code.replace(" ", "").upper()
    if isinstance(raw_added_by, dict):
        name = (raw_added_by.get("name") or "").strip()
        uid = raw_added_by.get("id") or raw_added_by.get("uid") or ""
        email = raw_added_by.get("email") or ""
        if name and name != "مستخدم مجهول":
            return {"authorName": name, "authorUid": uid, "authorEmail": email}
    if clean in FATEMAH_COURSES:
        return {"authorName": "Fatemah rabea", "authorUid": "LggNszeQcMafWp0dK4djv4IiHZ72", "authorEmail": "osm434938@gmail.com"}
    if clean in ABDULLAH_COURSES:
        return {"authorName": "عبدالله الشهري", "authorUid": "01W8LUZOKpMuBPVgG8nP5yg0hOS2", "authorEmail": "alshehria470@gmail.com"}
    if clean in TURKI_COURSES:
        return {"authorName": "تركي المطيري", "authorUid": "S41CLovzpAURxejUSkA4W52TNdn1", "authorEmail": "bekrkraft6@gmail.com"}
    return {"authorName": "مبادرة طلاب الكلية", "authorUid": "community", "authorEmail": ""}

# Clean up any malformed batch key in userCourses while keeping valid ones in local catalog
clean_user_courses = {}
for k, v in user_courses.items():
    if "," in k and len(k) > 20:
        continue
    clean_user_courses[k] = v

# Business courses from page/all-colleges/business/ (ACCT101, ECOM101, ECON101, MGT101)
business_extra = {
    "ACCT101": {
        "code": "ACCT101",
        "title": "مبادئ المحاسبة المالية",
        "titleEn": "Principles of Financial Accounting",
        "desc": "أساسيات المحاسبة المالية، الدورة المحاسبية، تسجيل القيود اليومية، وإعداد القوائم المالية الختامية وفق المعايير المحاسبية المعتمدة.",
        "credits": 3,
        "level": 3,
        "major": "المحاسبة",
        "college": "كلية العلوم الإدارية والمالية",
        "collegeId": "business",
        "authorName": "مبادرة طلاب الكلية",
        "authorUid": "community",
        "url": "page/all-colleges/business/ACCT101.html",
        "resources": [
            {"type": "telegram", "text": "تجميعات وسلايدات مبادئ المحاسبة ACCT101", "link": "https://t.me/s/computingg?q=ACCT101"},
            {"type": "youtube", "text": "شروحات مبادئ المحاسبة المالية", "link": "https://www.youtube.com/results?search_query=ACCT101+%D9%85%D8%A8%D8%A7%D8%AF%D8%A6+%D8%A7%D9%84%D9%85%D8%AD%D8%A7%D8%B3%D8%A8%D8%A9"}
        ]
    },
    "ECOM101": {
        "code": "ECOM101",
        "title": "التجارة الإلكترونية",
        "titleEn": "E-Commerce",
        "desc": "مفاهيم التجارة الإلكترونية ونماذج الأعمال الرقمية، البنية التحتية للمتاجر الإلكترونية، أنظمة الدفع الإلكتروني، والتسويق الرقمي.",
        "credits": 3,
        "level": 3,
        "major": "التجارة الإلكترونية",
        "college": "كلية العلوم الإدارية والمالية",
        "collegeId": "business",
        "authorName": "مبادرة طلاب الكلية",
        "authorUid": "community",
        "url": "page/all-colleges/business/ECOM101.html",
        "resources": [
            {"type": "telegram", "text": "ملفات وتجميعات التجارة الإلكترونية ECOM101", "link": "https://t.me/s/computingg?q=ECOM101"},
            {"type": "youtube", "text": "شروحات مقرر التجارة الإلكترونية ECOM101", "link": "https://www.youtube.com/results?search_query=ECOM101+%D8%A7%D9%84%D8%AA%D8%AC%D8%A7%D8%B1%D8%A9+%D8%A7%D9%84%D8%A5%D9%84%D9%83%D8%AA%D8%B1%D9%88%D9%86%D9%8A%D8%A9"}
        ]
    },
    "ECON101": {
        "code": "ECON101",
        "title": "مبادئ الاقتصاد الجزئي",
        "titleEn": "Principles of Microeconomics",
        "desc": "مقدمة في علم الاقتصاد، آليات العرض والطلب، توازن السوق، مرونات الطلب والعرض، سلوك المستهلك ونظرية الإنتاج والتكاليف.",
        "credits": 3,
        "level": 3,
        "major": "إدارة الأعمال",
        "college": "كلية العلوم الإدارية والمالية",
        "collegeId": "business",
        "authorName": "مبادرة طلاب الكلية",
        "authorUid": "community",
        "url": "page/all-colleges/business/ECON101.html",
        "resources": [
            {"type": "telegram", "text": "ملخصات وتجميعات الاقتصاد ECON101", "link": "https://t.me/s/computingg?q=ECON101"},
            {"type": "youtube", "text": "شروحات مبادئ الاقتصاد ECON101", "link": "https://www.youtube.com/results?search_query=ECON101+%D9%85%D8%A8%D8%A7%D8%AF%D8%A6+%D8%A7%D9%84%D8%A7%D9%82%D8%AA%D8%B5%D8%A7%D8%AF"}
        ]
    },
    "MGT101": {
        "code": "MGT101",
        "title": "مبادئ الإدارة",
        "titleEn": "Principles of Management",
        "desc": "الوظائف الإدارية الأساسية: التخطيط، التنظيم، التوجيه، والرقابة، مع دراسة بيئة المنظمات واتخاذ القرارات الإدارية وقيادة فرق العمل.",
        "credits": 3,
        "level": 3,
        "major": "إدارة الأعمال",
        "college": "كلية العلوم الإدارية والمالية",
        "collegeId": "business",
        "authorName": "مبادرة طلاب الكلية",
        "authorUid": "community",
        "url": "page/all-colleges/business/MGT101.html",
        "resources": [
            {"type": "telegram", "text": "ملفات وتجميعات مبادئ الإدارة MGT101", "link": "https://t.me/s/computingg?q=MGT101"},
            {"type": "youtube", "text": "شروحات مبادئ الإدارة MGT101", "link": "https://www.youtube.com/results?search_query=MGT101+%D9%85%D8%A8%D8%A7%D8%AF%D8%A6+%D8%A7%D9%84%D8%A5%D8%AF%D8%A7%D8%B1%D8%A9"}
        ]
    }
}

REAL_PREREQS = {
    "CS230": [],
    "CS231": ["CS230"],
    "SCI101": [],
    "MATH150": [],
    "CS240": ["CS230"],
    "CS241": ["CS231"],
    "CS242": ["CS230", "MATH150"],
    "CS243": ["MATH150"],
    "SCI201": ["SCI101"],
    "MATH251": ["MATH150"],
    "CS350": ["CS240"],
    "CS351": ["CS240", "CS241"],
    "CS352": ["CS240"],
    "CS353": ["CS240"],
    "CS360": ["CS352"],
    "CS361": ["CS240"],
    "CS362": ["CS352", "MATH251"],
    "CS363": ["CS240"],
    "CS364": ["CS350"],
    "CS470": ["CS350", "CS352"],
    "CS480": ["CS470"],
    "CS481": ["CS360"],
    "DS230": [],
    "DS231": [],
    "DS240": ["DS230"],
    "DS242": ["DS230"],
    "DS243": ["MATH150"],
    "MATH241": ["MATH150"],
    "DS350": ["DS240"],
    "DS351": ["DS240"],
    "DS352": ["DS242", "MATH241"],
    "DS353": ["DS240"],
    "DS360": ["DS351"],
    "DS361": ["DS352"],
    "DS362": ["DS352"],
    "DS363": ["DS350"],
    "DS364": ["DS240"],
    "DS470": ["DS351"],
    "DS474": ["DS352"],
    "DS481": ["DS474"],
    "DS483": ["DS362"],
    "DS485": ["DS351"],
    "IT231": [],
    "IT232": ["IT231"],
    "IT233": [],
    "IT240": ["IT232"],
    "IT241": ["IT233"],
    "IT244": ["IT232"],
    "IT245": ["IT232"],
    "IT351": ["IT241"],
    "IT352": ["IT241"],
    "IT353": ["IT244"],
    "IT354": ["IT245"],
    "IT361": ["IT351"],
    "IT362": ["IT352"],
    "IT363": ["IT352"],
    "IT364": ["IT244"],
    "IT365": ["IT354"],
    "IT475": ["IT361", "IT353"],
    "IT485": ["IT475"]
}

BUSINESS_PREFIXES = ("MGT", "ACCT", "FIN", "ECOM", "ECON", "MKT", "MIS", "BUS")
THEORETICAL_PREFIXES = ("LAW", "MED", "DM", "TRN", "LNG")

computing_courses = {}
theoretical_courses = {}

for code, c in raw_computing_courses.items():
    clean_code = code.replace(" ", "").upper()
    if clean_code.startswith(BUSINESS_PREFIXES):
        business_extra[clean_code] = c
        continue
    if clean_code.startswith(THEORETICAL_PREFIXES):
        continue
    if c.get("major") in ("علم بيانات", "علم البيانات"):
        c["major"] = "علوم البيانات"
    c["code"] = clean_code
    c["college"] = "كلية الحوسبة والمعلوماتية"
    c["collegeId"] = "computing"
    c["prerequisites"] = REAL_PREREQS.get(clean_code, [])
    auth_info = resolve_author_info(clean_code, c.get("addedBy"))
    c["authorName"] = auth_info["authorName"]
    c["authorUid"] = auth_info["authorUid"]
    c["authorEmail"] = auth_info["authorEmail"]
    computing_courses[clean_code] = c

for code, c in clean_user_courses.items():
    if code == "Wu2QJtv9sFVNvoqm17aG" or "," in code or len(code) > 12:
        continue
    clean_code = code.replace(" ", "").upper()
    major = c.get("major", "")
    is_business = clean_code.startswith(BUSINESS_PREFIXES) or "ادارة" in major or "إدارة" in major or "محاسبة" in major or "مالية" in major or "تجارة" in major or c.get("collegeId") == "business" or c.get("college") == "business"
    is_theo = clean_code.startswith(THEORETICAL_PREFIXES) or c.get("collegeId") == "theoretical" or c.get("college") == "theoretical" or major in ("القانون", "الإعلام الرقمي", "اللغات والترجمة", "الإحصاء التطبيقي وتحليل البيانات")

    if is_business:
        college_name = "كلية العلوم الإدارية والمالية"
        college_id = "business"
        norm_major = "إدارة الأعمال" if ("ادارة" in major or "إدارة" in major or not major) else major
    elif is_theo:
        college_name = "كلية الدراسات النظرية"
        college_id = "theoretical"
        norm_major = major or "القانون"
    else:
        college_name = "كلية الحوسبة والمعلوماتية"
        college_id = "computing"
        norm_major = "علوم البيانات" if "بيانات" in major else (major or "المواد العامة")

    auth_info = resolve_author_info(clean_code, c.get("addedBy"))
    entry = {
        "code": clean_code,
        "title": c.get("title", clean_code),
        "desc": c.get("desc", ""),
        "credits": c.get("credits", 3),
        "level": c.get("level", 5),
        "major": norm_major,
        "college": college_name,
        "collegeId": college_id,
        "prerequisites": REAL_PREREQS.get(clean_code, []),
        "resources": c.get("resources", []),
        "addedBy": c.get("addedBy"),
        "authorName": c.get("authorName") or auth_info["authorName"],
        "authorUid": c.get("authorUid") or auth_info["authorUid"],
        "authorEmail": c.get("authorEmail") or auth_info["authorEmail"],
        "fromFirebase": True
    }
    if college_id == "business":
        if clean_code in business_extra and entry["resources"]:
            existing_links = {r.get("link") for r in business_extra[clean_code].get("resources", [])}
            for r in entry["resources"]:
                if r.get("link") and r.get("link") not in existing_links:
                    business_extra[clean_code]["resources"].append(r)
        elif clean_code not in business_extra:
            business_extra[clean_code] = entry
    elif college_id == "theoretical":
        theoretical_courses[clean_code] = entry
    elif college_id == "computing":
        if clean_code in computing_courses:
            computing_courses[clean_code]["authorName"] = entry["authorName"]
            computing_courses[clean_code]["authorUid"] = entry["authorUid"]
            computing_courses[clean_code]["authorEmail"] = entry["authorEmail"]
        else:
            computing_courses[clean_code] = entry

normalized_health = {}
for raw_code, c in health_courses.items():
    clean_code = raw_code.replace(" ", "")
    existing = normalized_health.get(clean_code)
    res_list = c.get("resources", [])
    fixed_res = []
    for r in res_list:
        rl = r.get("link") or r.get("url") or f"https://t.me/s/computingg?q={clean_code}"
        if rl == "#":
            rl = f"https://t.me/s/computingg?q={clean_code}"
        fixed_res.append({
            "type": r.get("type", "telegram"),
            "text": r.get("text", f"مصدر تعليمي - {clean_code}"),
            "link": rl,
            "url": rl
        })
    num_match = re.search(r"(\d+)", clean_code)
    num_val = int(num_match.group(1)) if num_match else 101
    lvl = max(3, min(8, (num_val // 50) + 1)) if num_val >= 100 else 3

    auth_info = resolve_author_info(clean_code, c.get("addedBy"))
    entry = {
        "code": clean_code,
        "rawCode": raw_code,
        "title": c.get("title", clean_code),
        "desc": c.get("desc", ""),
        "credits": int(c.get("credits", 3) or 3),
        "level": int(c.get("level", lvl) or lvl),
        "major": c.get("major", "المعلوماتية الصحية"),
        "college": "كلية العلوم الصحية",
        "collegeId": "health",
        "url": f"page/all-colleges/health/{clean_code}.html",
        "resources": fixed_res,
        "addedBy": c.get("addedBy"),
        "authorName": auth_info["authorName"],
        "authorUid": auth_info["authorUid"],
        "authorEmail": auth_info["authorEmail"],
        "fromFirebase": True
    }
    if not existing or (len(entry["desc"]) > len(existing["desc"])) or (len(entry["resources"]) > len(existing["resources"])):
        normalized_health[clean_code] = entry

all_real_courses = {}
for code, c in computing_courses.items():
    all_real_courses[code] = c
for code, c in business_extra.items():
    all_real_courses[code] = c
for code, c in normalized_health.items():
    if code not in all_real_courses:
        all_real_courses[code] = c
for code, c in theoretical_courses.items():
    if code not in all_real_courses:
        all_real_courses[code] = c

# Build initial REAL_CONTRIBUTORS leaderboard baseline from real Firestore contributions
real_contributors = [
    {
        "uid": "S41CLovzpAURxejUSkA4W52TNdn1",
        "name": "تركي المطيري",
        "email": "bekrkraft6@gmail.com",
        "college": "كلية الحوسبة والمعلوماتية",
        "role": "مؤسس المنصة ومشرف عام",
        "coursesCount": 18,
        "resourcesCount": 64,
        "points": 308,
        "badge": "وسام الريادة المؤسسية",
        "courses": sorted(list(TURKI_COURSES))
    },
    {
        "uid": "LggNszeQcMafWp0dK4djv4IiHZ72",
        "name": "Fatemah rabea",
        "email": "osm434938@gmail.com",
        "college": "كلية الحوسبة والمعلوماتية",
        "role": "مساهمة متميزة",
        "coursesCount": 7,
        "resourcesCount": 19,
        "points": 127,
        "badge": "وسام النخبة الذهبي",
        "courses": sorted(list(FATEMAH_COURSES))
    },
    {
        "uid": "01W8LUZOKpMuBPVgG8nP5yg0hOS2",
        "name": "عبدالله الشهري",
        "email": "alshehria470@gmail.com",
        "college": "كلية العلوم الصحية",
        "role": "مساهم في العلوم الصحية",
        "coursesCount": 6,
        "resourcesCount": 12,
        "points": 96,
        "badge": "وسام العطاء الفضي",
        "courses": sorted(list(ABDULLAH_COURSES))
    }
]

bundle_js_path = os.path.join(REPO, "data", "real-courses-bundle.js")
with open(bundle_js_path, "w", encoding="utf-8") as f:
    f.write("// Auto-generated real courses, contributors & Firestore ratings bundle for instant 0ms rendering\n")
    f.write("window.REAL_COMPUTING_COURSES = " + json.dumps(computing_courses, ensure_ascii=False, indent=2) + ";\n\n")
    f.write("window.REAL_HEALTH_COURSES = " + json.dumps(normalized_health, ensure_ascii=False, indent=2) + ";\n\n")
    f.write("window.REAL_BUSINESS_COURSES = " + json.dumps(business_extra, ensure_ascii=False, indent=2) + ";\n\n")
    f.write("window.REAL_THEORETICAL_COURSES = " + json.dumps(theoretical_courses, ensure_ascii=False, indent=2) + ";\n\n")
    f.write("window.REAL_COURSE_RATINGS = " + json.dumps(course_ratings, ensure_ascii=False, indent=2) + ";\n\n")
    f.write("window.REAL_CONTRIBUTORS = " + json.dumps(real_contributors, ensure_ascii=False, indent=2) + ";\n\n")
    f.write("window.ALL_REAL_COURSES = " + json.dumps(all_real_courses, ensure_ascii=False, indent=2) + ";\n")

print("Wrote", bundle_js_path)
