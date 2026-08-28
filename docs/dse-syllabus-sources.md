# HKDSE Syllabus / Assessment-Framework Source Manifest

**Purpose:** authoritative, current sources for every DSE subject's exam structure and
curriculum — used as **reference** for authoring ORIGINAL practice questions.
**Last updated:** 2026-07-01.

> ⚠️ **Copyright & honesty.** The HKEAA Assessment Frameworks and EDB C&A Guides are
> **copyrighted by HKEAA / EDB**. This file only *links* to them; it does **not** reproduce
> their text, and neither should the app. Use them to extract *skills / topics / weightings*
> and then write **original** questions (0% text overlap) — the same rule the question bank
> already follows. Do **not** copy passages, data tables, or figures.
>
> ⚠️ **"Latest" is a moving target.** HKEAA revised **four subjects' assessment frameworks
> for the 2026 HKDSE** (and the core subjects were restructured in recent years). Always take
> the **most recent year's** PDF from the Subject Information page below — do not trust a
> cached/older copy. Where a direct PDF link is not listed here, it is because the exact file
> slug was not verified (HKEAA blocks automated fetching, HTTP 403); navigate from the landing
> page instead of guessing a URL.

---

## Two document types (know which you need)

| Doc | Publisher | Tells you | Use for |
|---|---|---|---|
| **Assessment Framework** | HKEAA | the **exam structure** — papers, format (MC/LQ/essay/practical/SBA), duration, weighting | matching "每一份試卷" structure, difficulty tiers |
| **Curriculum & Assessment (C&A) Guide** | EDB | the **syllabus content** — topics, learning objectives, depth | authoring question *content* per topic |

---

## 已核實事實（逐條記錄，附日期同來源）

> 點解要有呢一節：2026-08-27 有人（Claude Code）憑印象聲稱「英文科 Paper 4 已隨
> 2024 核心科目優化取消」，並建議由 100 條英文書寫題規劃入面剔走。**呢個聲稱係錯嘅。**
> 逐條記低核實過嘅結構，往後唔使再靠印象推斷。

| 事實 | 結論 | 核實日期 | 來源 |
|---|---|---|---|
| 英文科公開試卷數 | **四卷**（Paper 1 Reading／2 Writing／3 Listening & Integrated Skills／**4 Speaking**）。Paper 4 **仍然設有**。 | 2026-08-27 | 2026 DSE 考試時間表：英文口試 2026 年 3 月中至下旬舉行，筆試 4 月 10–11 日；HKEAA 亦有 English Language 2025 Paper 4 表現示例頁 |
| 2024 核心科目優化剷走咗邊啲卷 | **只係中國語文科**嘅卷三（聆聽及綜合能力）同卷四（說話）。**唔涉及英文科。** | 2026-08-27 | 同上 |
| 中國語文科卷數 | **兩卷**（卷一閱讀能力／卷二寫作能力） | 2026-08-27 | 同上 |
| 數學（必修）卷一分部 | **甲部 = Section A**（A1 35 分，8–11 條較易；A2 35 分，4–7 條較難）；**乙部 = Section B**（35 分，4–7 條）。全卷 105 分，佔全科 **65%**，2¼ 小時。 | 2026-08-27 | HKEAA 數學科評核大綱（2025／2026／2027 年版均已上載 DocLibrary） |

⚠️ **甲／乙好易寫反。** 「乙部 = Section A1 & A2」係錯嘅寫法，已出現過一次。

⚠️ **HKEAA DocLibrary 嘅 PDF 對自動抓取一律回 403**，HTML 科目頁亦然。核實只可以
由真人喺瀏覽器開，或者經搜尋結果嘅摘要交叉比對。上表每一行都應該喺重大內容決策前
由真人再開一次原始 PDF 覆核 —— 搜尋摘要唔等於原文。

---

## Authoritative entry points (verified 2026-07)

- **HKEAA — Assessment Frameworks (all subjects, latest):**
  https://www.hkeaa.edu.hk/en/hkdse/assessment/assessment_framework/
- **HKEAA — Subject Information (per-subject framework PDFs):**
  https://www.hkeaa.edu.hk/en/hkdse/assessment/subject_information/
- **HKEAA — Category A senior-secondary subjects index:**
  https://www.hkeaa.edu.hk/en/hkdse/assessment/subject_information/category_a_subjects/
- **EDB — Curriculum guides & documents (senior secondary):**
  https://www.edb.gov.hk/en/curriculum-development/major-level-of-edu/secondary/CG_documents.html
- **EDB — PSHE (經社史地) curriculum documents:**
  https://www.edb.gov.hk/en/curriculum-development/kla/pshe/curriculum-documents.html

**HKEAA framework-PDF URL pattern** (confirmed): `https://www.hkeaa.edu.hk/DocLibrary/HKDSE/Subject_Information/<slug>/<year>hkdse-e-<code>.pdf`
— e.g. English `2026hkdse-e-elang.pdf`, Physics `2026hkdse-e-phy.pdf`, Maths `2026hkdse-e-math.pdf`.
Change `<year>` to the latest; open the Subject Information page to get each subject's exact slug.

---

## Per-subject manifest (24 subjects the app covers)

Legend: **[AF]** = HKEAA Assessment Framework (via Subject Information page unless a verified
direct link is shown). **[CAG]** = EDB C&A Guide (via the EDB landing pages above unless a
verified direct link is shown). App id in `code`.

### Core
| Subject | app id | Notes |
|---|---|---|
| 中國語文 Chinese Language | `chinese` | [AF] Subject Info page. **Recently restructured** — confirm current paper count/weighting on the AF. |
| 英國語文 English Language | `english` | [AF] **verified:** https://www.hkeaa.edu.hk/DocLibrary/HKDSE/Subject_Information/eng_lang/2026hkdse-e-elang.pdf |
| 數學（必修部分）Mathematics Compulsory | `math` | [AF] **verified:** https://www.hkeaa.edu.hk/DocLibrary/HKDSE/Subject_Information/math/2026hkdse-e-math.pdf |
| 數學延伸單元一 M1 (Calculus & Statistics) | `m1` | [AF] same math Subject Info page (Module 1). |
| 數學延伸單元二 M2 (Algebra & Calculus) | `m2` | [AF] same math Subject Info page (Module 2). |
| 公民與社會發展 Citizenship & Social Development | `csd` | [AF] Subject Info page. [CAG] EDB PSHE. (Replaced Liberal Studies — use current docs only.) |

### Sciences
| Subject | app id | Notes |
|---|---|---|
| 物理 Physics | `physics` | [AF] **verified:** https://www.hkeaa.edu.hk/DocLibrary/HKDSE/Subject_Information/phy/2026hkdse-e-phy.pdf |
| 化學 Chemistry | `chemistry` | [CAG] **verified:** https://www.edb.gov.hk/attachment/en/curriculum-development/kla/science-edu/Chem_C_and_A_Guide_updated_Eng_22082018.pdf · [AF] Subject Info page |
| 生物 Biology | `biology` | [CAG] **verified:** https://www.edb.gov.hk/attachment/en/curriculum-development/kla/science-edu/Bio_C_and_A_Guide_updated_e_20151126.pdf · [AF] Subject Info page |

### Business / Tech / PSHE electives
| Subject | app id | Notes |
|---|---|---|
| 經濟 Economics | `economics` | [AF] Subject Info page · [CAG] EDB PSHE |
| 企業、會計與財務概論 BAFS | `bafs` | [AF] Subject Info page · [CAG] EDB tech-ed |
| 資訊及通訊科技 ICT | `ict` | [CAG] **verified:** https://www.edb.gov.hk/attachment/en/curriculum-development/kla/technology-edu/curriculum-doc/ICT_C&A_Guide_e_final.pdf · [AF] Subject Info page |
| 設計與應用科技 Design & Applied Technology | `design-tech` | [AF] Subject Info page · [CAG] EDB tech-ed |
| 科技與生活 Technology & Living | `technology-living` | [AF] Subject Info page · [CAG] EDB tech-ed |
| 健康管理與社會關懷 Health Mgmt & Social Care | `health-management` | [AF] Subject Info page · [CAG] EDB tech-ed |
| 旅遊與款待 Tourism & Hospitality Studies | `ths` | [AF] Subject Info page · [CAG] EDB PSHE |
| 地理 Geography | `geography` | [CAG] **verified:** https://www.edb.gov.hk/attachment/en/curriculum-development/kla/pshe/Geography%20C&A%20Guide%202022-eng.pdf · [AF] Subject Info page |
| 歷史 History | `history` | [AF] Subject Info page · [CAG] EDB PSHE |
| 中國歷史 Chinese History | `chinese-history` | [AF] Subject Info page · [CAG] EDB PSHE |

### Languages / Literature / Arts
| Subject | app id | Notes |
|---|---|---|
| 中國文學 Chinese Literature | `chinese-literature` | [AF] Subject Info page |
| 英語文學 Literature in English | `english-literature` | [AF] Subject Info page |
| 音樂 Music | `music` | [AF] Subject Info page · [CAG] EDB arts-ed |
| 視覺藝術 Visual Arts | `visual-arts` | [AF] Subject Info page · [CAG] EDB arts-ed |
| 體育 Physical Education | `pe` | [AF] Subject Info page · [CAG] EDB PE-KLA |

---

## How to use with the question bank

1. Open the subject's **[AF]** → confirm the **latest** paper structure & weighting (drives the
   30/50/20 difficulty mix and which paper's skills to target).
2. Open the subject's **[CAG]** → list the topics/learning objectives → these become the
   `topic` / `framework` tags and the skills each question tests.
3. Author **original** questions from those skills (Mode A parametric for the quantitative
   subjects; Mode B authored+judged for the rest). **Never copy** framework/guide text.

**Offer:** the EDB C&A Guide PDFs (edb.gov.hk) are fetchable programmatically; tell me which
subject you're authoring next and I can pull the relevant guide's topic list to ground the
questions. HKEAA PDFs block automated fetch — download those manually from the links above.
