const MODULE_LINE_PATTERN = /^\s*(?:#{1,6}\s+)?\*?\*?Module\s+(\d+)\b(?:\s*(\([^)]{1,40}\)))?(?:\s*[:\u2013\u2014.-]\s*(.+?))?\s*\*?\*?\s*$/i;
const MARKDOWN_HEADING = /^\s*(#{1,6})\s+(.+?)\s*$/;
const UNICODE_BULLETS = '\u2022\u2023\u25AA\u25AB\u25E6\u25CF\u25CB\u25A0\u25A1\u27A2\u27A3\u27A4\uF0B7\uF0A7\uF0D8\uF076\uF0FC';
const BULLET_PATTERN = new RegExp(`^\\s*(?:[-*+]\\s+|[${UNICODE_BULLETS}]\\s*)(.+)$`);
const NUMBERED_PATTERN = /^\s*\d+(?:\.\d+)*[.)]\s+(.+)$/;
const PARENTHETICAL_PART_PATTERN = /^(?:\(([^)]{1,40})\)|(Part\s+[I1-9VXLCDM]+(?:\s*[:.-]\s*.+)?))$/i;
const TRAILING_PART_PATTERN = /^(.+?)\s+(\((?:Part|Section)\s+[^)]{1,30}\))$/i;
const DANGLING_LINE_END = /(?:\b(?:of|and|or|to|in|for|with|by|on|at|from|as|that|which|the|a|an|is|are|was|were|be|been|into|between|through|during|before|after|above|below|such|including|within|without|via|\d+(?:st|nd|rd|th))\s*|[,;:،؛"“'(\-–—]\s*)$/i;

const METADATA_SECTION_HEADERS = /^(?:weekly\s+learning\s+outcomes?|learning\s+outcomes?|module\s+learning\s+outcomes?|course\s+learning\s+outcomes?|topics?\s+to\s+cover|required\s+readings?|recommended\s+readings?|optional\s+readings?|further\s+readings?|references?|bibliography)$/i;

const KNOWN_SECTION_HEADERS = /^(?:weekly\s+learning\s+outcomes?|learning\s+outcomes?|module\s+learning\s+outcomes?|course\s+learning\s+outcomes?|topics?\s+to\s+cover|required\s+readings?|recommended\s+readings?|optional\s+readings?|further\s+readings?|objectives|course\s+objectives|module\s+objectives|outline|agenda|introduction|overview|summary|conclusion|key\s+takeaways|references?|bibliography|review\s+questions|discussion\s+questions|self[- ]assessment|activity|activities|exercises?|case\s+study|practical\s+examples?)$/i;

const CITATION_ARTIFACT_PATTERN = /(?:\b(?:\d+(?:st|nd|rd|th)\s+edition|edition\b|ed\.\b|wiley|pearson|springer|mcgraw[- ]?hill|elsevier|prentice\s+hall|o'reilly|addison[- ]?wesley|cambridge\s+university\s+press|oxford\s+university\s+press|mit\s+press|academic\s+press|crc\s+press|apress|syngress|packt|isbn\b|pp\.\s*\d|vol\.\s*\d|et\s+al\.)|\(\s*(?:19|20)\d{2}[a-z]?\s*\))/i;

const BANNER_LINES = new Set([
    'college of computing and informatics',
    'bachelor of data science',
    'bachelor of science in computer science',
    'bachelor of science in information technology',
    'ds470: data security and privacy',
    'ds 470: data security and privacy',
    'data security and privacy',
    'saudi electronic university',
    'thank you',
    'thank you!',
    'questions?',
    'any questions?'
]);

function cleanTitle(value) {
    return String(value || '')
        .replace(/[*_`~]/g, '')
        .replace(/\s+/g, ' ')
        .trim();
}

function stripTrailingColon(value) {
    return cleanTitle(value).replace(/\s*[:：]\s*$/, '').trim();
}

export function isMetadataSectionTitle(title) {
    return METADATA_SECTION_HEADERS.test(stripTrailingColon(title));
}

export function detectDirection(text) {
    const sample = String(text || '');
    const latinCount = (sample.match(/[A-Za-z]/g) || []).length;
    const arabicCount = (sample.match(/[\u0600-\u06FF]/g) || []).length;
    if (latinCount === 0 && arabicCount === 0) return 'auto';
    return latinCount >= arabicCount ? 'ltr' : 'rtl';
}

export function detectLanguage(text) {
    const sample = String(text || '');
    const latinCount = (sample.match(/[A-Za-z]/g) || []).length;
    const arabicCount = (sample.match(/[\u0600-\u06FF]/g) || []).length;
    return latinCount >= arabicCount ? 'en' : 'ar';
}

export function isNoise(line) {
    const value = cleanTitle(line);
    if (!value) return false;
    const lower = value.toLowerCase().replace(/[.!]+$/, '').trim();
    return BANNER_LINES.has(lower)
        || /^ds\s*470\s*[:\u2013\u2014-]\s*data\s+security\s+and\s+privacy$/i.test(value)
        || /^restricted\s*[-–—]?\s*\u0645\u0642\u064a\u062f$/i.test(value)
        || /^\u0645\u0642\u064a\u062f\s*[-–—]?\s*restricted$/i.test(value)
        || /^(?:\u0627\u0644\u062c\u0627\u0645\u0639\u0629\s*\u0627\u0644\u0633\u0639\u0648\u062f\u064a\u0629.*|\u0627\u0644\u062c\u0627\u0645\u0639\u0629\u0627\u0644\u0633\u0639\u0648\u062f\u064a\u0629.*|\u0627+\u0644+\u0643+\u062a+.*|\u0627\u0644\u0625\u0644\u0643\u062a\u0631\u0648\u0646\u064a\u0629|\u0627\u0644\u0627\u0644\u0643\u062a\u0631\u0648\u0646\u064a\u0629|\u0648\u0646\u064a\u0629|\u0631)$/i.test(value)
        || /^\d{1,4}\s*[/-]\s*\d{1,2}\s*[/-]\s*\d{1,4}$/.test(value);
}

function isCodeLike(lines) {
    const nonEmpty = lines.map(l => l.trim()).filter(Boolean);
    if (nonEmpty.length < 2) return false;
    return nonEmpty.some(line => (
        /[{};]|^\s*(?:def |class |function |const |let |var |import |from |return |if\s*\(|for\s*\(|while\s*\(|SELECT\s+|INSERT\s+|UPDATE\s+|CREATE\s+|sudo\s+|chmod\s+|chown\s+|#include)/i.test(line)
        || /=>|===|!==|\bconsole\.|\bprint\(|\bSystem\.out/.test(line)
    ));
}

export function cleanSource(markdown) {
    const raw = String(markdown || '').replace(/\r\n/g, '\n').replace(/\r/g, '\n').split('\n');
    const output = [];

    for (let index = 0; index < raw.length; index += 1) {
        const line = raw[index];

        // Strip single-line triple-backtick wrappers: ```Some normal sentence```
        const inlineFence = /^\s*```+([^`]+?)```+\s*$/.exec(line);
        if (inlineFence) {
            const unwrapped = inlineFence[1].trim();
            if (unwrapped && !isNoise(unwrapped)) {
                output.push(unwrapped);
            }
            continue;
        }

        // Handle multi-line fence blocks: preserve real multi-line code blocks, unwrap falsely fenced slide text
        const fenceStart = /^\s*```(\S*)\s*$/.exec(line);
        if (fenceStart) {
            const lang = fenceStart[1].trim();
            const block = [];
            let cursor = index + 1;
            while (cursor < raw.length && !/^\s*```\s*$/.test(raw[cursor])) {
                block.push(raw[cursor]);
                cursor += 1;
            }
            if (cursor < raw.length) {
                const hasExplicitCodeLang = /^(?:js|javascript|ts|typescript|py|python|java|c|cpp|csharp|cs|sql|bash|sh|shell|json|xml|html|css|php|ruby|go|rust)$/i.test(lang);
                if (!hasExplicitCodeLang && !isCodeLike(block)) {
                    block.forEach(innerLine => {
                        if (!isNoise(innerLine)) output.push(innerLine);
                    });
                } else {
                    output.push(line, ...block, raw[cursor]);
                }
                index = cursor;
                continue;
            }
            continue;
        }

        if (!isNoise(line)) {
            output.push(line);
        }
    }

    return output.join('\n').replace(/\n{3,}/g, '\n\n').trim();
}

export function normalizeBullets(text) {
    const lines = String(text || '').split('\n');
    const result = [];
    let inCodeBlock = false;

    for (let i = 0; i < lines.length; i += 1) {
        const line = lines[i];
        if (/^\s*```/.test(line)) {
            inCodeBlock = !inCodeBlock;
            result.push(line);
            continue;
        }
        if (inCodeBlock) {
            result.push(line);
            continue;
        }

        const bulletMatch = BULLET_PATTERN.exec(line);
        if (bulletMatch) {
            let itemText = bulletMatch[1].trim();
            // Prevent CommonMark from turning "• 1. Text" into a nested <ol> inside <ul><li>
            itemText = itemText.replace(/^(\d+)\.\s+/, '$1\\. ');
            const prevResult = result.length ? result[result.length - 1] : '';
            if (prevResult.trim() && !/^\s*(?:-\s+|\d+[.)]\s+)/.test(prevResult)) {
                result.push('');
            }
            result.push(`- ${itemText}`);
            continue;
        }

        const numberedMatch = NUMBERED_PATTERN.exec(line);
        if (numberedMatch) {
            const prevResult = result.length ? result[result.length - 1] : '';
            if (prevResult.trim() && !/^\s*(?:-\s+|\d+[.)]\s+)/.test(prevResult)) {
                result.push('');
            }
            result.push(line.trim());
            continue;
        }

        result.push(line);
    }

    return result.join('\n');
}

function nextNonEmptyLine(lines, fromIndex) {
    for (let i = fromIndex + 1; i < lines.length; i += 1) {
        if (cleanTitle(lines[i])) return lines[i];
    }
    return '';
}

function isCitationOrWrappedArtifact(rawLine) {
    const trimmed = String(rawLine || '').trim();
    if (!trimmed) return true;
    if (/^["“'‘()[\],;.]/.test(trimmed)) return true;
    const quoteCount = (trimmed.match(/["“”]/g) || []).length;
    if (quoteCount % 2 === 1) return true;
    if (CITATION_ARTIFACT_PATTERN.test(trimmed)) return true;
    return false;
}

function isSectionTitle(line, lines, localIndex) {
    const rawClean = cleanTitle(line);
    const value = stripTrailingColon(rawClean);
    if (!value || value.length < 3 || value.length > 95) return false;
    if (MARKDOWN_HEADING.test(line) || BULLET_PATTERN.test(line) || NUMBERED_PATTERN.test(line) || MODULE_LINE_PATTERN.test(line)) {
        return false;
    }

    if (KNOWN_SECTION_HEADERS.test(value)) {
        return true;
    }

    if (isCitationOrWrappedArtifact(line)) {
        return false;
    }

    if (!/^[A-Z\u0600-\u06FF]/.test(value)) return false;
    if (/[.,;؛،]$/.test(rawClean)) return false;

    const immediatePrev = localIndex > 0 ? cleanTitle(lines[localIndex - 1]) : '';
    if (immediatePrev) {
        if (DANGLING_LINE_END.test(immediatePrev)) return false;
        const prevQuotes = (immediatePrev.match(/["“”]/g) || []).length;
        if (prevQuotes % 2 === 1) return false;
    }

    const nextLine = nextNonEmptyLine(lines, localIndex);
    if (!nextLine) return false;

    return BULLET_PATTERN.test(nextLine) || NUMBERED_PATTERN.test(nextLine);
}

function extractModuleHeader(lines, start, end) {
    const nonEmptyAfter = [];
    for (let cursor = start.index + 1; cursor < end && nonEmptyAfter.length < 3; cursor += 1) {
        const cleaned = cleanTitle(lines[cursor]);
        if (cleaned && !MODULE_LINE_PATTERN.test(lines[cursor])) {
            nonEmptyAfter.push({ lineIndex: cursor, text: cleaned, raw: lines[cursor] });
        } else if (MODULE_LINE_PATTERN.test(lines[cursor])) {
            break;
        }
    }

    let parenthetical = start.inlinePart || '';
    let baseTitle = start.explicitTitle || '';
    let titleEnd = start.index + 1;

    if (baseTitle) {
        const trailingPart = TRAILING_PART_PATTERN.exec(baseTitle);
        if (trailingPart && !parenthetical) {
            baseTitle = trailingPart[1].trim();
            parenthetical = trailingPart[2].trim();
        }
        if (nonEmptyAfter[0]) {
            const partMatch = PARENTHETICAL_PART_PATTERN.exec(nonEmptyAfter[0].text);
            if (partMatch) {
                parenthetical = `(${(partMatch[1] || partMatch[2]).trim()})`;
                titleEnd = nonEmptyAfter[0].lineIndex + 1;
            }
        }
    } else if (nonEmptyAfter.length > 0) {
        const first = nonEmptyAfter[0];
        const second = nonEmptyAfter[1];
        const third = nonEmptyAfter[2];

        const firstPartMatch = PARENTHETICAL_PART_PATTERN.exec(first.text);
        const secondPartMatch = second ? PARENTHETICAL_PART_PATTERN.exec(second.text) : null;

        if (firstPartMatch) {
            parenthetical = `(${(firstPartMatch[1] || firstPartMatch[2]).trim()})`;
            titleEnd = first.lineIndex + 1;
            if (second && !KNOWN_SECTION_HEADERS.test(stripTrailingColon(second.text)) && !BULLET_PATTERN.test(second.raw) && !NUMBERED_PATTERN.test(second.raw)) {
                baseTitle = second.text;
                titleEnd = second.lineIndex + 1;
            }
        } else if (!KNOWN_SECTION_HEADERS.test(stripTrailingColon(first.text)) && !BULLET_PATTERN.test(first.raw) && !NUMBERED_PATTERN.test(first.raw)) {
            baseTitle = first.text;
            titleEnd = first.lineIndex + 1;

            const trailingPart = TRAILING_PART_PATTERN.exec(baseTitle);
            if (trailingPart && !parenthetical) {
                baseTitle = trailingPart[1].trim();
                parenthetical = trailingPart[2].trim();
            }

            if (secondPartMatch) {
                parenthetical = `(${(secondPartMatch[1] || secondPartMatch[2]).trim()})`;
                titleEnd = second.lineIndex + 1;
            } else if (
                second
                && !KNOWN_SECTION_HEADERS.test(stripTrailingColon(second.text))
                && !BULLET_PATTERN.test(second.raw)
                && !NUMBERED_PATTERN.test(second.raw)
                && second.text.length <= 75
                && (
                    DANGLING_LINE_END.test(first.text)
                    || (third && KNOWN_SECTION_HEADERS.test(stripTrailingColon(third.text)))
                )
            ) {
                baseTitle = `${baseTitle} ${second.text}`.replace(/\s+/g, ' ').trim();
                titleEnd = second.lineIndex + 1;
            }
        }
    }

    if (!baseTitle) {
        baseTitle = `Module ${start.number}`;
    }

    const prefix = `Module ${start.number}${parenthetical ? ` ${parenthetical}` : ''}`;
    const title = baseTitle.toLowerCase() === prefix.toLowerCase()
        ? prefix
        : `${prefix}: ${baseTitle}`;

    return { title, titleEnd };
}

function cleanStatementText(raw) {
    return cleanTitle(raw)
        .replace(/^[-*+\u2022]\s*/, '')
        .replace(/^(\d+)\\?\.\s+/, '')
        .trim();
}

function pickDistractors(correctAnswer, pool, count = 3, fallbackPool = []) {
    const normCorrect = cleanTitle(correctAnswer).toLowerCase();
    const chosen = [];
    const seen = new Set([normCorrect]);

    const tryAddFrom = list => {
        for (const candidate of list) {
            if (chosen.length >= count) break;
            const cleaned = cleanTitle(candidate);
            const lower = cleaned.toLowerCase();
            if (!cleaned || seen.has(lower)) continue;
            // Avoid distractors that are substrings of or almost identical to the correct answer
            if (lower.includes(normCorrect) || normCorrect.includes(lower)) {
                if (Math.abs(lower.length - normCorrect.length) < 15) continue;
            }
            seen.add(lower);
            chosen.push(cleaned);
        }
    };

    tryAddFrom(pool);
    if (chosen.length < count) {
        tryAddFrom(fallbackPool);
    }

    return chosen.slice(0, count);
}

export function shuffleArray(items) {
    const copy = [...items];
    for (let i = copy.length - 1; i > 0; i -= 1) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
}

function buildQuizCandidates(moduleTitle, lessons, bodyLines, lang = 'en') {
    const isEn = lang === 'en';
    const termPairs = []; // { term, definition, sectionTitle }
    const sectionGroups = []; // { title, bullets: [] }
    const allStatements = [];

    // 1. Collect definitions, statements, and section bullet groups from actual lessons
    lessons.forEach(lesson => {
        if (isMetadataSectionTitle(lesson.title)) return;
        const lessonTitle = cleanTitle(lesson.title);
        const lessonLines = String(lesson.content || '').split('\n');
        const sectionBullets = [];

        lessonLines.forEach(rawLine => {
            const line = cleanStatementText(rawLine);
            if (!line || line.length < 10) return;

            // Pattern A: "Term: Definition" or "Term – Definition" or "Term - Definition"
            const colonDef = /^([A-Za-z\u0600-\u06FF][A-Za-z0-9\u0600-\u06FF\s()/&-]{1,42}?)\s*(?:[:：]|\s+[–—-]\s+)\s*(.{15,})$/.exec(line);
            if (colonDef && !/^(?:http|https|module|note|example|figure|table|step|part)\b/i.test(colonDef[1].trim())) {
                const term = cleanTitle(colonDef[1]);
                const definition = cleanTitle(colonDef[2]);
                if (term.split(/\s+/).length <= 6 && definition.length >= 15) {
                    termPairs.push({ term, definition, sectionTitle: lessonTitle });
                    allStatements.push(definition);
                    sectionBullets.push(`${term}: ${definition}`);
                    return;
                }
            }

            // Pattern B: "NIST defines X as Y" / "X is defined as Y" / "X refers to Y"
            const inlineDef = /^(?:NIST\s+defines\s+)?([A-Za-z\u0600-\u06FF][A-Za-z0-9\u0600-\u06FF\s()/&-]{2,45}?)\s+(?:is\s+defined\s+as|refers\s+to|means|is\s+the\s+(?:protection|process|practice|ability|assurance|measure)\b)\s*(.{15,})$/i.exec(line);
            if (inlineDef) {
                const term = cleanTitle(inlineDef[1]);
                const fullDef = line.replace(/^(?:NIST\s+defines\s+)?/i, '');
                const predicateStart = fullDef.toLowerCase().indexOf(term.toLowerCase()) + term.length;
                const definition = cleanTitle(fullDef.slice(predicateStart).replace(/^(?:\s+as|\s+is\s+defined\s+as|\s+refers\s+to|\s+means)\s*/i, '')) || cleanTitle(inlineDef[2]);
                if (term.split(/\s+/).length <= 7 && definition.length >= 15) {
                    termPairs.push({ term, definition, sectionTitle: lessonTitle });
                }
            }

            if (line.length >= 18) {
                sectionBullets.push(line);
                allStatements.push(line);
            }
        });

        // If the section title itself is "Concept - Definition" or "Concept – Definition" and has a primary bullet
        const titleDefMatch = /^(.+?)\s*[-–—:]\s*Definition$/i.exec(lessonTitle);
        if (titleDefMatch && sectionBullets.length > 0) {
            const term = cleanTitle(titleDefMatch[1]);
            const definition = sectionBullets[0];
            if (!termPairs.some(p => p.term.toLowerCase() === term.toLowerCase())) {
                termPairs.push({ term, definition, sectionTitle: lessonTitle });
            }
        }

        if (sectionBullets.length > 0 && lessonTitle) {
            sectionGroups.push({ title: lessonTitle, bullets: sectionBullets });
        }
    });

    const definitionPool = [
        ...termPairs.map(p => p.definition),
        ...allStatements
    ];
    const termPool = [
        ...termPairs.map(p => p.term),
        ...sectionGroups.map(g => g.title)
    ];

    const fallbackEnglishDistractors = [
        'Eliminating all network communication protocols to prevent external data transmission entirely',
        'Granting unrestricted administrative privileges to all standard user accounts by default',
        'Storing plaintext credentials in public repositories to simplify system recovery procedures',
        'Disabling operating system audit logs to maximize CPU throughput and minimize disk usage'
    ];
    const fallbackArabicDistractors = [
        'إلغاء جميع ضوابط التحقق من الهوية للسماح بالوصول المفتوح لكافة المستخدمين دون قيود',
        'تخزين البيانات الحساسة بصيغة نصية غير مشفرة لتسريع عمليات النسخ الاحتياطي فقط',
        'إيقاف سجلات التدقيق والمراقبة بشكل كامل لتقليل استهلاك موارد النظام',
        'تجاهل تحديثات الأمان الدورية والاعتماد فقط على جدار الحماية المبدئي'
    ];
    const genericStatementFallbacks = isEn ? fallbackEnglishDistractors : fallbackArabicDistractors;
    const genericTermFallbacks = isEn
        ? ['Data Redundancy', 'Network Latency', 'Hardware Virtualization', 'Packet Fragmentation']
        : ['تكرار البيانات', 'زمن انتقال الشبكة', 'المحاكاة الافتراضية', 'تجزئة الحزم'];

    const rawQuestions = [];
    const seenStems = new Set();

    const addMcq = (question, answer, candidatePool, fallbackPool, source = 'mcq') => {
        const q = cleanTitle(question);
        const a = cleanTitle(answer);
        if (!q || !a || seenStems.has(q.toLowerCase())) return;
        const distractors = pickDistractors(a, candidatePool, 3, fallbackPool);
        if (distractors.length < 3) return;
        seenStems.add(q.toLowerCase());
        const options = shuffleArray([a, ...distractors]);
        rawQuestions.push({
            id: `mcq-${rawQuestions.length + 1}`,
            type: 'mcq',
            lang,
            question: q,
            answer: a,
            distractors,
            options,
            source
        });
    };

    // 1. Explicit Q: ... | ... blocks in markdown
    bodyLines.forEach(line => {
        const match = /^\s*(?:Q|س)\s*[:：]\s*(.+?)\s*(?:\|\s*|->\s*|=>\s*)(.+)$/i.exec(line);
        if (match) {
            addMcq(match[1], match[2], definitionPool, genericStatementFallbacks, 'markdown');
        }
    });

    // 2. Term -> Definition MCQs
    termPairs.forEach(({ term, definition }) => {
        const otherDefs = termPairs
            .filter(p => p.term.toLowerCase() !== term.toLowerCase())
            .map(p => p.definition);
        const stem = isEn
            ? `Which of the following best defines "${term}"?`
            : `أيٌّ مما يلي يُعرّف «${term}» بشكل صحيح؟`;
        addMcq(stem, definition, [...otherDefs, ...definitionPool], genericStatementFallbacks, 'definition');
    });

    // 3. Section Heading -> Core Statement MCQs ("Which of the following best describes [Heading]?")
    sectionGroups.forEach((group, groupIdx) => {
        const otherGroupBullets = sectionGroups
            .filter((_, idx) => idx !== groupIdx)
            .flatMap(g => g.bullets);
        const primaryBullet = group.bullets[0];
        if (primaryBullet && primaryBullet.length >= 18) {
            const stem = isEn
                ? `Which of the following best describes "${group.title}"?`
                : `أي العبارات التالية تصف «${group.title}» بشكل دقيق؟`;
            addMcq(stem, primaryBullet, [...otherGroupBullets, ...definitionPool], genericStatementFallbacks, 'section');
        }

        // 4. Negative / Exclusion MCQ ("Which of the following is NOT one of the [Heading]?") when a section has >= 3 bullets and other sections exist
        if (group.bullets.length >= 3 && otherGroupBullets.length >= 1) {
            const outsider = otherGroupBullets.find(b => !group.bullets.some(gb => gb.toLowerCase() === b.toLowerCase()));
            if (outsider) {
                const stem = isEn
                    ? `Which of the following is NOT associated with "${group.title}"?`
                    : `أيٌّ مما يلي لا يندرج ضمن «${group.title}»؟`;
                addMcq(stem, outsider, group.bullets, genericStatementFallbacks, 'exclusion');
            }
        }
    });

    // 5. Definition -> Term Reverse MCQs (when >= 2 terms exist)
    if (termPairs.length >= 2) {
        termPairs.slice(0, 5).forEach(({ term, definition }) => {
            const otherTerms = termPool.filter(t => t.toLowerCase() !== term.toLowerCase());
            const stem = isEn
                ? `Which concept corresponds to the following description: "${definition}"?`
                : `أي مفهوم مما يلي ينطبق عليه الوصف: «${definition}»؟`;
            addMcq(stem, term, otherTerms, genericTermFallbacks, 'reverse-definition');
        });
    }

    // 6. Additional statement-to-section matching if we still have room
    if (rawQuestions.length < 6) {
        sectionGroups.forEach((group, groupIdx) => {
            group.bullets.slice(1, 3).forEach(bullet => {
                const otherGroupBullets = sectionGroups
                    .filter((_, idx) => idx !== groupIdx)
                    .flatMap(g => g.bullets);
                const stem = isEn
                    ? `Regarding "${group.title}", which of the following statements is accurate?`
                    : `فيما يتعلق بـ «${group.title}»، أي العبارات التالية صحيحة؟`;
                addMcq(stem, bullet, [...otherGroupBullets, ...definitionPool], genericStatementFallbacks, 'detail');
            });
        });
    }

    return rawQuestions.slice(0, 12);
}

function withoutQuizSyntax(text) {
    return normalizeBullets(String(text || ''))
        .replace(/^\s*:::\s*quiz\s*$/gim, '')
        .replace(/^\s*:::\s*$/gim, '')
        .replace(/^#{1,6}\s+quiz\b.*$/gim, '')
        .replace(/^\s*(?:Q|س)\s*[:：].*$/gim, '')
        .replace(/\n{3,}/g, '\n\n')
        .trim();
}

function makeId(prefix, index) {
    return `${prefix}-${index + 1}`;
}

export function parseMarkdownCourse(markdown) {
    const cleaned = cleanSource(markdown);
    const lines = cleaned ? cleaned.split('\n') : [];
    const moduleStarts = [];

    lines.forEach((line, index) => {
        const match = MODULE_LINE_PATTERN.exec(line);
        if (match) {
            moduleStarts.push({
                index,
                number: match[1],
                inlinePart: match[2] ? cleanTitle(match[2]) : '',
                explicitTitle: cleanTitle(match[3])
            });
        }
    });

    if (!moduleStarts.length && lines.some(line => cleanTitle(line))) {
        moduleStarts.push({ index: 0, number: '1', inlinePart: '', explicitTitle: '' });
    }

    const modules = moduleStarts.map((start, moduleIndex) => {
        const end = moduleStarts[moduleIndex + 1]?.index ?? lines.length;
        const isSyntheticSingleModule = moduleStarts.length === 1 && start.index === 0 && !MODULE_LINE_PATTERN.test(lines[0] || '');

        let title = 'Module 1';
        let titleEnd = 0;

        if (isSyntheticSingleModule) {
            const firstHeading = lines.findIndex(l => cleanTitle(l));
            if (firstHeading !== -1) {
                const rawFirst = cleanTitle(lines[firstHeading].replace(/^#{1,6}\s+/, ''));
                title = /^module\s+\d+/i.test(rawFirst) ? rawFirst : `Module 1: ${rawFirst}`;
                titleEnd = firstHeading + 1;
            }
        } else {
            const header = extractModuleHeader(lines, start, end);
            title = header.title;
            titleEnd = header.titleEnd;
        }

        const bodyLines = lines.slice(titleEnd, end);
        const boundaries = [];

        bodyLines.forEach((line, localIndex) => {
            const heading = MARKDOWN_HEADING.exec(line);
            if (heading && !/^quiz\b/i.test(cleanTitle(heading[2]))) {
                boundaries.push({
                    start: localIndex,
                    bodyStart: localIndex + 1,
                    title: stripTrailingColon(heading[2])
                });
            } else if (isSectionTitle(line, bodyLines, localIndex)) {
                boundaries.push({
                    start: localIndex,
                    bodyStart: localIndex + 1,
                    title: stripTrailingColon(line)
                });
            }
        });

        if (boundaries.length > 0 && boundaries[0].start > 0 && !isMetadataSectionTitle(boundaries[0].title)) {
            const leadingLines = bodyLines.slice(0, boundaries[0].start);
            if (leadingLines.some(line => cleanTitle(line))) {
                boundaries.unshift({
                    start: 0,
                    bodyStart: 0,
                    title: 'Overview'
                });
            }
        }

        if (!boundaries.length && bodyLines.some(line => cleanTitle(line))) {
            boundaries.push({
                start: 0,
                bodyStart: 0,
                title: 'الدرس الرئيسي'
            });
        }

        const allSections = boundaries.map(section => {
            const boundaryIdx = boundaries.indexOf(section);
            const sliceEnd = boundaries[boundaryIdx + 1]?.start ?? bodyLines.length;
            const rawSlice = bodyLines.slice(section.bodyStart, sliceEnd).join('\n');
            const content = withoutQuizSyntax(rawSlice);
            return {
                title: section.title,
                isMetadata: isMetadataSectionTitle(section.title),
                content: content || withoutQuizSyntax(bodyLines.slice(section.start, sliceEnd).join('\n'))
            };
        });

        const lectureSections = allSections
            .filter(section => !section.isMetadata && (cleanTitle(section.title) || cleanTitle(section.content)))
            .map((section, lessonIndex) => ({
                id: `lesson-${moduleIndex + 1}-${lessonIndex + 1}`,
                title: section.title,
                content: section.content
            }));

        const lessons = lectureSections;
        const lectureText = lessons.map(lesson => `${lesson.title}\n${lesson.content}`).join('\n\n').trim();
        const lang = detectLanguage(`${title}\n${lectureText}`);

        return {
            id: makeId('module', moduleIndex),
            title,
            lang,
            content: lectureText || title,
            lessons,
            quizCandidates: buildQuizCandidates(title, lessons, bodyLines, lang)
        };
    });

    return {
        modules,
        topics: modules.flatMap(module => [
            { id: module.id, title: module.title, level: 1, moduleId: module.id },
            ...module.lessons.map(lesson => ({ ...lesson, level: 2, moduleId: module.id }))
        ])
    };
}

export function applyAutoDirection(root) {
    if (!root) return;
    const rootDir = detectDirection(root.textContent);
    root.dir = rootDir === 'ltr' ? 'ltr' : 'auto';
    root.style.unicodeBidi = 'plaintext';

    root.querySelectorAll('ul, ol, li, p, h1, h2, h3, h4, h5, h6, blockquote, pre, code, table, th, td').forEach(element => {
        if (element.tagName === 'PRE' || element.tagName === 'CODE') {
            element.dir = 'ltr';
            return;
        }
        const dir = detectDirection(element.textContent);
        element.dir = dir === 'ltr' ? 'ltr' : 'auto';
        element.style.unicodeBidi = 'plaintext';
        if (dir === 'ltr') {
            element.style.textAlign = 'left';
            element.style.direction = 'ltr';
        }
    });
}
