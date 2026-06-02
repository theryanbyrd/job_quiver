# Quiver on Claude Cowork — Implementation Kit (v0.5)

> **This is Component 2 of [Quiver](../README.md): the Claude Cowork kit.** The
> other component is **career-ops**, the terminal/CLI engine (repo root —
> see [../docs/SETUP.md](../docs/SETUP.md)). For how the two work together —
> shared pipeline, the two trackers and how to bridge them, and the recommended
> end-to-end workflow — read **[../docs/INTEGRATION.md](../docs/INTEGRATION.md)**.


A starter implementation of the Quiver PRD using Claude Cowork as the agent runtime.

- **v0.1** — initial skills, state-table tracker
- **v0.2** — event-sourced tracker, market snapshots, market-intelligence skill
- **v0.3** — `reality-check` skill
- **v0.4** — `profile-audit` skill, "currently unemployed" consulting guidance
- **v0.5** — `look-alike-analysis` skill, anonymized profile-pattern study of the target role

## What's new in v0.5

Added a **look-alike-analysis** skill and a new `Look-Alike Analysis` tab in the workbook.

The skill samples 12-20 LinkedIn profiles of people who currently hold the user's target role, biases the sample toward **recent transitions** (in role 6-24 months) to mitigate survivorship bias, and identifies patterns appearing in 60%+ of the sample — skills, certifications, headline structures, About-section conventions, career paths. Output is a gap analysis: what the user already has, what's missing, prioritized actions.

This is the most privacy-sensitive skill in the kit because it analyzes strangers' profiles. The guardrails are explicit:

- **Anonymized in analysis and output.** No names, no profile URLs, no specific employers tied to subjects. Subjects are referenced as P1, P2, ... in working notes and aggregated to "N of N subjects" in output. The aggregate report should be reproducible by another instance of Claude without identifying the source profiles.
- **Human pace, never bulk.** One profile at a time via Claude in Chrome, realistic dwell time, no parallel tabs. The user's LinkedIn session is the rate limit.
- **Sample size capped at 20.** Bigger doesn't add signal and starts to look like systematic scraping. Smaller than 10 is noise.
- **Demographic patterns are dropped.** If 13 of 15 subjects went to Ivy League schools, that's not reported. If they have specific photo styles, names, or geographic origins in common, not reported. Patterns the user can act on are skills, credentials, framing, and career paths — not demographics.
- **A "Patterns we're NOT reporting" section in every output** tells the user explicitly what was excluded and why. The analysis is incomplete by design.
- **Once per quarter, max.** Repeated runs don't tell the user new things and the privacy cost compounds.

The new workbook tab logs each analysis run with date, target role, sample composition, key findings, and a link to the full report (which is produced as a separate markdown doc in Drive, since the patterns benefit from prose).

A new event type `Look-Alike Analysis` is added to the Events tab data validation.

## What's in here

```
quiver-cowork/
├── README.md                            ← this file
├── Cheat-Sheet.pdf                      ← single-page printable (v0.5, 10 commands)
├── Applications-Tracker-Template.xlsx   ← 7 tabs, event-sourced
├── cheat-sheet.html                     ← source HTML
└── skills/
    ├── job-profile/SKILL.md
    ├── profile-audit/SKILL.md
    ├── look-alike-analysis/SKILL.md     ← NEW
    ├── cover-letter/SKILL.md
    ├── application-tracker/SKILL.md
    ├── market-intelligence/SKILL.md
    ├── form-fill-playbook/SKILL.md
    └── reality-check/SKILL.md
```

## How the eight skills fit together

```
        ┌─ job-profile ──────── canonical source of truth about the user
        │
profile-audit ──────── grades the user's LinkedIn + résumé
look-alike-analysis ── studies what successful people in the target role look like
        │
        │  (the two above feed into each other:
        │   look-alike findings become benchmarks for profile-audit)
        │
discovery (built-in) ─ runs saved searches → writes events + snapshots
        │
        ├─ form-fill-playbook ── ATS quirks for Workday, Greenhouse, etc.
        ├─ cover-letter ──────── per-posting tailored letters
        ├─ application-tracker ─ event-sourced workbook
        ├─ market-intelligence ─ trends over Market Snapshots
        └─ reality-check ─────── weekly contrarian feedback
```

`profile-audit` answers "is your profile broken?" and `look-alike-analysis` answers "what do credible candidates for this role have that you don't?" Together they give the user a clear picture of where the gap is and what to close.

## Setup sequence (60-90 min)

1. **Anthropic account + Pro.** Create at claude.ai. Upgrade with prepaid gift card. Download Claude Desktop. Cowork tab. Enable Computer Use.

2. **Connectors.** Gmail, Google Calendar, Google Drive in Settings → Connectors. Pair Claude in Chrome.

3. **Tracker.** Upload `Applications-Tracker-Template.xlsx` to Drive, open with Sheets. Paste the URL into `application-tracker/SKILL.md`.

4. **Job board logins.** Sign in once in Chrome to LinkedIn, Indeed, ZipRecruiter, Glassdoor, Wellfound, Built In.

5. **Saved Searches.** Edit the 3 seeded examples on that tab. Set Active=Yes.

6. **Cowork project.** Create a project "Job Search." Paste into project instructions:

   > You are running a job search for [name]. Hard rules: never click Submit on any application. Never send any LinkedIn message or email — always leave drafts staged in the compose window. Every meaningful action writes a row to the Events tab. Applications.Status is never updated without writing a Status Changed event. Never recommend fabricating consulting work or any other résumé content — only truthful framing of real work. When running look-alike-analysis, anonymize subjects, operate at human pace, and never store identifying information about them. If you're unsure about a field, leave it blank and flag it. Always read the relevant SKILL.md files at the start of a task.

7. **Install skills.** Drop the eight folders into Cowork's plugins location.

8. **Run profile audit (command #9) first.** Before turning on discovery, check whether the profile is presentable. If it's the weak link, no amount of applications will produce interviews.

9. **Run look-alike analysis (command #10) second.** Once the audit identifies gaps, the look-alike analysis tells you which gaps are common-to-fix vs. unique-to-you. Closing common gaps is higher-leverage than chasing idiosyncratic ones.

10. **Fill the job-profile skill.** Replace every `[NOT SET]` with real data.

11. **First discovery run.** Command #1. Verify rows in Applications, Events, Market Snapshots.

12. **First application batch.** Command #2 with N=1. Watch end-to-end.

13. **Schedule.** Discovery weekday mornings. Reality check Sunday evenings. Profile audit quarterly. Look-alike refresh every 6 months per target role.

## The order matters

The natural temptation is to start with discovery — find jobs, apply to jobs, repeat. But if the profile is weak, every application is a wasted shot. If the target role is wrong, every application is even more wasted.

The right order is:

1. **Profile audit** — is what I'm presenting credible?
2. **Look-alike analysis** — does what I'm presenting match what's credible *for this specific role*?
3. **Reality check** — given my profile + the role, is this a search that can succeed?
4. **Then** turn on discovery and applications.

Steps 1-3 take about 4-6 hours total. Skipping them and going straight to applications is the single most common job-search mistake.

## Known compromises vs. the Quiver PRD

| PRD requirement | What this does | Gap |
|-----------------|----------------|-----|
| Local-first; no data leaves device | Cowork sends tasks to Anthropic's API | Not PRD-compliant. |
| Quiver is not a career coach (§3.3) | reality-check + profile-audit + look-alike-analysis are light career coaching | **Three deliberate scope expansions.** All data-driven, all bounded, all easy to remove. |
| No bulk scraping of job boards / LinkedIn | look-alike-analysis visits 12-20 profiles per analysis at human pace | **Within the PRD's posture** — operates as a fast human, never bulk export, respects rate limits. Worth a deliberate decision. |
| Sandboxed adapter architecture | Skills + project instructions | No isolation. |
| Local LLM for drafts | Claude (cloud) | Better quality, worse privacy. |

The look-alike-analysis skill is the closest the kit comes to crossing the PRD's anti-scraping line. The judgment is: visiting 15-20 public profiles slowly, never storing identifying info, capped at quarterly — is operationally indistinguishable from a careful job seeker doing the same research manually. But it's worth a conscious decision before enabling. If you want a more conservative posture, disable the skill and remove it from the cheat sheet.
