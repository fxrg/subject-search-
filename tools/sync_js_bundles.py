# -*- coding: utf-8 -*-
"""
Sync study-plans.json with:
1. Official Preparatory Year (Levels 1 & 2) across ALL majors in ALL 4 colleges:
   - Level 1: ENG001, CS001, CI001
   - Level 2: ENG002, MATH001, COMM001
   (Strictly NO ENG103 or ISLM101 or specialized courses in Levels 1 & 2!)
2. Exact real course codes in REAL_COMPUTING_COURSES for CS, IT, DS Levels 3-8.
3. All 4 official majors in Theoretical Studies (law, med, trn, stat) + 5 majors in Business (ba, acct, fin, ecom, mis).
4. Export global JS files:
   - data/study-plans.js (window.STUDY_PLANS)
   - data/academic-calendar.js (window.ACADEMIC_CALENDAR)
"""
import json
import os

REPO = r"C:\Users\HUAWEI\subject-search"
plans_json_path = os.path.join(REPO, "data", "study-plans.json")
cal_json_path = os.path.join(REPO, "data", "academic-calendar.json")

with open(plans_json_path, "r", encoding="utf-8") as f:
    plans = json.load(f)

PREP_LEVEL_1 = [
    {"code": "ENG001", "nameAr": "اللغة الإنجليزية 1", "nameEn": "English Language I", "creditHours": 4, "prerequisites": []},
    {"code": "CS001", "nameAr": "مهارات الحاسب الآلي", "nameEn": "Computer Skills", "creditHours": 3, "prerequisites": []},
    {"code": "CI001", "nameAr": "المهارات الأكاديمية والتعلم الذاتي", "nameEn": "Academic Skills", "creditHours": 2, "prerequisites": []}
]

PREP_LEVEL_2 = [
    {"code": "ENG002", "nameAr": "اللغة الإنجليزية 2", "nameEn": "English Language II", "creditHours": 4, "prerequisites": ["ENG001"]},
    {"code": "MATH001", "nameAr": "الرياضيات التحضيرية", "nameEn": "Preparatory Mathematics", "creditHours": 3, "prerequisites": []},
    {"code": "COMM001", "nameAr": "مهارات الاتصال", "nameEn": "Communication Skills", "creditHours": 2, "prerequisites": []}
]

# Update CS, IT, DS levels 1-8 in study-plans.json
plans["colleges"]["computing"]["majors"]["cs"]["levels"] = {
    "1": [dict(x) for x in PREP_LEVEL_1],
    "2": [dict(x) for x in PREP_LEVEL_2],
    "3": [
        {"code": "CS230", "nameAr": "البرمجة الشيئية", "nameEn": "Object-Oriented Programming", "creditHours": 3, "prerequisites": ["CS001"]},
        {"code": "CS231", "nameAr": "تصميم المنطق الرقمي", "nameEn": "Digital Logic Design", "creditHours": 3, "prerequisites": ["CS001"]},
        {"code": "MATH150", "nameAr": "الرياضيات المتقطعة", "nameEn": "Discrete Mathematics", "creditHours": 3, "prerequisites": ["MATH001"]},
        {"code": "SCI101", "nameAr": "الفيزياء العامة 1", "nameEn": "General Physics I", "creditHours": 3, "prerequisites": []},
        {"code": "ENG103", "nameAr": "الكتابة التقنية", "nameEn": "Technical Writing", "creditHours": 3, "prerequisites": ["ENG002"]},
        {"code": "ISLM101", "nameAr": "العقيدة الإسلامية", "nameEn": "Islamic Faith", "creditHours": 2, "prerequisites": []}
    ],
    "4": [
        {"code": "CS240", "nameAr": "هياكل البيانات", "nameEn": "Data Structures", "creditHours": 3, "prerequisites": ["CS230"]},
        {"code": "CS241", "nameAr": "عمارة وتنظيم الحاسب", "nameEn": "Computer Architecture & Organization", "creditHours": 3, "prerequisites": ["CS231"]},
        {"code": "CS242", "nameAr": "نظرية الحوسبة", "nameEn": "Theory of Computing", "creditHours": 3, "prerequisites": ["CS230", "MATH150"]},
        {"code": "CS243", "nameAr": "الرياضيات المتقطعة التطبيقية", "nameEn": "Applied Discrete Mathematics", "creditHours": 3, "prerequisites": ["MATH150"]},
        {"code": "SCI201", "nameAr": "الفيزياء العامة 2", "nameEn": "General Physics II", "creditHours": 3, "prerequisites": ["SCI101"]},
        {"code": "MATH251", "nameAr": "الجبر الخطي", "nameEn": "Linear Algebra", "creditHours": 3, "prerequisites": ["MATH150"]}
    ],
    "5": [
        {"code": "CS350", "nameAr": "مقدمة في قواعد البيانات", "nameEn": "Introduction to Databases", "creditHours": 3, "prerequisites": ["CS240"]},
        {"code": "CS351", "nameAr": "نظم التشغيل", "nameEn": "Operating Systems", "creditHours": 3, "prerequisites": ["CS240", "CS241"]},
        {"code": "CS352", "nameAr": "تصميم وتحليل الخوارزميات", "nameEn": "Design and Analysis of Algorithms", "creditHours": 3, "prerequisites": ["CS240"]},
        {"code": "CS353", "nameAr": "مفاهيم لغات البرمجة", "nameEn": "Programming Languages Concepts", "creditHours": 3, "prerequisites": ["CS240"]}
    ],
    "6": [
        {"code": "CS360", "nameAr": "هندسة البرمجيات", "nameEn": "Software Engineering", "creditHours": 3, "prerequisites": ["CS350"]},
        {"code": "CS361", "nameAr": "برمجة الويب", "nameEn": "Web Programming", "creditHours": 3, "prerequisites": ["CS350"]},
        {"code": "CS362", "nameAr": "الذكاء الاصطناعي", "nameEn": "Artificial Intelligence", "creditHours": 3, "prerequisites": ["CS352", "MATH251"]},
        {"code": "CS363", "nameAr": "مبادئ شبكات الحاسب", "nameEn": "Computer Networks Principles", "creditHours": 3, "prerequisites": ["CS351"]},
        {"code": "CS364", "nameAr": "تفاعل الإنسان مع الحاسب", "nameEn": "Human Computer Interaction", "creditHours": 3, "prerequisites": ["CS240"]}
    ],
    "7": [
        {"code": "CS470", "nameAr": "مشروع التخرج 1", "nameEn": "Senior Capstone Project I", "creditHours": 3, "prerequisites": ["CS360", "CS350"]},
        {"code": "CS475", "nameAr": "تطوير تطبيقات الجوال", "nameEn": "Mobile Application Development", "creditHours": 3, "prerequisites": ["CS360"]},
        {"code": "CS476", "nameAr": "الحوسبة المتوازية والموزعة", "nameEn": "Parallel & Distributed Computing", "creditHours": 3, "prerequisites": ["CS351"]}
    ],
    "8": [
        {"code": "CS480", "nameAr": "مشروع التخرج 2", "nameEn": "Senior Capstone Project II", "creditHours": 3, "prerequisites": ["CS470"]},
        {"code": "CS481", "nameAr": "أخلاقيات المهنة في الحاسب", "nameEn": "Professional Ethics in Computing", "creditHours": 3, "prerequisites": ["CS360"]}
    ]
}

plans["colleges"]["computing"]["majors"]["ds"]["nameAr"] = "علوم البيانات"
plans["colleges"]["computing"]["majors"]["ds"]["levels"] = {
    "1": [dict(x) for x in PREP_LEVEL_1],
    "2": [dict(x) for x in PREP_LEVEL_2],
    "3": [
        {"code": "DS230", "nameAr": "البرمجة الكائنية لعلوم البيانات", "nameEn": "Object-Oriented Programming", "creditHours": 3, "prerequisites": ["CS001"]},
        {"code": "DS231", "nameAr": "مقدمة في علم البيانات", "nameEn": "Introduction to Data Science", "creditHours": 3, "prerequisites": ["CS001"]},
        {"code": "MATH150", "nameAr": "الرياضيات المتقطعة", "nameEn": "Discrete Mathematics", "creditHours": 3, "prerequisites": ["MATH001"]},
        {"code": "SCI101", "nameAr": "الفيزياء العامة 1", "nameEn": "General Physics I", "creditHours": 3, "prerequisites": []},
        {"code": "ENG103", "nameAr": "الكتابة التقنية", "nameEn": "Technical Writing", "creditHours": 3, "prerequisites": ["ENG002"]},
        {"code": "ISLM101", "nameAr": "العقيدة الإسلامية", "nameEn": "Islamic Faith", "creditHours": 2, "prerequisites": []}
    ],
    "4": [
        {"code": "DS240", "nameAr": "هياكل البيانات", "nameEn": "Data Structures", "creditHours": 3, "prerequisites": ["DS230"]},
        {"code": "DS242", "nameAr": "البرمجة المتقدمة للبيانات (Python)", "nameEn": "Advanced Data Programming", "creditHours": 3, "prerequisites": ["DS230"]},
        {"code": "DS243", "nameAr": "الرياضيات المتقطعة للبيانات", "nameEn": "Discrete Math for DS", "creditHours": 3, "prerequisites": ["MATH150"]},
        {"code": "MATH241", "nameAr": "الجبر الخطي", "nameEn": "Linear Algebra", "creditHours": 3, "prerequisites": ["MATH150"]}
    ],
    "5": [
        {"code": "DS350", "nameAr": "مقدمة في قواعد البيانات", "nameEn": "Introduction to Databases", "creditHours": 3, "prerequisites": ["DS240"]},
        {"code": "DS351", "nameAr": "تحليل البيانات وتصويرها", "nameEn": "Data Analytics & Visualization", "creditHours": 3, "prerequisites": ["DS242"]},
        {"code": "DS352", "nameAr": "تصميم وتحليل الخوارزميات", "nameEn": "Design & Analysis of Algorithms", "creditHours": 3, "prerequisites": ["DS240"]},
        {"code": "DS353", "nameAr": "هندسة البرمجيات للبيانات", "nameEn": "Software Engineering for DS", "creditHours": 3, "prerequisites": ["DS240"]}
    ],
    "6": [
        {"code": "DS360", "nameAr": "أمن الحاسب والبيانات", "nameEn": "Computer & Data Security", "creditHours": 3, "prerequisites": ["DS350"]},
        {"code": "DS361", "nameAr": "التنقيب في البيانات", "nameEn": "Data Mining", "creditHours": 3, "prerequisites": ["DS351"]},
        {"code": "DS362", "nameAr": "الذكاء الاصطناعي وتعلم الآلة", "nameEn": "AI & Machine Learning", "creditHours": 3, "prerequisites": ["DS352", "MATH241"]},
        {"code": "DS363", "nameAr": "نظم إدارة قواعد البيانات المتقدمة", "nameEn": "Advanced DBMS", "creditHours": 3, "prerequisites": ["DS350"]},
        {"code": "DS364", "nameAr": "تنسيق البيانات", "nameEn": "Data Curation", "creditHours": 3, "prerequisites": ["DS350"]}
    ],
    "7": [
        {"code": "DS470", "nameAr": "أمن البيانات والخصوصية", "nameEn": "Data Security & Privacy", "creditHours": 3, "prerequisites": ["DS360"]},
        {"code": "DS474", "nameAr": "دعم القرار الذكي", "nameEn": "Intelligent Decision Support", "creditHours": 3, "prerequisites": ["DS362"]}
    ],
    "8": [
        {"code": "DS481", "nameAr": "أخلاقيات المهنة في علم البيانات", "nameEn": "Ethics in Data Science", "creditHours": 3, "prerequisites": ["DS470"]},
        {"code": "DS483", "nameAr": "معالجة اللغات الطبيعية", "nameEn": "Natural Language Processing", "creditHours": 3, "prerequisites": ["DS362"]},
        {"code": "DS485", "nameAr": "ذكاء الأعمال", "nameEn": "Business Intelligence", "creditHours": 3, "prerequisites": ["DS361"]}
    ]
}

plans["colleges"]["computing"]["majors"]["it"]["levels"] = {
    "1": [dict(x) for x in PREP_LEVEL_1],
    "2": [dict(x) for x in PREP_LEVEL_2],
    "3": [
        {"code": "IT231", "nameAr": "مقدمة في تقنية المعلومات", "nameEn": "Introduction to IT", "creditHours": 3, "prerequisites": ["CS001"]},
        {"code": "IT232", "nameAr": "البرمجة الشيئية", "nameEn": "Object-Oriented Programming", "creditHours": 3, "prerequisites": ["IT231"]},
        {"code": "IT233", "nameAr": "تنظيم الحاسب", "nameEn": "Computer Organization", "creditHours": 3, "prerequisites": ["IT231"]},
        {"code": "MATH150", "nameAr": "الرياضيات المتقطعة", "nameEn": "Discrete Mathematics", "creditHours": 3, "prerequisites": ["MATH001"]},
        {"code": "ENG103", "nameAr": "الكتابة التقنية", "nameEn": "Technical Writing", "creditHours": 3, "prerequisites": ["ENG002"]},
        {"code": "ISLM101", "nameAr": "العقيدة الإسلامية", "nameEn": "Islamic Faith", "creditHours": 2, "prerequisites": []}
    ],
    "4": [
        {"code": "IT240", "nameAr": "مقدمة في قواعد البيانات", "nameEn": "Introduction to Databases", "creditHours": 3, "prerequisites": ["IT232"]},
        {"code": "IT241", "nameAr": "نظم التشغيل", "nameEn": "Operating Systems", "creditHours": 3, "prerequisites": ["IT233"]},
        {"code": "IT244", "nameAr": "مقدمة في قواعد البيانات والبرمجة", "nameEn": "Databases & Programming", "creditHours": 3, "prerequisites": ["IT232"]},
        {"code": "IT245", "nameAr": "هياكل البيانات", "nameEn": "Data Structures", "creditHours": 3, "prerequisites": ["IT232"]}
    ],
    "5": [
        {"code": "IT351", "nameAr": "شبكات الحاسب", "nameEn": "Computer Networks", "creditHours": 3, "prerequisites": ["IT241"]},
        {"code": "IT352", "nameAr": "تفاعل الإنسان مع الحاسب", "nameEn": "Human Computer Interaction", "creditHours": 3, "prerequisites": ["IT232"]},
        {"code": "IT353", "nameAr": "تحليل وتصميم النظم", "nameEn": "Systems Analysis & Design", "creditHours": 3, "prerequisites": ["IT244"]},
        {"code": "IT354", "nameAr": "نظم إدارة قواعد البيانات", "nameEn": "Database Management Systems", "creditHours": 3, "prerequisites": ["IT244"]}
    ],
    "6": [
        {"code": "IT361", "nameAr": "إدارة المشاريع التقنية", "nameEn": "IT Project Management", "creditHours": 3, "prerequisites": ["IT353"]},
        {"code": "IT362", "nameAr": "أمن ومخاطر تقنية المعلومات", "nameEn": "IT Security & Risk Management", "creditHours": 3, "prerequisites": ["IT351"]},
        {"code": "IT363", "nameAr": "إدارة الشبكات", "nameEn": "Network Management", "creditHours": 3, "prerequisites": ["IT351"]},
        {"code": "IT364", "nameAr": "ريادة الأعمال التقنية والابتكار", "nameEn": "IT Entrepreneurship & Innovation", "creditHours": 3, "prerequisites": ["IT353"]},
        {"code": "IT365", "nameAr": "نظم المؤسسات", "nameEn": "Enterprise Systems", "creditHours": 3, "prerequisites": ["IT354"]}
    ],
    "7": [
        {"code": "IT475", "nameAr": "مشروع التخرج 1", "nameEn": "IT Capstone Project I", "creditHours": 3, "prerequisites": ["IT361", "IT353"]}
    ],
    "8": [
        {"code": "IT485", "nameAr": "الأخلاقيات المهنية في تقنية المعلومات", "nameEn": "Professional Ethics in IT", "creditHours": 3, "prerequisites": ["IT475"]}
    ]
}

# Add MIS major to business if not present
if "mis" not in plans["colleges"]["business"]["majors"]:
    plans["colleges"]["business"]["majors"]["mis"] = {
        "majorId": "mis",
        "nameAr": "نظم المعلومات الإدارية",
        "nameEn": "Management Information Systems",
        "totalCredits": 130,
        "levels": {
            "1": [dict(x) for x in PREP_LEVEL_1],
            "2": [dict(x) for x in PREP_LEVEL_2],
            "3": [
                {"code": "MGT101", "nameAr": "مبادئ الإدارة", "nameEn": "Principles of Management", "creditHours": 3, "prerequisites": []},
                {"code": "ACCT101", "nameAr": "مبادئ المحاسبة المالية", "nameEn": "Financial Accounting", "creditHours": 3, "prerequisites": ["MATH001"]},
                {"code": "ECON101", "nameAr": "مبادئ الاقتصاد الجزئي", "nameEn": "Microeconomics", "creditHours": 3, "prerequisites": ["MATH001"]},
                {"code": "MIS201", "nameAr": "مبادئ نظم المعلومات الإدارية", "nameEn": "Principles of MIS", "creditHours": 3, "prerequisites": ["CS001"]}
            ],
            "4": [
                {"code": "MIS210", "nameAr": "تحليل وتصميم نظم المعلومات", "nameEn": "Systems Analysis & Design", "creditHours": 3, "prerequisites": ["MIS201"]},
                {"code": "MIS220", "nameAr": "إدارة قواعد البيانات للأعمال", "nameEn": "Business Database Management", "creditHours": 3, "prerequisites": ["MIS201"]},
                {"code": "STAT101", "nameAr": "الإحصاء للأعمال", "nameEn": "Business Statistics", "creditHours": 3, "prerequisites": ["MATH001"]},
                {"code": "FIN201", "nameAr": "الإدارة المالية", "nameEn": "Financial Management", "creditHours": 3, "prerequisites": ["ACCT101"]}
            ],
            "5": [
                {"code": "MIS310", "nameAr": "نظم تخطيط موارد المؤسسات (ERP)", "nameEn": "Enterprise Resource Planning", "creditHours": 3, "prerequisites": ["MIS210"]},
                {"code": "MIS320", "nameAr": "اتصالات البيانات وشبكات الأعمال", "nameEn": "Business Data Networks", "creditHours": 3, "prerequisites": ["MIS201"]},
                {"code": "ECOM101", "nameAr": "التجارة الإلكترونية", "nameEn": "E-Commerce", "creditHours": 3, "prerequisites": ["MGT101"]},
                {"code": "ISLM101", "nameAr": "العقيدة الإسلامية", "nameEn": "Islamic Faith", "creditHours": 2, "prerequisites": []}
            ],
            "6": [
                {"code": "MIS350", "nameAr": "ذكاء الأعمال وتحليلات القرار", "nameEn": "Business Intelligence & Analytics", "creditHours": 3, "prerequisites": ["MIS220", "STAT101"]},
                {"code": "MIS360", "nameAr": "إدارة مشاريع نظم المعلومات", "nameEn": "IS Project Management", "creditHours": 3, "prerequisites": ["MIS210"]},
                {"code": "MIS370", "nameAr": "أمن وحوكمة نظم المعلومات", "nameEn": "IS Security & Governance", "creditHours": 3, "prerequisites": ["MIS320"]}
            ],
            "7": [
                {"code": "MIS470", "nameAr": "مشروع التخرج في نظم المعلومات الإدارية 1", "nameEn": "MIS Capstone Project I", "creditHours": 3, "prerequisites": ["MIS350", "MIS360"]}
            ],
            "8": [
                {"code": "MIS480", "nameAr": "مشروع التخرج في نظم المعلومات الإدارية 2", "nameEn": "MIS Capstone Project II", "creditHours": 3, "prerequisites": ["MIS470"]}
            ]
        }
    }

# Ensure Theoretical Studies 4th major has the exact requested title
if "stat" in plans["colleges"]["theoretical"]["majors"]:
    plans["colleges"]["theoretical"]["majors"]["stat"]["nameAr"] = "الإحصاء التطبيقي وتحليل البيانات"

# Enforce Preparatory Year (Levels 1 & 2) across all other colleges (business, health, theoretical)
# Any non-preparatory courses that were in Level 1 or Level 2 (excluding ENG103/ISLM101) get prepended into Level 3 if needed
PREP_CODES_SET = {"ENG001", "CS001", "CI001", "ENG002", "MATH001", "COMM001", "MATH002"}

for col_id, col_data in plans["colleges"].items():
    if col_id == "computing":
        continue
    for maj_id, maj_data in col_data.get("majors", {}).items():
        levels = maj_data.get("levels", {})
        old_l1 = levels.get("1", [])
        old_l2 = levels.get("2", [])
        old_l3 = levels.get("3", [])

        # Collect foundational major courses that were sitting in L1/L2 (like MGT101, ACCT101, ECON101, ECOM101, BIOL101, PH101, LAW101, etc.)
        moved_to_l3 = []
        existing_l3_codes = {c["code"].replace(" ", "").upper() for c in old_l3}
        for item in (old_l1 + old_l2):
            clean_c = item["code"].replace(" ", "").upper()
            if clean_c in PREP_CODES_SET or clean_c in ("ISLM101", "ENG103"):
                continue
            if clean_c not in existing_l3_codes:
                item_copy = dict(item)
                item_copy["code"] = clean_c
                item_copy["prerequisites"] = [
                    p.replace(" ", "").upper() for p in item.get("prerequisites", [])
                    if p.replace(" ", "").upper() in PREP_CODES_SET
                ]
                moved_to_l3.append(item_copy)
                existing_l3_codes.add(clean_c)

        # Normalize codes in L3..L8 (strip spaces in codes & prereqs, replace MATH002 -> MATH001)
        levels["1"] = [dict(x) for x in PREP_LEVEL_1]
        levels["2"] = [dict(x) for x in PREP_LEVEL_2]
        levels["3"] = moved_to_l3 + old_l3

        # Collect all valid codes in the major after move
        all_major_codes = set()
        for lv_key in ["1", "2", "3", "4", "5", "6", "7", "8"]:
            for c_obj in levels.get(lv_key, []):
                c_obj["code"] = c_obj["code"].replace(" ", "").upper()
                all_major_codes.add(c_obj["code"])

        for lv_key in ["3", "4", "5", "6", "7", "8"]:
            for c_obj in levels.get(lv_key, []):
                new_prereqs = []
                for p in c_obj.get("prerequisites", []):
                    cp = p.replace(" ", "").upper()
                    if cp == "MATH002":
                        cp = "MATH001"
                    elif cp in ("CS140", "IT140", "DS140"):
                        cp = "CS001"
                    if cp in all_major_codes and cp != c_obj["code"] and cp not in new_prereqs:
                        new_prereqs.append(cp)
                c_obj["prerequisites"] = new_prereqs

with open(plans_json_path, "w", encoding="utf-8") as f:
    json.dump(plans, f, ensure_ascii=False, indent=2)

with open(os.path.join(REPO, "data", "study-plans.js"), "w", encoding="utf-8") as f:
    f.write("// Global Study Plans for instant 0ms rendering on file:// and http://\n")
    f.write("window.STUDY_PLANS = " + json.dumps(plans, ensure_ascii=False, indent=2) + ";\n")

with open(cal_json_path, "r", encoding="utf-8") as f:
    cal = json.load(f)

with open(os.path.join(REPO, "data", "academic-calendar.js"), "w", encoding="utf-8") as f:
    f.write("// Global Academic Calendar for instant 0ms rendering on file:// and http://\n")
    f.write("window.ACADEMIC_CALENDAR = " + json.dumps(cal, ensure_ascii=False, indent=2) + ";\n")

print("Successfully updated study-plans.json, study-plans.js, and academic-calendar.js")
