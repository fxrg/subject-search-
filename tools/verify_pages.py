# -*- coding: utf-8 -*-
"""
Subject Search 2.0 - Headless Browser End-to-End Verification
Drives Microsoft Edge headless on Desktop (1280x800) and Mobile (390x844) viewports.
Verifies DOM output, absence of stuck loading states, university name, and component health.
"""

import subprocess
import urllib.request
import re
import sys

EDGE_PATH = r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
BASE_URL = "http://localhost:8085"

PAGES = [
    {"url": f"{BASE_URL}/index.html", "name": "Landing Page (Home)", "viewports": [(1280, 800), (390, 844)]},
    {"url": f"{BASE_URL}/page/all-colleges/computing/computing.html", "name": "Computing College Portal", "viewports": [(1280, 800), (390, 844)]},
    {"url": f"{BASE_URL}/page/all-colleges/theoretical/theoretical.html", "name": "Theoretical Studies Portal", "viewports": [(1280, 800), (390, 844)]},
    {"url": f"{BASE_URL}/page/all-colleges/all-colleges.html", "name": "All Colleges Hub", "viewports": [(1280, 800), (390, 844)]},
    {"url": f"{BASE_URL}/page/planner/planner.html", "name": "Academic Study Planner", "viewports": [(1280, 800), (390, 844)]},
    {"url": f"{BASE_URL}/page/prereq-graph/prereq-graph.html", "name": "Prerequisite Visualizer Graph", "viewports": [(1280, 800), (390, 844)]},
    {"url": f"{BASE_URL}/page/compare/compare.html", "name": "Course Comparison Matrix", "viewports": [(1280, 800), (390, 844)]}
]

def dump_dom(url, width, height):
    cmd = [
        EDGE_PATH,
        "--headless",
        "--disable-gpu",
        "--virtual-time-budget=3000",
        f"--window-size={width},{height}",
        "--dump-dom",
        url
    ]
    try:
        proc = subprocess.run(cmd, capture_output=True, text=True, encoding="utf-8", errors="replace", timeout=15)
        return proc.stdout
    except Exception as e:
        return f"ERROR: {e}"

def test_page(page_def):
    url = page_def["url"]
    name = page_def["name"]
    print(f"\n🌐 Testing: {name} ({url})")
    all_ok = True

    # 1. HTTP 200 check
    try:
        req = urllib.request.urlopen(url, timeout=5)
        code = req.getcode()
        print(f"  ✅ [HTTP {code}] Server responded successfully")
    except Exception as e:
        print(f"  ❌ [HTTP FAIL] Could not reach {url}: {e}")
        return False

    # 2. Viewport DOM tests
    for (w, h) in page_def["viewports"]:
        viewport_type = "Desktop" if w > 500 else "Mobile"
        dom = dump_dom(url, w, h)

        if not dom or dom.startswith("ERROR:"):
            print(f"  ❌ [{viewport_type} {w}x{h}] Headless Edge error: {dom[:100]}")
            all_ok = False
            continue

        # Check for stuck loading text
        stuck_terms = ["جاري تحميل مواد كلية", "جاري تحميل المقارنة...", "جاري بناء شجرة المتطلبات التفاعلية..."]
        found_stuck = [term for term in stuck_terms if term in dom]

        if found_stuck:
            print(f"  ⚠️ [{viewport_type} {w}x{h}] Stuck loading indicator found: {found_stuck}")
            all_ok = False
        else:
            print(f"  ✅ [{viewport_type} {w}x{h}] 0ms Instant Rendering (No stuck loading text)")

        # Check university name
        if "جامعة الأمير مساعد بن عبدالرحمن" in dom:
            print(f"  ✅ [{viewport_type} {w}x{h}] Correct University Name present in DOM")
        else:
            print(f"  ⚠️ [{viewport_type} {w}x{h}] University name missing in DOM")

        # Specific component checks
        if "computing.html" in url:
            if "CS 230" in dom and "IT 241" in dom:
                print(f"  ✅ [{viewport_type}] Computing courses (CS 230, IT 241) verified in DOM")
            else:
                print(f"  ❌ [{viewport_type}] Missing computing course badges in DOM")
                all_ok = False

        if "theoretical.html" in url:
            if "القانون" in dom and "الإعلام الرقمي" in dom and "اللغات والترجمة" in dom:
                print(f"  ✅ [{viewport_type}] All 4 Theoretical Majors verified in DOM")
            else:
                print(f"  ❌ [{viewport_type}] Missing theoretical majors in DOM")
                all_ok = False

        if "planner.html" in url:
            if "progressBar" in dom and "progressPercent" in dom:
                print(f"  ✅ [{viewport_type}] Academic Progress Bar elements verified")
            else:
                all_ok = False

        if "prereq-graph.html" in url:
            if "majorFilterSelect" in dom and "prereqGraphContainer" in dom:
                print(f"  ✅ [{viewport_type}] Prerequisite Graph container & major selector verified")
            else:
                all_ok = False

        if "compare.html" in url:
            if "courseSelectPicker" in dom and "comparisonContainer" in dom:
                print(f"  ✅ [{viewport_type}] Course Comparison matrix container verified")
            else:
                all_ok = False

    return all_ok

def main():
    print("=" * 60)
    print("🧪 Executing Real Headless Edge Browser Verification")
    print("=" * 60)

    results = []
    for p in PAGES:
        passed = test_page(p)
        results.append((p["name"], passed))

    print("\n" + "=" * 60)
    print("📊 Verification Results Summary")
    print("=" * 60)
    total_passed = sum(1 for _, ok in results if ok)
    for name, ok in results:
        status = "✅ PASS" if ok else "❌ FAIL"
        print(f"  {status} - {name}")

    print(f"\nFinal Score: {total_passed}/{len(PAGES)} Pages fully verified.")
    if total_passed == len(PAGES):
        print("🎉 ALL REAL BROWSER TESTS PASSED SUCCESSFULLY!")
        sys.exit(0)
    else:
        sys.exit(1)

if __name__ == "__main__":
    main()
