// Global Study Plans for instant 0ms rendering on file:// and http://
window.STUDY_PLANS = {
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
              {
                "code": "ENG001",
                "nameAr": "اللغة الإنجليزية 1",
                "nameEn": "English Language I",
                "creditHours": 4,
                "prerequisites": []
              },
              {
                "code": "CS001",
                "nameAr": "مهارات الحاسب الآلي",
                "nameEn": "Computer Skills",
                "creditHours": 3,
                "prerequisites": []
              },
              {
                "code": "CI001",
                "nameAr": "المهارات الأكاديمية والتعلم الذاتي",
                "nameEn": "Academic Skills",
                "creditHours": 2,
                "prerequisites": []
              }
            ],
            "2": [
              {
                "code": "ENG002",
                "nameAr": "اللغة الإنجليزية 2",
                "nameEn": "English Language II",
                "creditHours": 4,
                "prerequisites": [
                  "ENG001"
                ]
              },
              {
                "code": "MATH001",
                "nameAr": "الرياضيات التحضيرية",
                "nameEn": "Preparatory Mathematics",
                "creditHours": 3,
                "prerequisites": []
              },
              {
                "code": "COMM001",
                "nameAr": "مهارات الاتصال",
                "nameEn": "Communication Skills",
                "creditHours": 2,
                "prerequisites": []
              }
            ],
            "3": [
              {
                "code": "CS230",
                "nameAr": "البرمجة الشيئية",
                "nameEn": "Object-Oriented Programming",
                "creditHours": 3,
                "prerequisites": [
                  "CS001"
                ]
              },
              {
                "code": "CS231",
                "nameAr": "تصميم المنطق الرقمي",
                "nameEn": "Digital Logic Design",
                "creditHours": 3,
                "prerequisites": [
                  "CS001"
                ]
              },
              {
                "code": "MATH150",
                "nameAr": "الرياضيات المتقطعة",
                "nameEn": "Discrete Mathematics",
                "creditHours": 3,
                "prerequisites": [
                  "MATH001"
                ]
              },
              {
                "code": "SCI101",
                "nameAr": "الفيزياء العامة 1",
                "nameEn": "General Physics I",
                "creditHours": 3,
                "prerequisites": []
              },
              {
                "code": "ENG103",
                "nameAr": "الكتابة التقنية",
                "nameEn": "Technical Writing",
                "creditHours": 3,
                "prerequisites": [
                  "ENG002"
                ]
              },
              {
                "code": "ISLM101",
                "nameAr": "العقيدة الإسلامية",
                "nameEn": "Islamic Faith",
                "creditHours": 2,
                "prerequisites": []
              }
            ],
            "4": [
              {
                "code": "CS240",
                "nameAr": "هياكل البيانات",
                "nameEn": "Data Structures",
                "creditHours": 3,
                "prerequisites": [
                  "CS230"
                ]
              },
              {
                "code": "CS241",
                "nameAr": "عمارة وتنظيم الحاسب",
                "nameEn": "Computer Architecture & Organization",
                "creditHours": 3,
                "prerequisites": [
                  "CS231"
                ]
              },
              {
                "code": "CS242",
                "nameAr": "نظرية الحوسبة",
                "nameEn": "Theory of Computing",
                "creditHours": 3,
                "prerequisites": [
                  "CS230",
                  "MATH150"
                ]
              },
              {
                "code": "CS243",
                "nameAr": "الرياضيات المتقطعة التطبيقية",
                "nameEn": "Applied Discrete Mathematics",
                "creditHours": 3,
                "prerequisites": [
                  "MATH150"
                ]
              },
              {
                "code": "SCI201",
                "nameAr": "الفيزياء العامة 2",
                "nameEn": "General Physics II",
                "creditHours": 3,
                "prerequisites": [
                  "SCI101"
                ]
              },
              {
                "code": "MATH251",
                "nameAr": "الجبر الخطي",
                "nameEn": "Linear Algebra",
                "creditHours": 3,
                "prerequisites": [
                  "MATH150"
                ]
              }
            ],
            "5": [
              {
                "code": "CS350",
                "nameAr": "مقدمة في قواعد البيانات",
                "nameEn": "Introduction to Databases",
                "creditHours": 3,
                "prerequisites": [
                  "CS240"
                ]
              },
              {
                "code": "CS351",
                "nameAr": "نظم التشغيل",
                "nameEn": "Operating Systems",
                "creditHours": 3,
                "prerequisites": [
                  "CS240",
                  "CS241"
                ]
              },
              {
                "code": "CS352",
                "nameAr": "تصميم وتحليل الخوارزميات",
                "nameEn": "Design and Analysis of Algorithms",
                "creditHours": 3,
                "prerequisites": [
                  "CS240"
                ]
              },
              {
                "code": "CS353",
                "nameAr": "مفاهيم لغات البرمجة",
                "nameEn": "Programming Languages Concepts",
                "creditHours": 3,
                "prerequisites": [
                  "CS240"
                ]
              }
            ],
            "6": [
              {
                "code": "CS360",
                "nameAr": "هندسة البرمجيات",
                "nameEn": "Software Engineering",
                "creditHours": 3,
                "prerequisites": [
                  "CS350"
                ]
              },
              {
                "code": "CS361",
                "nameAr": "برمجة الويب",
                "nameEn": "Web Programming",
                "creditHours": 3,
                "prerequisites": [
                  "CS350"
                ]
              },
              {
                "code": "CS362",
                "nameAr": "الذكاء الاصطناعي",
                "nameEn": "Artificial Intelligence",
                "creditHours": 3,
                "prerequisites": [
                  "CS352",
                  "MATH251"
                ]
              },
              {
                "code": "CS363",
                "nameAr": "مبادئ شبكات الحاسب",
                "nameEn": "Computer Networks Principles",
                "creditHours": 3,
                "prerequisites": [
                  "CS351"
                ]
              },
              {
                "code": "CS364",
                "nameAr": "تفاعل الإنسان مع الحاسب",
                "nameEn": "Human Computer Interaction",
                "creditHours": 3,
                "prerequisites": [
                  "CS240"
                ]
              }
            ],
            "7": [
              {
                "code": "CS470",
                "nameAr": "مشروع التخرج 1",
                "nameEn": "Senior Capstone Project I",
                "creditHours": 3,
                "prerequisites": [
                  "CS360",
                  "CS350"
                ]
              },
              {
                "code": "CS475",
                "nameAr": "تطوير تطبيقات الجوال",
                "nameEn": "Mobile Application Development",
                "creditHours": 3,
                "prerequisites": [
                  "CS360"
                ]
              },
              {
                "code": "CS476",
                "nameAr": "الحوسبة المتوازية والموزعة",
                "nameEn": "Parallel & Distributed Computing",
                "creditHours": 3,
                "prerequisites": [
                  "CS351"
                ]
              }
            ],
            "8": [
              {
                "code": "CS480",
                "nameAr": "مشروع التخرج 2",
                "nameEn": "Senior Capstone Project II",
                "creditHours": 3,
                "prerequisites": [
                  "CS470"
                ]
              },
              {
                "code": "CS481",
                "nameAr": "أخلاقيات المهنة في الحاسب",
                "nameEn": "Professional Ethics in Computing",
                "creditHours": 3,
                "prerequisites": [
                  "CS360"
                ]
              }
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
              {
                "code": "ENG001",
                "nameAr": "اللغة الإنجليزية 1",
                "nameEn": "English Language I",
                "creditHours": 4,
                "prerequisites": []
              },
              {
                "code": "CS001",
                "nameAr": "مهارات الحاسب الآلي",
                "nameEn": "Computer Skills",
                "creditHours": 3,
                "prerequisites": []
              },
              {
                "code": "CI001",
                "nameAr": "المهارات الأكاديمية والتعلم الذاتي",
                "nameEn": "Academic Skills",
                "creditHours": 2,
                "prerequisites": []
              }
            ],
            "2": [
              {
                "code": "ENG002",
                "nameAr": "اللغة الإنجليزية 2",
                "nameEn": "English Language II",
                "creditHours": 4,
                "prerequisites": [
                  "ENG001"
                ]
              },
              {
                "code": "MATH001",
                "nameAr": "الرياضيات التحضيرية",
                "nameEn": "Preparatory Mathematics",
                "creditHours": 3,
                "prerequisites": []
              },
              {
                "code": "COMM001",
                "nameAr": "مهارات الاتصال",
                "nameEn": "Communication Skills",
                "creditHours": 2,
                "prerequisites": []
              }
            ],
            "3": [
              {
                "code": "IT231",
                "nameAr": "مقدمة في تقنية المعلومات",
                "nameEn": "Introduction to IT",
                "creditHours": 3,
                "prerequisites": [
                  "CS001"
                ]
              },
              {
                "code": "IT232",
                "nameAr": "البرمجة الشيئية",
                "nameEn": "Object-Oriented Programming",
                "creditHours": 3,
                "prerequisites": [
                  "IT231"
                ]
              },
              {
                "code": "IT233",
                "nameAr": "تنظيم الحاسب",
                "nameEn": "Computer Organization",
                "creditHours": 3,
                "prerequisites": [
                  "IT231"
                ]
              },
              {
                "code": "MATH150",
                "nameAr": "الرياضيات المتقطعة",
                "nameEn": "Discrete Mathematics",
                "creditHours": 3,
                "prerequisites": [
                  "MATH001"
                ]
              },
              {
                "code": "ENG103",
                "nameAr": "الكتابة التقنية",
                "nameEn": "Technical Writing",
                "creditHours": 3,
                "prerequisites": [
                  "ENG002"
                ]
              },
              {
                "code": "ISLM101",
                "nameAr": "العقيدة الإسلامية",
                "nameEn": "Islamic Faith",
                "creditHours": 2,
                "prerequisites": []
              }
            ],
            "4": [
              {
                "code": "IT240",
                "nameAr": "مقدمة في قواعد البيانات",
                "nameEn": "Introduction to Databases",
                "creditHours": 3,
                "prerequisites": [
                  "IT232"
                ]
              },
              {
                "code": "IT241",
                "nameAr": "نظم التشغيل",
                "nameEn": "Operating Systems",
                "creditHours": 3,
                "prerequisites": [
                  "IT233"
                ]
              },
              {
                "code": "IT244",
                "nameAr": "مقدمة في قواعد البيانات والبرمجة",
                "nameEn": "Databases & Programming",
                "creditHours": 3,
                "prerequisites": [
                  "IT232"
                ]
              },
              {
                "code": "IT245",
                "nameAr": "هياكل البيانات",
                "nameEn": "Data Structures",
                "creditHours": 3,
                "prerequisites": [
                  "IT232"
                ]
              }
            ],
            "5": [
              {
                "code": "IT351",
                "nameAr": "شبكات الحاسب",
                "nameEn": "Computer Networks",
                "creditHours": 3,
                "prerequisites": [
                  "IT241"
                ]
              },
              {
                "code": "IT352",
                "nameAr": "تفاعل الإنسان مع الحاسب",
                "nameEn": "Human Computer Interaction",
                "creditHours": 3,
                "prerequisites": [
                  "IT232"
                ]
              },
              {
                "code": "IT353",
                "nameAr": "تحليل وتصميم النظم",
                "nameEn": "Systems Analysis & Design",
                "creditHours": 3,
                "prerequisites": [
                  "IT244"
                ]
              },
              {
                "code": "IT354",
                "nameAr": "نظم إدارة قواعد البيانات",
                "nameEn": "Database Management Systems",
                "creditHours": 3,
                "prerequisites": [
                  "IT244"
                ]
              }
            ],
            "6": [
              {
                "code": "IT361",
                "nameAr": "إدارة المشاريع التقنية",
                "nameEn": "IT Project Management",
                "creditHours": 3,
                "prerequisites": [
                  "IT353"
                ]
              },
              {
                "code": "IT362",
                "nameAr": "أمن ومخاطر تقنية المعلومات",
                "nameEn": "IT Security & Risk Management",
                "creditHours": 3,
                "prerequisites": [
                  "IT351"
                ]
              },
              {
                "code": "IT363",
                "nameAr": "إدارة الشبكات",
                "nameEn": "Network Management",
                "creditHours": 3,
                "prerequisites": [
                  "IT351"
                ]
              },
              {
                "code": "IT364",
                "nameAr": "ريادة الأعمال التقنية والابتكار",
                "nameEn": "IT Entrepreneurship & Innovation",
                "creditHours": 3,
                "prerequisites": [
                  "IT353"
                ]
              },
              {
                "code": "IT365",
                "nameAr": "نظم المؤسسات",
                "nameEn": "Enterprise Systems",
                "creditHours": 3,
                "prerequisites": [
                  "IT354"
                ]
              }
            ],
            "7": [
              {
                "code": "IT475",
                "nameAr": "مشروع التخرج 1",
                "nameEn": "IT Capstone Project I",
                "creditHours": 3,
                "prerequisites": [
                  "IT361",
                  "IT353"
                ]
              }
            ],
            "8": [
              {
                "code": "IT485",
                "nameAr": "الأخلاقيات المهنية في تقنية المعلومات",
                "nameEn": "Professional Ethics in IT",
                "creditHours": 3,
                "prerequisites": [
                  "IT475"
                ]
              }
            ]
          }
        },
        "ds": {
          "majorId": "ds",
          "nameAr": "علوم البيانات",
          "nameEn": "Data Science",
          "totalCredits": 130,
          "levels": {
            "1": [
              {
                "code": "ENG001",
                "nameAr": "اللغة الإنجليزية 1",
                "nameEn": "English Language I",
                "creditHours": 4,
                "prerequisites": []
              },
              {
                "code": "CS001",
                "nameAr": "مهارات الحاسب الآلي",
                "nameEn": "Computer Skills",
                "creditHours": 3,
                "prerequisites": []
              },
              {
                "code": "CI001",
                "nameAr": "المهارات الأكاديمية والتعلم الذاتي",
                "nameEn": "Academic Skills",
                "creditHours": 2,
                "prerequisites": []
              }
            ],
            "2": [
              {
                "code": "ENG002",
                "nameAr": "اللغة الإنجليزية 2",
                "nameEn": "English Language II",
                "creditHours": 4,
                "prerequisites": [
                  "ENG001"
                ]
              },
              {
                "code": "MATH001",
                "nameAr": "الرياضيات التحضيرية",
                "nameEn": "Preparatory Mathematics",
                "creditHours": 3,
                "prerequisites": []
              },
              {
                "code": "COMM001",
                "nameAr": "مهارات الاتصال",
                "nameEn": "Communication Skills",
                "creditHours": 2,
                "prerequisites": []
              }
            ],
            "3": [
              {
                "code": "DS230",
                "nameAr": "البرمجة الكائنية لعلوم البيانات",
                "nameEn": "Object-Oriented Programming",
                "creditHours": 3,
                "prerequisites": [
                  "CS001"
                ]
              },
              {
                "code": "DS231",
                "nameAr": "مقدمة في علم البيانات",
                "nameEn": "Introduction to Data Science",
                "creditHours": 3,
                "prerequisites": [
                  "CS001"
                ]
              },
              {
                "code": "MATH150",
                "nameAr": "الرياضيات المتقطعة",
                "nameEn": "Discrete Mathematics",
                "creditHours": 3,
                "prerequisites": [
                  "MATH001"
                ]
              },
              {
                "code": "SCI101",
                "nameAr": "الفيزياء العامة 1",
                "nameEn": "General Physics I",
                "creditHours": 3,
                "prerequisites": []
              },
              {
                "code": "ENG103",
                "nameAr": "الكتابة التقنية",
                "nameEn": "Technical Writing",
                "creditHours": 3,
                "prerequisites": [
                  "ENG002"
                ]
              },
              {
                "code": "ISLM101",
                "nameAr": "العقيدة الإسلامية",
                "nameEn": "Islamic Faith",
                "creditHours": 2,
                "prerequisites": []
              }
            ],
            "4": [
              {
                "code": "DS240",
                "nameAr": "هياكل البيانات",
                "nameEn": "Data Structures",
                "creditHours": 3,
                "prerequisites": [
                  "DS230"
                ]
              },
              {
                "code": "DS242",
                "nameAr": "البرمجة المتقدمة للبيانات (Python)",
                "nameEn": "Advanced Data Programming",
                "creditHours": 3,
                "prerequisites": [
                  "DS230"
                ]
              },
              {
                "code": "DS243",
                "nameAr": "الرياضيات المتقطعة للبيانات",
                "nameEn": "Discrete Math for DS",
                "creditHours": 3,
                "prerequisites": [
                  "MATH150"
                ]
              },
              {
                "code": "MATH241",
                "nameAr": "الجبر الخطي",
                "nameEn": "Linear Algebra",
                "creditHours": 3,
                "prerequisites": [
                  "MATH150"
                ]
              }
            ],
            "5": [
              {
                "code": "DS350",
                "nameAr": "مقدمة في قواعد البيانات",
                "nameEn": "Introduction to Databases",
                "creditHours": 3,
                "prerequisites": [
                  "DS240"
                ]
              },
              {
                "code": "DS351",
                "nameAr": "تحليل البيانات وتصويرها",
                "nameEn": "Data Analytics & Visualization",
                "creditHours": 3,
                "prerequisites": [
                  "DS242"
                ]
              },
              {
                "code": "DS352",
                "nameAr": "تصميم وتحليل الخوارزميات",
                "nameEn": "Design & Analysis of Algorithms",
                "creditHours": 3,
                "prerequisites": [
                  "DS240"
                ]
              },
              {
                "code": "DS353",
                "nameAr": "هندسة البرمجيات للبيانات",
                "nameEn": "Software Engineering for DS",
                "creditHours": 3,
                "prerequisites": [
                  "DS240"
                ]
              }
            ],
            "6": [
              {
                "code": "DS360",
                "nameAr": "أمن الحاسب والبيانات",
                "nameEn": "Computer & Data Security",
                "creditHours": 3,
                "prerequisites": [
                  "DS350"
                ]
              },
              {
                "code": "DS361",
                "nameAr": "التنقيب في البيانات",
                "nameEn": "Data Mining",
                "creditHours": 3,
                "prerequisites": [
                  "DS351"
                ]
              },
              {
                "code": "DS362",
                "nameAr": "الذكاء الاصطناعي وتعلم الآلة",
                "nameEn": "AI & Machine Learning",
                "creditHours": 3,
                "prerequisites": [
                  "DS352",
                  "MATH241"
                ]
              },
              {
                "code": "DS363",
                "nameAr": "نظم إدارة قواعد البيانات المتقدمة",
                "nameEn": "Advanced DBMS",
                "creditHours": 3,
                "prerequisites": [
                  "DS350"
                ]
              },
              {
                "code": "DS364",
                "nameAr": "تنسيق البيانات",
                "nameEn": "Data Curation",
                "creditHours": 3,
                "prerequisites": [
                  "DS350"
                ]
              }
            ],
            "7": [
              {
                "code": "DS470",
                "nameAr": "أمن البيانات والخصوصية",
                "nameEn": "Data Security & Privacy",
                "creditHours": 3,
                "prerequisites": [
                  "DS360"
                ]
              },
              {
                "code": "DS474",
                "nameAr": "دعم القرار الذكي",
                "nameEn": "Intelligent Decision Support",
                "creditHours": 3,
                "prerequisites": [
                  "DS362"
                ]
              }
            ],
            "8": [
              {
                "code": "DS481",
                "nameAr": "أخلاقيات المهنة في علم البيانات",
                "nameEn": "Ethics in Data Science",
                "creditHours": 3,
                "prerequisites": [
                  "DS470"
                ]
              },
              {
                "code": "DS483",
                "nameAr": "معالجة اللغات الطبيعية",
                "nameEn": "Natural Language Processing",
                "creditHours": 3,
                "prerequisites": [
                  "DS362"
                ]
              },
              {
                "code": "DS485",
                "nameAr": "ذكاء الأعمال",
                "nameEn": "Business Intelligence",
                "creditHours": 3,
                "prerequisites": [
                  "DS361"
                ]
              }
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
              {
                "code": "ENG001",
                "nameAr": "اللغة الإنجليزية 1",
                "nameEn": "English Language I",
                "creditHours": 4,
                "prerequisites": []
              },
              {
                "code": "CS001",
                "nameAr": "مهارات الحاسب الآلي",
                "nameEn": "Computer Skills",
                "creditHours": 3,
                "prerequisites": []
              },
              {
                "code": "CI001",
                "nameAr": "المهارات الأكاديمية والتعلم الذاتي",
                "nameEn": "Academic Skills",
                "creditHours": 2,
                "prerequisites": []
              }
            ],
            "2": [
              {
                "code": "ENG002",
                "nameAr": "اللغة الإنجليزية 2",
                "nameEn": "English Language II",
                "creditHours": 4,
                "prerequisites": [
                  "ENG001"
                ]
              },
              {
                "code": "MATH001",
                "nameAr": "الرياضيات التحضيرية",
                "nameEn": "Preparatory Mathematics",
                "creditHours": 3,
                "prerequisites": []
              },
              {
                "code": "COMM001",
                "nameAr": "مهارات الاتصال",
                "nameEn": "Communication Skills",
                "creditHours": 2,
                "prerequisites": []
              }
            ],
            "3": [
              {
                "code": "MGT101",
                "nameAr": "مبادئ الإدارة الحديثة",
                "nameEn": "Principles of Management",
                "creditHours": 3,
                "prerequisites": []
              },
              {
                "code": "ECON101",
                "nameAr": "مبادئ الاقتصاد الجزئي",
                "nameEn": "Principles of Microeconomics",
                "creditHours": 3,
                "prerequisites": [
                  "MATH001"
                ]
              },
              {
                "code": "ACCT101",
                "nameAr": "مبادئ المحاسبة المالية",
                "nameEn": "Financial Accounting",
                "creditHours": 3,
                "prerequisites": [
                  "MATH001"
                ]
              },
              {
                "code": "MKT201",
                "nameAr": "مبادئ التسويق",
                "nameEn": "Principles of Marketing",
                "creditHours": 3,
                "prerequisites": [
                  "MGT101"
                ]
              },
              {
                "code": "ECON201",
                "nameAr": "مبادئ الاقتصاد الكلي",
                "nameEn": "Principles of Macroeconomics",
                "creditHours": 3,
                "prerequisites": [
                  "ECON101"
                ]
              },
              {
                "code": "FIN201",
                "nameAr": "الإدارة المالية",
                "nameEn": "Financial Management",
                "creditHours": 3,
                "prerequisites": [
                  "ACCT101"
                ]
              },
              {
                "code": "STAT101",
                "nameAr": "الإحصاء في إدارة الأعمال",
                "nameEn": "Business Statistics",
                "creditHours": 3,
                "prerequisites": [
                  "MATH001"
                ]
              }
            ],
            "4": [
              {
                "code": "MGT220",
                "nameAr": "السلوك التنظيمي",
                "nameEn": "Organizational Behavior",
                "creditHours": 3,
                "prerequisites": [
                  "MGT101"
                ]
              },
              {
                "code": "MGT240",
                "nameAr": "إدارة الموارد البشرية",
                "nameEn": "Human Resource Management",
                "creditHours": 3,
                "prerequisites": [
                  "MGT101"
                ]
              },
              {
                "code": "MIS201",
                "nameAr": "نظم المعلومات الإدارية",
                "nameEn": "Management Information Systems",
                "creditHours": 3,
                "prerequisites": [
                  "MGT101"
                ]
              },
              {
                "code": "LAW101",
                "nameAr": "القانون التجاري وبيئة الأعمال",
                "nameEn": "Commercial Law",
                "creditHours": 3,
                "prerequisites": []
              }
            ],
            "5": [
              {
                "code": "MGT310",
                "nameAr": "إدارة العمليات والإنتاج",
                "nameEn": "Operations & Production Management",
                "creditHours": 3,
                "prerequisites": [
                  "STAT101"
                ]
              },
              {
                "code": "MGT325",
                "nameAr": "إدارة سلاسل الإمداد واللوجستيات",
                "nameEn": "Supply Chain Management",
                "creditHours": 3,
                "prerequisites": [
                  "MGT310"
                ]
              },
              {
                "code": "MKT315",
                "nameAr": "سلوك المستهلك",
                "nameEn": "Consumer Behavior",
                "creditHours": 3,
                "prerequisites": [
                  "MKT201"
                ]
              },
              {
                "code": "MGT340",
                "nameAr": "منهجية البحث في العلوم الإدارية",
                "nameEn": "Business Research Methods",
                "creditHours": 3,
                "prerequisites": [
                  "STAT101"
                ]
              }
            ],
            "6": [
              {
                "code": "MGT360",
                "nameAr": "إدارة الأعمال الدولية والشركات متعددة الجنسيات",
                "nameEn": "International Business",
                "creditHours": 3,
                "prerequisites": [
                  "MGT101",
                  "ECON201"
                ]
              },
              {
                "code": "MGT370",
                "nameAr": "ريادة الأعمال وإدارة المشاريع الصغيرة",
                "nameEn": "Entrepreneurship & Small Business",
                "creditHours": 3,
                "prerequisites": [
                  "FIN201",
                  "MKT201"
                ]
              },
              {
                "code": "MGT380",
                "nameAr": "إدارة الجودة الشاملة",
                "nameEn": "Total Quality Management",
                "creditHours": 3,
                "prerequisites": [
                  "MGT310"
                ]
              },
              {
                "code": "MGT390",
                "nameAr": "القيادة وإدارة فرق العمل",
                "nameEn": "Leadership and Team Management",
                "creditHours": 3,
                "prerequisites": [
                  "MGT220"
                ]
              }
            ],
            "7": [
              {
                "code": "MGT470",
                "nameAr": "الإدارة الاستراتيجية والتخطيط المؤسسي",
                "nameEn": "Strategic Management",
                "creditHours": 3,
                "prerequisites": [
                  "MGT310",
                  "FIN201",
                  "MKT201"
                ]
              },
              {
                "code": "MGT475",
                "nameAr": "إدارة التغيير والتطوير التنظيمي",
                "nameEn": "Change Management",
                "creditHours": 3,
                "prerequisites": [
                  "MGT220"
                ]
              },
              {
                "code": "MGT478",
                "nameAr": "مشروع التخرج في إدارة الأعمال 1",
                "nameEn": "Graduation Project in Business I",
                "creditHours": 3,
                "prerequisites": [
                  "MGT340"
                ]
              },
              {
                "code": "MGT482",
                "nameAr": "حوكمة الشركات وأخلاقيات الأعمال",
                "nameEn": "Corporate Governance & Ethics",
                "creditHours": 3,
                "prerequisites": [
                  "LAW101"
                ]
              }
            ],
            "8": [
              {
                "code": "MGT480",
                "nameAr": "مشروع التخرج في إدارة الأعمال 2",
                "nameEn": "Graduation Project in Business II",
                "creditHours": 3,
                "prerequisites": [
                  "MGT478"
                ]
              },
              {
                "code": "MGT485",
                "nameAr": "التدريب التعاوني والميداني",
                "nameEn": "Cooperative Business Training",
                "creditHours": 6,
                "prerequisites": [
                  "MGT470"
                ]
              },
              {
                "code": "MGT490",
                "nameAr": "قضايا معاصرة في الإدارة",
                "nameEn": "Contemporary Issues in Business",
                "creditHours": 2,
                "prerequisites": []
              }
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
              {
                "code": "ENG001",
                "nameAr": "اللغة الإنجليزية 1",
                "nameEn": "English Language I",
                "creditHours": 4,
                "prerequisites": []
              },
              {
                "code": "CS001",
                "nameAr": "مهارات الحاسب الآلي",
                "nameEn": "Computer Skills",
                "creditHours": 3,
                "prerequisites": []
              },
              {
                "code": "CI001",
                "nameAr": "المهارات الأكاديمية والتعلم الذاتي",
                "nameEn": "Academic Skills",
                "creditHours": 2,
                "prerequisites": []
              }
            ],
            "2": [
              {
                "code": "ENG002",
                "nameAr": "اللغة الإنجليزية 2",
                "nameEn": "English Language II",
                "creditHours": 4,
                "prerequisites": [
                  "ENG001"
                ]
              },
              {
                "code": "MATH001",
                "nameAr": "الرياضيات التحضيرية",
                "nameEn": "Preparatory Mathematics",
                "creditHours": 3,
                "prerequisites": []
              },
              {
                "code": "COMM001",
                "nameAr": "مهارات الاتصال",
                "nameEn": "Communication Skills",
                "creditHours": 2,
                "prerequisites": []
              }
            ],
            "3": [
              {
                "code": "MGT101",
                "nameAr": "مبادئ الإدارة",
                "nameEn": "Principles of Management",
                "creditHours": 3,
                "prerequisites": []
              },
              {
                "code": "ACCT101",
                "nameAr": "مبادئ المحاسبة المالية",
                "nameEn": "Financial Accounting",
                "creditHours": 3,
                "prerequisites": [
                  "MATH001"
                ]
              },
              {
                "code": "ECON101",
                "nameAr": "مبادئ الاقتصاد الجزئي",
                "nameEn": "Microeconomics",
                "creditHours": 3,
                "prerequisites": [
                  "MATH001"
                ]
              },
              {
                "code": "ACCT201",
                "nameAr": "المحاسبة المتوسطة 1",
                "nameEn": "Intermediate Accounting I",
                "creditHours": 3,
                "prerequisites": [
                  "ACCT101"
                ]
              },
              {
                "code": "ACCT205",
                "nameAr": "محاسبة التكاليف",
                "nameEn": "Cost Accounting",
                "creditHours": 3,
                "prerequisites": [
                  "ACCT101"
                ]
              },
              {
                "code": "FIN201",
                "nameAr": "الإدارة المالية",
                "nameEn": "Financial Management",
                "creditHours": 3,
                "prerequisites": [
                  "ACCT101"
                ]
              },
              {
                "code": "STAT101",
                "nameAr": "الإحصاء للأعمال",
                "nameEn": "Business Statistics",
                "creditHours": 3,
                "prerequisites": [
                  "MATH001"
                ]
              }
            ],
            "4": [
              {
                "code": "ACCT202",
                "nameAr": "المحاسبة المتوسطة 2",
                "nameEn": "Intermediate Accounting II",
                "creditHours": 3,
                "prerequisites": [
                  "ACCT201"
                ]
              },
              {
                "code": "ACCT250",
                "nameAr": "المحاسبة الإدارية",
                "nameEn": "Managerial Accounting",
                "creditHours": 3,
                "prerequisites": [
                  "ACCT205"
                ]
              },
              {
                "code": "LAW101",
                "nameAr": "القانون التجاري",
                "nameEn": "Commercial Law",
                "creditHours": 3,
                "prerequisites": []
              },
              {
                "code": "MIS201",
                "nameAr": "نظم المعلومات المحاسبية",
                "nameEn": "Accounting Information Systems",
                "creditHours": 3,
                "prerequisites": [
                  "ACCT101"
                ]
              }
            ],
            "5": [
              {
                "code": "ACCT301",
                "nameAr": "المحاسبة المتقدمة",
                "nameEn": "Advanced Accounting",
                "creditHours": 3,
                "prerequisites": [
                  "ACCT202"
                ]
              },
              {
                "code": "ACCT310",
                "nameAr": "المراجعة والتدقيق 1",
                "nameEn": "Auditing I",
                "creditHours": 3,
                "prerequisites": [
                  "ACCT202"
                ]
              },
              {
                "code": "ACCT320",
                "nameAr": "المحاسبة الضريبية والزكاة",
                "nameEn": "Zakat & Tax Accounting",
                "creditHours": 3,
                "prerequisites": [
                  "ACCT201"
                ]
              },
              {
                "code": "ACCT330",
                "nameAr": "المحاسبة الحكومية والمنظمات غير الربحية",
                "nameEn": "Government & Non-Profit Accounting",
                "creditHours": 3,
                "prerequisites": [
                  "ACCT201"
                ]
              }
            ],
            "6": [
              {
                "code": "ACCT350",
                "nameAr": "المراجعة والتدقيق 2 (التدقيق المتقدم)",
                "nameEn": "Advanced Auditing",
                "creditHours": 3,
                "prerequisites": [
                  "ACCT310"
                ]
              },
              {
                "code": "ACCT360",
                "nameAr": "التحليل المالي وقوائم التدفقات",
                "nameEn": "Financial Statement Analysis",
                "creditHours": 3,
                "prerequisites": [
                  "ACCT202",
                  "FIN201"
                ]
              },
              {
                "code": "ACCT370",
                "nameAr": "المعايير الدولية لإعداد التقارير المالية (IFRS)",
                "nameEn": "International Financial Reporting Standards",
                "creditHours": 3,
                "prerequisites": [
                  "ACCT301"
                ]
              },
              {
                "code": "ACCT380",
                "nameAr": "المحاسبة القضائية وكشف الاحتيال",
                "nameEn": "Forensic Accounting & Fraud Examination",
                "creditHours": 3,
                "prerequisites": [
                  "ACCT310"
                ]
              }
            ],
            "7": [
              {
                "code": "ACCT470",
                "nameAr": "مشروع التخرج في المحاسبة 1",
                "nameEn": "Accounting Capstone Project I",
                "creditHours": 3,
                "prerequisites": [
                  "ACCT301",
                  "ACCT310"
                ]
              },
              {
                "code": "ACCT472",
                "nameAr": "حوكمة الشركات وأخلاقيات المهنة المحاسبية",
                "nameEn": "Accounting Professional Ethics & Governance",
                "creditHours": 3,
                "prerequisites": [
                  "ACCT310"
                ]
              },
              {
                "code": "ACCT475",
                "nameAr": "نظم تخطيط موارد المؤسسات (ERP)",
                "nameEn": "Accounting in ERP Systems",
                "creditHours": 3,
                "prerequisites": [
                  "MIS201"
                ]
              },
              {
                "code": "ACCT478",
                "nameAr": "محاسبة المنشآت المالية والبنوك",
                "nameEn": "Financial Institutions Accounting",
                "creditHours": 3,
                "prerequisites": [
                  "ACCT301"
                ]
              }
            ],
            "8": [
              {
                "code": "ACCT480",
                "nameAr": "مشروع التخرج في المحاسبة 2",
                "nameEn": "Accounting Capstone Project II",
                "creditHours": 3,
                "prerequisites": [
                  "ACCT470"
                ]
              },
              {
                "code": "ACCT485",
                "nameAr": "التدريب التعاوني والميداني",
                "nameEn": "Cooperative Field Training",
                "creditHours": 6,
                "prerequisites": [
                  "ACCT470"
                ]
              },
              {
                "code": "ACCT490",
                "nameAr": "ندوة وتطبيقات عملية لاختبار SOCPA",
                "nameEn": "SOCPA Exam Seminar & Practice",
                "creditHours": 2,
                "prerequisites": []
              }
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
              {
                "code": "ENG001",
                "nameAr": "اللغة الإنجليزية 1",
                "nameEn": "English Language I",
                "creditHours": 4,
                "prerequisites": []
              },
              {
                "code": "CS001",
                "nameAr": "مهارات الحاسب الآلي",
                "nameEn": "Computer Skills",
                "creditHours": 3,
                "prerequisites": []
              },
              {
                "code": "CI001",
                "nameAr": "المهارات الأكاديمية والتعلم الذاتي",
                "nameEn": "Academic Skills",
                "creditHours": 2,
                "prerequisites": []
              }
            ],
            "2": [
              {
                "code": "ENG002",
                "nameAr": "اللغة الإنجليزية 2",
                "nameEn": "English Language II",
                "creditHours": 4,
                "prerequisites": [
                  "ENG001"
                ]
              },
              {
                "code": "MATH001",
                "nameAr": "الرياضيات التحضيرية",
                "nameEn": "Preparatory Mathematics",
                "creditHours": 3,
                "prerequisites": []
              },
              {
                "code": "COMM001",
                "nameAr": "مهارات الاتصال",
                "nameEn": "Communication Skills",
                "creditHours": 2,
                "prerequisites": []
              }
            ],
            "3": [
              {
                "code": "MGT101",
                "nameAr": "مبادئ الإدارة",
                "nameEn": "Principles of Management",
                "creditHours": 3,
                "prerequisites": []
              },
              {
                "code": "ACCT101",
                "nameAr": "مبادئ المحاسبة المالية",
                "nameEn": "Financial Accounting",
                "creditHours": 3,
                "prerequisites": [
                  "MATH001"
                ]
              },
              {
                "code": "ECON101",
                "nameAr": "مبادئ الاقتصاد الجزئي",
                "nameEn": "Microeconomics",
                "creditHours": 3,
                "prerequisites": [
                  "MATH001"
                ]
              },
              {
                "code": "FIN201",
                "nameAr": "مبادئ الإدارة المالية",
                "nameEn": "Corporate Finance",
                "creditHours": 3,
                "prerequisites": [
                  "ACCT101"
                ]
              },
              {
                "code": "ECON201",
                "nameAr": "مبادئ الاقتصاد الكلي",
                "nameEn": "Macroeconomics",
                "creditHours": 3,
                "prerequisites": [
                  "ECON101"
                ]
              },
              {
                "code": "STAT101",
                "nameAr": "الإحصاء المالي",
                "nameEn": "Financial Statistics",
                "creditHours": 3,
                "prerequisites": [
                  "MATH001"
                ]
              },
              {
                "code": "ACCT201",
                "nameAr": "المحاسبة المتوسطة 1",
                "nameEn": "Intermediate Accounting I",
                "creditHours": 3,
                "prerequisites": [
                  "ACCT101"
                ]
              }
            ],
            "4": [
              {
                "code": "FIN220",
                "nameAr": "الأسواق والمؤسسات المالية",
                "nameEn": "Financial Markets & Institutions",
                "creditHours": 3,
                "prerequisites": [
                  "FIN201"
                ]
              },
              {
                "code": "FIN230",
                "nameAr": "الاستثمار وإدارة المحافظ 1",
                "nameEn": "Investment & Portfolio Management I",
                "creditHours": 3,
                "prerequisites": [
                  "FIN201"
                ]
              },
              {
                "code": "ECON220",
                "nameAr": "النقود والبنوك",
                "nameEn": "Money and Banking",
                "creditHours": 3,
                "prerequisites": [
                  "ECON201"
                ]
              },
              {
                "code": "LAW101",
                "nameAr": "القانون التجاري",
                "nameEn": "Commercial Law",
                "creditHours": 3,
                "prerequisites": []
              }
            ],
            "5": [
              {
                "code": "FIN310",
                "nameAr": "تمويل الشركات المتقدم",
                "nameEn": "Advanced Corporate Finance",
                "creditHours": 3,
                "prerequisites": [
                  "FIN201"
                ]
              },
              {
                "code": "FIN320",
                "nameAr": "إدارة المخاطر المالية والتأمين",
                "nameEn": "Risk Management & Insurance",
                "creditHours": 3,
                "prerequisites": [
                  "FIN220",
                  "STAT101"
                ]
              },
              {
                "code": "FIN330",
                "nameAr": "الاستثمار وإدارة المحافظ 2",
                "nameEn": "Investment & Portfolio Management II",
                "creditHours": 3,
                "prerequisites": [
                  "FIN230"
                ]
              },
              {
                "code": "FIN340",
                "nameAr": "المصرفية الإسلامية والتمويل الإسلامي",
                "nameEn": "Islamic Banking & Finance",
                "creditHours": 3,
                "prerequisites": [
                  "FIN220"
                ]
              }
            ],
            "6": [
              {
                "code": "FIN360",
                "nameAr": "المشتقات المالية والأدوات المهيكلة",
                "nameEn": "Financial Derivatives",
                "creditHours": 3,
                "prerequisites": [
                  "FIN330"
                ]
              },
              {
                "code": "FIN370",
                "nameAr": "التقنية المالية (FinTech) والبلوكشين",
                "nameEn": "Financial Technology (FinTech)",
                "creditHours": 3,
                "prerequisites": [
                  "FIN220"
                ]
              },
              {
                "code": "FIN380",
                "nameAr": "التقييم المالي والاندماج والاستحواذ",
                "nameEn": "Valuation, Mergers & Acquisitions",
                "creditHours": 3,
                "prerequisites": [
                  "FIN310"
                ]
              },
              {
                "code": "FIN390",
                "nameAr": "التمويل الدولي وإدارة أسعار الصرف",
                "nameEn": "International Finance",
                "creditHours": 3,
                "prerequisites": [
                  "ECON220"
                ]
              }
            ],
            "7": [
              {
                "code": "FIN470",
                "nameAr": "مشروع التخرج في المالية 1",
                "nameEn": "Finance Capstone Project I",
                "creditHours": 3,
                "prerequisites": [
                  "FIN310",
                  "FIN330"
                ]
              },
              {
                "code": "FIN472",
                "nameAr": "النمذجة والتحليل المالي المتقدم (Excel & Python)",
                "nameEn": "Financial Modeling & Analytics",
                "creditHours": 3,
                "prerequisites": [
                  "FIN310"
                ]
              },
              {
                "code": "FIN475",
                "nameAr": "تمويل المشاريع ورأس المال الجريء",
                "nameEn": "Venture Capital & Project Finance",
                "creditHours": 3,
                "prerequisites": [
                  "FIN310"
                ]
              },
              {
                "code": "FIN478",
                "nameAr": "أخلاقيات وقوانين الأسواق المالية (CMA)",
                "nameEn": "Ethics & Capital Market Regulations",
                "creditHours": 3,
                "prerequisites": [
                  "LAW101"
                ]
              }
            ],
            "8": [
              {
                "code": "FIN480",
                "nameAr": "مشروع التخرج في المالية 2",
                "nameEn": "Finance Capstone Project II",
                "creditHours": 3,
                "prerequisites": [
                  "FIN470"
                ]
              },
              {
                "code": "FIN485",
                "nameAr": "التدريب التعاوني والميداني",
                "nameEn": "Cooperative Field Training",
                "creditHours": 6,
                "prerequisites": [
                  "FIN470"
                ]
              },
              {
                "code": "FIN490",
                "nameAr": "تطبيقات عملية لاختبارات CFA وCME",
                "nameEn": "CFA & CME Preparation Seminar",
                "creditHours": 2,
                "prerequisites": []
              }
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
              {
                "code": "ENG001",
                "nameAr": "اللغة الإنجليزية 1",
                "nameEn": "English Language I",
                "creditHours": 4,
                "prerequisites": []
              },
              {
                "code": "CS001",
                "nameAr": "مهارات الحاسب الآلي",
                "nameEn": "Computer Skills",
                "creditHours": 3,
                "prerequisites": []
              },
              {
                "code": "CI001",
                "nameAr": "المهارات الأكاديمية والتعلم الذاتي",
                "nameEn": "Academic Skills",
                "creditHours": 2,
                "prerequisites": []
              }
            ],
            "2": [
              {
                "code": "ENG002",
                "nameAr": "اللغة الإنجليزية 2",
                "nameEn": "English Language II",
                "creditHours": 4,
                "prerequisites": [
                  "ENG001"
                ]
              },
              {
                "code": "MATH001",
                "nameAr": "الرياضيات التحضيرية",
                "nameEn": "Preparatory Mathematics",
                "creditHours": 3,
                "prerequisites": []
              },
              {
                "code": "COMM001",
                "nameAr": "مهارات الاتصال",
                "nameEn": "Communication Skills",
                "creditHours": 2,
                "prerequisites": []
              }
            ],
            "3": [
              {
                "code": "MGT101",
                "nameAr": "مبادئ الإدارة",
                "nameEn": "Principles of Management",
                "creditHours": 3,
                "prerequisites": []
              },
              {
                "code": "ECOM101",
                "nameAr": "مقدمة في التجارة الإلكترونية",
                "nameEn": "Introduction to E-Commerce",
                "creditHours": 3,
                "prerequisites": []
              },
              {
                "code": "ACCT101",
                "nameAr": "مبادئ المحاسبة المالية",
                "nameEn": "Financial Accounting",
                "creditHours": 3,
                "prerequisites": [
                  "MATH001"
                ]
              },
              {
                "code": "ECOM201",
                "nameAr": "بنية وتكنولوجيا التجارة الإلكترونية",
                "nameEn": "E-Commerce Infrastructure & Tech",
                "creditHours": 3,
                "prerequisites": [
                  "ECOM101"
                ]
              },
              {
                "code": "MKT201",
                "nameAr": "مبادئ التسويق الحديث",
                "nameEn": "Principles of Marketing",
                "creditHours": 3,
                "prerequisites": [
                  "MGT101"
                ]
              },
              {
                "code": "IT230",
                "nameAr": "تصميم وبناء مواقع الويب للأعمال",
                "nameEn": "Web Design for E-Business",
                "creditHours": 3,
                "prerequisites": [
                  "ECOM101"
                ]
              },
              {
                "code": "STAT101",
                "nameAr": "الإحصاء للأعمال",
                "nameEn": "Business Statistics",
                "creditHours": 3,
                "prerequisites": [
                  "MATH001"
                ]
              }
            ],
            "4": [
              {
                "code": "ECOM220",
                "nameAr": "التسويق الرقمي والإلكتروني",
                "nameEn": "Digital & Internet Marketing",
                "creditHours": 3,
                "prerequisites": [
                  "MKT201"
                ]
              },
              {
                "code": "ECOM230",
                "nameAr": "أنظمة الدفع والأمان الإلكتروني",
                "nameEn": "E-Payment Systems & Security",
                "creditHours": 3,
                "prerequisites": [
                  "ECOM201"
                ]
              },
              {
                "code": "MIS201",
                "nameAr": "نظم المعلومات الإدارية وتخطيط الموارد",
                "nameEn": "Management Information Systems",
                "creditHours": 3,
                "prerequisites": [
                  "MGT101"
                ]
              },
              {
                "code": "LAW101",
                "nameAr": "قوانين التجارة الإلكترونية والجرائم السيبرانية",
                "nameEn": "Cyber & E-Commerce Law",
                "creditHours": 3,
                "prerequisites": []
              }
            ],
            "5": [
              {
                "code": "ECOM310",
                "nameAr": "إدارة سلاسل الإمداد الرقمية والخدمات اللوجستية",
                "nameEn": "Digital Supply Chain Management",
                "creditHours": 3,
                "prerequisites": [
                  "ECOM201"
                ]
              },
              {
                "code": "ECOM320",
                "nameAr": "تحليلات بيانات التجارة الإلكترونية والويب",
                "nameEn": "E-Commerce & Web Analytics",
                "creditHours": 3,
                "prerequisites": [
                  "STAT101",
                  "ECOM220"
                ]
              },
              {
                "code": "ECOM330",
                "nameAr": "إدارة علاقات العملاء الرقمية (CRM)",
                "nameEn": "Customer Relationship Management",
                "creditHours": 3,
                "prerequisites": [
                  "MKT201"
                ]
              },
              {
                "code": "ECOM340",
                "nameAr": "تجربة المستخدم وتصميم واجهات المتاجر (UX/UI)",
                "nameEn": "UX/UI for E-Commerce Platforms",
                "creditHours": 3,
                "prerequisites": [
                  "IT230"
                ]
              }
            ],
            "6": [
              {
                "code": "ECOM360",
                "nameAr": "استراتيجيات التجارة الإلكترونية عبر الجوال (M-Commerce)",
                "nameEn": "Mobile Commerce Strategies",
                "creditHours": 3,
                "prerequisites": [
                  "ECOM201"
                ]
              },
              {
                "code": "ECOM370",
                "nameAr": "التجارة الاجتماعية والتسويق بالمحتوى المؤثر",
                "nameEn": "Social Commerce & Content Marketing",
                "creditHours": 3,
                "prerequisites": [
                  "ECOM220"
                ]
              },
              {
                "code": "ECOM380",
                "nameAr": "ريادة الأعمال الرقمية وإطلاق الشركات الناشئة",
                "nameEn": "Digital Entrepreneurship",
                "creditHours": 3,
                "prerequisites": [
                  "ECOM101"
                ]
              },
              {
                "code": "ECOM390",
                "nameAr": "محركات البحث وتحسين الظهور (SEO/SEM)",
                "nameEn": "Search Engine Marketing (SEO/SEM)",
                "creditHours": 3,
                "prerequisites": [
                  "ECOM220"
                ]
              }
            ],
            "7": [
              {
                "code": "ECOM470",
                "nameAr": "مشروع التخرج في التجارة الإلكترونية 1",
                "nameEn": "E-Commerce Capstone Project I",
                "creditHours": 3,
                "prerequisites": [
                  "ECOM310",
                  "ECOM320"
                ]
              },
              {
                "code": "ECOM472",
                "nameAr": "إدارة المنصات والأسواق الرقمية المفتوحة",
                "nameEn": "Digital Platforms & Marketplace Management",
                "creditHours": 3,
                "prerequisites": [
                  "ECOM380"
                ]
              },
              {
                "code": "ECOM475",
                "nameAr": "الذكاء الاصطناعي في التسويق والتجارة الإلكترونية",
                "nameEn": "AI in Marketing & E-Commerce",
                "creditHours": 3,
                "prerequisites": [
                  "ECOM320"
                ]
              },
              {
                "code": "ECOM478",
                "nameAr": "حوكمة التجارة الرقمية وحماية المستهلك",
                "nameEn": "Consumer Protection in Digital Trade",
                "creditHours": 3,
                "prerequisites": [
                  "LAW101"
                ]
              }
            ],
            "8": [
              {
                "code": "ECOM480",
                "nameAr": "مشروع التخرج في التجارة الإلكترونية 2",
                "nameEn": "E-Commerce Capstone Project II",
                "creditHours": 3,
                "prerequisites": [
                  "ECOM470"
                ]
              },
              {
                "code": "ECOM485",
                "nameAr": "التدريب التعاوني والميداني",
                "nameEn": "Cooperative Field Training",
                "creditHours": 6,
                "prerequisites": [
                  "ECOM470"
                ]
              },
              {
                "code": "ECOM490",
                "nameAr": "ندوة متقدمة في اتجاهات التجارة الرقمية",
                "nameEn": "Trends in E-Business Seminar",
                "creditHours": 2,
                "prerequisites": []
              }
            ]
          }
        },
        "mis": {
          "majorId": "mis",
          "nameAr": "نظم المعلومات الإدارية",
          "nameEn": "Management Information Systems",
          "totalCredits": 130,
          "levels": {
            "1": [
              {
                "code": "ENG001",
                "nameAr": "اللغة الإنجليزية 1",
                "nameEn": "English Language I",
                "creditHours": 4,
                "prerequisites": []
              },
              {
                "code": "CS001",
                "nameAr": "مهارات الحاسب الآلي",
                "nameEn": "Computer Skills",
                "creditHours": 3,
                "prerequisites": []
              },
              {
                "code": "CI001",
                "nameAr": "المهارات الأكاديمية والتعلم الذاتي",
                "nameEn": "Academic Skills",
                "creditHours": 2,
                "prerequisites": []
              }
            ],
            "2": [
              {
                "code": "ENG002",
                "nameAr": "اللغة الإنجليزية 2",
                "nameEn": "English Language II",
                "creditHours": 4,
                "prerequisites": [
                  "ENG001"
                ]
              },
              {
                "code": "MATH001",
                "nameAr": "الرياضيات التحضيرية",
                "nameEn": "Preparatory Mathematics",
                "creditHours": 3,
                "prerequisites": []
              },
              {
                "code": "COMM001",
                "nameAr": "مهارات الاتصال",
                "nameEn": "Communication Skills",
                "creditHours": 2,
                "prerequisites": []
              }
            ],
            "3": [
              {
                "code": "MGT101",
                "nameAr": "مبادئ الإدارة",
                "nameEn": "Principles of Management",
                "creditHours": 3,
                "prerequisites": []
              },
              {
                "code": "ACCT101",
                "nameAr": "مبادئ المحاسبة المالية",
                "nameEn": "Financial Accounting",
                "creditHours": 3,
                "prerequisites": [
                  "MATH001"
                ]
              },
              {
                "code": "ECON101",
                "nameAr": "مبادئ الاقتصاد الجزئي",
                "nameEn": "Microeconomics",
                "creditHours": 3,
                "prerequisites": [
                  "MATH001"
                ]
              },
              {
                "code": "MIS201",
                "nameAr": "مبادئ نظم المعلومات الإدارية",
                "nameEn": "Principles of MIS",
                "creditHours": 3,
                "prerequisites": [
                  "CS001"
                ]
              }
            ],
            "4": [
              {
                "code": "MIS210",
                "nameAr": "تحليل وتصميم نظم المعلومات",
                "nameEn": "Systems Analysis & Design",
                "creditHours": 3,
                "prerequisites": [
                  "MIS201"
                ]
              },
              {
                "code": "MIS220",
                "nameAr": "إدارة قواعد البيانات للأعمال",
                "nameEn": "Business Database Management",
                "creditHours": 3,
                "prerequisites": [
                  "MIS201"
                ]
              },
              {
                "code": "STAT101",
                "nameAr": "الإحصاء للأعمال",
                "nameEn": "Business Statistics",
                "creditHours": 3,
                "prerequisites": [
                  "MATH001"
                ]
              },
              {
                "code": "FIN201",
                "nameAr": "الإدارة المالية",
                "nameEn": "Financial Management",
                "creditHours": 3,
                "prerequisites": [
                  "ACCT101"
                ]
              }
            ],
            "5": [
              {
                "code": "MIS310",
                "nameAr": "نظم تخطيط موارد المؤسسات (ERP)",
                "nameEn": "Enterprise Resource Planning",
                "creditHours": 3,
                "prerequisites": [
                  "MIS210"
                ]
              },
              {
                "code": "MIS320",
                "nameAr": "اتصالات البيانات وشبكات الأعمال",
                "nameEn": "Business Data Networks",
                "creditHours": 3,
                "prerequisites": [
                  "MIS201"
                ]
              },
              {
                "code": "ECOM101",
                "nameAr": "التجارة الإلكترونية",
                "nameEn": "E-Commerce",
                "creditHours": 3,
                "prerequisites": [
                  "MGT101"
                ]
              },
              {
                "code": "ISLM101",
                "nameAr": "العقيدة الإسلامية",
                "nameEn": "Islamic Faith",
                "creditHours": 2,
                "prerequisites": []
              }
            ],
            "6": [
              {
                "code": "MIS350",
                "nameAr": "ذكاء الأعمال وتحليلات القرار",
                "nameEn": "Business Intelligence & Analytics",
                "creditHours": 3,
                "prerequisites": [
                  "MIS220",
                  "STAT101"
                ]
              },
              {
                "code": "MIS360",
                "nameAr": "إدارة مشاريع نظم المعلومات",
                "nameEn": "IS Project Management",
                "creditHours": 3,
                "prerequisites": [
                  "MIS210"
                ]
              },
              {
                "code": "MIS370",
                "nameAr": "أمن وحوكمة نظم المعلومات",
                "nameEn": "IS Security & Governance",
                "creditHours": 3,
                "prerequisites": [
                  "MIS320"
                ]
              }
            ],
            "7": [
              {
                "code": "MIS470",
                "nameAr": "مشروع التخرج في نظم المعلومات الإدارية 1",
                "nameEn": "MIS Capstone Project I",
                "creditHours": 3,
                "prerequisites": [
                  "MIS350",
                  "MIS360"
                ]
              }
            ],
            "8": [
              {
                "code": "MIS480",
                "nameAr": "مشروع التخرج في نظم المعلومات الإدارية 2",
                "nameEn": "MIS Capstone Project II",
                "creditHours": 3,
                "prerequisites": [
                  "MIS470"
                ]
              }
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
              {
                "code": "ENG001",
                "nameAr": "اللغة الإنجليزية 1",
                "nameEn": "English Language I",
                "creditHours": 4,
                "prerequisites": []
              },
              {
                "code": "CS001",
                "nameAr": "مهارات الحاسب الآلي",
                "nameEn": "Computer Skills",
                "creditHours": 3,
                "prerequisites": []
              },
              {
                "code": "CI001",
                "nameAr": "المهارات الأكاديمية والتعلم الذاتي",
                "nameEn": "Academic Skills",
                "creditHours": 2,
                "prerequisites": []
              }
            ],
            "2": [
              {
                "code": "ENG002",
                "nameAr": "اللغة الإنجليزية 2",
                "nameEn": "English Language II",
                "creditHours": 4,
                "prerequisites": [
                  "ENG001"
                ]
              },
              {
                "code": "MATH001",
                "nameAr": "الرياضيات التحضيرية",
                "nameEn": "Preparatory Mathematics",
                "creditHours": 3,
                "prerequisites": []
              },
              {
                "code": "COMM001",
                "nameAr": "مهارات الاتصال",
                "nameEn": "Communication Skills",
                "creditHours": 2,
                "prerequisites": []
              }
            ],
            "3": [
              {
                "code": "BIOL101",
                "nameAr": "المصطلحات الطبية والأسس الحيوية",
                "nameEn": "Medical Terminology & Biology",
                "creditHours": 3,
                "prerequisites": []
              },
              {
                "code": "BIOL102",
                "nameAr": "علم التشريح وعلم وظائف الأعضاء (أناتومي)",
                "nameEn": "Anatomy & Physiology",
                "creditHours": 3,
                "prerequisites": []
              },
              {
                "code": "CS140",
                "nameAr": "مبادئ البرمجة وتطبيقات الحاسب",
                "nameEn": "Principles of Computer Programming",
                "creditHours": 3,
                "prerequisites": []
              },
              {
                "code": "HCI111",
                "nameAr": "مقدمة في المعلوماتية الصحية",
                "nameEn": "Introduction to Health Informatics",
                "creditHours": 3,
                "prerequisites": [
                  "BIOL101"
                ]
              },
              {
                "code": "HCI112",
                "nameAr": "نظم الرعاية الصحية والسياسات الطبية",
                "nameEn": "Healthcare Systems & Policies",
                "creditHours": 3,
                "prerequisites": []
              },
              {
                "code": "IT351",
                "nameAr": "نظم إدارة قواعد البيانات الصحية",
                "nameEn": "Health Database Management",
                "creditHours": 3,
                "prerequisites": [
                  "CS001"
                ]
              },
              {
                "code": "STAT101",
                "nameAr": "الإحصاء الحيوي الطبي",
                "nameEn": "Biostatistics",
                "creditHours": 3,
                "prerequisites": [
                  "MATH001"
                ]
              }
            ],
            "4": [
              {
                "code": "HCI213",
                "nameAr": "السجلات الصحية الإلكترونية (EHR)",
                "nameEn": "Electronic Health Records",
                "creditHours": 3,
                "prerequisites": [
                  "HCI111"
                ]
              },
              {
                "code": "HCI214",
                "nameAr": "التصنيف والترميز الطبي (ICD & CPT)",
                "nameEn": "Medical Coding & Classification",
                "creditHours": 3,
                "prerequisites": [
                  "BIOL102",
                  "HCI111"
                ]
              },
              {
                "code": "IT241",
                "nameAr": "شبكات وأمن المعلومات الصحية",
                "nameEn": "Health Information Networks & Security",
                "creditHours": 3,
                "prerequisites": [
                  "CS001"
                ]
              },
              {
                "code": "ENG103",
                "nameAr": "الكتابة التقنية والطبية",
                "nameEn": "Technical Medical Writing",
                "creditHours": 3,
                "prerequisites": [
                  "ENG002"
                ]
              }
            ],
            "5": [
              {
                "code": "HCI315",
                "nameAr": "معايير تبادل البيانات الصحية (HL7 & FHIR)",
                "nameEn": "Health Data Standards (HL7 & FHIR)",
                "creditHours": 3,
                "prerequisites": [
                  "HCI213"
                ]
              },
              {
                "code": "HCI316",
                "nameAr": "نظم دعم اتخاذ القرار السريري (CDSS)",
                "nameEn": "Clinical Decision Support Systems",
                "creditHours": 3,
                "prerequisites": [
                  "HCI213"
                ]
              },
              {
                "code": "HCI318",
                "nameAr": "تحليلات البيانات الصحية والوبائية",
                "nameEn": "Health Data Analytics",
                "creditHours": 3,
                "prerequisites": [
                  "STAT101",
                  "IT351"
                ]
              },
              {
                "code": "HCI320",
                "nameAr": "إدارة مشاريع تقنية الرعاية الصحية",
                "nameEn": "Health IT Project Management",
                "creditHours": 3,
                "prerequisites": [
                  "HCI111"
                ]
              }
            ],
            "6": [
              {
                "code": "HCI360",
                "nameAr": "الصحة الرقمية والطب الاتصالي (Telemedicine)",
                "nameEn": "Digital Health & Telemedicine",
                "creditHours": 3,
                "prerequisites": [
                  "HCI315"
                ]
              },
              {
                "code": "HCI362",
                "nameAr": "خصوصية وحوكمة البيانات الصحية (HIPAA)",
                "nameEn": "Health Data Privacy & Governance",
                "creditHours": 3,
                "prerequisites": [
                  "HCI213"
                ]
              },
              {
                "code": "HCI364",
                "nameAr": "الذكاء الاصطناعي في الطب والرعاية الصحية",
                "nameEn": "AI in Medicine & Healthcare",
                "creditHours": 3,
                "prerequisites": [
                  "HCI318"
                ]
              },
              {
                "code": "HCI366",
                "nameAr": "إدارة الجودة واعتماد المنشآت الصحية (CBAHI)",
                "nameEn": "Healthcare Quality & Accreditation",
                "creditHours": 3,
                "prerequisites": [
                  "HCI112"
                ]
              }
            ],
            "7": [
              {
                "code": "HCI470",
                "nameAr": "مشروع التخرج في المعلوماتية الصحية 1",
                "nameEn": "Health Informatics Capstone I",
                "creditHours": 3,
                "prerequisites": [
                  "HCI315",
                  "HCI318"
                ]
              },
              {
                "code": "HCI472",
                "nameAr": "المعلوماتية الصيدلانية والمخبرية",
                "nameEn": "Pharmacy & Laboratory Informatics",
                "creditHours": 3,
                "prerequisites": [
                  "HCI213"
                ]
              },
              {
                "code": "HCI475",
                "nameAr": "نظم أرشفة الصور الطبية والاتصالات (PACS)",
                "nameEn": "Medical Imaging & PACS Systems",
                "creditHours": 3,
                "prerequisites": [
                  "HCI315"
                ]
              },
              {
                "code": "HCI478",
                "nameAr": "أخلاقيات الممارسة الطبية والمعلوماتية",
                "nameEn": "Medical Informatics Ethics",
                "creditHours": 3,
                "prerequisites": [
                  "HCI362"
                ]
              }
            ],
            "8": [
              {
                "code": "HCI480",
                "nameAr": "مشروع التخرج في المعلوماتية الصحية 2",
                "nameEn": "Health Informatics Capstone II",
                "creditHours": 3,
                "prerequisites": [
                  "HCI470"
                ]
              },
              {
                "code": "HCI485",
                "nameAr": "التدريب السريري والميداني في المستشفيات",
                "nameEn": "Clinical Hospital Internship",
                "creditHours": 6,
                "prerequisites": [
                  "HCI470"
                ]
              },
              {
                "code": "HCI490",
                "nameAr": "ندوة متقدمة في مستقبل الصحة الرقمية",
                "nameEn": "Future of Digital Health Seminar",
                "creditHours": 2,
                "prerequisites": []
              }
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
              {
                "code": "ENG001",
                "nameAr": "اللغة الإنجليزية 1",
                "nameEn": "English Language I",
                "creditHours": 4,
                "prerequisites": []
              },
              {
                "code": "CS001",
                "nameAr": "مهارات الحاسب الآلي",
                "nameEn": "Computer Skills",
                "creditHours": 3,
                "prerequisites": []
              },
              {
                "code": "CI001",
                "nameAr": "المهارات الأكاديمية والتعلم الذاتي",
                "nameEn": "Academic Skills",
                "creditHours": 2,
                "prerequisites": []
              }
            ],
            "2": [
              {
                "code": "ENG002",
                "nameAr": "اللغة الإنجليزية 2",
                "nameEn": "English Language II",
                "creditHours": 4,
                "prerequisites": [
                  "ENG001"
                ]
              },
              {
                "code": "MATH001",
                "nameAr": "الرياضيات التحضيرية",
                "nameEn": "Preparatory Mathematics",
                "creditHours": 3,
                "prerequisites": []
              },
              {
                "code": "COMM001",
                "nameAr": "مهارات الاتصال",
                "nameEn": "Communication Skills",
                "creditHours": 2,
                "prerequisites": []
              }
            ],
            "3": [
              {
                "code": "BIOL101",
                "nameAr": "مقدمة في العلوم الحيوية والطبية",
                "nameEn": "Biological Sciences",
                "creditHours": 3,
                "prerequisites": []
              },
              {
                "code": "PH101",
                "nameAr": "مبادئ وأسس الصحة العامة",
                "nameEn": "Principles of Public Health",
                "creditHours": 3,
                "prerequisites": []
              },
              {
                "code": "BIOL102",
                "nameAr": "علم وظائف الأعضاء البشري",
                "nameEn": "Human Physiology",
                "creditHours": 3,
                "prerequisites": []
              },
              {
                "code": "PH201",
                "nameAr": "علم الأوبئة الأساسي (Epidemiology)",
                "nameEn": "Basic Epidemiology",
                "creditHours": 3,
                "prerequisites": [
                  "PH101"
                ]
              },
              {
                "code": "STAT101",
                "nameAr": "الإحصاء الحيوي في الصحة العامة",
                "nameEn": "Biostatistics for Public Health",
                "creditHours": 3,
                "prerequisites": [
                  "MATH001"
                ]
              },
              {
                "code": "PH210",
                "nameAr": "الصحة البيئية والمهنية",
                "nameEn": "Environmental & Occupational Health",
                "creditHours": 3,
                "prerequisites": [
                  "PH101"
                ]
              },
              {
                "code": "ENG103",
                "nameAr": "الكتابة التقنية والبحثية",
                "nameEn": "Technical Writing",
                "creditHours": 3,
                "prerequisites": [
                  "ENG002"
                ]
              }
            ],
            "4": [
              {
                "code": "PH220",
                "nameAr": "علم الأوبئة المتقدم والتحري الميداني",
                "nameEn": "Advanced Field Epidemiology",
                "creditHours": 3,
                "prerequisites": [
                  "PH201"
                ]
              },
              {
                "code": "PH230",
                "nameAr": "التثقيف والتعزيز الصحي",
                "nameEn": "Health Promotion & Education",
                "creditHours": 3,
                "prerequisites": [
                  "PH101"
                ]
              },
              {
                "code": "PH240",
                "nameAr": "التغذية وصحة المجتمع",
                "nameEn": "Community Nutrition & Health",
                "creditHours": 3,
                "prerequisites": [
                  "BIOL102"
                ]
              },
              {
                "code": "PH250",
                "nameAr": "صحة الأم والطفل والصحة الإنجابية",
                "nameEn": "Maternal & Child Health",
                "creditHours": 3,
                "prerequisites": [
                  "PH101"
                ]
              }
            ],
            "5": [
              {
                "code": "PH310",
                "nameAr": "إدارة واقتصاديات الرعاية الصحية",
                "nameEn": "Health Management & Economics",
                "creditHours": 3,
                "prerequisites": [
                  "PH101"
                ]
              },
              {
                "code": "PH320",
                "nameAr": "الأمراض السارية والمعدية ومكافحة الأوبئة",
                "nameEn": "Communicable Disease Control",
                "creditHours": 3,
                "prerequisites": [
                  "PH201"
                ]
              },
              {
                "code": "PH330",
                "nameAr": "الأمراض المزمنة غير السارية والوقاية منها",
                "nameEn": "Non-Communicable Diseases Prevention",
                "creditHours": 3,
                "prerequisites": [
                  "PH201"
                ]
              },
              {
                "code": "PH340",
                "nameAr": "طرق البحث المسحي في الصحة العامة",
                "nameEn": "Public Health Research Methods",
                "creditHours": 3,
                "prerequisites": [
                  "STAT101"
                ]
              }
            ],
            "6": [
              {
                "code": "PH360",
                "nameAr": "السياسات والتشريعات الصحية الوطنية",
                "nameEn": "Health Policy & Regulations",
                "creditHours": 3,
                "prerequisites": [
                  "PH310"
                ]
              },
              {
                "code": "PH370",
                "nameAr": "إدارة الأزمات والكوارث الصحية",
                "nameEn": "Health Emergency & Disaster Preparedness",
                "creditHours": 3,
                "prerequisites": [
                  "PH320"
                ]
              },
              {
                "code": "PH380",
                "nameAr": "الصحة العالمية وصحة المسافرين",
                "nameEn": "Global Health & Travel Medicine",
                "creditHours": 3,
                "prerequisites": [
                  "PH320"
                ]
              },
              {
                "code": "PH390",
                "nameAr": "السلوك الصحي والتغيير الاجتماعي",
                "nameEn": "Health Behavior & Social Change",
                "creditHours": 3,
                "prerequisites": [
                  "PH230"
                ]
              }
            ],
            "7": [
              {
                "code": "PH470",
                "nameAr": "مشروع التخرج في الصحة العامة 1",
                "nameEn": "Public Health Capstone I",
                "creditHours": 3,
                "prerequisites": [
                  "PH340",
                  "PH220"
                ]
              },
              {
                "code": "PH472",
                "nameAr": "التقييم الصحي والرصد الوبائي الذكي",
                "nameEn": "Health Surveillance & Digital Monitoring",
                "creditHours": 3,
                "prerequisites": [
                  "PH220"
                ]
              },
              {
                "code": "PH475",
                "nameAr": "برامج الصحة المدرسية واليافعين",
                "nameEn": "School & Adolescent Health Programs",
                "creditHours": 3,
                "prerequisites": [
                  "PH230"
                ]
              },
              {
                "code": "PH478",
                "nameAr": "أخلاقيات الصحة العامة والعدالة الصحية",
                "nameEn": "Public Health Ethics & Health Equity",
                "creditHours": 3,
                "prerequisites": [
                  "PH360"
                ]
              }
            ],
            "8": [
              {
                "code": "PH480",
                "nameAr": "مشروع التخرج في الصحة العامة 2",
                "nameEn": "Public Health Capstone II",
                "creditHours": 3,
                "prerequisites": [
                  "PH470"
                ]
              },
              {
                "code": "PH485",
                "nameAr": "التدريب الميداني في مراكز الرعاية وهيئة الصحة",
                "nameEn": "Public Health Field Internship",
                "creditHours": 6,
                "prerequisites": [
                  "PH470"
                ]
              },
              {
                "code": "PH490",
                "nameAr": "ندوة في الاتجاهات الحديثة للصحة العامة",
                "nameEn": "Modern Trends in Public Health Seminar",
                "creditHours": 2,
                "prerequisites": []
              }
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
              {
                "code": "ENG001",
                "nameAr": "اللغة الإنجليزية 1",
                "nameEn": "English Language I",
                "creditHours": 4,
                "prerequisites": []
              },
              {
                "code": "CS001",
                "nameAr": "مهارات الحاسب الآلي",
                "nameEn": "Computer Skills",
                "creditHours": 3,
                "prerequisites": []
              },
              {
                "code": "CI001",
                "nameAr": "المهارات الأكاديمية والتعلم الذاتي",
                "nameEn": "Academic Skills",
                "creditHours": 2,
                "prerequisites": []
              }
            ],
            "2": [
              {
                "code": "ENG002",
                "nameAr": "اللغة الإنجليزية 2",
                "nameEn": "English Language II",
                "creditHours": 4,
                "prerequisites": [
                  "ENG001"
                ]
              },
              {
                "code": "MATH001",
                "nameAr": "الرياضيات التحضيرية",
                "nameEn": "Preparatory Mathematics",
                "creditHours": 3,
                "prerequisites": []
              },
              {
                "code": "COMM001",
                "nameAr": "مهارات الاتصال",
                "nameEn": "Communication Skills",
                "creditHours": 2,
                "prerequisites": []
              }
            ],
            "3": [
              {
                "code": "LAW101",
                "nameAr": "المدخل لدراسة الأنظمة والقانون",
                "nameEn": "Introduction to Law",
                "creditHours": 3,
                "prerequisites": []
              },
              {
                "code": "LAW102",
                "nameAr": "القانون الدستوري والأنظمة السعودية",
                "nameEn": "Constitutional Law",
                "creditHours": 3,
                "prerequisites": []
              },
              {
                "code": "LAW103",
                "nameAr": "مصادر الالتزام (العقد والإرادة المنفردة)",
                "nameEn": "Sources of Obligations",
                "creditHours": 3,
                "prerequisites": []
              },
              {
                "code": "ISLM102",
                "nameAr": "أصول الفقه وقواعده",
                "nameEn": "Principles of Islamic Jurisprudence",
                "creditHours": 3,
                "prerequisites": []
              },
              {
                "code": "LAW201",
                "nameAr": "أحكام الالتزام والإثبات",
                "nameEn": "Rules of Obligations & Evidence",
                "creditHours": 3,
                "prerequisites": [
                  "LAW103"
                ]
              },
              {
                "code": "LAW202",
                "nameAr": "القانون الإداري وتطبيقاته",
                "nameEn": "Administrative Law",
                "creditHours": 3,
                "prerequisites": [
                  "LAW102"
                ]
              },
              {
                "code": "LAW203",
                "nameAr": "القانون الجنائي العام (النظرية العامة للجريمة)",
                "nameEn": "General Criminal Law",
                "creditHours": 3,
                "prerequisites": [
                  "LAW101"
                ]
              },
              {
                "code": "LAW204",
                "nameAr": "القانون الدولي العام",
                "nameEn": "Public International Law",
                "creditHours": 3,
                "prerequisites": [
                  "LAW102"
                ]
              }
            ],
            "4": [
              {
                "code": "LAW205",
                "nameAr": "القانون التجاري والشركات",
                "nameEn": "Commercial Law & Companies",
                "creditHours": 3,
                "prerequisites": [
                  "LAW201"
                ]
              },
              {
                "code": "LAW206",
                "nameAr": "القانون الجنائي الخاص (جرائم الأشخاص والأموال)",
                "nameEn": "Special Criminal Law",
                "creditHours": 3,
                "prerequisites": [
                  "LAW203"
                ]
              },
              {
                "code": "LAW207",
                "nameAr": "العقود المدنية المسماة (البيع والإيجار)",
                "nameEn": "Civil Contracts",
                "creditHours": 3,
                "prerequisites": [
                  "LAW201"
                ]
              },
              {
                "code": "LAW208",
                "nameAr": "القضاء الإداري وإجراءات ديوان المظالم",
                "nameEn": "Administrative Judiciary",
                "creditHours": 3,
                "prerequisites": [
                  "LAW202"
                ]
              }
            ],
            "5": [
              {
                "code": "LAW301",
                "nameAr": "نظام المرافعات الشرعية والمدنية",
                "nameEn": "Civil Procedures Law",
                "creditHours": 3,
                "prerequisites": [
                  "LAW201"
                ]
              },
              {
                "code": "LAW302",
                "nameAr": "الأوراق التجارية والعمليات المصرفية",
                "nameEn": "Commercial Papers & Banking Law",
                "creditHours": 3,
                "prerequisites": [
                  "LAW205"
                ]
              },
              {
                "code": "LAW303",
                "nameAr": "نظام العمل والتأمينات الاجتماعية",
                "nameEn": "Labor Law & Social Insurance",
                "creditHours": 3,
                "prerequisites": [
                  "LAW201"
                ]
              },
              {
                "code": "LAW304",
                "nameAr": "الحقوق العينية الأصلية والتبعية",
                "nameEn": "Real Property Rights",
                "creditHours": 3,
                "prerequisites": [
                  "LAW207"
                ]
              }
            ],
            "6": [
              {
                "code": "LAW305",
                "nameAr": "نظام الإجراءات الجزائية والتحقيق الجنائي",
                "nameEn": "Criminal Procedures Law",
                "creditHours": 3,
                "prerequisites": [
                  "LAW206"
                ]
              },
              {
                "code": "LAW306",
                "nameAr": "القانون الدولي الخاص (تنازع القوانين)",
                "nameEn": "Private International Law",
                "creditHours": 3,
                "prerequisites": [
                  "LAW204"
                ]
              },
              {
                "code": "LAW307",
                "nameAr": "التحكيم والوسائل البديلة لفض المنازعات",
                "nameEn": "Arbitration & Alternative Dispute Resolution",
                "creditHours": 3,
                "prerequisites": [
                  "LAW301"
                ]
              },
              {
                "code": "LAW308",
                "nameAr": "الملكية الفكرية وبراءات الاختراع",
                "nameEn": "Intellectual Property Law",
                "creditHours": 3,
                "prerequisites": [
                  "LAW205"
                ]
              }
            ],
            "7": [
              {
                "code": "LAW470",
                "nameAr": "مشروع التخرج في القانون والبحث القانوني 1",
                "nameEn": "Legal Research & Capstone I",
                "creditHours": 3,
                "prerequisites": [
                  "LAW301",
                  "LAW305"
                ]
              },
              {
                "code": "LAW472",
                "nameAr": "الصياغة القانونية والعقود باللغة الإنجليزية",
                "nameEn": "Legal Drafting in English",
                "creditHours": 3,
                "prerequisites": [
                  "LAW207",
                  "ENG002"
                ]
              },
              {
                "code": "LAW475",
                "nameAr": "نظام التنفيذ وإجراءات الحجز القضائي",
                "nameEn": "Enforcement Law",
                "creditHours": 3,
                "prerequisites": [
                  "LAW301"
                ]
              },
              {
                "code": "LAW478",
                "nameAr": "المحكمة الصورية والترافع العملي",
                "nameEn": "Moot Court & Clinical Advocacy",
                "creditHours": 3,
                "prerequisites": [
                  "LAW301",
                  "LAW305"
                ]
              }
            ],
            "8": [
              {
                "code": "LAW480",
                "nameAr": "مشروع التخرج في القانون 2",
                "nameEn": "Legal Capstone II",
                "creditHours": 3,
                "prerequisites": [
                  "LAW470"
                ]
              },
              {
                "code": "LAW485",
                "nameAr": "التدريب الميداني والتعاوني في المحاماة والشركات",
                "nameEn": "Cooperative Legal Internship",
                "creditHours": 6,
                "prerequisites": [
                  "LAW470"
                ]
              },
              {
                "code": "LAW490",
                "nameAr": "أخلاقيات مهنة المحاماة ومسؤولية القانوني",
                "nameEn": "Legal Professional Ethics",
                "creditHours": 2,
                "prerequisites": []
              }
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
              {
                "code": "ENG001",
                "nameAr": "اللغة الإنجليزية 1",
                "nameEn": "English Language I",
                "creditHours": 4,
                "prerequisites": []
              },
              {
                "code": "CS001",
                "nameAr": "مهارات الحاسب الآلي",
                "nameEn": "Computer Skills",
                "creditHours": 3,
                "prerequisites": []
              },
              {
                "code": "CI001",
                "nameAr": "المهارات الأكاديمية والتعلم الذاتي",
                "nameEn": "Academic Skills",
                "creditHours": 2,
                "prerequisites": []
              }
            ],
            "2": [
              {
                "code": "ENG002",
                "nameAr": "اللغة الإنجليزية 2",
                "nameEn": "English Language II",
                "creditHours": 4,
                "prerequisites": [
                  "ENG001"
                ]
              },
              {
                "code": "MATH001",
                "nameAr": "الرياضيات التحضيرية",
                "nameEn": "Preparatory Mathematics",
                "creditHours": 3,
                "prerequisites": []
              },
              {
                "code": "COMM001",
                "nameAr": "مهارات الاتصال",
                "nameEn": "Communication Skills",
                "creditHours": 2,
                "prerequisites": []
              }
            ],
            "3": [
              {
                "code": "MED101",
                "nameAr": "مدخل إلى الاتصال والإعلام الرقمي",
                "nameEn": "Introduction to Digital Media",
                "creditHours": 3,
                "prerequisites": []
              },
              {
                "code": "MED102",
                "nameAr": "الكتابة والتحرير لوسائل الإعلام الرقمي",
                "nameEn": "Digital Media Writing & Editing",
                "creditHours": 3,
                "prerequisites": []
              },
              {
                "code": "MED103",
                "nameAr": "التصوير الرقمي والأسس البصرية",
                "nameEn": "Digital Photography & Visual Basics",
                "creditHours": 3,
                "prerequisites": []
              },
              {
                "code": "MED201",
                "nameAr": "تصميم الجرافيك والإنفوجرافيك للمحتوى",
                "nameEn": "Graphic & Infographic Design",
                "creditHours": 3,
                "prerequisites": [
                  "MED103"
                ]
              },
              {
                "code": "MED202",
                "nameAr": "صحافة البيانات والصحافة الاستقصائية الرقمية",
                "nameEn": "Data Journalism",
                "creditHours": 3,
                "prerequisites": [
                  "MED102",
                  "MATH001"
                ]
              },
              {
                "code": "MED203",
                "nameAr": "نظريات الاتصال الجماهيري والإعلام الجديد",
                "nameEn": "Mass Communication Theories",
                "creditHours": 3,
                "prerequisites": [
                  "MED101"
                ]
              },
              {
                "code": "MED204",
                "nameAr": "صناعة البودكاست والمحتوى الصوتي الرقمي",
                "nameEn": "Digital Audio & Podcasting Production",
                "creditHours": 3,
                "prerequisites": [
                  "MED101"
                ]
              }
            ],
            "4": [
              {
                "code": "MED205",
                "nameAr": "إنتاج الفيديو الرقمي والمونتاج والمؤثرات",
                "nameEn": "Digital Video Production & Editing",
                "creditHours": 3,
                "prerequisites": [
                  "MED103"
                ]
              },
              {
                "code": "MED206",
                "nameAr": "إدارة منصات التواصل الاجتماعي والتفاعل الرقمي",
                "nameEn": "Social Media Platforms Management",
                "creditHours": 3,
                "prerequisites": [
                  "MED101"
                ]
              },
              {
                "code": "MED207",
                "nameAr": "السرد القصصي الرقمي (Digital Storytelling)",
                "nameEn": "Digital Storytelling",
                "creditHours": 3,
                "prerequisites": [
                  "MED102"
                ]
              },
              {
                "code": "MED208",
                "nameAr": "أخلاقيات وتشريعات النشر الإلكتروني",
                "nameEn": "Media Ethics & Digital Laws",
                "creditHours": 3,
                "prerequisites": []
              }
            ],
            "5": [
              {
                "code": "MED301",
                "nameAr": "استراتيجيات وصناعة المحتوى الإبداعي",
                "nameEn": "Content Strategy & Creation",
                "creditHours": 3,
                "prerequisites": [
                  "MED206",
                  "MED207"
                ]
              },
              {
                "code": "MED302",
                "nameAr": "تحليلات الجمهور وقياس الأثر الرقمي",
                "nameEn": "Audience Analytics & Digital Metrics",
                "creditHours": 3,
                "prerequisites": [
                  "MED206"
                ]
              },
              {
                "code": "MED303",
                "nameAr": "العلاقات العامة الرقمية وإدارة السمعة",
                "nameEn": "Digital Public Relations & Reputation",
                "creditHours": 3,
                "prerequisites": [
                  "MED101"
                ]
              },
              {
                "code": "MED304",
                "nameAr": "الصحافة المتنقلة وصناعة المحتوى بالهاتف (MoJo)",
                "nameEn": "Mobile Journalism (MoJo)",
                "creditHours": 3,
                "prerequisites": [
                  "MED205"
                ]
              }
            ],
            "6": [
              {
                "code": "MED305",
                "nameAr": "الإعلام التفاعلي والواقع الافتراضي والمعزز (VR/AR)",
                "nameEn": "Interactive Media & Immersive VR/AR",
                "creditHours": 3,
                "prerequisites": [
                  "MED201",
                  "MED205"
                ]
              },
              {
                "code": "MED306",
                "nameAr": "إدارة الحملات الرقمية والإعلانات الموجهة",
                "nameEn": "Digital Campaigns Management",
                "creditHours": 3,
                "prerequisites": [
                  "MED301"
                ]
              },
              {
                "code": "MED307",
                "nameAr": "صناعة الأفلام الوثائقية الرقمية القصيرة",
                "nameEn": "Short Digital Documentary Production",
                "creditHours": 3,
                "prerequisites": [
                  "MED205"
                ]
              },
              {
                "code": "MED308",
                "nameAr": "الذكاء الاصطناعي في إنتاج المحتوى الإعلامي",
                "nameEn": "AI in Media Content Creation",
                "creditHours": 3,
                "prerequisites": [
                  "MED301"
                ]
              }
            ],
            "7": [
              {
                "code": "MED470",
                "nameAr": "مشروع التخرج في الإعلام الرقمي 1",
                "nameEn": "Digital Media Capstone I",
                "creditHours": 3,
                "prerequisites": [
                  "MED301",
                  "MED302"
                ]
              },
              {
                "code": "MED472",
                "nameAr": "إدارة المؤسسات وغرف الأخبار الرقمية",
                "nameEn": "Digital Newsroom Management",
                "creditHours": 3,
                "prerequisites": [
                  "MED301"
                ]
              },
              {
                "code": "MED475",
                "nameAr": "ريادة الأعمال الإعلامية وإطلاق المنصات",
                "nameEn": "Media Entrepreneurship",
                "creditHours": 3,
                "prerequisites": [
                  "MED306"
                ]
              },
              {
                "code": "MED478",
                "nameAr": "إدارة الأزمات والاتصال الرقمي الحكومي",
                "nameEn": "Digital Crisis Communication",
                "creditHours": 3,
                "prerequisites": [
                  "MED303"
                ]
              }
            ],
            "8": [
              {
                "code": "MED480",
                "nameAr": "مشروع التخرج في الإعلام الرقمي 2",
                "nameEn": "Digital Media Capstone II",
                "creditHours": 3,
                "prerequisites": [
                  "MED470"
                ]
              },
              {
                "code": "MED485",
                "nameAr": "التدريب الميداني والتعاوني في المؤسسات الإعلامية",
                "nameEn": "Cooperative Media Internship",
                "creditHours": 6,
                "prerequisites": [
                  "MED470"
                ]
              },
              {
                "code": "MED490",
                "nameAr": "ندوة متقدمة في الاتجاهات المستقبلية للإعلام",
                "nameEn": "Future of Media Seminar",
                "creditHours": 2,
                "prerequisites": []
              }
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
              {
                "code": "ENG001",
                "nameAr": "اللغة الإنجليزية 1",
                "nameEn": "English Language I",
                "creditHours": 4,
                "prerequisites": []
              },
              {
                "code": "CS001",
                "nameAr": "مهارات الحاسب الآلي",
                "nameEn": "Computer Skills",
                "creditHours": 3,
                "prerequisites": []
              },
              {
                "code": "CI001",
                "nameAr": "المهارات الأكاديمية والتعلم الذاتي",
                "nameEn": "Academic Skills",
                "creditHours": 2,
                "prerequisites": []
              }
            ],
            "2": [
              {
                "code": "ENG002",
                "nameAr": "اللغة الإنجليزية 2",
                "nameEn": "English Language II",
                "creditHours": 4,
                "prerequisites": [
                  "ENG001"
                ]
              },
              {
                "code": "MATH001",
                "nameAr": "الرياضيات التحضيرية",
                "nameEn": "Preparatory Mathematics",
                "creditHours": 3,
                "prerequisites": []
              },
              {
                "code": "COMM001",
                "nameAr": "مهارات الاتصال",
                "nameEn": "Communication Skills",
                "creditHours": 2,
                "prerequisites": []
              }
            ],
            "3": [
              {
                "code": "ENG110",
                "nameAr": "مهارات الاستماع والمحادثة المتقدمة",
                "nameEn": "Listening and Speaking Skills",
                "creditHours": 3,
                "prerequisites": []
              },
              {
                "code": "ENG112",
                "nameAr": "القراءة والاستيعاب وبناء المفردات",
                "nameEn": "Reading Comprehension & Vocabulary",
                "creditHours": 3,
                "prerequisites": []
              },
              {
                "code": "ENG114",
                "nameAr": "قواعد اللغة الإنجليزية وتراكيبها",
                "nameEn": "English Grammar & Sentence Structure",
                "creditHours": 3,
                "prerequisites": []
              },
              {
                "code": "ARAB101",
                "nameAr": "مهارات الكتابة والتعبير باللغة العربية",
                "nameEn": "Arabic Language Skills & Writing",
                "creditHours": 3,
                "prerequisites": []
              },
              {
                "code": "ENG120",
                "nameAr": "الكتابة الأكاديمية والمقال التحليلي",
                "nameEn": "Academic Writing & Essay",
                "creditHours": 3,
                "prerequisites": []
              },
              {
                "code": "ENG122",
                "nameAr": "علم الصوتيات والنطق الإنجليزي (Phonetics)",
                "nameEn": "English Phonetics & Phonology",
                "creditHours": 3,
                "prerequisites": []
              },
              {
                "code": "TRN101",
                "nameAr": "مدخل إلى دراسات الترجمة ونظرياتها",
                "nameEn": "Introduction to Translation Studies",
                "creditHours": 3,
                "prerequisites": []
              },
              {
                "code": "TRN201",
                "nameAr": "الترجمة العامة (من الإنجليزية إلى العربية)",
                "nameEn": "General Translation (En-Ar)",
                "creditHours": 3,
                "prerequisites": [
                  "TRN101"
                ]
              },
              {
                "code": "TRN202",
                "nameAr": "الترجمة العامة (من العربية إلى الإنجليزية)",
                "nameEn": "General Translation (Ar-En)",
                "creditHours": 3,
                "prerequisites": [
                  "TRN101"
                ]
              },
              {
                "code": "ENG210",
                "nameAr": "علم الصرف وبنية الكلمة (Morphology)",
                "nameEn": "English Morphology & Syntax",
                "creditHours": 3,
                "prerequisites": [
                  "ENG114"
                ]
              },
              {
                "code": "ARAB201",
                "nameAr": "علم الدلالة والأسلوب في العربية",
                "nameEn": "Arabic Semantics and Stylistics",
                "creditHours": 3,
                "prerequisites": [
                  "ARAB101"
                ]
              }
            ],
            "4": [
              {
                "code": "TRN210",
                "nameAr": "الترجمة القانونية والوثائق الرسمية",
                "nameEn": "Legal Translation & Official Documents",
                "creditHours": 3,
                "prerequisites": [
                  "TRN201"
                ]
              },
              {
                "code": "TRN220",
                "nameAr": "الترجمة الاقتصادية والتجارية والمالية",
                "nameEn": "Economic & Business Translation",
                "creditHours": 3,
                "prerequisites": [
                  "TRN201"
                ]
              },
              {
                "code": "ENG230",
                "nameAr": "علم المعنى والبراغماتية (Semantics & Pragmatics)",
                "nameEn": "Semantics & Pragmatics",
                "creditHours": 3,
                "prerequisites": [
                  "ENG210"
                ]
              },
              {
                "code": "TRN240",
                "nameAr": "المعاجم وصناعة القواميس وإدارة المصطلحات",
                "nameEn": "Lexicography & Terminology Management",
                "creditHours": 3,
                "prerequisites": [
                  "TRN101"
                ]
              }
            ],
            "5": [
              {
                "code": "TRN310",
                "nameAr": "الترجمة العلمية والتقنية والطبية",
                "nameEn": "Scientific, Technical & Medical Translation",
                "creditHours": 3,
                "prerequisites": [
                  "TRN201"
                ]
              },
              {
                "code": "TRN320",
                "nameAr": "الترجمة بمساعدة الحاسوب وبرمجيات (CAT Tools)",
                "nameEn": "Computer-Assisted Translation (CAT Tools)",
                "creditHours": 3,
                "prerequisites": [
                  "TRN201"
                ]
              },
              {
                "code": "TRN330",
                "nameAr": "الترجمة الصحفية والإعلامية والسياسية",
                "nameEn": "Media, Journalistic & Political Translation",
                "creditHours": 3,
                "prerequisites": [
                  "TRN202"
                ]
              },
              {
                "code": "ENG310",
                "nameAr": "اللغويات التطبيقية واكتساب اللغات",
                "nameEn": "Applied Linguistics",
                "creditHours": 3,
                "prerequisites": [
                  "ENG210"
                ]
              }
            ],
            "6": [
              {
                "code": "TRN350",
                "nameAr": "الترجمة التتبعية والفورية الأساسية",
                "nameEn": "Consecutive & Sight Translation",
                "creditHours": 3,
                "prerequisites": [
                  "TRN201",
                  "ENG110"
                ]
              },
              {
                "code": "TRN360",
                "nameAr": "تعريب وترجمة البرمجيات وتطبيقات الويب (Localization)",
                "nameEn": "Software & Web Localization",
                "creditHours": 3,
                "prerequisites": [
                  "TRN320"
                ]
              },
              {
                "code": "TRN370",
                "nameAr": "ترجمة الوسائط السمعية والمرئية والدبلجة (Subtitling)",
                "nameEn": "Audiovisual Translation & Subtitling",
                "creditHours": 3,
                "prerequisites": [
                  "TRN320"
                ]
              },
              {
                "code": "TRN380",
                "nameAr": "الترجمة الأدبية ونقد الترجمات",
                "nameEn": "Literary Translation & Criticism",
                "creditHours": 3,
                "prerequisites": [
                  "TRN201"
                ]
              }
            ],
            "7": [
              {
                "code": "TRN470",
                "nameAr": "مشروع التخرج في الترجمة 1",
                "nameEn": "Translation Capstone Project I",
                "creditHours": 3,
                "prerequisites": [
                  "TRN310",
                  "TRN320"
                ]
              },
              {
                "code": "TRN472",
                "nameAr": "الترجمة الفورية المتقدمة والمؤتمرات",
                "nameEn": "Simultaneous Conference Interpreting",
                "creditHours": 3,
                "prerequisites": [
                  "TRN350"
                ]
              },
              {
                "code": "TRN475",
                "nameAr": "الترجمة الآلية العصبية ومرحلة ما بعد التحرير (MT & PEMT)",
                "nameEn": "Machine Translation & Post-Editing (PEMT)",
                "creditHours": 3,
                "prerequisites": [
                  "TRN320"
                ]
              },
              {
                "code": "TRN478",
                "nameAr": "أخلاقيات مهنة المترجم وقوانين الملكية",
                "nameEn": "Translator Ethics & Professional Standards",
                "creditHours": 3,
                "prerequisites": [
                  "TRN101"
                ]
              }
            ],
            "8": [
              {
                "code": "TRN480",
                "nameAr": "مشروع التخرج في الترجمة 2",
                "nameEn": "Translation Capstone Project II",
                "creditHours": 3,
                "prerequisites": [
                  "TRN470"
                ]
              },
              {
                "code": "TRN485",
                "nameAr": "التدريب الميداني والتعاوني في دور الترجمة والسفارات",
                "nameEn": "Cooperative Translation Internship",
                "creditHours": 6,
                "prerequisites": [
                  "TRN470"
                ]
              },
              {
                "code": "TRN490",
                "nameAr": "ندوة متقدمة في الذكاء الاصطناعي ومستقبل الترجمة",
                "nameEn": "AI and Future of Translation Seminar",
                "creditHours": 2,
                "prerequisites": []
              }
            ]
          }
        },
        "stat": {
          "majorId": "stat",
          "nameAr": "الإحصاء التطبيقي وتحليل البيانات",
          "nameEn": "Applied Statistics and Data Analytics",
          "totalCredits": 130,
          "levels": {
            "1": [
              {
                "code": "ENG001",
                "nameAr": "اللغة الإنجليزية 1",
                "nameEn": "English Language I",
                "creditHours": 4,
                "prerequisites": []
              },
              {
                "code": "CS001",
                "nameAr": "مهارات الحاسب الآلي",
                "nameEn": "Computer Skills",
                "creditHours": 3,
                "prerequisites": []
              },
              {
                "code": "CI001",
                "nameAr": "المهارات الأكاديمية والتعلم الذاتي",
                "nameEn": "Academic Skills",
                "creditHours": 2,
                "prerequisites": []
              }
            ],
            "2": [
              {
                "code": "ENG002",
                "nameAr": "اللغة الإنجليزية 2",
                "nameEn": "English Language II",
                "creditHours": 4,
                "prerequisites": [
                  "ENG001"
                ]
              },
              {
                "code": "MATH001",
                "nameAr": "الرياضيات التحضيرية",
                "nameEn": "Preparatory Mathematics",
                "creditHours": 3,
                "prerequisites": []
              },
              {
                "code": "COMM001",
                "nameAr": "مهارات الاتصال",
                "nameEn": "Communication Skills",
                "creditHours": 2,
                "prerequisites": []
              }
            ],
            "3": [
              {
                "code": "STAT100",
                "nameAr": "مدخل إلى الإحصاء التطبيقي وعلم البيانات",
                "nameEn": "Introduction to Applied Statistics",
                "creditHours": 3,
                "prerequisites": []
              },
              {
                "code": "STAT110",
                "nameAr": "البرمجة الإحصائية بلغة R",
                "nameEn": "Statistical Computing in R",
                "creditHours": 3,
                "prerequisites": []
              },
              {
                "code": "STAT201",
                "nameAr": "نظرية الاحتمالات الرياضية",
                "nameEn": "Mathematical Probability Theory",
                "creditHours": 3,
                "prerequisites": [
                  "MATH001"
                ]
              },
              {
                "code": "STAT203",
                "nameAr": "تحليل الانحدار الخطي والتطبيقي",
                "nameEn": "Applied Linear Regression",
                "creditHours": 3,
                "prerequisites": [
                  "STAT110"
                ]
              },
              {
                "code": "MATH201",
                "nameAr": "الجبر الخطي وتحليل المصفوفات",
                "nameEn": "Linear Algebra & Matrices",
                "creditHours": 3,
                "prerequisites": [
                  "MATH001"
                ]
              },
              {
                "code": "STAT208",
                "nameAr": "البرمجة بلغة Python لمعالجة البيانات",
                "nameEn": "Python for Data Management",
                "creditHours": 3,
                "prerequisites": [
                  "STAT110"
                ]
              }
            ],
            "4": [
              {
                "code": "STAT215",
                "nameAr": "الاستدلال الإحصائي واختبار الفروض",
                "nameEn": "Statistical Inference & Hypothesis Testing",
                "creditHours": 3,
                "prerequisites": [
                  "STAT201"
                ]
              },
              {
                "code": "STAT220",
                "nameAr": "تصميم التجارب وتحليل التباين (ANOVA)",
                "nameEn": "Design of Experiments & ANOVA",
                "creditHours": 3,
                "prerequisites": [
                  "STAT203"
                ]
              },
              {
                "code": "IT351",
                "nameAr": "قواعد البيانات وإدارة مستودعات البيانات (SQL)",
                "nameEn": "Databases & SQL for Analysts",
                "creditHours": 3,
                "prerequisites": [
                  "STAT208"
                ]
              },
              {
                "code": "ENG103",
                "nameAr": "الكتابة التقنية والتقارير الإحصائية",
                "nameEn": "Technical Writing for Statistics",
                "creditHours": 3,
                "prerequisites": [
                  "ENG002"
                ]
              }
            ],
            "5": [
              {
                "code": "STAT310",
                "nameAr": "تحليل السلاسل الزمنية والتنبؤ الإحصائي",
                "nameEn": "Time Series Analysis & Forecasting",
                "creditHours": 3,
                "prerequisites": [
                  "STAT203",
                  "STAT215"
                ]
              },
              {
                "code": "STAT320",
                "nameAr": "نظرية العينات وتصميم المسوح الميدانية",
                "nameEn": "Sampling Theory & Survey Design",
                "creditHours": 3,
                "prerequisites": [
                  "STAT215"
                ]
              },
              {
                "code": "STAT330",
                "nameAr": "التحليل الإحصائي متعدد المتغيرات (Multivariate)",
                "nameEn": "Multivariate Statistical Analysis",
                "creditHours": 3,
                "prerequisites": [
                  "MATH201",
                  "STAT203"
                ]
              },
              {
                "code": "STAT340",
                "nameAr": "حوكمة وجودة وتنظيف البيانات الضخمة",
                "nameEn": "Data Quality, Cleaning & Governance",
                "creditHours": 3,
                "prerequisites": [
                  "IT351"
                ]
              }
            ],
            "6": [
              {
                "code": "STAT360",
                "nameAr": "التعلم الإحصائي ونمذجة الآلة",
                "nameEn": "Statistical Machine Learning",
                "creditHours": 3,
                "prerequisites": [
                  "STAT330",
                  "STAT208"
                ]
              },
              {
                "code": "STAT370",
                "nameAr": "الإحصاء الحيوي وتحليل البقاء (Survival Analysis)",
                "nameEn": "Biostatistics & Survival Analysis",
                "creditHours": 3,
                "prerequisites": [
                  "STAT215"
                ]
              },
              {
                "code": "STAT380",
                "nameAr": "تحليلات البيانات الكبيرة ومنظومات الحوسبة الموزعة",
                "nameEn": "Big Data Analytics Systems",
                "creditHours": 3,
                "prerequisites": [
                  "IT351",
                  "STAT208"
                ]
              },
              {
                "code": "STAT390",
                "nameAr": "تصوير البيانات المتقدم ولوحات القيادة (Tableau/PowerBI)",
                "nameEn": "Advanced Data Visualization & Dashboards",
                "creditHours": 3,
                "prerequisites": [
                  "STAT110"
                ]
              }
            ],
            "7": [
              {
                "code": "STAT470",
                "nameAr": "مشروع التخرج في الإحصاء وتحليل البيانات 1",
                "nameEn": "Applied Statistics Capstone I",
                "creditHours": 3,
                "prerequisites": [
                  "STAT310",
                  "STAT360"
                ]
              },
              {
                "code": "STAT472",
                "nameAr": "التحليلات التنبؤية واتخاذ القرار المعتمد على البيانات",
                "nameEn": "Predictive Analytics & Decision Making",
                "creditHours": 3,
                "prerequisites": [
                  "STAT360"
                ]
              },
              {
                "code": "STAT475",
                "nameAr": "الإحصاء البايزي والنمذجة العشوائية (Bayesian)",
                "nameEn": "Bayesian Statistics & Stochastic Models",
                "creditHours": 3,
                "prerequisites": [
                  "STAT201"
                ]
              },
              {
                "code": "STAT478",
                "nameAr": "أخلاقيات البيانات والخصوصية الرقمية وحماية الملكية",
                "nameEn": "Data Ethics & Privacy Regulations",
                "creditHours": 3,
                "prerequisites": [
                  "STAT340"
                ]
              }
            ],
            "8": [
              {
                "code": "STAT480",
                "nameAr": "مشروع التخرج في الإحصاء وتحليل البيانات 2",
                "nameEn": "Applied Statistics Capstone II",
                "creditHours": 3,
                "prerequisites": [
                  "STAT470"
                ]
              },
              {
                "code": "STAT485",
                "nameAr": "التدريب التعاوني والميداني في مراكز الإحصاء والبيانات",
                "nameEn": "Cooperative Statistics Internship",
                "creditHours": 6,
                "prerequisites": [
                  "STAT470"
                ]
              },
              {
                "code": "STAT490",
                "nameAr": "ندوة متقدمة في أحدث اتجاهات علم البيانات والإحصاء",
                "nameEn": "Seminar in Advanced Data Science & Statistics",
                "creditHours": 2,
                "prerequisites": []
              }
            ]
          }
        }
      }
    }
  }
};
