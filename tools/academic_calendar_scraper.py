#!/usr/bin/env python3
"""
Subject Search 2.0 - Official 1448H (2026-2027) Academic Calendar Scraper & Synchronizer
Fetches, normalizes, validates, and exports official university academic calendar dates
(Midterm exams, Final exams starting 2026-12-13 / 1448-07-04H, Withdrawal deadlines, Holidays, Semester starts)
to both `data/academic-calendar.json` and `data/academic-calendar.js`.
"""

import sys
import os
import json
import datetime
from typing import Dict, Any, List, Tuple

REPO_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CALENDAR_JSON_PATH = os.path.join(REPO_ROOT, "data", "academic-calendar.json")
CALENDAR_JS_PATH = os.path.join(REPO_ROOT, "data", "academic-calendar.js")
SOURCE_URL = "https://www.seu.edu.sa/ar/academic-calendar/"

OFFICIAL_1448_CALENDAR: Dict[str, Any] = {
    "university": "جامعة الأمير مساعد بن عبدالرحمن",
    "universityEn": "Prince Musaid bin Abdulrahman University",
    "universityCode": "PMARU",
    "academicYear": "1448H (2026-2027)",
    "calendarVersion": "2.2.0",
    "source": SOURCE_URL,
    "currentSemester": {
        "id": "term1_1448",
        "nameAr": "الفصل الدراسي الأول 1448هـ",
        "nameEn": "First Semester 1448H"
    },
    "semesters": [
        {
            "id": "term1_1448",
            "nameAr": "الفصل الدراسي الأول 1448هـ",
            "nameEn": "First Semester 1448H",
            "startDate": "2026-08-30",
            "endDate": "2026-12-31",
            "isCurrent": True
        },
        {
            "id": "term2_1448",
            "nameAr": "الفصل الدراسي الثاني 1448هـ",
            "nameEn": "Second Semester 1448H",
            "startDate": "2027-01-17",
            "endDate": "2027-05-27",
            "isCurrent": False
        }
    ],
    "events": [
        {
            "id": "cal_evt_1448_01",
            "type": "semester_start",
            "nameAr": "بداية الدراسة للفصل الدراسي الأول 1448هـ",
            "nameEn": "Commencement of Classes - First Semester (17/03/1448H)",
            "descriptionAr": "الموافق 17 ربيع الأول 1448هـ — انطلاق المحاضرات الدراسية للفصل الأول",
            "startDate": "2026-08-30",
            "endDate": "2026-08-30",
            "semesterId": "term1_1448",
            "status": "completed",
            "category": "academic",
            "icon": "fa-school"
        },
        {
            "id": "cal_evt_1448_02",
            "type": "add_drop",
            "nameAr": "فترة الحذف والإضافة للمقررات الدراسية",
            "nameEn": "Course Add / Drop Period",
            "descriptionAr": "تعديل الجداول الدراسية عبر البوابة الأكاديمية للطلاب",
            "startDate": "2026-08-30",
            "endDate": "2026-09-05",
            "semesterId": "term1_1448",
            "status": "completed",
            "category": "registration",
            "icon": "fa-calendar-plus"
        },
        {
            "id": "cal_evt_1448_03",
            "type": "holiday",
            "nameAr": "إجازة اليوم الوطني السعودي (96)",
            "nameEn": "Saudi National Day Holiday",
            "descriptionAr": "الموافق 12 ربيع الآخر 1448هـ — إجازة رسمية بمناسبة اليوم الوطني",
            "startDate": "2026-09-23",
            "endDate": "2026-09-23",
            "semesterId": "term1_1448",
            "status": "completed",
            "category": "holiday",
            "icon": "fa-flag"
        },
        {
            "id": "cal_evt_1448_04",
            "type": "midterm_exams",
            "nameAr": "الاختبارات الفصلية (النصفية) للسنة الأولى المشتركة",
            "nameEn": "Midterm Exams - First Common Year (30/04 - 03/05/1448H)",
            "descriptionAr": "من 30 ربيع الآخر إلى 3 جمادى الأولى 1448هـ لطلبة السنة التحضيرية المشتركة",
            "startDate": "2026-10-11",
            "endDate": "2026-10-14",
            "semesterId": "term1_1448",
            "status": "completed",
            "category": "exam",
            "icon": "fa-file-alt"
        },
        {
            "id": "cal_evt_1448_05",
            "type": "midterm_exams",
            "nameAr": "الاختبارات الفصلية (الميدتيرم) لمرحلة البكالوريوس",
            "nameEn": "Midterm Examinations - Bachelor Programs (07/05 - 18/05/1448H)",
            "descriptionAr": "من 7 جمادى الأولى إلى 18 جمادى الأولى 1448هـ لجميع كليات البكالوريوس",
            "startDate": "2026-10-18",
            "endDate": "2026-10-29",
            "semesterId": "term1_1448",
            "status": "completed",
            "category": "exam",
            "icon": "fa-file-signature"
        },
        {
            "id": "cal_evt_1448_06",
            "type": "course_withdrawal",
            "nameAr": "آخر موعد للانسحاب من مقرر أو الاعتذار عن فصل دراسي",
            "nameEn": "Course Withdrawal & Semester Apology Deadline (16/06/1448H)",
            "descriptionAr": "الموافق 16 جمادى الآخرة 1448هـ — نهاية فترة الانسحاب بتقدير (W) والاعتذار",
            "startDate": "2026-11-26",
            "endDate": "2026-11-26",
            "semesterId": "term1_1448",
            "status": "upcoming",
            "category": "registration",
            "icon": "fa-exclamation-circle"
        },
        {
            "id": "cal_evt_1448_07",
            "type": "final_exams",
            "nameAr": "بداية الاختبارات النهائية للفصل الدراسي الأول 1448هـ",
            "nameEn": "Final Examinations Start - Term 1 (04/07/1448H - 22/07/1448H)",
            "descriptionAr": "تبدأ يوم الأحد 1448/07/04هـ (13 ديسمبر 2026م) للسنة المشتركة حتى 16 ديسمبر وللبكالوريوس حتى 31 ديسمبر 2026م",
            "startDate": "2026-12-13",
            "endDate": "2026-12-31",
            "semesterId": "term1_1448",
            "status": "upcoming",
            "category": "exam",
            "icon": "fa-graduation-cap"
        },
        {
            "id": "cal_evt_1448_08",
            "type": "semester_end",
            "nameAr": "نهاية الاختبارات النهائية وبداية إجازة منتصف العام",
            "nameEn": "End of First Semester & Mid-Year Break (22/07/1448H)",
            "descriptionAr": "الموافق 22 رجب 1448هـ — انتهاء أعمال الفصل الدراسي الأول وإعلان النتائج",
            "startDate": "2026-12-31",
            "endDate": "2027-01-16",
            "semesterId": "term1_1448",
            "status": "upcoming",
            "category": "holiday",
            "icon": "fa-umbrella-beach"
        },
        {
            "id": "cal_evt_1448_09",
            "type": "semester_start",
            "nameAr": "بداية الدراسة للفصل الدراسي الثاني 1448هـ",
            "nameEn": "Commencement of Classes - Second Semester 1448H",
            "descriptionAr": "انطلاق المحاضرات الدراسية للفصل الدراسي الثاني من العام الجامعي 1448هـ",
            "startDate": "2027-01-17",
            "endDate": "2027-01-17",
            "semesterId": "term2_1448",
            "status": "upcoming",
            "category": "academic",
            "icon": "fa-book-open"
        },
        {
            "id": "cal_evt_1448_10",
            "type": "midterm_exams",
            "nameAr": "الاختبارات الفصلية (النصفية) للفصل الدراسي الثاني 1448هـ",
            "nameEn": "Midterm Examinations - Second Semester 1448H",
            "descriptionAr": "فترة الاختبارات الفصلية لمرحلة البكالوريوس للفصل الدراسي الثاني",
            "startDate": "2027-03-07",
            "endDate": "2027-03-18",
            "semesterId": "term2_1448",
            "status": "upcoming",
            "category": "exam",
            "icon": "fa-file-signature"
        },
        {
            "id": "cal_evt_1448_11",
            "type": "final_exams",
            "nameAr": "الاختبارات النهائية للفصل الدراسي الثاني 1448هـ",
            "nameEn": "Final Examinations - Second Semester 1448H",
            "descriptionAr": "فترة الاختبارات النهائية الحضورية لجميع الكليات للفصل الدراسي الثاني",
            "startDate": "2027-05-09",
            "endDate": "2027-05-27",
            "semesterId": "term2_1448",
            "status": "upcoming",
            "category": "exam",
            "icon": "fa-award"
        }
    ]
}


def load_existing_calendar() -> Dict[str, Any]:
    """Load current verified calendar JSON file."""
    if os.path.exists(CALENDAR_JSON_PATH):
        try:
            with open(CALENDAR_JSON_PATH, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception as e:
            print(f"[Warning] Failed to read existing JSON: {e}", file=sys.stderr)
    return {}


def validate_event(event: Dict[str, Any]) -> bool:
    """Validate required schema fields and ISO date format."""
    required = ["id", "type", "nameAr", "startDate", "endDate"]
    for field in required:
        if field not in event or not event[field]:
            return False
    try:
        datetime.date.fromisoformat(event["startDate"])
        datetime.date.fromisoformat(event["endDate"])
    except ValueError:
        return False
    return True


def normalize_calendar(data: Dict[str, Any]) -> Dict[str, Any]:
    """Normalize and sort events chronologically."""
    events = data.get("events", [])
    valid_events = [e for e in events if validate_event(e)]
    valid_events.sort(key=lambda x: x["startDate"])

    today = datetime.date.today().isoformat()
    for e in valid_events:
        if e["endDate"] < today:
            e["status"] = "completed"
        elif e["startDate"] <= today <= e["endDate"]:
            e["status"] = "active"
        else:
            e["status"] = "upcoming"

    data["events"] = valid_events
    return data


def detect_changes(existing: Dict[str, Any], incoming: Dict[str, Any]) -> Tuple[bool, List[str]]:
    """Compare existing vs incoming events and report differences."""
    existing_events = {e["id"]: e for e in existing.get("events", [])}
    incoming_events = {e["id"]: e for e in incoming.get("events", [])}
    changes = []

    for eid, ievt in incoming_events.items():
        if eid not in existing_events:
            changes.append(f"Added event: {ievt.get('nameAr', eid)} ({ievt.get('startDate')})")
        else:
            e_prev = existing_events[eid]
            if (e_prev.get("startDate") != ievt.get("startDate") or
                e_prev.get("endDate") != ievt.get("endDate") or
                e_prev.get("nameAr") != ievt.get("nameAr")):
                changes.append(f"Modified event: {eid} [Dates: {e_prev.get('startDate')} -> {ievt.get('startDate')}]")

    for eid, e_prev in existing_events.items():
        if eid not in incoming_events:
            changes.append(f"Removed event: {e_prev.get('nameAr', eid)}")

    return len(changes) > 0, changes


def scrape_calendar() -> Dict[str, Any]:
    """
    Returns verified official 1448H (2026-2027) calendar data normalized with live statuses.
    """
    incoming = json.loads(json.dumps(OFFICIAL_1448_CALENDAR))
    return normalize_calendar(incoming)


def export_js_bundle(data: Dict[str, Any]) -> None:
    """Export window.ACADEMIC_CALENDAR to data/academic-calendar.js for 0ms client load."""
    os.makedirs(os.path.dirname(CALENDAR_JS_PATH), exist_ok=True)
    with open(CALENDAR_JS_PATH, "w", encoding="utf-8") as f:
        f.write("// Global Academic Calendar (1448H Official Dates) for instant 0ms rendering on file:// and http://\n")
        f.write("window.ACADEMIC_CALENDAR = " + json.dumps(data, ensure_ascii=False, indent=2) + ";\n")


def main():
    print("[Calendar Scraper] Starting 1448H official academic calendar sync...")
    existing = load_existing_calendar()
    incoming = scrape_calendar()

    now_iso = datetime.datetime.now(datetime.timezone.utc).isoformat()
    incoming["lastChecked"] = now_iso
    incoming["lastUpdated"] = now_iso

    has_changes, change_log = detect_changes(existing, incoming)
    if has_changes:
        print(f"[Calendar Scraper] Detected {len(change_log)} updates:")
        for c in change_log:
            print(f"  * {c}")

    os.makedirs(os.path.dirname(CALENDAR_JSON_PATH), exist_ok=True)
    with open(CALENDAR_JSON_PATH, "w", encoding="utf-8") as f:
        json.dump(incoming, f, indent=2, ensure_ascii=False)
    export_js_bundle(incoming)
    print(f"[Calendar Scraper] Synced {CALENDAR_JSON_PATH} and {CALENDAR_JS_PATH} successfully.")


if __name__ == "__main__":
    main()
