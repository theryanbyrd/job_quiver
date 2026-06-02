# Integration — How the Two Components Combine

Quiver is one job-search system delivered as two runtimes:

- **career-ops** — the CLI engine (this repo's root: `AGENTS.md`, `modes/`, the
  `*.mjs` scripts, `dashboard/`). Runs in a terminal on local files.
- **quiver-cowork** — the Cowork kit (`quiver-cowork/`). Runs in the Claude Cowork
  desktop app with Claude in Chrome + Google Workspace connectors.

This document explains how they map onto one pipeline, where their data models
meet (the "seam"), how to bridge them, and what is deliberately *not* automated
yet. For component-specific detail, see [SETUP.md](SETUP.md) and
[ARCHITECTURE.md](ARCHITECTURE.md) (career-ops) and
[../quiver-cowork/README.md](../quiver-cowork/README.md) (Cowork).

---

## One pipeline, two engines

Every stage of a job search exists in both components. The difference is cost,
environment, and strengths. Use whichever engine is better at each stage.

| Stage | career-ops (CLI) | quiver-cowork (Cowork) | Recommended owner |
|-------|------------------|------------------------|-------------------|
| **Discover** | `scan.mjs` — zero-token ATS API + local parsers across 45+ companies and ~19 board queries; optional Playwright liveness `--verify` | Chrome saved searches against logged-in boards (LinkedIn, Indeed, ZipRecruiter, Wellfound); writes Discovery Found events + Market Snapshots | **Both** — CLI for bulk public ATS feeds, Cowork for boards that require a session |
| **Evaluate / score** | A–F rubric, 10 weighted dimensions, archetype detection, batch-parallel | Lighter scoring against the `job-profile` skill criteria | **CLI** for depth and volume; Cowork inline when applying one-off |
| **Tailor materials** | `generate-pdf.mjs` → ATS-optimized **CV PDF** from HTML template | `cover-letter` skill → tailored **cover letters** | **CLI** for the CV, **Cowork** for the letter |
| **Apply** | `apply` mode (limited; terminal context) | Chrome `form-fill-playbook` across Workday/Greenhouse/Lever/Ashby/etc., **stops before Submit** | **Cowork** — it drives a real browser with your sessions |
| **Track** | `data/applications.md` (markdown) + batch TSVs, integrity scripts | Event-sourced Google Sheet (Events = source of truth) | Pick **one source of truth** — see the seam below |
| **Follow-up / outreach** | `contacto`, `followup` modes (drafts) | Gmail sweep, LinkedIn referral DM drafts, Calendar interview scheduling | **Cowork** — it has the connectors |
| **Coaching** | — | `profile-audit`, `look-alike-analysis`, `reality-check`, `market-intelligence` | **Cowork** only |
| **Interview prep** | `interview-prep` mode, STAR story bank | Stories accumulate across evaluations | **Either** |
| **Outcome analysis** | `analyze-patterns.mjs` over local tracker + reports | Dashboard tab + market-intelligence trends | **Either**, against its own store |

The shorthand: **career-ops is the engine room (cheap, parallel, local,
document-heavy); quiver-cowork is the cockpit (live browser, connectors,
tracking, coaching).**

---

## The seam: two trackers

This is the one place the components genuinely diverge, so it deserves a clear
account rather than a hand-wave.

| | career-ops tracker | quiver-cowork tracker |
|---|---|---|
| **Store** | `data/applications.md` (+ `batch/tracker-additions/*.tsv`) | Google Sheets workbook (`Applications-Tracker-Template.xlsx`) |
| **Model** | State table — one row per application, status mutated in place | **Event-sourced** — append-only *Events* tab is truth; *Applications* is a derived view |
| **Location** | Local, on your machine | Cloud (Google Drive), shared with Cowork |
| **Integrity** | `merge` / `dedup` / `normalize` / `verify` scripts | Skill rules + drift detection ("rebuild Applications from Events") |
| **Status vocabulary** | Canonical set in `templates/states.yml` (e.g. Evaluada, Aplicado, Entrevista, Descartado, No Aplicar) | English lifecycle: Found → Drafted → Submitted → Acknowledged → Interview → Offer → Rejected → Ghosted → Archived |

**They do not sync automatically.** There is no live connector between the local
markdown tracker and the Google Sheet today. Running both means choosing where the
truth lives:

- **Recommended:** make the **Cowork event-sourced sheet the system of record.**
  It captures the live application loop (submits, emails, interviews) that the CLI
  can't see, and its event log survives mistakes. Treat the career-ops local
  tracker as scratch space for discovery + scoring that you export upward.
- Alternatively, keep them independent: use career-ops purely as a discovery +
  scoring + CV-generation tool and never expect its tracker to reflect what you've
  applied to. The Cowork sheet then tracks everything you actually act on.

### Status vocabulary mapping

When you move a row from career-ops into the Cowork sheet, translate the status:

| career-ops status | quiver-cowork status | Notes |
|-------------------|----------------------|-------|
| (newly scanned) | **Found** | discovery surfaced it; write a Discovery Found event |
| Evaluada / scored | **Found** (with Match Score) | scoring doesn't imply you've applied |
| (CV/cover prepared) | **Drafted** | form filled, awaiting your review |
| Aplicado | **Submitted** | you clicked Submit |
| (ATS confirmation) | **Acknowledged** | from a Gmail sweep |
| Entrevista | **Interview** | invite or calendar event |
| (offer) | **Offer** | |
| Descartado / No Aplicar | **Rejected** or **Archived** | "No Aplicar" (you chose not to) → Archived; explicit no → Rejected |

The canonical career-ops set lives in `templates/states.yml`; the Cowork set lives
in the workbook's data validation and `quiver-cowork/skills/application-tracker/SKILL.md`.

---

## The bridge (steps 4 → 5 of the combined workflow)

The handoff from "career-ops produced a scored shortlist + CV PDFs" to "Cowork
applies and tracks them" is currently a small manual bridge. Two practical ways to
do it:

**Option A — let Cowork read the exported shortlist.** Export your career-ops
shortlist to a small CSV/TSV (company, role, posting URL, match score, CV PDF
path). Put it (and the PDFs) in the Google Drive folder Cowork can see, then:

> Import the rows from `shortlist.csv` into the Applications tab with status
> **Found**, write a **Discovery Found** event for each (source: "career-ops"),
> and attach the matching CV PDF path in Notes. Do not draft applications yet.

**Option B — re-run discovery in Cowork for the same roles.** If a role came from a
board Cowork can also reach, just point Cowork's discovery at the same saved search
so it logs the find natively. Simpler, but duplicates the discovery work.

Either way, once the rows exist in the sheet with status **Found**, the normal
Cowork loop takes over: *Prepare applications* (command #2) fills the forms using
your `job-profile` skill and the career-ops-generated CV PDF, drafts a cover
letter, stops before Submit, and writes Status Changed events.

> **Keep the never-do rules.** The bridge does not relax any guardrail: Cowork
> still never submits, never sends, and never updates `Applications.Status`
> without a corresponding Status Changed event.

---

## Recommended end-to-end workflow

```
  ┌──────────────────────── Cowork (foundation, do first) ───────────────────────┐
  │ 1. profile-audit      → is what I present credible?                           │
  │ 2. look-alike-analysis→ does it match what's credible for THIS role?          │
  │ 3. reality-check      → given profile + target, can this search succeed?      │
  └───────────────────────────────────┬──────────────────────────────────────────┘
                                       │  (fix the foundation before applying)
  ┌────────────────── career-ops (engine room) ──────────────┐
  │ 4. npm run scan        → bulk zero-token ATS discovery     │
  │ 5. batch evaluate      → A–F scores across all finds       │
  │ 6. generate-pdf        → ATS CV PDFs for score ≥ threshold │
  └───────────────────────────┬───────────────────────────────┘
                              │  bridge: export shortlist + PDFs → Drive
                              ▼
  ┌────────────────── quiver-cowork (cockpit) ───────────────────────────────────┐
  │ 7. import shortlist as Found rows + Discovery Found events                    │
  │ 8. Prepare applications  → Chrome form-fill + cover letter, STOP before Submit│
  │ 9. you review tabs, submit; Cowork flips status to Submitted (+ event)        │
  │ 10. daily: email sweep, status updates, referral DM drafts                    │
  │ 11. weekly (Sun): reality-check;  monthly: market-intelligence trends         │
  └───────────────────────────────────────────────────────────────────────────────┘
```

career-ops `analyze-patterns.mjs` and the Cowork Dashboard/market-intelligence
both do outcome analysis — run whichever matches where your data lives.

---

## Known seams & gaps (honest list)

- **No automatic tracker sync.** The local markdown tracker and the Google Sheet
  are bridged manually (above). A connector would be a natural future addition.
- **Two status vocabularies.** Mapping table above; not enforced by tooling across
  the boundary.
- **Duplicate discovery is possible.** If you scan the same board in both engines
  you'll find the same role twice; dedupe on posting URL when importing.
- **Scoring isn't identical.** career-ops' A–F rubric and Cowork's `job-profile`
  match are different methods; don't expect identical numbers. Treat the CLI score
  as the authoritative one and carry it into the sheet's Match Score column.
- **Coaching skills are Cowork-only** and intentionally stretch the "not a career
  coach" line — see the known-compromises table in
  [../quiver-cowork/README.md](../quiver-cowork/README.md). Each is isolated and
  removable.

---

## See also

- [SETUP.md](SETUP.md) — career-ops setup
- [ARCHITECTURE.md](ARCHITECTURE.md) — career-ops (CLI) internals
- [SCRIPTS.md](SCRIPTS.md) — every `npm run` script
- [../quiver-cowork/README.md](../quiver-cowork/README.md) — Cowork setup, daily commands, guardrails
- [../README.md](../README.md) — the project hub
