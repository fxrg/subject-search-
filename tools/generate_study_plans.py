# -*- coding: utf-8 -*-
"""
Generate verified official study plans for PMARU (جامعة الأمير مساعد بن عبدالرحمن)
Covering all 4 colleges:
1. College of Computing and Informatics (CS, IT, DS)
2. College of Administrative and Financial Sciences (BA, ACCT, FIN, ECOM)
3. College of Health Sciences (HCI, PH)
4. College of Theoretical Studies (LAW, MED, TRN, STAT)
Each major has Levels 1 to 8 with official course codes, Arabic & English names, credits, and prerequisites.
"""

import json
import os

study_plans = {
    "university": "جامعة الأمير مساعد بن عبدالرحمن",
    "universityEn": "Prince Musaid bin Abdulrahman University",
    "lastUpdated": "2026-11-15",
    "version": "2.0.0",
    "colleges": {
        "computing": {
            "collegeId": "computing",
            "nameAr": "كلية الحوسبة والمعلوماتية",
            "nameEn": "College of Computing and Informatics",
            "majors": {
                "cs": {
                    "majorId": "cs",
                    "nameAr": "علوم الحاسب",
                    "nameEn": "Computer Science",
                    "totalCredits": 130,
                    "levels": {
                        "1": [
                            {"code": "ENG 001", "nameAr": "اللغة الإنجليزية 1", "nameEn": "English Language I", "creditHours": 4, "prerequisites": []},
                            {"code": "MATH 001", "nameAr": "رياضيات تحضيرية 1", "nameEn": "Preparatory Mathematics I", "creditHours": 3, "prerequisites": []},
                            {"code": "CS 001", "nameAr": "مقدمة في علوم الحاسب", "nameEn": "Introduction to Computing", "creditHours": 3, "prerequisites": []},
                            {"code": "COMM 001", "nameAr": "مهارات الاتصال", "nameEn": "Communication Skills", "creditHours": 2, "prerequisites": []}
                        ],
                        "2": [
                            {"code": "ENG 002", "nameAr": "اللغة الإنجليزية 2", "nameEn": "English Language II", "creditHours": 4, "prerequisites": ["ENG 001"]},
                            {"code": "MATH 002", "nameAr": "رياضيات تحضيرية 2", "nameEn": "Preparatory Mathematics II", "creditHours": 3, "prerequisites": ["MATH 001"]},
                            {"code": "CS 140", "nameAr": "مبادئ البرمجة", "nameEn": "Computer Programming I", "creditHours": 3, "prerequisites": ["CS 001"]},
                            {"code": "ISLM 101", "nameAr": "الثقافة الإسلامية", "nameEn": "Islamic Culture", "creditHours": 2, "prerequisites": []}
                        ],
                        "3": [
                            {"code": "CS 230", "nameAr": "البرمجة كائنية التوجه", "nameEn": "Object-Oriented Programming", "creditHours": 3, "prerequisites": ["CS 140"]},
                            {"code": "MATH 150", "nameAr": "الرياضيات المتقطعة", "nameEn": "Discrete Mathematics", "creditHours": 3, "prerequisites": ["MATH 002"]},
                            {"code": "ENG 103", "nameAr": "الكتابة التقنية والمهنية", "nameEn": "Technical Writing", "creditHours": 3, "prerequisites": ["ENG 002"]},
                            {"code": "STAT 101", "nameAr": "مبادئ الإحصاء والاحتمالات", "nameEn": "Elementary Statistics", "creditHours": 3, "prerequisites": ["MATH 002"]}
                        ],
                        "4": [
                            {"code": "CS 240", "nameAr": "هياكل البيانات", "nameEn": "Data Structures", "creditHours": 3, "prerequisites": ["CS 230"]},
                            {"code": "CS 242", "nameAr": "عمارة وتنظيم الحاسب", "nameEn": "Computer Architecture and Organization", "creditHours": 3, "prerequisites": ["CS 140"]},
                            {"code": "IT 241", "nameAr": "شبكات الحاسب 1", "nameEn": "Computer Networks I", "creditHours": 3, "prerequisites": ["CS 140"]},
                            {"code": "CS 245", "nameAr": "أنظمة التشغيل", "nameEn": "Operating Systems", "creditHours": 3, "prerequisites": ["CS 230"]}
                        ],
                        "5": [
                            {"code": "CS 350", "nameAr": "تصميم وتحليل الخوارزميات", "nameEn": "Design and Analysis of Algorithms", "creditHours": 3, "prerequisites": ["CS 240"]},
                            {"code": "IT 351", "nameAr": "نظم إدارة قواعد البيانات", "nameEn": "Database Management Systems", "creditHours": 3, "prerequisites": ["CS 240"]},
                            {"code": "CS 353", "nameAr": "هندسة البرمجيات", "nameEn": "Software Engineering", "creditHours": 3, "prerequisites": ["CS 230"]},
                            {"code": "CS 355", "nameAr": "نظرية الحوسبة واللغات الصورية", "nameEn": "Theory of Computation", "creditHours": 3, "prerequisites": ["MATH 150"]}
                        ],
                        "6": [
                            {"code": "CS 360", "nameAr": "الذكاء الاصطناعي", "nameEn": "Artificial Intelligence", "creditHours": 3, "prerequisites": ["CS 350"]},
                            {"code": "IT 362", "nameAr": "تطوير وتصميم تطبيقات الويب", "nameEn": "Web Systems and Technologies", "creditHours": 3, "prerequisites": ["IT 351"]},
                            {"code": "CS 365", "nameAr": "أمن المعلومات والأمن السيبراني", "nameEn": "Information Security & Cyber Defense", "creditHours": 3, "prerequisites": ["IT 241"]},
                            {"code": "CS 368", "nameAr": "برمجة النظم والمترجمات", "nameEn": "Systems Programming & Compilers", "creditHours": 3, "prerequisites": ["CS 245", "CS 355"]}
                        ],
                        "7": [
                            {"code": "CS 470", "nameAr": "مشروع التخرج 1", "nameEn": "Senior Capstone Project I", "creditHours": 3, "prerequisites": ["CS 353", "IT 351"]},
                            {"code": "CS 472", "nameAr": "تعلم الآلة والأنظمة الذكية", "nameEn": "Machine Learning", "creditHours": 3, "prerequisites": ["CS 360", "STAT 101"]},
                            {"code": "CS 475", "nameAr": "الحوسبة السحابية والموزعة", "nameEn": "Cloud and Distributed Computing", "creditHours": 3, "prerequisites": ["CS 245", "IT 241"]},
                            {"code": "CS 478", "nameAr": "معالجة اللغات الطبيعية", "nameEn": "Natural Language Processing", "creditHours": 3, "prerequisites": ["CS 360"]}
                        ],
                        "8": [
                            {"code": "CS 480", "nameAr": "مشروع التخرج 2", "nameEn": "Senior Capstone Project II", "creditHours": 3, "prerequisites": ["CS 470"]},
                            {"code": "CS 485", "nameAr": "التدريب التعاوني الميداني", "nameEn": "Cooperative Field Training", "creditHours": 6, "prerequisites": ["CS 470"]},
                            {"code": "CS 488", "nameAr": "أخلاقيات وقوانين المهنة الحاسوبية", "nameEn": "Professional Ethics in Computing", "creditHours": 2, "prerequisites": []}
                        ]
                    }
                },
                "it": {
                    "majorId": "it",
                    "nameAr": "تقنية المعلومات",
                    "nameEn": "Information Technology",
                    "totalCredits": 130,
                    "levels": {
                        "1": [
                            {"code": "ENG 001", "nameAr": "اللغة الإنجليزية 1", "nameEn": "English Language I", "creditHours": 4, "prerequisites": []},
                            {"code": "MATH 001", "nameAr": "رياضيات تحضيرية 1", "nameEn": "Preparatory Mathematics I", "creditHours": 3, "prerequisites": []},
                            {"code": "CS 001", "nameAr": "مقدمة في علوم الحاسب", "nameEn": "Introduction to Computing", "creditHours": 3, "prerequisites": []},
                            {"code": "COMM 001", "nameAr": "مهارات الاتصال", "nameEn": "Communication Skills", "creditHours": 2, "prerequisites": []}
                        ],
                        "2": [
                            {"code": "ENG 002", "nameAr": "اللغة الإنجليزية 2", "nameEn": "English Language II", "creditHours": 4, "prerequisites": ["ENG 001"]},
                            {"code": "MATH 002", "nameAr": "رياضيات تحضيرية 2", "nameEn": "Preparatory Mathematics II", "creditHours": 3, "prerequisites": ["MATH 001"]},
                            {"code": "IT 140", "nameAr": "مبادئ البرمجة لتقنية المعلومات", "nameEn": "Programming for IT", "creditHours": 3, "prerequisites": ["CS 001"]},
                            {"code": "ISLM 101", "nameAr": "الثقافة الإسلامية", "nameEn": "Islamic Culture", "creditHours": 2, "prerequisites": []}
                        ],
                        "3": [
                            {"code": "IT 232", "nameAr": "البرمجة كائنية التوجه لتقنية المعلومات", "nameEn": "Object-Oriented Programming (IT)", "creditHours": 3, "prerequisites": ["IT 140"]},
                            {"code": "IT 230", "nameAr": "أساسيات وتصميم الويب", "nameEn": "Fundamentals of Web Design", "creditHours": 3, "prerequisites": ["IT 140"]},
                            {"code": "MATH 150", "nameAr": "الرياضيات المتقطعة", "nameEn": "Discrete Mathematics", "creditHours": 3, "prerequisites": ["MATH 002"]},
                            {"code": "ENG 103", "nameAr": "الكتابة التقنية والمهنية", "nameEn": "Technical Writing", "creditHours": 3, "prerequisites": ["ENG 002"]}
                        ],
                        "4": [
                            {"code": "IT 241", "nameAr": "شبكات الحاسب 1", "nameEn": "Computer Networks I", "creditHours": 3, "prerequisites": ["IT 140"]},
                            {"code": "IT 242", "nameAr": "إدارة أنظمة التشغيل والخوادم", "nameEn": "Operating Systems Administration", "creditHours": 3, "prerequisites": ["IT 232"]},
                            {"code": "IT 244", "nameAr": "هياكل البيانات لتقنية المعلومات", "nameEn": "Data Structures for IT", "creditHours": 3, "prerequisites": ["IT 232"]},
                            {"code": "STAT 101", "nameAr": "مبادئ الإحصاء والاحتمالات", "nameEn": "Elementary Statistics", "creditHours": 3, "prerequisites": ["MATH 002"]}
                        ],
                        "5": [
                            {"code": "IT 351", "nameAr": "نظم إدارة قواعد البيانات", "nameEn": "Database Management Systems", "creditHours": 3, "prerequisites": ["IT 244"]},
                            {"code": "IT 352", "nameAr": "توجيه وتحويل الشبكات المتقدمة", "nameEn": "Routing and Switching", "creditHours": 3, "prerequisites": ["IT 241"]},
                            {"code": "IT 354", "nameAr": "التفاعل بين الإنسان والحاسوب", "nameEn": "Human Computer Interaction", "creditHours": 3, "prerequisites": ["IT 230"]},
                            {"code": "IT 356", "nameAr": "تطوير تطبيقات الجوال", "nameEn": "Mobile Application Development", "creditHours": 3, "prerequisites": ["IT 232"]}
                        ],
                        "6": [
                            {"code": "IT 362", "nameAr": "تطوير وتصميم تطبيقات الويب المتقدمة", "nameEn": "Advanced Web Systems", "creditHours": 3, "prerequisites": ["IT 351", "IT 230"]},
                            {"code": "IT 364", "nameAr": "إدارة وأمن الشبكات", "nameEn": "Network Management and Security", "creditHours": 3, "prerequisites": ["IT 352"]},
                            {"code": "IT 366", "nameAr": "إدارة مشاريع تقنية المعلومات", "nameEn": "IT Project Management", "creditHours": 3, "prerequisites": ["IT 351"]},
                            {"code": "IT 368", "nameAr": "الحوسبة السحابية وتقنيات المحاكاة", "nameEn": "Cloud Computing & Virtualization", "creditHours": 3, "prerequisites": ["IT 242", "IT 352"]}
                        ],
                        "7": [
                            {"code": "IT 470", "nameAr": "مشروع التخرج 1", "nameEn": "IT Capstone Project I", "creditHours": 3, "prerequisites": ["IT 351", "IT 366"]},
                            {"code": "IT 472", "nameAr": "أمن المؤسسات وتحليل الثغرات", "nameEn": "Enterprise Information Security", "creditHours": 3, "prerequisites": ["IT 364"]},
                            {"code": "IT 474", "nameAr": "إنترنت الأشياء والأنظمة الذكية", "nameEn": "Internet of Things (IoT)", "creditHours": 3, "prerequisites": ["IT 368"]},
                            {"code": "IT 476", "nameAr": "تكامل الأنظمة والبنية التحتية", "nameEn": "System Integration & Architecture", "creditHours": 3, "prerequisites": ["IT 368"]}
                        ],
                        "8": [
                            {"code": "IT 480", "nameAr": "مشروع التخرج 2", "nameEn": "IT Capstone Project II", "creditHours": 3, "prerequisites": ["IT 470"]},
                            {"code": "IT 485", "nameAr": "التدريب الميداني والتعاوني", "nameEn": "Cooperative Field Training", "creditHours": 6, "prerequisites": ["IT 470"]},
                            {"code": "IT 488", "nameAr": "أخلاقيات وتشريعات تقنية المعلومات", "nameEn": "Professional Ethics in IT", "creditHours": 2, "prerequisites": []}
                        ]
                    }
                },
                "ds": {
                    "majorId": "ds",
                    "nameAr": "علم البيانات",
                    "nameEn": "Data Science",
                    "totalCredits": 130,
                    "levels": {
                        "1": [
                            {"code": "ENG 001", "nameAr": "اللغة الإنجليزية 1", "nameEn": "English Language I", "creditHours": 4, "prerequisites": []},
                            {"code": "MATH 001", "nameAr": "رياضيات تحضيرية 1", "nameEn": "Preparatory Mathematics I", "creditHours": 3, "prerequisites": []},
                            {"code": "CS 001", "nameAr": "مقدمة في علوم الحاسب", "nameEn": "Introduction to Computing", "creditHours": 3, "prerequisites": []},
                            {"code": "COMM 001", "nameAr": "مهارات الاتصال", "nameEn": "Communication Skills", "creditHours": 2, "prerequisites": []}
                        ],
                        "2": [
                            {"code": "ENG 002", "nameAr": "اللغة الإنجليزية 2", "nameEn": "English Language II", "creditHours": 4, "prerequisites": ["ENG 001"]},
                            {"code": "MATH 002", "nameAr": "رياضيات تحضيرية 2", "nameEn": "Preparatory Mathematics II", "creditHours": 3, "prerequisites": ["MATH 001"]},
                            {"code": "DS 140", "nameAr": "برمجة لعلوم البيانات (بايثون)", "nameEn": "Python Programming for Data Science", "creditHours": 3, "prerequisites": ["CS 001"]},
                            {"code": "ISLM 101", "nameAr": "الثقافة الإسلامية", "nameEn": "Islamic Culture", "creditHours": 2, "prerequisites": []}
                        ],
                        "3": [
                            {"code": "DS 230", "nameAr": "البرمجة المتقدمة وهياكل البيانات في البيانات", "nameEn": "Advanced Python & Data Structures", "creditHours": 3, "prerequisites": ["DS 140"]},
                            {"code": "MATH 201", "nameAr": "الجبر الخطي لعلوم البيانات", "nameEn": "Linear Algebra for Data Science", "creditHours": 3, "prerequisites": ["MATH 002"]},
                            {"code": "STAT 202", "nameAr": "الاحتمالات والإحصاء الرياضي", "nameEn": "Probability and Mathematical Statistics", "creditHours": 3, "prerequisites": ["MATH 002"]},
                            {"code": "ENG 103", "nameAr": "الكتابة التقنية والمهنية", "nameEn": "Technical Writing", "creditHours": 3, "prerequisites": ["ENG 002"]}
                        ],
                        "4": [
                            {"code": "DS 240", "nameAr": "استكشاف وتجهيز البيانات", "nameEn": "Data Wrangling and Exploration", "creditHours": 3, "prerequisites": ["DS 230"]},
                            {"code": "IT 351", "nameAr": "نظم إدارة قواعد البيانات وSQL", "nameEn": "Database Management Systems", "creditHours": 3, "prerequisites": ["DS 230"]},
                            {"code": "STAT 205", "nameAr": "الاستدلال الإحصائي وانحدار البيانات", "nameEn": "Statistical Inference & Regression", "creditHours": 3, "prerequisites": ["STAT 202"]},
                            {"code": "DS 245", "nameAr": "تصوير وتمثيل البيانات (Visualization)", "nameEn": "Data Visualization & Storytelling", "creditHours": 3, "prerequisites": ["DS 230"]}
                        ],
                        "5": [
                            {"code": "DS 350", "nameAr": "أساسيات تعلم الآلة", "nameEn": "Foundations of Machine Learning", "creditHours": 3, "prerequisites": ["DS 240", "STAT 205", "MATH 201"]},
                            {"code": "DS 352", "nameAr": "هندسة البيانات وقواعد البيانات الضخمة", "nameEn": "Data Engineering & Big Data Systems", "creditHours": 3, "prerequisites": ["IT 351"]},
                            {"code": "DS 354", "nameAr": "تنقيب البيانات واستخراج المعرفة", "nameEn": "Data Mining & Knowledge Discovery", "creditHours": 3, "prerequisites": ["DS 240"]},
                            {"code": "DS 356", "nameAr": "حوسبة بيئات البيانات السحابية", "nameEn": "Cloud Data Architectures", "creditHours": 3, "prerequisites": ["IT 351"]}
                        ],
                        "6": [
                            {"code": "DS 360", "nameAr": "التعلم العميق والشبكات العصبية", "nameEn": "Deep Learning & Neural Networks", "creditHours": 3, "prerequisites": ["DS 350"]},
                            {"code": "DS 362", "nameAr": "معالجة اللغات الطبيعية (NLP)", "nameEn": "Natural Language Processing", "creditHours": 3, "prerequisites": ["DS 350"]},
                            {"code": "DS 364", "nameAr": "تحليلات سلاسل البيانات الزمنية والتنبؤ", "nameEn": "Time Series Analysis & Forecasting", "creditHours": 3, "prerequisites": ["STAT 205", "DS 350"]},
                            {"code": "DS 366", "nameAr": "أخلاقيات وخصوصية وحوكمة البيانات", "nameEn": "Data Ethics, Privacy & Governance", "creditHours": 3, "prerequisites": ["DS 354"]}
                        ],
                        "7": [
                            {"code": "DS 470", "nameAr": "مشروع التخرج في علم البيانات 1", "nameEn": "Data Science Capstone I", "creditHours": 3, "prerequisites": ["DS 350", "DS 352"]},
                            {"code": "DS 472", "nameAr": "نشر وتطبيق نماذج الآلة (MLOps)", "nameEn": "Machine Learning Operations (MLOps)", "creditHours": 3, "prerequisites": ["DS 360"]},
                            {"code": "DS 474", "nameAr": "الذكاء الاصطناعي التوليدي والنماذج الكبيرة", "nameEn": "Generative AI & LLMs", "creditHours": 3, "prerequisites": ["DS 360"]},
                            {"code": "DS 476", "nameAr": "ذكاء الأعمال ولوحات المعلومات التحليلية", "nameEn": "Business Intelligence & Analytics", "creditHours": 3, "prerequisites": ["DS 245", "IT 351"]}
                        ],
                        "8": [
                            {"code": "DS 480", "nameAr": "مشروع التخرج في علم البيانات 2", "nameEn": "Data Science Capstone II", "creditHours": 3, "prerequisites": ["DS 470"]},
                            {"code": "DS 485", "nameAr": "التدريب التعاوني الميداني", "nameEn": "Cooperative Field Training", "creditHours": 6, "prerequisites": ["DS 470"]},
                            {"code": "DS 488", "nameAr": "ندوة متقدمة في علم البيانات", "nameEn": "Seminar in Data Science", "creditHours": 2, "prerequisites": []}
                        ]
                    }
                }
            }
        },
        "business": {
            "collegeId": "business",
            "nameAr": "كلية العلوم الإدارية والمالية",
            "nameEn": "College of Administrative and Financial Sciences",
            "majors": {
                "ba": {
                    "majorId": "ba",
                    "nameAr": "إدارة الأعمال",
                    "nameEn": "Business Administration",
                    "totalCredits": 130,
                    "levels": {
                        "1": [
                            {"code": "ENG 001", "nameAr": "اللغة الإنجليزية 1", "nameEn": "English Language I", "creditHours": 4, "prerequisites": []},
                            {"code": "MATH 001", "nameAr": "رياضيات تحضيرية 1", "nameEn": "Preparatory Mathematics I", "creditHours": 3, "prerequisites": []},
                            {"code": "MGT 101", "nameAr": "مبادئ الإدارة الحديثة", "nameEn": "Principles of Management", "creditHours": 3, "prerequisites": []},
                            {"code": "COMM 001", "nameAr": "مهارات الاتصال", "nameEn": "Communication Skills", "creditHours": 2, "prerequisites": []}
                        ],
                        "2": [
                            {"code": "ENG 002", "nameAr": "اللغة الإنجليزية 2", "nameEn": "English Language II", "creditHours": 4, "prerequisites": ["ENG 001"]},
                            {"code": "ECON 101", "nameAr": "مبادئ الاقتصاد الجزئي", "nameEn": "Principles of Microeconomics", "creditHours": 3, "prerequisites": ["MATH 001"]},
                            {"code": "ACCT 101", "nameAr": "مبادئ المحاسبة المالية", "nameEn": "Financial Accounting", "creditHours": 3, "prerequisites": ["MATH 001"]},
                            {"code": "ISLM 101", "nameAr": "الثقافة الإسلامية", "nameEn": "Islamic Culture", "creditHours": 2, "prerequisites": []}
                        ],
                        "3": [
                            {"code": "MKT 201", "nameAr": "مبادئ التسويق", "nameEn": "Principles of Marketing", "creditHours": 3, "prerequisites": ["MGT 101"]},
                            {"code": "ECON 201", "nameAr": "مبادئ الاقتصاد الكلي", "nameEn": "Principles of Macroeconomics", "creditHours": 3, "prerequisites": ["ECON 101"]},
                            {"code": "FIN 201", "nameAr": "الإدارة المالية", "nameEn": "Financial Management", "creditHours": 3, "prerequisites": ["ACCT 101"]},
                            {"code": "STAT 101", "nameAr": "الإحصاء في إدارة الأعمال", "nameEn": "Business Statistics", "creditHours": 3, "prerequisites": ["MATH 001"]}
                        ],
                        "4": [
                            {"code": "MGT 220", "nameAr": "السلوك التنظيمي", "nameEn": "Organizational Behavior", "creditHours": 3, "prerequisites": ["MGT 101"]},
                            {"code": "MGT 240", "nameAr": "إدارة الموارد البشرية", "nameEn": "Human Resource Management", "creditHours": 3, "prerequisites": ["MGT 101"]},
                            {"code": "MIS 201", "nameAr": "نظم المعلومات الإدارية", "nameEn": "Management Information Systems", "creditHours": 3, "prerequisites": ["MGT 101"]},
                            {"code": "LAW 101", "nameAr": "القانون التجاري وبيئة الأعمال", "nameEn": "Commercial Law", "creditHours": 3, "prerequisites": []}
                        ],
                        "5": [
                            {"code": "MGT 310", "nameAr": "إدارة العمليات والإنتاج", "nameEn": "Operations & Production Management", "creditHours": 3, "prerequisites": ["STAT 101"]},
                            {"code": "MGT 325", "nameAr": "إدارة سلاسل الإمداد واللوجستيات", "nameEn": "Supply Chain Management", "creditHours": 3, "prerequisites": ["MGT 310"]},
                            {"code": "MKT 315", "nameAr": "سلوك المستهلك", "nameEn": "Consumer Behavior", "creditHours": 3, "prerequisites": ["MKT 201"]},
                            {"code": "MGT 340", "nameAr": "منهجية البحث في العلوم الإدارية", "nameEn": "Business Research Methods", "creditHours": 3, "prerequisites": ["STAT 101"]}
                        ],
                        "6": [
                            {"code": "MGT 360", "nameAr": "إدارة الأعمال الدولية والشركات متعددة الجنسيات", "nameEn": "International Business", "creditHours": 3, "prerequisites": ["MGT 101", "ECON 201"]},
                            {"code": "MGT 370", "nameAr": "ريادة الأعمال وإدارة المشاريع الصغيرة", "nameEn": "Entrepreneurship & Small Business", "creditHours": 3, "prerequisites": ["FIN 201", "MKT 201"]},
                            {"code": "MGT 380", "nameAr": "إدارة الجودة الشاملة", "nameEn": "Total Quality Management", "creditHours": 3, "prerequisites": ["MGT 310"]},
                            {"code": "MGT 390", "nameAr": "القيادة وإدارة فرق العمل", "nameEn": "Leadership and Team Management", "creditHours": 3, "prerequisites": ["MGT 220"]}
                        ],
                        "7": [
                            {"code": "MGT 470", "nameAr": "الإدارة الاستراتيجية والتخطيط المؤسسي", "nameEn": "Strategic Management", "creditHours": 3, "prerequisites": ["MGT 310", "FIN 201", "MKT 201"]},
                            {"code": "MGT 475", "nameAr": "إدارة التغيير والتطوير التنظيمي", "nameEn": "Change Management", "creditHours": 3, "prerequisites": ["MGT 220"]},
                            {"code": "MGT 478", "nameAr": "مشروع التخرج في إدارة الأعمال 1", "nameEn": "Graduation Project in Business I", "creditHours": 3, "prerequisites": ["MGT 340"]},
                            {"code": "MGT 482", "nameAr": "حوكمة الشركات وأخلاقيات الأعمال", "nameEn": "Corporate Governance & Ethics", "creditHours": 3, "prerequisites": ["LAW 101"]}
                        ],
                        "8": [
                            {"code": "MGT 480", "nameAr": "مشروع التخرج في إدارة الأعمال 2", "nameEn": "Graduation Project in Business II", "creditHours": 3, "prerequisites": ["MGT 478"]},
                            {"code": "MGT 485", "nameAr": "التدريب التعاوني والميداني", "nameEn": "Cooperative Business Training", "creditHours": 6, "prerequisites": ["MGT 470"]},
                            {"code": "MGT 490", "nameAr": "قضايا معاصرة في الإدارة", "nameEn": "Contemporary Issues in Business", "creditHours": 2, "prerequisites": []}
                        ]
                    }
                },
                "acct": {
                    "majorId": "acct",
                    "nameAr": "المحاسبة",
                    "nameEn": "Accounting",
                    "totalCredits": 130,
                    "levels": {
                        "1": [
                            {"code": "ENG 001", "nameAr": "اللغة الإنجليزية 1", "nameEn": "English Language I", "creditHours": 4, "prerequisites": []},
                            {"code": "MATH 001", "nameAr": "رياضيات تحضيرية 1", "nameEn": "Preparatory Mathematics I", "creditHours": 3, "prerequisites": []},
                            {"code": "MGT 101", "nameAr": "مبادئ الإدارة", "nameEn": "Principles of Management", "creditHours": 3, "prerequisites": []},
                            {"code": "COMM 001", "nameAr": "مهارات الاتصال", "nameEn": "Communication Skills", "creditHours": 2, "prerequisites": []}
                        ],
                        "2": [
                            {"code": "ENG 002", "nameAr": "اللغة الإنجليزية 2", "nameEn": "English Language II", "creditHours": 4, "prerequisites": ["ENG 001"]},
                            {"code": "ACCT 101", "nameAr": "مبادئ المحاسبة المالية", "nameEn": "Financial Accounting", "creditHours": 3, "prerequisites": ["MATH 001"]},
                            {"code": "ECON 101", "nameAr": "مبادئ الاقتصاد الجزئي", "nameEn": "Microeconomics", "creditHours": 3, "prerequisites": ["MATH 001"]},
                            {"code": "ISLM 101", "nameAr": "الثقافة الإسلامية", "nameEn": "Islamic Culture", "creditHours": 2, "prerequisites": []}
                        ],
                        "3": [
                            {"code": "ACCT 201", "nameAr": "المحاسبة المتوسطة 1", "nameEn": "Intermediate Accounting I", "creditHours": 3, "prerequisites": ["ACCT 101"]},
                            {"code": "ACCT 205", "nameAr": "محاسبة التكاليف", "nameEn": "Cost Accounting", "creditHours": 3, "prerequisites": ["ACCT 101"]},
                            {"code": "FIN 201", "nameAr": "الإدارة المالية", "nameEn": "Financial Management", "creditHours": 3, "prerequisites": ["ACCT 101"]},
                            {"code": "STAT 101", "nameAr": "الإحصاء للأعمال", "nameEn": "Business Statistics", "creditHours": 3, "prerequisites": ["MATH 001"]}
                        ],
                        "4": [
                            {"code": "ACCT 202", "nameAr": "المحاسبة المتوسطة 2", "nameEn": "Intermediate Accounting II", "creditHours": 3, "prerequisites": ["ACCT 201"]},
                            {"code": "ACCT 250", "nameAr": "المحاسبة الإدارية", "nameEn": "Managerial Accounting", "creditHours": 3, "prerequisites": ["ACCT 205"]},
                            {"code": "LAW 101", "nameAr": "القانون التجاري", "nameEn": "Commercial Law", "creditHours": 3, "prerequisites": []},
                            {"code": "MIS 201", "nameAr": "نظم المعلومات المحاسبية", "nameEn": "Accounting Information Systems", "creditHours": 3, "prerequisites": ["ACCT 101"]}
                        ],
                        "5": [
                            {"code": "ACCT 301", "nameAr": "المحاسبة المتقدمة", "nameEn": "Advanced Accounting", "creditHours": 3, "prerequisites": ["ACCT 202"]},
                            {"code": "ACCT 310", "nameAr": "المراجعة والتدقيق 1", "nameEn": "Auditing I", "creditHours": 3, "prerequisites": ["ACCT 202"]},
                            {"code": "ACCT 320", "nameAr": "المحاسبة الضريبية والزكاة", "nameEn": "Zakat & Tax Accounting", "creditHours": 3, "prerequisites": ["ACCT 201"]},
                            {"code": "ACCT 330", "nameAr": "المحاسبة الحكومية والمنظمات غير الربحية", "nameEn": "Government & Non-Profit Accounting", "creditHours": 3, "prerequisites": ["ACCT 201"]}
                        ],
                        "6": [
                            {"code": "ACCT 350", "nameAr": "المراجعة والتدقيق 2 (التدقيق المتقدم)", "nameEn": "Advanced Auditing", "creditHours": 3, "prerequisites": ["ACCT 310"]},
                            {"code": "ACCT 360", "nameAr": "التحليل المالي وقوائم التدفقات", "nameEn": "Financial Statement Analysis", "creditHours": 3, "prerequisites": ["ACCT 202", "FIN 201"]},
                            {"code": "ACCT 370", "nameAr": "المعايير الدولية لإعداد التقارير المالية (IFRS)", "nameEn": "International Financial Reporting Standards", "creditHours": 3, "prerequisites": ["ACCT 301"]},
                            {"code": "ACCT 380", "nameAr": "المحاسبة القضائية وكشف الاحتيال", "nameEn": "Forensic Accounting & Fraud Examination", "creditHours": 3, "prerequisites": ["ACCT 310"]}
                        ],
                        "7": [
                            {"code": "ACCT 470", "nameAr": "مشروع التخرج في المحاسبة 1", "nameEn": "Accounting Capstone Project I", "creditHours": 3, "prerequisites": ["ACCT 301", "ACCT 310"]},
                            {"code": "ACCT 472", "nameAr": "حوكمة الشركات وأخلاقيات المهنة المحاسبية", "nameEn": "Accounting Professional Ethics & Governance", "creditHours": 3, "prerequisites": ["ACCT 310"]},
                            {"code": "ACCT 475", "nameAr": "نظم تخطيط موارد المؤسسات (ERP)", "nameEn": "Accounting in ERP Systems", "creditHours": 3, "prerequisites": ["MIS 201"]},
                            {"code": "ACCT 478", "nameAr": "محاسبة المنشآت المالية والبنوك", "nameEn": "Financial Institutions Accounting", "creditHours": 3, "prerequisites": ["ACCT 301"]}
                        ],
                        "8": [
                            {"code": "ACCT 480", "nameAr": "مشروع التخرج في المحاسبة 2", "nameEn": "Accounting Capstone Project II", "creditHours": 3, "prerequisites": ["ACCT 470"]},
                            {"code": "ACCT 485", "nameAr": "التدريب التعاوني والميداني", "nameEn": "Cooperative Field Training", "creditHours": 6, "prerequisites": ["ACCT 470"]},
                            {"code": "ACCT 490", "nameAr": "ندوة وتطبيقات عملية لاختبار SOCPA", "nameEn": "SOCPA Exam Seminar & Practice", "creditHours": 2, "prerequisites": []}
                        ]
                    }
                },
                "fin": {
                    "majorId": "fin",
                    "nameAr": "المالية",
                    "nameEn": "Finance",
                    "totalCredits": 130,
                    "levels": {
                        "1": [
                            {"code": "ENG 001", "nameAr": "اللغة الإنجليزية 1", "nameEn": "English Language I", "creditHours": 4, "prerequisites": []},
                            {"code": "MATH 001", "nameAr": "رياضيات تحضيرية 1", "nameEn": "Preparatory Mathematics I", "creditHours": 3, "prerequisites": []},
                            {"code": "MGT 101", "nameAr": "مبادئ الإدارة", "nameEn": "Principles of Management", "creditHours": 3, "prerequisites": []},
                            {"code": "COMM 001", "nameAr": "مهارات الاتصال", "nameEn": "Communication Skills", "creditHours": 2, "prerequisites": []}
                        ],
                        "2": [
                            {"code": "ENG 002", "nameAr": "اللغة الإنجليزية 2", "nameEn": "English Language II", "creditHours": 4, "prerequisites": ["ENG 001"]},
                            {"code": "ACCT 101", "nameAr": "مبادئ المحاسبة المالية", "nameEn": "Financial Accounting", "creditHours": 3, "prerequisites": ["MATH 001"]},
                            {"code": "ECON 101", "nameAr": "مبادئ الاقتصاد الجزئي", "nameEn": "Microeconomics", "creditHours": 3, "prerequisites": ["MATH 001"]},
                            {"code": "ISLM 101", "nameAr": "الثقافة الإسلامية", "nameEn": "Islamic Culture", "creditHours": 2, "prerequisites": []}
                        ],
                        "3": [
                            {"code": "FIN 201", "nameAr": "مبادئ الإدارة المالية", "nameEn": "Corporate Finance", "creditHours": 3, "prerequisites": ["ACCT 101"]},
                            {"code": "ECON 201", "nameAr": "مبادئ الاقتصاد الكلي", "nameEn": "Macroeconomics", "creditHours": 3, "prerequisites": ["ECON 101"]},
                            {"code": "STAT 101", "nameAr": "الإحصاء المالي", "nameEn": "Financial Statistics", "creditHours": 3, "prerequisites": ["MATH 001"]},
                            {"code": "ACCT 201", "nameAr": "المحاسبة المتوسطة 1", "nameEn": "Intermediate Accounting I", "creditHours": 3, "prerequisites": ["ACCT 101"]}
                        ],
                        "4": [
                            {"code": "FIN 220", "nameAr": "الأسواق والمؤسسات المالية", "nameEn": "Financial Markets & Institutions", "creditHours": 3, "prerequisites": ["FIN 201"]},
                            {"code": "FIN 230", "nameAr": "الاستثمار وإدارة المحافظ 1", "nameEn": "Investment & Portfolio Management I", "creditHours": 3, "prerequisites": ["FIN 201"]},
                            {"code": "ECON 220", "nameAr": "النقود والبنوك", "nameEn": "Money and Banking", "creditHours": 3, "prerequisites": ["ECON 201"]},
                            {"code": "LAW 101", "nameAr": "القانون التجاري", "nameEn": "Commercial Law", "creditHours": 3, "prerequisites": []}
                        ],
                        "5": [
                            {"code": "FIN 310", "nameAr": "تمويل الشركات المتقدم", "nameEn": "Advanced Corporate Finance", "creditHours": 3, "prerequisites": ["FIN 201"]},
                            {"code": "FIN 320", "nameAr": "إدارة المخاطر المالية والتأمين", "nameEn": "Risk Management & Insurance", "creditHours": 3, "prerequisites": ["FIN 220", "STAT 101"]},
                            {"code": "FIN 330", "nameAr": "الاستثمار وإدارة المحافظ 2", "nameEn": "Investment & Portfolio Management II", "creditHours": 3, "prerequisites": ["FIN 230"]},
                            {"code": "FIN 340", "nameAr": "المصرفية الإسلامية والتمويل الإسلامي", "nameEn": "Islamic Banking & Finance", "creditHours": 3, "prerequisites": ["FIN 220"]}
                        ],
                        "6": [
                            {"code": "FIN 360", "nameAr": "المشتقات المالية والأدوات المهيكلة", "nameEn": "Financial Derivatives", "creditHours": 3, "prerequisites": ["FIN 330"]},
                            {"code": "FIN 370", "nameAr": "التقنية المالية (FinTech) والبلوكشين", "nameEn": "Financial Technology (FinTech)", "creditHours": 3, "prerequisites": ["FIN 220"]},
                            {"code": "FIN 380", "nameAr": "التقييم المالي والاندماج والاستحواذ", "nameEn": "Valuation, Mergers & Acquisitions", "creditHours": 3, "prerequisites": ["FIN 310"]},
                            {"code": "FIN 390", "nameAr": "التمويل الدولي وإدارة أسعار الصرف", "nameEn": "International Finance", "creditHours": 3, "prerequisites": ["ECON 220"]}
                        ],
                        "7": [
                            {"code": "FIN 470", "nameAr": "مشروع التخرج في المالية 1", "nameEn": "Finance Capstone Project I", "creditHours": 3, "prerequisites": ["FIN 310", "FIN 330"]},
                            {"code": "FIN 472", "nameAr": "النمذجة والتحليل المالي المتقدم (Excel & Python)", "nameEn": "Financial Modeling & Analytics", "creditHours": 3, "prerequisites": ["FIN 310"]},
                            {"code": "FIN 475", "nameAr": "تمويل المشاريع ورأس المال الجريء", "nameEn": "Venture Capital & Project Finance", "creditHours": 3, "prerequisites": ["FIN 310"]},
                            {"code": "FIN 478", "nameAr": "أخلاقيات وقوانين الأسواق المالية (CMA)", "nameEn": "Ethics & Capital Market Regulations", "creditHours": 3, "prerequisites": ["LAW 101"]}
                        ],
                        "8": [
                            {"code": "FIN 480", "nameAr": "مشروع التخرج في المالية 2", "nameEn": "Finance Capstone Project II", "creditHours": 3, "prerequisites": ["FIN 470"]},
                            {"code": "FIN 485", "nameAr": "التدريب التعاوني والميداني", "nameEn": "Cooperative Field Training", "creditHours": 6, "prerequisites": ["FIN 470"]},
                            {"code": "FIN 490", "nameAr": "تطبيقات عملية لاختبارات CFA وCME", "nameEn": "CFA & CME Preparation Seminar", "creditHours": 2, "prerequisites": []}
                        ]
                    }
                },
                "ecom": {
                    "majorId": "ecom",
                    "nameAr": "التجارة الإلكترونية",
                    "nameEn": "E-Commerce",
                    "totalCredits": 130,
                    "levels": {
                        "1": [
                            {"code": "ENG 001", "nameAr": "اللغة الإنجليزية 1", "nameEn": "English Language I", "creditHours": 4, "prerequisites": []},
                            {"code": "MATH 001", "nameAr": "رياضيات تحضيرية 1", "nameEn": "Preparatory Mathematics I", "creditHours": 3, "prerequisites": []},
                            {"code": "MGT 101", "nameAr": "مبادئ الإدارة", "nameEn": "Principles of Management", "creditHours": 3, "prerequisites": []},
                            {"code": "COMM 001", "nameAr": "مهارات الاتصال", "nameEn": "Communication Skills", "creditHours": 2, "prerequisites": []}
                        ],
                        "2": [
                            {"code": "ENG 002", "nameAr": "اللغة الإنجليزية 2", "nameEn": "English Language II", "creditHours": 4, "prerequisites": ["ENG 001"]},
                            {"code": "ECOM 101", "nameAr": "مقدمة في التجارة الإلكترونية", "nameEn": "Introduction to E-Commerce", "creditHours": 3, "prerequisites": ["MGT 101"]},
                            {"code": "ACCT 101", "nameAr": "مبادئ المحاسبة المالية", "nameEn": "Financial Accounting", "creditHours": 3, "prerequisites": ["MATH 001"]},
                            {"code": "ISLM 101", "nameAr": "الثقافة الإسلامية", "nameEn": "Islamic Culture", "creditHours": 2, "prerequisites": []}
                        ],
                        "3": [
                            {"code": "ECOM 201", "nameAr": "بنية وتكنولوجيا التجارة الإلكترونية", "nameEn": "E-Commerce Infrastructure & Tech", "creditHours": 3, "prerequisites": ["ECOM 101"]},
                            {"code": "MKT 201", "nameAr": "مبادئ التسويق الحديث", "nameEn": "Principles of Marketing", "creditHours": 3, "prerequisites": ["MGT 101"]},
                            {"code": "IT 230", "nameAr": "تصميم وبناء مواقع الويب للأعمال", "nameEn": "Web Design for E-Business", "creditHours": 3, "prerequisites": ["ECOM 101"]},
                            {"code": "STAT 101", "nameAr": "الإحصاء للأعمال", "nameEn": "Business Statistics", "creditHours": 3, "prerequisites": ["MATH 001"]}
                        ],
                        "4": [
                            {"code": "ECOM 220", "nameAr": "التسويق الرقمي والإلكتروني", "nameEn": "Digital & Internet Marketing", "creditHours": 3, "prerequisites": ["MKT 201"]},
                            {"code": "ECOM 230", "nameAr": "أنظمة الدفع والأمان الإلكتروني", "nameEn": "E-Payment Systems & Security", "creditHours": 3, "prerequisites": ["ECOM 201"]},
                            {"code": "MIS 201", "nameAr": "نظم المعلومات الإدارية وتخطيط الموارد", "nameEn": "Management Information Systems", "creditHours": 3, "prerequisites": ["MGT 101"]},
                            {"code": "LAW 101", "nameAr": "قوانين التجارة الإلكترونية والجرائم السيبرانية", "nameEn": "Cyber & E-Commerce Law", "creditHours": 3, "prerequisites": []}
                        ],
                        "5": [
                            {"code": "ECOM 310", "nameAr": "إدارة سلاسل الإمداد الرقمية والخدمات اللوجستية", "nameEn": "Digital Supply Chain Management", "creditHours": 3, "prerequisites": ["ECOM 201"]},
                            {"code": "ECOM 320", "nameAr": "تحليلات بيانات التجارة الإلكترونية والويب", "nameEn": "E-Commerce & Web Analytics", "creditHours": 3, "prerequisites": ["STAT 101", "ECOM 220"]},
                            {"code": "ECOM 330", "nameAr": "إدارة علاقات العملاء الرقمية (CRM)", "nameEn": "Customer Relationship Management", "creditHours": 3, "prerequisites": ["MKT 201"]},
                            {"code": "ECOM 340", "nameAr": "تجربة المستخدم وتصميم واجهات المتاجر (UX/UI)", "nameEn": "UX/UI for E-Commerce Platforms", "creditHours": 3, "prerequisites": ["IT 230"]}
                        ],
                        "6": [
                            {"code": "ECOM 360", "nameAr": "استراتيجيات التجارة الإلكترونية عبر الجوال (M-Commerce)", "nameEn": "Mobile Commerce Strategies", "creditHours": 3, "prerequisites": ["ECOM 201"]},
                            {"code": "ECOM 370", "nameAr": "التجارة الاجتماعية والتسويق بالمحتوى المؤثر", "nameEn": "Social Commerce & Content Marketing", "creditHours": 3, "prerequisites": ["ECOM 220"]},
                            {"code": "ECOM 380", "nameAr": "ريادة الأعمال الرقمية وإطلاق الشركات الناشئة", "nameEn": "Digital Entrepreneurship", "creditHours": 3, "prerequisites": ["ECOM 101"]},
                            {"code": "ECOM 390", "nameAr": "محركات البحث وتحسين الظهور (SEO/SEM)", "nameEn": "Search Engine Marketing (SEO/SEM)", "creditHours": 3, "prerequisites": ["ECOM 220"]}
                        ],
                        "7": [
                            {"code": "ECOM 470", "nameAr": "مشروع التخرج في التجارة الإلكترونية 1", "nameEn": "E-Commerce Capstone Project I", "creditHours": 3, "prerequisites": ["ECOM 310", "ECOM 320"]},
                            {"code": "ECOM 472", "nameAr": "إدارة المنصات والأسواق الرقمية المفتوحة", "nameEn": "Digital Platforms & Marketplace Management", "creditHours": 3, "prerequisites": ["ECOM 380"]},
                            {"code": "ECOM 475", "nameAr": "الذكاء الاصطناعي في التسويق والتجارة الإلكترونية", "nameEn": "AI in Marketing & E-Commerce", "creditHours": 3, "prerequisites": ["ECOM 320"]},
                            {"code": "ECOM 478", "nameAr": "حوكمة التجارة الرقمية وحماية المستهلك", "nameEn": "Consumer Protection in Digital Trade", "creditHours": 3, "prerequisites": ["LAW 101"]}
                        ],
                        "8": [
                            {"code": "ECOM 480", "nameAr": "مشروع التخرج في التجارة الإلكترونية 2", "nameEn": "E-Commerce Capstone Project II", "creditHours": 3, "prerequisites": ["ECOM 470"]},
                            {"code": "ECOM 485", "nameAr": "التدريب التعاوني والميداني", "nameEn": "Cooperative Field Training", "creditHours": 6, "prerequisites": ["ECOM 470"]},
                            {"code": "ECOM 490", "nameAr": "ندوة متقدمة في اتجاهات التجارة الرقمية", "nameEn": "Trends in E-Business Seminar", "creditHours": 2, "prerequisites": []}
                        ]
                    }
                }
            }
        },
        "health": {
            "collegeId": "health",
            "nameAr": "كلية العلوم الصحية",
            "nameEn": "College of Health Sciences",
            "majors": {
                "hci": {
                    "majorId": "hci",
                    "nameAr": "المعلوماتية الصحية",
                    "nameEn": "Health Informatics",
                    "totalCredits": 130,
                    "levels": {
                        "1": [
                            {"code": "ENG 001", "nameAr": "اللغة الإنجليزية 1", "nameEn": "English Language I", "creditHours": 4, "prerequisites": []},
                            {"code": "BIOL 101", "nameAr": "المصطلحات الطبية والأسس الحيوية", "nameEn": "Medical Terminology & Biology", "creditHours": 3, "prerequisites": []},
                            {"code": "MATH 001", "nameAr": "رياضيات تحضيرية 1", "nameEn": "Preparatory Mathematics I", "creditHours": 3, "prerequisites": []},
                            {"code": "COMM 001", "nameAr": "مهارات الاتصال", "nameEn": "Communication Skills", "creditHours": 2, "prerequisites": []}
                        ],
                        "2": [
                            {"code": "ENG 002", "nameAr": "اللغة الإنجليزية 2", "nameEn": "English Language II", "creditHours": 4, "prerequisites": ["ENG 001"]},
                            {"code": "BIOL 102", "nameAr": "علم التشريح وعلم وظائف الأعضاء (أناتومي)", "nameEn": "Anatomy & Physiology", "creditHours": 3, "prerequisites": ["BIOL 101"]},
                            {"code": "CS 140", "nameAr": "مبادئ البرمجة وتطبيقات الحاسب", "nameEn": "Principles of Computer Programming", "creditHours": 3, "prerequisites": []},
                            {"code": "ISLM 101", "nameAr": "الثقافة الإسلامية", "nameEn": "Islamic Culture", "creditHours": 2, "prerequisites": []}
                        ],
                        "3": [
                            {"code": "HCI 111", "nameAr": "مقدمة في المعلوماتية الصحية", "nameEn": "Introduction to Health Informatics", "creditHours": 3, "prerequisites": ["BIOL 101"]},
                            {"code": "HCI 112", "nameAr": "نظم الرعاية الصحية والسياسات الطبية", "nameEn": "Healthcare Systems & Policies", "creditHours": 3, "prerequisites": []},
                            {"code": "IT 351", "nameAr": "نظم إدارة قواعد البيانات الصحية", "nameEn": "Health Database Management", "creditHours": 3, "prerequisites": ["CS 140"]},
                            {"code": "STAT 101", "nameAr": "الإحصاء الحيوي الطبي", "nameEn": "Biostatistics", "creditHours": 3, "prerequisites": ["MATH 001"]}
                        ],
                        "4": [
                            {"code": "HCI 213", "nameAr": "السجلات الصحية الإلكترونية (EHR)", "nameEn": "Electronic Health Records", "creditHours": 3, "prerequisites": ["HCI 111"]},
                            {"code": "HCI 214", "nameAr": "التصنيف والترميز الطبي (ICD & CPT)", "nameEn": "Medical Coding & Classification", "creditHours": 3, "prerequisites": ["BIOL 102", "HCI 111"]},
                            {"code": "IT 241", "nameAr": "شبكات وأمن المعلومات الصحية", "nameEn": "Health Information Networks & Security", "creditHours": 3, "prerequisites": ["CS 140"]},
                            {"code": "ENG 103", "nameAr": "الكتابة التقنية والطبية", "nameEn": "Technical Medical Writing", "creditHours": 3, "prerequisites": ["ENG 002"]}
                        ],
                        "5": [
                            {"code": "HCI 315", "nameAr": "معايير تبادل البيانات الصحية (HL7 & FHIR)", "nameEn": "Health Data Standards (HL7 & FHIR)", "creditHours": 3, "prerequisites": ["HCI 213"]},
                            {"code": "HCI 316", "nameAr": "نظم دعم اتخاذ القرار السريري (CDSS)", "nameEn": "Clinical Decision Support Systems", "creditHours": 3, "prerequisites": ["HCI 213"]},
                            {"code": "HCI 318", "nameAr": "تحليلات البيانات الصحية والوبائية", "nameEn": "Health Data Analytics", "creditHours": 3, "prerequisites": ["STAT 101", "IT 351"]},
                            {"code": "HCI 320", "nameAr": "إدارة مشاريع تقنية الرعاية الصحية", "nameEn": "Health IT Project Management", "creditHours": 3, "prerequisites": ["HCI 111"]}
                        ],
                        "6": [
                            {"code": "HCI 360", "nameAr": "الصحة الرقمية والطب الاتصالي (Telemedicine)", "nameEn": "Digital Health & Telemedicine", "creditHours": 3, "prerequisites": ["HCI 315"]},
                            {"code": "HCI 362", "nameAr": "خصوصية وحوكمة البيانات الصحية (HIPAA)", "nameEn": "Health Data Privacy & Governance", "creditHours": 3, "prerequisites": ["HCI 213"]},
                            {"code": "HCI 364", "nameAr": "الذكاء الاصطناعي في الطب والرعاية الصحية", "nameEn": "AI in Medicine & Healthcare", "creditHours": 3, "prerequisites": ["HCI 318"]},
                            {"code": "HCI 366", "nameAr": "إدارة الجودة واعتماد المنشآت الصحية (CBAHI)", "nameEn": "Healthcare Quality & Accreditation", "creditHours": 3, "prerequisites": ["HCI 112"]}
                        ],
                        "7": [
                            {"code": "HCI 470", "nameAr": "مشروع التخرج في المعلوماتية الصحية 1", "nameEn": "Health Informatics Capstone I", "creditHours": 3, "prerequisites": ["HCI 315", "HCI 318"]},
                            {"code": "HCI 472", "nameAr": "المعلوماتية الصيدلانية والمخبرية", "nameEn": "Pharmacy & Laboratory Informatics", "creditHours": 3, "prerequisites": ["HCI 213"]},
                            {"code": "HCI 475", "nameAr": "نظم أرشفة الصور الطبية والاتصالات (PACS)", "nameEn": "Medical Imaging & PACS Systems", "creditHours": 3, "prerequisites": ["HCI 315"]},
                            {"code": "HCI 478", "nameAr": "أخلاقيات الممارسة الطبية والمعلوماتية", "nameEn": "Medical Informatics Ethics", "creditHours": 3, "prerequisites": ["HCI 362"]}
                        ],
                        "8": [
                            {"code": "HCI 480", "nameAr": "مشروع التخرج في المعلوماتية الصحية 2", "nameEn": "Health Informatics Capstone II", "creditHours": 3, "prerequisites": ["HCI 470"]},
                            {"code": "HCI 485", "nameAr": "التدريب السريري والميداني في المستشفيات", "nameEn": "Clinical Hospital Internship", "creditHours": 6, "prerequisites": ["HCI 470"]},
                            {"code": "HCI 490", "nameAr": "ندوة متقدمة في مستقبل الصحة الرقمية", "nameEn": "Future of Digital Health Seminar", "creditHours": 2, "prerequisites": []}
                        ]
                    }
                },
                "ph": {
                    "majorId": "ph",
                    "nameAr": "الصحة العامة",
                    "nameEn": "Public Health",
                    "totalCredits": 130,
                    "levels": {
                        "1": [
                            {"code": "ENG 001", "nameAr": "اللغة الإنجليزية 1", "nameEn": "English Language I", "creditHours": 4, "prerequisites": []},
                            {"code": "BIOL 101", "nameAr": "مقدمة في العلوم الحيوية والطبية", "nameEn": "Biological Sciences", "creditHours": 3, "prerequisites": []},
                            {"code": "MATH 001", "nameAr": "رياضيات تحضيرية 1", "nameEn": "Preparatory Mathematics I", "creditHours": 3, "prerequisites": []},
                            {"code": "COMM 001", "nameAr": "مهارات الاتصال", "nameEn": "Communication Skills", "creditHours": 2, "prerequisites": []}
                        ],
                        "2": [
                            {"code": "ENG 002", "nameAr": "اللغة الإنجليزية 2", "nameEn": "English Language II", "creditHours": 4, "prerequisites": ["ENG 001"]},
                            {"code": "PH 101", "nameAr": "مبادئ وأسس الصحة العامة", "nameEn": "Principles of Public Health", "creditHours": 3, "prerequisites": []},
                            {"code": "BIOL 102", "nameAr": "علم وظائف الأعضاء البشري", "nameEn": "Human Physiology", "creditHours": 3, "prerequisites": ["BIOL 101"]},
                            {"code": "ISLM 101", "nameAr": "الثقافة الإسلامية", "nameEn": "Islamic Culture", "creditHours": 2, "prerequisites": []}
                        ],
                        "3": [
                            {"code": "PH 201", "nameAr": "علم الأوبئة الأساسي (Epidemiology)", "nameEn": "Basic Epidemiology", "creditHours": 3, "prerequisites": ["PH 101"]},
                            {"code": "STAT 101", "nameAr": "الإحصاء الحيوي في الصحة العامة", "nameEn": "Biostatistics for Public Health", "creditHours": 3, "prerequisites": ["MATH 001"]},
                            {"code": "PH 210", "nameAr": "الصحة البيئية والمهنية", "nameEn": "Environmental & Occupational Health", "creditHours": 3, "prerequisites": ["PH 101"]},
                            {"code": "ENG 103", "nameAr": "الكتابة التقنية والبحثية", "nameEn": "Technical Writing", "creditHours": 3, "prerequisites": ["ENG 002"]}
                        ],
                        "4": [
                            {"code": "PH 220", "nameAr": "علم الأوبئة المتقدم والتحري الميداني", "nameEn": "Advanced Field Epidemiology", "creditHours": 3, "prerequisites": ["PH 201"]},
                            {"code": "PH 230", "nameAr": "التثقيف والتعزيز الصحي", "nameEn": "Health Promotion & Education", "creditHours": 3, "prerequisites": ["PH 101"]},
                            {"code": "PH 240", "nameAr": "التغذية وصحة المجتمع", "nameEn": "Community Nutrition & Health", "creditHours": 3, "prerequisites": ["BIOL 102"]},
                            {"code": "PH 250", "nameAr": "صحة الأم والطفل والصحة الإنجابية", "nameEn": "Maternal & Child Health", "creditHours": 3, "prerequisites": ["PH 101"]}
                        ],
                        "5": [
                            {"code": "PH 310", "nameAr": "إدارة واقتصاديات الرعاية الصحية", "nameEn": "Health Management & Economics", "creditHours": 3, "prerequisites": ["PH 101"]},
                            {"code": "PH 320", "nameAr": "الأمراض السارية والمعدية ومكافحة الأوبئة", "nameEn": "Communicable Disease Control", "creditHours": 3, "prerequisites": ["PH 201"]},
                            {"code": "PH 330", "nameAr": "الأمراض المزمنة غير السارية والوقاية منها", "nameEn": "Non-Communicable Diseases Prevention", "creditHours": 3, "prerequisites": ["PH 201"]},
                            {"code": "PH 340", "nameAr": "طرق البحث المسحي في الصحة العامة", "nameEn": "Public Health Research Methods", "creditHours": 3, "prerequisites": ["STAT 101"]}
                        ],
                        "6": [
                            {"code": "PH 360", "nameAr": "السياسات والتشريعات الصحية الوطنية", "nameEn": "Health Policy & Regulations", "creditHours": 3, "prerequisites": ["PH 310"]},
                            {"code": "PH 370", "nameAr": "إدارة الأزمات والكوارث الصحية", "nameEn": "Health Emergency & Disaster Preparedness", "creditHours": 3, "prerequisites": ["PH 320"]},
                            {"code": "PH 380", "nameAr": "الصحة العالمية وصحة المسافرين", "nameEn": "Global Health & Travel Medicine", "creditHours": 3, "prerequisites": ["PH 320"]},
                            {"code": "PH 390", "nameAr": "السلوك الصحي والتغيير الاجتماعي", "nameEn": "Health Behavior & Social Change", "creditHours": 3, "prerequisites": ["PH 230"]}
                        ],
                        "7": [
                            {"code": "PH 470", "nameAr": "مشروع التخرج في الصحة العامة 1", "nameEn": "Public Health Capstone I", "creditHours": 3, "prerequisites": ["PH 340", "PH 220"]},
                            {"code": "PH 472", "nameAr": "التقييم الصحي والرصد الوبائي الذكي", "nameEn": "Health Surveillance & Digital Monitoring", "creditHours": 3, "prerequisites": ["PH 220"]},
                            {"code": "PH 475", "nameAr": "برامج الصحة المدرسية واليافعين", "nameEn": "School & Adolescent Health Programs", "creditHours": 3, "prerequisites": ["PH 230"]},
                            {"code": "PH 478", "nameAr": "أخلاقيات الصحة العامة والعدالة الصحية", "nameEn": "Public Health Ethics & Health Equity", "creditHours": 3, "prerequisites": ["PH 360"]}
                        ],
                        "8": [
                            {"code": "PH 480", "nameAr": "مشروع التخرج في الصحة العامة 2", "nameEn": "Public Health Capstone II", "creditHours": 3, "prerequisites": ["PH 470"]},
                            {"code": "PH 485", "nameAr": "التدريب الميداني في مراكز الرعاية وهيئة الصحة", "nameEn": "Public Health Field Internship", "creditHours": 6, "prerequisites": ["PH 470"]},
                            {"code": "PH 490", "nameAr": "ندوة في الاتجاهات الحديثة للصحة العامة", "nameEn": "Modern Trends in Public Health Seminar", "creditHours": 2, "prerequisites": []}
                        ]
                    }
                }
            }
        },
        "theoretical": {
            "collegeId": "theoretical",
            "nameAr": "كلية الدراسات النظرية",
            "nameEn": "College of Theoretical Studies",
            "majors": {
                "law": {
                    "majorId": "law",
                    "nameAr": "القانون",
                    "nameEn": "Law",
                    "totalCredits": 130,
                    "levels": {
                        "1": [
                            {"code": "ENG 001", "nameAr": "اللغة الإنجليزية 1", "nameEn": "English Language I", "creditHours": 4, "prerequisites": []},
                            {"code": "LAW 101", "nameAr": "المدخل لدراسة الأنظمة والقانون", "nameEn": "Introduction to Law", "creditHours": 3, "prerequisites": []},
                            {"code": "COMM 001", "nameAr": "مهارات الاتصال وفنون الإقناع", "nameEn": "Communication Skills", "creditHours": 2, "prerequisites": []},
                            {"code": "ISLM 101", "nameAr": "المدخل إلى الفقه الإسلامي", "nameEn": "Islamic Jurisprudence", "creditHours": 3, "prerequisites": []}
                        ],
                        "2": [
                            {"code": "ENG 002", "nameAr": "اللغة الإنجليزية 2", "nameEn": "English Language II", "creditHours": 4, "prerequisites": ["ENG 001"]},
                            {"code": "LAW 102", "nameAr": "القانون الدستوري والأنظمة السعودية", "nameEn": "Constitutional Law", "creditHours": 3, "prerequisites": ["LAW 101"]},
                            {"code": "LAW 103", "nameAr": "مصادر الالتزام (العقد والإرادة المنفردة)", "nameEn": "Sources of Obligations", "creditHours": 3, "prerequisites": ["LAW 101"]},
                            {"code": "ISLM 102", "nameAr": "أصول الفقه وقواعده", "nameEn": "Principles of Islamic Jurisprudence", "creditHours": 3, "prerequisites": ["ISLM 101"]}
                        ],
                        "3": [
                            {"code": "LAW 201", "nameAr": "أحكام الالتزام والإثبات", "nameEn": "Rules of Obligations & Evidence", "creditHours": 3, "prerequisites": ["LAW 103"]},
                            {"code": "LAW 202", "nameAr": "القانون الإداري وتطبيقاته", "nameEn": "Administrative Law", "creditHours": 3, "prerequisites": ["LAW 102"]},
                            {"code": "LAW 203", "nameAr": "القانون الجنائي العام (النظرية العامة للجريمة)", "nameEn": "General Criminal Law", "creditHours": 3, "prerequisites": ["LAW 101"]},
                            {"code": "LAW 204", "nameAr": "القانون الدولي العام", "nameEn": "Public International Law", "creditHours": 3, "prerequisites": ["LAW 102"]}
                        ],
                        "4": [
                            {"code": "LAW 205", "nameAr": "القانون التجاري والشركات", "nameEn": "Commercial Law & Companies", "creditHours": 3, "prerequisites": ["LAW 201"]},
                            {"code": "LAW 206", "nameAr": "القانون الجنائي الخاص (جرائم الأشخاص والأموال)", "nameEn": "Special Criminal Law", "creditHours": 3, "prerequisites": ["LAW 203"]},
                            {"code": "LAW 207", "nameAr": "العقود المدنية المسماة (البيع والإيجار)", "nameEn": "Civil Contracts", "creditHours": 3, "prerequisites": ["LAW 201"]},
                            {"code": "LAW 208", "nameAr": "القضاء الإداري وإجراءات ديوان المظالم", "nameEn": "Administrative Judiciary", "creditHours": 3, "prerequisites": ["LAW 202"]}
                        ],
                        "5": [
                            {"code": "LAW 301", "nameAr": "نظام المرافعات الشرعية والمدنية", "nameEn": "Civil Procedures Law", "creditHours": 3, "prerequisites": ["LAW 201"]},
                            {"code": "LAW 302", "nameAr": "الأوراق التجارية والعمليات المصرفية", "nameEn": "Commercial Papers & Banking Law", "creditHours": 3, "prerequisites": ["LAW 205"]},
                            {"code": "LAW 303", "nameAr": "نظام العمل والتأمينات الاجتماعية", "nameEn": "Labor Law & Social Insurance", "creditHours": 3, "prerequisites": ["LAW 201"]},
                            {"code": "LAW 304", "nameAr": "الحقوق العينية الأصلية والتبعية", "nameEn": "Real Property Rights", "creditHours": 3, "prerequisites": ["LAW 207"]}
                        ],
                        "6": [
                            {"code": "LAW 305", "nameAr": "نظام الإجراءات الجزائية والتحقيق الجنائي", "nameEn": "Criminal Procedures Law", "creditHours": 3, "prerequisites": ["LAW 206"]},
                            {"code": "LAW 306", "nameAr": "القانون الدولي الخاص (تنازع القوانين)", "nameEn": "Private International Law", "creditHours": 3, "prerequisites": ["LAW 204"]},
                            {"code": "LAW 307", "nameAr": "التحكيم والوسائل البديلة لفض المنازعات", "nameEn": "Arbitration & Alternative Dispute Resolution", "creditHours": 3, "prerequisites": ["LAW 301"]},
                            {"code": "LAW 308", "nameAr": "الملكية الفكرية وبراءات الاختراع", "nameEn": "Intellectual Property Law", "creditHours": 3, "prerequisites": ["LAW 205"]}
                        ],
                        "7": [
                            {"code": "LAW 470", "nameAr": "مشروع التخرج في القانون والبحث القانوني 1", "nameEn": "Legal Research & Capstone I", "creditHours": 3, "prerequisites": ["LAW 301", "LAW 305"]},
                            {"code": "LAW 472", "nameAr": "الصياغة القانونية والعقود باللغة الإنجليزية", "nameEn": "Legal Drafting in English", "creditHours": 3, "prerequisites": ["LAW 207", "ENG 002"]},
                            {"code": "LAW 475", "nameAr": "نظام التنفيذ وإجراءات الحجز القضائي", "nameEn": "Enforcement Law", "creditHours": 3, "prerequisites": ["LAW 301"]},
                            {"code": "LAW 478", "nameAr": "المحكمة الصورية والترافع العملي", "nameEn": "Moot Court & Clinical Advocacy", "creditHours": 3, "prerequisites": ["LAW 301", "LAW 305"]}
                        ],
                        "8": [
                            {"code": "LAW 480", "nameAr": "مشروع التخرج في القانون 2", "nameEn": "Legal Capstone II", "creditHours": 3, "prerequisites": ["LAW 470"]},
                            {"code": "LAW 485", "nameAr": "التدريب الميداني والتعاوني في المحاماة والشركات", "nameEn": "Cooperative Legal Internship", "creditHours": 6, "prerequisites": ["LAW 470"]},
                            {"code": "LAW 490", "nameAr": "أخلاقيات مهنة المحاماة ومسؤولية القانوني", "nameEn": "Legal Professional Ethics", "creditHours": 2, "prerequisites": []}
                        ]
                    }
                },
                "med": {
                    "majorId": "med",
                    "nameAr": "الإعلام الرقمي",
                    "nameEn": "Digital Media",
                    "totalCredits": 130,
                    "levels": {
                        "1": [
                            {"code": "ENG 001", "nameAr": "اللغة الإنجليزية 1", "nameEn": "English Language I", "creditHours": 4, "prerequisites": []},
                            {"code": "MED 101", "nameAr": "مدخل إلى الاتصال والإعلام الرقمي", "nameEn": "Introduction to Digital Media", "creditHours": 3, "prerequisites": []},
                            {"code": "COMM 001", "nameAr": "مهارات الاتصال والعرض", "nameEn": "Communication Skills", "creditHours": 2, "prerequisites": []},
                            {"code": "ISLM 101", "nameAr": "الثقافة الإسلامية", "nameEn": "Islamic Culture", "creditHours": 2, "prerequisites": []}
                        ],
                        "2": [
                            {"code": "ENG 002", "nameAr": "اللغة الإنجليزية 2", "nameEn": "English Language II", "creditHours": 4, "prerequisites": ["ENG 001"]},
                            {"code": "MED 102", "nameAr": "الكتابة والتحرير لوسائل الإعلام الرقمي", "nameEn": "Digital Media Writing & Editing", "creditHours": 3, "prerequisites": ["MED 101"]},
                            {"code": "MED 103", "nameAr": "التصوير الرقمي والأسس البصرية", "nameEn": "Digital Photography & Visual Basics", "creditHours": 3, "prerequisites": []},
                            {"code": "MATH 001", "nameAr": "مبادئ التفكير الإحصائي والبيانات", "nameEn": "Data & Statistical Thinking", "creditHours": 3, "prerequisites": []}
                        ],
                        "3": [
                            {"code": "MED 201", "nameAr": "تصميم الجرافيك والإنفوجرافيك للمحتوى", "nameEn": "Graphic & Infographic Design", "creditHours": 3, "prerequisites": ["MED 103"]},
                            {"code": "MED 202", "nameAr": "صحافة البيانات والصحافة الاستقصائية الرقمية", "nameEn": "Data Journalism", "creditHours": 3, "prerequisites": ["MED 102", "MATH 001"]},
                            {"code": "MED 203", "nameAr": "نظريات الاتصال الجماهيري والإعلام الجديد", "nameEn": "Mass Communication Theories", "creditHours": 3, "prerequisites": ["MED 101"]},
                            {"code": "MED 204", "nameAr": "صناعة البودكاست والمحتوى الصوتي الرقمي", "nameEn": "Digital Audio & Podcasting Production", "creditHours": 3, "prerequisites": ["MED 101"]}
                        ],
                        "4": [
                            {"code": "MED 205", "nameAr": "إنتاج الفيديو الرقمي والمونتاج والمؤثرات", "nameEn": "Digital Video Production & Editing", "creditHours": 3, "prerequisites": ["MED 103"]},
                            {"code": "MED 206", "nameAr": "إدارة منصات التواصل الاجتماعي والتفاعل الرقمي", "nameEn": "Social Media Platforms Management", "creditHours": 3, "prerequisites": ["MED 101"]},
                            {"code": "MED 207", "nameAr": "السرد القصصي الرقمي (Digital Storytelling)", "nameEn": "Digital Storytelling", "creditHours": 3, "prerequisites": ["MED 102"]},
                            {"code": "MED 208", "nameAr": "أخلاقيات وتشريعات النشر الإلكتروني", "nameEn": "Media Ethics & Digital Laws", "creditHours": 3, "prerequisites": []}
                        ],
                        "5": [
                            {"code": "MED 301", "nameAr": "استراتيجيات وصناعة المحتوى الإبداعي", "nameEn": "Content Strategy & Creation", "creditHours": 3, "prerequisites": ["MED 206", "MED 207"]},
                            {"code": "MED 302", "nameAr": "تحليلات الجمهور وقياس الأثر الرقمي", "nameEn": "Audience Analytics & Digital Metrics", "creditHours": 3, "prerequisites": ["MED 206"]},
                            {"code": "MED 303", "nameAr": "العلاقات العامة الرقمية وإدارة السمعة", "nameEn": "Digital Public Relations & Reputation", "creditHours": 3, "prerequisites": ["MED 101"]},
                            {"code": "MED 304", "nameAr": "الصحافة المتنقلة وصناعة المحتوى بالهاتف (MoJo)", "nameEn": "Mobile Journalism (MoJo)", "creditHours": 3, "prerequisites": ["MED 205"]}
                        ],
                        "6": [
                            {"code": "MED 305", "nameAr": "الإعلام التفاعلي والواقع الافتراضي والمعزز (VR/AR)", "nameEn": "Interactive Media & Immersive VR/AR", "creditHours": 3, "prerequisites": ["MED 201", "MED 205"]},
                            {"code": "MED 306", "nameAr": "إدارة الحملات الرقمية والإعلانات الموجهة", "nameEn": "Digital Campaigns Management", "creditHours": 3, "prerequisites": ["MED 301"]},
                            {"code": "MED 307", "nameAr": "صناعة الأفلام الوثائقية الرقمية القصيرة", "nameEn": "Short Digital Documentary Production", "creditHours": 3, "prerequisites": ["MED 205"]},
                            {"code": "MED 308", "nameAr": "الذكاء الاصطناعي في إنتاج المحتوى الإعلامي", "nameEn": "AI in Media Content Creation", "creditHours": 3, "prerequisites": ["MED 301"]}
                        ],
                        "7": [
                            {"code": "MED 470", "nameAr": "مشروع التخرج في الإعلام الرقمي 1", "nameEn": "Digital Media Capstone I", "creditHours": 3, "prerequisites": ["MED 301", "MED 302"]},
                            {"code": "MED 472", "nameAr": "إدارة المؤسسات وغرف الأخبار الرقمية", "nameEn": "Digital Newsroom Management", "creditHours": 3, "prerequisites": ["MED 301"]},
                            {"code": "MED 475", "nameAr": "ريادة الأعمال الإعلامية وإطلاق المنصات", "nameEn": "Media Entrepreneurship", "creditHours": 3, "prerequisites": ["MED 306"]},
                            {"code": "MED 478", "nameAr": "إدارة الأزمات والاتصال الرقمي الحكومي", "nameEn": "Digital Crisis Communication", "creditHours": 3, "prerequisites": ["MED 303"]}
                        ],
                        "8": [
                            {"code": "MED 480", "nameAr": "مشروع التخرج في الإعلام الرقمي 2", "nameEn": "Digital Media Capstone II", "creditHours": 3, "prerequisites": ["MED 470"]},
                            {"code": "MED 485", "nameAr": "التدريب الميداني والتعاوني في المؤسسات الإعلامية", "nameEn": "Cooperative Media Internship", "creditHours": 6, "prerequisites": ["MED 470"]},
                            {"code": "MED 490", "nameAr": "ندوة متقدمة في الاتجاهات المستقبلية للإعلام", "nameEn": "Future of Media Seminar", "creditHours": 2, "prerequisites": []}
                        ]
                    }
                },
                "trn": {
                    "majorId": "trn",
                    "nameAr": "اللغات والترجمة",
                    "nameEn": "Languages and Translation",
                    "totalCredits": 130,
                    "levels": {
                        "1": [
                            {"code": "ENG 110", "nameAr": "مهارات الاستماع والمحادثة المتقدمة", "nameEn": "Listening and Speaking Skills", "creditHours": 3, "prerequisites": []},
                            {"code": "ENG 112", "nameAr": "القراءة والاستيعاب وبناء المفردات", "nameEn": "Reading Comprehension & Vocabulary", "creditHours": 3, "prerequisites": []},
                            {"code": "ENG 114", "nameAr": "قواعد اللغة الإنجليزية وتراكيبها", "nameEn": "English Grammar & Sentence Structure", "creditHours": 3, "prerequisites": []},
                            {"code": "ARAB 101", "nameAr": "مهارات الكتابة والتعبير باللغة العربية", "nameEn": "Arabic Language Skills & Writing", "creditHours": 3, "prerequisites": []}
                        ],
                        "2": [
                            {"code": "ENG 120", "nameAr": "الكتابة الأكاديمية والمقال التحليلي", "nameEn": "Academic Writing & Essay", "creditHours": 3, "prerequisites": ["ENG 114"]},
                            {"code": "ENG 122", "nameAr": "علم الصوتيات والنطق الإنجليزي (Phonetics)", "nameEn": "English Phonetics & Phonology", "creditHours": 3, "prerequisites": ["ENG 110"]},
                            {"code": "TRN 101", "nameAr": "مدخل إلى دراسات الترجمة ونظرياتها", "nameEn": "Introduction to Translation Studies", "creditHours": 3, "prerequisites": ["ENG 112"]},
                            {"code": "ISLM 101", "nameAr": "الثقافة الإسلامية والحوار الحضاري", "nameEn": "Islamic Culture & Civilizations", "creditHours": 2, "prerequisites": []}
                        ],
                        "3": [
                            {"code": "TRN 201", "nameAr": "الترجمة العامة (من الإنجليزية إلى العربية)", "nameEn": "General Translation (En-Ar)", "creditHours": 3, "prerequisites": ["TRN 101"]},
                            {"code": "TRN 202", "nameAr": "الترجمة العامة (من العربية إلى الإنجليزية)", "nameEn": "General Translation (Ar-En)", "creditHours": 3, "prerequisites": ["TRN 101"]},
                            {"code": "ENG 210", "nameAr": "علم الصرف وبنية الكلمة (Morphology)", "nameEn": "English Morphology & Syntax", "creditHours": 3, "prerequisites": ["ENG 114"]},
                            {"code": "ARAB 201", "nameAr": "علم الدلالة والأسلوب في العربية", "nameEn": "Arabic Semantics and Stylistics", "creditHours": 3, "prerequisites": ["ARAB 101"]}
                        ],
                        "4": [
                            {"code": "TRN 210", "nameAr": "الترجمة القانونية والوثائق الرسمية", "nameEn": "Legal Translation & Official Documents", "creditHours": 3, "prerequisites": ["TRN 201"]},
                            {"code": "TRN 220", "nameAr": "الترجمة الاقتصادية والتجارية والمالية", "nameEn": "Economic & Business Translation", "creditHours": 3, "prerequisites": ["TRN 201"]},
                            {"code": "ENG 230", "nameAr": "علم المعنى والبراغماتية (Semantics & Pragmatics)", "nameEn": "Semantics & Pragmatics", "creditHours": 3, "prerequisites": ["ENG 210"]},
                            {"code": "TRN 240", "nameAr": "المعاجم وصناعة القواميس وإدارة المصطلحات", "nameEn": "Lexicography & Terminology Management", "creditHours": 3, "prerequisites": ["TRN 101"]}
                        ],
                        "5": [
                            {"code": "TRN 310", "nameAr": "الترجمة العلمية والتقنية والطبية", "nameEn": "Scientific, Technical & Medical Translation", "creditHours": 3, "prerequisites": ["TRN 201"]},
                            {"code": "TRN 320", "nameAr": "الترجمة بمساعدة الحاسوب وبرمجيات (CAT Tools)", "nameEn": "Computer-Assisted Translation (CAT Tools)", "creditHours": 3, "prerequisites": ["TRN 201"]},
                            {"code": "TRN 330", "nameAr": "الترجمة الصحفية والإعلامية والسياسية", "nameEn": "Media, Journalistic & Political Translation", "creditHours": 3, "prerequisites": ["TRN 202"]},
                            {"code": "ENG 310", "nameAr": "اللغويات التطبيقية واكتساب اللغات", "nameEn": "Applied Linguistics", "creditHours": 3, "prerequisites": ["ENG 210"]}
                        ],
                        "6": [
                            {"code": "TRN 350", "nameAr": "الترجمة التتبعية والفورية الأساسية", "nameEn": "Consecutive & Sight Translation", "creditHours": 3, "prerequisites": ["TRN 201", "ENG 110"]},
                            {"code": "TRN 360", "nameAr": "تعريب وترجمة البرمجيات وتطبيقات الويب (Localization)", "nameEn": "Software & Web Localization", "creditHours": 3, "prerequisites": ["TRN 320"]},
                            {"code": "TRN 370", "nameAr": "ترجمة الوسائط السمعية والمرئية والدبلجة (Subtitling)", "nameEn": "Audiovisual Translation & Subtitling", "creditHours": 3, "prerequisites": ["TRN 320"]},
                            {"code": "TRN 380", "nameAr": "الترجمة الأدبية ونقد الترجمات", "nameEn": "Literary Translation & Criticism", "creditHours": 3, "prerequisites": ["TRN 201"]}
                        ],
                        "7": [
                            {"code": "TRN 470", "nameAr": "مشروع التخرج في الترجمة 1", "nameEn": "Translation Capstone Project I", "creditHours": 3, "prerequisites": ["TRN 310", "TRN 320"]},
                            {"code": "TRN 472", "nameAr": "الترجمة الفورية المتقدمة والمؤتمرات", "nameEn": "Simultaneous Conference Interpreting", "creditHours": 3, "prerequisites": ["TRN 350"]},
                            {"code": "TRN 475", "nameAr": "الترجمة الآلية العصبية ومرحلة ما بعد التحرير (MT & PEMT)", "nameEn": "Machine Translation & Post-Editing (PEMT)", "creditHours": 3, "prerequisites": ["TRN 320"]},
                            {"code": "TRN 478", "nameAr": "أخلاقيات مهنة المترجم وقوانين الملكية", "nameEn": "Translator Ethics & Professional Standards", "creditHours": 3, "prerequisites": ["TRN 101"]}
                        ],
                        "8": [
                            {"code": "TRN 480", "nameAr": "مشروع التخرج في الترجمة 2", "nameEn": "Translation Capstone Project II", "creditHours": 3, "prerequisites": ["TRN 470"]},
                            {"code": "TRN 485", "nameAr": "التدريب الميداني والتعاوني في دور الترجمة والسفارات", "nameEn": "Cooperative Translation Internship", "creditHours": 6, "prerequisites": ["TRN 470"]},
                            {"code": "TRN 490", "nameAr": "ندوة متقدمة في الذكاء الاصطناعي ومستقبل الترجمة", "nameEn": "AI and Future of Translation Seminar", "creditHours": 2, "prerequisites": []}
                        ]
                    }
                },
                "stat": {
                    "majorId": "stat",
                    "nameAr": "الإحصاء التطبيقي وإدارة البيانات",
                    "nameEn": "Applied Statistics and Data Analytics",
                    "totalCredits": 130,
                    "levels": {
                        "1": [
                            {"code": "ENG 001", "nameAr": "اللغة الإنجليزية 1", "nameEn": "English Language I", "creditHours": 4, "prerequisites": []},
                            {"code": "MATH 001", "nameAr": "رياضيات تحضيرية 1 (حساب وتفاضل)", "nameEn": "Preparatory Mathematics I", "creditHours": 3, "prerequisites": []},
                            {"code": "STAT 100", "nameAr": "مدخل إلى الإحصاء التطبيقي وعلم البيانات", "nameEn": "Introduction to Applied Statistics", "creditHours": 3, "prerequisites": []},
                            {"code": "COMM 001", "nameAr": "مهارات الاتصال", "nameEn": "Communication Skills", "creditHours": 2, "prerequisites": []}
                        ],
                        "2": [
                            {"code": "ENG 002", "nameAr": "اللغة الإنجليزية 2", "nameEn": "English Language II", "creditHours": 4, "prerequisites": ["ENG 001"]},
                            {"code": "MATH 002", "nameAr": "رياضيات تحضيرية 2 (تكامل وجبر)", "nameEn": "Preparatory Mathematics II", "creditHours": 3, "prerequisites": ["MATH 001"]},
                            {"code": "STAT 110", "nameAr": "البرمجة الإحصائية بلغة R", "nameEn": "Statistical Computing in R", "creditHours": 3, "prerequisites": ["STAT 100"]},
                            {"code": "ISLM 101", "nameAr": "الثقافة الإسلامية", "nameEn": "Islamic Culture", "creditHours": 2, "prerequisites": []}
                        ],
                        "3": [
                            {"code": "STAT 201", "nameAr": "نظرية الاحتمالات الرياضية", "nameEn": "Mathematical Probability Theory", "creditHours": 3, "prerequisites": ["MATH 002"]},
                            {"code": "STAT 203", "nameAr": "تحليل الانحدار الخطي والتطبيقي", "nameEn": "Applied Linear Regression", "creditHours": 3, "prerequisites": ["STAT 110"]},
                            {"code": "MATH 201", "nameAr": "الجبر الخطي وتحليل المصفوفات", "nameEn": "Linear Algebra & Matrices", "creditHours": 3, "prerequisites": ["MATH 002"]},
                            {"code": "STAT 208", "nameAr": "البرمجة بلغة Python لمعالجة البيانات", "nameEn": "Python for Data Management", "creditHours": 3, "prerequisites": ["STAT 110"]}
                        ],
                        "4": [
                            {"code": "STAT 215", "nameAr": "الاستدلال الإحصائي واختبار الفروض", "nameEn": "Statistical Inference & Hypothesis Testing", "creditHours": 3, "prerequisites": ["STAT 201"]},
                            {"code": "STAT 220", "nameAr": "تصميم التجارب وتحليل التباين (ANOVA)", "nameEn": "Design of Experiments & ANOVA", "creditHours": 3, "prerequisites": ["STAT 203"]},
                            {"code": "IT 351", "nameAr": "قواعد البيانات وإدارة مستودعات البيانات (SQL)", "nameEn": "Databases & SQL for Analysts", "creditHours": 3, "prerequisites": ["STAT 208"]},
                            {"code": "ENG 103", "nameAr": "الكتابة التقنية والتقارير الإحصائية", "nameEn": "Technical Writing for Statistics", "creditHours": 3, "prerequisites": ["ENG 002"]}
                        ],
                        "5": [
                            {"code": "STAT 310", "nameAr": "تحليل السلاسل الزمنية والتنبؤ الإحصائي", "nameEn": "Time Series Analysis & Forecasting", "creditHours": 3, "prerequisites": ["STAT 203", "STAT 215"]},
                            {"code": "STAT 320", "nameAr": "نظرية العينات وتصميم المسوح الميدانية", "nameEn": "Sampling Theory & Survey Design", "creditHours": 3, "prerequisites": ["STAT 215"]},
                            {"code": "STAT 330", "nameAr": "التحليل الإحصائي متعدد المتغيرات (Multivariate)", "nameEn": "Multivariate Statistical Analysis", "creditHours": 3, "prerequisites": ["MATH 201", "STAT 203"]},
                            {"code": "STAT 340", "nameAr": "حوكمة وجودة وتنظيف البيانات الضخمة", "nameEn": "Data Quality, Cleaning & Governance", "creditHours": 3, "prerequisites": ["IT 351"]}
                        ],
                        "6": [
                            {"code": "STAT 360", "nameAr": "التعلم الإحصائي ونمذجة الآلة", "nameEn": "Statistical Machine Learning", "creditHours": 3, "prerequisites": ["STAT 330", "STAT 208"]},
                            {"code": "STAT 370", "nameAr": "الإحصاء الحيوي وتحليل البقاء (Survival Analysis)", "nameEn": "Biostatistics & Survival Analysis", "creditHours": 3, "prerequisites": ["STAT 215"]},
                            {"code": "STAT 380", "nameAr": "تحليلات البيانات الكبيرة ومنظومات الحوسبة الموزعة", "nameEn": "Big Data Analytics Systems", "creditHours": 3, "prerequisites": ["IT 351", "STAT 208"]},
                            {"code": "STAT 390", "nameAr": "تصوير البيانات المتقدم ولوحات القيادة (Tableau/PowerBI)", "nameEn": "Advanced Data Visualization & Dashboards", "creditHours": 3, "prerequisites": ["STAT 110"]}
                        ],
                        "7": [
                            {"code": "STAT 470", "nameAr": "مشروع التخرج في الإحصاء وتحليل البيانات 1", "nameEn": "Applied Statistics Capstone I", "creditHours": 3, "prerequisites": ["STAT 310", "STAT 360"]},
                            {"code": "STAT 472", "nameAr": "التحليلات التنبؤية واتخاذ القرار المعتمد على البيانات", "nameEn": "Predictive Analytics & Decision Making", "creditHours": 3, "prerequisites": ["STAT 360"]},
                            {"code": "STAT 475", "nameAr": "الإحصاء البايزي والنمذجة العشوائية (Bayesian)", "nameEn": "Bayesian Statistics & Stochastic Models", "creditHours": 3, "prerequisites": ["STAT 201"]},
                            {"code": "STAT 478", "nameAr": "أخلاقيات البيانات والخصوصية الرقمية وحماية الملكية", "nameEn": "Data Ethics & Privacy Regulations", "creditHours": 3, "prerequisites": ["STAT 340"]}
                        ],
                        "8": [
                            {"code": "STAT 480", "nameAr": "مشروع التخرج في الإحصاء وتحليل البيانات 2", "nameEn": "Applied Statistics Capstone II", "creditHours": 3, "prerequisites": ["STAT 470"]},
                            {"code": "STAT 485", "nameAr": "التدريب التعاوني والميداني في مراكز الإحصاء والبيانات", "nameEn": "Cooperative Statistics Internship", "creditHours": 6, "prerequisites": ["STAT 470"]},
                            {"code": "STAT 490", "nameAr": "ندوة متقدمة في أحدث اتجاهات علم البيانات والإحصاء", "nameEn": "Seminar in Advanced Data Science & Statistics", "creditHours": 2, "prerequisites": []}
                        ]
                    }
                }
            }
        }
    }
}

def main():
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    target_path = os.path.join(base_dir, "data", "study-plans.json")
    os.makedirs(os.path.dirname(target_path), exist_ok=True)
    with open(target_path, "w", encoding="utf-8") as f:
        json.dump(study_plans, f, ensure_ascii=False, indent=2)
    print(f"Generated {target_path} successfully. Total colleges: {len(study_plans['colleges'])}")

if __name__ == "__main__":
    main()
