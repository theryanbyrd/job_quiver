# Quiver

[English](README.md) | [Español](README.es.md) | [Português (Brasil)](README.pt-BR.md) | [한국어](README.ko-KR.md) | [日本語](README.ja.md) | [Українська](README.ua.md) | [Русский](README.ru.md) | [繁體中文](README.zh-TW.md)

> English is the canonical README. The translated files above predate the Quiver
> umbrella and currently describe only the `career-ops` CLI; they will lag until
> re-synced.

<p align="center">
  <img src="docs/hero-banner.jpg" alt="Quiver — an AI job-search system" width="800">
</p>

<p align="center">
  <em>Companies use AI to filter candidates. Quiver gives candidates AI to <strong>choose</strong> companies — and to actually run the search.</em>
</p>

---

## What Is Quiver

**Quiver is an AI job-search system with two interchangeable runtimes that are
designed to be used together.** Both run the same conceptual pipeline — discover
roles, score them against your real background, tailor your materials, apply,
track everything, and prep for interviews — but they live in different places and
play to different strengths.

| Component | Runtime | Lives in | Best at |
|-----------|---------|----------|---------|
| **career-ops** | Terminal / AI coding CLI (Claude Code, Gemini CLI, OpenCode) | Your machine, local files | High-volume **discovery, scoring, and document generation** — zero-token ATS scanning, parallel A–F evaluation, ATS-optimized CV PDFs, a Go dashboard |
| **quiver-cowork** | Claude Cowork (desktop app) + Claude in Chrome | Cowork projects + Google Workspace | The **live application loop** — filling forms in a real browser, drafting outreach, an event-sourced tracker, and data-driven coaching (profile audit, look-alike analysis, reality checks) |

> **Naming.** *Quiver* is the umbrella project (and the name of this repository,
> `job_quiver`). *career-ops* remains the name of the CLI component — its npm
> package, its `/career-ops` slash command, and its modes are unchanged. Nothing
> in code was renamed; "Quiver" is the system the two components add up to.

The throughline of both is the same philosophy: **this is a filter, not a
spray-and-pray cannon.** Quiver exists to help you find the few roles worth your
time out of hundreds, present yourself credibly, and apply deliberately — with a
human always making the final call. Neither component ever clicks Submit for you.

---

## How They Work Together

Both components implement the same pipeline. The diagram below shows who owns each
stage when you run them together — and where the two halves meet.

```
        DISCOVER ──► EVALUATE ──► TAILOR ──► APPLY ──► TRACK ──► FOLLOW-UP / PREP
           │            │           │          │         │              │
career-ops │ scan.mjs   │ A–F batch │ CV PDF   │  (apply │ local        │ interview-prep
 (CLI)     │ 45+ ATS    │ parallel  │ engine   │   mode) │ markdown/TSV │ STAR mode
           │ zero-token │ scoring   │          │         │ + Go TUI     │ analyze-patterns
           │            │           │          │         │              │
quiver-    │ Chrome     │ profile-  │ cover-   │ Chrome  │ event-sourced│ reality-check
 cowork    │ saved      │ match vs  │ letter   │ form-   │ Google Sheet │ market-intel
 (Cowork)  │ searches   │ job-      │ skill    │ fill    │ (Events =    │ look-alike
           │ (logged-in │ profile   │          │ never   │  source of   │ profile-audit
           │  boards)   │ skill     │          │ submit  │  truth)      │
           └──────┬─────┴─────┬─────┴────┬─────┴────┬────┴──────┬───────┘
                  │           │          │          │           │
                  ▼           ▼          ▼          ▼           ▼
            The seam: career-ops produces a scored shortlist + CV PDFs locally;
            quiver-cowork is where those get applied, tracked, and coached on.
            See docs/INTEGRATION.md for the bridge and the status mapping.
```

In short: **career-ops is the engine room, quiver-cowork is the cockpit.** Use
the CLI to do cheap, parallel, high-volume work (scan many ATS feeds, batch-score
dozens of roles, generate tailored CV PDFs). Hand the survivors to Cowork to
apply in a live browser, chase referrals, keep the event-sourced tracker honest,
and run the weekly coaching loop.

The two halves keep separate data stores today (local markdown/TSV vs. a Google
Sheet), so the handoff between them is currently a deliberate, documented bridge
rather than an automatic sync. **[docs/INTEGRATION.md](docs/INTEGRATION.md)** is
the full account of how they combine, including the data-model seam, the status
vocabulary mapping, and the recommended end-to-end workflow.

### Which one should I start with?

- **Just want to start applying today, in your browser, with the least setup?**
  Start with **quiver-cowork** (`quiver-cowork/README.md`).
- **Comfortable in a terminal and want maximum throughput on discovery + scoring +
  CV generation?** Start with **career-ops** (`docs/SETUP.md`).
- **Want the full system?** Do both — set up Cowork for the daily loop, add
  career-ops as the bulk engine, and follow the combined workflow in
  [docs/INTEGRATION.md](docs/INTEGRATION.md).

---

## Component 1 — career-ops (CLI engine)

Turns any AI coding CLI into a job-search command center. You paste a job URL or
description and it classifies the role into an archetype, scores it against your
CV on a structured A–F / 10-dimension rubric (reasoning about fit, not keyword
matching), generates an ATS-optimized CV PDF, and writes the result to a local
tracker.

| Capability | Description |
|------------|-------------|
| **Zero-token portal scanner** | `scan.mjs` hits Greenhouse / Ashby / Lever APIs and local parsers for 45+ pre-configured companies + ~19 board queries — no LLM tokens spent on discovery. Optional `--verify` Playwright pass drops expired postings. |
| **A–F evaluation** | Six blocks (role summary, CV match, level strategy, comp research, personalization, interview prep) → weighted score across 10 dimensions. |
| **Batch processing** | Parallel headless workers (`claude -p` or any CLI's headless mode) evaluate many offers at once. |
| **ATS PDF generation** | `generate-pdf.mjs` renders a print-quality, ATS-parseable CV from an HTML template (Space Grotesk + DM Sans). |
| **Pipeline integrity** | `merge`, `dedup`, `normalize`, `verify`, `sync-check`, `patterns` keep the local tracker consistent. |
| **Dashboard TUI** | A Go (Bubble Tea) terminal UI to browse, filter, and sort the pipeline. |

Single slash command with modes:

```
/career-ops {paste a JD}   → full auto-pipeline (evaluate + PDF + tracker)
/career-ops scan           → scan portals for new offers
/career-ops pdf            → generate ATS-optimized CV
/career-ops batch          → batch evaluate multiple offers
/career-ops tracker        → view application status
/career-ops apply          → fill application forms
/career-ops pipeline       → process pending URLs
/career-ops deep           → deep company research
/career-ops contacto       → outreach message
/career-ops training       → evaluate a course/cert
/career-ops project        → evaluate a portfolio project
```

Setup: **[docs/SETUP.md](docs/SETUP.md)** · Architecture: **[docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)** ·
Scripts: **[docs/SCRIPTS.md](docs/SCRIPTS.md)** · Customization: **[docs/CUSTOMIZATION.md](docs/CUSTOMIZATION.md)**

---

## Component 2 — quiver-cowork (Cowork kit)

A self-contained kit (`quiver-cowork/`) for running the search on **Claude Cowork**,
the desktop agent. Where career-ops works on local files in a terminal, Cowork
drives a real browser via **Claude in Chrome** and reads your **Gmail, Google
Calendar, and Google Drive** — so it can fill applications, watch for recruiter
replies, schedule interviews, and keep a shared tracker, all from one place.

It ships eight skills, an event-sourced spreadsheet, and a printable cheat sheet:

| Skill | What it does |
|-------|--------------|
| **job-profile** | Canonical structured profile (résumé, targets, salary floor, work auth, EEO, blocklist). The single source of truth Cowork pulls from. |
| **profile-audit** | Grades your LinkedIn + résumé on a 12-category 0–10 rubric; flags red flags (notably "currently unemployed" signaling) with a prioritized fix list. |
| **look-alike-analysis** | Studies 12–20 anonymized profiles of people who *recently* got your target role; reports patterns appearing in 60%+ of the sample as a gap analysis. |
| **cover-letter** | Three tailoring templates (IC, leadership, career-change) + a banned-phrases list to avoid AI mush. |
| **application-tracker** | Defines the event-sourced Google Sheets schema and the append/update rules. |
| **market-intelligence** | Trend queries over the Market Snapshots tab — is this market growing or shrinking, which boards are hot. |
| **form-fill-playbook** | ATS quirks for Workday, Greenhouse, Lever, Ashby, iCIMS, Taleo, BrassRing, SmartRecruiters, Jobvite. "Never click Submit" repeated explicitly. |
| **reality-check** | Once-a-week, data-cited contrarian feedback ("73 days, 84 applications, 13% acknowledgment") — never vibes. |

The tracker workbook (`Applications-Tracker-Template.xlsx`) is **event-sourced**:
the *Events* tab is the append-only source of truth, *Applications* is a derived
state view, and there are tabs for Market Snapshots, Saved Searches, Look-Alike
Analysis, a Dashboard, and a Profile Quick Ref.

Full setup, daily commands, and guardrails: **[quiver-cowork/README.md](quiver-cowork/README.md)**.

---

## The Combined Workflow (recommended)

Order matters. The most common job-search mistake is starting with applications
when the profile or the target is the real bottleneck. The recommended sequence:

1. **Fix the foundation (Cowork).** Run `profile-audit`, then `look-alike-analysis`,
   then `reality-check`. ~4–6 hours up front that pays back in response rate.
2. **Discover at volume (career-ops + Cowork).** Run `npm run scan` for cheap bulk
   ATS coverage; run Cowork discovery for boards that need a logged-in session
   (LinkedIn, Indeed, ZipRecruiter, Wellfound).
3. **Score deeply (career-ops).** Batch-evaluate the finds with the A–F rubric —
   parallel and token-cheap.
4. **Generate materials (career-ops).** Produce ATS CV PDFs for everything that
   clears your score threshold.
5. **Apply + track (Cowork).** Hand the shortlist (and its PDFs) to Cowork: it
   fills each form in Chrome, drafts a tailored cover letter, stops before Submit,
   and logs every action to the event-sourced sheet. You review and submit.
6. **Run the loop (Cowork).** Daily email sweep + status updates, referral outreach
   drafts, and the weekly Sunday `reality-check`. Use career-ops `analyze-patterns`
   for outcome analysis when you have enough history.

See [docs/INTEGRATION.md](docs/INTEGRATION.md) for the bridge between step 4 and
step 5 (how a career-ops shortlist becomes rows + Discovery Found events in the
Cowork sheet) and the status-vocabulary mapping between the two trackers.

---

## Guardrails (both components)

These hold in every runtime:

- **Never auto-submit.** No component clicks Submit, Send, or Confirm on an
  application or message. Cowork stages drafts; you press the button.
- **Human-in-the-loop.** The AI evaluates, drafts, and recommends. You decide.
- **Truthful framing only.** Quiver never fabricates experience, clients, or
  consulting work — only honest presentation of real work.
- **Data-cited, not vibes.** Coaching skills cite specific numbers from your data.
- **You own your data.** Everything stays in your accounts and is sent only to the
  AI provider you choose.

---

## Repository Layout

```
job_quiver/
├── README.md                 ← this hub
├── AGENTS.md / CLAUDE.md / GEMINI.md   ← career-ops CLI agent instructions
├── modes/                    ← career-ops evaluation modes (14)
├── scan.mjs, generate-pdf.mjs, merge-tracker.mjs, ...   ← career-ops scripts
├── dashboard/                ← career-ops Go TUI
├── templates/, config/, fonts/         ← career-ops templates & config
├── docs/
│   ├── INTEGRATION.md        ← how the two components combine (start here)
│   ├── ARCHITECTURE.md       ← career-ops (CLI) architecture
│   ├── SETUP.md              ← career-ops setup
│   ├── SCRIPTS.md            ← career-ops scripts reference
│   └── CUSTOMIZATION.md      ← career-ops customization
└── quiver-cowork/            ← Component 2: the Cowork kit
    ├── README.md             ← Cowork setup + daily commands
    ├── Cheat-Sheet.pdf       ← printable one-pager
    ├── Applications-Tracker-Template.xlsx   ← event-sourced, 7 tabs
    └── skills/               ← 8 Cowork skills
```

---

## Tech Stack

- **Agents**: Claude Code / Gemini CLI / OpenCode (career-ops) · Claude Cowork + Claude in Chrome (quiver-cowork)
- **Discovery**: Playwright + Greenhouse/Ashby/Lever APIs (career-ops) · Chrome saved searches (Cowork)
- **PDF**: Playwright/Puppeteer + HTML template
- **Dashboard**: Go + Bubble Tea + Lipgloss (career-ops) · Google Sheets Dashboard tab (Cowork)
- **Data**: Markdown tables + YAML + TSV (career-ops) · event-sourced Google Sheet (Cowork)

---

## Origin & Credit

career-ops was built by Santiago Fernández de Valderrama ([santifer.io](https://santifer.io)),
who used it to evaluate 740+ offers, generate 100+ tailored CVs, and land a Head
of Applied AI role — see the upstream project at
[santifer/career-ops](https://github.com/santifer/career-ops) and the
[case study](https://santifer.io/career-ops-system). The quiver-cowork kit adapts
that workflow to Claude Cowork and adds the event-sourced tracker and coaching
skills.

## Disclaimer

Quiver is a local/desktop, open-source toolkit — **not a hosted service**. Your
CV and personal data stay in your accounts and are sent only to the AI provider
you choose. Evaluations are recommendations, not truth; AI can hallucinate, so
**always review generated content before submitting**. You are responsible for
complying with the Terms of Service of any job board or ATS you use. See
[LEGAL_DISCLAIMER.md](LEGAL_DISCLAIMER.md). Provided under the [MIT License](LICENSE)
"as is", without warranty of any kind.

## License & Trademark

Code is licensed under [MIT](LICENSE). The "career-ops" name and brand are
governed by the [Trademark Policy](TRADEMARK.md) — permissive for community use,
reserved for commercial product naming and endorsement.
